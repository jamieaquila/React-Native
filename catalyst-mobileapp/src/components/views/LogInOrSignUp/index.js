import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { connect } from 'react-redux';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';

import { SignUp, LogIn } from '../../views';
import { Pop } from '../../atoms';

class LogInOrSignUp extends React.Component {

  renderScene(route, navigator) {
    var Component = route.component;

    return <Component navigator={navigator} route={route} {...route.passProps} />;
  }

  configureScene() {
    var config = Navigator.SceneConfigs.HorizontalSwipeJump;
    config.gestures = null;

    return config;
  }

  render () {
    var { app } = this.props;

    return (
      <View style={{flex: 1}}>
        {app.settings.loginOrSignUpVideoURL ?
          <Video source={{uri: app.settings.loginOrSignUpVideoURL }}
            rate={1.0}                   // 0 is paused, 1 is normal.
            volume={1.0}                 // 0 is muted, 1 is normal.
            muted={true}                // Mutes the audio entirely.
            paused={false}               // Pauses playback entirely.
            resizeMode="cover"           // Fill the whole screen at aspect ratio.
            repeat={true}                // Repeat forever.
            style={styles.backgroundVideo} 
          />
        :
          <Image source={{ uri: 'LaunchScreen', isStatic: true }} style={styles.backgroundImage} />
        }
        <Navigator
          configureScene={this.configureScene}        
          renderScene={this.renderScene}
          initialRoute={{ 
            component: SignUp,
          }}
        />
        <View style={{position: 'absolute', top: 16}}>
          <Pop
            onPress={() => this.props.navigator.pop()}
            iconType='x'
          />
        </View>
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
    right: 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: -120,
    right:0,
    left:0,
    bottom:0,
    resizeMode: 'contain'
  }
});

const mapStateToProps = state => ({ app: state.app })

module.exports = connect(mapStateToProps)(LogInOrSignUp);
