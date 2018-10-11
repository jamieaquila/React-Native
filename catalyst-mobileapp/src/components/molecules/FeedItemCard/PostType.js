import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableHighlight, Dimensions, Animated, Easing, Linking, WebView, Platform } from 'react-native';
import { connect } from 'react-redux';

import AutoLink from 'react-native-autolink';
import SafariView from 'react-native-safari-view';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../../config';

import { titleCase, shortNumber, calculateConstrainedDimensions } from '../../../helpers';
import { Media, TimeSince, SocialMediaBadge, LikeToggleButton, CommentButton, ReshareButton, ShareButton } from '../../atoms';
import { VideoPlayer, ProfileMediaObject, FeedItemQuickLook, TogglePlaybackButton, SocialPostStats } from '../../molecules';
import { FeedItemDetail } from '../../views';

import { push, replace } from '../../../actions/RouteActions';
import { push as pushModal } from '../../../actions/ModalActions';
import { like as likeFeedItem, dislike as dislikeFeedItem } from '../../../actions/FeedItemActions';
import { create as createFeedItemReshare, destroy as deleteFeedItemReshare } from '../../../actions/FeedItemReshareActions'
import { setStyle as setStatusBarStyle } from '../../../actions/StatusBarActions';

var deviceDimensions = Dimensions.get('window');

class PostType extends React.Component {

  cameraFilmRotation = new Animated.Value(0);

  state = {
    imageDimensions: {
      width: deviceDimensions,
      height: deviceDimensions / 2
    }
  }

  static propTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    var { feedItem } = this.props;

