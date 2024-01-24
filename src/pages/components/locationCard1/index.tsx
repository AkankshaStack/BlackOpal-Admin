import React, { useEffect, useState } from 'react'
import { FormControl, FormHelperText, Grid, TextField, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { fetchCity, fetchState } from 'src/configs/location'

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
  disables?: boolean
  isMicroMarket?: boolean
  isLocation?: boolean
  customSet?: () => void
}

const spacing = 6

interface ICityId {
  id: number
  name: string
}

const LocationCard1 = (props: IProps) => {
  const store = useSelector((state: any) => state.property)
  const [stateLoading, setStateLoading] = useState<boolean>(false)
  const [cityLoading, setCityLoading] = useState<boolean>(false)
  const [state, setState] = useState<any>([])
  const [city, setCity] = useState<any>([])
  const [cityID, setCityID] = useState<ICityId>({
    name: '',
    id: 0
  })

  useEffect(() => {
    if (props.isLocation) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityID])

  return (
    <Grid container item xs={12} sm={12} spacing={spacing}>
      <React.Fragment>
        <Grid container item xs={12} sm={props?.isLocation ? 12 : 6} spacing={spacing}>
          <Grid item xs={12} sm={props?.isLocation ? 4 : 6}>
            <FormControl fullWidth variant='outlined'>
              <Controller
                name={`${props.name}.countryId`}
                control={props.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    <Autocomplete
                      id='combo-box-demo'
                      {...field}
                      options={store?.country}
                      disableClearable
                      getOptionLabel={(option: any) => option.name}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Country'
                          variant='outlined'
                          required
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(props.errors[props.name]?.countryId)}
                        />
                      )}
                      onChange={(event, newValue) => {
                        fetchState({
                          data: {
                            countryId: newValue.id
                          },
                          setStateLoading,
                          setState
                        })
                        props.setValue(`${props.name}.stateId`, {
                          id: 0,
                          name: ''
                        })
                        props.setValue(`${props.name}.cityId`, {
                          id: 0,
                          name: ''
                        })
                        if (!props?.isLocation) {
                          props.setValue(`${props.name}.pincode`, '')
                        }
                        if (props?.isMicroMarket) {
                          props.setValue(`projectMicroMarket`, [])
                        }
                        if (props?.customSet) {
                          props?.customSet()
                        }
                        field.onChange(newValue)
                      }}
                    />
                  </>
                )}
              />
              {props.errors[props.name]?.countryId && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                  Please select Country
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={props?.isLocation ? 4 : 6}>
            <FormControl fullWidth>
              <Controller
                name={`${props.name}.stateId`}
                control={props.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Autocomplete
                    id='combo-box-demo'
                    {...field}
                    disableClearable
                    loading={stateLoading}
                    onOpen={() => {
                      fetchState({
                        data: {
                          countryId: props.watch(`${props.name}.countryId.id`)
                        },
                        setStateLoading,
                        setState
                      })
                    }}
                    onChange={(event, newValue) => {
                      fetchCity({
                        data: {
                          stateId: newValue.id
                        },
                        setCityLoading,
                        setCity
                      })
                      setCityID({
                        id: 0,
                        name: ''
                      })
                      if (props?.customSet) {
                        props?.customSet()
                      }
                      props.setValue(`${props.name}.cityId`, {
                        id: 0,
                        name: ''
                      })
                      if (props?.isMicroMarket) {
                        props.setValue(`projectMicroMarket`, [])
                      }
                      if (!props?.isLocation) {
                        props.setValue(`${props.name}.pincode`, '')
                      }

                      field.onChange(newValue)
                    }}
                    readOnly={!(props.watch(`${props.name}.countryId.id`) > 0)}
                    options={state}
                    getOptionLabel={(option: any) => option.name}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='State'
                        variant='outlined'
                        required
                        InputLabelProps={{ shrink: true }}
                        disabled={!(props.watch(`${props.name}.countryId.id`) > 0)}
                        error={Boolean(props.errors[props.name]?.stateId)}
                      />
                    )}
                  />
                )}
              />
              {props.errors[props.name]?.stateId && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  Please select State
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={props?.isLocation ? 4 : 6}>
            <FormControl fullWidth disabled={!(props.watch(`${props.name}.stateId.id`) > 0)}>
              <Controller
                name={`${props.name}.cityId`}
                control={props.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Autocomplete
                    id='combo-box-demo'
                    {...field}
                    loading={cityLoading}
                    disableClearable
                    onOpen={() => {
                      fetchCity({
                        data: {
                          stateId: props.watch(`${props.name}.stateId.id`)
                        },
                        setCityLoading,
                        setCity
                      })
                      setCityID({
                        id: 0,
                        name: ''
                      })
                    }}
                    onChange={(event, newValue) => {
                      if (!props?.isLocation) {
                        props.setValue(`${props.name}.pincode`, '')
                      }
                      if (props?.isMicroMarket) {
                        props.setValue(`projectMicroMarket`, [])
                      }
                      field.onChange(newValue)
                      if (props?.customSet) {
                        props?.customSet()
                      }
                      setCityID(newValue)
                    }}
                    readOnly={!(props.watch(`${props.name}.stateId.id`) > 0)}
                    options={city?.length > 0 ? city : []}
                    getOptionLabel={(option: any) => option.name}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='City'
                        variant='outlined'
                        required
                        disabled={!(props.watch(`${props.name}.stateId.id`) > 0)}
                        error={Boolean(props.errors[props.name]?.cityId)}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                )}
              />
              {props.errors[props.name]?.cityId && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-textarea'>
                  Please select City
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          {!props?.isLocation && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!(props.watch(`${props.name}.cityId.id`) > 0)}>
                <Controller
                  name={`${props.name}.pincode`}
                  control={props.control}
                  rules={{
                    required: true,
                    pattern: /^[1-9]\d{5}$/
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      InputProps={{
                        inputProps: {
                          maxLength: 6
                        }
                      }}
                      required
                      InputLabelProps={{ shrink: true }}
                      label='Pincode'
                      error={Boolean(props.errors[props.name]?.pincode)}
                      aria-describedby='validation-basic-textarea'
                    />
                  )}
                />

                {props.errors[props.name]?.pincode && (
                  <>
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-textarea'>
                      {props.errors[props.name]?.pincode?.message}
                    </FormHelperText>
                  </>
                )}
              </FormControl>
            </Grid>
          )}
        </Grid>
        {!props?.isLocation && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name={`${props.name}.address`}
                control={props.control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    value={value}
                    rows={4}
                    style={{ marginTop: '2px' }}
                    multiline
                    required
                    label={props.addressLabel}
                    onChange={onChange}
                    placeholder='Address'
                    error={Boolean(props.errors[props.name]?.address)}
                    aria-describedby='validation-basic-last-name'
                  />
                )}
              />
              {props.errors[props.name]?.address && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-textarea'>
                  Please enter Address
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}
      </React.Fragment>
    </Grid>
  )
}

export default LocationCard1
