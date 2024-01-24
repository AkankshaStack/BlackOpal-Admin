import Typography from '@mui/material/Typography'

import { DataGrid} from '@mui/x-data-grid'
import { Drawer, FormControlLabel, IconButton, Stack, Tooltip } from '@mui/material'
import { Close } from 'mdi-material-ui'

import Checkbox from '@mui/material/Checkbox'

// ** React Imports
import { useEffect, Fragment, useState } from 'react'

// ** Next Imports
import { AppDispatch } from 'src/store'

import { fetchfaqData } from 'src/store/settings/faq'

// ** Third Party Imports

import { useDispatch, useSelector } from 'react-redux'
import { Grid } from '@mui/material'

import TextField from '@mui/material/TextField'
import { Fab } from '@mui/material'
import { Plus } from 'mdi-material-ui'
import toast from 'react-hot-toast'
import { CloseCircleOutline } from 'mdi-material-ui'
import { LoadingButton } from '@mui/lab'
import CardSnippet from 'src/@core/components/card-snippet'
import { AddSubscription, Subscription, UpdateSubscription } from 'src/api'
import moment from 'moment'
import 'moment/locale/en-in'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'

// import { Subscription } from 'react-hook-form/dist/utils/Subject'

const metaCheckboxFormat = {
  canCallBAck: {
    desc: 'Call back to customer if only customer reached to him on second time',
    value: false
  },
  canVideoCall: {
    desc: 'Instant Video Call',
    value: false
  },
  freeProjects: {
    desc: 'Free Projects:4',
    value: false
  },
  freeTeamMembers: {
    desc: 'Free Team Members:1',
    value: false
  },
  canBookSiteVisits: {
    desc: 'Can book site visits',
    value: false
  },
  canJustCreditzDSA: {
    desc: 'Just Creditz DSA',
    value: false
  },
  canShareDocuments: {
    desc: 'Share project documents available on Just homz',
    value: false
  },
  canBookOfficeForMeetings: {
    desc: 'Book Office for meetings',
    value: false
  },
  additionalBenefitsOnJustCreditz: {
    desc: 'Additonal benefits on Just Creditz Products',
    value: false
  },
  canChatWithCustomerWithReadReceipt: {
    desc: 'Open chat with Customer with read receipt',
    value: false
  },
  canChatWithCustomerWithoutReadReceipt: {
    desc: 'Chat with customer with limited drop down prefilled options  if customer reverts the messages then chat is open with no read reciept',
    value: false
  }
}




