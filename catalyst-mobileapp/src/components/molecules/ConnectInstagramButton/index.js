import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import { api, app } from '../../../config';

import { connectInstagram } from '../../../actions/AuthActions'
import base64url from 'base64-url';

class ConnectInstagramButton extends React.Component {


  onPress(redirect) {
    var { settings } = this.props.app;
    var state = base64url.encode("redirectUri=" + settings.urlScheme + "://InstagramCredentials&appId=" + app.id);
    var redirect = api.baseURL + '/SocialNetworkCallback/Instagram/?state=' + state + '&scope=likes+comments+public_content';

    this.props.dispatch(connectInstagram(redirect, settings.instagram))
  }

  render () {
    const { text, user, backgroundColor, textColor, showSocialIcon } = this.props;

    var instagramStrategy = null;
    if (user.currentUser) {
      instagramStrategy = user
        .currentUser
        .authStrategies
        .find(strategy => strategy.type === 'instagram' && strategy.status === 'connected');
    }

    if (!instagramStrategy || !user.currentUser) {
      return (
        <TouchableOpacity
          activeOpacity={.6}
          style={[styles.button, {backgroundColor: backgroundColor ? backgroundColor : '#125688'} ]}
          onPress={() => this.onPress()}
        >
          {showSocialIcon && <Image style={{ tintColor: this.props.iconColor }} source={require('./instagram.png')}/>}
          <Text style={[styles.text, {color: textColor ? textColor : 'white'} ]}>{this.props.text}</Text>
        </TouchableOpacity>
        );
    } else {
      return null
    }
  }
}

ConnectInstagramButton.defaultProps = {
  text: "Connect with Instagram",
  showSocialIcon: true
}

ConnectInstagramButton.propTypes = {
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

export default connect(mapStateToProps)(ConnectInstagramButton);
