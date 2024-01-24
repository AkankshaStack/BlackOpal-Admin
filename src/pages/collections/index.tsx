import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Grid,
  Stack,
  Tooltip,
  Typography,
  Box,
  Dialog,
  DialogActions,
  IconButton
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { debounce } from 'lodash'
import { CheckCircleOutline, Close, CloseCircleOutline, PencilOutline, Plus, SwapVertical } from 'mdi-material-ui'
import ImagePreview from 'src/views/image-perview'
import { imagePreview, options } from 'src/common/types'
import { useRouter } from 'next/router'
import CustomChip from 'src/@core/components/mui/chip'
import { deleteCollection, getCollections, updateCollection } from 'src/store/collections'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import MultiButton from 'src/views/components/multiButton/MultiButton'
import toast from 'react-hot-toast'
import config from 'src/configs/config'
import FilterCompoenent from 'src/views/components/filterUI'
import moment from 'moment'

// import config from 'src/configs/config's

// import { collectionData } from 'src/@fake-db/collection'
interface CellType {
  row: any
}

interface pagination {
  include?: string
  perPage?: number
  page?: number
  q?: string
  status?: number
  sort?: string
}

const PropertiesCollection = () => {
  // const [searchText, setSearchText] = useState('')
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })

  const [filter, setFilter] = useState<{
    sorter: GridSortModel
    status?: number
  }>({
    sorter: [
      {
        field: 'createdAt',
        sort: 'desc'
      }
    ]
  })
  const router = useRouter()
  const store = useSelector((state: any) => state.collections)
  const [searchText, setSearchText] = useState('')
  const [deleteId, setDeleteId] = useState(0)

  // const [filteredData, setfilteredData] = React.useState([])
  // const [filter, setfilter] = React.useState('')
  // const [sortBy, setsortBy] = React.useState('')
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    call(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const handleSearch = debounce((searchValue: string) => {
    setSearchText(searchValue)
    if (searchValue.length > 0) {
      call(1, searchValue)
    } else {
      call(1, '')
    }
  }, 400)

  const call = (page: number, searchValue = searchText) => {
    const payload: pagination = {
      include: 'city',
      perPage: 10,
      page: 1
    }
    if (filter?.status) {
      payload.status = filter?.status
    }
    if (filter?.sorter?.length > 0) {
      payload.sort = `${filter?.sorter[0].field}:${filter?.sorter[0].sort}`
    }
    if (page) {
      payload.page = page
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    dispatch(
      getCollections({
        data: payload
      })
    )
  }

  const handleDelete = (id: number) => {
    dispatch(
      deleteCollection({
        id
      })
    )
    setDeleteId(0)
  }

  const columns: any = [
    {
      flex: 0.5,
      minWidth: 150,
      field: 'imageSlug',
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
                url: row?.imageSlug?.length > 0 ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row.imageSlug}` : ''
              })
            }
            style={{
              cursor: 'pointer'
            }}
          >
            <Avatar src={row?.imageSlug?.length > 0 ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row.imageSlug}` : ''} />
            {/* <div>{`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.imageSlug}`}</div> */}
          </div>
        )
      }
    },
    {
      flex: 1,
      minWidth: 200,
      field: 'name',
      headerName: 'Collection Name',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Tooltip
          title={row?.name ? row.name : ''}
          arrow
          sx={{ textTransform: 'capitalize' }}
          style={{
            cursor: 'default'
          }}
        >
          <Typography noWrap className='underline-code'>
            {row?.name ? row.name : ''}
          </Typography>
        </Tooltip>
      ),
      renderHeader: undefined
    },

    {
      flex: 1,
      minWidth: 200,
      field: 'subTitle',
      sortable: false,
      headerName: 'Sub Title',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <Tooltip
          title={row?.title ? row.title : ''}
          arrow
          sx={{ textTransform: 'capitalize' }}
          style={{
            cursor: 'default'
          }}
        >
          <Typography noWrap className='underline-code'>
            {row?.title ? row.title : ''}
          </Typography>
        </Tooltip>
      ),
      renderHeader: undefined
    },

    {
      flex: 0.5,
      minWidth: 200,
      field: 'city',
      headerName: 'City',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.city?.name ? row.city.name : ''} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography noWrap>{row?.city?.name ? row.city.name : ''}</Typography>
          </Tooltip>
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
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.status === 1 ? 'Active' : 'Inactive'}
            color={row.status === 1 ? 'success' : 'warning'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}

            // label={config.collectionStatus[row.status]}
          />
        )
      }
    },
    {
      flex: 0.9,
      minWidth: 170,
      field: 'createdAt',
      headerName: 'created on',
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return <Typography noWrap>{row?.createdAt ? moment(row?.createdAt).format('DD MMM YYYY') : '-'}</Typography>
      }
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Action',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const data: options = [
          {
            label: 'Edit',
            tooltipLabel: 'Edit',
            onClick: () => {
              router.push({
                pathname: `/collections/${row.id}`
              })
            },
            icon: <PencilOutline sx={{ marginRight: '-4px' }} />
          }
        ]
        if (row?.status === Number(Object.keys(config?.collectionStatus)[0])) {
          data.push({
            label: 'Inactive',
            tooltipLabel: 'Inactive',
            onClick: () => {
              dispatch(
                updateCollection({
                  id: row?.id,
                  data: {
                    ...row,
                    status: Number(Object.keys(config?.collectionStatus)[1]),
                    cityId: row?.city?.id,
                    state: row?.city?.state?.id,
                    country: row?.city?.state?.country?.id
                  }
                })
              ).then(res => {
                if (res?.payload?.code === 200) {
                  call(store?.pagination?.currentPage || 1)
                }
              })
            },
            icon: <CloseCircleOutline color='error' sx={{ marginRight: '-4px' }} />,
            color: 'error'
          })
        } else if (row?.status === Number(Object.keys(config?.collectionStatus)[1])) {
          data.push({
            label: 'Active',
            tooltipLabel: 'Active',
            onClick: () => {
              dispatch(
                updateCollection({
                  id: row?.id,
                  data: {
                    ...row,
                    status: Number(Object.keys(config?.collectionStatus)[0]),
                    cityId: row?.city?.id,
                    state: row?.city?.state?.id,
                    country: row?.city?.state?.country?.id
                  }
                })
              ).then(res => {
                if (res?.payload?.code === 200) {
                  toast.success('Collection updated successfully')
                  call(store?.pagination?.currentPage || 1)
                }
              })
            },
            icon: <CheckCircleOutline color='success' sx={{ marginRight: '-4px' }} />,
            color: 'success.main'
          })
        }

        return <MultiButton options={data} />
      }
    }
  ]

  return (
    <div>
      <Card>
        <CardHeader title='Collections' />
        <Grid container spacing={2} sx={{ pr: 2 }}>
          <Grid item xs={12} sm={3} sx={{ alignItems: 'flex-end', display: 'flex' }}>
            <QuickSearchToolbar
              onChange={(event: any) => handleSearch(event.target.value)}
              isNotDataGrid
              width='100%'
              isTeamMember='Search By Name, City'
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FilterCompoenent
              label='Collection Status'
              data={config?.collectionStatus}
              variant
              value={filter?.status || ''}
              onChange={val =>
                setFilter((prev: any) => {
                  return {
                    ...prev,
                    status: val || undefined
                  }
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <Button
              variant='contained'
              startIcon={<Plus sx={{ color: 'white' }} />}
              onClick={() => router.push({ pathname: '/collections/new' })}
            >
              Create Collection
            </Button>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              autoHeight
              rows={store?.loading ? [] : store?.data}
              rowCount={store?.pagination?.total}
              disableSelectionOnClick
              disableColumnMenu
              rowsPerPageOptions={[]}
              page={store?.pagination?.currentPage ? store?.pagination?.currentPage - 1 : 0}
              loading={store?.loading}
              paginationMode='server'
              sortingMode='server'
              onSortModelChange={model => {
                setFilter(prev => {
                  return { ...prev, sorter: model }
                })
              }}
              initialState={{
                sorting: {
                  sortModel: filter?.sorter
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
                    No Collections Found
                  </Stack>
                ),
                NoResultsOverlay: () => (
                  <Stack height='100%' alignItems='center' justifyContent='center'>
                    No Collections Found
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
        <Dialog
          fullWidth
          open={!!deleteId}
          maxWidth='xs'
          scroll='body'
          onClose={() => {
            setDeleteId(0)
          }}
          onBackdropClick={() => {
            setDeleteId(0)
          }}
        >
          <IconButton sx={{ position: 'absolute', top: '8px', right: '8px' }} onClick={() => setDeleteId(0)}>
            <Close fontSize='medium' />
          </IconButton>
          <Box sx={{ padding: 10 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Are yout sure yout want to delete this property ?</Typography>
            <DialogActions sx={{ mt: 5, padding: 0 }}>
              <Button variant='contained' onClick={() => handleDelete(deleteId)} color='primary'>
                yes
              </Button>
              <Button variant='outlined' onClick={() => setDeleteId(0)} color='secondary'>
                No
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Card>
    </div>
  )
}

export default PropertiesCollection
