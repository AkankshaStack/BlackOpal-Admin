import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  Grid,
  FormControl,
  FormHelperText,
  TextField,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  CardHeader,
  Button,
  CircularProgress,
  Box,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material'
import React, { Fragment } from 'react'
import { useEffect } from 'react'
import { LoadingButton } from '@mui/lab'
import { CurrencyInr, Delete, PencilOutline, Plus } from 'mdi-material-ui'
import { propertyProp } from 'src/common/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import { deleteConfiguration, patchPropertyDetails } from 'src/store/apps/property'
import config from 'src/configs/config'
import InputAdornment from '@mui/material/InputAdornment'
import toast from 'react-hot-toast'
import { ruppeeConversation } from 'src/utilities/conversions'
import FileUploaderRestrictions from 'src/views/forms/form-elements/file-uploader/FileUploaderRestrictions'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import UploadMultipleImageService from 'src/services/uploadMultipleImages'
import CardDocument from 'src/views/ui/cards/document/CardDocument'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'
import ShowPropertyType from 'src/pages/components/showPropertyType'
import RenderFeatures from 'src/views/components/plan-feature/PlanFeature'

interface FormInputs1 {
  id?: number
  configuration: number | string
  carpetAreaInSqft: number | undefined | string | null
  sellableAreaInSqft: number | undefined | string
  noOfBathrooms: number | undefined | string | null
  priceInPaise: number | undefined | string
  leadCostInPaise: number | undefined | string
  floorPlanSlug: image
  isPriceDependsOnSellableArea: boolean
  hasStudyRoom: boolean
  hasServantRoom: boolean
  propertyTypeId: number | undefined
}
interface image {
  slug: string
  url: string
  name: string
}

interface FileProp {
  name: string
  type?: string
  size?: number
  url?: string
  slug?: string
}

interface FileProp {
  name: string
  type?: string
  size?: number
  url?: string
  slug?: string
}

