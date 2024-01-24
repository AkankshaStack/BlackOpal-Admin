import { FC, Fragment, useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Card,
  Tooltip,
  Button,
  CardContent,
  CircularProgress,
  Divider,
  useMediaQuery,
  Theme
} from '@mui/material'
import { CurrencyInr, FileDocumentOutline } from 'mdi-material-ui'

// import Rating from '@mui/material/Rating'
import {
  leadStatusConversion,
  leadStatusColor,
  leadVerificationStatusColor,
  leadVerificationStatusConversion,
  ruppeeConversation,
  homeLoanPartnerColorConversion,
  homeLoanPartnerStatusConversion,
  toDataURL
} from 'src/utilities/conversions'
import { AppDispatch, RootState } from 'src/store'
import { leadDetails } from 'src/store/leads'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import CardDocument from 'src/views/ui/cards/document/CardDocument'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import Header from 'src/views/components/header'
import { useRouter } from 'next/router'
import config from 'src/configs/config'
import DrawerData from 'src/views/property/side-drawer'
import { CloseLeadDialog } from 'src/views/components/closelead-dialog'

interface FileProp {
  name: string
  type?: string
  size?: number
  url?: string
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ILeadInfo {}

const handleValuePrint = (data: any, onClick?: () => void) =>
  data ? (
    <Typography
      sx={{ fontWeight: 600, wordBreak: 'break-all', textTransform: 'capitalize' }}
      variant='subtitle1'
      onClick={onClick}
    >
      {data}
    </Typography>
  ) : (
    <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
      Not Available
    </Typography>
  )

const LeadInfo: FC<ILeadInfo> = () => {
  const [images, setImages] = useState<FileProp[]>([])

  const [show, setShow] = useState<{
    visible: boolean
    status: number
    data: any
    declineReason?: string
  }>({
    visible: false,
    status: 0,
    data: {}
  })

  const { leadData, loading, verifyLoading }: { leadData: any; loading: boolean; verifyLoading: boolean } = useSelector(
    (state: RootState) => state.leads
  )

  const dispatch = useDispatch<AppDispatch>()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const router = useRouter()
  const { id } = router.query
  const [openImage, setOpenImage] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [openDrawer, setopenDrawer] = useState({
    visible: false,
    id: ''
  })

  useEffect(() => {
    if (id) {
      dispatch(
        leadDetails({
          id: id as string,
          payload: {
            include: 'teamMember,customer,property,userPreference,configuration'
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (leadData?.id) {
      const img: FileProp[] = []

      leadData?.docs?.map((val: string) => {
        let slug = val.split('?X-Amz')[0]
        slug = slug.split('.com/')[1]

        img.push({
          name: slug,
          url: val
        })
      })
      setImages(img)
    }
  }, [leadData])

  const viewFile = (file: FileProp) => {
    if (file?.type?.includes('pdf') || file?.url?.includes('.pdf')) {
      const url = file?.url ? file?.url : window.URL.createObjectURL(file as any)
      const viewLink = document.createElement('a')
      document.body.appendChild(viewLink)
      viewLink.href = url
      viewLink.target = '_blank'
      viewLink.click()

      return
    }
    setOpenImage({
      visible: true,
      url: file?.url ? file?.url : URL.createObjectURL(file as any)
    })
  }

  const downloadFile = async (file: FileProp) => {
    if (file?.url) {
      await toDataURL(file?.url, (dataUrl: any) => {
        const link = document.createElement('a')
        link.href = dataUrl
        link.setAttribute('download', 'document')
        document.body.appendChild(link)
        link.click()
      })

      return
    }
  }

  const renderFilePreview = (file: FileProp) => {
    if (file?.type?.startsWith('image') || !file?.name.includes('.pdf')) {
      return (
        <img
          width={38}
          height={38}
          alt={file.name}
          className='upload-image'
          src={file?.url ? file?.url : URL.createObjectURL(file as any)}
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
    <Fragment>
      {loading ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{ p: 2 }}>
          <Header name={`#${leadData?.refId || '-'}`} />
          <CardContent sx={{ ml: hidden ? 0 : 3 }}>
            <Grid container spacing={4}>
              <Grid container spacing={10}>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Customer name</Typography>
                  {handleValuePrint(`${leadData?.customer?.firstName || ''} ${leadData?.customer?.lastName || ''}`)}
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Team member name</Typography>
                  {handleValuePrint(
                    `${leadData?.teamMember?.firstName || ''} ${leadData?.teamMember?.lastName || ''}`,
                    () => {
                      const test = window.location.href.split('/')

                      router.push({
                        pathname: `/team-members/profile/${leadData?.teamMember?.agentInfo?.id}`,
                        query: { from: router?.query?.from ? router?.query?.from : test[test.length - 2] }
                      })
                    }
                  )}
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Project name</Typography>
                  {handleValuePrint(leadData?.property?.name, () => {
                    setopenDrawer({
                      visible: true,
                      id: leadData?.property?.id
                    })
                  })}
                </Grid>
                {leadData?.verificationStatus && (
                  <Grid item xs={12} sm={4} md={3}>
                    <Typography variant='body2'>Verification status</Typography>
                    <CustomChip
                      skin='light'
                      size='small'
                      variant='outlined'
                      sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                      color={leadVerificationStatusColor(leadData?.verificationStatus)}
                      label={leadVerificationStatusConversion(leadData?.verificationStatus)}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Status</Typography>
                  <CustomChip
                    skin='light'
                    size='small'
                    variant='outlined'
                    sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                    color={leadStatusColor(leadData?.status)}
                    label={leadStatusConversion(leadData?.status)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Saleable area</Typography>
                  {handleValuePrint(`${leadData?.configuration?.sellableAreaInSqft} sqft`)}
                </Grid>
                {(leadData?.status === config?.leads?.status.Sold ||
                  leadData?.status === config?.leads?.status.Lost) && (
                  <Fragment>
                    <Grid item xs={12} sm={4} md={3}>
                      <Typography variant='body2'>Configuration</Typography>
                      {handleValuePrint(config?.properties?.configurations[leadData?.configuration?.configuration])}
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                      <Typography variant='body2'>All inclusive price INR</Typography>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                        {handleValuePrint(ruppeeConversation(leadData?.inclusivePriceInPaise))}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                      <Typography variant='body2'>Unit size (saleable area)</Typography>
                      {handleValuePrint(leadData?.unitSize)}
                    </Grid>
                  </Fragment>
                )}
                <Grid item xs={12}>
                  <Typography
                    sx={{ fontWeight: 600, wordBreak: 'break-all', textTransform: 'capitalize' }}
                    variant='subtitle1'
                  >
                    Preference Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>City</Typography>
                  {handleValuePrint(leadData?.userPreference?.city?.name)}
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Price range</Typography>
                  {leadData?.userPreference?.minPriceInPaise ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CurrencyInr sx={{ fontSize: '1.1rem' }} />
                      {handleValuePrint(
                        `${ruppeeConversation(leadData?.userPreference?.minPriceInPaise || 0)} - ${ruppeeConversation(
                          leadData?.userPreference?.maxPriceInPaise || 0
                        )}`
                      )}
                    </div>
                  ) : (
                    <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
                      Not Available
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Earnest money status</Typography>
                  {handleValuePrint(
                    config?.preferences?.earnestMoneyStatus[leadData?.userPreference?.earnestMoneyStatus]
                  )}
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Home loan status</Typography>
                  <CustomChip
                    skin='light'
                    size='small'
                    variant='outlined'
                    sx={{
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { lineHeight: '18px' }
                    }}
                    color={homeLoanPartnerColorConversion(leadData?.userPreference?.homeLoanStatus)}
                    label={homeLoanPartnerStatusConversion(leadData?.userPreference?.homeLoanStatus)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Bedroom</Typography>
                  {leadData?.userPreference?.noOfBedrooms.length > 0 ? (
                    leadData?.userPreference?.noOfBedrooms.map((item: number) => {
                      return (
                        <CustomChip
                          key={item}
                          skin='light'
                          size='small'
                          variant='outlined'
                          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' }, m: 1 }}
                          color='secondary'
                          label={config?.preferences?.noOfBedrooms[item]}
                        />
                      )
                    })
                  ) : (
                    <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
                      Not Available
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Build up area</Typography>
                  {leadData?.userPreference?.minBuiltupAreaInSqft ? (
                    handleValuePrint(
                      `${leadData?.userPreference?.minBuiltupAreaInSqft || 0} sqft - ${
                        leadData?.userPreference?.maxBuiltupAreaInSqft || 0
                      } sqft`
                    )
                  ) : (
                    <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
                      Not Available
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Typography variant='body2'>Selling old property</Typography>
                  {leadData?.userPreference ? (
                    handleValuePrint(leadData?.userPreference?.sellingOldProperty ? 'Yes' : 'No')
                  ) : (
                    <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
                      Not Available
                    </Typography>
                  )}
                </Grid>
                {/* <Grid item xs={12} sm={4} md={3}>
                <Typography variant='body2'>Rating</Typography>
                <Rating precision={0.5} readOnly value={2.4} name='read-only' />
                </Grid> */}
                <Grid item xs={12}>
                  <Typography variant='body2'>Kind of properties</Typography>
                  {leadData?.userPreference?.propertyType?.length > 0 ? (
                    leadData?.userPreference?.propertyType?.map((val: number) => (
                      <CustomChip
                        skin='light'
                        key={val}
                        size='small'
                        variant='outlined'
                        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' }, m: 1 }}
                        color={'info'}
                        label={config?.properties?.propertyType[val]}
                      />
                    ))
                  ) : (
                    <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
                      Not Available
                    </Typography>
                  )}
                </Grid>
                {(leadData?.status === config?.leads?.status.Sold ||
                  leadData?.status === config?.leads?.status.Lost ||
                  leadData?.verificationStatus === config?.leads?.verificationStatus.Correction) && (
                  <Fragment>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography variant='body2'>Close reason</Typography>
                      {handleValuePrint(leadData?.closeReason)}
                    </Grid>
                  </Fragment>
                )}
                {(leadData?.status === config?.leads?.status.Sold ||
                  leadData?.status === config?.leads?.status.Lost ||
                  leadData?.verificationStatus === config?.leads?.verificationStatus.Correction) &&
                leadData?.rejectReason?.length > 0 ? (
                  <Grid item xs={12}>
                    <Typography variant='body2'>Reject reason</Typography>
                    {handleValuePrint(leadData?.rejectReason)}
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            {leadData?.status === config?.leads?.status?.Sold && (
              <Fragment>
                <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
                <Grid container sm={12} spacing={10} sx={{ mt: 1 }}>
                  <Grid item xs={12} sx={{ pt: 4 }}>
                    <Grid xs={12}>
                      <Box sx={{ mb: 4 }}>
                        <Tooltip title={`Uploaded Images`}>
                          <Typography sx={{ width: 'fit-content' }} noWrap>
                            Uploaded Files
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      {images?.length > 0 &&
                        images.map((file: FileProp, index: number) => (
                          <>
                            <CardDocument
                              key={index}
                              index={index}
                              file={file}
                              renderPreview={renderFilePreview}
                              viewAction={viewFile}
                              downloadAction={downloadFile}
                            />
                          </>
                        ))}
                    </Box>
                  </Grid>
                </Grid>
              </Fragment>
            )}

            {leadData?.verificationStatus === config?.leads?.verificationStatus?.Applied &&
              leadData?.status === config?.leads?.status.Sold && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    width: '100%',
                    rowGap: '20px',

                    mt: 4
                  }}
                >
                  <Button
                    variant='outlined'
                    color='error'
                    sx={{ mr: 2 }}
                    onClick={() =>
                      setShow({
                        visible: true,
                        status: config?.leads?.verificationStatus?.Rejected,
                        data: leadData
                      })
                    }
                  >
                    Decline
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => {
                      setShow({
                        visible: true,
                        status: config?.leads?.verificationStatus?.Verified,
                        data: leadData
                      })
                    }}
                  >
                    Approve
                  </Button>
                </Box>
              )}
          </CardContent>
        </Card>
      )}
      <CloseLeadDialog
        show={show}
        setShow={setShow}
        callback={() => {
          router.back()
        }}
        loading={verifyLoading}
      />
      <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />
      <ImagePreview open={openImage} setOpen={setOpenImage} />
    </Fragment>
  )
}

export default LeadInfo
