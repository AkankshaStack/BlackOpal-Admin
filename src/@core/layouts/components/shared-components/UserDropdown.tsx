// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import { Lock } from 'mdi-material-ui'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { Tooltip } from '@mui/material'

interface Props {
  settings: Settings
}

// ** Styled Components

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const { logout, user } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Avatar
        alt=''
        onClick={handleDropdownOpen}
        sx={{ width: 40, height: 40, cursor: 'pointer' }}
        src={user?.profilePictureSlug || ''}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                ml: 3,
                alignItems: 'flex-start',
                flexDirection: 'column',
                textTransform: 'capitalize'
              }}
            >
              <Tooltip title={`${user?.firstName || 'Just Homz'} ${user?.lastName || 'Admin'}`} arrow>
                <Typography sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {`${user?.firstName || 'Just Homz'} ${user?.lastName || 'Admin'}`?.length > 15
                    ? `${user?.firstName || 'Just Homz'} ${user?.lastName || 'Admin'}`?.slice(0, 13) + '...'
                    : `${user?.firstName || 'Just Homz'} ${user?.lastName || 'Admin'}`}
                </Typography>
              </Tooltip>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                JustHomz Admin
              </Typography>
            </Box>
          </Box>
        </Box>
        <MenuItem sx={{ py: 2 }} onClick={() => router.push('/reset-password')}>
          <Lock sx={{ mr: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Change Password
        </MenuItem>
        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <LogoutVariant sx={{ mr: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
