/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useAuth } from 'src/hooks/useAuth'
import Camera from 'mdi-material-ui/Camera'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'
import Close from 'mdi-material-ui/Close'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { Avatar, Dialog } from '@mui/material'
import UploadImageService from 'src/services/mediaService'
import { useSelector } from 'react-redux'
import CropEasy from 'src/views/components/crop/CropEasy'

interface FileProp {
  name: string
  type: string
  size: number
}

interface Props {
  maxImage?: number
  buttonText?: string
  type?: string
  config?: any
  name?: string
  setValue?: any
  disabled?: boolean
  accept?: any
  uploadedImage?: string | false
  isTeamMember?: boolean | false
  teamMemberId?: number
  size?: number
  clearImage?: boolean
  collectionForm?: boolean
}

// Styled component for the upload image inside the dropzone area

// Styled component for the heading inside the dropzone area

const UploadProfile = (props: Props) => {
  const auth = useAuth()
  let isTeamMember = false

  const { maxImage, buttonText, type, name, disabled, accept, uploadedImage } = props

  if (props?.isTeamMember) {
    isTeamMember = props?.isTeamMember
  }

  // ** State
  const [files, setFiles] = useState<string>('')

  const [show, setShow] = useState<{ visible: boolean; cropped: boolean; acceptedFiles1: File | null }>({
    visible: false,
    cropped: false,
    acceptedFiles1: null
  })
  const [photoURL, setPhotoURL] = useState('')

  const [loader, setLoader] = useState<boolean>(false)

  if (props?.clearImage) {
    setFiles('')
  }

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: async (acceptedFiles: File[]) => {
      setShow(prev => {
        return { visible: true, cropped: false, acceptedFiles1: acceptedFiles[0] }
      })
      setPhotoURL(URL.createObjectURL(acceptedFiles[0]))
    },
    accept: accept
  })
  const handleUpload = async () => {
    setLoader(true)
    let payload
    if (isTeamMember) {
      payload = {
        file: show?.acceptedFiles1,
        path: `user/${props?.teamMemberId}/${type}`
      }
    } else if (props.collectionForm) {
      payload = {
        file: show?.acceptedFiles1,
        path: `collection`
      }
    } else {
      payload = {
        file: show?.acceptedFiles1,
        path: `${auth?.user?.userDetails?.orgType === 1 ? 'user' : 'company'}/${auth.user.id}/${type}`
      }
    }
    const data: any = await UploadImageService(payload)
    setLoader(false)
    if (name) {
      props.setValue(name, data[1], { shouldValidate: true, shouldDirty: true })
    } else {
      props.setValue(data)
    }
    setFiles(data[0])
    props.setValue('isImageUploaded', 'true', { shouldDirty: true })
  }

  useEffect(() => {
    if (show?.cropped) {
      handleUpload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show?.cropped])

  return (
    <Fragment>
      <div style={{ display: 'block', position: 'relative' }}>
        <Avatar
          alt=''
          src={files || uploadedImage || ''}
          sx={{ height: props?.size ? `${props.size}px` : '120px', width: props?.size ? `${props.size}px` : '120px' }}
        />
        <Avatar
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.12)',
            position: 'absolute',
            bottom: 0,
            left: props?.size ? `${(props.size / 4) * 3}px` : '90px'
          }}
        >
          <IconButton color='primary' aria-label='upload picture' component='label'>
            {loader ? (
              <CircularProgress />
            ) : (
              <React.Fragment>
                <input {...getInputProps()} max={maxImage} />
                <Camera style={{ color: '#757575' }} />
              </React.Fragment>
            )}
          </IconButton>
        </Avatar>
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

export default UploadProfile
