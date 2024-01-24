/* eslint-disable */
import React, { Component } from 'react'

import GoogleMapReact from 'google-map-react'

import styled from 'styled-components'

import AutoComplete from './AutoComplete'
import Marker from './Marker'
import { FormControl, FormHelperText, Grid, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
const Wrapper = styled.main`
  width: 100%;
  height: 450px;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
}
`

class MyGoogleMap extends Component {
  state = {
    mapApiLoaded: false,
    mapInstance: null,
    mapApi: null,
    geoCoder: null,
    places: [],
    center: [],
    zoom: 7,
    address: '',
    draggable: true,
    lat: null,
    lng: null,
    clearSearch: false
  }

  componentWillMount() {
    const { id } = this.props
    if (id === 'new') {
      this.setCurrentLocation()
    } else {
      this.setDefaultLocation()
    }
  }

  componentDidMount() {
    const { value, id } = this.props
    if (value && id !== 'new') {
      this.setDefaultLocation()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, addMarker } = this.props
    if (prevState.lat !== this.state.lat || prevState.lng !== this.state.lng) {
      addMarker(this.state.lat, this.state.lng)
    }

    if (prevProps.value?.lat != value?.lat || prevProps.value?.lng != value?.lng) {
      this.setDefaultLocation()
    }
  }

  onMarkerInteraction = (childKey, childProps, mouse) => {
    this.setState({
      draggable: false,
      lat: mouse.lat,
      lng: mouse.lng
    })
  }

  onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
    this.setState({ draggable: true })
    this._generateAddress()
  }

  _onChange = ({ center, zoom }) => {
    this.setState({
      center: center,
      zoom: zoom
    })
  }

  _onClick = value => {
    this.setState({
      lat: value.lat,
      lng: value.lng,
      clearSearch: true
    })
  }

  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    })

    this._generateAddress()
  }

  addPlace = place => {
    this.setState({
      places: [place],
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      clearSearch: false
    })
    this._generateAddress()
  }

  _generateAddress() {
    const { mapApi } = this.state
    const geocoder = mapApi && new mapApi.Geocoder()
    if (geocoder) {
      geocoder.geocode({ location: { lat: this.state.lat, lng: this.state.lng } }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 10
            this.setState({ address: results[0].formatted_address })
          } else {
            window.alert('No results found')
          }
        } else {
          window.alert('Geocoder failed due to: ' + status)
        }
      })
    }
  }

  // Get Current Location Coordinates
  setCurrentLocation() {
    const { value } = this.props
    if (!value) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          this.setState({
            center: [position.coords.latitude, position.coords.longitude],
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        })
      }
    }
  }

  setDefaultLocation() {
    const { value } = this.props
    if (value) {
      this.setState({
        center: [value.lat, value.lng],
        lat: value.lat,
        lng: value.lng,
        zoom: 10
      })
    }
  }

  render() {
    const { places, mapApiLoaded, mapInstance, mapApi } = this.state

    return (
      <Wrapper>
        {mapApiLoaded && (
          <div className='auto_complete'>
            <AutoComplete
              id='auto-complete'
              map={mapInstance}
              mapApi={mapApi}
              clearSearch={this.state.clearSearch}
              addplace={this.addPlace}
            />
          </div>
        )}
        <Grid item container spacing={6} xs={12} sm={12} style={{ marginBottom: '30px' }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='lat'
                control={this.props.control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Latitude'
                    required
                    type={'number'}
                    onChange={e => {
                      onChange(e)
                      const { lat, lng } = getValues()
                      setLocation({ lat: Number(lat), lng: Number(lng) })
                      dispatch(resetFormErors('lat'))
                    }}
                    InputLabelProps={{ shrink: true }}
                    aria-describedby='validation-basic-lat'
                  />
                )}
              />
              {(this.props.errors.lat || this.props.formErrors?.lat) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-lat'>
                  {errors?.lat?.message || formErrors?.lat}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='lng'
                control={this.props.control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Longitude'
                    type={'number'}
                    required
                    InputLabelProps={{ shrink: true }}
                    onChange={e => {
                      onChange(e)
                      const { lat, lng } = getValues()
                      setLocation({ lat, lng })
                      dispatch(resetFormErors('lng'))
                    }}
                    aria-describedby='validation-basic-lng'
                  />
                )}
              />
              {(this.props.errors.lng || this.props.formErrors?.lng) && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-textarea'>
                  {errors?.lng?.message || formErrors?.lng}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <GoogleMapReact
          center={this.state.center}
          zoom={this.state.zoom}
          draggable={this.state.draggable}
          options={maps => ({
            zoomControl: true,
            zoomControlOptions: {
              position: maps.ControlPosition.TOP_RIGHT
            }
          })}
          onChange={this._onChange}
          onChildMouseDown={this.onMarkerInteraction}
          onChildMouseUp={this.onMarkerInteractionMouseUp}
          onChildMouseMove={this.onMarkerInteraction}
          onChildClick={() => 1 + 1}
          onClick={this._onClick}
          bootstrapURLKeys={{
            key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
            libraries: ['places', 'geometry']
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
        >
          <Marker text={this.state.address} lat={this.state.lat} lng={this.state.lng} />
        </GoogleMapReact>
      </Wrapper>
    )
  }
}

export default MyGoogleMap
