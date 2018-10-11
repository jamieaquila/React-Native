import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';

class ConnectSpotifyButton extends Component {
  defaultProps: {
    onPress: () => {}
  }

  render () {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.props.onPress}
      >
        <Image style={{ tintColor: 'white' }} source={require('./spotify.png')} /> 
        <Text style={styles.text}>Connect with Spotify</Text>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: '#1ED760'
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center'
  }
});

export default ConnectSpotifyButton;
