import { Stack, Tooltip, Typography, Box, TextField, Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Fragment, useEffect, useState } from 'react'
import { transactionParam } from 'src/store/transaction/type'
import { paymentConversion, PER_PAGE, ruppeeCommaConversation, ruppeeConversation } from 'src/utilities/conversions'
import moment from 'moment'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import config from 'src/configs/config'
import FilterCompoenent from '../filterUI'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { CurrencyInr } from 'mdi-material-ui'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import CustomChip from 'src/@core/components/mui/chip'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { debounce } from 'lodash'
import { getPayments } from 'src/store/transaction'

function PaymentTable() {
  const [filter, setFilter] = useState<{ [key: string | number]: string | number | undefined }>({
    status: undefined
  })

  useEffect(() => {
    call()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const { transaction } = useSelector((state: RootState) => state)
  const dispatch = useDispatch<AppDispatch>()

  const call = (page = 1) => {
    const payload: transactionParam = {
      page: page,
      perPage: PER_PAGE,
      include: 'agent',
      ...filter
    }
    dispatch(getPayments(payload))
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
      headerName: 'Order Id',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => <Typography noWrap>{row.orderId}</Typography>,
      renderHeader: undefined
    },
    {
      flex: 0.5,
      minWidth: 200,
      field: 'gatewayRefId',
      sortable: false,
      headerName: 'Razorpay Id',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <Typography
          noWrap
          className='underline-code'
          onClick={() => {
            window.open(`${process.env.NEXT_PUBLIC_RAZORPAY_LINK}/${row.gatewayRefId}`, '_blank')
          }}
        >
          {row.gatewayRefId}
        </Typography>
      ),
      renderHeader: undefined
    },
    {
      flex: 0.5,
      minWidth: 250,
      field: 'firstName',
      sortable: false,
      headerName: 'Agent Name',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => {
        const { firstName, lastName, orgType } = row?.agent
        const name = orgType === 2 ? row?.agent?.agentInfo?.company.name : `${firstName} ${lastName}`

        return (
          <Tooltip title={name}>
            <Typography noWrap>{name?.length > 20 ? name?.slice(0, 20) + '...' : name || ''}</Typography>
          </Tooltip>
        )
      },
      renderHeader: undefined
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
              <CurrencyInr sx={{ fontSize: '1rem' }} />
            </Typography>
            <Typography variant='subtitle2'>{ruppeeConversation(row?.amountInPaisa)}</Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      flex: 0.5,
      minWidth: 200,
      field: 'refundAmountInPaisa',
      headerName: 'Refunded Amount',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Tooltip title={ruppeeCommaConversation(row?.refundAmountInPaisa)}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {row?.refundAmountInPaisa ? (
              <Fragment>
                <Typography variant='body2' sx={{ mt: 0.8, alignSelf: 'flex-start' }}>
                  <CurrencyInr sx={{ fontSize: '1rem' }} />
                </Typography>
                <Typography variant='subtitle2'>{ruppeeConversation(row?.amountInPaisa)}</Typography>
              </Fragment>
            ) : (
              '-'
            )}
          </Box>
        </Tooltip>
      )
    },
    {
      flex: 0.5,
      minWidth: 200,
      field: 'status',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Payment Status',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <CustomChip
          skin='light'
          variant='outlined'
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          label={config?.payment?.status[row.status]}
          color={paymentConversion(row?.status)}
        />
      )
    },
    {
      flex: 0.7,
      minWidth: 180,
      field: 'state',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Payment Date',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.createdAt ? moment(row?.createdAt).format('DD MMM YYYY hh:mm a') : '-'}</Typography>
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
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={3} md={3} xl={3} sx={{ width: '100%' }}>
          <QuickSearchToolbar
            onChange={(event: any) => handleSearch(event.target.value)}
            isNotDataGrid={true}
            rootSx={{ p: 0, pb: 0, marginLeft: 0, width: '100%' }}
            width='unset'
            variant='outlined'
            isTeamMember='Search by order id, razorpay id, agent name'
          />
        </Grid>
        <Grid item xs={12} lg={3} md={3} xl={3} sx={{ width: '100%' }}>
          <FilterCompoenent
            label='Payment Status'
            data={config?.payment?.status}
            value={filter?.status || ''}
            onChange={val =>
              setFilter(prev => {
                return {
                  ...prev,
                  status: val || undefined
                }
              })
            }
          />
        </Grid>
        <Grid item xs={12} lg={3} md={3} xl={3} style={{ marginTop: '5px' }}>
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
                <TextField {...params} InputLabelProps={{ shrink: true }} onKeyDown={e => e.preventDefault()} />
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
                <TextField {...params} InputLabelProps={{ shrink: true }} onKeyDown={e => e.preventDefault()} />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <div style={{ width: '100%', marginTop: '10px', overflow: 'scroll' }}>
        <DataGrid
          rows={transaction?.paymentData || []}
          autoHeight
          columns={columns}
          loading={transaction?.paymentLoading}
          disableSelectionOnClick
          disableColumnMenu
          pageSize={PER_PAGE}
          paginationMode='server'
          rowCount={transaction?.paymentPagination?.total}
          page={transaction?.paymentPagination?.currentPage ? transaction?.paymentPagination?.currentPage - 1 : 0}
          components={{
            NoRowsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                No Payments Found
              </Stack>
            ),
            NoResultsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                No Payments Found
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
    </Box>
  )
}

export default PaymentTable
