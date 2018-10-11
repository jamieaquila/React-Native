import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';


import colors from '../../../config/colors';

var CommentButton = React.createClass ({
  getDefaultProps: function() {
    return { tintColor: colors.gray }
  },

  render: function() {

    const { tintColor } = this.props;

    return(
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.touchAreaStyle}
      >
        <Image 
          style={{ tintColor: tintColor }}
          source={ require('./comment.png') }
        />
      </TouchableOpacity>
    );
  }
});

const styles = StyleSheet.create({
  touchAreaStyle: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = CommentButton;
