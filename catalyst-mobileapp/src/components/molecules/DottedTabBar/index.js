'use strict';

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';


var styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },

  tabs: {
    // position: 'absolute',
    // top: Dimensions.get('window').width * 0.5,
    // height: 50,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderTopWidth: 0,
    // borderLeftWidth: 0,
    // borderRightWidth: 0,
    // borderBottomColor: '#ccc',
  },
});

var DefaultTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    underlineColor : React.PropTypes.string,
    backgroundColor : React.PropTypes.string,
    activeTextColor : React.PropTypes.string,
    inactiveTextColor : React.PropTypes.string,
  },

  renderDot(name, page) {
    var isTabActive = this.props.activeTab === page;
    return (
      <View style={{ width: 8, height: 8, margin: 4, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)' }}/>
    );
  },

  render() {
    var containerWidth = this.props.containerWidth;
    var numberOfTabs = this.props.tabs.length;
    var tabUnderlineStyle = {
      position: 'absolute',
      width: 4,
      height: 4,
      backgroundColor: this.props.underlineColor || "navy",
      bottom: 0,
      borderRadius: 2
    };

    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], 
      outputRange: [(Dimensions.get('window').width / 2) - 8,  (Dimensions.get('window').width / 2) + 8]
    });

    return (
      <View style={[styles.tabs, {backgroundColor : this.props.backgroundColor || null}, this.props.style, ]}>
        {this.props.tabs.map((tab, i) => this.renderDot(tab, i))}
        <Animated.View style={[tabUnderlineStyle, {left}]} />
      </View>
    );
  },
});

module.exports = DefaultTabBar;