import PropTypes      from 'prop-types'
import React          from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import { moderateScale } from 'modules/scaling/scaling'
import Challenges from './Challenges'

const mockData = {
  otherPlayerUser: {
    username: "Bob Dylan",
    profile: {description: "CEO at My Company, muffin lover for life"},
  },
}

@withTracker(({ mock, remainingDistance }) => {
  const displayableDistance = (
    remainingDistance > 1 ?
      String(Math.round(remainingDistance * 10) / 10) + 'km' :
      String(Math.round(remainingDistance * 100) * 10) + 'm'
  )
  if(mock) return {displayableDistance, ...mockData}
  Meteor.subscribe('challenges.started')
  const startedChallenge = Challenges.findOne()
  const otherPlayerUser = startedChallenge ? startedChallenge.otherPlayerUser() : null
  return {
    displayableDistance,
    otherPlayerUser,
  }
})
export default class ChallengeLayer extends React.PureComponent {
  static propTypes = {
    displayableDistance: PropTypes.string.isRequired,
    otherPlayerUser:     PropTypes.object,
  }
  render() {
    const { displayableDistance, otherPlayerUser } = this.props
    if(!otherPlayerUser || !otherPlayerUser.profile) return null
    return (
      <View style={styles.resumeChallenge}>
        <View style={styles.texts}>
          <Text style={styles.text}>Find {otherPlayerUser.username}</Text>
          <Text style={styles.text}>{otherPlayerUser.profile.description}</Text>
        </View>
        <View style={styles.infoChallenge}>
          <View style={ styles.columnChallenge }>
            <Image source={require('./img/fleche.png')} style={{ flex: 1, width: '100%', marginTop:'7%'}} resizeMode="contain"/>
            <Text style={styles.infoChallengeText}>{displayableDistance}</Text>
          </View>
          <View style={ styles.columnChallenge }>
            <Image source={require('./img/chrono.png')} style={{ flex: 1, width: '100%', marginTop:'7%'}} resizeMode="contain"/>
            <Text style={styles.infoChallengeText}>20min</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  resumeChallenge: {
    position: 'absolute',
    overflow: 'hidden',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    height: '25%',
    zIndex: 1,
  },
  texts: {
    backgroundColor: '#E63B97',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: 'white',
    marginVertical: '1%',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(14, 0.4),
  },
  challengeDistance: {
    color: '#E63B97',
    flex: 1,
  },
  infoChallenge:{
    flex: 1,
    flexDirection: 'row',
  },
  columnChallenge:{
    flex: 1,
    borderRightWidth:1,
    borderColor: '#eee'
  },
  infoChallengeText:{
    color: '#69DCC7',
    flex: 1,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: moderateScale(18, 0.4),
  },
})
