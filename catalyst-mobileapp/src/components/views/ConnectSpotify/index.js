import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import { connect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';
import SafariView from 'react-native-safari-view';

import { ConnectSpotifyButton } from '../../molecules';
import { Pop } from '../../atoms';
import { pop as popModal } from '../../../actions/ModalActions';
import { api, app } from '../../../config';

import { setStyle as setStatusBarStyle } from '../../../actions/StatusBarActions'

const { width: deviceWidth } = Dimensions.get('window');

import { connectSpotify } from '../../../actions/AuthActions'

class ConnectSpotify extends Component {

  _loginSpotify = () => {
    const { settings } = this.props.app;
    const redirect = api.baseURL + '/Apps/' + app.id + '/SocialNetworkCallback/Spotify?redirectUri=' + settings.urlScheme + '://SpotifyCredentials';
    this.props.dispatch(connectSpotify(redirect, settings.spotify));
  }

  _registerSpotify = () => {
    const { dispatch } = this.props;
    const url = 'https://spotify.com/us/signup';
    SafariView.isAvailable()
      .then(() => {
        SafariView.show({ url, fromBottom: true });
        SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
        SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
      })
      .catch(() => Linking.openURL(url));
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
           <Image style={{ width: 200, height: 96, marginBottom: 16, tintColor: 'white' }} source={require('../SignUp/stream-music.png')} /> 
          <View style={{ marginHorizontal: 16 }}>
              <Text style={{ fontSize: 20, letterSpacing: 0.38, lineHeight: 28, textAlign: 'center', color: 'white' }}>
                Login with your spotify account to stream this track!
              </Text>
          </View>
        </View>
        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
          <View style={{ marginBottom: 24, marginHorizontal: 24 }}>
            <ConnectSpotifyButton
              onPress={this._loginSpotify}
            />
            <TouchableOpacity
              onPress={this._registerSpotify}
              style={styles.noAccountButton}
            >
              <Text style={styles.noAccountText}>Don't have a Spotify account?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ position: 'absolute', top: 0 }}>
          <Pop
            onPress={() => { this.props.dispatch(popModal()); this.props.onClose(); }}
            iconType='x'
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noAccountButton: {
    backgroundColor: 'transparent',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noAccountText: {
    color: 'white',
    fontSize: 14
  }
});

const mapStateToProps = state => ({ user: state.user, app: state.app })
export default connect(mapStateToProps)(ConnectSpotify);