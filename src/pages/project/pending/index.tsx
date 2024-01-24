import moment from 'moment'
import DrawerData from 'src/views/property/side-drawer'

// ** React Imports
import { useEffect, useState, ChangeEvent } from 'react'

// ** Store Imports

// ** Custom Components Imports

import CustomChip from 'src/@core/components/mui/chip'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { debounce } from 'lodash'

import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import { Avatar, Card, CardHeader, Grid, Stack, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { getProject } from 'src/store/project'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import config from 'src/configs/config'
import Link from 'next/link'
import { SwapVertical } from 'mdi-material-ui'

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
}

const PendingProject = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText] = useState<string>('')
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [filters, setFilters] = useState<GridSortModel>([
    {
      field: 'createdAt',
      sort: 'desc'
    }
  ])
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: any) => state.project)
  const [openDrawer, setopenDrawer] = useState({
    visible: false,
    id: ''
  })
  const call = (page: number, searchValue = '') => {
    const payload: pagiantion = {
      include: 'createdByUser',
      page,
      perPage: 10,
      status: config.propertyStatus.pending
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    if (filters?.length > 0) {
      payload.sort = `${filters[0].field}:${filters[0].sort}`
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
      minWidth: 200,
      field: 'name',
      headerName: 'Property Name',
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip sx={{ textTransform: 'capitalize' }} title={row.name} arrow>
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
      flex: 0.5,
      minWidth: 130,
      field: 'Unlist',
      headerName: 'Status',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: () => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label='Pending'
            color='warning'
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
    }

    // {
    //   flex: 0.9,
    //   minWidth: 170,
    //   field: 'approvedOn',
    //   headerName: 'Approved on',
    //   align: 'center',
    //   headerAlign: 'center',
    //   sortable: false,
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <Typography noWrap>
    //         {row?.statusUpdatedOn ? moment(row?.statusUpdatedOn).format('DD MMM YYYY') : '-'}
    //       </Typography>
    //     )
    //   }
    // }
  ]

  return (
    <Card>
      <CardHeader title='Pending Properties' />
      <Grid container spacing={6}>
        <Grid item xs={12}>
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
              setFilters(model)
            }}
            initialState={{
              sorting: {
                sortModel: filters
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
              Toolbar: QuickSearchToolbar,
              ColumnUnsortedIcon: () => <SwapVertical />
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }
            }}
            componentsProps={{
              toolbar: {
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  handleSearch(event.target.value)
                },
                isTeamMember: 'Search by id, name, requested by'
              }
            }}
          />
        </Grid>
      </Grid>
      <ImagePreview open={open} setOpen={setOpen} />
      <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />
    </Card>
  )
}

export default PendingProject
