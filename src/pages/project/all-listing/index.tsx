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
  TablePagination,
  DialogContent,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  CircularProgress,
  TableSortLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
  SelectChangeEvent,
  Grid
} from '@mui/material'
import { useState, useEffect, ChangeEvent } from 'react'
import { ChevronDown, ChevronUp, EyeOffOutline, PencilOutline, Star, SwapVertical } from 'mdi-material-ui'
import moment from 'moment'
import CustomChip from 'src/@core/components/mui/chip'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import CollapseData from 'src/views/property/collapse'
import DrawerData from 'src/views/property/side-drawer'
import { getProject, patchProjectStatus } from 'src/store/project'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { debounce } from 'lodash'
import config from 'src/configs/config'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import MultiButton from 'src/views/components/multiButton/MultiButton'
import { useRouter } from 'next/router'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'
import { AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import { ERoutes } from 'src/common/routes'
import FilterCompoenent from 'src/views/components/filterUI'
import { propertyConversion } from 'src/utilities/conversions'

const AllListing = () => {
  const [openDrawer, setopenDrawer] = React.useState({
    visible: false,
    id: ''
  })
  const [searchText, setSearchText] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const [open1, setOpen1] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [sorter, setSorter] = React.useState<{ [key: string]: 'asc' | 'desc' | undefined }>({
    statusUpdatedOn: 'desc'
  })
  const [filter, setFilter] = React.useState<{ [key: string]: number | undefined }>({})

  interface pagiantion {
    include: string
    page: number
    perPage: number
    listingStatus: number
    q?: string
    sort?: string
    rating?: number
  }
  const router = useRouter()
  const store = useSelector((state: any) => state.project)
  const [show, setShow] = React.useState<{
    visible: number
    declinedReason?: string
  }>({
    visible: 0,
    declinedReason: ''
  })
  const [open, setopen] = useState(false)
  const [reason, setreason] = useState<any>([])

  const handleClose = () => setopen(false)

  const handleOpen = () => setopen(true)

  const handleChange = (event: SelectChangeEvent<typeof reason>) => {
    if (event.target.value.indexOf('Other') >= 0) {
      if (reason?.length === 1 && reason[0] === 'Other' && event.target.value?.length > 1) {
        const data = event.target.value
        data.splice(event.target.value.indexOf('Other'), 1)
        setreason(data)
      } else {
        setreason(['Other'])
        setopen(false)
      }

      return
    } else {
      const {
        target: { value }
      } = event
      setreason(typeof value === 'string' ? value.split(',') : value)
    }
  }
  const call = (page: number, searchValue = searchText) => {
    const payload: pagiantion = {
      include: 'address',
      page,
      perPage: 10,
      listingStatus: config.listingStatus.listed,
      sort: 'updatedAt:desc',
      ...filter
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }
    if (Object.keys(sorter)?.length) {
      const name12 = Object.entries(sorter).map(([key, value]) => `${key}:${value}`)
      payload.sort = name12[0]
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
  }, [sorter, filter])

  const declinedReason = [
    'Certificate Provided is valid',
    'All the conflcit is resolved with the user',
    'User is valid and authorized',
    'Account is Verified'
  ]

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
          <TableCell style={{ minWidth: '100px' }} align='center'>
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

          <TableCell align='center' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

          <TableCell style={{ minWidth: '200px' }} align='left' sx={{ textTransform: 'capitalize' }}>
            <Tooltip title={row?.name} placement='bottom-start'>
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
          <TableCell align='center' style={{ minWidth: '150px' }}>
            <CustomChip
              skin='light'
              size='small'
              label={Object.keys(config?.propertyStatus).find(key => config?.propertyStatus[key] === row?.status)}
              color={propertyConversion(row?.status)}
              sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
            />
          </TableCell>

          <TableCell align='center' style={{ minWidth: '150px' }}>
            {row?.statusUpdatedOn ? moment(row?.statusUpdatedOn).format('DD MMM YYYY') : '-'}
          </TableCell>

          <TableCell align='center' style={{ minWidth: '150px' }}>
            <MultiButton
              options={[
                {
                  label: 'Edit',
                  tooltipLabel: 'Edit Property',
                  onClick: () => {
                    router.push({ pathname: `/project/edit/${row?.id}`, query: { from: 'all-listing' } })
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
                  label: 'Unlist Property',
                  tooltipLabel: 'Unlist Property',
                  onClick: () => {
                    setShow({ visible: row?.id, declinedReason: '' })
                  },
                  icon: <EyeOffOutline sx={{ marginRight: '-4px' }} />
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
  const handleChangePage = (e: any, page: number) => {
    call(page + 1)
  }

  const onSubmit = () => {
    dispatch(
      patchProjectStatus({
        id: show?.visible,
        data: {
          step: 'status',
          propertyStatus: 'unlist',
          verificationStatusRemark: reason.indexOf('Other') >= 0 ? show.declinedReason : reason.join(', ')
        }
      })
    ).then(res => {
      if ((res?.payload as AxiosResponse)?.status === 204) {
        toast.success('Property unlisted successfully')
        setShow({
          visible: 0,
          declinedReason: ''
        })
        call(store?.pagination?.currentPage || 1)
      }
    })
  }

  return (
    <Card>
      <CardHeader title='All Listed Properties' />
      <Paper sx={{ width: '100%', overflow: 'scroll' }}>
        <Grid container spacing={4}>
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
                <TableCell align='center'>Image</TableCell>
                <TableCell align='left'>
                  Property Name
                  {sorter?.name ? (
                    <TableSortLabel
                      active={Boolean(sorter?.name)}
                      direction={sorter?.name || 'asc'}
                      onClick={() => {
                        if (sorter?.name) {
                          setSorter({ name: sorter?.name === 'desc' ? 'asc' : 'desc' })
                        } else {
                          setSorter({ name: 'asc' })
                        }
                      }}
                    />
                  ) : (
                    <IconButton
                      onClick={() => {
                        setSorter({
                          name: 'desc'
                        })
                      }}
                    >
                      <SwapVertical />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align='center'>Rating</TableCell>
                <TableCell align='center'>Status</TableCell>
                <TableCell align='center'>
                  Active Date
                  {sorter?.statusUpdatedOn ? (
                    <TableSortLabel
                      active={Boolean(sorter?.statusUpdatedOn)}
                      direction={sorter?.statusUpdatedOn || 'asc'}
                      onClick={() => {
                        if (sorter?.statusUpdatedOn) {
                          setSorter({ statusUpdatedOn: sorter?.statusUpdatedOn === 'desc' ? 'asc' : 'desc' })
                        } else {
                          setSorter({ statusUpdatedOn: 'asc' })
                        }
                      }}
                    />
                  ) : (
                    <IconButton
                      onClick={() => {
                        setSorter({
                          statusUpdatedOn: 'desc'
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
      <ImagePreview open={open1} setOpen={setOpen1} />
      <CustomDialog
        title='Reason for Unlisting'
        show={Boolean(show?.visible)}
        setShow={() => {
          setShow({
            visible: 0,
            declinedReason: ''
          })
          if (reason?.length > 0) {
            setreason([])
          }
        }}
        buttonprop={{
          onClick: () => {
            onSubmit()
          },
          loading: store?.loading,
          disabled: Boolean(
            reason?.length === 0 || (reason.indexOf('Other') >= 0 && show?.declinedReason?.trim()?.length === 0)
          )
        }}
        customYesTitle='Proceed'
        customCancelTitle='Cancel'
        dialogContent={
          <DialogContent style={{ marginTop: '20px', marginBottom: '20px' }}>
            <FormControl fullWidth>
              <InputLabel>State your reason for unlisting</InputLabel>
              <Select
                multiple
                value={reason}
                fullWidth
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
                input={<OutlinedInput label='State your reason for unlisting' />}
                renderValue={selected => {
                  return selected.join(', ')
                }}
                aria-describedby='validation-basic-first-name'
              >
                {declinedReason.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={reason.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
                <MenuItem value='Other'>
                  <Checkbox checked={reason.indexOf('Other') > -1} />
                  <ListItemText primary='Other' />
                </MenuItem>
              </Select>
              {reason.indexOf('Other') >= 0 && (
                <TextField
                  label='Reason for declining'
                  value={show.declinedReason}
                  multiline
                  minRows={4}
                  required
                  style={{ marginTop: '40px' }}
                  onChange={e =>
                    setShow(prev => ({
                      ...prev,
                      declinedReason: e.target.value
                    }))
                  }
                />
              )}
            </FormControl>
          </DialogContent>
        }
      />
    </Card>
  )
}

export default AllListing
