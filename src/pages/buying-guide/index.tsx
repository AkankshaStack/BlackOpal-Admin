import { Avatar, Button, Card, CardHeader, Grid, Stack, Tooltip, Typography, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { DataGrid } from '@mui/x-data-grid'
import { debounce } from 'lodash'
import { CheckCircleOutline, CloseCircleOutline, PencilOutline, Plus } from 'mdi-material-ui'
import ImagePreview from 'src/views/image-perview'
import { imagePreview, options } from 'src/common/types'
import { useRouter } from 'next/router'
import CustomChip from 'src/@core/components/mui/chip'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import MultiButton from 'src/views/components/multiButton/MultiButton'
import { getBuyingGuide, updateBuyingGuide } from 'src/store/buying-guide'
import config from 'src/configs/config'
import { ERoutes } from 'src/common/routes'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'
import toast from 'react-hot-toast'

// import config from 'src/configs/config's

interface CellType {
  row: any
}

interface pagination {
  perPage: number
  page: number
  q?: string
}

const BuyingGuide = () => {
  // const [searchText, setSearchText] = useState('')
  const [open, setOpen] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const router = useRouter()
  const store = useSelector((state: RootState) => state.buyingGuide)
  const [searchText, setSearchText] = useState('')
  const [deleteId, setDeleteId] = useState<any>({})

  // const [filteredData, setfilteredData] = React.useState([])
  // const [filter, setfilter] = React.useState('')
  // const [sortBy, setsortBy] = React.useState('')
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    call(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = debounce((searchValue: string) => {
    setSearchText(searchValue)
    if (searchValue?.length > 0) {
      call(1, searchValue)
    } else {
      call(1, '')
    }
  }, 400)

  const call = (page: number, searchValue = searchText) => {
    const payload: pagination = {
      perPage: 10,
      page: page || 1
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    dispatch(getBuyingGuide(payload))
  }

  const updateStatus = (row: any) => {
    setDeleteId({})
    dispatch(
      updateBuyingGuide({
        id: row?.id,
        data: {
          ...row,
          status:
            row?.status === config?.users?.status?.active
              ? config?.users?.status?.inActive
              : config?.users?.status?.active
        }
      })
    ).then((res: any) => {
      if (res?.payload?.status === 204) {
        toast.success('Buying guide updated successfully')
        call(store?.pagination?.currentPage || 1)
      }
    })
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
      field: 'title',
      headerName: 'Title',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
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
      flex: 1,
      minWidth: 200,
      field: 'subtitle',
      sortable: false,
      headerName: 'Sub Title',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <Tooltip
          title={row?.subtitle ? row.subtitle : ''}
          arrow
          sx={{ textTransform: 'capitalize' }}
          style={{
            cursor: 'default'
          }}
        >
          <Typography noWrap className='underline-code'>
            {row?.subtitle ? row.subtitle : ''}
          </Typography>
        </Tooltip>
      ),
      renderHeader: undefined
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
          />
        )
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
                pathname: ERoutes.SINGLE_BUYING_GUIDE.replace(':id', row.id)
              })
            },
            icon: <PencilOutline sx={{ marginRight: '-4px' }} />
          }
        ]
        if (row?.status === 1) {
          data.push({
            label: 'Inactive',
            tooltipLabel: 'Inactive',
            onClick: () => {
              setDeleteId(row)
            },
            icon: <CloseCircleOutline color='error' sx={{ marginRight: '-4px' }} />,
            color: 'error'
          })
        } else if (row?.status === 2) {
          data.push({
            label: 'Active',
            tooltipLabel: 'Active',
            onClick: () => {
              setDeleteId(row)
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
        <CardHeader title='Buying Guide' />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 0, mb: 4, flexWrap: 'wrap', rowGap: 4 }}>
              <QuickSearchToolbar
                onChange={(event: any) => handleSearch(event.target.value)}
                isNotDataGrid
                isTeamMember='Search By Name'
              />
              <Button
                variant='contained'
                startIcon={<Plus sx={{ color: 'white', textTransform: 'normal' }} />}
                sx={{ mr: 3 }}
                onClick={() => router.push({ pathname: ERoutes.ADD_BUYING_GUIDE })}
              >
                Create buying guide
              </Button>
            </Box>
            <DataGrid
              autoHeight
              rows={store?.loading ? [] : store?.data}
              rowCount={store?.pagination?.total}
              disableSelectionOnClick
              disableColumnMenu
              page={store?.pagination?.currentPage ? store?.pagination?.currentPage - 1 : 0}
              loading={store?.loading}
              paginationMode='server'
              columns={columns}
              onPageChange={(newPage: number) => {
                call(newPage + 1)
              }}
              pageSize={10}
              components={{
                NoRowsOverlay: () => (
                  <Stack height='100%' alignItems='center' justifyContent='center'>
                    No Buying Guide Found
                  </Stack>
                ),
                NoResultsOverlay: () => (
                  <Stack height='100%' alignItems='center' justifyContent='center'>
                    No Buying Guide Found
                  </Stack>
                )
              }}
              sx={{
                '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }
              }}
            />
          </Grid>
          <ImagePreview open={open} setOpen={setOpen} />
          <CustomDialog
            title={`Are you sure you want to ${
              deleteId?.status === config?.users?.status?.active ? 'Inactive' : 'Active'
            }
          this buying guide?`}
            show={Boolean(deleteId?.id)}
            setShow={() => {
              setDeleteId({})
            }}
            buttonprop={{
              onClick: () => {
                updateStatus(deleteId)
              }
            }}
          />
        </Grid>
      </Card>
    </div>
  )
}

export default BuyingGuide
