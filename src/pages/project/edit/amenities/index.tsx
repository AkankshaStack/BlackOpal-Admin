import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  Grid,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
  Checkbox,
  createFilterOptions
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { propertyProp } from 'src/common/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import { patchPropertyDetails, fetchAmenities, fetchTags } from 'src/store/apps/property'
import { useEffect } from 'react'

interface AutocompleteType {
  id?: number
  slug: string
  icon?: string
  inputValue?: string
}
interface FormInputs1 {
  amenities: AutocompleteType[]
  tag: FilmOptionType[]
}

interface FilmOptionType {
  id?: number
  slug: string
  inputValue?: string
}

const Aminities = (prop: propertyProp) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.property)

  useEffect(() => {
    dispatch(fetchAmenities())
    dispatch(fetchTags())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const common = yup.object().shape({
    id: yup.number().notRequired(),
    slug: yup.string().required(),
    icon: yup.string().nullable().notRequired()
  })
  const common1 = yup.object().shape({
    id: yup.string().notRequired(),
    slug: yup.string().required()
  })
  const detailsSchema = yup.object().shape({
    amenities: yup.array().of(common).min(1, 'Please select amenities').required('Please select amenities'),
    tag: yup.array().of(common1).min(1, 'Please select tags').required('Please select tags')
  })

  const aminities12: AutocompleteType[] = store?.data?.amenities || []
  const tag12: FilmOptionType[] = store?.data?.tags || []

  const defaultValues = {
    amenities: aminities12 || [],
    tag: tag12 || []
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm<FormInputs1>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(detailsSchema)
  })
  const spacing = 6
  const onSubmit = (data: any) => {
    const payload = {
      step: 'amenities',
      amenities: data?.amenities?.map((val: any) => val?.slug),
      tags: data?.tag?.map((val: any) => val?.slug)
    }
    dispatch(patchPropertyDetails({ id: prop?.id, params: payload })).then(() => {
      reset(data)
    })
  }

  const amenitiesData: AutocompleteType[] = store?.amenities
  const optionsData: FilmOptionType[] = store?.tags //[{ title: 'HDFC' }, { title: 'ICIC' }, { title: 'SBI' }, { title: 'PNB' }]
  const filter = createFilterOptions<FilmOptionType>()

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }} noValidate>
      <Grid container sx={{ mb: spacing }} spacing={spacing}>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <Controller
              name='amenities'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  value={value}
                  onChange={(event, newValue) => {
                    const check = newValue[newValue.length - 1]
                    if (check?.slug?.includes('Add')) {
                      newValue[newValue.length - 1].slug = check.slug.replace('Add', '')
                      newValue[newValue.length - 1].icon = check.slug.replace('Add', '')
                    }
                    onChange(newValue)
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params)
                    const { inputValue } = params
                    const isExisting = options.some(option => inputValue === option.slug)
                    if (inputValue !== '' && !isExisting) {
                      if (inputValue?.match(/^[a-zA-Z0-9\s]*$/)) {
                        filtered.push({
                          inputValue: `Add ${inputValue}`,
                          slug: `Add ${inputValue}`
                        })
                      }
                    }

                    return filtered
                  }}
                  isOptionEqualToValue={(option, value) => option.slug === value.slug}
                  options={amenitiesData}
                  id='autocomplete-checkboxes'
                  getOptionLabel={option => option.slug}
                  renderInput={params => (
                    <TextField
                      {...params}
                      required
                      label='Amenities'
                      placeholder='Amenities'
                      error={Boolean(errors.amenities)}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} sx={{ mr: 2 }} />
                      {option.slug}
                    </li>
                  )}
                />
              )}
            />
            {errors.amenities && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.amenities as any).message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <Controller
              name='tag'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  value={value}
                  onChange={(event, newValue) => {
                    const check = newValue[newValue.length - 1]
                    if (check?.slug?.includes('Add')) {
                      newValue[newValue.length - 1].slug = check.slug.replace('Add', '')
                    }
                    onChange(newValue)
                  }}
                  options={optionsData}
                  id='checkboxes-tags-demo'
                  getOptionLabel={option => option.slug}
                  isOptionEqualToValue={(option, value) => option.slug === value.slug}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params)
                    const { inputValue } = params
                    const isExisting = options.some(option => inputValue === option.slug)
                    if (inputValue !== '' && !isExisting) {
                      if (inputValue?.match(/^[a-zA-Z0-9\s]*$/)) {
                        filtered.push({
                          inputValue: `Add ${inputValue}`,
                          slug: `Add ${inputValue}`
                        })
                      }
                    }

                    return filtered
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.slug}
                    </li>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      required
                      label='Property tags'
                      placeholder='Property tags'
                      error={Boolean(errors.tag)}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              )}
            />
            {errors.tag && (
              <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                {(errors.tag as any)?.message}
              </FormHelperText>
            )}
          </FormControl>
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

export default Aminities
