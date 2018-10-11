import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  ActionSheetIOS,
  Linking,
  Platform,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import Auth from '../../views/RedeemCode/Auth';

// helpers
import dateFormat from 'dateformat';

// actions
import { playTrack, playTrackInAlbum, play, pause } from '../../../actions/MusicPlayerActions';
import { changeTab, pushRouteAtTabIndex, replaceRouteStackAtTabIndex } from '../../../actions/RouteActions'
import { push as pushModal } from '../../../actions/ModalActions';
import { pop as popModal } from '../../../actions/ModalActions';

// first party components
import { Album, AlbumAndTrackUnlock, ConnectSpotify } from '../../views'
import { TogglePlaybackButton, ActionSheetForTrack } from '../../molecules';
import { EllipsisActionSheet } from '../../atoms';
import Share from 'react-native-share';
import moment from 'moment';

class TracksList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTrack: new Animated.Value(0),
      spotifyModalOpened: false
    };
  }
  

  componentWillReceiveProps(nextProps) {
    // Check for new auth strategy
    let justAuthed = false;

    if(nextProps.user && nextProps.user.currentUser) {
      if(this.props.user.currentUser == null && nextProps.user.currentUser != null) justAuthed = true;
      else if (
        this.props.user.currentUser.authStrategies.length
        !== nextProps.user.currentUser.authStrategies.length
      ) {
        justAuthed = true;
      }
    }

    if (justAuthed && nextProps.user.currentUser.authStrategyTypes.spotify) {
      if(this.state.spotifyModalOpened) {
        this.setState({ spotifyModalOpened: false });
        this.props.dispatch(popModal());
      }
    }
  }
  

  _togglePlayback() {
    var { musicPlayer, dispatch } = this.props;

    (musicPlayer.state == 'paused') ? dispatch(play()) : dispatch(pause())
  }

  activeTrack() {
    Animated.timing(this.state.activeTrack, {
      toValue: 1
    }).start();
  }

  _showShareActionSheetForTrack(track) {
    var settings = this.props.app.settings;

    var url = settings.shareHost + '/Tracks/' + track.id || '';
    var message = track.name || '';
    var title = track.name || '';

    Share.open({
      url: url,
      message: message,
      subject: title,
    },(e) => {
      console.log(e);
    });
  }

  _gotoAlbum(album) {
    const { dispatch } = this.props;

    dispatch(changeTab(1));
    dispatch(pushRouteAtTabIndex(1,
      { component: Album, passProps: { album } }
    ));
  }

  _unlockTrack(album, track) {
    const { dispatch } = this.props;

    dispatch(pushModal({ component: AlbumAndTrackUnlock, passProps: { album, track }}));
  }

  _openSpotifyTrack(album, track) {
    const { dispatch, user, shouldPlayAlbum } = this.props;
    let spotifyStrategy = null;

    // Check if user is logged in
    if (!user.currentUser) {
      dispatch(pushModal({ component: Auth, passProps: { album } }));
      return;
    }

    // Check if user is loged in to spotify
    if (user.currentUser && user.currentUser.authStrategyTypes.spotify) {
      (shouldPlayAlbum) ? dispatch(playTrackInAlbum(track, album)) : dispatch(playTrack(track));
      return;
    }

    // Open spotify modal
    this.attemptedTrack = track;
    this.attemptedAlbum = album;
    this.setState({ spotifyModalOpened: true });
    dispatch(pushModal({
      component: ConnectSpotify,
      passProps: { album, track, onClose: () => this.setState({ spotifyModalOpened: false }) } 
    }));
  }

  renderClockOrLockIcon(track) {
    if (track.locked) {
      return (
        <View style={styles.lockIconContainer}>
          <Image
            style={{ tintColor: 'white' }}
            source={require('./lock.png')}
            defaultSource={require('./lock.png')}
          />
        </View>
      )
    } else if (Date.parse(track.releaseDate) > Date.now()) {
      return (
        <View style={styles.lockIconContainer}>
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
    var { tracks, albums, showAlbumArt, musicPlayer, dispatch, shouldPlayAlbum, showPlaybackControls, highlightActiveTrack, hasPadding, app } = this.props;
    return (
      <View>
      {
        tracks.map((track, index) => {
          var trackColor = {color: 'white'};
          if (highlightActiveTrack) {
            trackColor = musicPlayer.currentTrack === track.id ? {color: 'rgba(255,255,255,0.5)'} : trackColor
          }
          var album = albums.data.find(album => {
            if (track.album.id) return track.album.id === album.id;
            return track.album === album.id
          });

          var ellipsisActions = [];
          if (track.itunesLink && Platform.OS === 'ios') ellipsisActions.push({ name: "Buy on iTunes", action: () => Linking.openURL(track.itunesLink).catch(err => {
            // console.log(err)
          })  
          });

          ellipsisActions.push({ name: "Share", action: () => this._showShareActionSheetForTrack(track) });
          if (!shouldPlayAlbum) ellipsisActions.push({ name: "Open Album", action: () => this._gotoAlbum(album) });

          return (
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'rgba(255,255,255,0.1)'}
              key={index}
              onPress={() => {
                if (track.locked) {
                  this._unlockTrack(album, track);
                } else if (new Date(track.releaseDate) > new Date()) {
                  Alert.alert(track.name, 'Listen to this track ' + moment(track.releaseDate).fromNow() + '!');
                } else if (track.spotifyTrackUrl) {
                  this._openSpotifyTrack(album, track);
                } else {
                  (shouldPlayAlbum) ? dispatch(playTrackInAlbum(track, album)) : dispatch(playTrack(track));
                }
              }}
            >
              <View style={[styles.innerTrackContainer, (index === tracks.length - 1) ? {} : styles.listViewBorder, hasPadding ? {paddingTop: 8, paddingBottom: 8} : {} ]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  { showAlbumArt &&
                    <View style={{ marginRight: 12, backgroundColor: 'black' }}>
                      <Image
                        style={[ styles.artImage, { opacity: track.locked ? 0.5 : (new Date(track.releaseDate) > Date.now()) ? 0.5 : 1 } ]}
                        source={{uri: track.album.imageUrl}}
                      />
                    </View>
                  }
                  { this.props.showClockIcon && this.renderClockOrLockIcon(track) }
                  { (showPlaybackControls && musicPlayer.currentTrack === track.id) && (Date.parse(track.releaseDate) < Date.now()) &&
                    <View style={{ position: 'absolute', top: 14, left: 14, backgroundColor: 'transparent' }}>
                      <TogglePlaybackButton
                        buffering={musicPlayer.state == 'buffering'}
                        paused={musicPlayer.state == 'paused'}
                        size={'small'}
                        backgroundColor='rgba(0,0,0,0.8)'
                        onPress={() => this._togglePlayback()}
                      />
                    </View>
                  }
                  <View style={{ flex: 1, flexDirection: 'row', opacity: track.locked ? 0.4 : (Date.parse(track.releaseDate) > Date.now()) ? 0.4 : 1, }}>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                      <Text style={[ styles.trackName, trackColor ]}>{track.name}</Text>
                      <Text style={styles.trackMeta}>{track.artist} • {dateFormat(new Date(track.releaseDate), 'yyyy')}</Text>
                    </View>
                    <View
                      pointerEvents={track.locked ? 'none' : 'auto'}
                      style={styles.ellipsisContainer}
                    >
                      <EllipsisActionSheet
                        actions={ellipsisActions}
                        title={track.name + ' by ' + app.name}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            );
          })
        }
        </View>
      );
  }
}

TracksList.propTypes = {
  tracks: React.PropTypes.array.isRequired,
  showAlbumArt: React.PropTypes.bool,
  shouldPlayAlbum: React.PropTypes.bool,
  activeTrack: React.PropTypes.any
}

TracksList.defaultProps = {
  showAlbumArt: true,
  shouldPlayAlbum: false,
  showPlaybackControls: true,
  highlightActiveTrack: false,
  hasPadding: true,
  showLockIcon: true,
  showClockIcon: true
}

var styles = StyleSheet.create({
  artImage: {
    width: 56,
    height: 56,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  innerTrackContainer: {
    flex: 1,
    paddingRight: 8,
    marginLeft: 16,
  },
  listViewBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  trackName: {
    marginBottom: 2,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.24,
    color: 'white',
  },
  trackMeta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  trackNumber: {
    marginRight: 16,
    color: 'white'
  },
  lockIconContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  ellipsisContainer: {
    flex: 2,
    alignItems: 'flex-end',
  }
});

const mapStateToProps = state => ({ albums: state.albums, app: state.app, user: state.user })

export default connect(mapStateToProps)(TracksList);
