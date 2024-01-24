import React, { useEffect } from 'react'
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Grid,
  Paper,
  Chip,
  Card,
  Avatar,
  Button,
  Tooltip
} from '@mui/material'
import NextLink from 'next/link'
import { debounce } from 'lodash'
import { verificationStatusConversion, verificationStatusColor } from 'src/utilities/conversions'
import MoreProjectDialog from '../moreProjectDialog'
import { ChevronDown, ChevronUp } from 'mdi-material-ui'
import CustomChip from 'src/@core/components/mui/chip'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
import { CircularProgress, Stack } from '@mui/material'
import { getTeamMember, setSearch } from 'src/store/teammember'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { Youtube, Linkedin, Instagram, GoogleChrome, MicrosoftEdge, Twitter } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { imagePreview } from 'src/common/types'
import ImagePreview from 'src/views/image-perview'

function Row({ row }: any) {
  const [open, setOpen] = React.useState(false)
  const [open1, setOpen1] = React.useState<imagePreview>({
    visible: false,
    url: ''
  })
  const router = useRouter()

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align='center'>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row' align='center'>
          <NextLink href={{ pathname: `/team-members/profile/${row?.id}`, query: { from: router?.query?.from } }}>
            <p className='underline-code'>{row?.refNo !== null ? row?.refNo : 'TM0' + String(row?.id)}</p>
          </NextLink>
        </TableCell>
        <TableCell align='center'>
          <div
            onClick={() => {
              if (row?.userDetails?.profilePictureSlug?.length > 0) {
                setOpen1({
                  visible: true,
                  url: row?.userDetails?.profilePictureSlug || ''
                })
              }
            }}
            style={{
              cursor: 'pointer'
            }}
          >
            <Avatar
              src={`${row?.userDetails?.profilePictureSlug}`}
              sx={{ mx: 'auto', width: '1.875rem', height: '1.875rem' }}
            />
          </div>
        </TableCell>
        <TableCell align='center'>{`${row?.userDetails?.firstName || ''} ${
          row?.userDetails?.lastName || ''
        }`}</TableCell>
        <TableCell align='center' sx={{ maxWidth: 180 }}>
          <Tooltip arrow title={`${row.userDetails.email}`}>
            <Typography noWrap variant='subtitle1'>{`${row.userDetails.email}`}</Typography>
          </Tooltip>
        </TableCell>
        <TableCell align='center'>
          <Tooltip arrow title={`${row.userDetails.contactMobileNumber}`}>
            <Typography variant='subtitle1'>{`${row.userDetails.contactMobileNumber}`}</Typography>
          </Tooltip>
        </TableCell>
        {/* <TableCell align='center'>{moment(row.dateOfJoining).format('DD MMM YYYY')}</TableCell> */}
        {/* <TableCell align='center'>{'-'}</TableCell> */}
        <TableCell align='center'>
          <CustomChip
            skin='light'
            size='small'
            variant='outlined'
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
            color={verificationStatusColor(row.verificationStatus)}
            label={verificationStatusConversion(row.verificationStatus)}
          />
        </TableCell>
        {/* <TableCell align='center'>
          {row?.dateOfJoining ? moment(row?.dateOfJoining).format('DD MMM YYYY') : '-'}
        </TableCell>
        <TableCell align='center'>-</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <CollapsableContent row={row} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <ImagePreview open={open1} setOpen={setOpen1} />
    </React.Fragment>
  )
}
interface pagination {
  include?: string
  perPage?: number
  page?: number
}

export default function TeamMembers() {
  const store = useSelector((state: any) => state)

  // const [filteredData, setfilteredData] = React.useState([])
  // const [filter, setfilter] = React.useState('')
  // const [sortBy, setsortBy] = React.useState('')
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    call()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const handleFilterChange = (event: { target: { value: React.SetStateAction<string> } }) => {
  //   setfilter(event.target.value)
  // }

  // const handleSortChange = (event: { target: { value: React.SetStateAction<string> } }) => {
  //   setsortBy(event.target.value)
  // }

  const handleSearch = debounce((val: string) => {
    dispatch(setSearch(val))
    call()
  }, 400)

  const call = (page = 1) => {
    const payload: pagination = {
      include: 'company,business,userDetails,projects',
      perPage: 10,
      page: 1
    }
    if (page) {
      payload.page = page
    }
    dispatch(
      getTeamMember({
        partnerId: store?.user?.singleData?.userDetails?.id,
        data: payload
      })
    )
  }

  const handleChangePage = (e: any, page: number) => {
    call(page + 1)
  }

  return (
    <TableContainer component={Paper}>
      <Grid container spacing={4}>
        <Grid item md={8}>
          <QuickSearchToolbar
            clearSearch={() => {
              handleSearch('')
            }}
            isTeamMember='Search by id, name'
            onChange={(e: any) => {
              handleSearch(e.target.value)
            }}
            isNotDataGrid={true}
          />
        </Grid>
      </Grid>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>More</TableCell>
            <TableCell align='center'>TM ID</TableCell>
            <TableCell align='center'>Image</TableCell>
            <TableCell align='center'>Team Member Name</TableCell>
            <TableCell align='center'>Email</TableCell>
            <TableCell align='center'>Phone Number</TableCell>
            <TableCell align='center'>Status</TableCell>
            {/* <TableCell align='center'>Amount Spend</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody
          style={{
            height: 'auto',
            position: 'relative'
          }}
        >
          {store.teammember?.loading ? (
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
          ) : store.teammember?.data?.length > 0 ? (
            <>
              {store.teammember?.data.map((row: any) => (
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
                  No Team Member Found
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component='div'
        count={store.teammember?.pagination?.total || 0}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
        page={store.teammember?.pagination?.currentPage ? store.teammember?.pagination?.currentPage - 1 : 0}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  )
}

const CollapsableContent = ({ row }: any) => {
  const [moreProjectopen, setMoreProjectopen] = React.useState(false)
  const handleMoreProjectClose = () => {
    setMoreProjectopen(false)
  }
  const handleMoreProjectOpen = () => {
    setMoreProjectopen(true)
  }

  const valueIcon: any = {
    Linkedin: (
      <Linkedin
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Twitter: (
      <Twitter
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Youtube: (
      <Youtube
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Instagram: (
      <Instagram
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Website: (
      <GoogleChrome
        style={{
          fontSize: '35px'
        }}
      />
    ),
    Others: (
      <MicrosoftEdge
        style={{
          fontSize: '35px'
        }}
      />
    )
  }

  return (
    <Grid container spacing={8} sx={{ py: 8 }}>
      <Grid item xs={3}>
        <Typography variant='body1'>Projects associated</Typography>
      </Grid>
      <Grid item xs={9}>
        {row?.projects?.length ? (
          <Stack spacing={4} direction='row'>
            {row?.projects?.slice(0, 3).map((item: any) => (
              <Chip key={item.id} size='medium' label={item?.property?.name} />
            ))}
            {row?.projects?.length > 3 && (
              <Chip clickable size='medium' onClick={handleMoreProjectOpen} label={`+${row.projects.length - 3}`} />
            )}
          </Stack>
        ) : (
          <Typography variant='body1'>
            <i>None</i>
          </Typography>
        )}
      </Grid>
      <Grid item xs={3}>
        <Typography variant='body1'>Address</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1'>{row?.userDetails?.address?.address || <i>Not Filled</i>}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='body1'>Country</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1'>{row?.userDetails?.address?.country?.name || <i>Not Filled</i>}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='body1'>City</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1'>{row?.userDetails?.address?.city?.name || <i>Not Filled</i>}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='body1'>State</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1'>{row?.userDetails?.address?.state?.name || <i>Not Filled</i>}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='body1'>Pincode</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1'>{row?.userDetails?.address?.pincode || <i>Not Filled</i>}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='body1'>Date Of Joining</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1'>{row?.userDetails?.address?.pincode || <i>Not Filled</i>}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='body1'>PAN Number</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1'>
          {row?.panCertificates?.length > 0 ? row?.panCertificates[0]?.verificationNumber : <i>Not Filled</i>}
        </Typography>
      </Grid>
      {/* <Grid item xs={3}>
        <Typography variant='body1'>Aadhar Number</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant='body1'>{row?.panCertificates[0]?.verificationNumber || <i>Not Filled</i>}</Typography>
      </Grid> */}

      <Grid item xs={3}>
        <Typography variant='body1'>Social links</Typography>
      </Grid>
      <Grid item xs={9}>
        {row?.userDetails?.meta?.socialLinks?.length ? (
          <Stack spacing={4} direction='row'>
            {row?.userDetails?.meta?.socialLinks?.map((item: any) => (
              <a
                key={item?.link}
                href={item?.link.includes('http') || item?.link.includes('https') ? item?.link : `http://${item?.link}`}
                target='_blank'
                rel='noreferrer'
              >
                <Card>
                  <div>
                    <IconButton size='small'>{valueIcon[item?.type]}</IconButton>
                  </div>
                </Card>
              </a>
            ))}
          </Stack>
        ) : (
          <Typography variant='body1'>
            <i>Not Filled</i>
          </Typography>
        )}
      </Grid>
      <Grid item xs={6}>
        <NextLink href={`/team-members/profile/${row?.id}`}>
          <Button color='inherit' variant='outlined'>
            View Profile
          </Button>
        </NextLink>
      </Grid>
      <MoreProjectDialog open={moreProjectopen} handleClose={handleMoreProjectClose} data={row} />
    </Grid>
  )
}
