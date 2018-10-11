import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Pop } from '../../atoms';
import { ConnectTwitterButton, ConnectFacebookButton, NavigationBar } from '../../molecules';
import { connect } from 'react-redux';

import { pop as popModal } from '../../../actions/ModalActions';
import BuyOrRedeemAlbumPass from '../../views/AlbumAndTrackUnlock/BuyOrRedeemAlbumPass';

import LinearGradient from 'react-native-linear-gradient';

const { width: deviceWidth } = Dimensions.get('window');

class Auth extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { modalNavigator, navigator, album } = this.props;

    if (nextProps.user.currentUser) navigator.pop();
  }

  render() {
    const { navigator, album, user } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Image
          style={{ position: 'absolute', top: 0, left: 0, bottom:  0, right: 0 }}
          source={{ uri: album.imageUrl }}
        />
        <LinearGradient
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, }}
          colors={[ 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.9)' ]}
        />
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', }}>
          <Image style={{ width: 96, height: 96, marginBottom: 16, tintColor: 'white' }} source={require('./mysteryPerson.png')} />
          <View style={{ marginHorizontal: 16 }}>
              <Text style={{ fontSize: 20, letterSpacing: 0.38, lineHeight: 24, textAlign: 'center', color: 'white' }}>
                Let’s link this album to an account so you can listen anywhere!
              </Text>
          </View>
        </View>
        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
          <View style={{ marginBottom: 48, marginHorizontal: 24 }}>
            <ConnectFacebookButton text="Connect with Facebook" />
            <ConnectTwitterButton text="Connect with Twitter" />
          </View>
        </View>
        <View style={{ position: 'absolute', top: 0 }}>
          <Pop
            onPress={() => this.props.dispatch(popModal())}
            iconType='x'
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({

})

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(Auth);
