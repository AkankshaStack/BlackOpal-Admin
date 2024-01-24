import { Modal, IconButton } from '@mui/material'
import { Box, CloseCircleOutline } from 'mdi-material-ui'
import { imagePreview } from 'src/common/types'


interface Props {
  open?: imagePreview
  setOpen?: (data: imagePreview) => void
  isOpen?: any
  onClose?: any
}

const closeBtnStyle = {
    float: 'right',
    cursor: 'pointer',
    position: 'absolute',
    top: '3px',
    right: '4px'
  }

const ImageModal = (props: Props) => {
  return (
    <Modal open={props.isOpen} onClose={() => props.onClose()} className='my-image123'>
      <div
        style={{
          width: '100%',
          height: '90%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          objectFit: 'contain',
          padding: '2rem'
        }}
      >
         <Box>
            <IconButton sx={closeBtnStyle} onClick={() => props.onClose()} style={{ color: 'black', background: 'red' }}>
              <CloseCircleOutline />
            </IconButton>
          </Box>
        <div style={{ backgroundColor: 'white', width: '80%', height: '110%' }}>
          <p>sdvdsf</p>
        </div>
      </div>
    </Modal>
  )
}

export default ImageModal
