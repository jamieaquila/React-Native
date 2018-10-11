import React from 'react';
import { View, ScrollView, Text, Image, Dimensions, Animated, TouchableHighlight, TouchableOpacity, PanResponder, StyleSheet, Easing, Slider, Linking, TimerMixin, Platform, NativeModules } from 'react-native';
import { connect } from 'react-redux';

import StreamingKit from 'react-native-streamingkit';

import Video from 'react-native-video';
import { colors } from '../../../config';
import LinearGradient from 'react-native-linear-gradient';

// actions
import { play, pause, queue, nextTrack, previousTrack, nextRepeatMode, shuffleOn, shuffleOff, setState, seekToTime, setInterruptionState, toggleMiniMode} from '../../../actions/MusicPlayerActions'
import { like as likeTrack, dislike as dislikeTrack } from '../../../actions/TrackActions'
import { changeTab, pushRouteAtTabIndex, replaceRouteStackAtTabIndex } from '../../../actions/RouteActions'
import { push as pushModal } from '../../../actions/ModalActions'
import { show, hide } from '../../../actions/StatusBarActions'

// helpers
import moment from 'moment';
import 'moment-duration-format';

// first party components
import { Album } from '../../views'
import { TogglePlaybackButton, ScrollableMetadata, TracksList } from '../../molecules';
import { Pop, RepeatModeButton, ShuffleToggleButton, LikeToggleButton, ShareButton, EllipsisActionSheet } from '../../atoms';

const { SpotifyManager } = NativeModules;

import { isIphoneX } from 'react-native-iphone-x-helper'

var AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

