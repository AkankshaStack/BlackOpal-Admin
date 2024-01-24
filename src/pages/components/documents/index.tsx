/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { fetchData } from 'src/store/apps/user'
import {
  AccountOutline,
  ChartDonut,
  CloseCircleOutline,
  CogOutline,
  EyeOutline,
  Laptop,
  PencilOutline
} from 'mdi-material-ui'
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { documentType } from 'src/utilities/conversions'
import DocumentModal from 'src/views/components/documentModal/DocumentModal'
import config from 'src/configs/config'

interface UserRoleType {
  [key: string]: ReactElement
}

// ** Vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userRoleObj: UserRoleType = {
  admin: <Laptop sx={{ mr: 2, color: 'error.main' }} />,
  author: <CogOutline sx={{ mr: 2, color: 'warning.main' }} />,
  editor: <PencilOutline sx={{ mr: 2, color: 'info.main' }} />,
  maintainer: <ChartDonut sx={{ mr: 2, color: 'success.main' }} />,
  subscriber: <AccountOutline sx={{ mr: 2, color: 'primary.main' }} />
}

interface CellType {
  row: any
}

const Documents = ({ documentData }: any) => {
  // ** State
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [show, setShow] = useState<{
    type: number
    response: any
  }>({
    type: 0,
    response: {}
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const columns: any = [
    {
      flex: 0.2,
      width: 230,
      field: 'documen1t',
      headerName: 'Document Type',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
            {documentType(row?.type)}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      width: 230,
      field: 'document',
      headerName: 'Document',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
            {row?.type === config?.certificates?.type?.aadhar
              ? `XXXX-XXXX-${row?.meta?.aadhaarNumber || ''}`
              : row?.verificationNumber}
          </Typography>
        )
      }
    },

    {
      flex: 0.2,
      width: 100,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      field: 'view',
      headerName: 'View karza response',
      renderCell: ({ row }: CellType) => (
        <Button
          startIcon={<EyeOutline />}
          variant='outlined'
          disabled={!Boolean(row?.meta?.kycResponse)}
          onClick={() => {
            setShow({
              type: row?.type,
              response: row?.meta?.kycResponse || {}
            })
          }}
          sx={{ textTransform: 'initial' }}
        >
          View
        </Button>
      )
    }
  ]

  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  return (
    <Grid item xs={12}>
      <DataGrid
        autoHeight
        rows={documentData}
        columns={columns}
        pageSize={pageSize}
        disableSelectionOnClick
        disableColumnMenu
        components={{
          Pagination: () => <></>,
          NoRowsOverlay: () => (
            <Stack height='100%' alignItems='center' justifyContent='center'>
              No Document Found
            </Stack>
          ),
          NoResultsOverlay: () => (
            <Stack height='100%' alignItems='center' justifyContent='center'>
              No Document Found
            </Stack>
          )
        }}
        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
        getRowId={row => row?.type || `1212$ ${row?.verificationNumber || ''}`}
        onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
      />
      <Dialog
        fullWidth
        open={Boolean(show?.type)}
        maxWidth='xs'
        scroll='body'
        onClose={() => {
          setShow({
            type: 0,
            response: {}
          })
        }}
      >
        <DialogTitle sx={{ m: 0, p: 4 }}>
          Karza API Response
          <IconButton
            aria-label='close'
            onClick={() =>
              setShow({
                type: 0,
                response: {}
              })
            }
            sx={{
              position: 'absolute',
              right: 8,
              top: 8

              // color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseCircleOutline />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ padding: '1rem', background: 'white', width: '100%' }}>
            <DocumentModal type={show?.type} response={show?.response} />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default Documents
