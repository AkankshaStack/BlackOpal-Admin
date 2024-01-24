import { Modal, IconButton } from '@mui/material'
import { Close } from 'mdi-material-ui'
import { useEffect, useRef } from 'react'
import { imagePreview } from 'src/common/types'

interface Props {
  open: imagePreview
  setOpen: (data: imagePreview) => void
}

const ImagePreview = (props: Props) => {
  const ref = useRef<HTMLImageElement>(null)
  const handleCLose = () => {
    props.setOpen({
      visible: false,
      url: ''
    })
  }
  useEffect(() => {
    const checkIfClickedOutside = (event: any) => {
      if (props.open && ref.current && !ref.current.contains(event.target)) {
        handleCLose()
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open])

  return (
    <Modal open={props.open.visible}   className='my-image123'>
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
        <IconButton
          onClick={() => handleCLose()}
          style={{
            position: 'absolute',
            top: 0,
            right: 0
          }}
        >
          <Close style={{ color: 'white' }} />
        </IconButton>

        <img
          src={props.open.url}
          alt='image'
          ref={ref}
          style={{
            objectFit: 'scale-down',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    </Modal>
  )
}
export default ImagePreview
