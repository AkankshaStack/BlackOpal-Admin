import * as React from 'react'
import {
  CardHeader,
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableBody,
  Card,
  Table,
  TableRow,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  TextField,
  TablePagination,
  CircularProgress,
  Theme,
  useMediaQuery,
  TableSortLabel,
  Grid
} from '@mui/material'
import { ChevronDown, ChevronUp, Close, Eye, EyeOutline, PencilOutline, Star, SwapVertical } from 'mdi-material-ui'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import { useState, useEffect, ChangeEvent } from 'react'
import { AppDispatch } from 'src/store'
import moment from 'moment'
import CollapseData from 'src/views/property/collapse'
import config from 'src/configs/config'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import DrawerData from 'src/views/property/side-drawer'
import { getProject, patchProjectStatus } from 'src/store/project'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import MultiButton from 'src/views/components/multiButton/MultiButton'
import toast from 'react-hot-toast'
import { AxiosResponse } from 'axios'
import { LoadingButton } from '@mui/lab'
import { ERoutes } from 'src/common/routes'
import FilterCompoenent from 'src/views/components/filterUI'

interface pagiantion {
  include: string
  page: number
  perPage: number
  listingStatus: number
  q?: string
  status?: string
  sort?: string
  rating?: number
}

const Unlisted = () => {
  const [openDrawer, setopenDrawer] = React.useState({
    visible: false,
    id: ''
  })
  const router = useRouter()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [show, setShow] = React.useState<number>(0)
  const [searchText, setSearchText] = useState<string>('')

  // Need to chagne updated At to status updated on.
  const [showContent, setshowContent] = React.useState<string>('')
  const [filter, setFilter] = useState<{
    sorter: { [key: string]: 'asc' | 'desc' | undefined }
    rating?: number
  }>({
    sorter: {
      listingStatusUpdatedOn: 'desc'
    }
  })
  const [open1, setOpen1] = useState<imagePreview>({
    visible: false,
    url: ''
  })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.project)

  const call = (page: number, searchValue = searchText) => {
    const payload: pagiantion = {
      include: 'createdByUser,address,',
      page,
      perPage: 10,
      listingStatus: config.listingStatus.unlisted,
      sort: 'listingStatusUpdatedOn:desc'
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    if (Object.keys(filter?.sorter)?.length) {
      const name12 = Object.entries(filter?.sorter).map(([key, value]) => `${key}:${value}`)
      payload.sort = name12[0]
    }
    if (filter?.rating) {
      payload.rating = filter?.rating
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
  }, [filter])

  const handleListing = () => {
    const payload: pagiantion = {
      include: 'createdByUser',
      page: store.pagination.currentPage,
      perPage: 10,
      listingStatus: config.listingStatus.unlisted,
      status: config.propertyStatus.approved,
      sort: 'updatedAt:desc'
    }

    if (searchText?.length > 0) {
      payload.q = searchText
    }

    dispatch(
      patchProjectStatus({
        id: show,
        data: {
          step: 'status',
          propertyStatus: 'list'
        },
        fetchPayload: payload
      })
    ).then(res => {
      if ((res?.payload as AxiosResponse)?.status === 204) {
        toast.success('Property relisted successfully')
        call(store?.pagination?.currentPage || 1)
      }
      setShow(0)
    })
  }
  const handleChangePage = (e: any, page: number) => {
    call(page + 1)
  }
  function Row(props: { row: any }) {
    const { row } = props
    const [open, setOpen] = React.useState(false)

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell align='center' style={{ minWidth: '50px' }}>
            <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
              {open ? <ChevronUp /> : <ChevronDown />}
            </IconButton>
          </TableCell>

          <TableCell component='th' scope='row' align='center' style={{ minWidth: '100px' }}>
            <Tooltip title={row?.code}>
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
                {row?.code}
              </Typography>
            </Tooltip>
          </TableCell>

          <TableCell
            align='center'
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
          >
            <div
              onClick={() =>
                setOpen1({
                  visible: true,
                  url: row?.images?.length > 0 ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row?.images[0]}` : ''
                })
              }
              style={{
                cursor: 'pointer'
              }}
            >
              <Avatar src={row?.images?.length > 0 ? process.env.NEXT_PUBLIC_IMAGE_URL + row?.images[0] : ''} />
            </div>
          </TableCell>

          <TableCell style={{ minWidth: '200px' }} align='left'>
            <Tooltip title={row.name} placement='bottom-start' sx={{ textTransform: 'capitalize' }}>
              <Typography noWrap>
                {row?.name?.length > config.nameLengthCheck
                  ? row?.name?.slice(0, config.nameLengthCheck) + '...'
                  : row?.name}
              </Typography>
            </Tooltip>
          </TableCell>
          <TableCell align='center' style={{ minWidth: '150px' }}>
            <Typography
              noWrap
              className='underline-code'
              onClick={() => {
                router.push({ pathname: ERoutes.RATING.replace(':id', row?.id), query: { from: 'all-listing' } })
              }}
            >
              {row?.averageRating ? 1 * parseFloat(row?.averageRating?.toFixed(1)) : '-'}
            </Typography>
          </TableCell>
          {/* <TableCell align='center'>{row.address}</TableCell> */}
          <TableCell align='center' style={{ minWidth: '200px' }}>
            {row?.createdAt ? moment(row?.createdAt).format('DD MMM YYYY') : '-'}
          </TableCell>
          <TableCell align='center' style={{ minWidth: '200px' }}>
            {row?.statusUpdatedOn ? moment(row?.statusUpdatedOn).format('DD MMM YYYY') : '-'}
          </TableCell>

          <TableCell align='center' style={{ minWidth: '150px' }}>
            <MultiButton
              options={[
                {
                  label: 'Edit',
                  tooltipLabel: 'Edit Property',
                  onClick: () => {
                    router.push({ pathname: `/project/edit/${row.id}`, query: { from: 'unlisted' } })
                  },
                  icon: <PencilOutline sx={{ marginRight: '-4px' }} />
                },
                {
                  label: 'View Rating',
                  tooltipLabel: 'View Rating',
                  onClick: () => {
                    router.push({ pathname: ERoutes.RATING.replace(':id', row?.id), query: { from: 'all-listing' } })
                  },
                  icon: <Star sx={{ marginRight: '-4px' }} />
                },
                {
                  label: 'Relist Property',
                  tooltipLabel: 'Relist Property',
                  onClick: () => {
                    setshowContent('')
                    setShow(Number(row?.id))
                  },
                  icon: <Eye sx={{ marginRight: '-4px' }} />
                },
                {
                  label: 'Show Reason',
                  tooltipLabel: 'Show reason for relisting',
                  onClick: () => {
                    setshowContent(row.verificationStatusRemark)
                    setShow(Number(row?.id))
                  },
                  icon: <EyeOutline sx={{ marginRight: '-4px' }} />
                }
              ]}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: 'none' }} colSpan={7}>
            <CollapseData open={open} data={row} setopenDrawer={setopenDrawer} />
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  return (
    <Card>
      <CardHeader title='Unlisted Properties' />
      <Paper sx={{ width: '100%', overflow: 'scroll' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <QuickSearchToolbar
              isNotDataGrid
              onChange={(event: ChangeEvent) => {
                handleSearch((event.target as HTMLButtonElement).value)
              }}
              width='unset'
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FilterCompoenent
              label='Rating'
              sx={{ textTransform: 'initial !important' }}
              selectSx={{ textTransform: 'initial !important' }}
              data={config?.rating}
              variant
              value={filter?.rating || ''}
              onChange={val =>
                setFilter((prev: any) => {
                  return {
                    ...prev,
                    rating: val || undefined
                  }
                })
              }
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table aria-label='collapsible table'>
            <TableHead>
              <TableRow>
                <TableCell align='center'>More</TableCell>
                <TableCell align='center'>ID</TableCell>
                <TableCell align='center'>Property Image</TableCell>
                <TableCell align='left'>Property Name</TableCell>
                <TableCell align='center'>Rating</TableCell>
                {/* <TableCell align='center'>Address</TableCell> */}
                <TableCell align='center'>
                  Created At
                  {filter?.sorter?.createdAt ? (
                    <TableSortLabel
                      active={Boolean(filter?.sorter?.createdAt)}
                      direction={filter?.sorter?.createdAt || 'asc'}
                      onClick={() => {
                        if (filter?.sorter?.createdAt) {
                          setFilter(prev => {
                            return {
                              ...prev,
                              sorter: { createdAt: filter?.sorter?.createdAt === 'desc' ? 'asc' : 'desc' }
                            }
                          })
                        } else {
                          setFilter(prev => {
                            return {
                              ...prev,
                              sorter: { createdAt: 'asc' }
                            }
                          })
                        }
                      }}
                    />
                  ) : (
                    <IconButton
                      onClick={() => {
                        setFilter(prev => {
                          return {
                            ...prev,
                            sorter: { createdAt: 'desc' }
                          }
                        })
                      }}
                    >
                      <SwapVertical />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align='center' sx={{ minWidth: '240px' }}>
                  listing Status updated on
                  {filter?.sorter?.listingStatusUpdatedOn ? (
                    <TableSortLabel
                      active={Boolean(filter?.sorter?.listingStatusUpdatedOn)}
                      direction={filter?.sorter?.listingStatusUpdatedOn || 'asc'}
                      onClick={() => {
                        if (filter?.sorter?.listingStatusUpdatedOn) {
                          setFilter(prev => {
                            return {
                              ...prev,
                              sorter: {
                                listingStatusUpdatedOn:
                                  filter?.sorter?.listingStatusUpdatedOn === 'desc' ? 'asc' : 'desc'
                              }
                            }
                          })
                        } else {
                          setFilter(prev => {
                            return {
                              ...prev,
                              sorter: { listingStatusUpdatedOn: 'asc' }
                            }
                          })
                        }
                      }}
                    />
                  ) : (
                    <IconButton
                      onClick={() => {
                        setFilter(prev => {
                          return {
                            ...prev,
                            sorter: { updatedAt: 'desc' }
                          }
                        })
                      }}
                    >
                      <SwapVertical />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align='center'>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              style={{
                height: 'auto',
                position: 'relative'
              }}
            >
              {store?.loading ? (
                <TableRow>
                  <TableCell colSpan={12}>
                    <div
                      style={{
                        position: 'relative',
                        height: '200px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CircularProgress />
                    </div>
                  </TableCell>
                </TableRow>
              ) : store?.projects?.length > 0 ? (
                <>
                  {store?.projects.map((row: any) => (
                    <Row key={row?.name} row={row} />
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={12}>
                    <div
                      style={{
                        position: 'relative',
                        height: '200px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      No Property Found
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* {store?.loading && (
          <div
            style={{
              padding: '20px 0',
              textAlign: 'center'
            }}
          >
            <CircularProgress />
          </div>
        )}
        {store?.projects?.length === 0 && !store?.loading && (
          <div
            style={{
              padding: '20px 0',
              textAlign: 'center'
            }}
          >
            No Data Found
          </div>
        )} */}
        <TablePagination
          component='div'
          rowsPerPageOptions={[]}
          count={store?.pagination?.total || 0}
          rowsPerPage={10}
          page={store?.pagination?.currentPage ? store?.pagination?.currentPage - 1 : 0}
          onPageChange={handleChangePage}
        />
      </Paper>

      <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />

      <Dialog
        fullWidth
        open={Boolean(show)}
        maxWidth={hidden ? 'xl' : 'xs'}
        scroll='body'
        sx={{ pl: 2 }}
        onClose={() => {
          setShow(0)
        }}
        onBackdropClick={() => {
          setShow(0)
        }}
      >
        <h4
          style={{
            textAlign: 'center',
            wordBreak: 'break-word',
            width: hidden ? '90%' : '100%',
            padding: '0 10px'
          }}
        >
          {showContent?.length > 0 ? ' Reason for Unlisting' : 'Are you sure you want to Relist?'}
        </h4>
        <IconButton
          sx={{ float: 'right', right: hidden ? 0 : 10, top: 10, position: 'absolute' }}
          onClick={() => setShow(0)}
        >
          <Close />
        </IconButton>
        {showContent?.length > 0 && (
          <DialogContent style={{ marginTop: '20px', marginBottom: '20px' }}>
            <FormControl fullWidth>
              <TextField
                value={showContent}
                fullWidth
                multiline
                rows={4}
                disabled
                aria-describedby='validation-basic-first-name'
              />
            </FormControl>
          </DialogContent>
        )}
        {showContent?.length === 0 && (
          <DialogActions sx={{ mt: 3 }}>
            <Button variant='contained' onClick={() => setShow(0)} color='secondary'>
              No
            </Button>
            <LoadingButton
              variant='contained'
              loading={store?.loading}
              style={{
                marginLeft: '15px'
              }}
              onClick={() => handleListing()}
              color='primary'
            >
              Yes
            </LoadingButton>
          </DialogActions>
        )}
      </Dialog>
      <ImagePreview open={open1} setOpen={setOpen1} />
    </Card>
  )
}

export default Unlisted
