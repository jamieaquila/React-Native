import React from 'react';
import { Image, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';

import { connect } from 'react-redux';

// actions
import { playAlbum, pause } from '../../../actions/MusicPlayerActions';

// helpers
import { dateFormat } from '../../../helpers';

// first party components
import { Album as AlbumView } from '../../views';
import { TogglePlaybackButton } from '../../molecules';

var deviceWidth = Dimensions.get('window').width;

class AlbumCards extends React.Component {

  static propTypes = {
    albums: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.any.isRequired
  };

  imagePress(album) {
    this.props.navigator.push({
      component: AlbumView,
      passProps: { album }
    })
  }

  _togglePlayback(targetAlbum) {
    var { musicPlayer, dispatch } = this.props;

    if (musicPlayer.currentAlbum === targetAlbum.id && musicPlayer.state == 'playing') {
      dispatch(pause())
    } else {
      dispatch(playAlbum(targetAlbum))
    }
  }

  renderClockOrLockIcon(album) {
    if (album.locked) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'transparent', }}>
          <Image
            style={{ tintColor: 'white' }}
            source={require('./lock.png')}
            defaultSource={require('./lock.png')}
          />
        </View>
      )
    } else if (Date.parse(album.releaseDate) > Date.now()) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'transparent', }}>
          <Image
            style={{ tintColor: 'white' }}
            source={require('./clock.png')}
            defaultSource={require('./clock.png')}
          />
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    var { albums, navigator, musicPlayer } = this.props

    return (
      <View style={styles.containerStyle}>
        {
          albums.map((album, index) => {
            return (
              <View key={index}>
                <View>
                  <TouchableHighlight onPress={() => this.imagePress(album)}>
                    <View style={{ marginRight: (index == albums.length - 1) ? 0 : 8 }}>
                      <View>
                        <Image
                          style={[ styles.albumArtImageStyle, { opacity: album.locked ? 0.4 : 1 } ]}
                          source={{uri: album.imageUrl}}
                        />
                        { this.renderClockOrLockIcon(album) }
                      </View>
                      <View style={styles.albumMetaContainer}>
                        <Image
                          style={{ transform: [{ scale: 5 }], position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, resizeMode: 'contain' }}
                          blurRadius={40}
                          source={{uri: album.imageUrl}}
                        />
                        <Text
                          style={styles.albumName}
                          numberOfLines={1}>
                          {album.name}
                        </Text>
                        <Text
                          style={styles.albumArtistDate}
                          numberOfLines={1}>
                          {album.artist} • {dateFormat(new Date(album.releaseDate), "yyyy")}
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                  { !album.locked &&
                    <View style={styles.playbackButtonContainer}>
                      <TogglePlaybackButton
                        size="large"
                        backgroundColor='rgba(0,0,0,0.8)'
                        buffering={(musicPlayer.currentAlbum === album.id && musicPlayer.state == 'buffering') ? true : false}
                        paused={(musicPlayer.currentAlbum === album.id && musicPlayer.state != 'paused') ? false : true}
                        onPress={() => this._togglePlayback(album)}/>
                    </View>
                  }
                </View>
              </View>
              );
            })
          }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
  },
  albumArtImageStyle: {
    width: deviceWidth * 0.6,
    height: deviceWidth * 0.6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  albumMetaContainer: {
    overflow: 'hidden',
    width: deviceWidth * 0.6,
    padding: 16,
    backgroundColor: 'transparent'
  },
  albumName: {
    marginBottom: 2,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  albumArtistDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  playbackButtonContainer: {
    position: 'absolute',
    bottom: 76,
    right: 16,
    backgroundColor: 'transparent',
  },
});

export default connect()(AlbumCards);
