import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';


import { connectTwitter } from '../../../actions/AuthActions';
import { connect } from 'react-redux';

class ConnectTwitterButton extends React.Component {

  onPress() {
    var { app, dispatch } = this.props;
    dispatch(connectTwitter(app.settings.urlScheme + '://TwitterCredentials'));
  }

	render () {
    const { text, user, backgroundColor, textColor, showSocialIcon } = this.props;

    var twitterStrategy = null;
    if (user.currentUser) var twitterStrategy = user.currentUser.authStrategies.find(strategy => strategy.type === 'twitter' && strategy.status === 'connected');

    if (!twitterStrategy || !user.currentUser) {
  		return (
            <TouchableOpacity
              activeOpacity={.6}
  			  		style={[styles.button, {backgroundColor: backgroundColor ? backgroundColor : '#1da1f2'} ]}
  	          onPress={() => this.onPress()}
  	        >
              {showSocialIcon &&
                <Image
                  style={{ tintColor: this.props.iconColor }}
                  defaultSource={require('./twitter.png')}
                  source={require('./twitter.png')}/>
              }
              <Text style={[styles.text, {color: textColor ? textColor : 'white'} ]}>{this.props.text}</Text>
            </TouchableOpacity>
  		);
    } else {
      return null;
    }
	}
}

ConnectTwitterButton.defaultProps = {
	text: "Connect with Twitter",
  showSocialIcon: true,
}

ConnectTwitterButton.propTypes = {
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

const mapStateToProps = state => ({ twitterRequestToken: state.twitterRequestToken.requestToken, app: state.app, user: state.user });

export default connect(mapStateToProps)(ConnectTwitterButton);