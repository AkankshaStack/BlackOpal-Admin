import { LoadingButton } from '@mui/lab'
import Box from '@mui/material/Box'
import { useState, Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NearbyPlaceData } from 'src/context/types'
import NearBy from 'src/pages/project/edit/nearbyplaces/map/NearBy'
import AutoCompleteLocationType from '../autoCompleteLocationType/AutoCompleteLocationType'
import NearbyLocationList from '../nearbyLocationList/NearbyLocationList'

const NearbyPlaces = () => {
  const [nearLocationCoordinates, setnearLocationCoordinates] = useState<Array<NearbyPlaceData>>([])
  const [selectedType, setselectedType] = useState<string>('')
  const [selectedLocations, setselectedLocations] = useState<Array<NearbyPlaceData>>([])
  const [isMapDataFetching, setisMapDataFetching] = useState(false)

  // const [loading, setloading] = useState(false)
  const store = useSelector((state: any) => state.property)

  const handleAddLocation = (results: Array<any>) => {
    setnearLocationCoordinates(results)
  }

  useEffect(() => {
    setnearLocationCoordinates(store.data.nearbyBusiness)
    setselectedLocations(store.data.nearbyBusiness)
  }, [store?.data?.nearbyBusiness])

  const handleSelectAll = () => {
    setselectedLocations(prev => {
      const data = nearLocationCoordinates?.filter(item => {
        const sample = prev?.filter(selected => selected.place_id === item.place_id)
        if (sample.length > 0) {
          return false
        } else {
          return true
        }
      })

      return [...prev, ...data]
    })
  }
  const handleUnselectAll = () => {
    setselectedLocations(prev => {
      const data = prev.filter(selected => {
        const sample = nearLocationCoordinates.some(item => selected.place_id === item.place_id)

        return !sample
      })

      return [...data]
    })
  }

  const isSelectedAll = () => {
    const data = nearLocationCoordinates?.filter(item => {
      const sample = selectedLocations?.filter(selected => selected!.place_id === item!.place_id)
      if (sample?.length > 0) {
        return false
      } else {
        return true
      }
    })

    if (data?.length > 0) {
      return true
    } else {
      return false
    }
  }

  return (
    <Fragment>
      {store?.data?.coordinates?.length && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '70%', marginRight: '1.5rem' }}>
              <AutoCompleteLocationType setselectedType={setselectedType} />
            </Box>
            <Box sx={{ width: '10rem', height: '100%', my: 'auto' }}>
              {isSelectedAll() ? (
                <LoadingButton
                  onClick={handleSelectAll}
                  variant='contained'
                  fullWidth
                  loading={isMapDataFetching}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Select All
                </LoadingButton>
              ) : (
                <LoadingButton
                  onClick={handleUnselectAll}
                  variant='outlined'
                  fullWidth
                  loading={isMapDataFetching}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Unselect All
                </LoadingButton>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
              maxHeight: 500,
              display: 'flex',
              marginTop: '2rem'
            }}
          >
            <NearBy
              selectedType={selectedType}
              handleAddLocation={handleAddLocation}
              nearLocationCoordinates={nearLocationCoordinates}
              coordinates={store?.data?.coordinates}
              setisMapDataFetching={setisMapDataFetching}
              selectedPlaceIds={selectedLocations?.length > 0 ? selectedLocations?.map(item => item.place_id) : []}
            />
            <NearbyLocationList
              nearLocationCoordinates={nearLocationCoordinates}
              selectedType={selectedType}
              setselectedLocations={setselectedLocations}
              selectedLocations={selectedLocations || []}
              setselectedType={setselectedType}
              isMapDataFetching={isMapDataFetching}
            />
          </Box>
        </Box>
      )}
    </Fragment>
  )
}

export default NearbyPlaces
