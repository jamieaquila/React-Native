import React from 'react'
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import { moderateScale } from '/modules/scaling/scaling'
import UserPhoto         from '/modules/user/UserPhoto'
import CloseButton       from '/modules/base/CloseButton'
import Meteor, {withTracker}    from 'react-native-meteor'

export default class FindInsideVenue extends React.Component {
  render() {
    const { found, otherUser, reward } = this.props
    return (
      <View style={{flex: 50, zIndex: 0, position: 'relative'}}>
        <View style={{ flex: 5, zIndex: 1 }}>
          <Image source={require('./img/vague_top_establishment.png')} style={{ width: '100%', zIndex: 1}} resizeMode="stretch"/>
          <View style={styles.find}>
            <Text style={styles.findText}>LET'S FIND</Text>
          </View>
          <Image source={require('./img/vague_bottom_establishment.png')} style={{ width: '100%', zIndex: 1}} resizeMode="stretch"/>
        </View>
        <View style={styles.main}>
          <View style={styles.profil}>
            <View style={{ flex: 3, height: '100%', width: '50%'}}>
              <UserPhoto user={otherUser} />
            </View>
            <Text style={styles.nickname}>{otherUser.username}</Text>
            <Text style={styles.descr}>{otherUser.profile.description}</Text>
          </View>
          <View style={styles.infoChallenge}>
            <View style={{flex:1}}>
              <Image source={require('./img/chrono.png')} style={{ flex: 1, width: '100%'}} resizeMode="contain"/>
              <Text style={styles.infoChallengeText}>20min</Text>
            </View>
            {reward &&
              <View style={{flex:1}}>
                <Image source={require('./img/zym_violet.png')} style={{ flex: 1, width: '100%'}} resizeMode="contain"/>
                <Text style={styles.infoChallengeText}>+ {reward}</Text>
              </View>
            }
          </View>
          <View style={ styles.action }>
            <TouchableOpacity style={styles.buttonFound} onPress={found}>
              <Text style={styles.buttonFoundText}>Found!</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10}}>
          <CloseButton onPress={this.props.leaveFullView} color={"white"}/>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  banner: {
    marginHorizontal: '4%',
    marginBottom: '4%',
    marginTop: '7%',
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    width: '100%'
  },
  profil: {
    marginTop: 10,
    flex: 2,
    alignItems: 'center',
    justifyContent:"center",
  },
  infoChallenge:{
    flex: 1,
    flexDirection: 'row',
  },
  infoChallengeText:{
    color: '#69DCC7',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: moderateScale(16, 0.4),
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  find: {
    flex: 2,
    zIndex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD900'
  },
  findText: {
    color: 'white',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: moderateScale(30, 0.4),
  },
  main: {
    zIndex: 0,
    flex: 8,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: '4%',
    marginTop:-60,
    paddingTop: 60,
    marginHorizontal: '8%',
  },
  nickname: {
    marginTop: '2%',
    textAlign: 'center',
    color: '#69DCC7',
    fontFamily: 'Quicksand-Bold',
    fontSize: moderateScale(14, 0.4),
  },
  descr: {
    textAlign: 'center',
    color: '#69DCC7',
    fontFamily: 'Quicksand',
    fontSize: moderateScale(12, 0.4),
    marginBottom: 10
  },
  buttonFound: {
    flex: 1,
    marginHorizontal: '8%',
    marginBottom: '4%',
    alignItems: 'center',
    backgroundColor: '#FFD900',
    alignSelf:'center',
    borderRadius: 30,
    paddingVertical : '3%',
    paddingHorizontal : '2%',
    marginTop: '5%',
  },
  buttonFoundText: {
    color: '#E63B97',
    fontSize: moderateScale(16, 0.5),
    justifyContent: 'center',
    fontFamily: 'Quicksand-Bold',
  },
})
