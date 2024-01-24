import { useState } from 'react'

import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material'
import { EyeOutline, EyeOffOutline } from 'mdi-material-ui'
import * as Yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { changePassword, resetFormErors } from 'src/store/apps/user'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab'

interface requiredFields {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const Resetpassword = () => {
  const [values, setValues] = useState<any>({
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false,
    showoldPassword: false
  })
  const defaultValues: requiredFields = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const store = useSelector((state: any) => state.user)

  const formErrors = store.formErrors

  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = (data: any) => {
    dispatch(changePassword(data))
  }
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleClickShowConfirmOldPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }
  const handleClickShowoldPassword = () => {
    setValues({ ...values, showoldPassword: !values.showoldPassword })
  }

  const schema = Yup.object().shape({
    oldPassword: Yup.string().strict(false).trim().required('Old Password is required.'),
    newPassword: Yup.string()
      .strict(false)
      .trim()
      .min(8, 'Password should be of minimum 8 characters.')
      .notOneOf([Yup.ref('oldPassword'), null], 'Current and new passwords should not be same')
      .required('New Password is required.'),
    confirmPassword: Yup.string()
      .strict(false)
      .trim()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .min(8, 'Password should be of minimum 8 characters.')
      .required('Confirm Password is required.')
  })

  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isDirty, isValid }
  } = useForm<requiredFields>({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  return (
    <Grid
      container
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Grid item xs={12} sm={5}>
        <Card sx={{ zIndex: 1 }}>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h5' sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}>
                Reset Password
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel
                  htmlFor='auth-reset-password-new-password'
                  error={Boolean(errors.oldPassword || formErrors.oldPassword)}
                >
                  Old Password
                </InputLabel>
                <Controller
                  name='oldPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      autoFocus
                      label='Old Password'
                      value={value}
                      id='auth-reset-password-new-password'
                      onChange={e => {
                        if (formErrors?.oldPassword) {
                          dispatch(resetFormErors('oldPassword'))
                        }
                        onChange(e)
                      }}
                      type={values.showoldPassword ? 'text' : 'password'}
                      error={Boolean(errors.oldPassword || formErrors.oldPassword)}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowoldPassword}
                            aria-label='toggle password visibility'

                            // onMouseDown={handleMouseDownNewPassword}
                          >
                            {values.showoldPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {(errors.oldPassword || formErrors.oldPassword) && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors?.oldPassword?.message || formErrors.oldPassword}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel
                  htmlFor='auth-reset-password-new-password'
                  error={Boolean(errors.newPassword || formErrors.newPassword)}
                >
                  New Password
                </InputLabel>
                <Controller
                  name='newPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      autoFocus
                      label='New Password'
                      value={value}
                      id='auth-reset-password-new-password'
                      onChange={e => {
                        onChange(e)
                        if (formErrors?.newPassword) {
                          dispatch(resetFormErors('newPassword'))
                        }
                        const { confirmPassword } = getValues()
                        if (confirmPassword === e.target.value) {
                          trigger('confirmPassword')
                        }
                      }}
                      type={values.showNewPassword ? 'text' : 'password'}
                      error={Boolean(errors.newPassword || formErrors.newPassword)}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            aria-label='toggle password visibility'

                            // onMouseDown={handleMouseDownNewPassword}
                          >
                            {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {(errors.newPassword || formErrors.newPassword) && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors?.newPassword?.message || formErrors.newPassword}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel
                  htmlFor='auth-reset-password-new-password'
                  error={Boolean(errors.confirmPassword || formErrors.confirmPassword)}
                >
                  Confirm Password
                </InputLabel>
                <Controller
                  name='confirmPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      autoFocus
                      label='Confirm Password'
                      value={value}
                      id='auth-reset-password-new-password'
                      onChange={e => {
                        if (formErrors?.confirmPassword) {
                          dispatch(resetFormErors('confirmPassword'))
                        }
                        onChange(e)
                      }}
                      type={values.showConfirmNewPassword ? 'text' : 'password'}
                      error={Boolean(errors.confirmPassword || formErrors.confirmPassword)}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowConfirmOldPassword}
                            aria-label='toggle password visibility'

                            // onMouseDown={handleMouseDownNewPassword}
                          >
                            {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {(errors.confirmPassword || formErrors.confirmPassword) && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors?.confirmPassword?.message || formErrors.confirmPassword}
                  </FormHelperText>
                )}
              </FormControl>
              <LoadingButton
                type='submit'
                variant='contained'
                sx={{ mb: 5.25 }}
                loading={store.loading}
                fullWidth
                disabled={!(isValid && isDirty)}
              >
                Change Password
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Resetpassword
