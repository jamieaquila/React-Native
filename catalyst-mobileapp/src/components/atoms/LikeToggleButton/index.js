import React from 'react';
import { Image, Animated, TouchableOpacity, View, StyleSheet, Text } from 'react-native';

import TimerMixin from 'react-timer-mixin'
import ConnectSocialNetwork from '../../views/ConnectSocialNetwork';

import { connect } from 'react-redux';
import { likeFeedItem } from '../../../actions/FeedActions';

import colors from '../../../config/colors';

var LikeToggleButton = React.createClass({

  mixins: [TimerMixin],

  propTypes: {
    isLoading: React.PropTypes.bool,
    isActive: React.PropTypes.bool,
    onPressActive: React.PropTypes.func,
    onPressInactive: React.PropTypes.func
  },

  getDefaultProps: function() {
    return { tintColor: colors.gray, smallIcon: false }
  },

  getInitialState: function () {
    return {
      isActive: false,
      bounceValue: new Animated.Value(1)
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (!nextProps.isLoading && nextProps.isActive !== this.state.isActive) this.setState({ isActive: nextProps.isActive })
  }, 

  componentDidMount: function() {
    this.setState({ isActive: this.props.isActive }) 
  },

  _onPress: function() {
    var { onPressActive, onPressInactive } = this.props;
    var { isActive } = this.state;

    this._animatePress();
    this.setState({ isActive: !this.state.isActive });

    if (isActive) this.setTimeout(onPressActive, 200);
    else this.setTimeout(onPressInactive, 200);

   },

  _animatePress: function() {
    Animated.sequence([
      Animated.spring(this.state.bounceValue, {
        toValue: 1.5,
      }),
      Animated.spring(this.state.bounceValue, {
        toValue: 1,
      })
    ]).start();
  },

  render: function() {
    const { tintColor } = this.props;
    const { isActive } = this.state;

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={styles.touchAreaStyle}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, }}>
          <Animated.Image
            source={this.props.smallIcon ? require('./heart-fill-small.png') : require('./heart-fill.png')}
            style={{
              opacity: (isActive) ? 1 : 0,
              tintColor: (isActive) ? '#f35' : tintColor,
              transform: [                        // `transform` is an ordered array
                {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
              ]
            }}
          />
        </View>
        <Animated.Image
          source={this.props.smallIcon ? require('./heart-small.png') : require('./heart.png')}
          style={{
            tintColor: (isActive) ? '#f35' : tintColor,
            transform: [                        // `transform` is an ordered array
              {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
            ]
          }}
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
    justifyContent: 'center',
  }
});

module.exports = LikeToggleButton;
