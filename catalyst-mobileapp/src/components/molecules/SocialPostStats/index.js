import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors } from '../../../config';

import { shortNumber } from '../../../helpers';

class SocialPostStats extends React.Component {

  static propTypes = {
    platform: React.PropTypes.oneOf(['buzznog', 'facebook', 'twitter', 'instagram', 'youtube'])
  }

  renderText() {
    var { platform, likes, shares, comments } = this.props;
  
    switch(platform) {
      case 'buzznog':
        return shortNumber(likes) + ' Likes, ' + shortNumber(comments) + ' Comments';
      case 'facebook':
        return shortNumber(likes) + ' Likes, ' + shortNumber(comments) + ' Comments, ' + shortNumber(shares) + ' Shares';
      case 'twitter':
        return shortNumber(likes) + ' Likes, ' + shortNumber(shares) + ' Retweets';
      case 'instagram':
        return shortNumber(likes) + ' Likes, ' + shortNumber(comments) + ' Comments';
      case 'youtube':
        return shortNumber(likes) + ' Likes, ' + shortNumber(comments) + ' Comments';
    }
  }
  
  render() {
    return (
      this.props.commentStatus ?
      <TouchableOpacity onPress={() => this.props.onPress()}>
        <Text style={[ styles.text, {color: colors.gray} ]}>{this.renderText()}</Text>
      </TouchableOpacity>
      :<Text style={[ styles.text, {color: colors.gray} ]}>{this.renderText()}</Text>
    );
  }
}

var styles = StyleSheet.create({
  text: {
    margin: 16,
    marginBottom: 0,
    fontSize: 12,
    backgroundColor: 'transparent'
  }
});

export default SocialPostStats;
