import React from 'react';
import { View, Text, Dimensions, Animated, StyleSheet } from 'react-native';


class ScrollableMetadata extends React.Component {
  constructor(props) {
    super(props);

    this._measureMetadataWidth = new Animated.Value(0);

    this.state = { offset: 0 }
  }

  setOffsetValue() {
    var offset = -(this._measureMetadataWidth._value - Dimensions.get('window').width * .6) / 2;
    this.setState({offset: offset})
  }

  render() {
    return(
      <View style={{ alignItems: 'center' }} onLayout={(e) => { this._measureMetadataWidth.setValue(e.nativeEvent.layout.width); this.setOffsetValue(); } }>
        <Text numberOfLines={1} style={styles.trackName}>{this.props.trackName}</Text>
        <Text style={styles.trackArtist}>{this.props.trackArtist}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  trackName: {
    marginBottom: 4,
    color: 'white',
    fontSize: 19,
    fontWeight: '600',
    
  },
  trackArtist: {
    color: 'white',
    
  }
});

export default ScrollableMetadata;
