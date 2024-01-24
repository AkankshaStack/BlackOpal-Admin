/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { Fragment, useEffect, useRef, useState } from 'react'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'

// ** Icons Imports
// ** Data Imports
import Documents from 'src/pages/components/documents-customer-champion'
import ReraCertificates from 'src/pages/components/documents-customer-champion/rera-certificates'
import ReviewProfile from 'src/pages/components/documents-customer-champion/reviewProfile'
import { CircularProgress, useMediaQuery } from '@mui/material'
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  StepButton,
  TextField
} from '@mui/material'
import Typography from '@mui/material/Typography'
import { Close } from 'mdi-material-ui'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { approved, fetchsingleData, patchApprove, setActiveStep, reset } from 'src/store/apps/user'
import { LoadingButton } from '@mui/lab'
import id from 'date-fns/esm/locale/id/index.js'
import config from 'src/configs/config'

interface state {
  visible: boolean
  action: string
  declinedReason?: string
}

// Based on the role we need to make first stepper name dynamic also one cloumn.
const StepperAlternativeLabel = () => {
  const router = useRouter()

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.user)
  const { activeStep, stepNotes } = store
  const { maxVerifiedStep } = store
  const [personName, setPersonName] = useState<any>([])
  const [error, setError] = useState<any>({})
  const [open, setOpen] = useState<boolean>(false)
  const [documentData, setDocumentData] = useState<any[]>([])

  // const [inputValue, setInputValue] = useState<string>('')
  const [inputValue, setInputValue] = useState<string[]>([])
  const ref = useRef()

  useEffect(() => {
    if (stepNotes[activeStep]?.length > 0) {
      // setInputValue(stepNotes[activeStep])
      setInputValue(stepNotes[activeStep].split('\n'))
    }
    if (activeStep === steps?.length - 1) {
      const unique: string[] = []

      // This ciode will be removed once we have recived unique reasone of the every step
      stepNotes.map((arr: string) => {
        const check1 = arr.split('\n')
        check1.map((val1: string) => {
          if (!unique.includes(val1)) {
            unique.push(val1)
          }
        })
      })
      setPersonName(unique)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep])

  const steps = [

    {
      title: 'Document'
    },

    {
      title: 'RERA Certificate'
    },

    {
      title: 'Review Profile'
    }
  ]

  // ** States
  const [show, setShow] = useState<state>({
    visible: false,
    action: '',
    declinedReason: ''
  })
  const declinedReason = ['The Documents are not valid', 'The Pan Provided is invalid', 'Rera Certificate is not valid']

  useEffect(() => {
    const { id } = router.query
    if (!id) {
      router.push('/')
    } else {
      dispatch(
        fetchsingleData({
          id,
          payload: {
            include: 'company,userDetails,certificates,microMarketAddress'
          }
        })
      )
    }

    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const arr = []
    if (store?.singleData?.panCertificates?.length > 0) {
      arr?.push({ ...store?.singleData?.panCertificates[0], type: config?.certificates?.type?.pan })
    }
    if (store?.singleData?.gstCertificates?.length > 0) {
      arr?.push({ ...store?.singleData?.gstCertificates[0], type: config?.certificates?.type?.gst })
    }
    if (store?.singleData?.aadhaarCertificate?.length > 0) {
      arr?.push({ ...store?.singleData?.aadhaarCertificate[0], type: config?.certificates?.type?.aadhar })
    }
    if (store?.singleData?.cinCertificate?.length > 0) {
      arr?.push({ ...store?.singleData?.cinCertificate[0], type: config?.certificates?.type?.cin })
    }
    setDocumentData(arr)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.singleData])

  const handleApprove = () => {
    const orgType = store?.singleData?.userDetails?.orgType
    const payload = [
      {
        verificationType: 'certificate',
        type: orgType == config.orgType.company ? 3 : 2,
        status: 1,
        reason: ''
      },
      {
        verificationType: 'certificate',
        type: 1,
        status: 1,
        reason: ''
      },
      {
        verificationType: 'profile',
        status: 1,
        reason: ''
      }
    ]

    dispatch(
      patchApprove({
        payload
      })
    )
  }

  const onSubmit = () => {
    // let type = 0
    // const orgType = store?.singleData?.userDetails?.orgType
    // if (activeStep === 0) {
    //   type = orgType == 1 ? 2 : 3
    // } else if (activeStep === 1) {
    //   type = 1
    // } else if (activeStep === 2) {
    //   type = 0
    // }
    // {
    //   verificationType: 'company',
    //   type: orgType == 1 ? 2 : 3,
    //   status: 0,
    //   reason: data.declineReason
    // },
    const payload = [
      {
        verificationType: 'profile',
        status: 0,
        reason: ''
      }
    ]
    if (personName.indexOf('Other') >= 0) {
      payload[0].reason = show.declinedReason || ''
    } else {
      payload[0].reason = personName.join('\n')
    }

    dispatch(
      patchApprove({
        payload
      })
    )
  }

  const setDisable = () => {
    if (activeStep === 0) {
      if (documentData?.length === 0) {
        return true
      } else {
        return false
      }
    } else if (activeStep === 1) {
      return Boolean(store?.singleData?.reraCertificates?.length === 0)
    }

    return false
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Documents key={step} documentData={documentData} />
      case 1:
        return <ReraCertificates key={step} />
      case 2:
        return <ReviewProfile key={step} />
      default:
        return ''
    }
  }
  const handleNext = (index: number) => {
    if (index > maxVerifiedStep) {
      return
    } else {
      dispatch(setActiveStep(index))
    }
  }

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    if (event.target.value.indexOf('Other') >= 0) {
      if (personName.length === 1 && personName[0] === 'Other' && event.target.value.length > 1) {
        const data = event.target.value
        data.splice(event.target.value.indexOf('Other'), 1)
        setPersonName(data)
      } else {
        setPersonName(['Other'])
        setOpen(false)
      }

      return
    } else {
      const {
        target: { value }
      } = event
      setPersonName(typeof value === 'string' ? value.split(',') : value)
    }
  }
  const handleClose = () => setOpen(false)

  const handleOpen = () => setOpen(true)

  const renderContent = () => {
    if (activeStep === steps.length) {
      return null
    } else {
      return (
        <form onSubmit={e => e.preventDefault()}>
          <Grid container>
            {getStepContent(activeStep)}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  p: 1,
                  m: 1,
                  bgcolor: 'background.paper'
                }}
              >
                {activeStep === 2 ? (
                  <>
                    <Button
                      style={{ marginRight: '16px', textTransform: 'initial' }}
                      size='large'
                      variant='outlined'
                      color='error'
                      onClick={() =>
                        setShow({
                          visible: true,
                          action: 'decline',
                          declinedReason: ''
                        })
                      }
                      disabled={setDisable()}
                    >
                      Decline
                    </Button>
                    <LoadingButton
                      loading={store.loading}
                      onClick={() =>
                        setShow({
                          visible: true,
                          action: 'approve'
                        })
                      }
                      size='large'
                      style={{ textTransform: 'initial' }}
                      variant='contained'
                      disabled={setDisable()}
                    >
                      {activeStep === steps.length - 1 ? 'Approve' : 'Approve & Next'}
                    </LoadingButton>
                  </>
                ) : (
                  <>
                    {/* 
                    <div><TextField
                    InputLabelProps={{ shrink: true }}
                    value={inputValue}
                    rows={4}
                    style={{ marginTop: '2px', marginLeft: '10px', width: '100%', marginBottom: '20px' }}
                    multiline
                    fullWidth
                    required
                    label='Notes'
                    onChange={e => {
                      setInputValue(e.target.value)
                    }}
                    placeholder='Notes'
                    aria-describedby='validation-basic-last-name'
                  />
                  </div>  */}
                    {/* <FormControl>
                      <InputLabel>Notes</InputLabel>
                      <Select
                        multiple
                        value={inputValue}
                        fullWidth
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        onChange={(e: SelectChangeEvent<typeof inputValue>) =>
                          setInputValue(e.target.value as string[])
                        }
                        ref={ref}
                        style={{ width: 300 }}
                        input={<OutlinedInput label='Notes' />}
                        renderValue={selected => {
                          return selected.join(', ')
                        }}
                        aria-describedby='validation-basic-first-name'
                      >
                        {declinedReason.map(name => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={inputValue.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    {/* <LoadingButton
                      loading={store.loading}
                      onClick={() => {
                        dispatch(
                          approved({
                            notes: inputValue.join('\n')
                          })
                        )

                        // setInputValue('')
                        setInputValue([])
                      }}
                      size='large'
                      style={{ textTransform: 'initial', marginLeft: '10px' }}
                      variant='contained'
                      disabled={setDisable()}
                    >
                      Next
                    </LoadingButton> */}
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      )
    }
  }

  return (
    <Fragment>
      {store?.loading ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Fragment>
         
          <Card sx={{ mt: 5 }}>
            <CardContent style={{ padding: 0 }}>{renderContent()}</CardContent>
          </Card>
          <Dialog
            fullWidth
            open={show.visible}
            maxWidth='xs'
            scroll='body'
            onClose={() => {
              setShow({
                visible: false,
                action: '',
                declinedReason: ''
              })
              setPersonName([])
            }}
            onBackdropClick={() => {
              setShow({
                visible: false,
                action: '',
                declinedReason: ''
              })
              setPersonName([])
            }}
            aria-labelledby='confirm-dialog'
          >
            <h4 style={{ textAlign: 'center', padding: '0 10px' }}>
              {show.action === 'decline' ? ' Reason for declining' : 'Are you sure you want to approve ?'}
            </h4>

            <IconButton
              sx={{ float: 'right', right: 10, top: 10, position: 'absolute' }}
              onClick={() => {
                setShow({
                  visible: false,
                  action: '',
                  declinedReason: ''
                })
                setPersonName([])
              }}
            >
              <Close />
            </IconButton>

            {show.action === 'decline' && (
              <DialogContent>
                {steps?.map((val, index) => (
                  <div key={index}>
                    {index < steps?.length - 1 ? (
                      <Fragment>
                        {stepNotes[index].split('\n')[0].trim().length > 0 && (
                          <>
                            <h4 style={{ marginTop: '10px', marginBottom: '10px' }}>{`${val?.title} (Notes)`}</h4>
                            {/* <Typography variant='body1'>{stepNotes[index]}</Typography> */}
                            <ul>
                              {stepNotes[index].split('\n').map((value: string, index: number) => (
                                <li key={`kkk${index}`}>
                                  <Typography variant='body1'>{value}</Typography>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </Fragment>
                    ) : null}
                  </div>
                ))}
                <FormControl fullWidth style={{ marginTop: '20px' }}>
                  <InputLabel>Declining Reason</InputLabel>
                  <Select
                    multiple
                    value={personName}
                    fullWidth
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    onChange={handleChange}
                    ref={ref}
                    input={<OutlinedInput label='Declined Reason' />}
                    renderValue={selected => {
                      return selected.join(', ')
                    }}
                    aria-describedby='validation-basic-first-name'
                  >
                    {declinedReason.map(name => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={personName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                    <MenuItem value='Other'>
                      <Checkbox checked={personName.indexOf('Other') > -1} />
                      <ListItemText primary='Other' />
                    </MenuItem>
                  </Select>
                  {personName.indexOf('Other') >= 0 && (
                    <TextField
                      label='Reason for declining'
                      value={show.declinedReason}
                      multiline
                      minRows={4}
                      required
                      style={{ marginTop: '40px' }}
                      onChange={e =>
                        setShow(prev => ({
                          ...prev,
                          declinedReason: e.target.value
                        }))
                      }
                    />
                  )}
                </FormControl>
              </DialogContent>
            )}
            <DialogActions sx={{ mt: 7 }}>
              {show.action === 'decline' ? (
                <>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      setShow({
                        visible: false,
                        action: '',
                        declinedReason: ''
                      })
                      setPersonName([])
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant='contained'
                    loading={store.loading}
                    disabled={Boolean(
                      personName.length === 0 ||
                        (personName.indexOf('Other') >= 0 && show?.declinedReason?.trim()?.length === 0)
                    )}
                    onClick={() => onSubmit()}
                  >
                    Send
                  </LoadingButton>
                </>
              ) : (
                <>
                  <Button
                    variant='contained'
                    onClick={() => {
                      setShow({
                        visible: false,
                        action: '',
                        declinedReason: ''
                      })
                      setPersonName([])
                    }}
                    color='secondary'
                  >
                    No
                  </Button>
                  <Button
                    variant='contained'
                    style={{
                      marginLeft: '15px'
                    }}
                    onClick={() => {
                      handleApprove()

                      setShow({
                        visible: false,
                        action: '',
                        declinedReason: ''
                      })
                      setPersonName([])
                    }}
                    color='primary'
                  >
                    Yes
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </Fragment>
  )
}

export default StepperAlternativeLabel
