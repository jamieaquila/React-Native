import MapboxGL     from '@mapbox/react-native-mapbox-gl'
import React        from 'react'

export default function VenuesLayer({cities, countries, displayCities, displayCountries}){
  //console.log(cities, countries, displayCities, displayCountries)
  const citiesGeoObj = {
    type: 'FeatureCollection',
    features: (
      !displayCities || !cities ?
        [] :
        cities.map(city => ({
          type: 'Feature',
          id:   city._id,
          geometry: {
            type: 'Point',
            coordinates: city.location.coordinates,
          },
          properties: {
            ...city,
          },
        }))
    )
  }
  const countriesGeoObj = {
    type: 'FeatureCollection',
    features: (
      !displayCountries || !countries ?
        [] :
        countries.map(country => ({
          type: 'Feature',
          id:   country._id,
          geometry: {
            type: 'Point',
            coordinates: country.location.coordinates,
          },
          properties: {
            ...country,
          },
        }))
    )
  }
  // cluster
  // clusterRadius={50}
  // clusterMaxZoomLevel={12}
  return [
    <MapboxGL.ShapeSource
      id="cities"
      key="cities"
      shape={citiesGeoObj}>
      <MapboxGL.CircleLayer
        id="citiesPoints"
        belowLayerID="citiesCount"
        style={layerStyles.playerCount}
        filter={['>', 'playerCount', 0]}
      />
      <MapboxGL.SymbolLayer
        id="citiesCount"
        style={layerStyles.playerCountText}
        filter={['>', 'playerCount', 0]}
      />
    </MapboxGL.ShapeSource>,
    <MapboxGL.ShapeSource
      id="countries"
      key="countries"
      shape={countriesGeoObj}>
      <MapboxGL.CircleLayer
        id="countriesPoints"
        belowLayerID="countriesCount"
        style={layerStyles.playerCount}
      />
      <MapboxGL.SymbolLayer
        id="countriesCount"
        style={layerStyles.playerCountText}
      />
    </MapboxGL.ShapeSource>
  ]
}
const layerStyles = MapboxGL.StyleSheet.create({
  playerCount: {
    circleColor: '#69DCC7',
    circleOpacity: 1,
    circleStrokeWidth: 5,
    circleStrokeColor: '#E63B97',
    //circleRadius: 10,
    circleRadius: MapboxGL.StyleSheet.source(
      [[0, 10], [10, 13], [100, 17], [1000, 22]],
      'playerCount',
      MapboxGL.InterpolationMode.Exponential,
    ),
    circlePitchAlignment: 'map',
  },
  playerCountText: {
    textField: '{playerCount}',
    textSize: 16,
    textColor: 'white',
    textPitchAlignment: 'map',
  },
})
