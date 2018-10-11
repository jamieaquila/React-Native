import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActionSheetIOS, Platform } from 'react-native';

import colors from '../../../config/colors';

import Share from 'react-native-share';

var ShareButton = React.createClass({

  propTypes: {
    url: React.PropTypes.string,
    subject: React.PropTypes.string,
    message: React.PropTypes.string.isRequired,
  },

  getDefaultProps: function() {
    return { tintColor: colors.gray, smallIcon: false }
  },

  showShareActionSheet: function() {
    Share.open({
      url: this.props.url,
      message: this.props.message,
      subject: this.props.subject,
    },(e) => {
      console.log(e);
    });
  },

  render: function() {
    const { tintColor } = this.props;

    return(
      <TouchableOpacity
        onPress={this.showShareActionSheet}
        style={styles.touchAreaStyle}
      >
        { (Platform.OS === 'ios') ?
          <Image 
            style={{ tintColor: tintColor }}
            source={this.props.smallIcon ? require('./share-small-iOS.png') : require('./share-iOS.png')}
          />
        :
          <Image 
            style={{ tintColor: tintColor }}
            source={this.props.smallIcon ? require('./share-small-Android.png') : require('./share-Android.png')}
          />
        }
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

module.exports = ShareButton;
