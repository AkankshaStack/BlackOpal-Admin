// ** MUI Imports
import MuiChip from '@mui/material/Chip'

// ** Types
import { CustomChipProps } from './types'

// ** Hooks Imports
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'
import { Typography } from '@mui/material'

const Chip = (props: CustomChipProps) => {
  // ** Props
  const { sx, skin, color, label } = props

  // ** Hook
  const bgColors = useBgColor()

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight },
    default: { ...bgColors.infoLight }
  }

  return (
    <>
      {label ? (
        <MuiChip
          {...props}
          style={{ marginTop: '5px' }}
          variant='outlined'
          size='medium'
          {...(skin === 'light' && { className: 'MuiChip-light' })}
          sx={skin === 'light' && color ? Object?.assign(colors[color], sx) : sx}
        />
      ) : (
        <Typography sx={{ fontWeight: 600, fontStyle: 'italic' }} variant='subtitle1'>
          Not Available
        </Typography>
      )}
    </>
  )
}

export default Chip
