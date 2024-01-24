import moment from 'moment'

// ** React Imports
import { useState, useEffect, ChangeEvent } from 'react'

// ** Store Imports

// ** Custom Components Imports
import { useAuth } from 'src/hooks/useAuth'

import CustomChip from 'src/@core/components/mui/chip'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { debounce } from 'lodash'

// ** Utils Import

// ** Actions Imports

// ** MUI Imports
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import { getProject } from 'src/store/project'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import config from 'src/configs/config'
import DrawerData from 'src/views/property/side-drawer'
import { CheckCircleOutline, Close, PencilOutline, Star } from 'mdi-material-ui'
import Link from 'next/link'
import { postPropertyStatus } from 'src/store/project'
import MultiButton from 'src/views/components/multiButton/MultiButton'
import { useRouter } from 'next/router'
import { ERoutes } from 'src/common/routes'
import { SwapVertical } from 'mdi-material-ui'
import FilterCompoenent from 'src/views/components/filterUI'
import { propertyConversion } from 'src/utilities/conversions'

interface CellType {
  row: any
}
interface pagiantion {
  include: string
  page: number
  perPage: number
  status: number
  q?: string
  sort?: string
  rating?: number
}

const DeclinedProject = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [confirm1, setConfirm1] = useState<string>('')
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const router = useRouter()
  const auth = useAuth()

  const [openDrawer, setopenDrawer] = useState({
    visible: false,
    id: ''
  })
  const [filters, setFilters] = useState<{ rating?: number; sorter: GridSortModel }>({
    sorter: [
      {
        field: 'statusUpdatedOn',
        sort: 'desc'
      }
    ]
  })
  const dispatch = useDispatch<AppDispatch>()
  const [showContent, setshowContent] = useState<string>('')

  const store = useSelector((state: any) => state.project)

  const check = auth?.user?.roles?.some((el: any) => {
    return el.name === 'jh-project-admin'
  })
  const call = (page: number, searchValue = '') => {
    const payload: pagiantion = {
      include: 'createdByUser,statusUpdatedByUser',
      page,
      perPage: 10,
      status: config.propertyStatus.declined,
      sort: 'updatedAt:desc'
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    if (filters?.sorter?.length > 0) {
      payload.sort = `${filters?.sorter[0].field}:${filters?.sorter[0].sort}`
    }
    if (filters?.rating) {
      payload.rating = filters?.rating
    }

    dispatch(getProject(payload))
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
    call(1)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])
  const handleApprove = (status: string) => {
    const payload: pagiantion = {
      include: 'address,createdByUser,statusUpdatedByUser',
      page: store.pagination.currentPage,
      perPage: 10,
      status: config.propertyStatus.declined,
      sort: 'updatedAt:desc'
    }
    if (searchText.length > 0) {
      payload.q = searchText
    }

    dispatch(postPropertyStatus({ payload, status: 'approve', id: status }))

    setConfirm1('')
  }

  const columns: any = [
    {
      flex: 0.5,
      minWidth: 150,
      field: 'projectCode',
      sortable: false,
      headerName: 'ID',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <Typography
          noWrap
          className='underline-code'
          onClick={() => {
            setopenDrawer({
              visible: true,
              id: row?.id
            })
          }}
        >
          {row.code}
        </Typography>
      ),
      renderHeader: undefined
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'image',
      headerName: 'Image',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <div
            onClick={() =>
              setOpen({
                visible: true,
                url: row?.images?.length > 0 ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row?.images[0]}` : ''
              })
            }
            style={{
              cursor: 'pointer'
            }}
          >
            <Avatar src={row?.images?.length > 0 ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row?.images[0]}` : ''} />
          </div>
        )
      }
    },
    {
      flex: 1,
      minWidth: 200,
      field: 'name',
      headerName: 'Property Name',
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.name} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography noWrap>
              {row?.name?.length > config.nameLengthCheck
                ? row?.name?.slice(0, config.nameLengthCheck) + '...'
                : row?.name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'requestedBy',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Requested By',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        if (row?.createdByUser?.firstName || row?.createdByUser?.lastName) {
          return (
            <Link href={row?.orgType ? `/user/${row?.createdByUser?.agentInfo?.id}` : ''} style={{ cursor: 'pointer' }}>
              <Tooltip
                arrow
                title={
                  row?.createdByUser?.firstName
                    ? row?.createdByUser?.firstName || '' + ' ' + row?.createdByUser?.lastName || ''
                    : ''
                }
              >
                <Avatar src={row?.createdByUser?.profilePictureSlug || ''} style={{ cursor: 'pointer' }} />
              </Tooltip>
            </Link>
          )
        } else {
          return (
            <Link href={`/user/${row?.createdByUser?.agentInfo?.id}`} style={{ cursor: 'pointer' }}>
              <Tooltip
                arrow
                title={
                  row?.createdByUser?.agentInfo?.company?.name ? row?.createdByUser?.agentInfo?.company?.name || '' : ''
                }
              >
                <Avatar src={row?.createdByUser?.profilePictureSlug || ''} style={{ cursor: 'pointer' }} />
              </Tooltip>
            </Link>
          )
        }
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'declinedBy',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Declined BY',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            arrow
            title={
              (row?.statusUpdatedByUser?.firstName ? row?.statusUpdatedByUser?.firstName : '') +
                ' ' +
                (row?.statusUpdatedByUser?.lastName ? row?.statusUpdatedByUser?.lastName : '') || ''
            }
          >
            <Avatar src={row?.statusUpdatedByUser?.profilePictureSlug || ''} style={{ cursor: 'pointer' }} />
          </Tooltip>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 130,
      field: 'rating',
      headerName: 'Rating',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      hide: !check,
      renderCell: ({ row }: CellType) => (
        <Typography
          noWrap
          className='underline-code'
          onClick={() => {
            router.push({
              pathname: ERoutes.RATING.replace(':id', row?.id),
              query: { from: 'declined' }
            })
          }}
        >
          {row?.averageRating ? 1 * parseFloat(row?.averageRating?.toFixed(1)) : '-'}
        </Typography>
      )
    },
    {
      flex: 0.5,
      minWidth: 130,
      field: 'unlist',
      headerName: 'Status',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={Object.keys(config?.propertyStatus).find(key => config?.propertyStatus[key] === row?.status)}
            color={propertyConversion(row?.status)}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.9,
      minWidth: 170,
      field: 'createdAt',
      headerName: 'Requested on',
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return <Typography noWrap>{row?.createdAt ? moment(row?.createdAt).format('DD MMM YYYY') : '-'}</Typography>
      }
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'statusUpdatedOn',
      headerName: 'Upddated On',
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap>
            {row?.statusUpdatedOn ? moment(row?.statusUpdatedOn).format('DD MMM YYYY') : '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.9,
      minWidth: 170,
      field: 'requested',
      headerName: 'Action',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      hide: !check,
      renderCell: ({ row }: CellType) => {
        const check = auth?.user?.roles?.some((el: any) => {
          return el.name === 'jh-project-admin'
        })

        return (
          <>
            {/* <Tooltip title={row?.verificationStatusRemark}>
              <IconButton
                onClick={() => {
                  setshowContent(row?.verificationStatusRemark)
                }}
              >
                <Eye />
              </IconButton>
            </Tooltip> */}

            {check && (
              <>
                <MultiButton
                  options={[
                    {
                      label: 'Edit',
                      tooltipLabel: 'Edit Property',
                      onClick: () => {
                        router.push({ pathname: `/project/edit/${row.id}`, query: { from: 'declined' } })
                      },
                      icon: <PencilOutline sx={{ marginRight: '-4px' }} />
                    },
                    {
                      label: 'View Rating',
                      tooltipLabel: 'View Rating',
                      onClick: () => {
                        router.push({
                          pathname: ERoutes.RATING.replace(':id', row?.id),
                          query: { from: 'declined' }
                        })
                      },
                      icon: <Star sx={{ marginRight: '-4px' }} />
                    },
                    {
                      label: 'Approve',
                      tooltipLabel: 'Approve',
                      onClick: () => {
                        setConfirm1(String(row?.id))
                      },
                      icon: <CheckCircleOutline color='success' sx={{ marginRight: '-4px' }} />,
                      color: 'success.main'
                    }
                  ]}
                />
              </>
            )}
          </>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader title='Declined Properties' />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <QuickSearchToolbar
            isNotDataGrid
            isTeamMember='Search by id, name, requested by'
            onChange={(event: ChangeEvent) => {
              handleSearch((event.target as HTMLButtonElement).value)
            }}
            width='100%'
          />
        </Grid>
        {check ? (
          <Grid item xs={12} sm={3}>
            <FilterCompoenent
              label='Rating'
              sx={{ textTransform: 'initial !important' }}
              selectSx={{ textTransform: 'initial !important' }}
              data={config?.rating}
              variant
              value={filters?.rating || ''}
              onChange={val =>
                setFilters((prev: any) => {
                  return {
                    ...prev,
                    rating: val || undefined
                  }
                })
              }
            />
          </Grid>
        ) : null}

        <Grid item xs={12} sx={{ paddingTop: 0 }}>
          {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
          <DataGrid
            autoHeight
            rows={store?.projects || []}
            rowCount={store?.pagination?.total}
            disableSelectionOnClick
            disableColumnMenu
            loading={store?.loading}
            page={store?.pagination?.currentPage ? store?.pagination?.currentPage - 1 : 0}
            paginationMode='server'
            sortingMode='server'
            onSortModelChange={model => {
              setFilters(prev => {
                return { ...prev, sorter: model }
              })
            }}
            initialState={{
              sorting: {
                sortModel: filters?.sorter
              }
            }}
            columns={columns}
            onPageChange={(newPage: number) => {
              call(newPage + 1)
            }}
            pageSize={10}
            components={{
              NoRowsOverlay: () => (
                <Stack height='100%' alignItems='center' justifyContent='center'>
                  No Property Found
                </Stack>
              ),
              NoResultsOverlay: () => (
                <Stack height='100%' alignItems='center' justifyContent='center'>
                  No Property Found
                </Stack>
              ),

              ColumnUnsortedIcon: () => <SwapVertical />
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }
            }}
          />
        </Grid>
        <ImagePreview open={open} setOpen={setOpen} />
        <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />
      </Grid>
      <Dialog
        fullWidth
        open={Boolean(showContent?.length !== 0)}
        maxWidth='xs'
        scroll='body'
        onClose={() => {
          setshowContent('')
        }}
        onBackdropClick={() => {
          setshowContent('')
        }}
      >
        <h4 style={{ textAlign: 'center', margin: '20px 10px 0 10px' }}>Declining Reason</h4>
        <IconButton sx={{ position: 'absolute', top: '10px', right: '20px' }} onClick={() => setshowContent('')}>
          <Close />
        </IconButton>

        <DialogContent style={{ marginTop: '20px', marginBottom: '20px' }}>
          <TextField
            value={showContent}
            fullWidth
            multiline
            rows={4}
            disabled
            aria-describedby='validation-basic-first-name'
          />
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(confirm1.length > 0)} onClose={() => setConfirm1('')} aria-labelledby='confirm-dialog'>
        <DialogTitle id='confirm-dialog'>Are you sure you want to approve this property?</DialogTitle>
        <DialogActions sx={{ marginLeft: 'auto' }}>
          <Button variant='contained' onClick={() => setConfirm1('')} color='secondary'>
            No
          </Button>
          <Button
            variant='contained'
            style={{
              marginLeft: '15px'
            }}
            onClick={() => {
              handleApprove(confirm1)
            }}
            color='primary'
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DeclinedProject
