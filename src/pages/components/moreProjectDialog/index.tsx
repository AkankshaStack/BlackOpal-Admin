import { FC } from 'react'
import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Box, Divider } from '@mui/material'
import { Close } from 'mdi-material-ui'

interface IMoreProjectDialogProps {
  open: boolean
  handleClose: () => void
  data: any
}

const MoreProjectDialog: FC<IMoreProjectDialogProps> = ({ open, handleClose, data }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
      scroll={'paper'}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle sx={{ position: 'relative', px: 12 }}>
        <Typography variant='h6'>Project Associated</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 12 }}>
        {data?.projects?.map((item: any, index: any) => (
          <Box key={item.id}>
            <Typography sx={{ py: 2 }} variant='body2'>
              {`${item?.property?.name}`}
            </Typography>
            {index !== data?.projects?.length - 1 && <Divider />}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default MoreProjectDialog
