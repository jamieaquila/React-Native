import React from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, TextInput, InteractionManager, DeviceEventEmitter, Animated, Easing, Keyboard, Platform, Linking, WebView } from 'react-native';

import TimerMixin from 'react-timer-mixin';

import { connect } from 'react-redux';
import { Media, TimeSince, SocialMediaBadge, LikeToggleButton, ReshareButton, ShareButton, CommentButton } from '../../atoms';
import { titleCase, shortNumber } from '../../../helpers';

import { push as pushModal } from '../../../actions/ModalActions'
import { like as likeFeedItem, dislike as dislikeFeedItem, findComment, createComment } from '../../../actions/FeedItemActions'
import { create as createFeedItemReshare, destroy as deleteFeedItemReshare } from '../../../actions/FeedItemReshareActions'
import { setStyle as setStatusBarStyle } from '../../../actions/StatusBarActions';

import AutoLink from 'react-native-autolink';
import SafariView from 'react-native-safari-view';

import { NavigationBar, ProfileMediaObject, FeedItemQuickLook, FeedItemComment, SocialPostStats, TogglePlaybackButton } from '../../molecules';

import { colors } from '../../../config';

var {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

var deviceDimensions = Dimensions.get('window');

class FeedItemDetail extends React.Component {

  state = {
    width: 0,
    height: 0,
    comment: '',
    textInputHeight: 32,
    textInputContainerHeight: new Animated.Value(0),
    keyboardHeight: 0,
    commentsContentOffsetYVal: 0,
  }
  contentHeight = 0
  scrollViewHeight = 0

  componentWillMount() {
    const { dispatch, feedItem, navigator, shouldFocusKeyboard, shouldScrollToBottom  } = this.props

    InteractionManager.runAfterInteractions(() => {
      dispatch(findComment(feedItem));
    });

    if (feedItem.image !== null) {
      Image.getSize(feedItem.image, (width, height) => {
        this.setState({width, height});
      }); 
    }

    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

    this.navigatorListener = this.props.navigator.navigationContext.addListener('willfocus', event => {
      if (event._currentTarget._currentRoute.root) this.commentTextInput.blur();
    });   
  }

  componentDidMount() {
   if (this.props.shouldScrollToBottom) {
          setTimeout(() => {
            this.scrollToBottom(true);
            if (this.props.shouldFocusKeyboard)
            this.commentTextInput.focus();
          },250);
     }
  }

  componentWillUnmount() {
    this.navigatorListener.remove();
  }

  calculateAspectRatioFit(srcWidth, srcHeight) {
    var ratio = Math.min(deviceWidth / srcWidth, deviceHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
  }

  _showFeedItemQuickLook(feedItem) {
    this.props.dispatch(pushModal({
      component: FeedItemQuickLook,
      passProps: { feedItem }
    }));
  }

  _getTitleFromSourceType(sourceType) {
    switch(sourceType)
    {
      case "twitter":
        return "Tweet"
      case "facebook":
        return "Post"
      default:
        return "Post"
    }
  }

  onLinkPress(url) {
    var { dispatch } = this.props;

    SafariView.show({ url });
    SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
    SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
  }

  createComment = () => {
    let { feedItem, dispatch } = this.props;
    let comment = this.state.comment;

    if(comment) {
      dispatch(createComment(feedItem, comment));
      this.setState({comment: ''});
    }

    this.scrollView.scrollTo({ x: 0, y: this.state.commentsContentOffsetYVal, animated: true });
  }

  onCommentPress() {
    this.commentTextInput.focus();
  }

  keyboardWillShow(e) {
    var newSize = -e.endCoordinates.height;

    Animated.timing(this.state.textInputContainerHeight, {
      toValue: newSize + 50,
      duration: e.duration + 100,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
    if (this.props.shouldScrollToBottom) {
      this.setState({keyboardHeight: e.endCoordinates.height});
        setTimeout(() => {
          const scrollHeight = this.contentHeight - this.scrollViewHeight;
          if(this.scrollView) {
            this.scrollView.scrollTo({ x: 0, y: scrollHeight, animated: true });
          }
        }, 500);
    }
  }

  keyboardWillHide(e) {
    Animated.timing(this.state.textInputContainerHeight, {
      toValue: 0,
      duration: e.duration - 100,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
    if (this.props.shouldScrollToBottom) {
     this.setState({keyboardHeight: 0 });
    }
  }

  measureCommentContentOffsetY(contentOffsetY) {
    this.setState({commentsContentOffsetYVal: contentOffsetY});
  }
  scrollToBottom(animated = true) {
 
    const scrollHeight = this.contentHeight - this.scrollViewHeight;

    if (scrollHeight > 0) {
      this.scrollView.scrollTo({ x: 0, y: scrollHeight, animated: animated });
    }
  }
  render() {
    const { feedItem, navigator, user, dispatch, feed, app } = this.props;
    const { currentUser } = user;

    var media = this.calculateAspectRatioFit(this.state.width, this.state.height);
    var videoWidth = deviceWidth - 12;

    return (
      <View style={{ flex: 1 }}>
        <NavigationBar
          navigator={navigator}
          title={this._getTitleFromSourceType(feedItem.sourceType)}
        />
        <View style={styles.container}>

            <ScrollView
              scrollsToTop={false}
              ref={(scrollView) => this.scrollView = scrollView}
              contentContainerStyle={{paddingBottom: 74 + this.state.keyboardHeight}}
              onContentSizeChange={(w, h) => this.contentHeight = h}
              onLayout={ev => this.scrollViewHeight = ev.nativeEvent.layout.height}>
              <ProfileMediaObject
                appName= {app.name}
                userName={feedItem.userName}
                imageURL={feedItem.userProfileImage}
                timestamp={feedItem.createdAt}
                platform={feedItem.platform}
                itemType={this.props.itemType}
              />
              {feedItem.message !== null &&
              <AutoLink
                onPress={(link) => this.onLinkPress(link)}
                style={[styles.socialPostText, {color: colors.grayDark}, feedItem.platform == 'buzznog' && !feedItem.image && styles.socialPostTextAlt]}
                linkStyle={{ color: app.styles.primaryColor }}
                text={feedItem.message}
              />
              }
              {feedItem.media !== null && feedItem.platform !== 'youtube' &&
                <Media 
                  style={[{ width: media.width, height: media.height }, !feedItem.message && { marginTop: 16 }]}
                  media={feedItem.media}
                  feedItem={feedItem}
                  muted={true}
                  onPress={() => this._showFeedItemQuickLook(feedItem)}
                />
              }
              {feedItem.media !== null && feedItem.platform === 'youtube' &&
                Platform.OS === 'ios' &&
                  <WebView
                    scrollEnabled={false}
                    source={{ html: '<html><body><iframe width="' + deviceWidth + '" height="' + (deviceWidth / 16) * 9 + '" src="https://cdn.buzznog.com/buzznogapi/youtubeEmbed.html#' + feedItem.sourceId + '" frameborder="0" allowfullscreen></iframe></body></html>' }}
                    style={{ left: -4, alignSelf: 'center', width: deviceWidth, height: (deviceWidth / 16) * 9 }}
                  />
              }
              {feedItem.media !== null && feedItem.platform === 'youtube' &&
                Platform.OS !== 'ios' &&
                  <TouchableWithoutFeedback onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${feedItem.sourceId}`)}>
                    <View>
                      <Image
                        source={{uri: feedItem.image}}
                        style={[{ alignItems: 'center', justifyContent: 'center', width: media.width, height: media.height }, !feedItem.message && { marginTop: 16 }]}
                      >
                        {(feedItem.media && feedItem.media.type === 'video') &&
                        <TogglePlaybackButton backgroundColor='rgba(0,0,0,0.75)' />
                        }
                      </Image>
                    </View>
                  </TouchableWithoutFeedback>
              }
              <SocialPostStats
                platform={feedItem.platform}
                likes={feedItem.likes}
                shares={feedItem.shares}
                comments={feedItem.comments}
              />
              <View style={[styles.socialIcons, feedItem.platform === 'youtube' && { justifyContent: 'center' }]}>
                {feedItem.platform !== 'youtube' && <LikeToggleButton
                  isLoading={feed.isLoading}
                  onPressActive={() => dispatch(dislikeFeedItem(feedItem.id))}
                  onPressInactive={() => dispatch(likeFeedItem(feedItem.id))}
                  isActive={(currentUser && currentUser.feedItemLikes.find(feedItemLike => feedItemLike.feedItem === feedItem.id)) ? true : false}
                  feedItem={feedItem}
                />}
                {(feedItem.platform == 'facebook' || feedItem.platform == 'twitter') &&
                <ReshareButton
                  isLoading={feed.isLoading}
                  isActive={(currentUser && currentUser.feedItemReshares.find(feedItemReshare => feedItemReshare.feedItem === feedItem.id)) ? true : false}
                  onPressActive={() => dispatch(deleteFeedItemReshare(feedItem.id))}
                  onPressInactive={() => dispatch(createFeedItemReshare(feedItem.id))}
                />}
                {(feedItem.platform == 'facebook' /*|| feedItem.platform == 'youtube'*/ || feedItem.platform == 'instagram' || feedItem.platform == 'buzznog') &&
                  <CommentButton onPress={() => this.onCommentPress(feedItem)} />
                }
                <ShareButton
                  url={feedItem.link || ''}
                  subject={feedItem.message || ''}
                  message={feedItem.message || ''}
                />
              </View>
              <View style={[styles.horizontalRule, {backgroundColor: colors.grayLighter} ]}/>
              <View onLayout={e => this.measureCommentContentOffsetY(e.nativeEvent.layout.y)}>
                {
                  feedItem.commentList && feedItem.commentList.map((comment, i) => {
                    return (
                      <View key={i}>
                        <FeedItemComment
                          message={comment.message}
                          createdAt={comment.createdAt}
                          platform={feedItem.platform}
                          name={comment.name}
                          profileImageUrl={comment.profileImageUrl}
                        />
                      </View>
                    );
                  }).reverse()
                }
              </View>
            </ScrollView>
            <Animated.View style={[ styles.animatedTextInputContainer, {top: this.state.textInputContainerHeight, borderTopColor: colors.grayLighter} ]}>
              <View style={styles.textInputAndSubmitButtonOutterContainer}>
                <View style={styles.textInputAndSubmitButtonInnerContainer}>
                  <View style={{ flex: 10 }}>
                    <TextInput
                      ref={ref => this.commentTextInput = ref}
                      multiline={true}
                      onChange={(event) => {
                        this.setState({
                          comment: event.nativeEvent.text,
                          textInputHeight: event.nativeEvent.contentSize.height,
                        });
                      }}
                      placeholder={"Write a comment…️"}
                      placeholderTextColor={colors.gray}
                      selectionColor={app.styles.primaryColor}
                      style={[styles.textInput,
                        {
                          height: Math.max(32, this.state.textInputHeight < 120 ? this.state.textInputHeight : 120),
                          color: colors.grayDark,
                          borderWidth: 1,
                          borderColor: colors.grayLighter
                        }
                      ]}
                      value={this.state.comment}
                      underlineColorAndroid={colors.grayLight}
                    />
                  </View>
                  <View style={{ flex: 2 }}>
                    <TouchableOpacity
                      onPress={this.createComment}
                      activeOpacity={this.state.comment ? 0.4 : 1}
                      style={styles.submitButton}
                    >
                      <Text style={[styles.submitText, { color: colors.grayLighter }, this.state.comment && {color: app.styles.primaryColor}]}>Post</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
        </View>
      </View>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  socialPostText: {
    // flex: 1,
    margin: 16,
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  socialPostStatsText: {
    flex: 1,
    paddingBottom: 16,
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    fontSize: 12,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  horizontalRule: {
    height: 2,
    marginTop: 8,
    marginBottom: 8,
  },
  accountHandle: {
    marginBottom: 8,
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)'
  },
  profileImage: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,.08)',
    borderRadius: 24,
    justifyContent: 'flex-end'
  },
  animatedTextInputContainer: {
    justifyContent: 'center',
    height: 50,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopWidth: 1
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700'
  },
  textInputAndSubmitButtonOutterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 12
  },
  textInputAndSubmitButtonInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    fontSize: 15,
    // lineHeight: 19, Doesn't work yet for textInput
    // letterSpacing: -0.1, Doesn't work yet for textInput
    borderRadius: 4,
    paddingTop: 2,
    paddingLeft: 8
  }
})

const mapStateToProps = state => ({ user: state.user, feed: state.feed, app: state.app });

export default connect(mapStateToProps)(FeedItemDetail);
