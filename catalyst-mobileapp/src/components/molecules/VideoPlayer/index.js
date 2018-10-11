import React from 'react';

import Video from 'react-native-video';

var VideoPlayer = React.createClass ({
  getDefaultProps: function() {
    return {showControls: false}
  },

  render: function() {
    return(
      <Video
        onLoad={this.props.onLoad}
        showControls={this.props.showControls}
        style={this.props.style}
        source={this.props.source}
        paused={this.props.paused}
        resizeMode={this.props.resizeMode}
        muted={this.props.muted || false}
        repeat={this.props.repeat || false}
        onEnd={this.props.onEnd}
      />
    );
  }
});

export default VideoPlayer;
