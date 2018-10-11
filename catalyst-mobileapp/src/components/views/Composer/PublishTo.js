import React from 'react';
import { Dimensions, View, Text, ScrollView, ListView, RecyclerViewBackedScrollView, TouchableOpacity } from 'react-native';


import { connect } from 'react-redux';

import { NavigationBar } from '../molecules';

class PublishTo extends React.Component {
  render() {
    return(
      <View style={{flex: 1}}>
        <NavigationBar 
          navigator={this.props.navigator}
          title={'Share With'}/>
        <ScrollView
          scrollsToTop={false}
          style={{flex: 1, backgroundColor: 'pink'}}
        >
          <View style={{flex: 1}}>
            <Text>Posts</Text>
          </View>
          <View style={{flex: 1}}>
            <Text>Messages</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default PublishTo;
