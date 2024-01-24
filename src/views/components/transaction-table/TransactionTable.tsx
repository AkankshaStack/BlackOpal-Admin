import { Stack, Tooltip, Typography, Box, TextField, Grid, Button, IconButton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Fragment, useEffect, useState } from 'react'
import { getTransactions } from 'src/store/transaction'
import { transactionParam } from 'src/store/transaction/type'
import { PER_PAGE, ruppeeCommaConversation, transactionStatusConversion } from 'src/utilities/conversions'
import moment from 'moment'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import config from 'src/configs/config'
import CustomChip from 'src/@core/components/mui/chip'
import FilterCompoenent from '../filterUI'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {
  CurrencyInr,
  Filter,
  FilterRemove,
  FilterRemoveOutline,
  InformationOutline,
  Minus,
  Plus
} from 'mdi-material-ui'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { debounce } from 'lodash'
import { CustomChipProps } from 'src/@core/components/mui/chip/types'
import CustomTransactionTooltip from '../custom-transction-tolltip/CustomTransactionTooltip'
import DrawerData from 'src/views/property/side-drawer'

function TransactionTable({ name }: { name: string }) {
  const [filter, setFilter] = useState<{ [key: string | number]: string | number | undefined }>({})
  const [show, setShow] = useState(false)
  const [openDrawer, setopenDrawer] = useState({
    visible: false,
    id: ''
  })
  useEffect(() => {
    call()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const { transaction, user } = useSelector((state: RootState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const iconStyle = (type: number) => {
    return {
      fontSize: '1rem',
      color: config?.transactions?.type?.debit === type ? 'error.main' : 'success.main'
    }
  }
  const call = (page = 1) => {
    const payload: transactionParam = {
      page: page,
      perPage: PER_PAGE,
      userId: (user?.singleData as any)?.userDetails?.id,
      include: 'order,agent',
      ...filter
    }
    dispatch(getTransactions(payload))
  }
  interface CellType {
    row: any
  }
  const columns: any = [
    {
      flex: 0.5,
      minWidth: 150,
      field: 'id',
      sortable: false,
      headerName: 'Transaction Id',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => <Typography noWrap>{row?.transactionRefId}</Typography>,
      renderHeader: undefined
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'agent',
      sortable: false,
      headerName: 'Transaction By',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <Tooltip title={row?.agent?.orgType ? name : `${row?.agent?.firstName || ''} ${row?.agent?.lastName || ''}`}>
          <Typography
            noWrap
            sx={{
              textTransform: 'capitalize'
            }}
          >
            {row?.agent?.orgType ? name : `${row?.agent?.firstName || ''} ${row?.agent?.lastName || ''}`}
          </Typography>
        </Tooltip>
      ),
      renderHeader: undefined
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'type',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Transaction For',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Fragment>
          <Typography
            noWrap
            sx={{
              textTransform: 'capitalize'
            }}
          >
            {config?.transactions?.transactionFor[row.transactionFor]}
          </Typography>
          <div style={{ marginLeft: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CustomTransactionTooltip row={row} setopenDrawer={setopenDrawer}>
              <InformationOutline sx={{ fontSize: '16px', color: 'primary.main' }} />
            </CustomTransactionTooltip>
          </div>
        </Fragment>
      )
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'amount',
      headerName: 'Amount',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Tooltip title={ruppeeCommaConversation(row?.amountInPaisa)}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography variant='body2' sx={{ mt: 0.8, alignSelf: 'flex-start' }}>
              {config?.transactions?.type?.debit === row?.type ? (
                <Minus sx={iconStyle(row?.type)} />
              ) : (
                <Plus sx={iconStyle(row?.type)} />
              )}
            </Typography>
            <Typography variant='body2' sx={{ mt: 0.8, alignSelf: 'flex-start' }}>
              <CurrencyInr sx={iconStyle(row?.type)} />
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                color: config?.transactions?.type?.debit === row?.type ? 'error.main' : 'success.main'
              }}
            >
              {ruppeeCommaConversation(row?.amountInPaisa)}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'status',
      sortable: false,
      headerName: 'Status',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => {
        const chipObject = transactionStatusConversion(row?.status, row?.transactionFor)

        return (
          <CustomChip
            skin='light'
            size='small'
            variant='outlined'
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
            label={chipObject?.text}
            color={chipObject.color as CustomChipProps['color']}
          />
        )
      },
      renderHeader: undefined
    },
    {
      flex: 0.7,
      minWidth: 180,
      field: 'state',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Transaction Date',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.paidAt ? moment(row?.paidAt).format('DD MMM YYYY hh:mm a') : '-'}</Typography>
      }
    }
  ]
  const handleSearch = debounce((searchValue: string) => {
    setFilter(prev => {
      return {
        ...prev,
        q: searchValue || undefined
      }
    })
  }, 600)

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: '20px', justifyContent: 'space-between' }}>
      <Box>
        <QuickSearchToolbar
          onChange={(event: any) => handleSearch(event.target.value)}
          rootSx={{ p: 0, pb: 0, marginLeft: 0, width: '100%', ml: 0 }}
          width='unset'
          isTeamMember='Search by transaction id, team member name'
        />
      </Box>
      <Box>
        {show && Object.values(filter).find(val => val) ? (
          <Tooltip title='Clear filters'>
            <IconButton
              sx={{ mr: 2 }}
              onClick={() => {
                const val = Object.values(filter).find(val => val)
                if (val) {
                  setFilter({})
                }
              }}
            >
              <FilterRemoveOutline />
            </IconButton>
          </Tooltip>
        ) : null}
        <Button
          startIcon={show ? <FilterRemove /> : <Filter />}
          sx={{ textTransform: 'capitalize' }}
          onClick={() => {
            if (show) {
              const val = Object.values(filter).find(val => val)
              if (val) {
                setFilter({})
              }
            }
            setShow(prev => !prev)
          }}
          variant='contained'
        >
          {show ? 'Hide filters' : 'Filters'}
        </Button>
      </Box>
      {show && (
        <Grid container spacing={4}>
          <Grid item xs={12} lg={3} md={3} xl={3} sx={{ width: '100%' }}>
            <FilterCompoenent
              label='Transaction for'
              data={config?.transactions?.transactionFor}
              value={filter?.transactionFor || ''}
              onChange={val =>
                setFilter(prev => {
                  return {
                    ...prev,
                    transactionFor: val || undefined
                  }
                })
              }
            />
          </Grid>
          <Grid item xs={12} lg={3} md={3} xl={3} sx={{ width: '100%' }}>
            <FilterCompoenent
              label='Transaction type'
              data={config?.transactions?.revtype}
              value={filter?.type || ''}
              onChange={val =>
                setFilter(prev => {
                  return {
                    ...prev,
                    type: val || undefined
                  }
                })
              }
            />
          </Grid>
          <Grid style={{ marginTop: '5px' }} item xs={12} lg={3} md={3} xl={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                label='From'
                value={filter?.from || null}
                clearable
                onChange={e => {
                  if (e !== filter?.from) {
                    setFilter(prev => {
                      return {
                        ...prev,
                        from: e || undefined
                      }
                    })
                  }
                }}
                maxDate={filter?.to || null}
                renderInput={params => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={e => e.preventDefault()}
                    fullWidth
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
                value={filter?.to || null}
                clearable
                onChange={e => {
                  if (e !== filter?.from) {
                    setFilter(prev => {
                      return {
                        ...prev,
                        to: e || undefined
                      }
                    })
                  }
                }}
                minDate={filter?.from || null}
                renderInput={params => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={e => e.preventDefault()}
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      )}
      <div style={{ width: '100%', marginTop: '10px', overflow: 'scroll' }}>
        <DataGrid
          rows={transaction?.data || []}
          autoHeight
          columns={columns}
          loading={transaction?.loading}
          disableSelectionOnClick
          disableColumnMenu
          pageSize={PER_PAGE}
          paginationMode='server'
          rowCount={transaction?.pagination?.total}
          page={transaction?.pagination?.currentPage ? transaction?.pagination?.currentPage - 1 : 0}
          components={{
            NoRowsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                No Transactions Found
              </Stack>
            ),
            NoResultsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                No Transactions Found
              </Stack>
            )
          }}
          onPageChange={(newPage: number) => {
            call(newPage + 1)
          }}
          sx={{
            '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }
          }}
        />
      </div>
      <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />
    </Box>
  )
}

export default TransactionTable
