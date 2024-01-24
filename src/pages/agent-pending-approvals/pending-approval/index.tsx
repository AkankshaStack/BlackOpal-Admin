import moment from 'moment'

// ** Next Imports
import Link from 'next/link'

// ** Icons Imports
import HailIcon from 'mdi-material-ui/Hail'
import BusinessRoundedIcon from 'mdi-material-ui/Domain'
import { Eye, Cog, AccountBox, SwapVertical } from 'mdi-material-ui'

// ** React Imports
import { useEffect, useState, ChangeEvent } from 'react'

// ** Store Imports
import { AppDispatch } from 'src/store'
import { fetchData } from 'src/store/verification'
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { debounce } from 'lodash'

// ** Utils Import
import config from 'src/configs/config'

// ** Actions Imports
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

// ** MUI Imports
import { Avatar, Stack, Tooltip, IconButton, Card, CardHeader, Typography, Link as MuiLInk, Grid } from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import FilterCompoenent from 'src/views/components/filterUI'

interface CellType {
  row: any
}

const userStatusObj: any = {
  2: {
    value: 'In-Review',
    color: 'primary'
  },
  6: {
    value: 'Re-Review',
    color: 'info'
  },
  5: {
    value: 'Correction',
    color: 'secondary'
  }
}

const AgentList = () => {
  // ** State
  const [pageCurrent, setPageCurrent] = useState<number>(0)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [filter, setFilter] = useState<{
    verificationStatuses?: number | string | undefined
    orgType?: number | string | undefined
    sorter: GridSortModel
  }>({
    sorter: []
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.verification)

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const columns: any = [
    {
      flex: 0.5,
      minWidth: 100,
      field: 'company.id',
      sortable: false,
      headerName: 'Id',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <p className='underline-code'>
          <Link href={{ pathname: `/user/${row.id}`, query: { from: 'agent-pending-approvals' } }}>
            <MuiLInk className='underline-code muilink_id'>
              {row?.refNo !== null ? row?.refNo : 'AG0' + String(row?.id)}
            </MuiLInk>
          </Link>
        </p>
      ),
      renderHeader: undefined
    },
    {
      flex: 0.5,
      minWidth: 100,
      field: 'incomeSegment',
      headerName: 'Image',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { profilePictureSlug } = row.userDetails

        return (
          <div
            onClick={() => {
              if (profilePictureSlug?.length > 0) {
                setOpen({
                  visible: true,
                  url: profilePictureSlug || ''
                })
              }
            }}
            style={{
              cursor: 'pointer'
            }}
          >
            <Avatar src={profilePictureSlug || ''} />
          </div>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 100,
      field: 'orgType',
      headerName: 'Type',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { orgType } = row.userDetails

        if (orgType === config.orgType.company) {
          return (
            <Tooltip title='Company' arrow>
              <BusinessRoundedIcon />
            </Tooltip>
          )
        }
        if (orgType === config.orgType.freelancer) {
          return (
            <Tooltip title='Freelancer' arrow>
              <AccountBox />
            </Tooltip>
          )
        }

        return (
          <Tooltip title='Propertiership' arrow>
            <HailIcon />
          </Tooltip>
        )
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'licenceNo',
      align: 'left',
      headerAlign: 'left',
      headerName: 'Company/Agent',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { firstName, lastName, orgType } = row.userDetails
        const name = orgType === config.orgType.company ? row?.company.name : `${firstName} ${lastName}`

        return (
          <Tooltip title={name} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography variant='subtitle1' noWrap>
              {name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'email',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Email',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { email } = row.userDetails

        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={email} arrow>
              <Typography variant='subtitle1'>
                <MuiLInk underline='none' color='GrayText' href={`mailto:${email}`}>
                  {email}
                </MuiLInk>
              </Typography>
            </Tooltip>
          </div>
        )
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'contactMobileNumber',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Mobile Number',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { contactMobileNumber } = row.userDetails

        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1'>
              <MuiLInk underline='none' color='GrayText' href={`tel:${contactMobileNumber}`}>
                {contactMobileNumber}
              </MuiLInk>
            </Typography>
          </div>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => {
        const { verificationStatus } = row
        const statusText = userStatusObj[verificationStatus]?.value

        return (
          <CustomChip
            skin='light'
            size='small'
            label={statusText}
            color={userStatusObj[verificationStatus]?.color}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 1,
      minWidth: 220,
      align: 'center',
      headerAlign: 'center',
      headerName: 'Date of Upload',
      field: 'dateOfUpload',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.dateOfUpload ? moment(row?.dateOfUpload).format('DD MMM YYYY') : '-'}</Typography>
      }
    },
    {
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      field: 'verificationStatus',
      sortable: false,
      headerName: 'Action',
      renderCell: ({ row }: CellType) => {
        const { verificationStatus } = row
        const titleText = verificationStatus === 2 || verificationStatus === 6 ? 'Review' : 'Correction'
        if (verificationStatus === 5) {
          return (
            <Tooltip title={titleText} arrow>
              <IconButton disabled>
                <Cog />
              </IconButton>
            </Tooltip>
          )
        } else {
          return (
            <Link passHref href={`/agent-pending-approvals/pending-approval/review-agent-profile/${row.id}`}>
          
              <Tooltip title={titleText} arrow>
                <IconButton>
                  <Eye />
                </IconButton>
              </Tooltip>
            </Link>
          )
        }
      }
    }
  ]

  interface pagiantion {
    include: string
    page: number
    perPage: number
    q?: string
    sort?: string
    orgType?: number | string
    verificationStatuses: string
  }

  const [searchText, setSearchText] = useState<string>('')

  const call = (page: number, searchValue = searchText) => {
    const payload: pagiantion = {
      orgType: filter?.orgType,
      verificationStatuses: filter?.verificationStatuses
        ? JSON.stringify([filter?.verificationStatuses])
        : JSON.stringify([
            config.agents.verificationStatus.requested,
            config.agents.verificationStatus.reRequested,
            config.agents.verificationStatus.correctionRequired
          ]),
      page,
      perPage: 10,
      include: 'company,userDetails',
      sort: 'createdAt:desc'
    }
    if (filter.sorter?.length) {
      payload.sort = `${filter.sorter[0].field}:${filter.sorter[0].sort}`
    }

    if (searchValue.length > 0) {
      payload.q = searchValue
    }

    dispatch(fetchData(payload))
  }

  const handleSearch = debounce((searchValue: string) => {
    setSearchText(searchValue)
    if (searchValue.length > 0) {
      call(1, searchValue)
    } else {
      call(1, '')
    }
  }, 400)

  useEffect(() => {
    call(1, '')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <Card>
      <CardHeader title='Pending Approval' />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <QuickSearchToolbar
            onChange={(event: ChangeEvent<Element | HTMLInputElement>) => {
              handleSearch((event.target as HTMLInputElement).value)
            }}
            isTeamMember='Search by id, name'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FilterCompoenent
            label='Verification Status'
            data={{
              requested: config.agents.verificationStatus.requested,
              'Re Requested': config.agents.verificationStatus.reRequested,
              'Correction Required': config.agents.verificationStatus.correctionRequired
            }}
            reverseObj
            variant
            value={filter?.verificationStatuses || ''}
            onChange={val =>
              setFilter(prev => {
                return {
                  ...prev,
                  verificationStatuses: val || undefined
                }
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FilterCompoenent
            label='Type'
            data={config?.orgType}
            variant
            reverseObj
            value={filter?.orgType || ''}
            onChange={val =>
              setFilter(prev => {
                return {
                  ...prev,
                  orgType: val || undefined
                }
              })
            }
          />
        </Grid>
      </Grid>
      <DataGrid
        autoHeight
        rows={store?.data?.data ? [...store?.data?.data] : []}
        columns={columns}
        rowCount={store?.data?.meta?.pagination?.total}
        pageSize={10}
        disableSelectionOnClick
        disableColumnMenu
        loading={store.loading}
        page={pageCurrent}
        getRowId={val => val?.userDetails?.id}
        paginationMode='server'
        sortingMode='server'
        onSortModelChange={model => {
          setFilter(prev => {
            return {
              ...prev,
              sorter: model
            }
          })
        }}
        initialState={{
          sorting: {
            sortModel: filter.sorter
          }
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height='100%' alignItems='center' justifyContent='center'>
              No Agents Found
            </Stack>
          ),
          NoResultsOverlay: () => (
            <Stack height='100%' alignItems='center' justifyContent='center'>
              No Agents Found
            </Stack>
          ),
          ColumnUnsortedIcon: () => <SwapVertical />
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }
        }}
        onPageChange={(page: number) => {
          call(page + 1)
          setPageCurrent(page)
        }}
      />
      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
      <ImagePreview open={open} setOpen={setOpen} />
    </Card>
  )
}

export default AgentList
