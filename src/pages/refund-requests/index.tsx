import {
  Stack,
  Tooltip,
  Typography,
  Box,
  Grid,
  Checkbox,
  DialogContent,
  FormControl,
  InputLabel,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  CardContent,
  Card,
  CardHeader,
  Button,
  DialogActions
} from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { Fragment, useEffect, useState } from 'react'
import { getRefundRequests, patchRefundRequest } from 'src/store/transaction'
import { transactionParam } from 'src/store/transaction/type'
import { PER_PAGE, refundStatusConversion, ruppeeCommaConversation } from 'src/utilities/conversions'
import moment from 'moment'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import config from 'src/configs/config'
import CustomChip from 'src/@core/components/mui/chip'
import FilterCompoenent from 'src/views/components/filterUI'
import { CurrencyInr, Eye, SwapVertical } from 'mdi-material-ui'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { debounce } from 'lodash'
import { CustomChipProps } from 'src/@core/components/mui/chip/types'
import MultiButton from 'src/views/components/multiButton/MultiButton'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'

interface FormInputs {
  cancelReason: string[]
  status: string
  declinedReason: string
}
const schema = yup.object().shape({
  cancelReason: yup
    .array()
    .notRequired()
    .optional()
    .when('status', {
      is: (status: string) => {
        if (status === String(config?.transactions?.refund?.status?.approve)) {
          return false
        } else {
          return true
        }
      },
      then: yup.array().min(1, 'Please select tags').required('Please select reason')
    })
    .required('Please select reason'),
  declinedReason: yup
    .string()
    .strict(false)
    .trim()
    .notRequired()
    .optional()
    .when('cancelReason', {
      is: (cancelReason: string) => {
        if (!cancelReason?.includes('Other')) {
          return false
        } else {
          return true
        }
      },
      then: yup.string().strict(false).trim().required('Please enter reason')
    }),
  status: yup.string().required('Please select status')
})
function RefundRequests({ name }: { name: string }) {
  const [searchText, setSearchText] = useState<string>('')

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
  const [show, setShow] = useState<boolean | number>(false)

  useEffect(() => {
    call()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const { transaction } = useSelector((state: RootState) => state)
  const dispatch = useDispatch<AppDispatch>()

  const call = (page = 1, searchValue = searchText) => {
    const payload: transactionParam = {
      page: page,
      perPage: PER_PAGE,
      include: 'agent,wallet',
      status: filter?.status
    }

    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    if (filter.sorter?.length) {
      payload.sort = `${filter.sorter[0].field}:${filter.sorter[0].sort}`
    }
    dispatch(getRefundRequests(payload))
  }

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isValid, isDirty, errors }
  } = useForm<FormInputs>({
    defaultValues: { cancelReason: [], status: '', declinedReason: '' },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  interface CellType {
    row: any
  }
  const columns: any = [
    {
      flex: 0.5,
      minWidth: 150,
      field: 'id',
      sortable: false,
      headerName: 'Refund Id',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => <Typography noWrap>{row?.id}</Typography>,
      renderHeader: undefined
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'transactionRefId',
      sortable: false,
      headerName: 'Transcation Id',
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
      headerName: 'Agent Name',
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
            {row?.agent?.userDetails?.orgType === config.orgType.company
              ? row?.agent?.company?.name || ''
              : `${row?.agent?.userDetails?.firstName || ''} ${row?.agent?.userDetails?.lastName || ''}`}
          </Typography>
        </Tooltip>
      ),
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography variant='subtitle2' sx={{ mt: 0.8, alignSelf: 'flex-start' }}>
            <CurrencyInr style={{ fontSize: 'inherit' }} />
          </Typography>
          <Typography variant='subtitle2'>{ruppeeCommaConversation(row?.amountInPaisa)}</Typography>
        </Box>
      )
    },
    {
      flex: 0.5,
      minWidth: 240,
      field: 'wallet',
      headerName: 'Current wallet balance',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography variant='subtitle2' sx={{ mt: 0.8, alignSelf: 'flex-start' }}>
            <CurrencyInr style={{ fontSize: 'inherit' }} />
          </Typography>
          <Typography variant='subtitle2'>{ruppeeCommaConversation(row?.wallet?.amountInPaisa)}</Typography>
        </Box>
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
        const chipObject = refundStatusConversion(row?.status)

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
      flex: 1,
      minWidth: 220,
      field: 'createdAt',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Refund initiate date',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.createdAt ? moment(row?.createdAt).format('DD MMM YYYY hh:mm a') : '-'}</Typography>
      }
    },
    {
      flex: 0.7,
      minWidth: 180,
      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Action',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <MultiButton
            options={[
              {
                label: 'View Details',
                tooltipLabel: 'View',
                onClick: () => {
                  const findIndex = transaction?.data?.findIndex((val: { id: any }) => val.id === row?.id)
                  setShow(findIndex + 1)
                },
                icon: <Eye sx={{ marginRight: '-4px' }} />
              }
            ]}
          />
        )
      }
    }
  ]

  const handleSearch = debounce((searchValue: string) => {
    setSearchText(searchValue)
    if (searchValue.length > 0) {
      call(1, searchValue)
    } else {
      call(1, '')
    }
  }, 400)
  const onSubmit1 = (data: FormInputs) => {
    let payload = {}
    if (data.status === String(config?.transactions?.refund?.status?.approve)) {
      payload = {
        refundId: transaction?.data[Number(show) - 1]?.id,
        cancelReason: null,
        userId: transaction?.data[Number(show) - 1]?.agent?.userDetails?.id,
        status: Number(data?.status)
      }
    } else {
      payload = {
        refundId: transaction?.data[Number(show) - 1]?.id,
        cancelReason:
          data.cancelReason.indexOf('Other') >= 0 ? data.declinedReason || '' : data.cancelReason.join('\n') || '',
        userId: transaction?.data[Number(show) - 1]?.agent?.userDetails?.id,
        status: Number(data?.status)
      }
    }
    dispatch(patchRefundRequest(payload)).then(res => {
      if (res?.payload?.status === 204) {
        toast.success('Refund updated successfully')
        setShow(false)
        reset()
        call(transaction?.refundPagination?.currentPage)
      }
    })
  }

  return (
    <Card>
      <CardHeader title='Refund Requests' />
      <CardContent>
        <Grid container rowSpacing={2} columnSpacing={6}>
          <Grid item xs={12} lg={3} md={3} xl={3} sx={{ width: '100%' }}>
            <QuickSearchToolbar
              onChange={(event: any) => handleSearch(event.target.value)}
              width='unset'
              rootSx={{
                pt: 4,
                ml: 2
              }}
              isTeamMember='Search by refund id, agent name'
            />
          </Grid>
          <Grid item xs={12} lg={3} md={3} xl={3} sx={{ width: '100%' }}>
            <FilterCompoenent
              label='Refund Status'
              variant
              data={config?.transactions?.refund?.status}
              value={filter?.status || ''}
              reverseObj
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
        </Grid>

        <div style={{ width: '100%', marginTop: '10px', overflow: 'scroll' }}>
          <DataGrid
            rows={transaction?.data || []}
            autoHeight
            columns={columns}
            loading={transaction?.refundLoading}
            disableSelectionOnClick
            disableColumnMenu
            pageSize={PER_PAGE}
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
            rowCount={transaction?.pagination?.total}
            page={transaction?.pagination?.currentPage ? transaction?.pagination?.currentPage - 1 : 0}
            components={{
              NoRowsOverlay: () => (
                <Stack height='100%' alignItems='center' justifyContent='center'>
                  No Refund Requests Found
                </Stack>
              ),
              NoResultsOverlay: () => (
                <Stack height='100%' alignItems='center' justifyContent='center'>
                  No Refund Requests Found
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
        </div>

        <CustomDialog
          title='View details'
          show={Boolean(show)}
          setShow={() => {
            setShow(false)
            reset()
          }}
          buttonprop={{}}
          dialogContent={
            <DialogContent style={{ marginBottom: '20px' }}>
              <Grid container spacing={4}>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2'>Refund Id</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='subtitle1' noWrap>
                    {show ? transaction?.data[Number(show) - 1]?.id : '-'}
                  </Typography>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2'>Amount</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant='subtitle2' sx={{ mt: 0.8, alignSelf: 'flex-start' }}>
                      <CurrencyInr style={{ fontSize: 'inherit' }} />
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }} variant='subtitle1' noWrap>
                      {ruppeeCommaConversation(transaction?.data[Number(show) - 1]?.amountInPaisa)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Typography variant='body2'>Wallet Balance</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant='subtitle2' sx={{ mt: 0.8 }}>
                      <CurrencyInr style={{ fontSize: 'inherit' }} />
                    </Typography>
                    <Tooltip
                      title={ruppeeCommaConversation(transaction?.data[Number(show) - 1]?.wallet?.amountInPaisa)}
                    >
                      <Typography sx={{ fontWeight: 600 }} variant='subtitle1' noWrap>
                        {ruppeeCommaConversation(transaction?.data[Number(show) - 1]?.wallet?.amountInPaisa)}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>Refund Reason</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='subtitle1'>
                    {transaction?.data[Number(show) - 1]?.refundReason || '-'}
                  </Typography>
                </Grid>
                {transaction?.data[Number(show) - 1]?.status === config?.transactions?.refund?.status?.decline ? (
                  <Grid item xs={12}>
                    <Typography variant='body2'>Cancel Reason</Typography>
                    <Typography sx={{ fontWeight: 600, whiteSpace: 'pre-line' }} variant='subtitle1'>
                      {transaction?.data[Number(show) - 1]?.cancelReason || '-'}
                    </Typography>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  {transaction?.data[Number(show) - 1]?.status === config?.transactions?.refund?.status?.pending ? (
                    <form onSubmit={handleSubmit(onSubmit1)}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel>Refund Status</InputLabel>
                        <Controller
                          name='status'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              value={value || ''}
                              sx={{ textTransform: 'capitalize' }}
                              onChange={e => {
                                if (e.target.value === String(config?.transactions?.refund?.status?.success)) {
                                  setValue('cancelReason', [])
                                  setValue('declinedReason', '')
                                }
                                onChange(e)
                              }}
                              label='Refund Status'
                              aria-describedby='validation-basic-first-name'
                            >
                              {Object.entries(config?.transactions?.refund?.status).map(([key1, val]) => {
                                if (val !== config?.transactions?.refund?.status?.pending) {
                                  return (
                                    <MenuItem value={String(val)} sx={{ textTransform: 'capitalize' }} key={key1}>
                                      {key1}
                                    </MenuItem>
                                  )
                                }
                              })}
                            </Select>
                          )}
                        />

                        {errors.status && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors?.status?.message}</FormHelperText>
                        )}
                      </FormControl>
                      {watch('status')?.length &&
                      watch('status') === String(config?.transactions?.refund?.status?.decline) ? (
                        <Fragment>
                          <FormControl fullWidth sx={{ mb: watch('cancelReason').includes('Other') ? 4 : 0 }}>
                            <InputLabel required>Decline reason</InputLabel>
                            <Controller
                              name='cancelReason'
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <Select
                                  multiple
                                  required
                                  value={value || ''}
                                  onChange={event => {
                                    if (event.target.value.indexOf('Other') >= 0) {
                                      if (
                                        value?.length === 1 &&
                                        value[0] === 'Other' &&
                                        event.target.value?.length > 1
                                      ) {
                                        const data = event.target.value as string[]
                                        data.splice(event.target.value.indexOf('Other'), 1)
                                        onChange(data)
                                      } else {
                                        onChange(['Other'])
                                      }

                                      return
                                    } else {
                                      const {
                                        target: { value }
                                      } = event
                                      onChange(typeof value === 'string' ? value.split(',') : value)
                                    }
                                  }}
                                  fullWidth
                                  label='Decline reason'
                                  renderValue={selected => {
                                    return selected.join(', ')
                                  }}
                                  aria-describedby='validation-basic-first-name'
                                >
                                  {config?.declinedReason.map((name: string) => (
                                    <MenuItem key={name} value={name}>
                                      <Checkbox checked={watch('cancelReason').indexOf(name) > -1} />
                                      <ListItemText primary={name} />
                                    </MenuItem>
                                  ))}
                                  <MenuItem value='Other'>
                                    <Checkbox checked={watch('cancelReason').indexOf('Other') > -1} />
                                    <ListItemText primary='Other' />
                                  </MenuItem>
                                </Select>
                              )}
                            />
                            {errors.cancelReason && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {(errors?.cancelReason as any)?.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                          {watch('cancelReason').includes('Other') ? (
                            <FormControl fullWidth sx={{ mb: 4 }}>
                              <Controller
                                name='declinedReason'
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    required
                                    label='Reason'
                                    rows={4}
                                    aria-describedby='validation-basic-first-name'
                                  />
                                )}
                              />
                              {errors.declinedReason && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                  {errors?.declinedReason?.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          ) : null}
                        </Fragment>
                      ) : null}
                      <DialogActions sx={{ pb: 0, mb: 0 }}>
                        <Button
                          variant='contained'
                          onClick={() => {
                            setShow(false)
                            reset()
                          }}
                          color='secondary'
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          variant='contained'
                          style={{
                            marginLeft: '15px'
                          }}
                          type='submit'
                          loading={transaction?.refundLoading}
                          disabled={!(isValid && isDirty)}
                          color='primary'
                        >
                          Submit
                        </LoadingButton>
                      </DialogActions>
                    </form>
                  ) : null}
                </Grid>
              </Grid>
            </DialogContent>
          }
          action
        />
      </CardContent>
    </Card>
  )
}

export default RefundRequests
