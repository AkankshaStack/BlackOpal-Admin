// ** Next Imports
import Link from 'next/link'

// ** Icons Imports
// import HailIcon from 'mdi-material-ui/Hail'
// import BusinessRoundedIcon from 'mdi-material-ui/Domain'
import { SwapVertical } from 'mdi-material-ui'

// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// ** Store Imports
// import { fetchData } from 'src/store/verification'
// import { AppDispatch } from 'src/store'
// import { useDispatch } from 'react-redux'

// ** Custom Components Imports

// import { debounce } from 'lodash'

// ** Utils Import
// import config from 'src/configs/config'

// ** Actions Imports
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

// ** MUI Imports
import { Stack, Tooltip, Card, CardHeader, Typography, Link as MuiLInk, Grid } from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import { CustomerChampionData } from 'src/api'
import { debounce } from 'lodash'
import SearchBoxDataGrid from 'src/views/table/data-grid/SearchBoxDataGrid'
import moment from 'moment'

// import FilterCompoenent from 'src/views/components/filterUI'

interface CellType {
  row: any
}

const AgentList = () => {
  // ** State
  const [pageCurrent, setPageCurrent] = useState<number>(0)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [CustomerChampion, setCustomerChampion] = useState<any>([])
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
  // const dispatch = useDispatch<AppDispatch>()

  // const store = useSelector((state: any) => state.verification)

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const getCutomerChampion = async (param: any) => {
    console.log(param, '----------------parsms')
    try {
      const response = await CustomerChampionData(param)

      setCustomerChampion(response.data)
      console.log(response?.data, '=========resp')
    } catch (error) {}
  }

  useEffect(() => {
    const payload: any = {}
    payload.status = 1
    getCutomerChampion(payload)
  }, [])

  const columns: any = [
    {
      flex: 1,
      field: 'userId',
      sortable: false,
      headerName: 'Cust id',
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }: CellType) => (
        <p className='underline-code'>
          {/* <Link href={{ pathname: `/user/${row.id}`, query: { from: 'pending-approvals' } }}> */}
          <Link passHref href={`/customer-champion/pending-Approval/${row?.id}`}>
            <MuiLInk className='underline-code muilink_id'>{String(row?.userId)}</MuiLInk>
          </Link>
        </p>
      ),
      renderHeader: undefined
    },

    {
      flex: 1,
      field: 'firstName',
      align: 'left',
      headerAlign: 'left',
      headerName: 'Champion Name',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.firstName} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography variant='subtitle1' noWrap>
              {row?.firstName} {row?.lastName}
            </Typography>
          </Tooltip>
        )
      }
    },

    {
      flex: 1,
      field: 'name',
      align: 'left',
      headerAlign: 'left',
      headerName: 'Property Name',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.name} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography variant='subtitle1' noWrap>
              {row?.name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 1,
      field: 'configuration',
      align: 'left',
      headerAlign: 'left',
      headerName: 'Configuration',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        // const { firstName, lastName, orgType } = row.userDetails
        // const name = orgType === config.orgType.company ? row?.company.name : `${firstName} ${lastName}`

        return (
          <Tooltip title={row?.configuration} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography variant='subtitle1' noWrap>
              {row?.configuration}
            </Typography>
          </Tooltip>
        )
      }
    },

    {
      flex: 0.2,
      minWidth: 230,
      field: 'created',
      headerName: 'Request Date',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        const createdAt = moment(row?.createdAt).locale('en-in').format('D MMM YYYY hh:mm a')

        return (
          <Tooltip title={createdAt}>
            <Typography noWrap>{createdAt}</Typography>
          </Tooltip>
        )
      }
    },

    {
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      headerName: 'Review Score',
      field: 'averageRating',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.averageRating?.toFixed(1)}</Typography>
      }
    }
  ]

  interface pagiantion {
    page: number
    perPage: number
    q?: string
    status: number

    sort?: string
  }

  const [searchText, setSearchText] = useState<string>('')

  const call = (page: number, searchValue = searchText) => {
    console.log(page, '=----paghe')
    const payload: pagiantion = {
      page,
      perPage: 10,
      status: 1,

      // include: 'company,userDetails',
      sort: 'averageRating:desc'
    }

    if (searchValue.length > 0) {
      payload.q = searchValue
    }

    if (filter.sorter?.length) {
      payload.sort = `${filter.sorter[0].field}:${filter.sorter[0].sort}`
    }
    getCutomerChampion(payload)

    // dispatch(fetchData(payload))
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
  }, [filter])

  console.log('CustomerChampion', CustomerChampion)

  return (
    <Card>
      <CardHeader title='Approve Customer Champion' />

      <Grid container spacing={3}>
        <SearchBoxDataGrid
          onChange={(event: ChangeEvent<Element | HTMLInputElement>) => {
            handleSearch((event.target as HTMLInputElement).value)
          }}
          isTeamMember='Search by id, name'
        />
      </Grid>
      <DataGrid
        autoHeight
        rows={CustomerChampion}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        disableColumnMenu
        loading={CustomerChampion.loading}
        page={pageCurrent}
        getRowId={(val: any) => val?.userId}
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
              No Champion Found
            </Stack>
          ),
          NoResultsOverlay: () => (
            <Stack height='100%' alignItems='center' justifyContent='center'>
              No Champion Found
            </Stack>
          ),
          ColumnUnsortedIcon: () => <SwapVertical />
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }
        }}
        onPageChange={(page: number) => {
          console.log(page, '----page')
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
