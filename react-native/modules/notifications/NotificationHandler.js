import React                 from 'react'
import { Alert }             from 'react-native'
import firebase              from 'react-native-firebase'
import Meteor                from 'react-native-meteor'
import { withRouter }        from 'react-router-native'
import PropositionModal from '/modules/challenge/PropositionModal'

import acceptChallenge     from 'modules/challenge/acceptChallenge'
import declineChallenge    from 'modules/challenge/declineChallenge'

@withRouter
export default class NotificationHandler extends React.Component {
  state = {
    modal: {
      open: false,
      type: null,
    }
  }
  async componentDidMount() {
    console.log("did mount notif")
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      this._saveFcmToken(fcmToken)
    })
    try {
      const enabled = await firebase.messaging().hasPermission()
      if(!enabled) {
        await firebase.messaging().requestPermission()
      }
      console.log("enabled")
      const fcmToken = await firebase.messaging().getToken()
      console.log(fcmToken)
      if(fcmToken) {
        this._saveFcmToken(fcmToken)
      } else {
        console.warn("no token!!")
      }
      this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        console.log("notif displayed", notification)
      })
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const action = notificationOpen.action
        console.log("opened")
        console.log(action)
        this.handleNotification(notificationOpen.notification)
      })
      this.notificationListener = firebase.notifications().onNotification(this.handleNotification)
    } catch (error) {
      console.log("rejected", error)
    }
  }
  componentWillUnmount() {
    console.log("unmount notif")
    this.onTokenRefreshListener()
    this.notificationListener()
    this.notificationDisplayedListener()
  }
  render() {
    const { modal } = this.state
    if(!modal.open) return null
    if(modal.type === 'challengeProposition') {
      return <PropositionModal {...modal.data} closeModal={() => this.setState({modal: {open: false}})} />
    }
    return null
  }
  handleNotification = ({_body, _data, _title}) => {
    console.log("notif", _title, _data)
    let buttons
    let options = {}
    const {challengeId} = _data
    switch(_data.type) {
    case 'newChallenge':
      buttons = [
        {text: 'Non merci', onPress: () => declineChallenge(challengeId), style: 'cancel'},
        {text: 'Oui !',     onPress: () => acceptChallenge(challengeId)},
      ]
      options.cancellable = false
      this.setState({
        modal: {
          open: true,
          type: 'challengeProposition',
          data: _data,
        }
      })
      break
    case 'challengeStarted':
      buttons = [
        {text: 'C\'est parti !'},
      ]
      this.alert(_title, _body, buttons, options)
      break
    case 'challengeCancelled':
      buttons = [
        {text: 'Ok'},
      ]
      this.alert(_title, _body, buttons, options)
      break
    case 'chatMessage':
      const roomPath = `/chat/${_data.roomId}`
      if(this.props.history.location.pathname === roomPath) return
      buttons = [
        {text: 'Plus tard', style: 'cancel'},
        {text: 'Voir',     onPress: () => this.props.history.push(roomPath)},
      ]
      this.alert(_title, _body, buttons, options)
      break
    }

  }
  alert(title, body, buttons, options) {
    console.log("alert", title)
    Alert.alert(
      title,
      body,
      buttons,
      options
    )
  }
  _saveFcmToken = (fcmToken) => {
    Meteor.collection('users').update(Meteor.userId(), {$set: {
      'profile.fcmToken': fcmToken,
    }}, {})
  }
}
