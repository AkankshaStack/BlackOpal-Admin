import moment from 'moment'
import { Avatar, Card, CardHeader, Grid, Stack, Tooltip, Typography } from '@mui/material'
import DrawerData from 'src/views/property/side-drawer'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { CheckCircleOutline, CloseCircleOutline, PencilOutline, Star, SwapVertical } from 'mdi-material-ui'
import Link from 'next/link'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import { useState, useEffect, ChangeEvent } from 'react'
import config from 'src/configs/config'
import { getProject, postPropertyStatus } from 'src/store/project'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { debounce } from 'lodash'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import MultiButton from 'src/views/components/multiButton/MultiButton'
import { useRouter } from 'next/router'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'
import { ERoutes } from 'src/common/routes'
import FilterCompoenent from 'src/views/components/filterUI'
import CustomChip from 'src/@core/components/mui/chip'
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

interface confirm {
  status: number
  visible: boolean
  id: number
}

const ApprovedProject = () => {
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [filters, setFilters] = useState<{
    sorter: GridSortModel
    rating?: number
  }>({
    sorter: [
      {
        field: 'createdAt',
        sort: 'desc'
      }
    ]
  })
  const router = useRouter()
  const [searchText, setSearchText] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const [confirm, setConfirm] = useState<confirm>({
    visible: false,
    status: 0,
    id: 0
  })
  const [openDrawer, setopenDrawer] = useState({
    visible: false,
    id: ''
  })
  const store = useSelector((state: any) => state.project)

  const call = (page: number, searchValue = searchText) => {
    const payload: pagiantion = {
      include: 'createdByUser',
      page,
      perPage: 10,
      status: config.propertyStatus.pending,
      sort: 'createdAt:desc'
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

  const handleApprove = (status: any) => {
    dispatch(postPropertyStatus({ undefined, status: status.status === 2 ? 'approve' : 'reject', id: status.id })).then(
      () => {
        call(store?.pagination?.currentPage || 1)
      }
    )

    setConfirm({
      visible: false,
      status: 0,
      id: 0
    })
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
      minWidth: 180,
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
      flex: 0.5,
      minWidth: 130,
      field: 'status',
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
      flex: 0.5,
      minWidth: 130,
      field: 'rating',
      headerName: 'rating',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <Typography
          noWrap
          className='underline-code'
          onClick={() => {
            router.push({ pathname: ERoutes.RATING.replace(':id', row?.id), query: { from: 'property-pending' } })
          }}
        >
          {row?.averageRating ? 1 * parseFloat(row?.averageRating?.toFixed(1)) : '-'}
        </Typography>
      )
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
      flex: 0.5,
      minWidth: 130,
      field: 'Unlist',
      headerName: 'Action',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <MultiButton
          options={[
            {
              label: 'Edit',
              tooltipLabel: 'Edit Property',
              onClick: () => {
                router.push({ pathname: `/project/edit/${row.id}`, query: { from: 'property-pending' } })
              },
              icon: <PencilOutline sx={{ marginRight: '-4px' }} />
            },
            {
              label: 'View Rating',
              tooltipLabel: 'View Rating',
              onClick: () => {
                router.push({ pathname: ERoutes.RATING.replace(':id', row?.id), query: { from: 'property-pending' } })
              },
              icon: <Star sx={{ marginRight: '-4px' }} />
            },
            {
              label: 'Approve',
              tooltipLabel: 'Approve',
              onClick: () => {
                setConfirm({
                  visible: true,
                  status: config.propertyStatus.approved,
                  id: row.id
                })
              },
              icon: <CheckCircleOutline color='success' sx={{ marginRight: '-4px' }} />,
              color: 'success.main'
            },
            {
              label: 'Decline',
              tooltipLabel: 'Decline',
              onClick: () => {
                setConfirm({
                  visible: true,
                  status: config.propertyStatus.declined,
                  id: row.id
                })
              },
              icon: <CloseCircleOutline color='error' sx={{ marginRight: '-4px' }} />,
              color: 'error'
            }
          ]}
        />
      )
    }
  ]

  return (
    <Card>
      <CardHeader title='Pending Properties' />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <QuickSearchToolbar
            isNotDataGrid
            width='100%'
            isTeamMember='Search by id, name, requested by'
            onChange={(event: ChangeEvent) => {
              handleSearch((event.target as HTMLButtonElement).value)
            }}
          />
        </Grid>
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
        <Grid item xs={12} sx={{ paddingTop: 0 }}>
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
      </Grid>
      <ImagePreview open={open} setOpen={setOpen} />
      <CustomDialog
        setShow={() =>
          setConfirm({
            visible: false,
            status: 0,
            id: 0
          })
        }
        show={Boolean(confirm.visible)}
        title={`Are you sure you want to
          ${
            config.propertyStatus1[confirm.status] === 'rejected' ? ' decline this property' : ' approve this property'
          }?`}
        buttonprop={{
          onClick: () => {
            handleApprove(confirm)
          }
        }}
      />
      <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />
    </Card>
  )
}

export default ApprovedProject
