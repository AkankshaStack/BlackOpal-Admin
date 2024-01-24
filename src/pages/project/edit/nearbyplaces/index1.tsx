import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Grid, FormControl, FormHelperText, TextField, Autocomplete } from '@mui/material'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { top100Films } from 'src/@fake-db/autocomplete'
import { AutocompleteType } from 'src/@fake-db/types'

// import MyFancyComponent from './map'

interface FormInputs1 {
  schools: AutocompleteType[]
  malls: AutocompleteType[]
  airportDistance: AutocompleteType[]
  busStopDistance: AutocompleteType[]
  hospital: AutocompleteType[]
  metro: AutocompleteType[]
  police: AutocompleteType[]
  commercialSpaces: AutocompleteType[]
  playSchool: AutocompleteType[]
  park: AutocompleteType[]
}

const NearByPlaces = () => {
  const common = yup.object().shape({
    year: yup.number(),
    title: yup.string()
  })
  const detailsSchema = yup.object().shape({
    schools: yup.array().of(common).required('Please select Near By School'),
    malls: yup.array().of(common).required('Please select Near By Malls'),
    airportDistance: yup.array().of(common).required('Please select Distance From Airport'),
    busStopDistance: yup.array().of(common).required('Please select Distance From Bus Stand'),
    hospital: yup.array().of(common).required('Please select Near By Hospital'),
    metro: yup.array().of(common).required('Please select Near By Metro'),
    police: yup.array().of(common).required('Please select Near By Police Station'),
    commercialSpaces: yup.array().of(common).required('Please select Near By Commercial Spaces/Office'),
    playSchool: yup.array().of(common).required('Please select Near By Play School'),
    park: yup.array().of(common).required('Please select Near By Park')
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs1>({
    defaultValues: {
      schools: [],
      malls: [],
      airportDistance: [],
      busStopDistance: [],
      hospital: [],
      metro: [],
      police: [],
      commercialSpaces: [],
      playSchool: [],
      park: []
    },
    mode: 'onChange',
    resolver: yupResolver(detailsSchema)
  })
  const spacing = 6
  const onSubmit = () => {
    toast.success('Details Saved Successfully')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }} noValidate>
      <Grid container sx={{ mb: spacing }} spacing={spacing}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='schools'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Near By School'
                      placeholder='Near By School'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.schools)}
                    />
                  )}
                />
              )}
            />
            {errors.schools && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.schools as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='malls'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Near By Mall'
                      placeholder='Near By Mall'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.malls)}
                    />
                  )}
                />
              )}
            />
            {errors.malls && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.malls as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='airportDistance'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Distance From Airport'
                      placeholder='Distance From Airport'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.airportDistance)}
                    />
                  )}
                />
              )}
            />
            {errors.airportDistance && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.airportDistance as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='busStopDistance'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Distance From Bus Stand'
                      placeholder='Distance From Bus Stand'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.busStopDistance)}
                    />
                  )}
                />
              )}
            />
            {errors.busStopDistance && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.busStopDistance as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='hospital'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Near By Hospital'
                      placeholder='Near By Hospital'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.hospital)}
                    />
                  )}
                />
              )}
            />
            {errors.hospital && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.hospital as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='metro'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Near By Metro'
                      placeholder='Near By Metro'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.metro)}
                    />
                  )}
                />
              )}
            />
            {errors.metro && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.metro as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='police'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Near By Police Station'
                      placeholder='Near By Police Station'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.police)}
                    />
                  )}
                />
              )}
            />
            {errors.police && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.police as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='commercialSpaces'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Near By Commercial/Office Spaces'
                      placeholder='Near By Commercial/Office Spaces'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.commercialSpaces)}
                    />
                  )}
                />
              )}
            />
            {errors.commercialSpaces && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.commercialSpaces as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='playSchool'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Near By Crech/Play School'
                      placeholder='Near By Crech/Play School'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.playSchool)}
                    />
                  )}
                />
              )}
            />
            {errors.playSchool && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.playSchool as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name='park'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disableClearable
                  multiple
                  options={top100Films}
                  filterSelectedOptions
                  {...field}
                  id='autocomplete-multiple-outlined'
                  getOptionLabel={option => option.title}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Near By Park'
                      placeholder='Near By Park'
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.park)}
                    />
                  )}
                />
              )}
            />
            {errors.park && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.park as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} style={{ marginBottom: '10px' }}>
          <LoadingButton variant='contained' style={{ float: 'right', marginRight: '20px' }} type='submit'>
            Save
          </LoadingButton>
        </Grid>
        <Grid item xs={12} sm={12} style={{ marginBottom: '10px' }}>
          {/* <MyFancyComponent /> */}
        </Grid>
      </Grid>
    </form>
  )
}

export default NearByPlaces
