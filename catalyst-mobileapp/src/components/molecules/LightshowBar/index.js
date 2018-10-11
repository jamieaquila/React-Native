import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  TextInput ,
  AsyncStorage
} from 'react-native';

import { startLightshowTrigger } from '../../../actions/LightshowTriggerAction'
import { isIphoneX } from 'react-native-iphone-x-helper'

var deviceWidth = Dimensions.get('window').width;

var LightshowBar = React.createClass({
 
  getDefaultProps: function() {
    return {
      showBackButton: true,
      showUserInfo: true,
      showSettingsGear: false,
    }
  },

  onBtnPress: function() {
  }, 

  render: function() {

    return (
      <TouchableOpacity style={styles.barContainer} onPress={() => {
        this.props.onPress()
        }}>
        <Text style={{color:'white', fontSize:13}}>Lightshow In Progress. Click Here to Join!</Text>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    width: '100%',
    top:isIphoneX() ? 20 : 0,
    left:0,
    backgroundColor: '#00ce74',
    height: 32,
    zIndex:1,
    alignItems:'center',
    justifyContent:'center', 
  }
});

export default LightshowBar;