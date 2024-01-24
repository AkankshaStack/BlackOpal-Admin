import EyeOutline from 'mdi-material-ui/EyeOutline'

// ** Next Import

// ** React Imports
import { useEffect, useState } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Utils Import
// ** Types Imports
import { AppDispatch } from 'src/store'

// ** Actions Imports
import { fetchData } from 'src/store/apps/user'

// ** Custom Components Imports
// ** MUI Imports
import { Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { FileDownloadOutline } from 'mdi-material-ui'
import { download } from 'src/utilities/conversions'

interface CellType {
  row: any
}

const ReraCertificates = () => {
  const [pageSize, setPageSize] = useState<number>(10)

  const columns = [
    {
      flex: 0.15,
      minWidth: 180,
      headerName: 'RERA number',
      sortable: false,
      field: 'reraNumber',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.verificationNumber}>
            <Typography noWrap sx={{ textTransform: 'uppercase' }}>
              {row?.verificationNumber}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'state',
      sortable: false,
      headerName: 'State',
      renderCell: ({ row }: CellType) => {
        return <Typography noWrap>{row?.state?.name}</Typography>
      }
    },
    {
      flex: 0.15,
      field: 'city',
      minWidth: 150,
      sortable: false,
      headerName: 'City',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {row?.city?.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'District',
      sortable: false,
      field: 'district',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {row?.district?.name}
          </Typography>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'view',
      headerName: 'View',
      renderCell: ({ row }: CellType) => (
        <IconButton onClick={() => window.open(row?.verificationCertificateUrl, '_blank')}>
          <EyeOutline />
        </IconButton>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'download',
      headerName: 'Download',
      renderCell: ({ row }: CellType) => (
        <IconButton
          onClick={() => {
            download(row?.verificationCertificateUrl, 'RERA Document')
          }}
        >
          <FileDownloadOutline />
        </IconButton>
      )
    }
  ]

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: any) => state.user)

  useEffect(() => {
    dispatch(
      fetchData({
        q: '',
        role: '',
        status: '',
        currentPlan: ''
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DataGrid
          autoHeight
          rows={store?.singleData?.reraCertificates}
          columns={columns}
          pageSize={pageSize}
          disableSelectionOnClick
          disableColumnMenu
          components={{
            Pagination: () => <></>,
            NoRowsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                No RERA Documents Found
              </Stack>
            ),
            NoResultsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                No RERA Documents Found
              </Stack>
            )
          }}
          sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
        />
      </Grid>
    </Grid>
  )
}

export default ReraCertificates
