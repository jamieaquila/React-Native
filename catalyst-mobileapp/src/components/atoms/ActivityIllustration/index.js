import React from 'react';
import { View, Image } from 'react-native';

import { connect } from 'react-redux';

class ActivityIllustration extends React.Component {

  render() {
    var { action, backgroundColor, app } = this.props;

    switch(action) {
      case "trackLike":
        var stroke = require('./trackLikeIllustrationStroke.png');
        var fill = require('./trackLikeIllustrationFill.png');
      break;
      case "feedItemLike":
        var stroke = require('./feedItemLikeIllustrationStroke.png');
        var fill = require('./feedItemLikeIllustrationFill.png');
      break;
      case "communityJoin":
        var stroke = require('./communityIllustrationStroke.png');
        var fill = require('./communityIllustrationFill.png');
      break;
      case "feedItemReshare":
        var stroke = require('./feedItemReshareIllustrationStroke.png');
        var fill = require('./feedItemReshareIllustrationFill.png');
      break;
      case "connectFacebook":
        var stroke = require('./facebookIllustrationStroke.png');
        var fill = require('./facebookIllustrationFill.png');
      break;
      case "connectTwitter":
        var stroke = require('./twitterIllustrationStroke.png');
        var fill = require('./twitterIllustrationFill.png');
      break;
      case "connectInstagram":
        var stroke = require('./instagramIllustrationStroke.png');
        var fill = require('./instagramIllustrationFill.png');
      break;
      case "connectYouTube":
        var stroke = require('./youtubeIllustrationStroke.png');
        var fill = require('./youtubeIllustrationFill.png');
      break;
      case "feedItemComment":
        var stroke = require('./commentIllustrationStroke.png');
        var fill = require('./commentIllustrationFill.png');
      break;
    }

    var style = backgroundColor ? {backgroundColor: app.styles.primaryLightColor} : {}

    return(
      <View style={[style, {width: 56, height: 56, borderRadius: 28} ]}>
        <Image
          style={{tintColor: app.styles.primaryColor}}
          defaultSource={fill}
          source={fill}
        />
        <Image
          style={{marginTop: -56, tintColor: app.styles.primaryDarkColor}}
          defaultSource={stroke}
          source={stroke}
        />
      </View>
    );
  }
}


const mapStateToProps = state => ({ app: state.app })

export default connect(mapStateToProps)(ActivityIllustration);
