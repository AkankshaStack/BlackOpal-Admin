// ** React Imports
import { Fragment, useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Typography from '@mui/material/Typography'
import { LoadingButton } from '@mui/lab'

// ** Icons Imports

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { Close, Download, Eye, Upload } from 'mdi-material-ui'
import { FormHelperText, IconButton, List, ListItem, Tooltip } from '@mui/material'
import UploadMultipleImageService from 'src/services/uploadMultipleImages'
import CircularProgress from '@mui/material/CircularProgress'
import { download } from 'src/utilities/conversions'

interface accept1 {
  [key: string]: string[]
}

interface Props {
  maxImage?: number
  buttonText?: string
  type?: string
  config?: any
  name?: string
  value?: any
  setValue?: any
  disabled?: boolean
  accept: accept1
  reset?: number | boolean
  imageChange?: boolean
  path?: string
  setImageChange?: (val: any) => void
}
interface image {
  slug: string
  url: string
  name: string
}

// Styled component for the upload image inside the dropzone area

// Styled component for the heading inside the dropzone area

const UploadCertificate = (props: Props) => {
  const { maxImage, buttonText, name, accept, value, reset, imageChange, setImageChange, path } = props

  // ** State
  const [files, setFiles] = useState<image[]>([])
  const [loader, setLoader] = useState<boolean>(false)
  useEffect(() => {
    if (reset) {
      setFiles([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

  useEffect(() => {
    if (typeof value === 'string') {
      if (value?.length > 0) {
        setFiles([
          {
            slug: value,
            url: process.env.NEXT_PUBLIC_IMAGE_URL + value,
            name: ''
          }
        ])
      }
    } else {
      if (value?.slug?.length > 0) {
        setFiles([
          {
            slug: value?.slug,
            url: process.env.NEXT_PUBLIC_IMAGE_URL + value?.slug,
            name: value?.name
          }
        ])
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      setLoader(true)
      if (!imageChange) {
        if (setImageChange) {
          setImageChange(true)
        }
      }
      const payload = {
        files: acceptedFiles,
        path: path ? path : 'property/images',
        url: true,
        single: true
      }

      // if (!accept.includes(acceptedFiles?.type)) {
      //   toast.error('Please ')
      // }
      const data: any = await UploadMultipleImageService(payload)

      if (name) {
        props.setValue(
          name,
          {
            slug: data[1],
            url: data[0],
            name: acceptedFiles[0].name
          },
          {
            shouldValidate: true,
            shouldDirty: true
          }
        )
      } else {
        props.setValue(data[1])
      }
      setFiles([
        {
          slug: data[1],
          url: data[0],
          name: acceptedFiles[0].name
        }
      ])
      setLoader(false)
    },
    multiple: false,
    accept: accept,
    disabled: files.length === maxImage
  })

  const handleLinkClick = (event: SyntheticEvent) => {
    event.preventDefault()
  }
  const handleRemoveFile = (file: image) => {
    if (!imageChange) {
      if (setImageChange) {
        setImageChange(true)
      }
    }
    const uploadedFiles = files
    const filtered = uploadedFiles?.filter((i: any) => i.name !== file.name)
    if (name) {
      props.setValue(
        name,
        {
          slug: '',
          url: '',
          name: ''
        },
        {
          shouldValidate: true,
          shouldDirty: true
        }
      )
    } else {
      props.setValue('')
    }
    setFiles([...filtered])
  }
  const fileList = files.map((file: image) => (
    <ListItem
      key={file.name}
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div className='file-details' style={{ width: '50%' }}>
        <Tooltip title={file.name || buttonText || ''}>
          <Typography className='file-name' noWrap>
            {file.name || buttonText || ''}
          </Typography>
        </Tooltip>
      </div>
      <div style={{ float: 'right' }}>
        <Tooltip title={Object.values(accept)[0].includes('.csv') ? 'Download file' : 'View file'}>
          <IconButton
            onClick={() => {
              if (Object.values(accept)[0].includes('.csv')) {
                download(file.url, file.name || 'bulk-upload')
              } else {
                window.open(file.url)
              }
            }}
          >
            {Object.values(accept)[0].includes('.csv') ? <Download fontSize='small' /> : <Eye fontSize='small' />}
          </IconButton>
        </Tooltip>
        <Tooltip title='Remove File'>
          <IconButton onClick={() => handleRemoveFile(file)}>
            <Close fontSize='small' />
          </IconButton>
        </Tooltip>
      </div>
    </ListItem>
  ))

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })} style={{ marginTop: '15px' }}>
        {files.length > 0 ? (
          <List
            style={{
              border: '1px solid lightgrey',
              color: 'grey',
              display: 'flex',
              justifyContent: 'space-between',
              padding: 0,
              borderRadius: '8px',
              minHeight: '56px'
            }}
          >
            {fileList}
          </List>
        ) : (
          <>
            <input {...getInputProps()} max={maxImage} />
            <LoadingButton
              style={{
                width: '100%',
                border: '1px solid lightgrey',
                display: 'flex',
                justifyContent: 'space-between',
                minHeight: '56px',
                textTransform: 'none',
                color: 'lightgray'
              }}
              variant='outlined'
              onClick={handleLinkClick}
              disabled={files.length === maxImage}
              endIcon={
                loader ? (
                  <CircularProgress color='inherit' thickness={2} size={18} />
                ) : (
                  <Upload style={{ color: 'grey' }} />
                )
              }
            >
              <span style={{ textAlign: 'left' }}>
                {buttonText}
                <FormHelperText
                  style={{ color: 'inherit', fontWeight: '500', padding: 0, margin: 0 }}
                >{`allowed Fromat ${Object?.values(accept)[0].join(' ') || ''}`}</FormHelperText>
              </span>
            </LoadingButton>
          </>
        )}
      </div>
    </Fragment>
  )
}

export default UploadCertificate
