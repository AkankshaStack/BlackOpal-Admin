import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import { ContentState, EditorState, convertFromHTML } from 'draft-js'
import { convertToHTML } from 'draft-convert'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import React, { FC, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import config from 'src/configs/config'
import { useRouter } from 'next/router'
import { createBuyingGuide, getSingleBuyingGuide, resetGuideData, updateBuyingGuide } from 'src/store/buying-guide'
import { ERoutes } from 'src/common/routes'
import toast from 'react-hot-toast'
import FileUploaderRestrictions from 'src/views/forms/form-elements/file-uploader/FileUploaderRestrictions'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import RichTextEditor from 'src/pages/components/RichTextEditor'
import { TrashCan } from 'mdi-material-ui'

import Image from 'next/image'
import ImagePreview from 'src/views/image-perview'
import { imagePreview } from 'src/common/types'
import UploadMultipleImageService from 'src/services/uploadMultipleImages'

interface IFormCollection {
  title: string
  subtitle: string
  videoLink: string
  status: string
  body: any
}
interface ICollectionForm {
  isEditable?: boolean
}
interface FileProp {
  name: string
  type?: string
  size?: number
  url?: string
}

const BuyingGuideForm: FC<ICollectionForm> = ({ isEditable = false }) => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [loader, setLoader] = useState<boolean>(false)

  const [files, setFiles] = useState<FileProp[]>([])

  const store = useSelector((state: RootState) => state.buyingGuide)

  useEffect(() => {
    if (router?.query?.id) {
      dispatch(
        getSingleBuyingGuide({
          id: Number(router?.query?.id as string)
        })
      )
    }

    return () => {
      dispatch(resetGuideData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const schema = yup.object().shape({
    title: yup.string().strict(false).trim().required('Please enter title').min(5).max(250),
    subtitle: yup.string().strict(false).trim().required('Please enter subtitle').min(5).max(250),
    status: yup.string().required('Please select status'),
    body: yup
      .object()
      .test('has text', 'description must be at least 20 characters', value => {
        // @ts-ignore
        const retrivedData: any = convertToHTML(value.getCurrentContent())
        const check: any = String(retrivedData).replace(/<[^>]*>/g, '')
        const defaultValue = convertToHTML(defaultValues.body.getCurrentContent())
        const defaultStringValue = String(defaultValue).replace(/<[^>]*>/g, '')

        // @ts-ignore
        if (defaultStringValue === check) {
          return true
        }
        if (check?.length < 20) {
          return false
        }

        return true
      })
      .required('This field is required.')
      .strict(false),
    videoLink: yup
      .string()
      .strict(false)
      .trim()
      .matches(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        'Please enter valid url'
      )
      .required('Please enter video url')
      .min(10)
      .max(250)
  })
  const defaultValues = {
    subtitle: store?.buyingGuideData?.subtitle ? store?.buyingGuideData?.subtitle : '',
    title: store?.buyingGuideData?.title ? store?.buyingGuideData?.title : '',
    videoLink: store?.buyingGuideData?.videoLink ? store?.buyingGuideData?.videoLink : '',
    status: store?.buyingGuideData?.status ? String(store?.buyingGuideData?.status) : '1',
    body: store?.buyingGuideData?.body
      ? EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(store?.buyingGuideData?.body).contentBlocks,
            convertFromHTML(store?.buyingGuideData?.body).entityMap
          )
        )
      : EditorState.createEmpty()
  }
  const renderFilePreview: any = (file: FileProp | any) => {
    if (file?.type?.startsWith('image')) {
      return (
        <Image
          alt={file?.name}
          className='upload-image'
          src={URL.createObjectURL(file as any)}
          layout='fill'
          objectFit='contain'
          onClick={() =>
            setOpen({
              visible: true,
              url: URL.createObjectURL(file as any)
            })
          }
        />
      )
    } else if (typeof file === 'string' && file?.includes('images')) {
      return (
        <Image
          alt=''
          className='upload-image'
          src={process.env.NEXT_PUBLIC_IMAGE_URL + file}
          layout='fill'
          objectFit='contain'
          onClick={() =>
            setOpen({
              visible: true,
              url: process.env.NEXT_PUBLIC_IMAGE_URL + file
            })
          }
        />
      )
    }
  }
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty }
  } = useForm<IFormCollection>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (store?.buyingGuideData?.id) {
      reset(defaultValues)
      setFiles([store?.buyingGuideData?.imageSlug])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.buyingGuideData])

  const onSubmit = async (data: IFormCollection) => {
    // if (isEditable) payload.status = collectionStatus
    if (files?.length === 0) {
      toast.error('Please uplaod image')

      return
    }

    const leftOut =
      files?.filter(i => {
        if (typeof i === 'string') {
          return i
        }
      }) || []

    const upload = files?.filter(i => {
      if (typeof i !== 'string') {
        return i
      }
    })

    const imagePayload: any = {
      files: upload,
      path: 'property/images'
    }

    setLoader(true)
    let images: any
    if (upload?.length > 0) {
      images = await UploadMultipleImageService(imagePayload, setLoader)
    }

    if (!isEditable) {
      dispatch(
        createBuyingGuide({
          ...data,
          body: convertToHTML(data?.body?.getCurrentContent()),
          imageSlug: leftOut?.length > 0 ? leftOut[0] : images[0],
          status: Number(data?.status)
        })
      ).then((res: any) => {
        if (res?.payload?.code === 200) {
          router.push(ERoutes.BUYING_GUIDE)
          toast.success('Buying guide added successfully')
        }
      })
    } else {
      dispatch(
        updateBuyingGuide({
          data: {
            ...data,
            body: convertToHTML(data?.body?.getCurrentContent()),
            imageSlug: leftOut?.length > 0 ? leftOut[0] : images[0],
            status: Number(data?.status)
          },
          id: Number(router.query.id as string)
        })
      ).then((res: any) => {
        if (res?.payload?.status === 204) {
          setLoader(false)
          router.push(ERoutes.BUYING_GUIDE)
          toast.success('Buying guide Updated Successfully')
        } else {
          setLoader(false)
        }
      })
    }
  }

  return (
    <EditorWrapper>
      {store?.loading ? (
        <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={6}>
            {/* Need to repalce it with the other one. */}
            <Grid item xs={12} sm={12}>
              {files?.length === 0 && (
                <DropzoneWrapper>
                  <FileUploaderRestrictions
                    files={files}
                    height='300px'
                    setValue={setValue}
                    setFiles={setFiles}
                    cropper
                    maxImageCount={1}
                    loading={store?.loading || loader}
                    text={'Allowed *.jpeg, *.jpg, *.png'}
                  />
                </DropzoneWrapper>
              )}

              {files?.length > 0 &&
                files.map((file: FileProp, index: number) => (
                  <div
                    key={index}
                    style={{
                      width: '100%',
                      height: '300px',

                      position: 'relative'
                    }}
                  >
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: '1rem',
                        top: '0.5rem',
                        zIndex: 20,
                        background: 'white',
                        '&:hover': {
                          background: 'grey'
                        }
                      }}
                      onClick={() => {
                        setFiles([])
                      }}
                    >
                      <TrashCan style={{ fontSize: '25px' }} color='error' />
                    </IconButton>
                    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#D3D3D3' }}>
                      {renderFilePreview(file)}
                    </div>
                  </div>
                ))}
            </Grid>
            {/* Need to see for this */}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      error={Boolean(errors.title)}
                      label='Title'
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
                {errors.title && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='subtitle'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      error={Boolean(errors.subtitle)}
                      label='Subtitle'
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
                {errors.subtitle && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors.subtitle.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='body'
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <RichTextEditor
                        value={value}
                        setValue={data1 => {
                          const e = {
                            target: {
                              value: data1
                            }
                          }
                          onChange(e)
                        }}
                      />
                    )
                  }}
                />
                {errors.body && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors.body.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='videoLink'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      error={Boolean(errors.videoLink)}
                      label='Video link'
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
                {errors.videoLink && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors.videoLink.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Status of Buying Guide</InputLabel>
                <Controller
                  name='status'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Status of Buying Guide'
                      labelId='validation-basic-select'
                      aria-describedby='validation-basic-select'
                    >
                      {Object.entries(config?.collectionStatus)?.map(([key1, value]) => (
                        <MenuItem key={key1} value={key1}>
                          {String(value)}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.status && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    {errors?.status?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <LoadingButton
            loading={store?.loading || loader}
            variant='contained'
            style={{ float: 'right', marginRight: '20px', marginTop: '20px' }}
            type='submit'
            disabled={
              !(isValid && isDirty) ||
              String(convertToHTML(getValues().body.getCurrentContent())).replace(/<[^>]*>/g, '').length < 20
            }
          >
            {router?.query?.id ? 'Update' : 'Submit'}
          </LoadingButton>
        </form>
      )}
      <ImagePreview open={open} setOpen={setOpen} />
    </EditorWrapper>
  )
}

export default BuyingGuideForm
