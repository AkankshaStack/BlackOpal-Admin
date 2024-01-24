// ** React Imports
import { ReactNode, useEffect } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports
import { Card, CardActionArea, CardContent, CircularProgress, Tooltip } from '@mui/material'
import { AppDispatch, RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { fetchNotification, postNotification, setnotificationData } from 'src/store/settings/tnc'
import { useSelector } from 'react-redux'
import { getDateDiff, navigateUrl } from 'src/utilities/conversions'
import moment from 'moment'
import config from 'src/configs/config'

import { Close } from 'mdi-material-ui'
import Header from 'src/views/components/header'
import { useRouter } from 'next/router'

// import { CustomAvatarProps } from 'src/@core/components/mui/avatar/types'

// ** Styled Menu component

const PerfectScrollbar = styled(PerfectScrollbarComponent)({})

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

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
const ScrollWrapper = ({ children, call, store }: { children: ReactNode; call: () => void; store: any }) => {
  return (
    <PerfectScrollbar
      options={{ wheelPropagation: false }}
      style={{ touchAction: 'none' }}
      onYReachEnd={() => {
        if (
          !store?.notifiactionLoading &&
          store?.notifiactionPgination?.currentPage < store?.notifiactionPgination?.totalPages
        ) {
          call()
        }
      }}
    >
      {children}
    </PerfectScrollbar>
  )
}
const NotificationDropdown = () => {
  useEffect(() => {
    call()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const call = () => {
    dispatch(
      fetchNotification({
        page: store?.notifiactionPgination?.currentPage ? store?.notifiactionPgination?.currentPage + 1 : 1,
        perPage: 15
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
  }

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.tnc)
  const router = useRouter()

  // ** States

  // ** Vars

  const handleDropdownClose = (type: string) => {
    router.push(navigateUrl(type))
  }

  return (
    <Card>
      <Header name='Notifications' />
      <CardContent sx={{ height: '80vh', overflowY: 'scroll' }}>
        <ScrollWrapper call={call} store={store}>
          <div>
            {store?.notifiactionLoading ? (
              <Box
                sx={{ height: '70vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <CircularProgress />
              </Box>
            ) : store?.notificationData?.length === 0 ? (
              <Box
                sx={{ height: '70vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                No Notification Found
              </Box>
            ) : (
              store?.notificationData?.map((data: any, index: number) => (
                <MenuItem key={`${data?.id}_${index}`}>
                  <Box sx={{ width: '100%', display: 'flex' }}>
                    <CardActionArea
                      onClick={() => {
                        handleDropdownClose(data?.type)
                      }}
                      sx={{ width: '100%', p: 0, display: 'block' }}
                    >
                      <Tooltip title={data?.body?.title}>
                        <MenuItemTitle noWrap sx={{ width: '100%' }}>
                          {data?.body?.title}
                        </MenuItemTitle>
                      </Tooltip>
                      <Tooltip title={data?.body?.description}>
                        <MenuItemSubtitle variant='body2' noWrap>
                          {data?.body?.description}
                        </MenuItemSubtitle>
                      </Tooltip>
                    </CardActionArea>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <IconButton
                        onClick={() => {
                          const data2 = [...store?.notificationData]
                          data2.splice(index, 1)
                          dispatch(
                            setnotificationData({
                              index: data2
                            })
                          )
                          dispatch(
                            postNotification({
                              id: data?.id,
                              status: config?.notifications?.status?.deleted
                            })
                          )
                        }}
                      >
                        <Close />
                      </IconButton>
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        {getDateDiff(data?.createdAt, new Date(), 'days') === 0
                          ? 'Today'
                          : getDateDiff(data?.createdAt, new Date(), 'days') === 1
                          ? 'Yesterday'
                          : moment(data?.createdAt).format('DD MMM')}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            )}
          </div>
        </ScrollWrapper>
      </CardContent>
    </Card>
  )
}

export default NotificationDropdown