var {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

var MusicPlayer = React.createClass({
  mixins: [TimerMixin],

  _expanded: false,
  _musicPlayerIsInMiniMode: false,
  _currentTimeTimer: null,
  _rotationAngle: new Animated.Value(0),
  _runOnceVariable: 0,
  _animateMiniModeTimer: null,
  _trackMetaDataOpacityVal: new Animated.Value(1),
  _collapsedPlayerWidthVal: new Animated.Value(deviceWidth),
  _trackScrollViewOpacity: new Animated.Value(0),
  _currentTime: new Animated.Value(0),
  _canPan: true,
  _audioManagerSubscriber: null,

  getInitialState: function() {
    return {
      currentTime: 0,
      lyricsVisible: false,
      trackDuration: 0,
    }
  },

  componentDidMount: function() {
    const { dispatch } = this.props;

    this._lastPos = this.props.collapsedPos;
    this.props.pos.addListener((value) => { this._lastPos = value.value; })
    
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) && this._canPan;
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.props.pos.setOffset(this._lastPos);
        this.props.pos.setValue(0); 
      },
      onPanResponderMove: (nativeEvent, gestureState) => {
        if (this._expanded && gestureState.dy >= 0) this.props.pos.setValue(gestureState.dy);
        if (!this._expanded && gestureState.dy <= 0) this.props.pos.setValue(gestureState.dy);
      },
      onPanResponderRelease: (e, gestureState) => {
        this.props.pos.flattenOffset();

        if (gestureState.dy < -50 && !this._expanded) {
          this._expand();
        } else if (gestureState.dy > 50 && this._expanded) {
          this._collapse();
        } else {
          (this._expanded) ? this._expand() : this._collapse()
        }
      }
    });

    //MPRemoteCommandCenter.addListener(this._remoteCommandListener);
    StreamingKit.addListener(this._streamingKitListener);
    this._currentTimeTimer = setInterval(this._syncCurrentTime, 500);

    this._animateMiniModeTimer = setTimeout(this._collapseToSmallestPlayer, 2000);

    this._rotationAngleAnimation = Animated.timing(this._rotationAngle, {
      toValue: 360000,
      duration: 5000000,
      easing: Easing.linear
    });
  },

  componentWillUnmount: function() {
    StreamingKit.removeListener(this._streamingKitListener);
    //MPRemoteCommandCenter.removeListener(this._remoteCommandListener);
    clearInterval(this._currentTimeTimer);
  },

  _streamingKitListener: function (event) {
    const { dispatch, musicPlayer } = this.props;

    switch (event.type) {
      case "playerStateChange":
        dispatch(setState(event.playerState));
      break;
      case "audioSessionInterruptionBegan":
        if (musicPlayer.state === 'playing') {
          dispatch(pause());
          dispatch(setInterruptionState(true));
        }
      break;
      case "audioSessionInterruptionEnded":
        if (musicPlayer.wasInterrupted) dispatch(play());
        dispatch(setInterruptionState(false));
      break;
      case "didFinishPlayingEof":
        this._nextTrack(false);
      break;
    }
  },

  _remoteCommandListener: function(event) {
    const { dispatch } = this.props;
    const { currentTime } = this.state;

    switch(event) {
      case "play": 
        dispatch(play(currentTime));
        break;
      case "pause":
        dispatch(pause(currentTime));
        break;
      case "nextTrack":
        this._nextTrack(true);
        break;
      case "previousTrack":
        this._previousTrack();
        break;
    }
  },

  _togglePlayback: function() {
    var { musicPlayer, dispatch } = this.props;
    var { currentTime } = this.state;

    (musicPlayer.state == 'paused') ? dispatch(play(currentTime)) : dispatch(pause(currentTime));  
  },

  _toggleShuffle: function() {
    var { musicPlayer, dispatch } = this.props;

    (musicPlayer.shuffle) ? dispatch(shuffleOff()) : dispatch(shuffleOn())
  },

  _nextTrack: function(didUserPress = true) {
    var { dispatch, musicPlayer } = this.props;

    this._currentTime.setValue(0);
    this.setState({ currentTime: 0 });
    dispatch(nextTrack(didUserPress))
  },

  _previousTrack: function() {
    var { dispatch } = this.props;

    this._currentTime.setValue(0);
    this.setState({ currentTime: 0 });
    dispatch(previousTrack())
  },

  _nextRepeatMode: function() {
    var { dispatch } = this.props;
    dispatch(nextRepeatMode())
  },

  _gotoAlbum: function(album) {
    const { dispatch } = this.props

    this._collapse();
    dispatch(changeTab(1));
    dispatch(pushRouteAtTabIndex(1, 
      { component: Album, passProps: { album } }
    ));
  },

  _expand: function() {
    this.props.dispatch(hide())
    Animated.timing(this.props.pos, {
      toValue: this.props.expandedPos,
      duration: 250,
      easing: Easing.bezier(0.22, 0.61, 0.36, 1)
    }).start();
    this._expanded = true;
    if (this.state.lyricsVisible) this._canPan = false;
  },

  _collapse: function() {
    this.props.dispatch(show())
    Animated.timing(this.props.pos, {
      toValue: this.props.collapsedPos,
      duration: 250,
      easing: Easing.bezier(0.22, 0.61, 0.36, 1)
    }).start();
    this._expanded = false;
    this._canPan = true;
  },

  _collapseToSmallestPlayer: function() {
    var { dispatch, musicPlayer } = this.props;

    dispatch(toggleMiniMode())

    this._musicPlayerIsInMiniMode = !this._musicPlayerIsInMiniMode

    if(this._musicPlayerIsInMiniMode) {
      Animated.parallel([
        Animated.spring(this._collapsedPlayerWidthVal, {
          toValue: 72,
          friction: 10,
          tension: 80,
        }),
        Animated.timing(this._trackMetaDataOpacityVal, {
          toValue: 0,
          duration: 50
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(this._collapsedPlayerWidthVal, {
          toValue: deviceWidth,
          tension: 80,
          overshootClamping: true
        }),
        Animated.timing(this._trackMetaDataOpacityVal, {
          toValue: 1,
          duration: 50
        })
      ]).start();
    }
  },

  _startRotationAnimation: function() {
    if(this._runOnceVariable == 0 && typeof this._rotationAngleAnimation !== 'undefined') {
      this._rotationAngleAnimation.start();
      this._runOnceVariable = 1;
    }
  },

  _stopRotationAnimation: function() {
    this._rotationAngle.stopAnimation();
    this._runOnceVariable = 0;
  },

  _stopRotationAnimationAndResetToZero: function() {
    this._rotationAngle.stopAnimation();
    this._rotationAngle.setValue(0);
    this._runOnceVariable = 0;
  },

  _toggleLyricsVisbility: function() {
    if(!this.state.lyricsVisible) {
      Animated.timing( this._trackScrollViewOpacity, {
        toValue: 1,
        duration: 200
      }).start();
      this.setState({lyricsVisible: true});
      this._canPan = false
    } else {
      Animated.timing( this._trackScrollViewOpacity, {
        toValue: 0,
        duration: 200
      }).start();
      this.setState({lyricsVisible: false});
      this._canPan = true
    }
  },

  _seekToTime: function(time) {
    const { dispatch } = this.props;

    this.setState({ currentTime: time });
    this._currentTime.setValue(time);
    dispatch(seekToTime(time));
  },

  _syncCurrentTime: function () {
    const { musicPlayer } = this.props;
    if (musicPlayer.state === 'playing' ) {
      const setProgress = progress => {
        this._currentTime.setValue(progress);
        this.setState({ currentTime: progress });
      }

      if(musicPlayer.streamType === 'spotify') {
        SpotifyManager.getPosition(progress => {
          setProgress(progress);
        });
      } else {
        StreamingKit.getProgress((err, progress) => {
          setProgress(progress);
        });
      }
    }
  },

  render: function() {
    const { currentTime } = this.state;
    const { musicPlayer, tracks, user, albums, app } = this.props;
    const { currentTrack } = musicPlayer;

    var interpolatedPos = this.props.pos.interpolate({
      inputRange: [0, this.props.collapsedPos],
      outputRange: [0, this.props.collapsedPos]
    })

    var interpolatedExpandedOpacity = this.props.pos.interpolate({
      inputRange: [0, this.props.collapsedPos], 
      outputRange: [1, 0]
    });

    var interpolatedCollapsedOpacity = this.props.pos.interpolate({
      inputRange: [0, this.props.collapsedPos], 
      outputRange: [0, 1]
    });

    if (currentTrack !== false) {

      var track = tracks.data.find(track => currentTrack === track.id);
      var album = albums.data.find(album => track.album.id === album.id);
      var { duration } = track;
      var shareLink = app && app.settings && `${app.settings.shareHost}/Tracks/${track.id}` || '';
      var shareMessage;

      if (track.artist && track.name) {
        shareMessage = `Check out this new track by ${track.artist}, ${track.name}!`;
      } else {
        shareMessage = `Check out this new track`;
      }

      this._albumArtLeftPos = this._currentTime.interpolate({
        inputRange: [0, duration],
        outputRange: [0, -(Dimensions.get('window').height - Dimensions.get('window').width)],
        extrapolate: 'clamp'
      });

      musicPlayer.state == 'playing' ? this._startRotationAnimation() : musicPlayer.state == 'stopped' ? this._stopRotationAnimationAndResetToZero() : this._stopRotationAnimation();

      var ellipsisActions = [];
      if (track.itunesLink  && Platform.OS === 'ios') ellipsisActions.push({ name: "Buy on iTunes", action: () => Linking.openURL(track.itunesLink) })
      ellipsisActions.push({ name: "Open Album", action: () => this._gotoAlbum(album) })
      
      // View is not ready yet, notification pressed
      if(typeof this._panResponder === 'undefined') return (<View />);

      return(
          <Animated.View
            shouldRasterizeIOS={true}
            pointerEvents={this.props.musicPlayer.miniMode ? 'box-none' : 'auto'}
            {...this._panResponder.panHandlers}
            style={[styles.animatedContainer, 
              {
                transform: [
                  { translateY: interpolatedPos } 
                ] 
              }
            ]}>

            <Image blurRadius={80} style={styles.blurredArtworkBackground} source={{ uri: track.imageUrl }}/>
            <View style={[styles.blurredArtworkBackground, {backgroundColor: 'rgba(0,0,0,0.6)'}]} />
            <Image
              style={styles.albumArtwork}
              source={{ uri: track.imageUrl }}
            />
              <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' activeOpacity={1} onPress={() => this._expand()}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8 }}>
                  <Image blurRadius={80} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} source={{ uri: track.imageUrl }}/>
                  <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                  <View style={{ height: 50, width: 50, position: 'absolute', top: 0, bottom: 0, right: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <TogglePlaybackButton
                      buffering={(musicPlayer.state == 'buffering')}
                      paused={(musicPlayer.state == 'paused')}
                      size="small"
                      backgroundColor='rgba(255,255,255,0.2)'
                      onPress={() => this._togglePlayback()}/>
                  </View>
                  <Animated.View
                    shouldRasterizeIOS={true}
                    style={{ transform: [{ rotate: this._rotationAngle.interpolate({inputRange: [0, 360], outputRange: ['0deg', '360deg']}) }], }}>
                    <Image
                      style={
                        { 
                          height: 40,
                          width: 40,
                          borderRadius: 20,
                        }
                      }
                      source={{ uri: track.imageUrl }} />
                  </Animated.View>
                  <Animated.View pointerEvents="none" style={{marginLeft: 8}}>
                    <Text style={{ fontSize: 13, letterSpacing: -0.078, fontWeight: '600', color: 'white', shadowOffset: { width: 0, height: 0, }, shadowColor: 'black', shadowOpacity: 0.2 }}>{track.name}</Text>
                    <Text style={{ fontSize: 11, letterSpacing: 0.066, color: 'white', shadowOffset: { width: 0, height: 0, }, shadowColor: 'black', shadowOpacity: 0.2 }}>{track.artist}</Text>
                  </Animated.View>
                  <View style={{ width: (currentTime / duration) * deviceWidth, height: 1, position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(255,255,255,0.5)' }} />
                </View>
              </TouchableHighlight>

              <View style={{ flex: 4, marginTop: deviceWidth, width: deviceWidth, backgroundColor: 'transparent', }}>
                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginRight: 8, }}>
                  <ScrollableMetadata
                    trackName={track.name}
                    trackArtist={track.artist}
                  />
                </View>

                <View style={{flex: 2, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 8, paddingRight: 8,}}>
                  <View style={{ justifyContent: 'center' }}>
                    <ShuffleToggleButton
                      shuffle={musicPlayer.shuffle}
                      onPress={() => this._toggleShuffle()}
                    />
                  </View>
                  <TouchableOpacity style={{alignSelf: 'center', padding: 16}} onPress={() => this._previousTrack()}>
                    <Image source={require('./previous.png')}/>
                  </TouchableOpacity>
                  <TogglePlaybackButton
                    buffering={(musicPlayer.state == 'buffering')}
                    paused={(musicPlayer.state == 'paused')}
                    size={'xlarge'}
                    style={{alignSelf: 'center'}}
                    backgroundColor='rgba(255,255,255,0.1)'
                    onPress={() => this._togglePlayback()}
                    onPressIn={() => this._canPan = false}
                    onPressOut={() => this._canPan = true}
                  />
                  <TouchableOpacity style={{ alignSelf: 'center', padding: 16 }} onPress={() => this._nextTrack()}>
                    <Image source={require('./next.png')}/>
                  </TouchableOpacity>
                  <View style={{ justifyContent: 'center' }}>
                    <RepeatModeButton 
                      onPress={() => this._nextRepeatMode()} 
                      currentRepeatMode={musicPlayer.repeatMode} 
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPressIn={() => this._canPan = false}
                  onPressOut={() => this._canPan = true}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.songTime}>{moment.duration(currentTime, 'seconds').format('m:ss', { trim: false })}</Text>
                    <Slider
                      {...this.props}
                      maximumValue={duration}
                      onSlidingComplete={value => this._seekToTime(value)}
                      maximumTrackTintColor={'rgba(255,255,255,0.12)'}
                      minimumTrackTintColor='rgba(255,255,255,0.8)'
                      value={currentTime}
                      thumbImage={require('./scrubber.png')}
                      style={{width: Dimensions.get('window').width - 104}}/>
                    <Text style={styles.songTime}>{moment.duration(duration - currentTime, 'seconds').format('m:ss', { trim: false })}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {track.lyrics &&
                <Animated.View
                  pointerEvents={this.state.lyricsVisible ? 'auto' : 'none'}
                  style={[styles.lyricsContainer, {opacity: this._trackScrollViewOpacity} ]}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'black']}
                    locations={[0,0.7]}
                    style={styles.lyricsContainerGradientBackground}
                  />
                  <ScrollView
                    scrollsToTop={false}
                    contentContainerStyle={{ marginTop: 120, marginHorizontal: 16, paddingBottom: deviceWidth }}
                  >
                    <Text style={styles.lyrics}>
                      {track.lyrics.replace(/\n\s*/g, "\n\n")}
                    </Text>
                  </ScrollView>
                  <LinearGradient
                    pointerEvents='none'
                    colors={['black', 'transparent']}
                    style={styles.lyricsFadeIn}
                  />
                  <LinearGradient
                    pointerEvents='none'
                    colors={['transparent', 'black']}
                    style={styles.lyricsFadeOut}
                  />
                </Animated.View>
              }
              
              <View style={styles.iconGroup}>
                <LikeToggleButton
                  smallIcon
                  tintColor="rgba(255,255,255,0.4)"
                  isLoading={tracks.isLoading}
                  isActive={(user.currentUser && user.currentUser.trackLikes.find(trackLike => trackLike.track === currentTrack)) ? true : false}
                  onPressActive={() => this.props.dispatch(dislikeTrack(currentTrack))} 
                  onPressInactive={() => this.props.dispatch(likeTrack(currentTrack))} 
                />
                {track.lyrics &&
                  <TouchableOpacity
                    onPress={() => this._toggleLyricsVisbility() }
                    style={{ padding: 16 }}
                    activeOpacity={0.8}>
                    <Image style={{ tintColor: this.state.lyricsVisible ? 'white' : 'rgba(255,255,255,0.4)' }} source={require('./lyrics.png')}/>
                  </TouchableOpacity>
                }
                <ShareButton 
                  smallIcon
                  tintColor="rgba(255,255,255,0.4)"
                  url={shareLink}
                  subject={track.name || ''}
                  message={shareMessage}
                />
                <EllipsisActionSheet
                  actions={ellipsisActions}
                  tintColor='rgba(255,255,255,0.4)'
                  title={track.name + ' by ' + app.name}
                />
              </View>

              <View style={{ position: 'absolute', top: isIphoneX() ? 68 : 48, left: 0 }}>
                <Pop
                  onPress={() => this._collapse()}
                  iconType='chevron'
                  style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}/>
              </View>
          </Animated.View>
      );
    } else {
      return null;
    }
  }
});

var styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    top: 0,
    height: Dimensions.get('window').height + 50,
    backgroundColor: 'transparent'
  },
  lyricsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  lyricsContainerGradientBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  lyricsFadeIn: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'transparent',
  },
  lyricsFadeOut: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: 'transparent',
  },
  lyrics: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0.1,
    color: 'white',
  },
  albumArtwork: {
    position: 'absolute',
    top: isIphoneX() ? 70 : 50,
    width: deviceWidth,
    height: deviceWidth,
  },
  blurredArtworkBackground: {
    position: 'absolute',
    bottom: 0,
    width: deviceWidth,
    height: deviceWidth + 50,
    transform: [{ scale: -1 }]
  },
  mainControls: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignSelf: 'center', 
    alignItems: 'center'
  },
  prevNextControls: {
    padding: 16,
  },
  songTime: {
    alignSelf: 'center',
    width: 52,
    padding: 8,
    fontSize: 11,
    textAlign: 'center',
    color: 'white',
  },
  iconGroup: {
    flex: 1,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 8,
    paddingRight: 8
  },
  icons: {
    alignSelf: 'center'
  }
});


const mapStateToProps = state => ({ musicPlayer: state.musicPlayer, tracks: state.tracks, albums: state.albums, user: state.user, app: state.app });

export default connect(mapStateToProps)(MusicPlayer);
