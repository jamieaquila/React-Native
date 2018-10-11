import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, StyleSheet, Text, Button, Modal, Image, ImageBackground, TouchableOpacity } from 'react-native'
import Banner              from '/modules/base/Banner'
import declineChallenge    from '/modules/challenge/declineChallenge'
import { moderateScale }   from '/modules/scaling/scaling'
import UserPhoto           from '/modules/user/UserPhoto'
import acceptChallenge     from './acceptChallenge'
import ChallengerImage     from './ChallengerImage'

export default class PropositionModal extends React.Component {

  render() {
    const { challengeId, closeModal, handleBackButton, isOpen, photoStorageId, reward, time, username, userDescription } = this.props
    return (
      <Modal
        animationType="slide"
        transparent={true}
        presentationStyle={'overFullScreen'}
        visible={isOpen}
        onRequestClose={() => { declineChallenge(challengeId); closeModal() }}>
        <ImageBackground
          source={require('./img/blue_radient_background.png')}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.banner}>
            <Banner />
          </View>
          <View style={{flex: 50}}>
            <Image source={require('./img/vague_top_establishment.png')} style={{ width: '100%', zIndex: 1}} resizeMode="stretch"/>
            <View style={styles.find}>
              <Text style={styles.findText}>LET'S FIND</Text>
            </View>
            <Image source={require('./img/vague_bottom_establishment.png')} style={{ width: '100%', zIndex: 1}} resizeMode="stretch"/>
            <View style={styles.main}>
              <View style={styles.profil}>
                <View style={{ flex: 3, height: '100%', width: '50%'}}>
                {photoStorageId ?
                  <UserPhoto user={{profile: {photo: {storageId: photoStorageId}}}} /> :
                  <ChallengerImage />
                }
                </View>
                <Text style={styles.nickname}>{username}</Text>
                <Text style={styles.descr}>{userDescription}</Text>
              </View>
              <View style={styles.infoChallenge}>
                <View style={{flex:1}}>
                  <Image source={require('./img/chrono.png')} style={{ flex: 1, width: '100%'}} resizeMode="contain"/>
                  <Text style={styles.infoChallengeText}>{`${time}min`}</Text>
                </View>
                <View style={{flex:1}}>
                  <Image source={require('./img/zym_violet.png')} style={{ flex: 1, width: '100%'}} resizeMode="contain"/>
                  <Text style={styles.infoChallengeText}>+ {reward}</Text>
                </View>
              </View>
              <View style={ styles.action }>
                <TouchableOpacity style={styles.buttonYes} onPress={() => { acceptChallenge(challengeId); closeModal() }}>
                  <Text style={styles.buttonYesText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonNo} onPress={() => { declineChallenge(challengeId); closeModal() }}>
                  <Text style={styles.buttonNoText}>No</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ImageBackground>
      </Modal>
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
  main:{
    flex: 1,
    overflow: 'hidden',
  },
  profil: {
    flex: 2,
    marginTop: 10,
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
    flex: 7,
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
  buttonYes: {
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
  buttonYesText: {
    color: '#E63B97',
    fontSize: moderateScale(16, 0.5),
    justifyContent: 'center',
    fontFamily: 'Quicksand-Bold',
  },
  buttonNo: {
    flex: 1,
    marginHorizontal: '8%',
    marginBottom: '4%',
    alignItems: 'center',
    backgroundColor: '#E63B97',
    alignSelf:'center',
    borderRadius: 30,
    paddingVertical : '3%',
    paddingHorizontal : '2%',
    marginTop: '5%',
  },
  buttonNoText: {
    color: '#FFD900',
    fontSize: moderateScale(16, 0.5),
    justifyContent: 'center',
    fontFamily: 'Quicksand-Bold',
  },
})
