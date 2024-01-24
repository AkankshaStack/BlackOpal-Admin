import { Typography, Button, Box, Collapse, Stack, Tooltip, Badge, Avatar } from '@mui/material'
import moment from 'moment'
import ImagePreview from 'src/views/image-perview'
import { imagePreview } from 'src/common/types'
import { useState } from 'react'
import AllTeamMembers from '../all-team-member'
import { useRouter } from 'next/router'

interface Props {
  data: any
  open: boolean
  isTeamMember?: boolean
  teamMemberData?: []
  setopenDrawer: (val: any) => void
}

const CollapseData = (prop: Props) => {
  const { data, isTeamMember, teamMemberData } = prop
  const [open1, setOpen1] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [isAllTeamDialogOpen, setisAllTeamDialogOpen] = useState(false)
  const handleViewAllTeamMember = () => {
    setisAllTeamDialogOpen(true)
  }
  const handleCloseAllTeamMember = () => {
    setisAllTeamDialogOpen(false)
  }
  const router = useRouter()

  return (
    <Collapse in={prop.open} timeout='auto' unmountOnExit>
      <Box sx={{ margin: 1, marginTop: '25px' }}>
        {/* <p style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h6' gutterBottom style={{ marginRight: '5px' }}>
            10
          </Typography>
          Associated with this project.
        </p>
        <Grid container>
          <Grid item xs={2} sm={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src='/images/avatars/1.png' />
            <p>ABC Company</p>
          </Grid>
          <Grid item xs={2} sm={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src='/images/avatars/1.png' />
            <p>ABC Company</p>
          </Grid>
          <Grid item xs={2} sm={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src='/images/avatars/1.png' />
            <p>ABC Company</p>
          </Grid>
          <Grid item xs={2} sm={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src='/images/avatars/1.png' />
            <p>ABC Company</p>
          </Grid>
        </Grid> */}
        {isTeamMember && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.7, alignItems: 'center' }}>
            <Box sx={{ width: '30%' }}>
              {/* NEed to ask for the updated due on */}
              <Typography mr={2} mb={5}>
                Team members associated
                <br /> with this project
              </Typography>
            </Box>
            <Box sx={{ width: '70%' }}>
              <Stack direction='row' spacing={8}>
                {teamMemberData && teamMemberData?.length > 0 ? (
                  <>
                    {teamMemberData.slice(0, 2).map((item: any) => (
                      <div
                        key={item?.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column'
                        }}
                      >
                        <Tooltip
                          title={`${item?.userDetails?.firstName || ''} ${item?.userDetails.lasttName || ''}`}
                          arrow
                        >
                          <Badge overlap='circular' anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                            <Box
                              onClick={() => {
                                if (item?.userDetails?.profilePictureSlug?.length > 0) {
                                  setOpen1({
                                    visible: true,
                                    url: item?.userDetails?.profilePictureSlug || ''
                                  })
                                }
                              }}
                              style={{
                                cursor: 'pointer'
                              }}
                              sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                            >
                              <Avatar
                                sx={{ width: 50, height: 50 }}
                                alt=''
                                src={item?.userDetails?.profilePictureSlug || ''}
                                onClick={() => {
                                  router.push({
                                    pathname: `/team-members/profile/${item?.id}`,
                                    query: { from: router?.query?.from }
                                  })
                                }}
                              />
                            </Box>
                          </Badge>
                        </Tooltip>
                      </div>
                    ))}
                    {teamMemberData?.length > 2 && (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', cursor: 'pointer' }}
                        onClick={handleViewAllTeamMember}
                      >
                        <Tooltip title='View'>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              bgcolor: 'white',
                              border: '1px solid rgba(76, 78, 100, 0.87)',
                              borderRadius: '50%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Typography variant='body2'>{`+${teamMemberData?.length - 2}`}</Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
                    None
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
        )}
        <Box sx={{ mt: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.7 }}>
            <Box sx={{ width: '30%' }}>
              {/* NEed to ask for the updated due on */}
              <Typography mr={2}>Updated Due On</Typography>
            </Box>
            <Box sx={{ width: '70%' }}>
              <Typography align='left' variant='body2'>
                {data?.updatedAt ? moment(data?.updatedAt).format('DD MMM YYYY') : '-'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.7 }}>
            <Box sx={{ width: '30%' }}>
              <Typography mr={2}>Property Description </Typography>
            </Box>
            <Box sx={{ width: '70%' }}>
              <Typography align='left' variant='body2'>
                {data?.description}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.7 }}>
            <Box sx={{ width: '30%' }}>
              <Typography mr={2}>Country</Typography>
            </Box>
            <Box sx={{ width: '70%' }}>
              <Typography align='left' variant='body2'>
                {data?.address?.country?.name || '-'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.7 }}>
            <Box sx={{ width: '30%' }}>
              <Typography mr={2}>City </Typography>
            </Box>
            <Box sx={{ width: '70%' }}>
              <Typography align='left' variant='body2'>
                {data?.address?.city?.name || '-'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.7 }}>
            <Box sx={{ width: '30%' }}>
              <Typography mr={2}>State </Typography>
            </Box>
            <Box sx={{ width: '70%' }}>
              <Typography align='left' variant='body2'>
                {data?.address?.state?.name || '-'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.7 }}>
            <Box sx={{ width: '30%' }}>
              <Typography mr={2}>Property Details</Typography>
            </Box>
            <Box sx={{ width: '70%', marginBottom: '30px' }}>
              <Button
                variant='contained'
                style={{ color: 'white' }}
                onClick={() =>
                  prop.setopenDrawer({
                    visible: true,
                    id: data?.id
                  })
                }
              >
                View Property Details
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <AllTeamMembers open={isAllTeamDialogOpen} handleClose={handleCloseAllTeamMember} data={teamMemberData} />
      <ImagePreview open={open1} setOpen={setOpen1} />
    </Collapse>
  )
}

export default CollapseData
