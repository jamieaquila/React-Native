import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

class DownChevron extends React.Component {

  constructor(props) {
    super(props);

    this._popType = 'collapse';
  }

  render() {
    return(
      <TouchableOpacity
        onPress={(this.props.onPress)}
        style={styles.touchableArea}>
        <View style={styles.background}>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 15
  },
});

export default DownChevron;
