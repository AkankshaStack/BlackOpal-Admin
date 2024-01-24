import React, { FC, Fragment, ReactNode, useState } from 'react'
import { Close, Download, Eye, FileDocumentOutline } from 'mdi-material-ui'
import { Box, IconButton, Typography, Tooltip, Grid, SxProps } from '@mui/material'
import ImagePreview from 'src/views/image-perview'
import { imagePreview } from 'src/common/types'
import { toDataURL } from 'src/utilities/conversions'

interface FileProp {
  name: string
  type?: string
  size?: number
  url?: string
  slug?: string
}
interface ICardDocument {
  remove?: (index: number) => void
  file: FileProp
  renderPreview?: (file: FileProp) => ReactNode
  index: number
  viewAction?: (file: FileProp) => void
  downloadAction?: (file: FileProp) => void
  fullWidth?: string
  removeIconSxProps?: SxProps
}
const CardDocument: FC<ICardDocument> = ({
  remove,
  file,
  renderPreview,
  index,
  viewAction,
  downloadAction,
  fullWidth,
  removeIconSxProps
}) => {
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })

  const viewFile = (file: FileProp) => {
    if (file?.type?.includes('pdf') || file?.url?.includes('.pdf') || file?.slug?.includes('.pdf')) {
      const url =
        file?.url || file?.slug
          ? file?.url || `${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.slug}` || ''
          : window?.URL?.createObjectURL(file as any)
      const viewLink = document.createElement('a')
      document.body.appendChild(viewLink)
      viewLink.href = url
      viewLink.target = '_blank'
      viewLink.click()

      return
    }
    setOpen({
      visible: true,
      url:
        file?.url || file?.slug
          ? file?.url || `${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.slug}`
          : URL.createObjectURL(file as any)
    })
  }
  const downloadFile = async (file: FileProp) => {
    if (file?.url || file?.slug) {
      await toDataURL(file?.url || `${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.slug}` || '', (dataUrl: any) => {
        const link = document.createElement('a')
        link.href = dataUrl
        link.setAttribute(
          'download',
          file?.name || file?.slug?.substring(file?.slug?.lastIndexOf('/') + 1, file?.slug?.length) || 'download'
        )
        document.body.appendChild(link)
        link.click()
      })

      return
    }
    const url = window?.URL?.createObjectURL(file as any)
    const downloadLink = document.createElement('a')
    document.body.appendChild(downloadLink)

    downloadLink.href = url
    downloadLink.target = '_self'
    downloadLink.download = file.name
    downloadLink.click()
  }
  const renderFilePreview = (file: FileProp) => {
    if (file?.type?.startsWith('image') || !(file?.name?.includes('.pdf') || file?.slug?.includes('.pdf'))) {
      return (
        <img
          width={38}
          height={38}
          alt={file.name}
          className='upload-image'
          src={
            file?.url || file?.slug
              ? file?.url || `${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.slug}` || ''
              : URL.createObjectURL(file as any)
          }
          onClick={() => {
            viewFile(file)
          }}
        />
      )
    } else {
      return (
        <IconButton sx={{ width: 38, height: 38 }}>
          <FileDocumentOutline />
        </IconButton>
      )
    }
  }

  return (
    <>
      <Grid item xs={12} sm={12}>
        {remove && (
          <Box className='my-image' sx={removeIconSxProps ? removeIconSxProps : { right: '-1.2rem', top: '0.5rem' }}>
            <IconButton onClick={() => remove(index)}>
              <Close style={{ fontSize: '25px' }} />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            pb: 4,
            pt: 4,
            pl: 5,
            mb: 3,
            border: '1px solid rgba(0,0,0,0.1)',
            width: fullWidth ? fullWidth : undefined
          }}
        >
          <Fragment>
            <Box sx={{ maxWidth: '60%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {renderPreview ? renderPreview(file) : renderFilePreview(file)}
                <Tooltip title={file?.name} enterTouchDelay={0}>
                  <Typography sx={{ ml: 4, verticalAlign: 'middle', height: '100%' }} noWrap>
                    {file?.name || file?.slug?.substring(file?.slug?.lastIndexOf('/') + 1, file?.slug?.length)}
                  </Typography>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={{ maxWidth: '40%' }}>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
              >
                <Tooltip title='View Document'>
                  <IconButton onClick={() => (viewAction ? viewAction(file) : viewFile(file))}>
                    <Eye />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Download Document'>
                  <IconButton onClick={() => (downloadAction ? downloadAction(file) : downloadFile(file))}>
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Fragment>
        </Box>
      </Grid>
      <ImagePreview open={open} setOpen={setOpen} />
    </>
  )
}

export default CardDocument
