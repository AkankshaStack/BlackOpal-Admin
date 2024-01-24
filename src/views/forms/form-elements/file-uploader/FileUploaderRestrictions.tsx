// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icons Imports

// ** Third Party Components
import toast from 'react-hot-toast'
import { Accept, useDropzone } from 'react-dropzone'
import { Dialog } from '@mui/material'
import CropEasy from 'src/views/components/crop/CropEasy'

// Styled component for the upload image inside the dropzone area
// const Img = styled('img')(({ theme }) => ({
//   [theme.breakpoints.up('md')]: {
//     marginRight: theme.spacing(10)
//   },
//   [theme.breakpoints.down('md')]: {
//     marginBottom: theme.spacing(4)
//   },
//   [theme.breakpoints.down('sm')]: {
//     width: 250
//   }
// }))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

interface props {
  files: any
  setFiles: (data: any) => void
  accept?: Accept | undefined
  setValue?: any
  text: string
  loading?: boolean
  maxSize?: number
  height?: string
  cropper?: boolean
  maxImageCount?: number
}

const FileUploaderRestrictions = (prop: props) => {
  // ** State
  const [show, setShow] = useState<{ visible: boolean; cropped: boolean; acceptedFiles1: File | null }>({
    visible: false,
    cropped: false,
    acceptedFiles1: null
  })
  const [photoURL, setPhotoURL] = useState('')

  const handleUpload = async (files: File[], propertyFiles: any[]) => {
    prop.setFiles([...files, ...propertyFiles])
    prop.setValue('isImageUploaded', '', { shouldDirty: true })
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 4000000,
    maxFiles: prop?.maxImageCount || undefined,
    disabled: prop?.loading || false,
    multiple: !Boolean(prop?.maxImageCount),
    accept: prop.accept || {
      'image/jpeg': ['.png'],
      'image/jpg': ['.jpg'],
      'image/png': ['.jpeg']
    },
    onDrop: (acceptedFiles: File[]) => {
      const files = prop.files
      const propertyFiles = acceptedFiles.map((file: File) => Object.assign(file))
      if (prop.cropper) {
        setShow({ visible: true, cropped: false, acceptedFiles1: acceptedFiles[0] })
        setPhotoURL(URL.createObjectURL(acceptedFiles[0]))
      } else {
        console.log('FVdfdvdfvfdvfdv', files, propertyFiles)
        handleUpload(files, propertyFiles)
      }
    },
    onDropRejected: () => {
      toast.error('You can only upload files with maximum size of 4 MB.', {
        duration: 2000
      })
    }
  })

  useEffect(() => {
    if (show?.cropped) {
      handleUpload(prop.files, [show.acceptedFiles1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show?.cropped])

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })} style={{ height: prop.height || 'auto' }}>
        <input {...getInputProps()} disabled={prop?.loading || false} />
        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
          {/* <Img width={300} alt='Upload img' src='/images/misc/upload.png' /> */}
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
            <HeadingTypography variant='h6'>Drop files here or click to upload .</HeadingTypography>
            <Typography align='center' color='textSecondary'>{`Allowed  ${
              prop.accept ? `*${Object.values(prop.accept)[0].join(', *')}` : '*.jpeg, *.jpg, *.png'
            }
             Max size of ${prop.maxSize ? prop.maxSize : '4'} MB`}</Typography>
          </Box>
        </Box>
      </div>
      <Dialog
        open={show?.visible}
        onClose={() =>
          setShow({
            visible: false,
            cropped: false,
            acceptedFiles1: null
          })
        }
      >
        <CropEasy
          {...{ photoURL, setPhotoURL }}
          show={show}
          setFile={val =>
            setShow(prev => {
              return { ...prev, acceptedFiles1: val }
            })
          }
          setOpenCrop={val =>
            setShow(prev => {
              return { ...prev, ...val }
            })
          }
        />
      </Dialog>
    </Fragment>
  )
}

export default FileUploaderRestrictions
