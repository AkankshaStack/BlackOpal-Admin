import React, { FC, Fragment, useState } from 'react'
import {
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableBody,
  Typography,
  Tooltip,
  TablePagination,
  CircularProgress
} from '@mui/material'
import { CheckCircleOutline, CloseCircleOutline, Eye } from 'mdi-material-ui'
import CustomChip from 'src/@core/components/mui/chip'
import {
  leadStatusConversion,
  leadStatusColor,
  leadVerificationStatusColor,
  leadVerificationStatusConversion
} from 'src/utilities/conversions'
import { ERoutes } from 'src/common/routes'
import MultiButton from '../multiButton/MultiButton'
import { useRouter } from 'next/router'
import { pagination } from 'src/common/types'
import config from 'src/configs/config'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { CloseLeadDialog } from '../closelead-dialog'

interface ILeadsTable {
  activeLeads?: boolean
  handleChangePage: (page: number) => void
  pagination: pagination
  loading: boolean
  call: () => void
  leads: any
}

const LeadsTable: FC<ILeadsTable> = ({ activeLeads = false, handleChangePage, call, loading, leads, pagination }) => {
  const { verifyLoading } = useSelector((state: RootState) => state.leads)

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Lead ID</TableCell>
              <TableCell align='left'>Customer Name</TableCell>
              {/* <TableCell align='left'>Agent Name (ID)</TableCell> */}
              <TableCell align='left'>TM Name</TableCell>
              <TableCell align='left'>Project Name</TableCell>
              {activeLeads && (
                <Fragment>
                  <TableCell align='center'>Verification Status</TableCell>
                  <TableCell align='center'>Status</TableCell>
                </Fragment>
              )}
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            style={{
              height: 'auto',
              position: 'relative'
            }}
          >
            {loading || verifyLoading ? (
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
            ) : leads?.length > 0 ? (
              <>
                {leads.map((data: any) => (
                  <Row key={data.id} rowData={data} activeLeads={activeLeads} call={call} />
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
                    No leads Found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component='div'
        count={pagination?.total || 0}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
        page={pagination?.currentPage ? pagination?.currentPage - 1 : 0}
        onPageChange={(e, page: number) => handleChangePage(page)}
      />
    </>
  )
}

export default LeadsTable

interface IRowProps {
  rowData: any
  activeLeads: boolean
  call: () => void
}
function Row({ rowData, activeLeads, call }: IRowProps) {
  const router = useRouter()
  const [show, setShow] = useState<{
    visible: boolean
    status: number
    data: any
    declineReason?: string
  }>({
    visible: false,
    status: 0,
    data: {}
  })

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align='left' sx={{ minWidth: '80px' }}>
          {rowData?.refId || '-'}
        </TableCell>
        <TableCell align='left' sx={{ minWidth: '150px' }}>
          <Tooltip
            title={`
              ${rowData?.customer?.firstName || ''} ${rowData?.customer?.lastName || ''}`}
            placement='bottom-start'
          >
            <Typography noWrap>
              {`
              ${rowData?.customer?.firstName || ''} ${rowData?.customer?.lastName || ''}`}
            </Typography>
          </Tooltip>
        </TableCell>
        {/* <TableCell align='left' sx={{ maxWidth: '150px' }}>
          <Tooltip title={`${rowData.agentName} (${rowData.agentId})`} placement='bottom-start'>
            <Typography noWrap> {`${rowData.agentName} (${rowData.agentId})`}</Typography>
          </Tooltip>
        </TableCell> */}
        <TableCell align='left' sx={{ minWidth: '150px' }}>
          <Tooltip
            title={`
              ${rowData?.teamMember?.firstName || ''} ${rowData?.teamMember?.lastName || ''}`}
            placement='bottom-start'
          >
            <Typography
              noWrap
              onClick={() =>
                router.push({
                  pathname: `/team-members/profile/${rowData?.teamMember?.agentInfo?.id}`,
                  query: { from: 'close-lead' }
                })
              }
            >
              {`
              ${rowData?.teamMember?.firstName || ''} ${rowData?.teamMember?.lastName || ''}`}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align='left' sx={{ minWidth: '50px' }}>
          <Tooltip title={`${rowData?.property?.name}`} placement='bottom-start'>
            <Typography noWrap>
              {rowData?.property?.name?.length > config.nameLengthCheck
                ? rowData?.property?.name?.slice(0, config.nameLengthCheck) + '...'
                : rowData?.property?.name}
            </Typography>
          </Tooltip>
        </TableCell>
        {activeLeads && (
          <Fragment>
            <TableCell align='center' sx={{ minWidth: '50px' }}>
              <CustomChip
                skin='light'
                size='small'
                variant='outlined'
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                color={leadVerificationStatusColor(rowData?.verificationStatus)}
                label={leadVerificationStatusConversion(rowData?.verificationStatus)}
              />
            </TableCell>
            <TableCell align='center' sx={{ minWidth: '50px' }}>
              <CustomChip
                skin='light'
                size='small'
                variant='outlined'
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                color={leadStatusColor(rowData?.status)}
                label={leadStatusConversion(rowData?.status)}
              />
            </TableCell>
          </Fragment>
        )}

        <TableCell align='center' sx={{ minWidth: '50px' }}>
          <MultiButton
            options={
              activeLeads &&
              (rowData?.verificationStatus === config.leads.verificationStatus.Verified ||
                rowData?.verificationStatus === config.leads.verificationStatus.Rejected ||
                rowData?.verificationStatus === config.leads.verificationStatus.Pending)
                ? [
                    {
                      label: 'View',
                      tooltipLabel: 'View Details',
                      onClick: () => {
                        router.push({ pathname: ERoutes.VIEW_DETAILS.replace('[:id]', rowData?.id) })
                      },
                      icon: <Eye sx={{ marginRight: '-4px' }} />
                    }
                  ]
                : [
                    {
                      label: 'View',
                      tooltipLabel: 'View Details',
                      onClick: () => {
                        router.push({ pathname: ERoutes.VIEW_DETAILS.replace('[:id]', rowData?.id) })
                      },
                      icon: <Eye sx={{ marginRight: '-4px' }} />
                    },
                    {
                      label: 'Approve',
                      tooltipLabel: 'Approve',
                      onClick: () => {
                        setShow({
                          visible: true,
                          status: config?.leads?.verificationStatus?.Verified,
                          data: rowData
                        })
                      },
                      icon: <CheckCircleOutline color='success' sx={{ marginRight: '-4px' }} />,
                      color: 'success.main'
                    },
                    {
                      label: 'Decline',
                      tooltipLabel: 'Decline',
                      onClick: () => {
                        setShow({
                          visible: true,
                          status: config?.leads?.verificationStatus?.Rejected,
                          data: rowData
                        })
                      },
                      icon: <CloseCircleOutline color='error' sx={{ marginRight: '-4px' }} />,
                      color: 'error'
                    }
                  ]
            }
          />
        </TableCell>
      </TableRow>
      <CloseLeadDialog show={show} setShow={setShow} callback={() => call()} />
    </>
  )
}
