import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Animated, Dimensions, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux';

import { getFeed, startRefreshing, appendFeedItems } from '../../../actions/FeedActions';

import { FeedItems, NavigationBar } from '../../molecules';
import { InfiniteScrollView } from '../../atoms';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class Feed extends React.Component {
  _scrollViewPos = new Animated.Value(0);
  _lastScrollViewPos = 0;
  _currentScrollViewYTopPos = 0;
  _heroImageScaleValue = 1;
  _heroImageTranslateYValue = 0;
  _blurOpacityVal =  new Animated.Value(0);
  _heroImageTextOpacityValue = 1;

  state = {
    isLoading: false,
    isRefreshing: false,
    isDisplayingError: false,
    refreshControlMarginTopVal: deviceWidth * 0.6,
    scrollViewContentMarginTopVal: -deviceWidth * 0.6,
  };

  _onScroll(e) {
    const { y } = e.nativeEvent.contentOffset

    this._scrollViewPos.setValue(y)

    if(this._lastScrollViewPos > deviceHeight - 50) this._currentScrollViewYTopPos = y;
    this._lastScrollViewPos = y

    var dy = this._lastScrollViewPos - y
    dy = dy * -1
    this.props.onScroll(e, dy)

    if(y < -1) this.setState({refreshControlMarginTopVal: deviceWidth * 0.6, scrollViewContentMarginTopVal: -deviceWidth * 0.6});
    else this.setState({refreshControlMarginTopVal: 0, scrollViewContentMarginTopVal: 0});
  }

  _loadMoreFeedItems() {
    this.props.dispatch(appendFeedItems(this.props.feed.id))
  }

  onRefresh() {
    var { dispatch } = this.props;

    dispatch(startRefreshing());
    dispatch(getFeed(this.props.feed.id));
  }

  render() {
    const { feed, isLoading, isRefreshing, tabLabel, navigator, playVideos, app } = this.props;
    // console.log(lighshowTrigger.trigger)
    this._heroImageTranslateYValue = this._scrollViewPos.interpolate({
      inputRange: [0, deviceWidth],
      outputRange: [0, -80],
      extrapolate: 'clamp'
    });

    this._blurOpacityVal = this._scrollViewPos.interpolate({
      inputRange: [0, deviceWidth * 0.75],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    this._heroImageTextTranslateYValue = this._scrollViewPos.interpolate({
      inputRange: [0, deviceWidth],
      outputRange: [0, -32],
      extrapolate: 'clamp'
    });

    this._heroImageTextOpacityValue = this._scrollViewPos.interpolate({
      inputRange: [0, deviceWidth * 0.7, deviceWidth * 0.9],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp'
    });

    return (
      
      <View style={{ flex: 1 }}>        
        <Image
          style={styles.heroImage}
          source={{uri: feed.imageUrl}}
          />
        <Animated.View shouldRasterizeIOS={true} style={[ styles.heroImageContainer, {opacity: this._blurOpacityVal} ]}>
          <Image
            blurRadius={80}
            style={styles.heroImage}
            source={{uri: feed.imageUrl}}
            />
        </Animated.View>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={{ position: 'absolute', top: deviceWidth / 2 - 64, bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' }}/>
        <InfiniteScrollView
          style={{paddingTop: 40, marginTop: this.state.refreshControlMarginTopVal}}
          contentContainerStyle={{paddingTop: deviceWidth, marginTop: this.state.scrollViewContentMarginTopVal}}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={16}
          onBottomHit={() => this._loadMoreFeedItems(feed.id)}
          canLoadMore={feed.canLoadMore}
          removeClippedSubviews={true}
          onRefresh={() => this.onRefresh()}
          showsVerticalScrollIndicator={false}
          >
          <Animated.View
            shouldRasterizeIOS={true}
            style={
              {
                opacity: this._heroImageTextOpacityValue,
                position: 'absolute',
                top: deviceWidth - 90,
                left: 16,
                backgroundColor:'transparent'
              }
            }
            >
            <View style={{ width: 80, height: 4, marginBottom: 8, backgroundColor: app.styles.primaryColor }}/>
            <Text style={styles.heroByline}>{feed.description}</Text>
            <Text style={styles.heroTitle}>{tabLabel.toUpperCase()}</Text>
          </Animated.View>
          <FeedItems
            layout={feed.layout}
            items={feed.feedItems}
            itemType={feed.name}
            navigator={navigator}
            playVideos={playVideos}
          />
          <View style={{ alignItems: 'center', margin: 80 }}>
            {feed.canLoadMore === false && <Image style={[styles.buzznogLogo, { tintColor: app.styles.primaryColor }]} source={ require('./logomark.png') }/>}
            {isLoading && <ActivityIndicator
              animating={true}
              color='white'
              size='large'
            />}
          </View>
        </InfiniteScrollView>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbarBorderBottom: {
    position: 'absolute',
    top: 64,
    width: 375,
    height: 2,
    backgroundColor: 'rgba(255,255,255,.12)'
  },
  heroImageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: 'white',
  },
  heroByline: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    color: 'white',
  },
  buzznogLogo: {
    alignSelf: 'center',
  },
});

const mapStateToProps = state => ({ app: state.app });

export default connect(mapStateToProps)(Feed);