    if (!!feedItem.image) {
      Image.getSize(feedItem.image, (width, height) => {
        const imageDimensions = { width, height };

        this.setState({ imageDimensions });
      });
    }
  }

  // componentDidMount() {
  //   this.rotateCameraFilm();
  // }

  // rotateCameraFilm() {
  //   this.cameraFilmRotation.setValue(0);

  //   Animated.timing(this.cameraFilmRotation, {
  //     toValue: 1,
  //     duration: 1000,
  //     easing: Easing.elastic()
  //   }).start(() => this.rotateCameraFilm());
  // }

  onPress(feedItem, itemType) {
    var { navigator, dispatch } = this.props;

    navigator.push({
      component: FeedItemDetail,
      passProps: { feedItem, navigator, itemType }
    });
  }

  onMediaPress(feedItem, seekPos) {
    if (feedItem.platform === 'youtube' && Platform.OS === 'android') {
      this.openLink(`https://www.youtube.com/watch?v=${feedItem.sourceId}`);
    } else {
      this.props.dispatch(pushModal({
        component: FeedItemQuickLook,
        passProps: { feedItem }
      }));
    }
  }

  onCommentPress(feedItem, shouldFocusKeyboard) {
    const { navigator, dispatch } = this.props;
    // const shouldFocusKeyboard = true
    var shouldScrollToBottom = shouldFocusKeyboard;
    navigator.push({
      component: FeedItemDetail,
      passProps: { feedItem, navigator, shouldFocusKeyboard, shouldScrollToBottom }
    });
   /* dispatch(push(navigator, {
      tabIndex: 0,
      component: FeedItemDetail,
      passProps: { feedItem, navigator, shouldFocusKeyboard }
    }));*/
  }

  onLinkPress(url) {
    this.openLink(url);
  }

  openLink(url) {
    var { dispatch } = this.props;

    if (url.indexOf('mailto:') === 0 || url.indexOf('tel:') === 0) return Linking.openURL(url);
    SafariView.isAvailable()
    .then(() => {
      SafariView.show({ url });
      SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
      SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
    })
    .catch(error => Linking.openURL(url));
  }

  renderYouTube() {
    const { feedItem } = this.props;
    var videoWidth = deviceDimensions.width - 12;
    var imageDimensions = calculateConstrainedDimensions(this.state.imageDimensions, deviceDimensions);

    if (Platform.OS === 'ios') {
      return <WebView
        scrollEnabled={false}
        source={{ html: '<html><body><iframe width="' + videoWidth + '" height="' + (videoWidth / 16) * 9 + '" src="https://cdn.buzznog.com/buzznogapi/youtubeEmbed.html#' + feedItem.sourceId + '" frameborder="0" allowfullscreen></iframe></body></html>' }}
        style={{ left: -4, alignSelf: 'center', width: videoWidth, height: (videoWidth / 16) * 9 }}
      />
    } else {
      return (
        <TouchableWithoutFeedback onPress={() => feedItem.type === 'post' ? this.onMediaPress(feedItem) : this.openLink(feedItem.media.url || feedItem.link)}>
          <View>
            <Image
                source={{uri: feedItem.image}}
                style={[styles.media,
                  {
                    width: imageDimensions.width - 20,
                    height: imageDimensions.height - 20
                  },
                  !feedItem.message && { marginTop: 12 }
                ]}
            >
              {(feedItem.media && feedItem.media.type === 'video') &&
              <TogglePlaybackButton backgroundColor='rgba(0,0,0,0.75)' />
              }
            </Image>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  render() {
    const { feed, feedItem, isLiked, isReshared, dispatch, playVideos, app, itemType } = this.props;
    var shareLink = app && app.settings && `${app.settings.shareHost}/FeedItems/${feedItem.id}` || '';

    var imageDimensions = calculateConstrainedDimensions(this.state.imageDimensions, deviceDimensions);
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => this.onPress(feedItem, itemType)}
          underlayColor={'rgba(0,0,0,0.05)'}
        >
          <View style={{ marginBottom: 16 }}>
            <ProfileMediaObject
              appName = {app.name}
              userName={feedItem.userName}
              imageURL={feedItem.userProfileImage}
              timestamp={feedItem.createdAt}
              platform={feedItem.platform}
              itemType={itemType}
            />
          </View>
        </TouchableWithoutFeedback>
        {feedItem.media !== null && feedItem.platform !== 'youtube' &&
          <TouchableWithoutFeedback onPress={() => feedItem.type === 'post' ? this.onMediaPress(feedItem) : this.openLink(feedItem.media.url || feedItem.link)}>
            <View>
              <Image
                  source={{uri: feedItem.image}}
                  style={[styles.media,
                    {
                      width: imageDimensions.width - 20,
                      height: imageDimensions.height - 20
                    },
                    !feedItem.message && { marginTop: 12 }
                  ]}
              >
                {(feedItem.media && feedItem.media.type === 'video') &&
                <TogglePlaybackButton backgroundColor='rgba(0,0,0,0.75)' />
                }
              </Image>
            </View>
          </TouchableWithoutFeedback>
        }
        {feedItem.media !== null && feedItem.platform === 'youtube' && this.renderYouTube()}
        {(feedItem.transcoderJobId && feedItem.transcoderJobStatus !== 'completed') &&
          <View>
            <View style={styles.transcodingStateOverlay} />
            <View style={styles.transcodingStateContainer}>
              <Image
                  style={styles.transcodingStateCameraImage}
                  defaultSource={require('./video-camera-body.png')}
                  source={require('./video-camera-body.png')}
              >
                <Image
                    style={[
                      styles.transcodingStateFilmImage,
                      // { transform: [{ rotate: this.cameraFilmRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }
                    ]}
                    defaultSource={require('./video-camera-film.png')}
                    source={require('./video-camera-film.png')}
                />
                <Image
                    style={[
                      styles.transcodingStateFilmImage,
                      { marginLeft: 4 },
                      // { transform: [{ rotate: this.cameraFilmRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] }) }] }
                    ]}
                    defaultSource={require('./video-camera-film.png')}
                    source={require('./video-camera-film.png')}
                />
              </Image>
              <Text style={styles.transcodingStateTitle}>Video processing...</Text>
              <Text style={styles.transcodingStateCopy}>Your fans will see this when it's done.</Text>
            </View>
          </View>
        }
        {
          feedItem.message !== null && 
          <View style={[(feedItem.platform === 'buzznog' && feedItem.media === null && !feedItem.transcoderJobId) && { alignItems: 'center', paddingTop: 80, paddingBottom: 80, margin: 2, marginTop: 16, backgroundColor: app.styles.primaryColor }]}>
            <AutoLink
              onPress={(link) => this.onLinkPress(link)}
              style={[styles.socialPostText, {color: colors.grayDark}, (feedItem.platform === 'buzznog' && feedItem.media === null && !feedItem.transcoderJobId) && styles.socialPostTextAlt]}
              linkStyle={{ color: app.styles.primaryColor }}
              text={feedItem.message}
            />
          </View>
        }
        <SocialPostStats
          platform={feedItem.platform}
          likes={feedItem.likes}
          shares={feedItem.shares}
          comments={feedItem.comments}
          commentStatus={(feedItem.platform == 'facebook' /*|| feedItem.platform == 'youtube'*/ || feedItem.platform == 'instagram' || feedItem.platform == 'buzznog') ? true : false}
          onPress={() => this.onCommentPress(feedItem, false)}
        />
        <View style={[styles.socialIcons, feedItem.platform === 'youtube' && { justifyContent: 'center' }]}>
          {feedItem.platform !== 'youtube' && feedItem.platform !== 'facebook' &&
            <LikeToggleButton
              isLoading={feed.isLoading}
              isActive={isLiked}
              onPressActive={() => dispatch(dislikeFeedItem(feedItem.id))}
              onPressInactive={() => dispatch(likeFeedItem(feedItem.id))}
            />
          }
          {(feedItem.platform == 'facebook' /*|| feedItem.platform == 'youtube'*/ || feedItem.platform == 'instagram' || feedItem.platform == 'buzznog') &&
            <CommentButton onPress={() => this.onCommentPress(feedItem, true)} />
          }
          {(feedItem.platform == 'facebook' || feedItem.platform == 'twitter') &&
            <ReshareButton
              isLoading={feed.isLoading}
              isActive={isReshared}
              onPressActive={() => dispatch(deleteFeedItemReshare(feedItem.id))}
              onPressInactive={() => dispatch(createFeedItemReshare(feedItem.id))}
            />
          }
          <ShareButton
            url={shareLink}
            subject={feedItem.message || ''}
            message={feedItem.message || ''}
          />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 40
  },
  socialPostTextAlt: {
    margin: 16,
    fontSize: 21,
    lineHeight: 30,
    letterSpacing: -0.4,
    color: 'white',
  },
  socialPostText: {
    margin: 16,
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: -0.1,
  },
  media: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8
  },
  socialIconLabel: {
    marginLeft: -4,
    marginRight: 24,
    fontSize: 12,
    color: '#999',
  },
  transcodingStateOverlay: {
    position: 'absolute',
    top: -200,
    bottom: -200,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 2,
    borderTopLeftRadius: 40
  },
  transcodingStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    marginVertical: 16,
    backgroundColor: 'black'
  },
  transcodingStateCameraImage: {
    flexDirection: 'row',
    marginBottom: 16,
    tintColor: 'white'
  },
  transcodingStateFilmImage: {
    marginTop: 3,
    marginLeft: 3,
    tintColor: 'white'
  },
  transcodingStateTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: 'white'
  },
  transcodingStateCopy: {
    lineHeight: 22,
    textAlign: 'center',
    color: '#FFFFFF99'
  }
});

const mapStateToProps = state => ({ feed: state.feed, app: state.app })

export default connect(mapStateToProps)(PostType);