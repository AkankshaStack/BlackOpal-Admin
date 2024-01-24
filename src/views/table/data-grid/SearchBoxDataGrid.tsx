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
import { Container, Grid, SxProps, Theme, Tooltip } from '@mui/material'
import Image from 'next/image'

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

const SearchBoxDataGrid = (props: Props) => {
  return (
    <Grid
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        display: 'flex',
        width: '100%',
        marginBottom: '2rem'
      }}
    >
      <Container
        style={{
          fontWeight: 200,
          marginBottom: 0,
          paddingBottom: 0,

          display: 'flex',
          justifyContent: 'flex-start'
        }}
      >
        {true && (
          <div style={{ position: 'relative', display: 'flex' }}>
            <div style={{ position: 'relative', width: '230px', marginLeft: '10px' }}>
              <input
                style={{
                  backgroundColor: 'white',
                  border: '1px solid gray',
                  width: '171%',
                  borderRadius: '5px',
                  padding: '20px',
                  marginRight: '2px',
                  fontSize: '14px'
                }}
                placeholder='Search by transaction id, team memeber name'
                required
                value={props.value}
                onChange={props.onChange}
              />
              <div style={{ position: 'absolute', bottom: -3, right: -140 }}>
                <Image src={'/images/Search.svg'} alt='qwerty' height={50} width={50} />
              </div>
            </div>
          </div>
        )}
      </Container>
    </Grid>
  )
}

export default SearchBoxDataGrid
