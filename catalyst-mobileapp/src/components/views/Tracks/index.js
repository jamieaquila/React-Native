import React from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native';

import { NavigationBar, TracksList } from '../../molecules';

import { colors } from '../../../config';

import { connect } from 'react-redux';

class Tracks extends React.Component {
  render() {

    var { tracks, musicPlayer, app } = this.props;

    return (
      <View style={[styles.container, {backgroundColor: colors.grayDarkest} ]}>
        <NavigationBar 
          navigator={this.props.navigator}
          title="All Songs"
        />
        <ScrollView
          scrollsToTop={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollInnerContainerStyle}>
          <TracksList
            musicPlayer={musicPlayer}
            tracks={tracks.data}
            hasPadding={false}
          />
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollInnerContainerStyle: {
    paddingBottom: 56,
  },
});

var mapStateToProps = state => ({ tracks: state.tracks, musicPlayer: state.musicPlayer, app: state.app });
export default  connect(mapStateToProps)(Tracks);
