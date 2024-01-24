// ** MUI Imports
import Box from '@mui/material/Box'
import { Direction } from '@mui/material'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import CardUser from 'src/views/ui/cards/basic/CardUser'

const CardSwiper = ({ direction }: { direction: Direction }) => {
  // ** Hook
  const [ref] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    slides: {
      perView: 2
    },
    breakpoints: {
      '(min-width: 260px) and (max-width:700px)': {
        slides: { perView: 1 }
      },
      '(min-width: 768px) and (max-width:961)': {
        slides: { perView: 2 }
      },
      '(min-width: 962) and (max-width:1023px)': {
        slides: { perView: 3 }
      },
      '(min-width: 1024px)': {
        slides: { perView: 3 }
      },
      '(min-width: 1500px)': {
        slides: { perView: 4 }
      }
    }
  })

  return (
    <Box ref={ref} className='keen-slider'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(each => (
        <Box className='keen-slider__slide' key={each}>
          <CardUser />
        </Box>
      ))}
    </Box>
  )
}

export default CardSwiper
