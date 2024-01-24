import Typography from '@mui/material/Typography'

import { DataGrid } from '@mui/x-data-grid'
import { Drawer, FormControlLabel, IconButton, Radio, RadioGroup, Stack, Tooltip } from '@mui/material'
import { Close, Delete, PencilOutline } from 'mdi-material-ui'

// ** React Imports
import { useEffect, Fragment, useState } from 'react'

// ** Next Imports
import { AppDispatch } from 'src/store'

import { fetchfaqData, postfaqData, deletefaqData } from 'src/store/settings/faq'

// ** Third Party Imports

import { useDispatch, useSelector } from 'react-redux'
import { Tab, Grid, Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import { Fab } from '@mui/material'
import { Plus } from 'mdi-material-ui'
import toast from 'react-hot-toast'
import { LoadingButton, TabContext, TabList } from '@mui/lab'
import CardSnippet from 'src/@core/components/card-snippet'
import { CustomDialog } from 'src/views/components/dialog/CustomDialog'

const FAQ = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState<boolean>(false)
  const [confirm, setConfirm] = useState<number>(0)
  const [question, setQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [editingkey, setEditingKey] = useState<any>('')
  const [key, setKey] = useState<string>('customerFaq')

  const store = useSelector((state: any) => state.faq)

  useEffect(() => {
    dispatch(
      fetchfaqData({
        key
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setEditingKey('')
    setQuestion('')
    setAnswer('')
  }
  const handleSubmit = () => {
    const arr = store.data || []

    if (question.length === 0 || answer.length === 0) {
      toast.error('Please Fill the required feilds')

      return
    }
    const db12 = {
      question,
      answer
    }

    if (editingkey) {
      const arr1 = [...arr]
      arr1[editingkey - 1] = db12
      dispatch(
        postfaqData({
          key: key,
          value: {
            text: arr1
          }
        })
      )
      handleClose()

      return
    }

    const obj = [...arr, db12]

    dispatch(
      postfaqData({
        key: key,
        value: {
          text: obj
        }
      })
    )
    handleClose()
  }
  const remove = (index: number) => {
    let arr = store.data
    if (arr.length === 1) {
      arr = []
    } else {
      arr = arr.filter((val: any, index1: number) => index1 !== index - 1)
    }

    const obj = [...arr]

    dispatch(
      deletefaqData({
        key: key,
        value: {
          text: obj
        }
      })
    )
  }
  const columns = [
    {
      flex: 0.2,
      minWidth: 250,
      field: 'question',
      headerName: 'Question',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.question}>
            <Typography noWrap>{row?.question}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'answer',
      headerName: 'Answer',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.answer}>
            <Typography noWrap>{row?.answer}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      disableColumnMenu: true,
      headerName: 'Actions',
      renderCell: ({ row }: any) => {
        return (
          <div>
            <IconButton
              onClick={() => {
                const data = store.data[row?.id - 1]
                setQuestion(data.question)
                setAnswer(data.answer)
                setOpen(true)
                setEditingKey(row?.id)
              }}
            >
              <PencilOutline />
            </IconButton>
            <IconButton onClick={() => setConfirm(row?.id)}>
              <Delete />
            </IconButton>
          </div>
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
            title='FAQs'
            action={
              <Fab color='primary' variant='extended' onClick={handleClickOpen} size='medium'>
                <Plus sx={{ mr: 1 }} />
                Add
              </Fab>
            }
          >
            <TabContext value={key}>
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
            </TabContext>
            <div style={{ maxHeight: '68vh', overflowY: 'scroll' }}>
              <DataGrid
                autoHeight
                rows={store.data}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                getRowId={row => row.id}
                components={{
                  Pagination: () => <></>,
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
          <Typography variant='h4'>FAQ</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </div>
        <div style={{ padding: '20px', marginTop: '10px' }}>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            style={{ display: 'flex', flexDirection: 'row' }}
            name='radio-buttons-group'
            value={key}
            defaultValue={editingkey ? key : 'customerFaq'}
            onChange={(e, value) => setKey(value)}
            aria-disabled={editingkey ? true : false}
          >
            <FormControlLabel
              value='customerFaq'
              control={<Radio />}
              disabled={editingkey ? true : false}
              label='Customer'
            />
            <FormControlLabel
              value='partnerFaq'
              control={<Radio />}
              label='Partner'
              disabled={editingkey ? true : false}
            />
            <FormControlLabel
              value='teamMemberFaq'
              control={<Radio />}
              label='Team member'
              disabled={editingkey ? true : false}
            />
          </RadioGroup>
          <TextField
            id='question'
            autoFocus
            fullWidth
            type='text'
            label='Question'
            required
            sx={{ mt: 3 }}
            value={question}
            onChange={e => {
              setQuestion(e.target.value)
            }}
          />
          <TextField
            id='answer'
            autoFocus
            required
            multiline
            minRows={5}
            fullWidth
            type='text'
            label='Answer'
            sx={{ mt: 8 }}
            value={answer}
            onChange={e => {
              setAnswer(e.target.value)
            }}
          />
          <LoadingButton
            loading={store.postLoading}
            variant='contained'
            onClick={() => handleSubmit()}
            style={{ marginTop: '30px' }}
          >
            Save
          </LoadingButton>
        </div>
      </Drawer>
      <CustomDialog
        title='Are you sure you want to delete FAQ?'
        show={Boolean(confirm)}
        setShow={() => setConfirm(0)}
        buttonprop={{
          onClick: () => {
            remove(confirm)
            setConfirm(0)
          }
        }}
      />
    </Fragment>
  )
}

export default FAQ
