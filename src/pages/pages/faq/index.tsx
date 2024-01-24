// ** Third Party Imports
import axios from 'axios'

// ** Icons Imports
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import Plus from 'mdi-material-ui/Plus'

// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Types
import { FaqQAndAType } from 'src/@fake-db/types'

import Box from '@mui/material/Box'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { LoadingButton } from '@mui/lab'

const JHFAQ = ({ apiData }: any) => {
  // ** States
  const [data, setData] = useState<FaqQAndAType[]>([])
  const [searchTerm] = useState<string>('')

  useEffect(() => {
    if (searchTerm !== '') {
      axios.get('/pages/faqs', { params: { q: searchTerm } }).then(response => {
        if (response.data && response.data.length) {
          setData(response.data)
        } else {
          setData([])
        }
      })
    } else {
      setData(apiData)
    }
  }, [apiData, searchTerm])
  const renderNoResult = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AlertCircleOutline sx={{ mr: 2 }} />
      <Typography variant='h6'>No Results Found!!</Typography>
    </Box>
  )

  return (
    <Grid container spacing={2}>
      <DialogForm />
      {data !== null && data.length ? null : renderNoResult}
    </Grid>
  )
}

const DialogForm = (): any => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [question, setQ] = useState('')
  const [answer, setA] = useState('')

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const addQandA = async () => {
    return
  }

  return (
    <Fragment>
      <Fab color='primary' variant='extended' onClick={handleClickOpen}>
        <Plus sx={{ mr: 1 }} />
        Add
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Add QnA</DialogTitle>
        <DialogContent>
          <TextField
            id='question'
            autoFocus
            multiline
            fullWidth
            type='text'
            label='Question'
            sx={{ mt: 3 }}
            value={question}
            onChange={e => {
              setQ(e.target.value)
            }}
          />
          <TextField
            id='answer'
            autoFocus
            multiline
            fullWidth
            type='text'
            label='Answer'
            sx={{ mt: 3 }}
            value={answer}
            onChange={e => {
              setA(e.target.value)
            }}
          />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <LoadingButton variant='outlined' onClick={() => addQandA()} style={{ marginTop: '20px' }}>
            Save
          </LoadingButton>
          <Button onClick={handleClose}>Discard</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default JHFAQ
