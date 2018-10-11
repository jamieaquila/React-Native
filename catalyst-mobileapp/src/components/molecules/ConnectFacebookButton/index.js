import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import { api, app } from '../../../config';

import { connectFacebook } from '../../../actions/AuthActions'

class ConnectFacebookButton extends React.Component {


  onPress(redirect) {
    var { settings } = this.props.app;
    var redirect = api.baseURL + '/Apps/' + app.id + '/SocialNetworkCallback/Facebook?redirectUri=' + settings.urlScheme + '://FacebookCredentials';

    this.props.dispatch(connectFacebook(redirect, settings.facebook))  
  }

  render () {
    const { text, user, backgroundColor, textColor, showSocialIcon } = this.props;

    var facebookStrategy = null;
    if (user.currentUser) var facebookStrategy = user.currentUser.authStrategies.find(strategy => strategy.type === 'facebook' && strategy.status === 'connected')

    if (!facebookStrategy || !user.currentUser) {
      return (
        <TouchableOpacity
          activeOpacity={.6}
          style={[styles.button, {backgroundColor: backgroundColor ? backgroundColor : '#3b5998'} ]}
          onPress={() => this.onPress()}
        >
          {showSocialIcon &&
            <Image
              style={{ tintColor: this.props.iconColor }}
              defaultSource={require('./facebook.png')}
              source={require('./facebook.png')}/>
          }
          <Text style={[styles.text, {color: textColor ? textColor : 'white'} ]}>{this.props.text}</Text>
        </TouchableOpacity>
        );
    } else {
      return null
    }
  }
}

ConnectFacebookButton.defaultProps = {
  text: "Connect with Facebook",
  showSocialIcon: true
}

ConnectFacebookButton.propTypes = {
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

const mapStateToProps = state => ({ twitterRequestToken: state.twitterRequestToken, app: state.app, user: state.user });

export default connect(mapStateToProps)(ConnectFacebookButton);