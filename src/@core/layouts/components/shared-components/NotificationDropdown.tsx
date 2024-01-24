// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Custom Components Imports
// import CustomChip from 'src/@core/components/mui/chip'

// import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { Badge, Button, CircularProgress, Tooltip } from '@mui/material'
import { AppDispatch, RootState } from 'src/store'
import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux'
import { getDateDiff, navigateUrl } from 'src/utilities/conversions'
import moment from 'moment'
import config from 'src/configs/config'
import { ERoutes } from 'src/common/routes'
import { useRouter } from 'next/router'
import { fetchNotification, postNotification } from 'src/store/settings/tnc'

// import { CustomAvatarProps } from 'src/@core/components/mui/avatar/types'

interface Props {
  settings: Settings
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 344,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

// ** Styled Avatar component
// const Avatar = styled(CustomAvatar)<CustomAvatarProps>({
//   width: '2.375rem',
//   height: '2.375rem',
//   fontSize: '1.125rem'
// })

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const NotificationDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.tnc)

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const router = useRouter()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    dispatch(
      fetchNotification({
        page: 1,
        perPage: 15,
        singlePage: true
      })
    ).then((res: any) => {
      if (res?.payload?.status === 200) {
        if (res?.payload?.data?.data?.length > 0) {
          if (res?.payload?.data?.data[0]?.status === config?.notifications?.status?.created) {
            dispatch(
              postNotification({
                id: res?.payload?.data?.data[0]?.id,
                status: config?.notifications?.status?.read
              })
            )
          }
        }
      }
    })
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      )
    }
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          badgeContent={store?.unreadNotificationCount || ''}
          color='primary'
          max={999}
          invisible={!store?.unreadNotificationCount}
        >
          <BellOutline />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
          </Box>
        </MenuItem>
        <ScrollWrapper>
          {store?.notifiactionLoading ? (
            <Box
              sx={{ height: '200px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <CircularProgress />
            </Box>
          ) : store?.notificationData?.length === 0 ? (
            <Box
              sx={{ height: '200px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              No notifications found
            </Box>
          ) : (
            store?.notificationData?.map((data: any) => (
              <MenuItem onClick={() => router.push(navigateUrl(data?.type))} key={data?.id}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                    <Tooltip title={data?.body?.title}>
                      <MenuItemTitle>{data?.body?.title}</MenuItemTitle>
                    </Tooltip>
                    <Tooltip title={data?.body?.description}>
                      <MenuItemSubtitle variant='body2'>{data?.body?.description}</MenuItemSubtitle>
                    </Tooltip>
                  </Box>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {getDateDiff(data?.createdAt, new Date(), 'days') === 0
                      ? 'Today'
                      : getDateDiff(data?.createdAt, new Date(), 'days') === 1
                      ? 'Yesterday'
                      : moment(data?.createdAt).format('DD MMM')}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Button
            fullWidth
            variant='contained'
            onClick={() => {
              router.push(ERoutes.NOTIFICATION)
              setAnchorEl(null)
            }}
          >
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
