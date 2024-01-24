import { Button, Dialog, DialogActions, IconButton, Theme } from '@mui/material'
import { Close } from 'mdi-material-ui'
import React, { ReactNode } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LoadingButton, LoadingButtonProps } from '@mui/lab'

interface IDialogue {
  show: boolean
  title: string
  buttonprop: LoadingButtonProps
  setShow: (check: boolean) => void
  dialogContent?: ReactNode
  customCancelTitle?: string
  customYesTitle?: string
  action?: boolean
}

export const CustomDialog = (props: IDialogue) => {
  const { show, setShow, title, buttonprop, dialogContent = null, customCancelTitle, customYesTitle, action } = props
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const arr =  title.split('<br/>');

  const TITLE = arr[0] || "";
  const SUBTITLE = arr[1] || "";

  return (
    <Dialog
      fullWidth
      open={Boolean(show)}
      scroll='body'
      maxWidth={hidden ? 'xl' : 'xs'}
      onClose={() => {
        setShow(false)
      }}
      onBackdropClick={() => {
        setShow(false)
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 10px' }}>
        <h4 style={{ wordBreak: 'break-word', width: '90%', textAlign: 'center',marginBottom:'10px' }}>{TITLE}</h4>

      </div>
       {SUBTITLE && SUBTITLE.length>0 &&  <h5 style={{textAlign: 'center', margin: 0, color: 'red', fontFamily: 'revert' }}>{SUBTITLE}</h5> }
      <IconButton
        sx={{ float: 'right', right: hidden ? 10 : 10, top: 10, position: 'absolute' }}
        onClick={() => setShow(false)}
      >
        <Close />
      </IconButton>
      {dialogContent}
      {!Boolean(action) && (
        <DialogActions>
          <Button variant='contained' onClick={() => setShow(false)} color='secondary'>
            {customCancelTitle || 'No'}
          </Button>
          <LoadingButton
            variant='contained'
            style={{
              marginLeft: '15px'
            }}
            type='submit'
            {...buttonprop}
            color='primary'
          >
            {customYesTitle || 'Yes'}
          </LoadingButton>
        </DialogActions>
      )}
    </Dialog>
  )
}
