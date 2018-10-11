import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Dimensions, Animated, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import { NavigationBar, TracksList } from '../../molecules';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class Album extends React.Component {

  render() {
    const { album, musicPlayer } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Image
            style={styles.backgroundImage}
            blurRadius={80}
            source={{uri: album.imageUrl }}
          />
          <ScrollView
            scrollsToTop={false}
            style={{ width: Dimensions.get('window').width }}
            style={styles.contentContainer}
            contentContainerStyle={{paddingBottom: 56 }}
          >
            <View style={{ alignItems: 'center', marginVertical: 88, marginBottom: 24, }}>
              <Image
                style={[ styles.albumArtImage, { opacity: album.locked ? 0.4 : 1 } ]}
                source={{uri: album.imageUrl }}
              />
              { album.locked &&
                <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, }}>
                  <Image
                    style={{ tintColor: 'white' }}
                    source={require('./lock.png')}
                  />
                </View>
              }
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}/>
            <TracksList
              highlightActiveTrack={true}
              showPlaybackControls={false}
              musicPlayer={musicPlayer}
              shouldPlayAlbum={true}
              showAlbumArt={false}
              tracks={album.tracks}
              showLockIcon={false}
              showClockIcon={false}
            />
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}/>
          </ScrollView>
          <NavigationBar
            style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)'}}
            navigator={this.props.navigator}
            title={album.name}
          />
        </View>
      </View>
    );
  }
}

Album.propTypes = {
  album: React.PropTypes.object.isRequired
}

var styles = StyleSheet.create({
  contentContainer: {
    // paddingTop: 200
  },
  text: {
    color: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: -deviceHeight * .25,
    width: deviceHeight,
    height: deviceHeight,
    opacity: 0.8
  },
  albumArtImage: {
    width: deviceWidth * 0.75,
    height: deviceWidth * 0.75,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.2
  },
});

const mapStateToProps = state => ({ musicPlayer: state.musicPlayer });

export default connect(mapStateToProps)(Album);
