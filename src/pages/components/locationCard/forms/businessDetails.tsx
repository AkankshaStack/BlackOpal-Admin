import React, { Fragment } from 'react'
import {
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import LocationCard from '../index'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Youtube, Linkedin, Instagram, GoogleChrome, MicrosoftEdge, Twitter } from 'mdi-material-ui'
import config from 'src/configs/config'
import { dealingTypeConversion, incomeSegmentConversion } from 'src/utilities/conversions'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Imports

interface IProps {
  control?: any
  errors?: any
  setValue?: any
  count?: any
  setCount?: any
  values?: any
  watch?: any
}
interface SocialLink {
  link: string
  type: string
}
const spacing = 6

const BusinessDetailsForm = (props: IProps) => {
  const store = useSelector((state: any) => state.user.singleData)
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
    <>
      <CardHeader title='Business Details' titleTypographyProps={{ variant: 'h3' }} />
      <CardContent>
        <Grid container sx={{ mb: spacing }} spacing={spacing}>
          <Grid item xs={12} sm={12}>
            <CustomAvatar
              skin='light'
              variant='circular'
              sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, ml: 4, fontSize: '3rem' }}
              src={store?.userDetails?.profilePictureSlug ? store?.userDetails?.profilePictureSlug : ''}
            />
          </Grid>
          {store?.userDetails?.orgType !== config.orgType.company && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='name'
                    control={props.control}
                    rules={{ required: true }}
                    render={() => (
                      <TextField
                        disabled
                        InputLabelProps={{ shrink: true }}
                        value={store?.company?.name}
                        label='Name'
                        aria-describedby='validation-basic-cin-numbeer'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='orgType'
                    control={props.control}
                    rules={{ required: true }}
                    render={() => (
                      <TextField
                        disabled
                        InputLabelProps={{ shrink: true }}
                        value={
                          store?.userDetails?.orgType === config.orgType.freelancer ? 'Freelancer' : 'Propertiership'
                        }
                        label='Orgnization Type'
                        aria-describedby='validation-basic-cin-numbeer'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='panNumber'
                control={props.control}
                rules={{ required: true }}
                render={() => (
                  <TextField
                    disabled
                    InputLabelProps={{ shrink: true }}
                    value={store?.company?.panNumber}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    label='Pan Number'
                    aria-describedby='validation-basic-cin-numbeer'
                  />
                )}
              />
            </FormControl>
          </Grid>

          {store.userDetails.orgType !== config.orgType.company && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='gstNumber'
                  control={props.control}
                  rules={{ required: true }}
                  render={() => (
                    <TextField
                      disabled
                      InputLabelProps={{ shrink: true }}
                      value={store?.company?.gstNumber ? store?.company?.gstNumber : 'Not available'}
                      label='Gst Number'
                      aria-describedby='validation-basic-cin-numbeer'
                    />
                  )}
                />
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='businessProfile'
                control={props.control}
                rules={{ required: true }}
                render={() => (
                  <TextField
                    disabled
                    InputLabelProps={{ shrink: true }}
                    value={store?.company?.businessProfile}
                    rows={4}
                    multiline
                    label='Business profile'
                    aria-describedby='validation-basic-bussniss_profile'
                  />
                )}
              />
            </FormControl>
          </Grid>

          {store.userDetails.orgType === config.orgType.freelancer && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2'>Area of expertise</Typography>
                {store?.userDetails?.meta?.incomeSegmentIds?.length ? (
                  <Fragment>
                    {store?.userDetails?.meta?.incomeSegmentIds?.map((val: number) => (
                      <CustomChip
                        key={val}
                        skin='light'
                        size='small'
                        variant='outlined'
                        sx={{
                          textTransform: 'capitalize',
                          '& .MuiChip-label': { lineHeight: '18px' },
                          marginLeft: '0.25rem',
                          marginRight: '0.25rem'
                        }}
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='dealingType'
                    control={props.control}
                    rules={{ required: true }}
                    render={() => (
                      <TextField
                        disabled
                        InputLabelProps={{ shrink: true }}
                        value={dealingTypeConversion(store?.dealingType)}
                        label='Dealing Type'
                        aria-describedby='validation-basic-cin-numbeer'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <InputLabel>
              {store.userDetails.orgType !== config.orgType.company ? 'Communication Address' : 'Registered Address'}
            </InputLabel>
          </Grid>
          <LocationCard
            addressLabel={
              store.userDetails.orgType !== config.orgType.company ? 'Communication Address' : 'Registered Address'
            }
            name='register'
            control={props.control}
            errors={props.errors}
            values={store?.company?.registrationAddress}
            setValue={props.setValue}
            watch={props.watch}
          />
          {store.userDetails.orgType === config.orgType.freelancer && (
            <Grid item xs={12} sx={{ paddingTop: '0rem !important' }} className='hehehehe'>
              <FormControl fullWidth>
                <Controller
                  name='microMarket'
                  control={props.control}
                  rules={{ required: true }}
                  render={() => (
                    <TextField
                      sx={{ p: '0rem' }}
                      disabled
                      multiline
                      InputLabelProps={{ shrink: true }}
                      value={store?.microMarketAddress?.name}
                      label='Micro Market'
                      aria-describedby='validation-basic-cin-numbeer'
                    />
                  )}
                />
              </FormControl>
            </Grid>
          )}

          {store?.userDetails?.orgType === config.orgType.company ? (
            <>
              <Grid item xs={12}>
                <InputLabel>Communication address</InputLabel>
              </Grid>
              <LocationCard
                addressLabel='Communication address'
                name='communication'
                control={props.control}
                errors={props.errors}
                values={store?.company?.communicationAddress}
                setValue={props.setValue}
                watch={props.watch}
              />
            </>
          ) : null}
          {store?.company?.socialLinks?.length ? (
            <Grid item sm={4}>
              <Typography variant='body2' sx={{ mb: 4 }}>
                Social Links
              </Typography>
              <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
                <Stack spacing={4} direction='row'>
                  {store?.company?.socialLinks?.map((item: SocialLink) => (
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
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </>
  )
}

export default BusinessDetailsForm
