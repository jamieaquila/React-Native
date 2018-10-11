import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { connect } from 'react-redux';

class SocialMediaBadge extends React.Component {

  render() {
    const { app } = this.props;

    const twitter = require('./twitter.png'),
        instagram = require('./instagram.png'),
        facebook = require('./facebook.png'),
        youtube = require('./youtube.png'),
        buzznog = require('./buzznog.png');

    var image = false;

    switch(this.props.platform) {
      case "twitter":
        image = twitter;
        backgroundStyle = styles.twitterBackground;
      break;
      case "instagram":
        image = instagram;
        backgroundStyle = styles.instagramBackground;
      break;
      case "facebook":
        image = facebook;
        backgroundStyle = styles.facebookBackground;
      break;
      case "youtube":
        image = youtube;
        backgroundStyle = styles.youtubeBackground;
      break;
      case "buzznog":
        image = buzznog;
        backgroundStyle = {backgroundColor: app.styles.primaryColor};
      break;
    }

    return (
      <View style={[styles.iconContainerBorder, {backgroundColor: this.props.borderColor ? this.props.borderColor : 'white'}]}>
        <View style={[styles.iconContainer, backgroundStyle]}>
          <Image
            defaultSource={image}
            source={image}/>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  iconContainerBorder: {
    padding: 4,
    borderRadius: 100,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  facebookBackground: {
    backgroundColor: '#3b5998',
  },
  twitterBackground: {
    backgroundColor: '#1da1f2',
  },
  instagramBackground: {
    backgroundColor: '#3897F0',
  },
  youtubeBackground: {
    backgroundColor: '#cd201f',
  },
})

const mapStateToProps = state => ({ app: state.app })

export default connect(mapStateToProps)(SocialMediaBadge);
