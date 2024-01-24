import { useState, useRef, Fragment, FC } from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Typography from '@mui/material/Typography'
import { DotsVertical } from 'mdi-material-ui'
import { Tooltip } from '@mui/material'
import { options } from 'src/common/types'

export interface IMultiButtonProps {
  options: options
}

const MultiButton: FC<IMultiButtonProps> = ({ options }) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<any>(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: any) => {
    if (anchorRef?.current && anchorRef?.current?.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <Fragment>
      {options.length > 1 ? (
        <>
          <ButtonGroup
            sx={{ boxShadow: 'none' }}
            variant='outlined'
            ref={anchorRef}
            aria-label='split button'
            color='secondary'
          >
            <Tooltip title={options[0].tooltipLabel}>
              <Button size='small' variant='outlined' onClick={options[0].onClick} startIcon={options[0].icon}>
                <Typography variant='inherit' sx={{ textTransform: 'capitalize' }}>
                  {options[0].label}
                </Typography>
              </Button>
            </Tooltip>
            <Button
              variant='outlined'
              size='small'
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label='select merge strategy'
              aria-haspopup='menu'
              onClick={handleToggle}
              style={{ padding: '0.25rem 0.5rem', minWidth: 'unset' }}
            >
              <DotsVertical sx={{ fontSize: '1rem', width: 'auto' }} />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1000
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                  zIndex: 1000
                }}
              >
                <Paper
                  sx={{
                    zIndex: 1000
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <ButtonGroup orientation='vertical' fullWidth color='secondary'>
                      {options.length
                        ? options.slice(1).map((option, index) => (
                            <Tooltip title={option.tooltipLabel || ''} key={index}>
                              <Button size='medium' onClick={option.onClick} startIcon={option.icon}>
                                <Typography
                                  variant='inherit'
                                  sx={{ textTransform: 'capitalize' }}
                                  color={option?.color ? option?.color : 'inherit'}
                                >
                                  {option.label}
                                </Typography>
                              </Button>
                            </Tooltip>
                          ))
                        : []}
                    </ButtonGroup>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </>
      ) : (
        <Button
          color='secondary'
          size='small'
          variant='outlined'
          onClick={options[0].onClick}
          startIcon={options[0].icon}
          sx={{ width: '80%' }}
        >
          <Typography variant='inherit' sx={{ textTransform: 'capitalize' }}>
            {options[0].label}
          </Typography>
        </Button>
      )}
    </Fragment>
  )
}

export default MultiButton
