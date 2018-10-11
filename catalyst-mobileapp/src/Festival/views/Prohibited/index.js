import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { NavigationBar } from '../../../components/molecules';

import DataItems from './data.json';

class Prohibited extends Component {
  render() {
    const { navigator } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <NavigationBar
          navigator={navigator}
          title="Allowed Items"
        />
        <ScrollView>
          <View>
            { DataItems.map((item, index) => (
              <Text style={{color: 'white', margin: 10}} key={index}>
                {item}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Prohibited;