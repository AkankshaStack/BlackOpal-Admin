/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  Grid,
  FormControl,
  FormHelperText,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  createFilterOptions
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { propertyProp } from 'src/common/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import { patchPropertyDetails, fetchDeveloper, resetFormErors } from 'src/store/apps/property'
import config from 'src/configs/config'
import { useEffect } from 'react'

interface FilmOptionType {
  name: string
  inputValue?: string
}
interface FormInputs1 {
  name: FilmOptionType
  llpName: string
  yearsInBusiness: number | undefined
  deliveredarea: number | undefined
  companyStatus: number
  ratingOfFinancialInstrument: string | undefined
  ratingProvidedBy: string | undefined
  description: string | undefined
}

const DeveloperDetails = (prop: propertyProp) => {
  const dispatch = useDispatch<AppDispatch>()
  const formErrors = useSelector((state: any) => state.user.formErrors)

  const common = yup.object().shape({
    name: yup.string()
  })
  const store = useSelector((state: any) => state.property)

  useEffect(() => {
    dispatch(fetchDeveloper())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const detailsSchema = yup.object().shape({
    name: yup.string().strict(false).trim().required('Please select developer name'),
    llpName: yup.string().strict(false).trim().required('Please enter LLP/SPV name'),
    ratingOfFinancialInstrument: yup
      .string()
      .optional()
      .nullable()
      .notRequired()
      .transform((_, val) => (val > 0 ? val : undefined)),
    ratingProvidedBy: yup
      .string()
      .optional()
      .nullable()
      .notRequired()
      .transform((_, val) => (val > 0 ? val : undefined)),
    yearsInBusiness: yup
      .number()
      .typeError('No. of years in business must be a number')
      .optional()
      .nullable(true)
      .notRequired()
      .transform((_, val) => (val > 0 ? Number(val) : undefined)),
    companyStatus: yup.number().moreThan(0, 'Please select company status').required('Please select company status'),
    deliveredarea: yup
      .number()
      .typeError('Delivered area  must be a number')
      .optional()
      .nullable(true)
      .notRequired()
      .transform((_, val) => (val > 0 ? Number(val) : undefined)),

    description: yup
      .string()
      .strict(false)
      .trim()
      .min(5, 'Please enter atleast 5 letter in description')
      .required('Please enter developer description')

    // name: yup.number().moreThan(0, 'Please select Group Name').required('Please select Group Name'),
    // ratingInstrument: yup.string().required('Please enter Rating Instrument'),
    // ratingOutlook: yup.string().required('Please enter Rating Outlook')
  })

  const defaultValues: FormInputs1 = {
    name: store?.data?.developer?.name || '',
    llpName: store?.data?.developer?.llpName || '',
    yearsInBusiness: store?.data?.developer?.noOfyearsInBusiness || undefined,
    companyStatus: store?.data?.developer?.companyStatus || '',
    deliveredarea: store?.data?.developer?.totalDeliveredAreaInSqft / 43560 || undefined,
    description: store?.data?.developer?.description || undefined,
    ratingOfFinancialInstrument: store?.data?.developer?.ratingOfFinancialInstrument || '',
    ratingProvidedBy: store?.data?.developer?.ratingProvidedBy || ''
  }

  const optionsData: FilmOptionType[] = store?.developer?.map((val: any) => {
    return {
      name: val.name
    }
  })

  const filter = createFilterOptions<FilmOptionType>()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm<FormInputs1>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(detailsSchema)
  })
  const spacing = 6
  const onSubmit = (data: any) => {
    const {
      name,
      llpName,
      yearsInBusiness,
      deliveredarea,
      companyStatus,
      ratingOfFinancialInstrument,
      description,
      ratingProvidedBy
    } = data
    const params = {
      step: 'developer',
      name: name,
      noOfyearsInBusiness: String(yearsInBusiness)?.length > 0 ? yearsInBusiness : null,
      companyStatus: companyStatus,
      llpName: llpName,
      totalDeliveredAreaInSqft: String(deliveredarea)?.length > 0 ? deliveredarea * 43560 : null,
      ratingOfFinancialInstrument: ratingOfFinancialInstrument?.length > 0 ? Number(ratingOfFinancialInstrument) : null,
      ratingProvidedBy: ratingProvidedBy?.length > 0 ? Number(ratingProvidedBy) : null,
      description
    }
    const payload = {
      id: prop?.id,
      params: params
    }
    dispatch(patchPropertyDetails(payload)).then(() => {
      reset(data)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }} noValidate>
      <Grid container sx={{ mb: spacing }} spacing={spacing}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <Autocomplete
                    value={value}
                    disableClearable
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        onChange(newValue)
                      } else {
                        const check = newValue?.name.includes('Add ')
                          ? newValue?.name.replace('Add ', '')
                          : newValue?.name
                        onChange(check)
                      }
                    }}
                    options={optionsData}
                    id='checkboxes-tags-demo'
                    getOptionLabel={option => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                        return option
                      }
                      if (option?.inputValue) {
                        return option?.inputValue
                      }

                      return option.name
                    }}
                    isOptionEqualToValue={(option, value) => {
                      if (typeof value === 'string') {
                        return option.name === value
                      } else {
                        if (value) {
                          return option.name === value.name
                        } else {
                          return true
                        }
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params)

                      const { inputValue } = params
                      const isExisting = options.some(option => {
                        return option?.name?.toLowerCase()?.includes(inputValue?.toLowerCase())
                      })

                      if (inputValue !== '' && !isExisting) {
                        filtered.push({
                          inputValue: inputValue,
                          name: `Add ${inputValue}`
                        })
                      }

                      return filtered
                    }}
                    renderOption={(props, option) => <li {...props}>{option.name}</li>}
                    renderInput={params => (
                      <TextField
                        {...params}
                        required
                        label='Developer/group name'
                        placeholder='Developer/group name'
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </>
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                Please select Developer/group name
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Controller
              name='llpName'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={e => {
                    field.onChange(e)
                    dispatch(resetFormErors('llpName'))
                  }}
                  required
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.llpName || formErrors?.llpName)}
                  label='LLP/ SPV name'
                  placeholder='LLP/ SPV name'
                />
              )}
            />
            {(errors.llpName || formErrors?.llpName) && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {errors?.llpName?.message || formErrors?.llpName}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Controller
              name='yearsInBusiness'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={e => {
                    if (
                      (e.target.value[0] === '0' && e.target.value.length === 2 && !e.target.value.includes('.')) ||
                      e.target.value.split('.')[1]?.length > 2
                    ) {
                      return
                    }
                    field.onChange(e)
                    dispatch(resetFormErors('noOfyearsInBusiness'))
                  }}
                  type='number'
                  InputProps={{ inputProps: { min: 0 } }}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.yearsInBusiness || formErrors?.noOfyearsInBusiness)}
                  label='No. of years in business'
                  placeholder='No. of years in business'
                />
              )}
            />
            {(errors.yearsInBusiness || formErrors?.noOfyearsInBusiness) && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {errors?.yearsInBusiness?.message || formErrors?.noOfyearsInBusiness}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid container item spacing={6}>
          <Grid></Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label' required error={Boolean(errors.companyStatus)}>
              Company status
            </InputLabel>
            <Controller
              name='companyStatus'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  label='Company Status'
                  required
                  placeholder='Company Status'
                  onChange={e => {
                    onChange(e)
                    dispatch(resetFormErors('companyStatus'))
                  }}
                  error={Boolean(errors.companyStatus || formErrors?.companyStatus)}
                  labelId='demo-simple-select-label'
                  aria-describedby='validation-basic-select'
                >
                  {Object.entries(config?.properties?.developer?.companyStatus)?.map(([key, value], index) => {
                    return (
                      <MenuItem key={`${value}-${index}`} value={String(key)}>
                        {`${value}`}
                      </MenuItem>
                    )
                  })}
                </Select>
              )}
            />
            {(errors.companyStatus || formErrors?.companyStatus) && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {errors?.companyStatus?.message || formErrors?.companyStatus}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Controller
              name='deliveredarea'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={e => {
                    if (
                      (e.target.value[0] === '0' && e.target.value.length === 2 && !e.target.value.includes('.')) ||
                      e.target.value.split('.')[1]?.length > 2
                    ) {
                      return
                    }

                    field.onChange(e)
                    dispatch(resetFormErors('totalDeliveredAreaInSqft'))
                  }}
                  type='number'
                  InputProps={{ inputProps: { min: 0 } }}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.deliveredarea || formErrors?.totalDeliveredAreaInSqft)}
                  label='Delivered area(in acres)'
                  placeholder='Delivered area(in acres)'
                />
              )}
            />
            {(errors.deliveredarea || formErrors?.totalDeliveredAreaInSqft) && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {errors?.deliveredarea?.message || formErrors?.totalDeliveredAreaInSqft}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid container item spacing={6}>
          <Grid container item xs={12} sm={4} spacing={4}>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <Controller
                  name='ratingProvidedBy'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <InputLabel id='select-ratingProvidedBy' shrink={true} error={Boolean(errors.ratingProvidedBy)}>
                        Rating provided by
                      </InputLabel>
                      <Select
                        labelId='select-ratingProvidedBy'
                        id='select-ratingProvidedBy'
                        label='Rating provided by'
                        notched
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.ratingProvidedBy)}
                      >
                        <MenuItem value=''>None</MenuItem>
                        {Object.entries(config?.properties?.ratingProvidedBy)?.map(([key, value], index) => {
                          return (
                            <MenuItem key={index} value={String(key)}>
                              {String(value)}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </>
                  )}
                />
                {errors.ratingProvidedBy && (
                  <FormHelperText sx={{ color: 'error.main' }} id='select-ratingProvidedBy'>
                    {errors.ratingProvidedBy.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <Controller
                  name='ratingOfFinancialInstrument'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <InputLabel
                        id='select-ratingOfFinancialInstrument'
                        shrink={true}
                        error={Boolean(errors.ratingOfFinancialInstrument)}
                      >
                        Instrument rating
                      </InputLabel>
                      <Select
                        labelId='select-ratingOfFinancialInstrument'
                        id='select-ratingOfFinancialInstrument'
                        label='Instrument Rating'
                        notched
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.ratingOfFinancialInstrument)}
                      >
                        <MenuItem value=''>None</MenuItem>
                        {Object.entries(config?.properties?.developerRating)?.map(([key, value], index) => {
                          return (
                            <MenuItem key={index} value={String(key)}>
                              {String(value)}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </>
                  )}
                />
                {errors.ratingOfFinancialInstrument && (
                  <FormHelperText sx={{ color: 'error.main' }} id='select-ratingOfFinancialInstrument'>
                    {errors.ratingOfFinancialInstrument.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <FormControl fullWidth>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    value={value}
                    rows={4}
                    required
                    multiline
                    label='Developer overview'
                    onChange={e => {
                      onChange(e)
                      dispatch(resetFormErors('description'))
                    }}
                    placeholder='Developer description'
                    error={Boolean(errors.description)}
                    aria-describedby='validation-basic-last-name'
                  />
                )}
              />
              {errors.description && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-textarea'>
                  {errors?.description?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} style={{ marginBottom: '10px' }}>
        <LoadingButton
          variant='contained'
          style={{ float: 'right', marginRight: '20px', marginBottom: '20px' }}
          type='submit'
          loading={store.loading}
          disabled={!(isDirty && isValid)}
        >
          Save
        </LoadingButton>
      </Grid>
    </form>
  )
}

export default DeveloperDetails
