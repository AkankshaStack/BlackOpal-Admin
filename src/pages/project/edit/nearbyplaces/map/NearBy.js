import Box from '@mui/material/Box'
import GoogleMap from 'google-map-react'
import toast from 'react-hot-toast'
import MapPointer, { MapSource } from 'src/views/components/mapPointer/MapPointer'
import { useEffect, useState } from 'react'
import { typeData } from 'src/views/components/autoCompleteLocationType/AutoCompleteLocationType'

const NearBy = ({
  selectedType,
  handleAddLocation,
  nearLocationCoordinates,
  coordinates,
  setisMapDataFetching,
  selectedPlaceIds
}) => {
  const [map, setmap] = useState()
  const defaultProps = {
    zoom: 15,
    radius: '5000',
    radiusAirport: '50000',
  }

  useEffect(() => {
    if (selectedType) {
      onMapLoad(map)
    }
  }, [map, selectedType])

  const onMapLoad = map => {
    setisMapDataFetching(true)
    const pyrmont = new google.maps.LatLng(Number(coordinates[0]), Number(coordinates[1]))
    
    const request = {
      location: pyrmont,
      radius: selectedType !== 'airport' ? defaultProps.radius : defaultProps.radiusAirport,
      type: selectedType
    }

    const service = new google.maps.places.PlacesService(map)
    service.nearbySearch(request, callback)
  }

  let data = []
  let hitNextPage = true
  function callback(results, status, pagination) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      
      for (let i = 0; i < results.length; i++) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(Number(coordinates[0]), Number(coordinates[1])),
          new google.maps.LatLng(results[i].geometry.location.lat(), results[i].geometry.location.lng())
        )
        let result = {
          businessType: typeFind(results[i].types),
          name: results[i].name,
          distanceInMeters: distance,
          coordinates: [results[i].geometry.location.lat(), results[i].geometry.location.lng()],
          place_id: results[i].place_id
        }
        data.push(result)
      }
      handleAddLocation(data)
      setisMapDataFetching(false)
      if (pagination.hasNextPage && hitNextPage) {
        // hitNextPage= false
        pagination.nextPage(handleNextPageResults)
      }
    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      setisMapDataFetching(false)
      toast.error('No result found')
      handleAddLocation([])
    } else {
      setisMapDataFetching(false)
      toast.error('Something went wrong')
    }
  }
  function handleNextPageResults(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      
      for (let i = 0; i < results.length; i++) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(Number(coordinates[0]), Number(coordinates[1])),
          new google.maps.LatLng(results[i].geometry.location.lat(), results[i].geometry.location.lng())
        )
        let result = {
          businessType: typeFind(results[i].types),
          name: results[i].name,
          distanceInMeters: distance,
          coordinates: [results[i].geometry.location.lat(), results[i].geometry.location.lng()],
          place_id: results[i].place_id
        }
        data.push(result)
      }
    } else {
      toast.error('Something went wrong');
    }
  }

  const typeFind = types => {
    let type
    typeData.forEach(element => {
      if (types.includes(element)) {
        type =
          element === 'school'
            ? 1
            : element === 'shopping_mall'
            ? 2
            : element === 'hospital'
            ? 3
            : element === 'department_store'
            ? 4
            : element === 'atm'
            ? 5
            : element === 'airport'
            ? 6
            : element === 'bus_station'
            ? 7
            : element === 'subway_station'
            ? 8
            : element === 'police'
            ? 9
            : element === 'park'
            ? 10
            : null

        return
      }
    })

    return type
  }

  return (
    <Box
      sx={{
        width: '70%',
        height: 500
      }}
    >
      <GoogleMap
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY }}
        defaultCenter={{
          lat: Number(coordinates[0]),
          lng: Number(coordinates[1])
        }}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => setmap(map)}
      >
        {nearLocationCoordinates?.length &&
          nearLocationCoordinates.map(item => {
            if (selectedPlaceIds.includes(item.place_id)) {
              return (
                <MapPointer
                  src={MapSource.SELECTED_LOCATION}
                  businessType={item.businessType}
                  key={item.place_id}
                  label={item.name}
                  lat={item.coordinates[0]}
                  lng={item.coordinates[1]}
                />
              )
            }

            return (
              <MapPointer
                src={MapSource.NEAR_BY_LOCATION}
                key={item.place_id}
                businessType={item.businessType}
                label={item.name}
                lat={item.coordinates[0]}
                lng={item.coordinates[1]}
              />
            )
          })}
        {coordinates.length && (
          <MapPointer src={MapSource.CURRENT_LOCATION} lat={coordinates[0]} lng={coordinates[1]} />
        )}
      </GoogleMap>
    </Box>
  )
}

export default NearBy
