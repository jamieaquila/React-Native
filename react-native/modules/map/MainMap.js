import throttle     from 'lodash/throttle'
import MapboxGL     from '@mapbox/react-native-mapbox-gl'
import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import Config       from 'react-native-config'
import KeepAwake    from 'react-native-keep-awake'
import bearing      from '@turf/bearing'
import distance     from '@turf/distance'
import {point}      from '@turf/helpers'
import ChallengeLayer    from '/modules/challenge/ChallengeLayer'
import withLocation      from '/modules/location/withLocation'
import arrowIcon     from './img/arrow.png'
import CountersLayer from './CountersLayer'
import VenuesLayer   from './VenuesLayer'
import VenueDetails  from './VenueDetails'


MapboxGL.setAccessToken(Config.MAPBOX_KEY)

const INITIAL_ZOOM = 18
const VENUE_ZOOM_LEVEL = 14
//const MAP_STYLE_URL = 'mapbox://styles/v1/alfred-gautier/cjlgwfz6904vo2sl9xcv0lwk8'
//const MAP_STYLE_URL = 'mapbox://styles/v1/alfred-gautier/cjko4xtew5mfn2sms4ite5128'
//const MAP_STYLE_URL = 'mapbox://styles/slaivyn/cjla0a8vw2tk52sp69cv031fe'
const MAP_STYLE_URL = MapboxGL.StyleURL.Street

@withLocation
export default class MainMap extends React.Component {
  static propTypes = {
    enterVenue:           PropTypes.func.isRequired,
    fakeMode:             PropTypes.bool.isRequired,
    setFakeMode:          PropTypes.func.isRequired,
    setFakeLocation:      PropTypes.func.isRequired,
    getVisibleVenues:     PropTypes.func.isRequired,
    hideVenues:           PropTypes.func.isRequired,
    challengeDestination: PropTypes.object,
    cities:               PropTypes.array,
    countries:            PropTypes.array,
    mock:                 PropTypes.bool,
    location:             PropTypes.array,
    venues:               PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {
      center:   {...this.props.location},
      zoom:     INITIAL_ZOOM,
    }
  }
  render() {
    const { challengeDestination, cities, countries, fakeMode, mock, setFakeMode, venues } = this.props
    const { zoom } = this.state
    const userLocation = this.props.location
    const userPoint = point(userLocation)
    const challengePoint = challengeDestination && point(challengeDestination.coordinates)
    const remainingDistance = challengePoint && distance(userPoint, challengePoint)
    if(challengeDestination) {
      const size = Math.min(0.05, remainingDistance / 2)
      const arrowSize = Math.min(0.2, Math.max(0.2, size / 0.05) / 2)
      const rotate = 90 + bearing(userPoint, challengePoint)
      userPoint.properties = {
        ...userPoint.properties,
        rotate,
        size: arrowSize,
      }
    }
    const arrowFeatureCollection = {
      type: 'FeatureCollection',
      features: [userPoint]
    }
    return (
      <View style={styles.container}>
        <KeepAwake />
        <MapboxGL.MapView
          ref={ref => this.mapView = ref}
          styleURL={MAP_STYLE_URL}
          pitchEnabled={false} compassEnabled={false} rotateEnabled={false}
          centerCoordinate={userLocation}
          zoomLevel={zoom}
          userLocation={false}
          onRegionDidChange={this.handleRegionDidChange}
          onPress={() => this.handleSelectVenue(null)}
          style={styles.container}
        >
          <MapboxGL.PointAnnotation key="me" id="me" coordinate={userLocation}>
            <View style={styles.meAnnotationContainer}>
              <View style={styles.me} />
            </View>
          </MapboxGL.PointAnnotation>
          <MapboxGL.ShapeSource
            id="arrowShapeSource"
            shape={arrowFeatureCollection}
            images={{ arrow: arrowIcon, assets: ['pin'] }}>
            {challengeDestination &&
              <MapboxGL.SymbolLayer id="arrowSymbol" style={layerStyles.icon} />
            }
          </MapboxGL.ShapeSource>

          <VenuesLayer
            {...{venues, styles}}
            canEnter={this.canEnter}
            selectVenue={this.handleSelectVenue}
          />
          <CountersLayer
            {...{cities, countries}}
            displayCities={zoom < VENUE_ZOOM_LEVEL && zoom > 4}
            displayCountries={zoom <= 4}
          />
        </MapboxGL.MapView>

        {challengeDestination &&
          <ChallengeLayer remainingDistance={remainingDistance} mock={mock} />
        }
        <VenueDetails
          canEnter={this.canEnter}
          enterVenue={this.props.enterVenue}
          venue={this.state.selectedVenue}
        />
        <TouchableOpacity style={styles.fakeModeSwitch} onPress={() => setFakeMode(!fakeMode)}>
          <Text>{fakeMode ? 'Switch to Real Mode' : 'Switch to Fake mode'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  canEnter = ([lon, lat]) => {
    return distance(point([lon, lat]), point(this.props.location)) < 30 / 1000
  }
  getVisibleVenues = throttle(this.props.getVisibleVenues, 2000)
  handleSelectVenue = (venue) => {
    this.setState({selectedVenue: venue})
  }
  handleRegionDidChange = async () => {
    const { setFakeLocation } = this.props
    const zoom = await this.mapView.getZoom()
    const [[e, n], [w, s]] = await this.mapView.getVisibleBounds()
    if(zoom < VENUE_ZOOM_LEVEL) {
      this.props.hideVenues()
    } else {
      this.getVisibleVenues({s, w, n, e})
    }
    const [lon, lat] = await this.mapView.getCenter()
    this.setState({center: [lon, lat], zoom})
    setFakeLocation([lon, lat])
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: '2%',
    borderRadius: 15,
    overflow: 'hidden',
    zIndex: 0
  },
  fakeModeSwitch: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: 'white',
  },
  meAnnotationContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth:3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#E63B97',
  },
  me: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#E63B97',
    borderWidth:3,
    borderColor: 'transparent',
    transform: [{ scale: 0.7 }],
  },
})

const layerStyles = MapboxGL.StyleSheet.create({
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
  icon: {
    iconImage: 'arrow',
    iconRotate: MapboxGL.StyleSheet.identity('rotate'),
    iconSize: 0.3,
    //iconOffset: [594/2,0],
    //iconTranslate: MapboxGL.StyleSheet.identity('offset'),
    //iconAnchor: 'left'
  },
})
