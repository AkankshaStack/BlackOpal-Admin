import * as React from 'react'
import {
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  TablePagination,
  CircularProgress
} from '@mui/material'
import { useState, useEffect, ChangeEvent } from 'react'
import { ChevronDown, ChevronUp } from 'mdi-material-ui'
import moment from 'moment'
import CustomChip from 'src/@core/components/mui/chip'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'
import CollapseData from 'src/views/property/collapse'
import DrawerData from 'src/views/property/side-drawer'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { debounce } from 'lodash'
import config from 'src/configs/config'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

import { getPartnerProject, setProjectSearch } from 'src/store/teammember'

interface pagination {
  include?: string
  perPage?: number
  page?: number
}

const ProjectList = () => {
  const [openDrawer, setopenDrawer] = React.useState({
    visible: false,
    id: ''
  })
  const dispatch = useDispatch<AppDispatch>()
  const [open1, setOpen1] = useState<imagePreview>({
    visible: false,
    url: ''
  })

  const store = useSelector((state: any) => state.teammember)
  const userDetails = useSelector((state: any) => state.user.singleData)

  const call = (page = 1) => {
    const payload: pagination = {
      include: 'property,teamMembers',
      perPage: 10,
      page: 1
    }
    if (page) {
      payload.page = page
    }
    dispatch(
      getPartnerProject({
        partnerId: userDetails?.userDetails?.id,
        data: payload
      })
    )
  }

  const handleSearch = debounce((val: string) => {
    dispatch(setProjectSearch(val))
    call()
  }, 400)

  useEffect(() => {
    call()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            <Tooltip title={row?.property?.code}>
              <Typography
                noWrap
                className='underline-code'
                onClick={() => {
                  setopenDrawer({
                    visible: true,
                    id: row?.property?.id
                  })
                }}
              >
                {row?.property?.code}
              </Typography>
            </Tooltip>
          </TableCell>

          <TableCell align='center' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              onClick={() => {
                if (row?.property?.images?.length > 0) {
                  setOpen1({
                    visible: true,
                    url:
                      row?.property?.images?.length > 0
                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${row?.property?.images[0]}`
                        : ''
                  })
                }
              }}
              style={{
                cursor: 'pointer'
              }}
            >
              <Avatar
                src={
                  row?.property?.images?.length > 0 ? process.env.NEXT_PUBLIC_IMAGE_URL + row?.property?.images[0] : ''
                }
              />
            </div>
          </TableCell>

          <TableCell style={{ minWidth: '200px' }} align='left' sx={{ textTransform: 'capitalize' }}>
            <Tooltip title={row?.property?.name} arrow>
              <Typography noWrap>
                {row?.property?.name?.length > config.nameLengthCheck
                  ? row?.property?.name?.slice(0, config.nameLengthCheck) + '...'
                  : row?.property?.name}
              </Typography>
            </Tooltip>
          </TableCell>

          <TableCell align='center' style={{ minWidth: '150px' }}>
            <CustomChip
              skin='light'
              size='small'
              label='Approved'
              color='success'
              sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
            />
          </TableCell>

          <TableCell align='center' style={{ minWidth: '150px' }}>
            {row?.property?.statusUpdatedOn ? moment(row?.property?.statusUpdatedOn).format('DD MMM YYYY') : '-'}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: 'none' }} colSpan={7}>
            <CollapseData
              open={open}
              data={row?.property}
              setopenDrawer={setopenDrawer}
              teamMemberData={row?.teamMembers}
              isTeamMember={true}
            />
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }
  const handleChangePage = (e: any, page: number) => {
    call(page + 1)
  }

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'scroll' }} component='div' style={{ boxShadow: 'none' }}>
        <QuickSearchToolbar
          isNotDataGrid
          onChange={(event: ChangeEvent) => {
            handleSearch((event.target as HTMLButtonElement).value)
          }}
        />
        <TableContainer>
          <Table aria-label='collapsible table'>
            <TableHead>
              <TableRow>
                <TableCell align='center'>More</TableCell>
                <TableCell align='center'>ID</TableCell>
                <TableCell align='center'>Image</TableCell>
                <TableCell align='left'>Property Name</TableCell>
                <TableCell align='center'>Status</TableCell>
                <TableCell align='center'>Active Date</TableCell>
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
                    <Row key={row?.property?.name} row={row} />
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
          count={store?.projectPagination?.total || 0}
          rowsPerPage={10}
          page={store?.projectPagination?.currentPage ? store?.projectPagination?.currentPage - 1 : 0}
          onPageChange={handleChangePage}
        />
      </Paper>
      <DrawerData openDrawer={openDrawer} setopenDrawer={setopenDrawer} />
      <ImagePreview open={open1} setOpen={setOpen1} />
    </>
  )
}

export default ProjectList
