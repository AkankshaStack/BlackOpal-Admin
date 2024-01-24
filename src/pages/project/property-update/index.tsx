import moment from 'moment'
import { Avatar, Card, CardHeader, Grid, Stack, Tooltip, Typography } from '@mui/material'
import DrawerData from 'src/views/property/side-drawer'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { PencilOutline, Star, SwapVertical } from 'mdi-material-ui'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import { useState, useEffect, ChangeEvent } from 'react'
import config from 'src/configs/config'
import { getProject } from 'src/store/project'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { debounce } from 'lodash'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import MultiButton from 'src/views/components/multiButton/MultiButton'
import { useRouter } from 'next/router'
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
  q?: string
  sort?: string
  status?: number
  rating?: number
  update?: string
}

const PropertyUpdate = () => {
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [filters, setFilters] = useState<{
    sorter: GridSortModel
    rating?: number
    status?: number
  }>({
    sorter: [
      {
        field: 'updatedAt',
        sort: 'desc'
      }
    ]
  })
  const router = useRouter()
  const [searchText, setSearchText] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()

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
      update: 'true',
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
    if (filters?.status) {
      payload.status = filters?.status
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
      minWidth: 170,
      field: 'updatedAt',
      align: 'center',
      headerAlign: 'center',
      headerName: 'last Updated On',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return <Typography noWrap>{row?.updatedAt ? moment(row?.updatedAt).format('DD MMM YYYY') : '-'}</Typography>
      }
    },
    {
      flex: 0.9,
      minWidth: 170,
      field: 'statusUpdatedOn',
      headerName: 'Active Date',
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
                router.push({ pathname: `/project/edit/${row.id}`, query: { from: 'property-update' } })
              },
              icon: <PencilOutline sx={{ marginRight: '-4px' }} />
            },
            {
              label: 'View Rating',
              tooltipLabel: 'View Rating',
              onClick: () => {
                router.push({ pathname: ERoutes.RATING.replace(':id', row?.id), query: { from: 'property-update' } })
              },
              icon: <Star sx={{ marginRight: '-4px' }} />
            }
          ]}
        />
      )
    }
  ]

  return (
    <Card>
      <CardHeader title='Property Update' />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <QuickSearchToolbar
            isNotDataGrid
            onChange={(event: ChangeEvent) => {
              handleSearch((event.target as HTMLButtonElement).value)
            }}
            width='100%'
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
        <Grid item xs={12} sm={3}>
          <FilterCompoenent
            label='Property status'
            sx={{ textTransform: 'initial !important' }}
            selectSx={{ textTransform: 'initial !important' }}
            data={config?.propertyStatus}
            variant
            reverseObj
            value={filters?.status || ''}
            onChange={val =>
              setFilters((prev: any) => {
                return {
                  ...prev,
                  status: val || undefined
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
              setFilters({ sorter: model })
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
      <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />
    </Card>
  )
}

export default PropertyUpdate
