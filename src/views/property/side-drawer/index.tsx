import {
  Typography,
  IconButton,
  Box,
  Drawer,
  Tooltip,
  CardContent,
  Card,
  Grid,
  CardHeader,
  CircularProgress
} from '@mui/material'
import { Close, CurrencyInr, Download, Eye, MapMarker, PencilOutline } from 'mdi-material-ui'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import moment from 'moment'
import config from 'src/configs/config'
import CustomChip from 'src/@core/components/mui/chip'
import { developerConversation, ruppeeConversation } from 'src/utilities/conversions'
import ImageSlider from 'src/views/components/imageSlider/ImageSlider'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import PropertyMap from 'src/views/components/propertyMap/PropertyMap.js'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { fetchPropertyDetails } from 'src/store/apps/property'
import { Fragment, useEffect, useState } from 'react'
import CardDocument from 'src/views/ui/cards/document/CardDocument'
import { useRouter } from 'next/router'
import { ERoutes } from 'src/common/routes'
import { useAuth } from 'src/hooks/useAuth'
import RenderFeatures from 'src/views/components/plan-feature/PlanFeature'

interface Props {
  openDrawer: any
  setopenDrawer: (val: any) => void
}
const videoFieldsName = ['mediaLinkWalkthrough', 'mediaLinkConstructionUpdate', 'mediaLinkInterior']

const certificateData = [
  {
    title: 'Building plan',
    name: 'buildingPlanSlug',
    required: true
  },
  {
    title: 'Environment clearance',
    name: 'environmentClearanceSlug',
    required: true
  },
  {
    title: 'CA certificate',
    name: 'caCertificateSlug',
    required: true
  },
  {
    title: 'Architect certificate',
    name: 'architectCertificateSlug',
    required: true
  },
  {
    title: 'Engineer certificate',
    name: 'engineerCertificateSlug',
    required: true
  },
  {
    title: 'Fire noc',
    name: 'fireNocSlug',
    required: true
  },
  {
    title: 'Customer complaints',
    name: 'customerComplaintSlug'
  },
  {
    title: 'RERA specification',
    name: 'reraSpecificationSlug'
  },

  {
    title: 'Structural stability certificate',
    name: 'structuralStabilityCertificateSlug'
  },
  {
    title: 'Encumbrance certificate',
    name: 'encumbranceCertificateSlug'
  },
  {
    title: 'Brochure',
    name: 'brochureSlug'
  },
  {
    title: 'Price List',
    name: 'priceListSlug'
  },
  {
    title: 'Allotment Letter',
    name: 'allotmentLetterSlug'
  },
  {
    title: 'Title Deed',
    name: 'titleDeedSlug'
  },
  {
    title: 'JV Agreement',
    name: 'jvAgreementSlug'
  },
  {
    title: 'LOI Certificate',
    name: 'loiSlug'
  },
  {
    title: 'COD Certificate',
    name: 'codSlug'
  },
  {
    title: 'Zoning Plan',
    name: 'zoningPlanSlug'
  },
  {
    title: 'Demarcation Plan',
    name: 'demarcationPlanSlug'
  },
  {
    title: 'Demarcation Plan',
    name: 'demarcationPlanSlug'
  },
  {
    title: 'Lease Deed',
    name: 'leaseDeedSlugs',
    multiple: true
  },
  {
    title: 'Sale Deed',
    name: 'saleDeedSlugs',
    multiple: true
  },
  {
    title: 'Land Document',
    name: 'landDocumentSlug',
    multiple: true
  }
]

