// ** MUI Imports
import Box from '@mui/material/Box'
import { Direction } from '@mui/material'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import CardUser from 'src/views/ui/cards/basic/CardUser'

const SwiperSpacing = ({ direction }: { direction: Direction }) => {
  // ** Hook
  const [ref] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    slides: {
      perView: 2,
      spacing: 16
    }
  })

  return (
    <Box ref={ref} className='keen-slider'>
      <Box className='keen-slider__slide'>
        <CardUser />
      </Box>
      <Box className='keen-slider__slide'>
        <CardUser />{' '}
      </Box>
      <Box className='keen-slider__slide'>
        <CardUser />{' '}
      </Box>
      <Box className='keen-slider__slide'>
        <CardUser />{' '}
      </Box>
      <Box className='keen-slider__slide'>
        <CardUser />{' '}
      </Box>
    </Box>
  )
}

export default SwiperSpacing
