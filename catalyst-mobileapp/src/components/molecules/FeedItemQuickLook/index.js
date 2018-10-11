import React from 'react';
import { StyleSheet, View, Text, Animated, TouchableWithoutFeedback, Image, Dimensions, ActivityIndicatorIOS, Platform } from 'react-native';

import Orientation from 'react-native-orientation'

import { connect } from 'react-redux';
import { like as likeFeedItem, dislike as dislikeFeedItem } from '../../../actions/FeedItemActions';
import { create as createFeedItemReshare, destroy as deleteFeedItemReshare } from '../../../actions/FeedItemReshareActions'
import { pop as popModal } from '../../../actions/ModalActions';
import { pushRouteAtTabIndex } from '../../../actions/RouteActions';
import { FeedItemDetail } from '../../views';

import { Media, LikeToggleButton, CommentButton, ReshareButton, ShareButton, Pop } from '../../atoms';

import { TogglePlaybackButton } from '../../molecules';

import TimerMixin from 'react-timer-mixin';
import LinearGradient from 'react-native-linear-gradient';


var {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

var fadeOutTime = 200;

var deviceDimensions = Dimensions.get('window');

var FeedItemQuickLook = React.createClass({
  mixins: [TimerMixin],

  _orientationDidChange: false,
  _controlsOpacityValue: new Animated.Value(1),
  _dismissControlsTimer: null,
  _mediaIsVideo: false,
  _videoDidLoad: false,
  _videoIsPlaying: false,
  playbackButtonScaleVal: new Animated.Value(1),

  propTypes: {
    feedItem: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      width: 0,
      height: 0,
      orientation: 'PORTRAIT',
      paused: true,
      videoControlsVisible: true
    }
  },

  componentDidMount: function() {
    var { feedItem } = this.props;

    if (feedItem.image) {
      Image.getSize(this.props.feedItem.image, (width, height) => {
        this.setState({width, height});
      });
    }

    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(this._orientationDidChange);
  },

  componentWillUnmount: function() {
    Orientation.lockToPortrait();
    Orientation.removeOrientationListener(this._orientationDidChange);
    this._controlsOpacityValue.setValue(1);
  },

  _orientationDidChange: function(orientation) {
    if (orientation == 'LANDSCAPE') {
      this.setState({orientation: 'LANDSCAPE'})
    } else if (orientation == 'PORTRAIT') {
      this.setState({orientation: 'PORTRAIT'})
    }
  },

  calculateAspectRatioFit: function(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
  },

  _playVideo: function() {
    this.setState({ videoControlsVisible: false }, () => this.toggleVideoControls());
    this._videoDidLoad = true;
    this._videoIsPlaying = true;
    this.setState({paused: false});
  },

  _togglePlayback: function() {
    // console.log(this.state.paused)
    this.setState({ paused: !this.state.paused }, () => !this.state.paused && this.toggleVideoControls());
  },

  toggleVideoControls: function() {
    this.setState({ videoControlsVisible: !this.state.videoControlsVisible });
    
    if (this.state.videoControlsVisible) {
      Animated.timing(this._controlsOpacityValue, {
        toValue: 1,
        duration: fadeOutTime,
      }).start();
      this.playbackButtonScaleVal.setValue(1);
    } else {
      Animated.timing(this._controlsOpacityValue, {
        toValue: 0,
        duration: fadeOutTime,
      }).start(() => this.playbackButtonScaleVal.setValue(0.000001));
    }
  },

  onClosePress: function() {
    this.props.dispatch(popModal());
  },

  onCommentPress(feedItem) {
    const { navigator, dispatch } = this.props;
    const shouldFocusKeyboard = true

    navigator.pop();
    dispatch(pushRouteAtTabIndex(0, {
      component: FeedItemDetail,
      passProps: { feedItem, shouldFocusKeyboard }
    }));
  },

  render: function() {
    const { feedItem, dispatch, user, feed } = this.props;
    const { currentUser } = user;

    var media = this.calculateAspectRatioFit(this.state.width, this.state.height, this.state.orientation == 'PORTRAIT' ? deviceWidth : deviceHeight, this.state.orientation == 'PORTRAIT' ? deviceHeight : deviceWidth);

    return (
      <View
        onLayout={() => feedItem.media.type === 'video' ? this._mediaIsVideo = true : this._mediaIsVideo = false }
        style={styles.lightbox}
      >
        <TouchableWithoutFeedback onPress={() => this.toggleVideoControls()}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {feedItem.image && <Media
                feedItem={feedItem}
                repeat={true}
                onLoad={() => this._playVideo()}
                style={
                  {
                    alignSelf: 'center',
                    width: media.width,
                    height: media.height,
                  }
                }
                paused={this.state.paused}
                showControls={true}
                media={feedItem.media}
                mediaUrl={feedItem.image}
                onEnd={() => this.toggleVideoControls()}
              />
            }
            <Animated.View style={[ styles.controlsAndIconsContainer, {opacity: this._controlsOpacityValue} ]}>
              {feedItem.media.type === 'video' &&
                <Animated.View style={{ transform: [{ scale: this.playbackButtonScaleVal }], position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
                  <TogglePlaybackButton
                    paused={this.state.paused}
                    buffering={!this._videoDidLoad}
                    size={'large'}
                    onPress={() => this._togglePlayback()}
                  />
                </Animated.View>
              }
              <View style={styles.socialIcons}>
                <LinearGradient
                  style={styles.gradient}
                  colors={[ 'transparent', 'black' ]}
                />
                <LikeToggleButton
                  isLoading={feed.isLoading}
                  onPressActive={() => dispatch(dislikeFeedItem(feedItem.id))}
                  onPressInactive={() => dispatch(likeFeedItem(feedItem.id))}
                  isActive={(currentUser && currentUser.feedItemLikes.find(feedItemLike => feedItemLike.feedItem === feedItem.id)) ? true : false}
                  feedItem={feedItem}
                  tintColor={'white'}
                />
                {(feedItem.platform == 'facebook' || feedItem.platform == 'youtube' || feedItem.platform == 'instagram' || feedItem.platform == 'buzznog') &&
                  <CommentButton 
                    onPress={() => this.onCommentPress(feedItem)} 
                    tintColor={'white'} 
                  />
                }
                {(feedItem.platform == 'facebook' || feedItem.platform == 'twitter') &&
                <ReshareButton
                  isLoading={feed.isLoading}
                  isActive={(currentUser && currentUser.feedItemReshares.find(feedItemReshare => feedItemReshare.feedItem === feedItem.id)) ? true : false}
                  onPressActive={() => dispatch(deleteFeedItemReshare(feedItem.id))}
                  onPressInactive={() => dispatch(createFeedItemReshare(feedItem.id))}
                  tintColor={'white'}
                />}
                <ShareButton
                  tintColor={'white'}
                  url={feedItem.link || ''}
                  subject={feedItem.message || ''}
                  message={feedItem.message || ''}
                />
              </View>
              <View style={styles.popContainer}>
                <Pop
                  onPress={this.onClosePress}
                  iconType='x'
                  style={{ backgroundColor: '#16171A' }}
                />
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
})

const styles = StyleSheet.create({
  lightbox: {
    flex: 1,
    backgroundColor: 'black',
  },
  controlsAndIconsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0
  },
  playBackButtonContainer: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  popContainer: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
  },
  socialIcons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8
  },
  socialIcon: {
    tintColor: 'white',
    alignSelf: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = state => ({ user: state.user, feed: state.feed })

export default connect(mapStateToProps)(FeedItemQuickLook);
