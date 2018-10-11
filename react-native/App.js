import PropTypes              from 'prop-types'
import React                  from 'react'
import { AppState, Platform } from 'react-native'
import Config                 from 'react-native-config'
import Meteor, {Accounts, withTracker} from 'react-native-meteor'
import { NativeRouter, Route, Switch, BackButton, DeepLinking, Redirect } from 'react-router-native'

import Home                from '/modules/base/Home'
import Landing             from '/modules/base/Landing'
import AppBase             from '/modules/base/AppBase'
import Chat                from '/modules/chat/Chat'
import DisplayUniqueCode   from '/modules/challenge/DisplayUniqueCode'
import ScanQRCode          from '/modules/challenge/ScanQRCode'
import InsideVenue         from '/modules/insideVenue/InsideVenue'
import MainMapContainer    from '/modules/map/MainMapContainer'
import NotificationHandler from '/modules/notifications/NotificationHandler'
import OwnProfile          from '/modules/user/ui/OwnProfile'
import SignIn              from '/modules/user/ui/SignIn'
import DevModeChallengeProposition from '/modules/devMode/DevModeChallengeProposition'
import DevModeOutsideChallenge     from '/modules/devMode/DevModeOutsideChallenge'
import DevModeInsideChallenge      from '/modules/devMode/DevModeInsideChallenge'

Meteor.connect(Config.SERVER_URL)
let minAppVersion
const os = Platform.OS
const osVersion = Platform.Version
const osAppVersion = ({android: parseInt(Config.ANDROID_VERSION_CODE, 10)})[os]

@withTracker(() => {
  const user = Meteor.user()
  const handler = Meteor.subscribe('users.me')
  if(!minAppVersion) {
    Meteor.subscribe('core.minAppVersion', os)
    const configs = Meteor.collection('configs').findOne()
    minAppVersion = configs && configs.minAppVersion[os]
  }
  console.log("refresh", osAppVersion, minAppVersion, minAppVersion > osAppVersion)
  return {
    isLoading:   !handler.ready(),
    mustUpgrade: minAppVersion && minAppVersion > osAppVersion,
    user,
  }
})
export default class App extends React.PureComponent {
  static propTypes = {
    isLoading:   PropTypes.bool.isRequired,
    mustUpgrade: PropTypes.bool,
    user:        PropTypes.object,
  }
  appState = AppState.currentState
  state = {minLoadTime: false}

  async componentDidMount() {
    if(!this.state.minLoadTime) {
      setTimeout(() => {
        this.setState({
          minLoadTime: true
        })
      }, 2000)
    }
    Accounts.onLogin(async () => {
      this._handleAppStateChange(this.appState)
      console.log("onLogin", "appState", this.appState)
      this.saveAppVersion()
    })
    AppState.addEventListener('change', this._handleAppStateChange)
  }
  componentWillUnmount() {
    Meteor.call('users.leaveVenue')
    AppState.removeEventListener('change', this._handleAppStateChange)
  }
  render() {
    const { isLoading, user } = this.props
    const { minLoadTime } = this.state
    if(isLoading || !minLoadTime) return <Landing />
    if(!user)                     return <SignIn />
    return (
      <NativeRouter>
        <BackButton>
          <DeepLinking />
          <NotificationHandler />
          <AppBase user={user}>
            <Switch>
              <Route path="/dev/challengeProposition"   component={DevModeChallengeProposition} />
              <Route path="/dev/map/ongoingChallenge"   component={DevModeOutsideChallenge}     />
              <Route path="/dev/venue/ongoingChallenge" component={DevModeInsideChallenge}      />

              <Route path="/chat/:roomId"           component={Chat}              />
              <Route path="/ownProfile"             component={OwnProfile}        />
              <Route path="/show-qrcode"            component={DisplayUniqueCode} />
              <Route path="/scan"                   component={ScanQRCode}        />
              <Route path="/map"   exact={true}     component={MainMapContainer}  />
              <Route path="/venue/:venueId"         component={InsideVenue}       />

              {(!user.username || !user.profile.photo) && <Redirect to="/ownProfile" />}
              {user.venueId &&                            <Redirect to={`/venue/${user.venueId}`} />}
              <Redirect to="/map" />
            </Switch>
          </AppBase>
        </BackButton>
      </NativeRouter>
    )
  }
  _handleAppStateChange = (nextAppState) => {
    this.appState = nextAppState
    Meteor.collection('users').update(Meteor.userId(), {$set: {
      'profile.appState': this.appState
    }})
  }
  saveAppVersion = () => {
    Meteor.collection('users').update(
      Meteor.userId(),
      {$set: {
        'profile.os':           os,
        'profile.osVersion':    osVersion,
        'profile.osAppVersion': osAppVersion
      }},
    (err, res) => console.log(err))
  }
}
