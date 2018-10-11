import PropTypes             from 'prop-types'
import React                 from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Config                from 'react-native-config'
import Meteor                from 'react-native-meteor'
import { withRouter }        from 'react-router-native'
import { moderateScale} from '/modules/scaling/scaling'
import UserPhoto        from '/modules/user/UserPhoto'
import CloseButton      from './CloseButton'

const isDev = !Config.PRODUCTION
@withRouter
export default class Menu extends React.Component {
  static propTypes = {
    history:  PropTypes.object.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    onClose:  PropTypes.func.isRequired,
    user:     PropTypes.object.isRequired,
  }
  render() {
    const { menuOpen, onClose, user } = this.props
    if(!menuOpen) return null
    return (
      <View style={styles.menu}>
        <CloseButton onPress={onClose} />
        <TouchableOpacity onPress={this.goTo('/ownProfile')} style={styles.profile}>
          <View style={{ flex: 3, height: '100%', width: '50%'}}>
            <UserPhoto user={user} />
          </View>
          <Text style={styles.nickname}>{user.username}</Text>
          <Text style={styles.descr}>{user.profile.description}</Text>
        </TouchableOpacity>
        <View style={styles.actionList}>
          <TouchableOpacity onPress={this.goTo('/')}>
            <Text style={styles.actionText}>Map</Text>
          </TouchableOpacity>
          {isDev &&
            <View>
              <TouchableOpacity onPress={this.goTo('/dev/challengeProposition')}>
                <Text style={styles.actionText}>Challenge proposition</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.goTo('/dev/map/ongoingChallenge')}>
                <Text style={styles.actionText}>Outside challenge</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.goTo('/dev/venue/ongoingChallenge')}>
                <Text style={styles.actionText}>Inside challenge</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Meteor.logout()}>
                <Text style={[styles.actionText,styles.logoutText]}>Log out</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    )
  }
  goTo = (url) => () => {
    this.props.history.push(url)
    this.setState({menuOpen: false})
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '35%',
    backgroundColor: 'white',
  },
  actionList:{
    flex: 7,
    borderTopWidth: 2,
    paddingBottom: '10%',
    borderColor: '#69DCC7',
    borderStyle:'dashed'
  },
  actionText: {
    marginTop: '10%',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(14, 0.4),
  },
  descr: {
    textAlign: 'center',
    color: '#ccc',
    fontFamily: 'Quicksand',
    fontSize: moderateScale(12, 0.4),
    paddingHorizontal: '2%'
  },
  logoutText: {
    color: '#ccc',
  },
  nickname: {
    textAlign: 'center',
    color: '#E63B97',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(14, 0.4),
    paddingHorizontal: '2%'
  },
  profile: {
    flex: 3,
    alignItems: 'center',
    justifyContent:"center",
    marginVertical: '2%',
  },
})
