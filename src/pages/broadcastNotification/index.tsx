import Typography from '@mui/material/Typography'

import { DataGrid } from '@mui/x-data-grid'
import { Drawer, FormControl, IconButton, InputLabel, MenuItem, Stack, Tooltip, Select } from '@mui/material'
import { Close } from 'mdi-material-ui'

// ** React Imports
import { useEffect, Fragment, useState } from 'react'

// ** Next Imports

// import { fetchfaqData, postfaqData, deletefaqData } from 'src/store/settings/faq'

// ** Third Party Imports

import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'

import TextField from '@mui/material/TextField'
import { Fab } from '@mui/material'

// import toast from 'react-hot-toast'

import { LoadingButton } from '@mui/lab'
import CardSnippet from 'src/@core/components/card-snippet'

// import { CustomDialog } from 'src/views/components/dialog/CustomDialog'

import { BroadcastNotificationData, BroadcastNotifications } from 'src/api'
import moment from 'moment'

const BroadcastNotification = () => {
    const [open, setOpen] = useState<boolean>(false)

    // const [confirm, setConfirm] = useState<number>(0)

    const [messageType, setMessageType] = useState<any>('')
    const [messageTitle, setMessageTitle] = useState<any>('')
    const [messageDetais, setMessageDetails] = useState<any>('')

    const [NotificationData, setNotificationData] = useState<any>([])

    const store = useSelector((state: any) => state.faq)

    const getNotificationData = async () => {
        const payload: any = {}
        payload.user_id = 2
        try {
            const resp = await BroadcastNotificationData(payload)

            setNotificationData(resp?.data)

            console.log(resp.data, '===================resp')
        } catch (error) { }
    }

    const sendNotification = async () => {
        const payload: any = {}
        payload.receiverType = messageType
        payload.title = messageTitle
        payload.description = messageDetais
        payload.type = 1
        payload.meta = { test: 1 }
        payload.status = 1

        console.log(payload, '-----payload')

        try {
            const resp = await BroadcastNotifications(payload)
            if (resp?.code == 200) {
                setOpen(false)
                getNotificationData()
            }
            console.log(resp.data, '===================resp')
        } catch (error) { }
    }

    useEffect(() => {
        getNotificationData()
    }, [])

    const handleClickOpen = () => setOpen(true)

    const handleChange = (e: any) => {
        setMessageType(parseInt(e.target.value))
    }

    const notificationType = [
        {
            name: 'Customer',
            id: 1
        },
        {
            name: 'Customer Champion',
            id: 2
        },
        {
            name: 'Agent Admin',
            id: 3
        },
        {
            name: 'Freelancer',
            id: 4
        },
        {
            name: 'Team Member',
            id: 5
        },
        {
            name: 'Customer Only',
            id: 6
        }
    ]

    function getUserType(row: any) {
        switch (row) {
            case 1:
                return 'Customer'
            case 2:
                return 'Customer Champion'
            case 3:
                return 'Agent Admin'
            case 4:
                return 'Freelancer'
            case 5:
                return 'Team Member'
            case 6:
                return 'Customer Only'
            default:
                return 'Unknown User Type'
        }
    }

    const columns = [
        {
            flex: 0.2,
            minWidth: 100,
            field: 'id',
            headerName: 'S.No.',
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: any) => {
                return (
                    <Tooltip title={row?.id}>
                        <Typography noWrap>{row?.id}</Typography>
                    </Tooltip>
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 250,
            field: 'title',
            headerName: 'Title',
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: any) => {
                return (
                    <Tooltip title={(row?.body).title}>
                        <Typography noWrap>{(row?.body).title}</Typography>
                    </Tooltip>
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 250,
            field: 'description',
            headerName: 'Description',
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: any) => {
                return (
                    <Tooltip title={(row?.body).description}>
                        <Typography noWrap>{(row?.body).description}</Typography>
                    </Tooltip>
                )
            }
        },

        {
            flex: 0.2,
            minWidth: 200,
            field: 'created_at',
            headerName: 'Broadcast Time',
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: any) => {
                return (
                    <Tooltip title={row?.created_at}>
                        <Typography noWrap>{moment(row?.created_at).locale('en-in').format('D MMM YYYY hh:mm a')}</Typography>
                    </Tooltip>
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 200,
            field: 'user_type',
            headerName: 'Send To',
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }: any) => {
                return (
                    <Tooltip title={row?.user_type}>
                        <Typography noWrap>{getUserType(row?.user_type)}</Typography>
                    </Tooltip>
                )
            }
        }
    ]

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
                        title='Broadcast Notification List'
                        action={
                            <Fab color='primary' variant='extended' onClick={handleClickOpen} size='medium'>
                                Broadcast Notification
                            </Fab>
                        }
                    >
                        <div style={{ maxHeight: '68vh', overflowY: 'scroll' }}>
                            <DataGrid
                                autoHeight
                                rows={NotificationData}
                                columns={columns}
                                pageSize={10}
                                disableSelectionOnClick
                                getRowId={row => row.id}
                                components={{
                                    Pagination: () => <></>,
                                    NoRowsOverlay: () => (
                                        <Stack height='100%' alignItems='center' justifyContent='center'>
                                            No Broadcast Notification Found
                                        </Stack>
                                    ),
                                    NoResultsOverlay: () => (
                                        <Stack height='100%' alignItems='center' justifyContent='center'>
                                            No Broadcast Notification Found
                                        </Stack>
                                    )
                                }}
                                sx={{
                                    '& .MuiDataGrid-main': {
                                        overflow: 'unset'
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        borderRadius: 0,
                                        position: 'sticky',
                                        zIndex: 100
                                    },
                                    '& .MuiDataGrid-virtualScroller': {
                                        marginTop: '0!important'
                                    }
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
                    <Typography variant='h5'>Broadcast New Message</Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <Close />
                    </IconButton>
                </div>
                <div style={{ padding: '20px', marginTop: '10px' }}>
                    <FormControl sx={{ marginBottom: 1, width: '100%' }}>
                        <InputLabel id='type' style={{ fontWeight: '600', color: 'black' }}>
                            Select Type
                        </InputLabel>
                        <Select
                            variant='outlined'
                            labelId='Select Any'
                            autoFocus
                            required
                            id='type'
                            label='Select Any'
                            onChange={handleChange}
                        >
                            {notificationType.map((item: any) => (
                                <MenuItem key={item} value={item?.id}>
                                    {item?.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        id='Title'
                        autoFocus
                        fullWidth
                        type='text'
                        label='Title'
                        required
                        sx={{ mt: 3 }}
                        value={messageTitle}
                        onChange={e => {
                            setMessageTitle(e.target.value)
                        }}
                    />

                    <TextField
                        id='message'
                        multiline
                        fullWidth
                        type='text'
                        label='Message'
                        required
                        sx={{ mt: 6 }}
                        value={messageDetais}
                        onChange={e => {
                            setMessageDetails(e.target.value)
                        }}
                    />

                    <LoadingButton
                        loading={store.postLoading}
                        variant='contained'
                        onClick={() => sendNotification()}
                        style={{ marginTop: '30px' }}
                    >
                        Send
                    </LoadingButton>
                </div>
            </Drawer>

            {/* <CustomDialog
                title='Are you sure you want to delete FAQ?'
                show={Boolean(confirm)}
                setShow={() => setConfirm(0)}
                buttonprop={{
                    onClick: () => {
                        remove(confirm)
                        setConfirm(0)
                    }
                }}
            /> */}
        </Fragment>
    )
}

export default BroadcastNotification