const SubscriptionPage = () => {
  const [pageCurrent, setPageCurrent] = useState<number>(1)
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState<boolean>(false)
  const [key] = useState<string>('customerFaq')
  const [name, setName] = useState<string>('')
  const [amount_in_paisa, setAmount_in_paisa] = useState<string>('')
  const [team_members, setTeam_members] = useState<string>('')
  const [projects, setProjects] = useState<string>('')
  const [subscriptionData, setSubscriptionData] = useState<any>({data : [],meta:{}})
  const [deleteId, setDeleteId] = useState<{
    id?: number
    status?: number
  }>({})

  const ActiveSubscription = async () => {
    const payload: any = {};
    (payload.id = deleteId.id), (payload.status = deleteId.status)
    console.log(payload, 'payload update')
    setDeleteId({})

    try {
      const resp = await UpdateSubscription(payload)
      getSubscriptionData()
      console.log(resp)
    } catch (error) {}
  }

  console.log(deleteId, '====setDeleteId.=======')
  console.log(name, '----name')

  const [checkBoxState, setCheckBoxState] = useState<any>({
    canCallBAck: true,
    canVideoCall: true,
    freeProjects: true,
    freeTeamMembers: true,
    canBookSiteVisits: true,
    canJustCreditzDSA: true,
    canShareDocuments: true,
    canBookOfficeForMeetings: true,
    additionalBenefitsOnJustCreditz: true,
    canChatWithCustomerWithReadReceipt: true,
    canChatWithCustomerWithoutReadReceipt: true
  })

  const [metaData, setMetaData] = useState<any>(metaCheckboxFormat)

  const store = useSelector((state: any) => state.faq)

  const getSubscriptionData = async () => {
    
    
    const payload = {
      perPage : 100,
      page : pageCurrent
    }
    try {
      const resp = await Subscription(payload)
      setSubscriptionData(resp)
      console.log(resp.data, '===================resp')
    } catch (error) {}
  }

  useEffect(() => {
    getSubscriptionData();

  }, [subscriptionData?.data?.length , pageCurrent])


  // const handlePageChange=(page)=>{
  //   getSubscriptionData(page)
  // }

  const addSubcription = async () => {
    if (name.length === 0 || projects.length === 0 || team_members.length === 0 || amount_in_paisa.length === 0) {
      toast.error('Please Fill the required fields')

      return
    }
    const payload: any = {}
    payload.name = name
    payload.status = parseInt('1')
    payload.amountInPaisa = parseInt(amount_in_paisa)
    payload.durationInDays = parseInt('2')
    payload.level = parseInt('1')
    payload.teamMembers = parseInt(team_members)
    payload.projects = parseInt(projects)
    payload.taxInPercentage = parseInt('34')

    payload.meta = metaData
    console.log(payload, '-----payload')

    try {
      const resp = await AddSubscription(payload)
      if (resp?.code == 200) {
        getSubscriptionData()
        setOpen(false)
      }
    } catch (error) {}
  }

  console.log(store, 'store')
  
  useEffect(() => {
    dispatch(
      fetchfaqData({
        key
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const handleClickOpen = () => setOpen(true)

  const columns : any = [
    {
      flex: 0.2,
      minWidth: 160,
      field: 'name',
      headerName: 'Name',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }:any) => {
        return (
          <Tooltip title={row?.name}>
            <Typography noWrap>{row?.name}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'status',
      headerName: 'Status',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.status == 1 ? 'Active' : 'InActive'}>
            <Typography noWrap>{row?.status == 1 ? 'Active' : 'InActive'}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'level',
      headerName: 'Level',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.level}>
            <Typography noWrap>{row?.level}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'amount',
      headerName: 'Amount In Paisa',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.amountInPaisa}>
            <Typography style={{ width: '100%' }} noWrap>
              {row?.amountInPaisa}{' '}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'duration',
      headerName: 'Duration in Days',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.durationInDays}>
            <Typography noWrap>{row?.durationInDays}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'members',
      headerName: 'Team Members',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.teamMembers}>
            <Typography noWrap>{row?.teamMembers}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'projects',
      headerName: 'Projects',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.projects}>
            <Typography noWrap>{row?.projects}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'created',
      headerName: 'Created At',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        const createdAt = moment(row?.createdAt).locale('en-in').format('D MMM YYYY hh:mm a')

        return (
          <Tooltip title={createdAt}>
            <Typography noWrap>{createdAt}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'updated',
      headerName: 'Updated At',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        const updatedAt = moment(row?.updatedAt).locale('en-in').format('YYYY-MM-DD hh:mm:ss')

        return (
          <Tooltip title={updatedAt}>
            <Typography noWrap>{updatedAt}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Action',
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Fragment>
            {row?.status != 1 ? (

              // <LoadingButton
              //   variant='outlined'
              //   startIcon={<CheckCircleOutline color='success' />}
              //   disabled={store?.loading}
              //   onClick={() => {
              //     setDeleteId({
              //       id: row?.id,
              //       status: 1
              //     })
              //   }}
              //   color='success'
              //   sx={{ textTransform: 'initial' }}
              // >
              //   Active
              // </LoadingButton>

              <></>
            ) : (
              <LoadingButton
                variant='outlined'
                startIcon={<CloseCircleOutline color='error' />}
                disabled={store?.loading}
                onClick={() => {
                  setDeleteId({
                    id: row?.id,
                    status: 2
                  })
                }}
                sx={{ textTransform: 'initial' }}
                color='error'
              >
                Inactive
              </LoadingButton>
            )}
          </Fragment>
        )
      }
    }
  ]

  const handleCheckBox = (e: any) => {
    const { name, checked } = e.target
    setCheckBoxState({ ...checkBoxState, [name]: checked })

    setMetaData({ ...metaData, [name]: { ...metaData[name], value: checked } })
    console.log(metaData, 'metaData')
  }

  console.log(checkBoxState, 'checkbox')

  const handleChange = (e: any) => {
    const inputValue = e.target.value
    const numberWithoutDecimal = inputValue.replace(/\.\d+/, '')
    setAmount_in_paisa(numberWithoutDecimal)
  }

  return (
    <Fragment>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <CardSnippet
            sx={{ overflow: 'visible' }}
            code={{
              tsx: null,
              jsx: null
            }}
            title='Subscription Plan'
            action={
              <Fab color='primary' variant='extended' onClick={handleClickOpen} size='medium'>
                <Plus sx={{ mr: 1 }} />
                Add
              </Fab>
            }
          >
            {/* <TabContext value={key}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={(event: React.SyntheticEvent, newValue: string) => setKey(newValue)}
                  style={{ marginBottom: '10px' }}
                >
                  <Tab label='Customer' value='customerFaq' />
                  <Tab label='Partner' value='partnerFaq' />
                  <Tab label='Team member' value='teamMemberFaq' />
                </TabList>
              </Box>
            </TabContext> */}
            <div style={{ maxHeight: '68vh'}}>
              <DataGrid
                autoHeight
                rows={subscriptionData?.data}
                rowCount={subscriptionData?.meta?.pagination?.total}
                columns={columns}
                pageSize={10}
                page={pageCurrent}
                disableSelectionOnClick
                getRowId={row => row.id}
                paginationMode='server'
                components={{
                  // Pagination: () => <></>,
                  NoRowsOverlay: () => (
                    <Stack height='100%' alignItems='center' justifyContent='center'>
                      No FAQ Found
                    </Stack>
                  ),
                  NoResultsOverlay: () => (
                    <Stack height='100%' alignItems='center' justifyContent='center'>
                      No FAQ Found
                    </Stack>
                  )
                }}
                sx={{
                  '& .MuiDataGrid-main': {
                    // remove overflow hidden overwise sticky does not work
                    overflow: 'unset'
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    borderRadius: 0,
                    position: 'sticky',
                    zIndex: 100
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    // remove the space left for the header
                    marginTop: '0!important'
                  }
                }}

                onPageChange={(page: number) => {
                  // handlePageChange(page + 1)
                  setPageCurrent(page)
                }}
                loading={store.loading || store.postLoading}
              />
            </div>
          </CardSnippet>
        </Grid>
      </Grid>
      <Drawer
        anchor='right'
        open={open}
        onClose={() => setOpen(false)}
        className='my-faq-drawer'
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box'
          },
          px: 5,
          py: 3
        }}
      >
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4'>Subscription</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </div>
        <div style={{ padding: '20px', marginTop: '10px' }}>
          <TextField
            id='name'
            autoFocus
            fullWidth
            type='text'
            label='Name'
            required
            sx={{ mt: 3 }}
            value={name}
            onChange={e => {
              setName(e.target.value)
            }}
          />

          <TextField
            id='projects'
            fullWidth
            type='number'
            label='Free Projects'
            required
            sx={{ mt: 3 }}
            value={projects}
            onChange={e => {
              setProjects(e.target.value)
            }}
          />

          <TextField
            id='teams'
            fullWidth
            type='number'
            label='Free Team Memebers'
            required
            sx={{ mt: 3 }}
            value={team_members}
            onChange={e => {
              setTeam_members(e.target.value)
            }}
          />

          <TextField
            id='amount'
            fullWidth
            type='number'
            label='Amount In Paisa'
            required
            sx={{ mt: 3 }}
            value={amount_in_paisa}
            onChange={handleChange}
            onKeyPress={event => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault()
              }
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '18px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxState.canChatWithCustomerWithoutReadReceipt}
                  onChange={handleCheckBox}
                  name='canChatWithCustomerWithoutReadReceipt'
                />
              }
              label='Chat with customer with limited drop down prefilled options if customer reverts the messages then chat is open with no read reciept'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxState.canChatWithCustomerWithReadReceipt}
                  onChange={handleCheckBox}
                  name='canChatWithCustomerWithReadReceipt'
                />
              }
              label='Open chat with Customer with read receipt'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxState.canShareDocuments}
                  onChange={handleCheckBox}
                  name='canShareDocuments'
                />
              }
              label='Share project documents available on Just homz'
            />

            <FormControlLabel
              control={<Checkbox checked={checkBoxState.canCallBAck} onChange={handleCheckBox} name='canCallBAck' />}
              label='Call back to customer if only customer reached to him on second time'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxState.canBookOfficeForMeetings}
                  onChange={handleCheckBox}
                  name='canBookOfficeForMeetings'
                />
              }
              label='Book Office for meetings'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxState.canJustCreditzDSA}
                  onChange={handleCheckBox}
                  name='canJustCreditzDSA'
                />
              }
              label='Just Creditz DSA'
            />
            <FormControlLabel
              control={<Checkbox checked={checkBoxState.canVideoCall} onChange={handleCheckBox} name='canVideoCall' />}
              label='Instant Video Call'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxState.canBookSiteVisits}
                  onChange={handleCheckBox}
                  name='canBookSiteVisits'
                />
              }
              label='Can book site visits'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkBoxState.additionalBenefitsOnJustCreditz}
                  onChange={handleCheckBox}
                  name='additionalBenefitsOnJustCreditz'
                />
              }
              label='Additonal benefits on Just Creditz Products'
            />
          </div>
          <LoadingButton
            loading={store.postLoading}
            variant='contained'
            onClick={() => addSubcription()}
            style={{ marginTop: '30px' }}
          >
            Save
          </LoadingButton>
        </div>
      </Drawer>
      <CustomDialog

        title={"Are you sure you want to inActive Subscription? <br/> Note: This process can not be rollback"}
        
        show={Boolean(deleteId?.status)}
        setShow={() => {
          setDeleteId({})
        }}
        buttonprop={{
          loading: store?.loading,
          onClick: () => ActiveSubscription()
        }}
      />
      {/* <CustomDialog
        title='Are you sure you want to inActive subscription?'
        show={Boolean(confirm)}
        setShow={() => setConfirm(0)}
        buttonprop={{
          onClick: () => {
            // remove(confirm)
            // setConfirm(0)
            ActiveSubscription()
          }
        }}
      /> */}
    </Fragment>
  )
}

export default SubscriptionPage


// const Title = ()=>{
//   return (
//     <>
//       <h4>Are you sure you want to inActive Subscription?</h4>
//       <h4>Note: You are not able to rollback</h4>
//     </>
//   )
// }