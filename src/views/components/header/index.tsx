import { FC, ReactNode } from 'react'
import { IconButton, Tooltip, CardHeader, Typography, Box } from '@mui/material'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'mdi-material-ui'

interface IHeaderProps {
  name: string
  subTitle?: string
  action?: ReactNode
}

const Header: FC<IHeaderProps> = props => {
  const router = useRouter()
  const { name, action, subTitle } = props

  return (
    <CardHeader
      title={
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <IconButton
            onClick={() => {
              // @ts-ignore
              if (Object.keys(router?.components)?.length === 2) {
                router.push('/')

                return
              }
              router.back()
            }}
            sx={{
              padding: '4px 0 0 0'
            }}
          >
            <ArrowLeft />
          </IconButton>
          <Box component='div' sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ml: 2 }}>
            <Tooltip title={name}>
              <h4 style={{ margin: 0, alignSelf: 'flex-start' }}>{name}</h4>
            </Tooltip>
            {subTitle ? (
              <Tooltip title={subTitle}>
                <Typography variant='body1' noWrap>
                  {subTitle}
                </Typography>
              </Tooltip>
            ) : null}
          </Box>
        </div>
      }
      action={action ? action : null}
    />
  )
}

export default Header
