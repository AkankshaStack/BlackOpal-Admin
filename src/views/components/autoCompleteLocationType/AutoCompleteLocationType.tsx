import { Autocomplete, FormControl, FormHelperText, TextField, Box } from '@mui/material'
import { FC, Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface IAutoCompleteLocationTypeProps {
  setselectedType: Dispatch<SetStateAction<string>>
}

const AutoCompleteLocationType: FC<IAutoCompleteLocationTypeProps> = ({ setselectedType }) => {
  // const detailsSchema = yup.object().shape({
  //   type: yup.string('Please select Type').required('Please select Type'),
  // })
  const defaultValues = {
    type: ''
  }
  const {
    control,

    // handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'

    // resolver: yupResolver(detailsSchema)
  })

  const getOptionLabel = (option: string) => {
    const frags: Array<string> = option.split('_')
    for (let i = 0; i < frags.length; i++) {
      if (frags[i] === 'subway') {
        frags[i] = 'Metro'
        continue
      }
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
    }

    return frags.join(' ')
  }

  const onSubmit = (data: any) => {
    setselectedType(data)
  }

  return (
    <Box
      sx={{
        display: 'flex'
      }}
    >
      <FormControl fullWidth>
        <Controller
          name='type'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              value={value}
              onChange={(event, newValue) => {
                onChange(newValue)
                onSubmit(newValue)
              }}
              isOptionEqualToValue={(option, value) => option === value}
              options={typeData}
              id='autocomplete-checkboxes'
              getOptionLabel={option => getOptionLabel(option)}
              clearIcon={null}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Select type'
                  placeholder='Select type'
                  error={Boolean(errors.type)}
                  InputLabelProps={{ shrink: true }}
                />
              )}

              // renderOption={(props, option, { selected }) => (
              //   <li {...props}>
              //     <Checkbox checked={selected} sx={{ mr: 2 }} />
              //     {getOptionLabel(option)}
              //   </li>
              // )}
            />
          )}
        />
        {errors.type && (
          <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
            {(errors.type as any).message}
          </FormHelperText>
        )}
      </FormControl>
      {/* <LoadingButton
          variant='contained'
          style={{ float: 'right', marginRight: '20px', marginBottom: '20px' }}
          type='submit'
        >
          Submit
        </LoadingButton> */}
    </Box>
  )
}

export default AutoCompleteLocationType

export const typeData = [
  'school',
  'shopping_mall',
  'hospital',
  'department_store',
  'atm',
  'airport',
  'bus_station',
  'subway_station',
  'police',
  'park'
]
