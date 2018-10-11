import throttle from 'lodash/throttle'
import React    from 'react'
import Config   from 'react-native-config'
import Meteor   from 'react-native-meteor'
import { Alert, AsyncStorage, PermissionsAndroid } from 'react-native'
const Geolocation = navigator.geolocation

// const LYON = [4.8351, 45.7578]
const LYON = [4.81797, 45.73257]
const DEFAULT_FAKE_MODE = !Config.PRODUCTION
const FAKE_MODE_STORAGE_ID = '@map:fakeMode'
const LOCATION_STORAGE_ID = '@map:location'

export default function withLocation(Component) {
  return class UserLocation extends React.Component {
    fakeLocation = [...LYON]
    state = {
      accuracy: null,
      fakeMode: DEFAULT_FAKE_MODE,
      location: [...LYON],
    }
    async componentDidMount() {
      AsyncStorage.getItem(LOCATION_STORAGE_ID)
        .then((value) => {
          const [lon, lat] = JSON.parse(value) || []
          if(lat && lon) {
            this.setLocation([lon, lat])
            if(this.state.fakeMode) {
              this.fakeLocation = [lon, lat]
            }
          }
        })
      await this.requestGeolocationPermission()
      AsyncStorage.getItem(FAKE_MODE_STORAGE_ID)
        .then((_value) => {
          const value = JSON.parse(_value)
          if(this.state.fakeMode) {
            this.fakeLocation = this.state.location
          }
          this.setFakeMode(value != null ? value : DEFAULT_FAKE_MODE)
        })
    }
    render() {
      const {accuracy, fakeMode, location} = this.state
      return (
        <Component
          {...this.props}
          fakeMode={fakeMode}
          location={location}
          locationAccuracy={accuracy}
          setFakeLocation={this.setFakeLocation}
          setFakeMode={this.setFakeMode}
        />
      )
    }
    requestGeolocationPermission = async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': "Autorisation d'accès à la localisation",
              'message': 'Nous autorises-tu à accéder à ta localisation ?'
            }
          )
          if(granted !== true && granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission not granted. The application may not work properly")
            reject()
          } else {
            resolve()
          }
        } catch (err) {
          console.warn(err)
          reject()
        }
      })
    }
    savePosition = throttle(_savePosition, 60 * 1000)
    setFakeLocation = (location) => {
      this.fakeLocation = location
      if(this.state.fakeMode) {
        this.setLocation(location)
      }
    }
    setFakeMode = (fakeMode) => {
      this.setState({fakeMode})
      AsyncStorage.setItem(FAKE_MODE_STORAGE_ID, JSON.stringify(fakeMode))
      if(fakeMode) {
        this.stopWatchingPosition()
        this.setState({location: this.fakeLocation})
      } else {
        this.watchPosition()
      }
    }
    setLocation = (location, accuracy = null) => {
      console.log("setLocation", location, accuracy)
      this.setState({ accuracy, location})
      AsyncStorage.setItem(LOCATION_STORAGE_ID, JSON.stringify(location))
      this.savePosition({ accuracy, location })
    }
    stopWatchingPosition = () => {
      if(typeof this.watchId === 'undefined') return
      Geolocation.clearWatch(this.watchId)
      Geolocation.stopObserving()
    }
    watchPosition = () => {
      console.log("watching")
      const options = {
        distanceFilter: 5,
        enableHighAccuracy: true,
      }
      Geolocation.getCurrentPosition(
        this.watchPositionSuccess,
        this.watchPositionError,
        {...options, timeout: 5000}
      )
      this.watchId = Geolocation.watchPosition(
        this.watchPositionSuccess,
        this.watchPositionError,
        {...options, maximumAge: 1000}
      )
    }
    watchPositionSuccess = ({ coords: { accuracy, longitude, latitude }}) => {
      console.log("watch result")
      this.setLocation([longitude, latitude], accuracy)
    }
    watchPositionError = (err) => console.log("geolocation error", err)
  }
}

function _savePosition({location}) {
  const userId = Meteor.userId()
  console.log("savePosition", userId, location)
  Meteor.collection('users').update(userId, {$set: {
    location: {coordinates: location}
  }})
}
