import React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';


import LinearGradient from 'react-native-linear-gradient';

var deviceWidth = Dimensions.get('window').width;

var ScrollableOverflowText = React.createClass({
  getInitialState: function() {
    return {
      titleTextWidth: 0,
    }
  },

  _renderTitle: function() {
    if(this.state.titleTextWidth > deviceWidth * 0.5) {
      return (
        <View style={{flex: 1}}>
          <ScrollView 
            scrollsToTop={false}
            horizontal 
            directionalLockEnabled
            style={this.props.scrollViewStyle}
            contentContainerStyle={this.props.scrollViewContentContainerStyle}
          >
            <Text style={this.props.textStyle}>{this.props.text}</Text>
          </ScrollView>
          <LinearGradient
            pointerEvents='none'
            start={[0.0, 0.5]} end={[1.0, 0.5]}
            style={styles.gradient}
            colors={['transparent', 'black']}
          />
        </View>
      )
    } else {
      return (
        <View style={{alignItems:'center'}}>
          <Text style={this.props.textStyle}>{this.props.text}</Text>
        </View>
      )
    }
  },

  render: function() {
    return (
      <View style={{flex: 1, paddingTop: 10}}>
        <Text 
          onLayout={e => this.setState({titleTextWidth: e.nativeEvent.layout.width})}
          style={[ this.props.textStyle, {position: 'absolute', height: 0, opacity: 0} ]}
        >
          {this.props.text}
        </Text>
        {this._renderTitle()}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 40,
    backgroundColor: 'transparent',
  },
});

export default ScrollableOverflowText;
