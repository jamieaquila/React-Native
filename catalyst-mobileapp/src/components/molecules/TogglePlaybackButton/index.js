import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';


class TogglePlaybackButton extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    paused: React.PropTypes.bool,
    buffering: React.PropTypes.bool,
    size: React.PropTypes.string,
    style: React.PropTypes.object,
    backgroundColor: React.PropTypes.string,
  };

  static defaultProps = {
    paused: true,
    size: 'large',
    backgroundColor: 'rgba(0,0,0,0.6)',
  };

  renderButton() {
    var { paused, buffering, backgroundColor } = this.props;

    switch(this.props.size) {
      case 'xlarge':
        var playIcon = require('./playXLarge.png')
        var pauseIcon = require('./pauseXLarge.png')
        var pauseIconStyle = styles.pauseIconXLarge
        var playIconStyle = styles.playIconXLarge
        var backgroundStyle = styles.backgroundXLarge
        var indicatorSize = 'large'
      break;
      case 'large':
        var playIcon = require('./playLarge.png')
        var pauseIcon = require('./pauseLarge.png')
        var pauseIconStyle = styles.pauseIconLarge
        var playIconStyle = styles.playIconLarge
        var backgroundStyle = styles.backgroundLarge
        var indicatorSize = 'small'
      break;
      case 'small':
        var playIcon = require('./playSmall.png')
        var pauseIcon = require('./pauseSmall.png')
        var pauseIconStyle = styles.pauseIconSmall
        var playIconStyle = styles.playIconSmall
        var backgroundStyle = styles.backgroundSmall
        var indicatorSize = 'small'
      break;
    }

    return(
      <View style={[backgroundStyle, {backgroundColor: backgroundColor} ]}>
        {!buffering && <View style={styles.iconContainer}>
          <Image style={[ pauseIconStyle, { opacity: paused ? 0 : 1, tintColor: 'white' } ]} source={pauseIcon} />
        </View>}
        {!buffering && <View style={styles.iconContainer}>
          <Image style={[ playIconStyle, { opacity: paused ? 1 : 0} ]} source={playIcon} />
        </View>}
        {buffering && <View style={styles.iconContainer}>
          <View style={ indicatorSize == 'large' && { marginRight: -3, marginBottom: -3 } }>
            <ActivityIndicator size={indicatorSize} color='white' />
          </View>
        </View>}
      </View>
    );
  }

  render() {
    return this.props.onPress ?
     <TouchableOpacity
        onPress={this.props.onPress}
        style={this.props.style}
        activeOpacity={0.6}
        hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
      >
        {this.renderButton()}
      </TouchableOpacity>
      :
     this.renderButton()
  }
}

var styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundXLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  playIconXLarge: {
    marginRight: -6
  },
  playIconLarge: {
    marginRight: -4
  },
  backgroundLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  playIconSmall: {
    marginRight: -3
  },
  backgroundSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
  }
});

export default TogglePlaybackButton;