const Configuration = (prop: propertyProp) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.property)
  const [files, setFiles] = React.useState<FileProp[]>([])
  const [data, setData] = React.useState<any>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loader, setLoader] = React.useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reset1, setReset1] = React.useState<number>(0)
  const [showForm, setShowForm] = React.useState<{
    visible: boolean
    edit: string
  }>({
    visible: false,
    edit: ''
  })
  const [confirm, setConfirm1] = React.useState<string>('')

  useEffect(() => {
    if (store?.data?.propertyInventory?.length > 0) {
      setData(store?.data?.propertyInventory)
      if (showForm?.visible) {
        setShowForm({
          visible: false,
          edit: ''
        })
      }
    } else {
      setShowForm({
        visible: true,
        edit: ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.data])

  const detailsSchema = yup.object().shape(
    {
      configuration: yup
        .number()
        .moreThan(0, 'Please enter configuration')
        .typeError('Please select configuration')
        .required('Please enter configuration'),
      carpetAreaInSqft: yup.number().when('carpetAreaInSqft', (value: number) => {
        if (value) {
          return yup
            .number()
            .typeError('Crapet area should be number')
            .lessThan(yup.ref('sellableAreaInSqft'), 'Crapet area should be less than saleable carpet area')
            .required()
        } else {
          return yup.number().nullable(true)
        }
      }),
      sellableAreaInSqft: yup
        .number()
        .min(yup.ref('carpetAreaInSqft') || 0, 'Saleable area should be greater than carpet area')
        .max(1000000000000, 'Please enter saleable area  between 1 to 1000000000000')
        .typeError('Saleable area price must be a number')
        .required('Please select saleable area'),
      isPriceDependsOnSellableArea: yup.boolean().notRequired(),
      hasStudyRoom: yup.boolean().notRequired(),
      hasServantRoom: yup.boolean().notRequired(),
      noOfBathrooms: yup
        .number()
        .min(1, 'No Of bathroom should be greater than 0')
        .max(100, 'Please enter no Of bathroom between 1 to 100')
        .typeError('Please enter no Of bathroom')
        .nullable(true),
      priceInPaise: yup
        .number()
        .min(0, 'Price should be greater than 0')
        .max(10000000000, 'Price must be less than 100 cr')
        .optional()
        .notRequired()
        .typeError('Price must be a number')
        .nullable(true),
      leadCostInPaise: yup
        .number()
        .min(0, 'Lead cost should be greater than 0')
        .max(1000000, 'Lead cost must be less than 1000000')
        .typeError('Lead cost must be a number')
        .required('Please enter lead cost'),
      propertyTypeId: yup.number().moreThan(0, 'Please select property type').required('Please select property type')
    },
    [['carpetAreaInSqft', 'carpetAreaInSqft']]
  )

  const defaultValues = {
    configuration: 0,
    carpetAreaInSqft: null,
    sellableAreaInSqft: '',
    noOfBathrooms: null,
    isPriceDependsOnSellableArea: false,
    priceInPaise: 0,
    leadCostInPaise: '',
    hasStudyRoom: false,
    hasServantRoom: false
  }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isValid }
  } = useForm<FormInputs1>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(detailsSchema)
  })
  const onSubmit = async (val: any) => {
    const leftOut: string[] = []
    const upload: FileProp[] = []
    let images: any[] = []

    files?.filter(i => {
      if (i?.url) {
        leftOut.push(i?.slug || '')
      } else {
        upload.push(i)
      }
    })

    setLoader(true)
    if (upload?.length > 0) {
      const imagePayload: any = {
        files: upload,
        path: 'property/images'
      }
      images = (await UploadMultipleImageService(imagePayload, setLoader)) || []
    }
    val.priceInPaise = (val.priceInPaise || 0) * 100
    val.leadCostInPaise = val.leadCostInPaise * 100
    val.floorPlanSlugs = [...images, ...leftOut]
    onSave(val)
  }

  const onSave = async (val1 = data, action = 'add') => {
    let data1 = []
    if (action === 'add') {
      if (showForm?.edit?.length > 0) {
        const temarr = data.filter((val: any) => val?.id !== Number(showForm?.edit))
        val1 = [val1, ...temarr]
      } else {
        val1 = [...data, val1]
      }

      data1 = val1.map((val: any) => {
        if (val?.floorPlanSlugs?.url) {
          return {
            ...val,
            floorPlanSlugs: val?.floorPlanSlugs?.slug,
            noOfBathrooms: val?.noOfBathrooms || null
          }
        } else {
          return { ...val, noOfBathrooms: val?.noOfBathrooms || null }
        }
      })
    } else {
      data1 = val1
    }
    const payload = {
      step: 'inventory',
      configurations: data1
    }

    // {
    //   step: 'inventory',
    //   configurations: data
    // }

    dispatch(
      patchPropertyDetails({
        id: prop?.id,
        params: payload
      })
    ).then(() => {
      if (showForm?.edit?.length > 0) {
        setShowForm({
          visible: false,
          edit: ''
        })
      }
      if (files?.length > 0) {
        setFiles([])
      }
      setReset1(0)
      reset(defaultValues)
      setLoader(false)
    })
  }

  const remove = () => {
    if (data?.length === 1) {
      toast.error('Configurations should not be empty')
      setConfirm1('')

      return
    }
    setConfirm1('')
    dispatch(
      deleteConfiguration({
        id: confirm,
        propertyId: prop?.id
      })
    ).then(() => {
      setReset1(0)
      reset(defaultValues)
    })

    // const arr = data.filter((val: FormInputs1, currIndex: number) => currIndex !== Number(confirm))

    // onSave(arr, 'remove')
  }
  const handleRemoveImage = (position: number) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp, index: number) => index !== position)
    setFiles([...filtered])
  }

  return (
    <div style={{ paddingRight: '20px', paddingLeft: '20px' }}>
      {store?.loading ? (
        <Box sx={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <React.Fragment>
          <LoadingButton
            variant='contained'
            style={{ float: 'right', marginBottom: '30px' }}
            startIcon={<Plus />}
            disabled={showForm?.visible && showForm?.edit?.length > 0}
            onClick={() => {
              if (showForm?.visible) {
                if (isValid) {
                  toast.error('Please save Configuration')
                } else {
                  trigger()
                  toast.error('Please fill Configuration Details')
                }
              } else {
                setShowForm({
                  visible: true,
                  edit: ''
                })
              }
            }}
          >
            Add Configuration
          </LoadingButton>
          {showForm?.visible && (
            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }} noValidate>
              <Grid
                container
                spacing={6}
                sx={{ border: '1px solid rgba(76, 78, 100, 0.12)', borderRadius: '10px', pr: '1.5rem', pb: 6 }}
              >
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label' required error={Boolean(errors.configuration)}>
                      Configuration
                    </InputLabel>
                    <Controller
                      name='configuration'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label='Configuration'
                          placeholder='Configuration'
                          error={Boolean(errors.configuration)}
                          labelId='demo-simple-select-label'
                          aria-describedby='validation-basic-select'
                        >
                          {Object.entries(config?.properties?.configurations)?.map(([key, value], index) => {
                            return (
                              <MenuItem key={index} value={String(key)}>
                                {String(value)}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      )}
                    />
                    {errors.configuration && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {errors.configuration.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='sellableAreaInSqft'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type='number'
                          onChange={e => {
                            if (
                              (e.target.value[0] === '0' &&
                                e.target.value?.length === 2 &&
                                !e.target.value.includes('.')) ||
                              e.target.value.split('.')[1]?.length > 2
                            ) {
                              return
                            }
                            field.onChange(e)
                            if (getValues().carpetAreaInSqft) {
                              if (
                                Number(e.target.value) === Number(getValues().carpetAreaInSqft) ||
                                Number(e.target.value) > Number(getValues().carpetAreaInSqft)
                              ) {
                                trigger('carpetAreaInSqft')

                                return
                              }
                            }
                          }}
                          InputProps={{
                            inputProps: { min: 1, max: 100000000 }
                          }}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.sellableAreaInSqft)}
                          label='Saleable area in sqft'
                        />
                      )}
                    />
                    {errors.sellableAreaInSqft && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {errors.sellableAreaInSqft.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='carpetAreaInSqft'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type='number'
                          onChange={e => {
                            if (
                              (e.target.value[0] === '0' &&
                                e.target.value?.length === 2 &&
                                !e.target.value.includes('.')) ||
                              e.target.value.split('.')[1]?.length > 2
                            ) {
                              return
                            }
                            if (e?.target?.value?.length) {
                              field.onChange(e)
                            } else {
                              field.onChange(null)
                            }
                            if (e.target.value?.length) {
                              if (getValues().sellableAreaInSqft) {
                                if (Number(e.target.value) < Number(getValues().sellableAreaInSqft)) {
                                  if (Number(e.target.value) < Number(getValues().sellableAreaInSqft)) {
                                    trigger('sellableAreaInSqft')
                                  }

                                  if (Number(e.target.value) < Number(getValues().sellableAreaInSqft)) {
                                    trigger('carpetAreaInSqft')
                                  }
                                }
                              }
                            }
                          }}
                          InputProps={{
                            inputProps: { min: 0, max: 100000000 }
                          }}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.carpetAreaInSqft)}
                          label='Carpet area in sqft'
                        />
                      )}
                    />
                    {errors.carpetAreaInSqft && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {errors.carpetAreaInSqft.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label' required error={Boolean(errors.propertyTypeId)}>
                      Property type
                    </InputLabel>
                    <Controller
                      name='propertyTypeId'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value || ''}
                          defaultValue=''
                          label='Property type'
                          placeholder='Property type'
                          onChange={e => {
                            onChange(e)
                          }}
                          error={Boolean(errors.propertyTypeId)}
                          labelId='demo-simple-select-label'
                          aria-describedby='validation-basic-select'
                        >
                          {Object.entries(config?.properties?.propertyType)?.map(([key, value], index) => {
                            return (
                              <MenuItem key={index} value={String(key)}>
                                <IconButton>
                                  <ShowPropertyType id={Number(key)} />
                                </IconButton>
                                {String(value)}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      )}
                    />
                    {errors.propertyTypeId && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {errors?.propertyTypeId?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='priceInPaise'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type='number'
                          onChange={e => {
                            if (
                              (e.target.value[0] === '0' &&
                                e.target.value.length === 2 &&
                                !e.target.value.includes('.')) ||
                              e.target.value.split('.')[1]?.length > 2
                            ) {
                              return
                            }
                            if (e?.target?.value?.length) {
                              field.onChange(e)
                            } else {
                              field.onChange(null)
                            }
                          }}
                          InputProps={{
                            inputProps: { min: 1, max: 100 },
                            startAdornment: (
                              <InputAdornment position='start'>
                                <CurrencyInr />
                              </InputAdornment>
                            )
                          }}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.priceInPaise)}
                          label='Price'
                        />
                      )}
                    />
                    {errors.priceInPaise && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {errors.priceInPaise.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='leadCostInPaise'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type='number'
                          onChange={e => {
                            if (
                              e.target.value[0] === '0' &&
                              e.target.value.length === 2 &&
                              !e.target.value.includes('.')
                            ) {
                              return
                            }
                            field.onChange(e)
                          }}
                          InputProps={{
                            inputProps: { min: 1, max: 100 },
                            startAdornment: (
                              <InputAdornment position='start'>
                                <CurrencyInr />
                              </InputAdornment>
                            )
                          }}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.leadCostInPaise)}
                          label='Lead cost'
                        />
                      )}
                    />
                    {errors.leadCostInPaise && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {errors.leadCostInPaise.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='noOfBathrooms'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          onChange={e => {
                            if (
                              (e.target.value[0] === '0' &&
                                e.target.value.length === 2 &&
                                !e.target.value.includes('.')) ||
                              e.target.value.split('.')[1]?.length > 2
                            ) {
                              return
                            }
                            if (!e.target.value.length) {
                              field.onChange(null)

                              return
                            }
                            field.onChange(e)
                          }}
                          type='number'
                          InputProps={{ inputProps: { min: 1, max: 100 } }}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.noOfBathrooms)}
                          label='No of bathroom'
                        />
                      )}
                    />
                    {errors.noOfBathrooms && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                        {errors.noOfBathrooms.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid container item xs={12} sm={12}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <Controller
                        name='isPriceDependsOnSellableArea'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            value={value}
                            onChange={onChange}
                            control={
                              <Checkbox checked={value} defaultChecked={defaultValues.isPriceDependsOnSellableArea} />
                            }
                            label={`Price depends on carpet area? `}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <Controller
                        name='hasServantRoom'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            value={value}
                            onChange={onChange}
                            control={<Checkbox checked={value} defaultChecked={defaultValues.hasServantRoom} />}
                            label='Servant room available'
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <Controller
                        name='hasStudyRoom'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            value={value}
                            onChange={onChange}
                            control={<Checkbox checked={value} defaultChecked={defaultValues.hasStudyRoom} />}
                            label='Study room available'
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <DropzoneWrapper>
                      <FileUploaderRestrictions
                        files={files}
                        setValue={setValue}
                        loading={store?.loading || loader}
                        setFiles={setFiles}
                        text={'Allowed *.jpeg, *.jpg, *.png,'}
                      />
                    </DropzoneWrapper>
                  </Grid>
                  <Grid container item xs={12} sm={12} spacing={6}>
                    {files?.length > 0 &&
                      files.map((file: FileProp, index: number) => (
                        <CardDocument key={index} remove={handleRemoveImage} index={index} file={file} />
                      ))}
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton
                      sx={{ m: 3 }}
                      size='large'
                      variant='contained'
                      type='submit'
                      disabled={!isValid || files.length === 0}
                      loading={store?.loading || loader}
                    >
                      Save
                    </LoadingButton>
                    {data?.length > 0 && (
                      <Button
                        sx={{ m: 3 }}
                        size='large'
                        variant='contained'
                        onClick={() => {
                          if (files?.length > 0) {
                            setFiles([])
                          }
                          reset(defaultValues)
                          setShowForm({
                            visible: false,
                            edit: ''
                          })
                          if (files?.length > 0) {
                            setFiles([])
                          }
                          reset(defaultValues)
                          setShowForm({
                            visible: false,
                            edit: ''
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </form>
          )}
          {data?.length > 0 ? (
            <Grid container spacing={6} style={{ marginTop: '20px' }}>
              {data.map((val: any, index: number) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
                  <Card style={{ width: '100%', boxShadow: 'none', marginBottom: '20px' }} variant='outlined'>
                    <CardHeader
                      title={
                        <Tooltip
                          title={`${val?.refId || ''} | ${config?.properties?.configurations[val?.configuration]}`}
                        >
                          <Typography noWrap variant='inherit' style={{ width: '80%' }}>{`${val?.refId || ''} | ${
                            config?.properties?.configurations[val?.configuration]
                          }`}</Typography>
                        </Tooltip>
                      }
                      style={{ paddingBottom: 0, flexWrap: 'wrap' }}
                      action={
                        <>
                          <Tooltip title='Edit configuration'>
                            <IconButton
                              onClick={() => {
                                reset({
                                  ...val,
                                  priceInPaise: (val?.priceInPaise || 0) / 100,
                                  leadCostInPaise: val?.leadCostInPaise / 100
                                })
                                const check: FileProp[] = []
                                val?.floorPlanSlugs.map((val: string) => {
                                  check.push({
                                    name: val.substring(val.lastIndexOf('/') + 1, val.length),
                                    slug: val,
                                    url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${val}`
                                  })
                                })
                                setFiles(check)
                                setShowForm({
                                  visible: true,
                                  edit: String(val?.id)
                                })
                              }}
                              disabled={showForm?.edit?.length > 0}
                            >
                              <PencilOutline />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete configuration'>
                            <IconButton
                              color='error'
                              disabled={val?.id === Number(showForm?.edit)}
                              onClick={() => {
                                setConfirm1(String(val?.id))
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </>
                      }
                    />
                    <CardContent style={{ position: 'relative' }}>
                      <Grid item>
                        <p>Carpet area: {val?.carpetAreaInSqft || 'Not available'}</p>
                      </Grid>
                      <Grid item>
                        <p>Saleable area: {val?.sellableAreaInSqft}</p>
                      </Grid>

                      <Grid item>
                        <p>
                          Property type:
                          <span style={{ marginLeft: '5px' }}>
                            {val?.propertyTypeId ? `${config?.properties?.propertyType[val?.propertyTypeId]}` : '-'}
                          </span>
                        </p>
                      </Grid>
                      <Grid item>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                          Lead cost:
                          <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                          {ruppeeConversation(val?.leadCostInPaise || 0)}{' '}
                        </p>
                      </Grid>
                      <Grid item>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                          Price:
                          {val?.priceInPaise || val?.priceInPaise !== 0 ? (
                            <Fragment>
                              {' '}
                              <CurrencyInr sx={{ fontSize: '1.1rem' }} /> {ruppeeConversation(val?.priceInPaise) || 0}
                            </Fragment>
                          ) : (
                            'Price on request'
                          )}
                        </p>
                      </Grid>
                      <Grid item>
                        <p>{`Price depends upon: ${
                          !val?.isPriceDependsOnSellableArea ? 'Saleable area' : 'Carpet area'
                        }`}</p>
                      </Grid>
                      <Grid item>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                          Price per sqft: <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                          {!val?.isPriceDependsOnSellableArea
                            ? ruppeeConversation(val?.priceInPaise / val?.sellableAreaInSqft)
                            : ruppeeConversation(val?.priceInPaise / val?.carpetAreaInSqft)}
                        </p>
                      </Grid>
                      {val?.noOfBathrooms ? (
                        <Grid item>
                          <p>No of bathroom: {val?.noOfBathrooms}</p>
                        </Grid>
                      ) : null}

                      <Grid item>
                        <p>Servant room: {val?.hasServantRoom ? 'Yes' : 'No'}</p>
                      </Grid>
                      <Grid item>
                        <p>Study room: {val?.hasStudyRoom ? 'Yes' : 'No'}</p>
                      </Grid>
                      <Grid item xs={12}>
                        <RenderFeatures data={[]} collapseHeight={180} heightAuto>
                          {val?.floorPlanSlugs?.length > 0 &&
                            val?.floorPlanSlugs?.map((val: string, index: number) => (
                              <CardDocument
                                key={index}
                                index={index}
                                file={{
                                  name: val.substring(val.lastIndexOf('/') + 1, val.length),
                                  url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${val}`
                                }}
                              />
                            ))}
                        </RenderFeatures>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : null}
        </React.Fragment>
      )}

      <CustomDialog
        title='Are you sure, you want to remove configuration?'
        show={Boolean(confirm)}
        setShow={() => {
          setConfirm1('')
        }}
        buttonprop={{
          onClick: () => {
            remove()
          }
        }}
      />
    </div>
  )
}

export default Configuration
