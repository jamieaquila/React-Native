import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, findNodeHandle } from 'react-native';


import { BlurView } from 'react-native-blur';

class DownChevron extends React.Component {

  constructor(props) {
    super(props);

    this._popType = 'collapse';
  }

  state = {
    viewRef: 0
  }

  dropdownLoaded() {
    this.setState({viewRef: findNodeHandle(this.refs.dropdown)})
  }

  render() {
    return(
      <TouchableOpacity
        onPress={(this.props.onPress)}
        style={styles.touchableArea}>
        <View style={styles.background} ref={'dropdown'} onLoadEnd={this.dropdownLoaded.bind(this)}>
          <BlurView
              blurRadius={10}
              downsampleFactor={5}
              overlayColor={'rgba(255, 255, 255, 0.1)'}
              style={styles.blurViewContainer}
              viewRef={100}
          />
          {this.props.iconType == 'chevron' &&
            <View style={{ marginTop: 1 }}>
              <Image style={{ tintColor: 'white' }} source={require('./chevron.png')} />
            </View>
          }
          {this.props.iconType == 'x' &&
            <View>
              <Image style={{ tintColor: 'white' }} source={require('./x.png')} />
            </View>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

DownChevron.propTypes = {
  onPress: React.PropTypes.func.isRequired
}

var styles = StyleSheet.create({
  chevronRectangle1: {
    transform: [{rotate: '-45deg'}],
    top: 4,
    left: -2.25,
    width: 2,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 1
  },
  chevronRectangle2: {
    transform: [{rotate: '45deg'}],
    top: -4,
    right: -2.25,
    width: 2,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 1
  },
  xRectangle1: {
    transform: [{rotate: '-45deg'}],
    top: 6,
    width: 2,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 1
  },
  xRectangle2: {
    transform: [{rotate: '45deg'}],
    top: -6,
    width: 2,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 1
  },
  touchableArea: {
    width: 56,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    overflow: 'hidden',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    opacity: 0.6,
    borderRadius: 15
  },
  blurViewContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DownChevron;
