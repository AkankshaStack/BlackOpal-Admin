// ** Next Imports
import Link from 'next/link'

import { SwapVertical } from 'mdi-material-ui'

// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

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

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const getCutomerChampion = async (param: any) => {
    try {
      const response = await CustomerChampionData(param)

      setCustomerChampion(response.data)
      console.log(response?.data, '=========resp')
    } catch (error) {}
  }

  useEffect(() => {
    const payload: any = {}
    payload.status = 2
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
          <Link passHref href={`/customer-champion/customer-list/${row?.id}`}>
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

  useEffect(() => {
    call(1, '')
  }, [filter])

  const call = (page: number, searchValue = searchText) => {
    const payload: pagiantion = {
      page,
      perPage: 10,
      status: 2,

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
        onSortModelChange={(model: any) => {
          setFilter((prev: any) => {
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
