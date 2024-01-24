import { LoadingButton } from '@mui/lab'
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import config from 'src/configs/config'
import { AppDispatch } from 'src/store'
import { verifyLead } from 'src/store/leads'
import { CustomDialog } from '../dialog/CustomDialog'

interface IcloseLead {
  show: {
    visible: boolean
    status: number
    data: any
    declineReason?: string
  }
  loading?: boolean
  setShow: (param: { visible: boolean; status: number; data: any; declineReason?: string }) => void
  callback: () => void
}

export const CloseLeadDialog = ({ show, setShow, callback, loading }: IcloseLead) => {
  const dispatch = useDispatch<AppDispatch>()
  const [personName, setPersonName] = useState<any>([])
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)
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
  const reason = [
    'Certificate Provided is valid',
    'All the conflcit is resoled with the user',
    'User is valid and authorized',
    'Account is Verified'
  ]
  const defaultValues = {
    declineReason: ''
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormInputs>({ defaultValues })
  interface FormInputs {
    declineReason: string
  }
  const onSubmit = (data: FormInputs) => {
    const payload: {
      status?: number
      verificationStatus?: number
      docs?: string[]
      unitSize?: number
      inclusivePriceInPaise?: number
      closeReason?: string
      rejectReason?: string | null
    } = {
      verificationStatus: show.status,
      closeReason: show?.data?.closeReason
    }

    if (show?.data?.status === config?.leads?.status?.Sold) {
      const data = show?.data?.docs?.map((val: string) => {
        let slug = val.split('?X-Amz')[0]
        slug = slug.split('.com/')[1]

        return slug
      })
      payload.docs = data
      payload.unitSize = show?.data?.unitSize
      payload.inclusivePriceInPaise = show?.data?.inclusivePriceInPaise
    }
    if (show.status === config?.leads?.verificationStatus?.Rejected) {
      if (personName.indexOf('Other') >= 0) {
        payload.rejectReason = data.declineReason || ''
      } else {
        payload.rejectReason = personName.join('\n')
      }
    } else {
      payload.rejectReason = null
    }

    dispatch(
      verifyLead({
        id: show?.data?.id,
        data: payload
      })
    ).then(res => {
      if (res?.payload?.code === 200) {
        if (show.status === config?.leads?.verificationStatus?.Rejected) {
          toast.success('Lead rejected successfully')
        } else if (show.status === config?.leads?.verificationStatus?.Verified) {
          toast.success('Lead verified successfully')
        }
        setShow({ visible: false, status: 0, data: {} })
        callback()
        setPersonName([])
      }
    })
  }

  return (
    <CustomDialog
      title={
        show?.status === config?.leads?.verificationStatus?.Verified
          ? 'Are you sure you want to approve?'
          : 'Reason for declining'
      }
      show={show?.visible}
      buttonprop={{
        loading: loading
      }}
      setShow={() => {
        setShow({
          visible: false,
          status: 0,
          data: {}
        })
        setPersonName([])
      }}
      dialogContent={
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {show?.status === config?.leads?.verificationStatus?.Rejected ? (
            <DialogContent>
              <DialogContentText>
                <FormControl fullWidth>
                  <InputLabel required>Decline reason</InputLabel>
                  <Select
                    multiple
                    value={personName}
                    fullWidth
                    open={open}
                    required
                    onClose={handleClose}
                    onOpen={handleOpen}
                    onChange={handleChange}
                    input={<OutlinedInput label='Decline reason' />}
                    renderValue={selected => {
                      return selected.join(', ')
                    }}
                    aria-describedby='validation-basic-first-name'
                  >
                    {reason.map(name => (
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
                </FormControl>
                {personName.indexOf('Other') >= 0 && (
                  <FormControl fullWidth sx={{ mt: 4 }}>
                    <Controller
                      name='declineReason'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          value={value}
                          rows={4}
                          style={{ marginTop: '2px' }}
                          multiline
                          required
                          label='Decline reason'
                          onChange={e => {
                            onChange(e)
                          }}
                          placeholder='Decline reason'
                          error={Boolean(errors.declineReason)}
                          aria-describedby='validation-basic-last-name'
                        />
                      )}
                    />
                    {errors.declineReason && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-textarea'>
                        {errors?.declineReason?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              </DialogContentText>
            </DialogContent>
          ) : null}

          <DialogActions>
            <Button
              variant='contained'
              onClick={() => {
                setShow({
                  visible: false,
                  status: 0,
                  data: {}
                })
                setPersonName([])
              }}
              color='secondary'
            >
              No
            </Button>
            <LoadingButton
              variant='contained'
              type='submit'
              color='primary'
              loading={loading}
              disabled={
                show?.status === config?.leads?.verificationStatus?.Rejected
                  ? Boolean(
                      personName.length === 0 ||
                        (personName.indexOf('Other') >= 0 && watch('declineReason').trim()?.length === 0)
                    )
                  : false
              }
            >
              Yes
            </LoadingButton>
          </DialogActions>
        </form>
      }
      action
    />
  )
}
