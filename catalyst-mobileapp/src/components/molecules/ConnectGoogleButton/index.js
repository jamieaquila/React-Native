import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';


import { api, app } from '../../../config';

import { connect } from 'react-redux';

import { connectGoogle } from '../../../actions/AuthActions';

import base64url from 'base64-url';

class ConnectGoogleButton extends React.Component {


  onPress(redirect) {
    var { settings } = this.props.app;
    var redirect = api.baseURL + '/Apps/' + app.id + '/SocialNetworkCallback/Google/';
    var state = base64url.encode("redirectUri=" + settings.urlScheme + '://GoogleCredentials');

    this.props.dispatch(connectGoogle(redirect, settings.youtube, state))
  }

  render () {
    const { text, user, backgroundColor, textColor, showSocialIcon } = this.props;

    var googleStrategy = null;
    if (user.currentUser) {
      googleStrategy = user
        .currentUser
        .authStrategies
        .find(strategy => strategy.type === 'google' && strategy.status === 'connected');
    }

    if (!googleStrategy || !user.currentUser) {
      return (
        <TouchableOpacity
          activeOpacity={.6}
          style={[styles.button, {backgroundColor: backgroundColor ? backgroundColor : '#cd201f'} ]}
          onPress={() => this.onPress()}
        >
          {showSocialIcon && <Image style={{ tintColor: this.props.iconColor }} source={require('./google.png')}/>}
          <Text style={[styles.text, {color: textColor ? textColor : 'white'} ]}>{this.props.text}</Text>
        </TouchableOpacity>
        );
    } else {
      return null
    }
  }
}

ConnectGoogleButton.defaultProps = {
  text: "Connect with Google",
  showSocialIcon: true
}

ConnectGoogleButton.propTypes = {
  text: React.PropTypes.string,
  showSocialIcon: React.PropTypes.bool,
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
    borderRadius: 4
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center'
  }
});

const mapStateToProps = state => ({ app: state.app, user: state.user });

export default connect(mapStateToProps)(ConnectGoogleButton);
