// ** React Imports
import { useState } from 'react'
import CardUser from 'src/views/ui/cards/basic/CardUser'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Direction } from '@mui/material'

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

const SwiperControls = ({ direction }: { direction: Direction }) => {
  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    slides: {
      perView: 2,
      spacing: 16
    },
    breakpoints: {
      '(min-width: 260px) and (max-width:700px)': {
        slides: { perView: 1, spacing: 10 }
      },
      '(min-width: 768px) and (max-width:961)': {
        slides: { perView: 2, spacing: 16 }
      },
      '(min-width: 962) and (max-width:1023px)': {
        slides: { perView: 3, spacing: 16 }
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 16 }
      },
      '(min-width: 1500px)': {
        slides: { perView: 4, spacing: 16 }
      }
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    }
  })

  return (
    <>
      <Box className='navigation-wrapper'>
        <Box ref={sliderRef} className='keen-slider'>
          {[1, 2, 3, 4].map(each => (
            <Box className='keen-slider__slide' key={each}>
              <CardUser />
            </Box>
          ))}
        </Box>
        {loaded && instanceRef.current && (
          <>
            <ChevronLeft
              className={clsx('arrow arrow-left', {
                'arrow-disabled': currentSlide === 0
              })}
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
            />

            <ChevronRight
              className={clsx('arrow arrow-right', {
                'arrow-disabled': currentSlide === instanceRef.current.track.details.slides.length - 1
              })}
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
            />
          </>
        )}
      </Box>
    </>
  )
}

export default SwiperControls
