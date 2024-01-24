import { FormControl, InputLabel, MenuItem, Select, SxProps, Theme } from '@mui/material'
import React from 'react'

function FilterCompoenent({
  data,
  onChange,
  value,
  label,
  variant,
  reverseObj,
  sx,
  selectSx
}: {
  data: { [key: number | string]: string | number } | []
  onChange: (e: string | number) => void
  value: string | number
  label: string
  variant?: boolean
  reverseObj?: boolean
  sx?: SxProps<Theme> | undefined
  selectSx?: SxProps<Theme> | undefined
}) {
  return (
    <FormControl
      fullWidth
      variant={variant ? 'standard' : 'outlined'}
      sx={{
        width: '100%',
        m: theme => theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          mr: 0.5
        },
        '& .MuiInput-underline:before': {
          borderBottom: 1,
          borderColor: 'divider'
        },
        ...sx
      }}
    >
      <InputLabel id='demo-simple-select-standard-label'>{label}</InputLabel>
      <Select
        labelId='demo-simple-select-standard-label'
        id='demo-simple-select-standard'
        label={label}
        value={reverseObj ? Object.keys(data).find((val1: any) => data[val1] === value) : value}
        placeholder={label}
        sx={{ textTransform: 'capitalize', ...selectSx }}
        onChange={e => {
          onChange(e.target.value)
        }}
      >
        <MenuItem value=''>All</MenuItem>
        {data &&
          Object?.entries(data)?.map(([key, val]) => (
            <MenuItem value={reverseObj ? val : key} key={key} sx={{ textTransform: 'capitalize', ...selectSx }}>
              {reverseObj ? key : val}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

export default FilterCompoenent
