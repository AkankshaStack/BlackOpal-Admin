import { Card, Grid, debounce, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import config from 'src/configs/config'
import { AppDispatch, RootState } from 'src/store'
import { getLead } from 'src/store/leads'
import { leadPayload } from 'src/store/leads/types'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import LeadsTable from './LeadsTable'

// import Transferleads from '../transfer-leads'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ILeads {}

const Leads: FC<ILeads> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSort, setSelectedSortBy] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFilter, setSelectedFilterBy] = useState<string>('')
  useEffect(() => {
    call(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { pagination, data, loading } = useSelector((state: RootState) => state.leads)
  const store = useSelector((state: any) => state.user.singleData)
  const dispatch = useDispatch<AppDispatch>()

  const call = (page = pagination?.currentPage, searchValue = searchText) => {
    const payload: leadPayload = {
      page: page,
      perPage: 10,
      statuses: JSON.stringify([config.leads.status.Sold, config.leads.status.Lost]),
      include: 'teamMember,property,customer'
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    dispatch(
      getLead({
        id: store?.userDetails?.id,
        payload: payload
      })
    )
  }

  const handleSearch = debounce((searchValue: string) => {
    setSearchText(searchValue)
    if (searchValue.length > 0) {
      call(1, searchValue)
    } else {
      call(1, '')
    }
  }, 600)

  const handleFilterBy = (event: any) => {
    setSelectedFilterBy(event.target.value)
  }

  const handleSortBy = (event: any) => {
    setSelectedSortBy(event.target.value)
  }

  return (
    <Card sx={{ p: 0 }}>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item md={6} sm={4} xs={12}>
          <QuickSearchToolbar
            isNotDataGrid={true}
            isTeamMember='Search By Project Name, TM Name'
            onChange={(event: React.ChangeEvent) => {
              handleSearch((event.target as HTMLButtonElement).value)
            }}
          />
        </Grid>
        <Grid item md={3} sm={4} xs={12}>
          <Box
            sx={{
              position: 'relative',
              mt: -1.5
            }}
          >
            <FormControl
              fullWidth
              variant='standard'
              sx={{
                width: {
                  xs: 1,
                  sm: 200
                },
                m: theme => theme.spacing(1, 0.5, 1.5),
                '& .MuiSvgIcon-root': {
                  mr: 0.5
                },
                '& .MuiInput-underline:before': {
                  borderBottom: 1,
                  borderColor: 'divider'
                }
              }}
            >
              <InputLabel id='demo-simple-select-standard-label'>Filter by</InputLabel>
              <Select
                labelId='demo-simple-select-standard-label'
                id='demo-simple-select-standard'
                label='Filter by'
                onChange={handleFilterBy}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item md={3} sm={4} xs={12}>
          <Box
            sx={{
              position: 'relative',
              mt: -1.5
            }}
          >
            <FormControl
              fullWidth
              variant='standard'
              sx={{
                width: {
                  xs: 1,
                  sm: 200
                },
                m: theme => theme.spacing(1, 0.5, 1.5),
                '& .MuiSvgIcon-root': {
                  mr: 0.5
                },
                '& .MuiInput-underline:before': {
                  borderBottom: 1,
                  borderColor: 'divider'
                }
              }}
            >
              <InputLabel id='demo-simple-select-standard-label'>Sort by</InputLabel>
              <Select
                labelId='demo-simple-select-standard-label'
                id='demo-simple-select-standard'
                label='Filter by'
                onChange={handleSortBy}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <LeadsTable
          activeLeads
          handleChangePage={(page: number) => call(page)}
          call={() => call(pagination?.currentPage || 1)}
          leads={data}
          loading={loading}
          pagination={pagination}
        />
      </Box>
    </Card>
  )
}

export default Leads
