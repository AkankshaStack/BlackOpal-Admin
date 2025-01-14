// Autocomplete.js
import React, { Component } from 'react'
import styled from 'styled-components'


const Wrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
`

class AutoComplete extends Component {
  constructor(props) {
    super(props)
    this.clearSearchBox = this.clearSearchBox.bind(this)
  }

  componentDidMount({ map, mapApi } = this.props) {
    const options = {
      // restrict your search to a specific type of result
      types: [],

      // restrict your search to a specific country, or an array of countries
      // componentRestrictions: { country: ['gb', 'us'] },
    }
    this.autoComplete = new mapApi.places.Autocomplete(this.searchInput, options)
    this.autoComplete.addListener('place_changed', this.onPlaceChanged)
    this.autoComplete.bindTo('bounds', map)
  }

  componentWillUnmount({ mapApi } = this.props) {
    mapApi.event.clearInstanceListeners(this.searchInput)
  }

  onPlaceChanged = ({ map, addplace } = this.props) => {
    const place = this.autoComplete.getPlace()

    if (!place.geometry) return
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport)
    } else {
      map.setCenter(place.geometry.location)
      map.setZoom(17)
    }

    addplace(place)
    this.searchInput.blur()

  }

  clearSearchBox() {
    if (this?.searchInput) {
      
      this.searchInput.value = ''
    }
  }

  render() {
    {this.props.clearSearch && this.clearSearchBox() }

    return (
      <Wrapper>
        <input
          id="search_input"
          className="search_box"
          ref={(ref) => {
            this.searchInput = ref
          }}
          type="text"
          onFocus={this.clearSearchBox}
          placeholder="Search a location"
        />
      </Wrapper>
    )
  }
}

export default AutoComplete
