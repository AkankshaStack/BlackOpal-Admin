import moment from 'moment'

// ** React Imports
import { useEffect, useState, ChangeEvent } from 'react'

// ** Store Imports
import { AppDispatch } from 'src/store'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'

// ** Custom Components Imports

import CustomChip from 'src/@core/components/mui/chip'
import MultiButton from 'src/views/components/multiButton/MultiButton'

// ** Utils Import
import config from 'src/configs/config'

// ** Icons Import
import { AccountBox, Eye, EyeOffOutline, SwapVertical } from 'mdi-material-ui'
import HailIcon from 'mdi-material-ui/Hail'
import BusinessRoundedIcon from 'mdi-material-ui/Domain'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

// ** Actions Imports
import { fetchData, patchlisting } from 'src/store/verification'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

// ** MUI Imports
import {
  Avatar,
  Card,
  CardHeader,
  Grid,
  FormControl,
  Stack,
  Tooltip,
  Typography,
  Link as MuiLInk,
  MenuItem,
  Select,
  InputLabel,
  TextField,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
import { DialogContent } from '@mui/material'
import Link from 'next/link'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'
import FilterCompoenent from 'src/views/components/filterUI'

interface CellType {
  row: any
}

const ApprovedList = () => {
  const [pageCurrent, setPageCurrent] = useState<number>(0)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [show, setShow] = useState<{
    visible: number
    declinedReason?: string
  }>({
    visible: 0,
    declinedReason: ''
  })
  const [showContent, setshowContent] = useState<string>('')
  const [open1, setOpen1] = useState<imagePreview>({
    visible: false,
    url: ''
  })
  const [filter, setFilter] = useState<{
    verificationStatuses?: number | string | undefined
    orgType?: number | string | undefined
    sorter: GridSortModel
  }>({
    sorter: []
  })

  const declinedReason = [
    'Certificate Provided was invalid',
    'Delay in the payment',
    'Conflict of Interest',
    'User is not valid',
    'Account to be Verified'
  ]

  const handleClick = (e: string) => {
    setshowContent(e)
    setShow({
      visible: 1,
      declinedReason: ''
    })
  }

  const columns: any = [
    {
      flex: 0.5,
      minWidth: 100,
      field: 'id',
      sortable: false,
      headerName: 'Id',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <p className='underline-code'>
          <Link href={{ pathname: `/user/${row.id}`, query: { from: 'approved-list' } }}>
            <MuiLInk className='underline-code muilink_id'>
              {row?.refNo !== null ? row?.refNo : 'AG0' + String(row?.id)}
            </MuiLInk>
          </Link>
        </p>
      ),
      renderHeader: undefined
    },
    {
      flex: 0.5,
      minWidth: 80,
      field: 'incomeSegment',
      headerName: 'Image',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { profilePictureSlug } = row?.userDetails

        return (
          <div
            onClick={() => {
              if (profilePictureSlug?.length > 0) {
                setOpen1({
                  visible: true,
                  url: profilePictureSlug || ''
                })
              }
            }}
            style={{
              cursor: 'pointer'
            }}
          >
            <Avatar src={profilePictureSlug || ''} />
          </div>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 100,
      field: 'orgType',
      headerName: 'Type',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { orgType } = row.userDetails

        if (orgType === config.orgType.company) {
          return (
            <Tooltip title='Company' arrow>
              <BusinessRoundedIcon />
            </Tooltip>
          )
        }
        if (orgType === config.orgType.freelancer) {
          return (
            <Tooltip title='Freelancer' arrow>
              <AccountBox />
            </Tooltip>
          )
        }

        return (
          <Tooltip title='Propertiership' arrow>
            <HailIcon />
          </Tooltip>
        )
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'licenceNo',
      align: 'left',
      headerAlign: 'left',
      headerName: 'Company/Agent',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { firstName, lastName, orgType } = row.userDetails
        const name = orgType === config.orgType.company ? row?.company.name : `${firstName} ${lastName}`

        return (
          <Tooltip title={name} arrow sx={{ textTransform: 'capitalize' }}>
            <Typography noWrap variant='subtitle1'>
              {name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 1,
      minWidth: 200,
      field: 'email',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Email',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const { email } = row.userDetails

        return (
          <Tooltip title={email} arrow>
            <Typography variant='subtitle1' noWrap>
              <MuiLInk underline='none' color='GrayText' href={`mailto:${email}`} noWrap>
                {email}
              </MuiLInk>
            </Typography>
          </Tooltip>
        )
      }
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
        const { contactMobileNumber } = row.userDetails

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
            label='Approved'
            color='success'
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.9,
      minWidth: 170,
      field: 'dateOfJoining',
      headerName: 'DOJ',
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap>{row?.dateOfJoining ? moment(row?.dateOfJoining).format('DD MMM YYYY') : '-'}</Typography>
        )
      }
    },
    {
      flex: 1,
      minWidth: 180,
      sortable: false,
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <MultiButton
          options={
            row?.listingRemark?.length !== 0
              ? [
                  {
                    label: 'Unlist',
                    tooltipLabel: 'Unlist',
                    onClick: () => {
                      setshowContent('')
                      setShow({ visible: Number(row?.userDetails?.id), declinedReason: '' })
                    },
                    icon: <EyeOffOutline sx={{ marginRight: '-4px' }} />
                  },
                  {
                    label: 'Relist Reason',
                    tooltipLabel: 'Show reason for relisting',
                    onClick: () => {
                      handleClick(row.listingRemark)
                    },
                    icon: <Eye sx={{ marginRight: '-4px' }} />
                  }
                ]
              : [
                  {
                    label: 'Unlist',
                    tooltipLabel: 'Unlist',
                    onClick: () => {
                      setshowContent('')
                      setShow({ visible: Number(row?.userDetails?.id), declinedReason: '' })
                    },
                    icon: <EyeOffOutline sx={{ marginRight: '-4px' }} />
                  }
                ]
          }
        />
      )
    }
  ]

  interface pagiantion {
    include: string
    page: number
    perPage: number
    listingStatus: number
    q?: string
    sort?: string
    verificationStatuses: string
    orgType?: number | string
  }

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.verification)

  const [searchText, setSearchText] = useState<string>('')

  const call = (page: number, searchValue = searchText) => {
    const payload: pagiantion = {
      orgType: filter?.orgType,
      verificationStatuses: JSON.stringify([config.agents.verificationStatus.verified]),
      listingStatus: 1,
      page,
      perPage: 10,
      include: 'company,userDetails',
      sort: 'updatedAt:desc'
    }
    if (filter.sorter?.length) {
      payload.sort = `${filter.sorter[0].field}:${filter.sorter[0].sort}`
    }
    if (searchValue.length > 0) {
      payload.q = searchValue
    }

    dispatch(fetchData(payload))
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
    call(1, '')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const onSubmit = () => {
    dispatch(
      patchlisting({
        payload: {
          userId: String(show?.visible),
          listingRemark: reason.indexOf('Other') >= 0 ? show.declinedReason : reason.join(', '),
          listingStatus: 2
        },
        cb: () => {
          call(pageCurrent + 1)
        }
      })
    ).then((res: any) => {
      if (res?.payload?.status === 200) {
        setShow({
          visible: 0,
          declinedReason: ''
        })
        setreason([])
      }
    })
  }

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

  return (
    <Card>
      <CardHeader title='Approved Requests' />
      <Grid container spacing={6}>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <QuickSearchToolbar
            onChange={(event: ChangeEvent<Element | HTMLInputElement>) => {
              handleSearch((event.target as HTMLInputElement).value)
            }}
            isTeamMember='Search by id, name'
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <FilterCompoenent
            label='Type'
            data={config?.orgType}
            variant
            reverseObj
            value={filter?.orgType || ''}
            onChange={val =>
              setFilter(prev => {
                return {
                  ...prev,
                  orgType: val || undefined
                }
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
          <DataGrid
            autoHeight
            rows={store?.data?.data || []}
            columns={columns}
            disableSelectionOnClick
            disableColumnMenu
            pageSize={10}
            loading={store.loading}
            page={pageCurrent}
            getRowId={val => val?.userDetails?.id}
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
            components={{
              NoRowsOverlay: () => (
                <Stack height='100%' alignItems='center' justifyContent='center'>
                  No Agents Found
                </Stack>
              ),
              NoResultsOverlay: () => (
                <Stack height='100%' alignItems='center' justifyContent='center'>
                  No Agents Found
                </Stack>
              ),
              ColumnUnsortedIcon: () => <SwapVertical />
            }}
            rowCount={store?.data?.meta?.pagination?.total || 0}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageChange={(page: number) => {
              call(page + 1)
              setPageCurrent(page)
            }}
          />
        </Grid>

        <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
        <CustomDialog
          title={`Reason for ${showContent?.length > 0 ? 'Relisting' : 'Unlisting'}`}
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
          action={showContent?.length > 0}
          dialogContent={
            <DialogContent style={{ marginTop: '20px', marginBottom: '20px' }}>
              {showContent?.length === 0 ? (
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
                      label='State your reason for relisting'
                      value={show.declinedReason}
                      multiline
                      rows={4}
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
              ) : (
                <TextField
                  value={showContent}
                  fullWidth
                  multiline
                  rows={4}
                  disabled
                  aria-describedby='validation-basic-first-name'
                />
              )}
            </DialogContent>
          }
          customYesTitle='Proceed'
          customCancelTitle='Cancel'
        />
      </Grid>
      <ImagePreview open={open1} setOpen={setOpen1} />
    </Card>
  )
}

export default ApprovedList
