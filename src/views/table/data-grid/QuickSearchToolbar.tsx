/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarFilterButton } from '@mui/x-data-grid'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import Magnify from 'mdi-material-ui/Magnify'
import { SxProps, Theme, Tooltip } from '@mui/material'

interface Props {
  value?: string
  clearSearch?: () => void
  onChange: (e: ChangeEvent<Element | HTMLInputElement>) => void
  isNotDataGrid?: boolean
  isTeamMember?: string
  variant?: TextFieldProps['variant']
  rootSx?: SxProps<Theme> | undefined
  width?: number | string
}

const QuickSearchToolbar = (props: Props) => {
  return (
    <Box
      sx={
        props.rootSx || {
          p: !props.isNotDataGrid ? 2 : 0,
          pb: 0,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginLeft: props.isNotDataGrid ? 4 : 2
        }
      }
    >
      {/* {!props.isNotDataGrid && (
        <Box>
          <GridToolbarFilterButton />
        </Box>

      )} */}
      <Tooltip title={props?.isTeamMember ? props?.isTeamMember : 'Search by id, name'}>
        <TextField
          variant={props?.variant || 'standard'}
          value={props.value}
          onChange={props.onChange}
          placeholder={props?.isTeamMember ? props?.isTeamMember : 'Search by id, name'}
          InputProps={{
            startAdornment: <Magnify fontSize='small' />

            // endAdornment: (
            //   <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
            //     <Close fontSize='small' />
            //   </IconButton>
            // )
          }}
          sx={{
            width: props.width
              ? '100%'
              : {
                  xs: 1,
                  sm: 250
                },
            m: theme => theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
              mr: 0.5,
              textOverflow: 'ellipsis'
            },
            '& input': {
              textOverflow: 'ellipsis'
            },
            '& .MuiInput-underline:before': {
              borderBottom: 1,
              borderColor: 'divider'
            }
          }}
        />
      </Tooltip>
    </Box>
  )
}

export default QuickSearchToolbar
