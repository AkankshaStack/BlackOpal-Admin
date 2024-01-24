// ** Next Imports
import Link from 'next/link'

import { Filter, FilterRemove, SwapVertical } from 'mdi-material-ui'

// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// ** Actions Imports
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

// ** MUI Imports
import {
  Stack,
  Tooltip,
  Card,
  CardHeader,
  Typography,
  Link as MuiLInk,
  Grid,
  Button,
  TextField,
  Theme,
  useMediaQuery
} from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import { debounce } from 'lodash'
import SearchBoxDataGrid from 'src/views/table/data-grid/SearchBoxDataGrid'
import moment from 'moment'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FetchTransaction } from 'src/api'

interface CellType {
  row: any
}

const TransactionList = () => {
  // ** State
  const [pageCurrent, setPageCurrent] = useState<number>(0)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [show, setShow] = useState(false)
  const [age, setAge] = useState('')
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [datefilter, setDateFilter] = useState<{ [key: string | number]: string | number | undefined }>({})
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

  const [transactionList, setTransactionList] = useState([])

  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const TransactionData = async () => {
    try {
      const response = await FetchTransaction()
      setTransactionList(response?.data)
    } catch (error) {}
  }

  useEffect(() => {
    TransactionData()
  }, [])

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  const columns: any = [
    {
      flex: 1,
      field: 'userId',
      sortable: false,
      headerName: 'TRANSACTION ID',
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }: CellType) => (
        <p className='underline-code'>
          <Link passHref href={`/customer-champion/Champion-transaction/${row?.id}`}>
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
      headerName: 'TRANSACTION BY',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.transactionBy} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography variant='subtitle1' noWrap>
              {row?.transactionBy}
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
      headerName: 'TRANSACTION FOR',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.transactionFor} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography variant='subtitle1' noWrap>
              {row?.transactionFor}
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
      headerName: 'AMOUNT',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.amountInPaisa / 100} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography variant='subtitle1' noWrap>
              {row?.amountInPaisa / 100}
            </Typography>
          </Tooltip>
        )
      }
    },

    {
      flex: 0.5,
      minWidth: 180,
      field: 'Unlist',
      headerName: 'Status',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => {
        return (
          <div style={{backgroundColor:'aliceblue', padding:'5px',borderRadius:'38px',width:'80%', border:'2px solid #b3eea9', }}>
            <Typography variant='subtitle1' noWrap style={{color: 'green', textAlign: 'center'}}>
              {row?.status}
            </Typography>
          </div>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'createdAt',
      headerName: 'TRANSACTION DATE',
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

    TransactionData()

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

  return (
    <Card>
      <CardHeader title='Transactions' />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <SearchBoxDataGrid
          onChange={(event: ChangeEvent<Element | HTMLInputElement>) => {
            handleSearch((event.target as HTMLInputElement).value)
          }}
          isTeamMember='Search by id, name'
        />
        <Button
          startIcon={show ? <FilterRemove /> : <Filter />}
          sx={{ textTransform: 'capitalize', marginRight: '3vw', width: '15%' }}
          onClick={() => {
            if (show) {
              const val = Object.values(filter).find(val => val)
              if (val) {
                setFilter({ verificationStatuses: undefined,
                  orgType: undefined,
                  sorter: []})
              }
            }
            setShow(prev => !prev)
          }}
          variant='contained'
        >
          {show ? 'Hide filters' : 'Filters'}
        </Button>
      </div>

      {show && (
        <Box
          sx={{
            minWidth: 250,
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
            marginBottom: '8vh',
            marginLeft: '10px'
          }}
        >
          <FormControl style={{ width: '20%' }}>
            <InputLabel id='demo-simple-select-label'>Transaction For</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={age}
              label='transaction'
              onChange={handleChange}
            >
              <MenuItem value={10}>All</MenuItem>
              <MenuItem value={20}>Order</MenuItem>
              <MenuItem value={30}>Lead</MenuItem>
              <MenuItem value={30}>Refund</MenuItem>
              <MenuItem value={30}>Recharge</MenuItem>
              <MenuItem value={30}>Project</MenuItem>
              <MenuItem value={30}>Team Member</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{ width: '20%' }}>
            <InputLabel id='demo-simple-select-label'>Transaction type</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={age}
              label='Age'
              onChange={handleChange}
            >
              <MenuItem value={10}>All</MenuItem>
              <MenuItem value={20}>Debit</MenuItem>
              <MenuItem value={30}>Credit</MenuItem>
            </Select>
          </FormControl>
          <Grid style={{ marginTop: '5px' }} item xs={12} lg={3} md={3} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                label='From'
                value={datefilter?.from || null}
                clearable
                onChange={e => {
                  if (e !== datefilter?.from) {
                    setDateFilter(prev => {
                      return {
                        ...prev,
                        from: e || undefined
                      }
                    })
                  }
                }}
                maxDate={datefilter?.to || null}
                renderInput={params => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={e => e.preventDefault()}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: hidden ? 'white' : 'inherit'
                      }
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid style={{ marginTop: '5px' }} item xs={12} lg={3} md={3} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                label='To'
                value={datefilter?.to || null}
                clearable
                onChange={e => {
                  if (e !== datefilter?.from) {
                    setDateFilter(prev => {
                      return {
                        ...prev,
                        to: e || undefined
                      }
                    })
                  }
                }}
                minDate={datefilter?.from || null}
                renderInput={params => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={e => e.preventDefault()}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: hidden ? 'white' : 'inherit'
                      }
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Box>
      )}
      <DataGrid
        autoHeight
        rows={transactionList}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        disableColumnMenu

        // loading={transactionList}
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
              No Transaction Found
            </Stack>
          ),
          NoResultsOverlay: () => (
            <Stack height='100%' alignItems='center' justifyContent='center'>
              No Transaction Found
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

export default TransactionList
