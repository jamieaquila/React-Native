import React from 'react';
import { Animated, View, Text, Image, TextInput, TouchableOpacity, Dimensions, DeviceEventEmitter } from 'react-native';


import { connect } from 'react-redux';

import { PublishTo } from '../views';

import { Pop } from '../atoms';

class TextComposer extends React.Component {

  constructor (props) {
    super(props);

    this.state = {}
  }

  render() {
    var { auth } = this.props;
    var { user } = auth;

    return(
      <View style={{flex:1, backgroundColor: 'black'}}>
        <Text style={{color: 'white'}}>Audio</Text>
      </View>
    );
  }
}

var mapStateToProps = state => ({ currentRoute: state.route.currentRoute, auth: state.auth });

module.exports = connect(mapStateToProps)(TextComposer);
