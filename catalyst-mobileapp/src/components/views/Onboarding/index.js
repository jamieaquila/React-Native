import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, PushNotificationIOS, Alert, Image } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { connect } from 'react-redux';

import { SignUp, LogIn } from '../../views';

import Video from 'react-native-video';

import Platform from 'Platform';

class Onboarding extends React.Component {

  renderScene(route, navigator) {
    var Component = route.component;

    return <Component navigator={navigator} route={route} {...route.passProps} />;
  }

  configureScene() {
    var config = Navigator.SceneConfigs.HorizontalSwipeJump;
    config.gestures = null;

    return config;
  }

  componentWillUnmount() {
    const { app } = this.props;

    Alert.alert(
      app.name + ' would like to send you push notifications',
      'Get notified when ' + app.name + ' adds exclusive content and sends you direct messages.',
        [
          { text: 'Later', onPress: () => {}, style: 'cancel' },
          { text: 'Allow', onPress: () => Platform.OS === 'ios' ? PushNotificationIOS.requestPermissions() : () => {} }
        ]
      );
  }

  render() {
    const { app } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {app.settings.loginOrSignUpVideoURL ?
          <Video source={{uri: app.settings.loginOrSignUpVideoURL}}
            rate={1.0}                   // 0 is paused, 1 is normal.
            volume={1.0}                 // 0 is muted, 1 is normal.
            muted={true}                // Mutes the audio entirely.
            paused={false}               // Pauses playback entirely.
            resizeMode="cover"           // Fill the whole screen at aspect ratio.
            repeat={true}                // Repeat forever.
            onLoadStart={this.loadStart} // Callback when video starts to load
            onLoad={this.setDuration}    // Callback when video loads
            onProgress={this.setTime}    // Callback every ~250ms with currentTime
            onEnd={this.onEnd}           // Callback when playback finishes
            onError={this.videoError}    // Callback when video cannot be loaded
            style={styles.backgroundVideo}
          />
        :
          <Image source={{ uri: 'LaunchScreen', isStatic: true }} style={styles.backgroundImage} />
        }
        <Navigator
          configureScene={this.configureScene}
          renderScene={this.renderScene}
          initialRoute={{
            component: SignUp
          }}
        />
        <TouchableOpacity
          style={{ backgroundColor: 'transparent', position: 'absolute', top: 20, right: 0, padding: 8, paddingRight: 16 }}
          onPress={() => this.props.navigator.pop()}
        >
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Skip</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    height: Dimensions.get('window').height + 200,
    top: -120,
    left: 0,
    bottom: 0,
    right: 0
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    right:0,
    left:0,
    bottom:0,
    resizeMode: 'contain'
  }
});

const mapStateToProps = state => ({ app: state.app })

module.exports = connect(mapStateToProps)(Onboarding);
