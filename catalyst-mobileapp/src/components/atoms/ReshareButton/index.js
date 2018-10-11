import React from 'react';
import { Image, Animated, TouchableOpacity, View, StyleSheet, Text } from 'react-native';

import TimerMixin from 'react-timer-mixin'

import { connect } from 'react-redux';
import { likeFeedItem } from '../../../actions/FeedActions';

import colors from '../../../config/colors';

var ReshareToggleButton = React.createClass({

  mixins: [TimerMixin],

  propTypes: {
    isLoading: React.PropTypes.bool,
    isActive: React.PropTypes.bool,
    onPressActive: React.PropTypes.func,
    onPressInactive: React.PropTypes.func
  },

  getDefaultProps: function() {
    return { tintColor: colors.gray }
  },

  getInitialState: function () {
    return {
      isActive: false,
      bounceValue: new Animated.Value(1),
      rotateValue: new Animated.Value(0)
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

  _animatePressIn: function() {
    this.state.bounceValue.setValue(0.9);
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 0.9,
        friction: 7,
      }
    ).start();
  },

  _animatePress: function() {
    this.state.bounceValue.setValue(1.5); // start small
    Animated.parallel([
      Animated.spring(this.state.bounceValue, {
        toValue: 1,
        friction: 7,
      }),
      Animated.spring(this.state.rotateValue, {
        toValue: this.state.isActive ? 0 : 1,
        friction: 7,
      }),
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
        <Animated.Image
          source={require('./reshare.png')}
          style={{
            tintColor: (isActive) ? '#3BD47B' : tintColor,
            transform: [
              {scale: this.state.bounceValue},
              {rotate: this.state.rotateValue.interpolate({inputRange: [0, 1], outputRange: ['0deg', '180deg']})},
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
    justifyContent: 'center'
  }
});

module.exports = ReshareToggleButton;