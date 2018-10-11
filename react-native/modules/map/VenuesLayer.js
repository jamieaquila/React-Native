import MapboxGL     from '@mapbox/react-native-mapbox-gl'
import React        from 'react'
import venuePin          from './img/pin.png'
import enterableVenuePin from './img/pin_yellow.png'

export default class VenuesLayer extends React.Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   if(!this.props.venues || !this.props.venues.features) return true
  //   console.log(nextProps.venues.features.length)
  //   if(nextProps.venues.features.length !== this.props.venues.features.length) return true
  //   return false
  // }
  render() {
    const {canEnter, selectVenue, venues} = this.props
    if(!venues) return null
    const enterableVenues = {...venues, features: []}
    const otherVenues = {...venues, features: []}
    venues.features.forEach(venue => {
      if(canEnter(venue.geometry.coordinates)) {
        enterableVenues.features.push(venue)
      } else {
        otherVenues.features.push(venue)
      }
    })
    return [
      <MapboxGL.ShapeSource
        id="venues"
        key="venues"
        shape={otherVenues}
        images={{ venuePin, assets: ['pin'] }}
        onPress={(event) => selectVenue(event.nativeEvent.payload)}>

        <MapboxGL.CircleLayer
          id="emptyVenuePoints"
          belowLayerID="venueCount"
          style={layerStyles.emptyVenuePoints}
          filter={['==', 'playerCount', 0]}
        />

        <MapboxGL.SymbolLayer
          id="nonEmptyVenuePoints"
          belowLayerID="venueCount"
          style={layerStyles.nonEmptyVenuePoints}
          filter={['>', 'playerCount', 0]}
        />
      </MapboxGL.ShapeSource>,
      <MapboxGL.ShapeSource
        id="enterableVenues"
        key="enterableVenues"
        shape={enterableVenues}
        images={{ enterableVenuePin, assets: ['pin'] }}
        onPress={(event) => selectVenue(event.nativeEvent.payload)}>
        <MapboxGL.SymbolLayer
          id="enterableVenuePoints"
          belowLayerID="venueCount"
          style={layerStyles.enterableVenuePoints}
        />
      </MapboxGL.ShapeSource>
    ]
  }
}
const layerStyles = MapboxGL.StyleSheet.create({
  emptyVenuePoints: {
    circleColor: '#FFD900',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
    circlePitchAlignment: 'map',
  },
  enterableVenuePoints: {
    iconAllowOverlap: true,
    iconImage: 'enterableVenuePin',
    textField: '{playerCount}',
    textSize: 12,
    textColor: 'white',
    textPitchAlignment: 'map',
    textOffset: [0, -0.5]
  },
  nonEmptyVenuePoints: {
    iconAllowOverlap: true,
    iconImage: 'venuePin',
    textField: '{playerCount}',
    textSize: 12,
    textColor: 'white',
    textPitchAlignment: 'map',
    textOffset: [0, -0.5],
  },
})
