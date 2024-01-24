import { Stack, Typography, Link as MuiLInk, CardHeader, CardContent, Card, Grid } from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { Fragment, useEffect, useState } from 'react'
import moment from 'moment'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { PER_PAGE } from 'src/utilities/conversions'
import { debounce } from 'lodash'
import FilterCompoenent from 'src/views/components/filterUI'
import CustomChip from 'src/@core/components/mui/chip'
import { getCustomer, patchCustomerStatus } from 'src/store/customer'
import { customerParam } from 'src/store/customer/type'
import { customerConversion } from 'src/utilities/conversions'
import { CheckCircleOutline, CloseCircleOutline, SwapVertical } from 'mdi-material-ui'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import config from 'src/configs/config'

function PaymentTable() {
  const [filter, setFilter] = useState<{
    status?: number | string | undefined
    sorter: GridSortModel
  }>({
    sorter: [
      {
        field: 'createdAt',
        sort: 'desc'
      }
    ]
  })
  const [searchText, setSearchText] = useState('')
  const [deleteId, setDeleteId] = useState<{
    id?: number
    status?: number
  }>({})

  useEffect(() => {
    call()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const store = useSelector((state: RootState) => state.customer)

  const dispatch = useDispatch<AppDispatch>()

  const call = (page = store?.pagination?.currentPage || 1, searchValue = searchText) => {
    const payload: customerParam = {
      page: page,
      perPage: PER_PAGE,
      status: filter?.status
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    if (filter.sorter?.length) {
      payload.sort = `${filter.sorter[0].field}:${filter.sorter[0].sort}`
    }
    dispatch(getCustomer(payload))
  }
  const handleSearch = debounce((searchValue: string) => {
    setSearchText(searchValue)
    if (searchValue?.length > 0) {
      call(1, searchValue)
    } else {
      call(1, '')
    }
  }, 400)
  interface CellType {
    row: any
  }

  const handleDelete = () => {
    dispatch(
      patchCustomerStatus({
        id: deleteId.id || 0,
        status: deleteId?.status || 0
      })
    ).then((res: any) => {
      if (res?.payload?.status === 204) {
        toast.success('Customer updated successfully')
        call()
      }
    })
    setDeleteId({}) 
  }

  const columns: any = [
    {
      flex: 0.5,
      minWidth: 150,
      field: 'id',
      sortable: false,
      headerName: 'Customer Id',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => <Typography noWrap>{row?.id}</Typography>,
      renderHeader: undefined
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'firstName',
      sortable: false,
      headerName: 'Customer Name',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap>{`${row?.firstName || ''} ${row?.lastName || ''}`}</Typography>
      ),
      renderHeader: undefined
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'contactMobileNumber',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Mobile Number',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { contactMobileNumber } = row

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
      minWidth: 150,
      field: 'status',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Status',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <CustomChip
          skin='light'
          variant='outlined'
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          label={config?.collectionStatus[row.status]}
          color={customerConversion(row?.status)}
        />
      )
    },
    {
      flex: 0.7,
      minWidth: 180,
      field: 'createdAt',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Created At',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.createdAt ? moment(row?.createdAt).format('DD MMM YYYY hh:mm a') : '-'}</Typography>
      }
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Action',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Fragment>
            {row?.status === 2 ? (
              <LoadingButton
                variant='outlined'
                startIcon={<CheckCircleOutline color='success' />}
                disabled={store?.loading}
                onClick={() => {
                  setDeleteId({
                    id: row?.id,
                    status: 1
                  })
                }}
                color='success'
                sx={{ textTransform: 'initial' }}
              >
                Active
              </LoadingButton>
            ) : (
              <LoadingButton
                variant='outlined'
                startIcon={<CloseCircleOutline color='error' />}
                disabled={store?.loading}
                onClick={() => {
                  setDeleteId({
                    id: row?.id,
                    status: 2
                  })
                }}
                sx={{ textTransform: 'initial' }}
                color='error'
              >
                Inactive
              </LoadingButton>
            )}
          </Fragment>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader title='All Customer' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={3} md={3} xl={3} sx={{ width: '100%', mt: '8px' }}>
            <QuickSearchToolbar
              onChange={(event: any) => handleSearch(event.target.value)}
              isTeamMember='Search by Customer name'
              width='100%'
            />
          </Grid>
          <Grid item xs={12} lg={3} md={3} xl={3} sx={{ width: '100%' }}>
            <FilterCompoenent
              label='Customer Status'
              data={config?.collectionStatus}
              variant
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
          <Grid item xs={12} style={{ paddingTop: '5px' }}>
            <DataGrid
              rows={store?.data || []}
              autoHeight
              columns={columns}
              loading={store?.loading}
              disableSelectionOnClick
              disableColumnMenu
              pageSize={PER_PAGE}
              paginationMode='server'
              rowsPerPageOptions={[]}
              rowCount={store?.pagination?.total || 0}
              page={store?.pagination?.currentPage ? store?.pagination?.currentPage - 1 : 0}
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
                    No Customers Found
                  </Stack>
                ),
                NoResultsOverlay: () => (
                  <Stack height='100%' alignItems='center' justifyContent='center'>
                    No Customers Found
                  </Stack>
                ),
                ColumnUnsortedIcon: () => <SwapVertical />
              }}
              onPageChange={(newPage: number) => {
                call(newPage + 1)
              }}
              sx={{
                '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }
              }}
            />
          </Grid>
        </Grid>
        <CustomDialog
          title={`Are you sure you want to ${config?.collectionStatus[deleteId?.status || '1']} user?`}
          show={Boolean(deleteId?.status)}
          setShow={() => {
            setDeleteId({})
          }}
          buttonprop={{
            loading: store?.loading,
            onClick: () => handleDelete()
          }}
        />
      </CardContent>
    </Card>
  )
}

export default PaymentTable
