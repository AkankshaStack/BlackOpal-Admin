/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import { Theme } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ToggleButton from '@mui/material/ToggleButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// ** Icons Imports
import ContentCopy from 'mdi-material-ui/ContentCopy'
import LanguageJavascript from 'mdi-material-ui/LanguageJavascript'
import LanguageTypescript from 'mdi-material-ui/LanguageTypescript'

// ** Third Party Components
import Prism from 'prismjs'
import toast from 'react-hot-toast'

// ** Types
import { CardSnippetProps } from './types'

// ** Hooks
import useClipboard from 'src/@core/hooks/useClipboard'

const CardSnippet = (props: CardSnippetProps) => {
  // ** Props
  const { id, sx, code, title, children, className, action } = props

  // ** States
  const [showCode, setShowCode] = useState<boolean>(false)

  // ** Hooks
  const clipboard = useClipboard()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  // ** Highlight code on mount

  return (
    <Card
      className={className}
      sx={{ '& .MuiCardHeader-action': { lineHeight: 0.8 }, ...sx }}
      id={id || `card-snippet--${title?.toLowerCase().replace(/ /g, '-')}`}
    >
      <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} action={action} />
      <CardContent>{children}</CardContent>
      {hidden ? null : (
        <Collapse in={showCode}>
          <Divider sx={{ my: 0 }} />

          <CardContent sx={{ position: 'relative', '& pre': { m: '0 !important', maxHeight: 500 } }}>
            <Tooltip title='Copy the source' placement='top'>
              <IconButton
                sx={{
                  top: '5rem',
                  right: '2.5625rem',
                  position: 'absolute',
                  color: theme => theme.palette.grey[100]
                }}
              >
                <ContentCopy fontSize='small' />
              </IconButton>
            </Tooltip>
          </CardContent>
        </Collapse>
      )}
    </Card>
  )
}

export default CardSnippet
