import React from 'react'
import { FormControl, Grid, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'

// ** Third Party Imports

// interface locationProp {
//   cityFeild: string
//   stateFeild: string
//   countryFeild: string
//   addressFeild: string
// }

interface IProps {
  control: any
  errors: any
  setValue: any
  name: string
  addressLabel: string
  fields?: any
  values: any
  watch: any
  disabled?: boolean
}

const spacing = 6

const LocationCard = (props: IProps) => {
  const disabledVal = props?.disabled === false ? false : true

  return (
    <Grid container item xs={12} sm={12} sx={{ mb: spacing }} spacing={spacing}>
      <React.Fragment>
        <Grid container item xs={12} sm={6} sx={{ mb: spacing }} spacing={spacing}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant='outlined'>
              <Controller
                name={`${props?.name}.countryId`}
                control={props?.control}
                rules={{ required: true }}
                render={({}) => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    value={props?.values?.country?.name}
                    disabled={disabledVal}
                    label='Country'
                    error={Boolean(props.errors.gstRegisteredAddress)}
                    aria-describedby='validation-basic-last-name'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={disabledVal}>
              <Controller
                name={`${props.name}.stateId`}
                control={props?.control}
                rules={{ required: true }}
                render={() => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    value={props?.values?.state?.name}
                    disabled={disabledVal}
                    label='State'
                    error={Boolean(props.errors.gstRegisteredAddress)}
                    aria-describedby='validation-basic-last-name'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={disabledVal}>
              <Controller
                name={`${props?.name}.cityId`}
                control={props?.control}
                rules={{ required: true }}
                render={() => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    value={props?.values?.city?.name}
                    label='City'
                    disabled={disabledVal}
                    error={Boolean(props.errors.gstRegisteredAddress)}
                    aria-describedby='validation-basic-last-name'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={disabledVal}>
              <Controller
                name={`${props?.name}.pincode`}
                control={props?.control}
                rules={{ required: true, pattern: /^[1-9]\d{5}$/, maxLength: 6 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={props?.values?.pincode}
                    InputProps={{
                      inputProps: {
                        maxLength: 6
                      }
                    }}
                    disabled={disabledVal}
                    InputLabelProps={{ shrink: true }}
                    type='number'
                    label='Pincode'
                    error={Boolean(props.errors[`${props.name}.pincode`])}
                    aria-describedby='validation-basic-textarea'
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='registerAddress'
              control={props.control}
              rules={{ required: true, pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/ }}
              render={() => (
                <TextField
                  disabled={disabledVal}
                  InputLabelProps={{ shrink: true }}
                  rows={4}
                  multiline
                  value={props?.values?.address}
                  label={props?.addressLabel}
                  error={Boolean(props.errors.gstRegisteredAddress)}
                  aria-describedby='validation-basic-last-name'
                />
              )}
            />
          </FormControl>
        </Grid>
      </React.Fragment>
    </Grid>
  )
}

export default LocationCard
