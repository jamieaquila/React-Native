import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import { ConnectTwitterButton, ConnectFacebookButton, ConnectInstagramButton, ConnectGoogleButton } from '../../molecules'

class LogIn extends React.Component {

  render () {
    const { app } = this.props;

    return (
      <View style={{flex: 1}}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'transparent'}}/>
          <View style={{flex: 8, justifyContent: 'center', alignItems: 'center', paddingLeft: 16, paddingRight: 16, backgroundColor: 'transparent'}}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={{textAlign: 'center', lineHeight: 24, color: 'white',}}>Log in and see what’s new with {app.name}.</Text>
          </View>
          <View style={styles.connectButtonsContainer}>
            <ConnectFacebookButton text="Log in with Facebook" />
            <ConnectTwitterButton text="Log in with Twitter" />
            <ConnectGoogleButton text="Log in with Google" />
          </View>
          <View style={styles.logInContainer}>
            <Text style={styles.logInLink}>Don't have an account? </Text>
            <TouchableOpacity onPress={this.props.navigator.pop}>
              <Text style={[styles.logInLink, {color: app.styles.primaryColor}]}>Sign up</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.25,
    color: 'white',
  },
  connectButtonsContainer: {
    flex: 2,
    justifyContent: 'center',
    marginLeft: 24,
    marginRight: 24,
  },
  logInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 16,
  },
  logInLink: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
});

const mapStateToProps = state => ({ app: state.app })

module.exports = connect(mapStateToProps)(LogIn);
