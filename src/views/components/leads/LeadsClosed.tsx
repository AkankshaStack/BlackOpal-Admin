/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Typography, Grid, debounce, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import config from 'src/configs/config'
import { AppDispatch, RootState } from 'src/store'
import { closeLead } from 'src/store/leads'
import { leadPayload } from 'src/store/leads/types'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { CloseLeadDialog } from '../closelead-dialog'
import LeadsTable from './LeadsTable'

// import Transferleads from '../transfer-leads'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ILeadsClosed {
  activeLeads?: boolean
}

const LeadsClosed: FC<ILeadsClosed> = ({ activeLeads = false }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSort, setSelectedSortBy] = useState<string>('')
  const [selectedFilter, setSelectedFilterBy] = useState<string>('')

  useEffect(() => {
    call(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter])
  const { closeLeadsPagination, closeLeadLoading, closeLeads } = useSelector((state: RootState) => state.leads)
  const dispatch = useDispatch<AppDispatch>()

  const call = (page = closeLeadsPagination?.currentPage, searchValue = searchText) => {
    const payload: leadPayload = {
      page: page,
      perPage: 10,
      statuses: JSON.stringify([config.leads.status.Sold, config.leads.status.Lost]),
      verificationStatuses: JSON.stringify([
        config.leads.verificationStatus.Applied,
        config.leads.verificationStatus.Verified,
        config.leads.verificationStatus.Rejected
      ]),
      include: 'teamMember,property,customer',
      sort: 'updatedAt:desc'
    }
    if (selectedFilter?.length > 0) {
      payload.verificationStatuses = JSON.stringify([selectedFilter])
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }

    dispatch(closeLead(payload))
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
    <Card sx={{ p: activeLeads ? 0 : 8 }}>
      <Typography variant='h5'>Close Leads</Typography>
      <Typography sx={{ mt: 2 }} variant='body1'>
        All close leads that has been submitted by agent admin for verification.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item md={6} sm={4} xs={12}>
          <QuickSearchToolbar
            isNotDataGrid={true}
            isTeamMember='Search by project name, team-member Name, customer name'
            onChange={(event: React.ChangeEvent) => {
              handleSearch((event.target as HTMLButtonElement).value)
            }}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <LeadsTable
          handleChangePage={(page: number) => call(page)}
          call={() => call(closeLeadsPagination?.currentPage || 1)}
          leads={closeLeads}
          loading={closeLeadLoading}
          pagination={closeLeadsPagination}
        />
      </Box>
    </Card>
  )
}

export default LeadsClosed
