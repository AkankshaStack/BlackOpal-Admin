import { Box, Button, DialogActions, DialogContent, Slider, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Upload } from 'mdi-material-ui'
import Cropper from 'react-easy-crop'
import getCroppedImg from './utils/cropImage'

const CropEasy = ({
  photoURL,
  setOpenCrop,
  setPhotoURL,
  setFile,
  show
}: {
  photoURL: string
  setOpenCrop: (val: { visible: boolean; cropped: boolean }) => void
  setPhotoURL: (url: string) => void
  setFile: (file12: any) => void
  show: any
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const cropImage = async () => {
    // setLoading(true)
    try {
      const test = await getCroppedImg(photoURL, croppedAreaPixels, 0)
      const file = test?.file || ''
      const url = test?.url || ''
      setPhotoURL(url)
      file.name = show?.acceptedFiles1?.name
      setFile(file)
      setOpenCrop({
        visible: false,
        cropped: true
      })
    } catch (error) {
      return error
    }

    // setLoading(false)
  }

  return (
    <>
      <DialogContent
        dividers
        sx={{
          background: '#333',
          position: 'relative',
          height: 400,
          width: 'auto',
          minWidth: { sm: 500 }
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          aspect={2 / 1}
          onZoomChange={setZoom}
          onCropChange={setCrop}
          onCropComplete={(croppedArea, croppedAreaPixels) => cropComplete(croppedArea, croppedAreaPixels)}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay='auto'
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, zoom) => setZoom(zoom as number)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Button
            variant='outlined'
            color='error'
            onClick={() =>
              setOpenCrop({
                visible: false,
                cropped: false
              })
            }
          >
            Cancel
          </Button>
          <Button variant='contained' startIcon={<Upload />} onClick={cropImage}>
            Upload
          </Button>
        </Box>
      </DialogActions>
    </>
  )
}

export default CropEasy

const zoomPercent = (value: number) => {
  return `${Math.round(value * 100)}%`
}
