import { Box, Typography } from '@mui/material'
import { FC, useState } from 'react'

interface IMapPointerProps {
  src: string
  label?: string
  businessType?: number
}

const MapPointer: FC<IMapPointerProps> = ({ src = MapSource.NEAR_BY_LOCATION, label, businessType }) => {
  const [isLableVisible, setisLableVisible] = useState(false)

  const handleLableShow = () => {
    setisLableVisible(true)
  }
  const handleLableHide = () => {
    setisLableVisible(false)
  }

  const selectedLocation = [
    '/images/icons/map/school-sign-blue.svg',
    '/images/icons/map/mall-sign-blue.svg',
    '/images/icons/map/hospital-sign-blue.svg',
    '/images/icons/map/store-sign-blue.svg',
    '/images/icons/map/atm-sign-blue.svg',
    '/images/icons/map/airport-blue.svg',
    '/images/icons/map/bus-station-blue.svg',
    '/images/icons/map/metro-blue.svg',
    '/images/icons/map/police-blue.svg',
    '/images/icons/map/park-blue.svg'
  ]
  const displayedLocation = [
    '/images/icons/map/school-sign.svg',
    '/images/icons/map/mall-sign.svg',
    '/images/icons/map/hospital-sign.svg',
    '/images/icons/map/store-sign.svg',
    '/images/icons/map/atm-sign.svg',
    '/images/icons/map/airport-red.svg',
    '/images/icons/map/bus-station-red.svg',
    '/images/icons/map/metro-red.svg',
    '/images/icons/map/police-red.svg',
    '/images/icons/map/park-red.svg'
  ]

  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      <img
        src={
          !!!businessType
            ? '/images/icons/map/location-sign.svg'
            : src === MapSource.SELECTED_LOCATION
            ? selectedLocation[businessType - 1] || '/images/icons/map/location-sign-blue.svg'
            : displayedLocation[businessType - 1] || '/images/icons/map/location-sign.svg'
        }
        width={40}
        height={40}
        alt='Marker'
        onMouseEnter={handleLableShow}
        onMouseLeave={handleLableHide}
      />
      {isLableVisible && label && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: 'white',
            width: 'fit-content',
            borderRadius: '5px',
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5
          }}
        >
          <Typography noWrap variant='subtitle2'>
            {label}
          </Typography>
        </Box>
      )}
      {src === MapSource.CURRENT_LOCATION && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: 'white',
            width: 'fit-content',
            borderRadius: '5px',
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <Typography noWrap variant='subtitle2'>
            Your location
          </Typography>
        </Box>
      )}
    </div>
  )
}

export default MapPointer

export enum MapSource {
  CURRENT_LOCATION = 'currect_location',
  NEAR_BY_LOCATION = 'nearby_location',
  SELECTED_LOCATION = 'selected_location'
}
