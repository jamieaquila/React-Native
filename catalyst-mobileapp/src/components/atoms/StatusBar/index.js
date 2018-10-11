import React from 'react';
import { StatusBar as RNStatusBar, View, StyleSheet } from 'react-native';

import { hide } from '../../../actions/StatusBarActions';
import { connect } from 'react-redux';

var LinearGradient = require('react-native-linear-gradient');

class StatusBar extends React.Component {

  isNetworkActivityIndicatorVisible(props) {
    var keys = Object.keys(props);
    var i = 0;
    while (keys[i]) {
      if (props[keys[i]].isLoading) return true;
      i++;
    }
    return false
  }

  render() {
    const { statusBar } = this.props;
    
    return (
      <View style={styles.statusBar}>
        <RNStatusBar 
          networkActivityIndicatorVisible={this.isNetworkActivityIndicatorVisible(this.props)}
          barStyle={statusBar.style}
          hidden={statusBar.hidden} 
          animated={true}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 23,
    backgroundColor: 'transparent'
  },
});

const mapStateToProps = state => state;

export default connect(mapStateToProps)(StatusBar);
