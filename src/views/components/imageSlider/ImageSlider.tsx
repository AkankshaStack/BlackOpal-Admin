// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Direction } from '@mui/material'

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import ReactPlayer from 'react-player'

const ImageSlider = ({
  direction,
  images,
  isVideo
}: {
  direction: Direction
  images: Array<any>
  isVideo?: boolean
}) => {
  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    slides: {
      perView: 1,
      spacing: 0
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
          {images?.map(each => (
            <Box
              sx={{
                display: isVideo ? 'block' : 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className='keen-slider__slide'
              key={each}
            >
              {isVideo ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px' }}>
                  <ReactPlayer url={each} width='90%' height='250px' style={{ alignSelf: 'center' }} controls />
                </div>
              ) : (
                <Box
                  component='img'
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${each}`}
                  alt='Property Image'
                  sx={{ mr: 5, width: '100%', height: '300px', maxHeight: '300px', objectFit: 'contain' }}
                />
              )}
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
                'arrow-disabled': currentSlide === instanceRef?.current?.track?.details?.slides?.length - 1
              })}
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
            />
          </>
        )}
      </Box>
    </>
  )
}

export default ImageSlider
