import React from 'react';
import { View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';

import { VideoPlayer } from '../../molecules';

class Media extends React.Component {

  renderMedia() {
    var { media, feedItem } = this.props
    if(media !== null && feedItem !== null) {
      switch (media.type) {
        case 'image':
          return <Image 
            style={[this.props.style]} 
            source={{ uri: media.url }} 
          />
        case 'video':
          return <VideoPlayer
            onLoad={this.props.onLoad}
            style={this.props.style}
            onPress={this.props.onPress}
            showControls={this.props.showControls}
            style={this.props.style}
            touchableStyle={this.props.touchableStyle}
            source={{ uri:  feedItem.platform === 'twitter' ? media.url.url : media.url }} 
            paused={this.props.paused}
            muted={this.props.muted || false}
            repeat={this.props.repeat || false}
            onEnd={this.props.onEnd}
            resizeMode='contain'
          />
      }
    }

  }

  render() {
    if (!!this.props.onPress) {
      return (
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View>{this.renderMedia()}</View>
        </TouchableWithoutFeedback>
        );
    } else {
      return this.renderMedia();
    }
  }  
}

Media.propTypes = {
  onPress: React.PropTypes.func,
  style: React.PropTypes.any,
}

Media.defaultProps = {
  style: { flex: 1, height: Dimensions.get('window').height },
}

module.exports = Media;
