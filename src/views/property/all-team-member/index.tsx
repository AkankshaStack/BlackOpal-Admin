import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Box, Divider } from '@mui/material'
import { FC } from 'react'
import { Close } from 'mdi-material-ui'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

interface IAllTeamMembersProps {
  open: boolean
  handleClose: () => void
  data: any
}

const AllTeamMembers: FC<IAllTeamMembersProps> = ({ open, handleClose, data }) => {
  const router = useRouter()

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
        <Typography variant='h6'>Team members associated</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 12 }}>
        {data?.map((item: any, index: number) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <NextLink
                href={{
                  pathname: `/team-members/profile/${item?.id}`,
                  query: { from: router?.query?.from }
                }}
              >
                <Typography sx={{ py: 2 }} variant='body1'>
                  {`${item?.userDetails?.firstName || ''} ${item?.userDetails.lasttName || ''}`}
                </Typography>
              </NextLink>
            </Box>
            {index !== data?.length - 1 && <Divider />}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default AllTeamMembers
