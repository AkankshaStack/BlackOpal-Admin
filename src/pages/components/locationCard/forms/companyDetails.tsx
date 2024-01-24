import React from 'react'
import { CardHeader, CardContent, Grid, TextField, FormControl } from '@mui/material'
import { Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import LocationCard from 'src/pages/components/locationCard'
import config from 'src/configs/config'

interface IProps {
  control?: any
  errors?: any
  setValue?: any
  values?: any
  register?: any
  watch?: any
}

const spacing = 6

const CompanyDetailsForm = (props: IProps) => {
  const store = useSelector((state: any) => state.user.singleData)

  return (
    <>
      <CardHeader title='Company Details' titleTypographyProps={{ variant: 'h3' }} />
      <CardContent>
        <Grid container sx={{ mb: spacing }} spacing={spacing}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled>
              <Controller
                name='name'
                control={props.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    disabled
                    value={
                      store?.userDetails?.orgType !== config.orgType.company
                        ? `${store?.userDetails?.firstName} ${store?.userDetails?.lastName}`
                        : store?.company?.name
                    }
                    InputLabelProps={{ shrink: true }}
                    label={store?.userDetails?.orgType !== config.orgType.company ? 'Name' : 'Company Name'}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            {store?.userDetails?.orgType === config.orgType.company && (
              <FormControl fullWidth disabled>
                <Controller
                  name='type'
                  control={props.control}
                  rules={{ required: true }}
                  render={() => (
                    <TextField
                      disabled
                      value={config.comapnyType[store?.company?.status]}
                      InputLabelProps={{ shrink: true }}
                      label='Company Type'
                    />
                  )}
                />
              </FormControl>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled>
              <Controller
                name='cinNumber'
                control={props.control}
                rules={{ required: true, pattern: /^[0-9A-za-z]*$/ }}
                render={() => (
                  <TextField
                    disabled
                    InputLabelProps={{ shrink: true }}
                    value={store?.company?.cinNumber}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    label='CIN Number'
                    aria-describedby='validation-basic-cin-numbeer'
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled>
              <Controller
                name='gstNumber'
                control={props.control}
                rules={{ required: true, pattern: /^[0-9A-Za-z]*$/, minLength: 15, maxLength: 15 }}
                render={() => (
                  <TextField
                    disabled
                    InputLabelProps={{ shrink: true }}
                    value={store?.company?.gstNumber}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    label='GST Number'
                    aria-describedby='validation-basic-email'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: spacing }} disabled>
              <Controller
                name='yearsInBusiness'
                control={props.control}
                rules={{ required: true, pattern: /^[0-9]*$/, min: 0 }}
                render={() => (
                  <TextField
                    disabled
                    InputLabelProps={{ shrink: true }}
                    value={store?.company?.yearsInBusiness}
                    label='Years In Business'
                    aria-describedby='validation-basic-first-name'
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: spacing }}>
              <Controller
                name='noOfEmployees'
                control={props.control}
                rules={{ required: true, pattern: /^[0-9]*$/, min: 0 }}
                render={() => (
                  <TextField
                    disabled
                    InputLabelProps={{ shrink: true }}
                    value={
                      store?.company?.noOfEmployees
                        ? config?.properties?.employeesData[store?.company?.noOfEmployees]
                        : ''
                    }
                    label='No Of Employees'
                    aria-describedby='validation-basic-first-name'
                  />
                )}
              />
            </FormControl>
          </Grid>
          {store?.userDetails?.orgType === config.orgType.company ? (
            <LocationCard
              addressLabel='GST Registered Address'
              name='gstregister'
              control={props.control}
              errors={props.errors}
              values={store.company.gstRegisteredAddress}
              setValue={props.setValue}
              watch={props.watch}
            />
          ) : null}
        </Grid>
      </CardContent>
    </>
  )
}

export default CompanyDetailsForm