const DrawerData = (prop: Props) => {
  const { openDrawer, setopenDrawer } = prop
  const [videoLink, setVideolink] = useState<string[]>([])
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading }: { data: any; loading: boolean } = useSelector((state: RootState) => state.property)
  const style = {
    display: 'flex',
    justifyContent: 'space-between',
    pb: 4,
    pt: 4,
    pl: 5,
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  }
  const router = useRouter()
  useEffect(() => {
    if (openDrawer.id) {
      dispatch(
        fetchPropertyDetails({
          id: openDrawer.id,
          params: {
            include:
              'tags,address,reraAnalytics,propertyInventory,homeloanPartners,developer,statusUpdatedByUser,listingStatusUpdatedByUser,amenities,createdByUser,details,localities,nearbyBusiness,localities'
          }
        })
      ).then((response: any) => {
        console.log(response)
        if (response?.payload?.data?.id) {
          const arr: string[] = []
          videoFieldsName?.map(val => {
            if (response?.payload?.data[val]?.length) {
              arr.push(response?.payload?.data[val])
            }
          })

          setVideolink(arr)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDrawer.id])

  function toDataURL(url: string, callback: any) {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      const reader = new FileReader()
      reader.onloadend = () => {
        callback(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
  }
  async function download(source: string, fileName: string) {
    await toDataURL(source, (dataUrl: any) => {
      const link = document.createElement('a')
      link.href = dataUrl
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    })
  }
  const auth = useAuth()
  const check = auth?.user?.roles?.some((el: any) => {
    return el.name === 'jh-project-admin'
  })

  return (
    <Drawer
      anchor='right'
      open={openDrawer.visible}
      onClose={() =>
        setopenDrawer({
          visible: false,
          data: {}
        })
      }
      className='my-property-drawer'
      sx={{
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box'
        },
        px: 5,
        py: 3
      }}
    >
      {loading ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div>
          <Grid container sx={{ mt: 2, mb: 2, ml: 2 }}>
            <Grid item xs={hidden ? 10 : 11}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Tooltip title={`${data?.code} | ${data?.name || 'Property Details'}`}>
                  <Typography variant='h6'>{`${data?.code} | 
                            ${
                              data?.name?.length > config.nameLengthCheck
                                ? data?.name?.slice(0, config.nameLengthCheck) + '...' || 'Property Details'
                                : data?.name || 'Property Details'
                            }`}</Typography>
                </Tooltip>
                {check ? (
                  <IconButton onClick={() => router.push(ERoutes.EDIT_PROPERTY.replace(':id', openDrawer.id))}>
                    <PencilOutline sx={{ marginRight: '-4px' }} />
                  </IconButton>
                ) : null}
              </div>
            </Grid>
            <Grid item>
              <IconButton
                onClick={() =>
                  setopenDrawer({
                    visible: false,
                    data: {}
                  })
                }
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <div style={{ marginTop: '10px' }}>
            {data?.images?.length > 0 && (
              <div className='grid'>
                <KeenSliderWrapper>
                  <ImageSlider direction='ltr' images={data?.images} />
                </KeenSliderWrapper>
              </div>
            )}

            <Box sx={style} style={{ width: '100%' }}>
              <Box>
                <Typography mr={2}>Land area</Typography>
              </Box>
              <Box>
                <Typography align='left'>{`${
                  (data?.details?.landAreaInSqft / 43560).toFixed(0) || '-'
                } Acres`}</Typography>
              </Box>
            </Box>
            {data?.noOfTowers >= 0 && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>No. of tower</Typography>
                </Box>
                <Box>
                  <Typography align='left'>{data?.noOfTowers || <i>Not Filled</i>}</Typography>
                </Box>
              </Box>
            )}
            {data?.details?.noOfSecurityTiers && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Security tiers</Typography>
                </Box>
                <Box>
                  <Typography align='left'>{`${
                    config?.properties?.securityTier[data?.details?.noOfSecurityTiers] || <i>Not Filled</i>
                  }`}</Typography>
                </Box>
              </Box>
            )}
            {data?.availabilityStatus && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Availabililty status</Typography>
                </Box>
                <Box>
                  <Typography align='left'>{`${
                    config?.properties?.availabilityStatus[data?.availabilityStatus] || <i>Not Filled</i>
                  }`}</Typography>
                </Box>
              </Box>
            )}
            {data?.maxCurrentPriceInPaise > 0 && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Current price</Typography>
                </Box>
                <Box>
                  <Typography align='left' sx={{ display: 'flex', alignItems: 'center' }}>
                    <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                    {`${ruppeeConversation(data?.maxCurrentPriceInPaise)} INR/Sqft`}
                  </Typography>
                </Box>
              </Box>
            )}
            {data?.maxLaunchPriceInPaise > 0 && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Launch price</Typography>
                </Box>
                <Box>
                  <Typography align='left' sx={{ display: 'flex', alignItems: 'center' }}>
                    <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                    {`${ruppeeConversation(data?.maxLaunchPriceInPaise)} INR/Sqft`}
                  </Typography>{' '}
                </Box>
              </Box>
            )}
            {data?.marketRateInPaise > 0 && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Market price</Typography>
                </Box>
                <Box>
                  <Typography align='left' sx={{ display: 'flex', alignItems: 'center' }}>
                    <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                    {`${ruppeeConversation(data?.marketRateInPaise)} INR/Sqft`}
                  </Typography>
                </Box>
              </Box>
            )}
            {data?.details?.noOfParkingPerFlat && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Parking per flat</Typography>
                </Box>
                <Box>
                  <Typography align='left'>
                    {data?.details?.noOfParkingPerFlat
                      ? `${data?.details?.noOfParkingPerFlat} ${
                          !(data?.details?.noOfParkingPerFlat % 1 === 0) ? '+' : ''
                        }`
                      : '-'}
                  </Typography>
                </Box>
              </Box>
            )}
            {data?.hasShoppingComplexis && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Commercial space/Daily need shopping complex</Typography>
                </Box>
                <Box>
                  <Typography align='left'>{data?.hasShoppingComplex ? 'Yes' : 'No'}</Typography>
                </Box>
              </Box>
            )}
            {data?.details?.constructionType && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Construction type</Typography>
                </Box>
                <Box>
                  <Typography align='left'>
                    {data?.details?.constructionType
                      ? `${config?.properties?.constructionType[data?.details?.constructionType]}`
                      : '-'}
                  </Typography>
                </Box>
              </Box>
            )}
            {data?.details?.flooringType && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Flooring type</Typography>
                </Box>
                <Box>
                  <Typography align='left'>
                    {data?.details?.flooringType
                      ? `${config?.properties?.flooringType[data?.details?.flooringType]}`
                      : '-'}
                  </Typography>
                </Box>
              </Box>
            )}
            {data?.details?.noOfUnits && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Total units</Typography>
                </Box>
                <Box>
                  <Typography align='left'>{`${data?.details?.noOfUnits || '-'} Nos.`}</Typography>
                </Box>
              </Box>
            )}
            <Box sx={style}>
              <Box>
                <Typography mr={2}>Address</Typography>
              </Box>
              <Box>
                <Tooltip title={data?.address?.address || '-'}>
                  <Typography
                    align='left'
                    className='underline-code'
                    style={{
                      fontSize: '14px'
                    }}
                    onClick={() => {
                      if (data?.address?.address.length === 0) {
                        return
                      }
                      window.open(`https://google.com/maps?q=${data?.coordinates[0]},${data?.coordinates[1]}`)
                    }}
                  >
                    <MapMarker
                      style={{
                        fontSize: '14px',
                        color: 'rgba(76, 78, 100, 0.87)',
                        verticalAlign: 'middle'
                      }}
                    />
                    {data?.address?.address || '-'}
                  </Typography>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={style}>
              <Box>
                <Typography mr={2}>Country</Typography>
              </Box>
              <Box>
                <Typography align='left'>{data?.address?.country?.name || '-'}</Typography>
              </Box>
            </Box>
            <Box sx={style}>
              <Box>
                <Typography mr={2}>City </Typography>
              </Box>
              <Box>
                <Typography align='left'>{data?.address?.city?.name || '-'}</Typography>
              </Box>
            </Box>
            <Box sx={style}>
              <Box>
                <Typography mr={2}>State </Typography>
              </Box>
              <Box>
                <Typography align='left'>{data?.address?.state?.name || '-'}</Typography>
              </Box>
            </Box>
            {data?.details?.noOfUnitsPerFloor?.length > 0 && (
              <Box sx={style}>
                <Box>
                  <Typography mr={2}>Avreage Units per floor</Typography>
                </Box>
                <Box>
                  <Typography align='left'>{`${data?.details?.noOfUnitsPerFloor.join(',') || '-'}`}</Typography>
                </Box>
              </Box>
            )}

            {data?.developer && (
              <Box
                sx={{
                  pt: 4,
                  pl: 5,
                  pr: 6
                }}
              >
                <Box sx={{ mb: 5 }}>
                  <Typography mr={2}>Developer details</Typography>
                </Box>
                <Box sx={style} style={{ width: '100%' }}>
                  <Box>
                    <Typography mr={2}>Name</Typography>
                  </Box>
                  <Box>
                    <Typography align='left'>{`${data?.developer?.name || '-'}`}</Typography>
                  </Box>
                </Box>
                <Box sx={style}>
                  <Box>
                    <Typography mr={2}>LLP name</Typography>
                  </Box>
                  <Box>
                    <Typography align='left'>{`${data?.developer?.llpName || '-'}`}</Typography>
                  </Box>
                </Box>
                <Box sx={style}>
                  <Box>
                    <Typography mr={2}>Company status</Typography>
                  </Box>
                  <Box>
                    <Typography align='left'>
                      {config?.properties?.developer?.companyStatus[data?.developer?.companyStatus] || (
                        <i>Not Filled</i>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={style}>
                  <Box>
                    <Typography mr={2}>Delivered area</Typography>
                  </Box>
                  <Box>
                    <Typography align='left'>
                      {data?.developer?.totalDeliveredAreaInSqft
                        ? developerConversation(data?.developer?.totalDeliveredAreaInSqft)
                        : '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={style}>
                  <Box>
                    <Typography mr={2}>Years in business</Typography>
                  </Box>
                  <Box>
                    <Typography align='left'>{`${data?.developer?.noOfyearsInBusiness || '-'}`}</Typography>
                  </Box>
                </Box>
                <Box sx={style}>
                  <Box>
                    <Typography mr={2}>Instrument rating</Typography>
                  </Box>
                  <Box>
                    <Typography align='left'>
                      {data?.developer?.ratingOfFinancialInstrument ? (
                        config?.properties?.developerRating[data?.developer?.ratingOfFinancialInstrument]
                      ) : (
                        <i>Not Filled</i>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={style}>
                  <Box>
                    <Typography mr={2}>Rating provided by</Typography>
                  </Box>
                  <Box>
                    <Typography align='left'>
                      {data?.developer?.ratingProvidedBy ? (
                        config?.properties?.ratingProvidedBy[data?.developer?.ratingProvidedBy]
                      ) : (
                        <i>Not Filled</i>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    pb: 3,
                    pt: 4,
                    pl: 5,
                    mt: 4,
                    pr: 3,
                    width: 'unset !important'
                  }}
                  className='fullWidth'
                >
                  <Box sx={{ mb: 5 }}>
                    <Typography mr={2}>Developer overview</Typography>
                  </Box>
                  <Box style={{ width: '100%' }}>
                    <Typography align='left' variant='body2'>
                      {data?.developer?.description || <i>Not Filled</i>}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            {data?.propertyInventory?.length > 0 ? (
              <Box
                sx={{
                  pt: 4,
                  pl: 5,
                  pr: 6
                }}
              >
                <Box sx={{ mb: 5 }}>
                  <Typography mr={2}>Configurations</Typography>
                </Box>
                {data?.propertyInventory.map((val: any) => (
                  <Card
                    style={{ width: '100%', boxShadow: 'none', marginBottom: '20px' }}
                    variant='outlined'
                    key={val?.id}
                    className='fullWidth'
                  >
                    <CardHeader
                      title={
                        <Tooltip
                          title={`${val?.refId || ''} | ${config?.properties?.configurations[val?.configuration]}`}
                        >
                          <Typography noWrap variant='inherit' style={{ width: '100%' }}>{`${val?.refId || ''} | ${
                            config?.properties?.configurations[val?.configuration]
                          }`}</Typography>
                        </Tooltip>
                      }
                    />
                    <CardContent style={{ position: 'relative' }}>
                      <Grid container>
                        <Grid item xs={12} sm={6}>
                          <p>
                            Carpet area: {val?.carpetAreaInSqft ? `${val?.carpetAreaInSqft} sq.ft.` : 'Not available'}
                          </p>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <p>Sellable area: {val?.sellableAreaInSqft ? `${val?.sellableAreaInSqft} sq.ft.` : ''}</p>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <p>
                            Property type:
                            {val?.propertyTypeId ? ` ${config?.properties?.propertyType[val?.propertyTypeId]}` : '-'}
                          </p>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <p style={{ display: 'flex', alignItems: 'center' }}>
                            Lead cost:
                            <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                            {ruppeeConversation(val?.leadCostInPaise || 0)}
                          </p>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <p style={{ display: 'flex', alignItems: 'center' }}>
                            Price:
                            {val?.priceInPaise || val?.priceInPaise !== 0 ? (
                              <Fragment>
                                {' '}
                                <CurrencyInr sx={{ fontSize: '1.1rem' }} /> {ruppeeConversation(val?.priceInPaise) || 0}
                              </Fragment>
                            ) : (
                              'Price on request'
                            )}
                          </p>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <p>{`Price depends upon: ${
                            !val?.isPriceDependsOnSellableArea ? 'Saleable area' : 'Carpet area'
                          }`}</p>
                        </Grid>
                        {val?.priceInPaise ? (
                          <Grid item xs={12} sm={6}>
                            <p style={{ display: 'flex', alignItems: 'center' }}>
                              Price per sqft: <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                              {!val?.isPriceDependsOnSellableArea
                                ? ruppeeConversation(val?.priceInPaise / val?.sellableAreaInSqft)
                                : ruppeeConversation(val?.priceInPaise / val?.carpetAreaInSqft)}
                            </p>
                          </Grid>
                        ) : null}
                        {val?.noOfBathrooms ? (
                          <Grid item xs={12} sm={6}>
                            <p>No of bathroom: {val?.noOfBathrooms}</p>
                          </Grid>
                        ) : null}
                        <Grid item xs={12} sm={6}>
                          <p>Servant room: {val?.hasServantRoom ? 'Yes' : 'No'}</p>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <p>Study room: {val?.hasStudyRoom ? 'Yes' : 'No'}</p>
                        </Grid>
                        <Grid item xs={12}>
                          {val?.floorPlanSlugs?.length > 0 && (
                            <RenderFeatures data={[]} collapseHeight={180} heightAuto>
                              {val?.floorPlanSlugs?.map((val: string, index: number) => (
                                <CardDocument
                                  key={index}
                                  index={index}
                                  file={{
                                    name: val.substring(val.lastIndexOf('/') + 1, val.length),
                                    url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${val}`
                                  }}
                                />
                              ))}
                            </RenderFeatures>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : null}
            {data?.amenities?.length > 0 && (
              <>
                <Box
                  sx={{
                    pt: 4,
                    pl: 5,
                    mt: 4,
                    pr: 3
                  }}
                  className='fullWidth'
                >
                  <Box sx={{ mb: 5 }}>
                    <Typography mr={2}>Amenities</Typography>
                  </Box>
                  <Box>
                    {data?.amenities?.map((val: any) => (
                      <CustomChip
                        key={val?.slug}
                        skin='light'
                        size='small'
                        label={val?.slug}
                        color='secondary'
                        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' }, margin: '6px' }}
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}

            {data?.tags?.length > 0 && (
              <>
                <Box
                  sx={{
                    pb: 2,
                    pt: 4,
                    pl: 5,
                    mt: 4,
                    pr: 3
                  }}
                  className='fullWidth'
                >
                  <Box sx={{ mb: 5 }}>
                    <Typography mr={2}>Tags</Typography>
                  </Box>
                  <Box>
                    {data?.tags?.map((val: any) => (
                      <CustomChip
                        key={val?.slug}
                        skin='light'
                        size='small'
                        label={val?.slug}
                        color='secondary'
                        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' }, margin: '6px' }}
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}

            {videoLink?.length > 0 ? (
              <Fragment>
                <Box
                  sx={{
                    pt: 4,
                    pl: 5,
                    mt: 4,
                    pr: 3
                  }}
                >
                  <Box sx={{ mb: 5 }}>
                    <Typography mr={2}>Video links</Typography>
                  </Box>
                </Box>

                <div className='grid'>
                  <KeenSliderWrapper>
                    <ImageSlider direction='ltr' images={videoLink} isVideo />
                  </KeenSliderWrapper>
                </div>
              </Fragment>
            ) : null}

            <Box
              sx={{
                pb: 3,
                pt: 0,
                pl: 5,
                mt: 4,
                pr: 3
              }}
              className='fullWidth'
            >
              <Box sx={{ mb: 5 }}>
                <Typography mr={2}>Property overview</Typography>
              </Box>
              <Box>
                <Typography align='left' variant='body2'>
                  {data?.description}
                </Typography>
              </Box>
            </Box>
            {data?.nearbyBusiness?.length > 0 && (
              <>
                <Box
                  sx={{
                    pt: 4,
                    pl: 5,
                    mt: 4,
                    pr: 3
                  }}
                  className='fullWidth'
                >
                  <Box>
                    <Typography mr={2}>Neighbourhood</Typography>
                  </Box>
                </Box>
                {data?.nearbyBusiness.length && (
                  <Box sx={{ mt: 6, pl: 5, pr: 3, mb: 6 }} className='fullWidth'>
                    <PropertyMap nearbyPlaces={data?.nearbyBusiness} />
                  </Box>
                )}
              </>
            )}
            <Box
              sx={{
                pb: 4,
                pt: 2,
                pl: 5,
                pr: 3
              }}
            ></Box>

            {data?.isReraRegisterd ? (
              <>
                {data?.reraAnalytics?.reraNumber && (
                  <>
                    <Typography mr={2} variant='inherit' sx={{ pl: 3, mb: 5 }}>
                      RERA Analytics
                    </Typography>

                    <Box sx={style}>
                      <Box>
                        <Typography mr={2}>RERA number</Typography>
                      </Box>
                      <Box>
                        <Typography align='left' style={{ textTransform: 'uppercase' }}>{`${
                          data?.reraAnalytics?.reraNumber || '- '
                        } `}</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pb: 4,
                        pt: 4,
                        pl: 5,
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Box>
                        <Typography mr={2}>RERA registration date</Typography>
                      </Box>
                      <Box>
                        <Typography align='left'>
                          {data?.reraAnalytics?.reraRegistrationDate
                            ? moment(data?.reraAnalytics?.reraRegistrationDate).format('DD MMM YYYY')
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pb: 4,
                        pt: 4,
                        pl: 5,
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Box>
                        <Typography mr={2}>RERA encumbered</Typography>
                      </Box>
                      <Box>
                        <Typography align='left'>{data?.isReraEncumbered ? 'Yes' : 'No'}</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pb: 4,
                        pt: 4,
                        pl: 5,
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Box>
                        <Typography mr={2}>RERA possession date</Typography>
                      </Box>
                      <Box>
                        <Typography align='left'>
                          {data?.reraAnalytics?.reraDeclaredPossessionDate
                            ? moment(data?.reraAnalytics?.reraDeclaredPossessionDate).format('DD MMM YYYY')
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>
                    {data?.reraAnalytics?.reraPossessionCovidExtensionDate ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          pb: 4,
                          pt: 4,
                          pl: 5,
                          borderBottom: '1px solid rgba(0,0,0,0.1)',
                          flexWrap: 'wrap'
                        }}
                      >
                        <Box>
                          <Typography mr={2}>RERA possession covid extension date'</Typography>
                        </Box>
                        <Box>
                          <Typography align='left'>
                            {data?.reraAnalytics?.reraPossessionCovidExtensionDate
                              ? moment(data?.reraAnalytics?.reraPossessionCovidExtensionDate).format('DD MMM YYYY')
                              : '-'}
                          </Typography>
                        </Box>
                      </Box>
                    ) : null}
                    {data?.reraAnalytics?.reraPossessionReraExtensionDate ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          pb: 4,
                          pt: 4,
                          pl: 5,
                          borderBottom: '1px solid rgba(0,0,0,0.1)',
                          flexWrap: 'wrap'
                        }}
                      >
                        <Box>
                          <Typography mr={2}>RERA Possession RERA Extension Date</Typography>
                        </Box>
                        <Box>
                          <Typography align='left'>
                            {data?.reraAnalytics?.reraPossessionReraExtensionDate
                              ? moment(data?.reraAnalytics?.reraPossessionReraExtensionDate).format('DD MMM YYYY')
                              : '-'}
                          </Typography>
                        </Box>
                      </Box>
                    ) : null}
                  </>
                )}
                {data?.reraAnalytics?.meta?.specifications?.length > 0 && (
                  <>
                    <Box
                      sx={{
                        pt: 4,
                        pl: 5,
                        pr: 6
                      }}
                    >
                      <Typography mr={2} sx={{ mb: 3 }}>
                        Specification
                      </Typography>

                      {data?.reraAnalytics?.meta?.specifications?.map((val: any, index1: number) => (
                        <Card
                          style={{ width: '100%', boxShadow: 'none', marginBottom: '20px' }}
                          variant='outlined'
                          key={index1}
                        >
                          <CardHeader title={val?.category} />
                          <CardContent style={{ position: 'relative' }}>
                            <p>{val?.text}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </>
                )}

                {certificateData?.map((val: any, index: number) => {
                  return (
                    <>
                      {(data?.reraAnalytics?.hasOwnProperty(val.name) &&
                        (data?.reraAnalytics?.[val.name]?.length > 0 ||
                          data?.reraAnalytics?.[val.name]?.slug?.length > 0)) ||
                      val?.required ? (
                        val?.multiple ? (
                          data?.reraAnalytics?.[val.name]?.length > 0 && (
                            <div className='grid'>
                              <Typography sx={{ fontWeight: 'bold', ml: 5, pt: 2, pb: 2 }}>{val?.title}</Typography>
                              <RenderFeatures data={[]} collapseHeight={180} heightAuto>
                                {data?.reraAnalytics?.[val.name]?.map(
                                  (val: { label: string; slug: string }, index: number) => (
                                    <CardDocument
                                      key={index}
                                      index={index}
                                      file={{
                                        name: val.slug.substring(val.slug.lastIndexOf('/') + 1, val.slug.length),
                                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${val.slug}`
                                      }}
                                    />
                                  )
                                )}
                              </RenderFeatures>
                            </div>
                          )
                        ) : (
                          <Box sx={style} key={index}>
                            <Box>
                              <Typography mr={2}>{val?.title}</Typography>
                            </Box>

                            {data?.reraAnalytics?.hasOwnProperty(val.name) ? (
                              <Box>
                                <Tooltip title='View document'>
                                  <IconButton
                                    onClick={() =>
                                      window.open(
                                        `${process.env.NEXT_PUBLIC_IMAGE_URL}${
                                          data?.reraAnalytics[val.name] || data?.reraAnalytics[val.name]?.slug
                                        }`,
                                        '_blank'
                                      )
                                    }
                                  >
                                    <Eye />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title='Download document'>
                                  <IconButton
                                    style={{
                                      marginLeft: '20px'
                                    }}
                                    onClick={() => {
                                      download(
                                        `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.reraAnalytics[val.name]}`,
                                        'Document'
                                      )
                                    }}
                                  >
                                    <Download />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Box>
                                <Typography variant='subtitle1' sx={{ fontWeight: 500, ml: 2 }}>
                                  Not available
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )
                      ) : null}
                    </>
                  )
                })}
              </>
            ) : (
              <>
                <Typography mr={2} variant='inherit' sx={{ pl: 3 }}>
                  RERA analytics
                </Typography>
                <Box
                  sx={{
                    pb: 4,
                    pt: 4,
                    pl: 5,
                    mt: 4,
                    pr: 3
                  }}
                >
                  <Box>
                    <Typography align='left' variant='body2'>
                      RERA not registered
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </div>
        </div>
      )}
    </Drawer>
  )
}
export default DrawerData
