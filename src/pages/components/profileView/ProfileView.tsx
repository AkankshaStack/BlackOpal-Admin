import { Avatar, Grid, Typography, Stack, CardHeader, Card, Button, IconButton } from '@mui/material'
import { Eye } from 'mdi-material-ui'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { dealingTypeConversion, incomeSegmentConversion } from 'src/utilities/conversions'
import { Youtube, Linkedin, Instagram, GoogleChrome, MicrosoftEdge, Twitter } from 'mdi-material-ui'
import ImagePreview from 'src/views/image-perview'
import { imagePreview } from 'src/common/types'
import { Fragment, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

interface SocialLink {
  link: string
  type: string
}

const ProfileView = () => {
  const store = useSelector((state: any) => state.teammember.singleTeamMemberData)
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const valueIcon: any = {
    Linkedin: (
      <Linkedin
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Twitter: (
      <Twitter
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Youtube: (
      <Youtube
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Instagram: (
      <Instagram
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Website: (
      <GoogleChrome
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Others: (
      <MicrosoftEdge
        style={{
          fontSize: '35px'
        }}
      />
    )
  }

  return (
    <Grid container spacing={4} sx={{ px: 6, pt: 4 }}>
      <Grid item md={9} sm={12}>
        <Grid container spacing={10}>
          <Grid item sm={4}>
            <Typography variant='body2'>Name</Typography>
            <Typography
              sx={{ fontWeight: 600 }}
              variant='subtitle1'
            >{`${store?.userDetails?.firstName} ${store?.userDetails?.lastName}`}</Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Mobile Number</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {store?.userDetails?.contactMobileNumber}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Email Address</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {store?.userDetails?.email}
            </Typography>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Typography variant='body2'>Area of expertise</Typography>
            {store?.userDetails?.meta?.incomeSegmentIds?.length ? (
              <Fragment>
                {store?.userDetails?.meta?.incomeSegmentIds?.map((val: number) => (
                  <CustomChip
                    key={val}
                    skin='light'
                    size='small'
                    variant='outlined'
                    sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                    color='secondary'
                    label={incomeSegmentConversion(val)}
                  />
                ))}
              </Fragment>
            ) : (
              <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
                Not Available
              </Typography>
            )}
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Type</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {dealingTypeConversion(store?.dealingType)}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Micro Market</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {store?.microMarketAddress?.name || <i>Not Filled</i>}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Date of joining</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {store?.dateOfJoining ? moment(store?.dateOfJoining).format('DD MMM YYYY') : <i>Not Filled</i>}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Address</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {store?.userDetails?.address?.address || <i>Not Filled</i>}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Country</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {store?.userDetails?.address?.country?.name || <i>Not Filled</i>}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>State</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {store?.userDetails?.address?.state?.name || <i>Not Filled</i>}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Pincode</Typography>
            <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
              {store?.userDetails?.address?.pincode || <i>Not Filled</i>}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            <Typography variant='body2'>Social Links</Typography>
            {!!store?.userDetails?.meta?.socialLinks?.length ? (
              <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
                <Stack spacing={4} direction='row'>
                  {store?.userDetails?.meta?.socialLinks?.map((item: SocialLink) => (
                    <a
                      key={item?.link}
                      href={
                        item?.link.includes('http') || item?.link.includes('https')
                          ? item?.link
                          : `http://${item?.link}`
                      }
                      target='_blank'
                      rel='noreferrer'
                    >
                      <div>
                        <IconButton size='small'>{valueIcon[item?.type]}</IconButton>
                      </div>
                    </a>
                  ))}
                </Stack>
              </Typography>
            ) : (
              <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
                Not Filled
              </Typography>
            )}
          </Grid>
          <Grid item sm={12}>
            {store?.panCertificates?.length > 0 && (
              <>
                <h4 style={{ marginTop: 0 }}>PAN Details</h4>
                {store?.panCertificates?.map((field: any, index: number) => {
                  return (
                    <Card
                      style={{ width: '100%', boxShadow: 'none', marginBottom: '20px', backgroundColor: 'transparent' }}
                      variant='outlined'
                      key={index}
                    >
                      <CardHeader
                        title={`PAN Number: ${field?.verificationNumber}`}
                        action={
                          <Button
                            onClick={() => window.open(field?.verificationCertificateUrl)}
                            startIcon={<Eye />}
                            variant='outlined'
                          >
                            View
                          </Button>
                        }
                      />
                    </Card>
                  )
                })}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar
          src={store?.userDetails?.profilePictureSlug}
          sx={{ width: 200, height: 200, cursor: 'pointer' }}
          onClick={() => {
            if (store?.userDetails?.profilePictureSlug?.length > 0) {
              setOpen({
                visible: true,
                url: store?.userDetails?.profilePictureSlug || ''
              })
            }
          }}
        />
      </Grid>
      <ImagePreview open={open} setOpen={setOpen} />
    </Grid>
  )
}

export default ProfileView
