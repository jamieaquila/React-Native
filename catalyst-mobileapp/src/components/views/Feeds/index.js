import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Animated, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';

import ExtraDimensions from 'react-native-extra-dimensions-android';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { getFeeds, appendFeedItems } from '../../../actions/FeedActions';

import { Feed, FeedItems, FeedsTabBar } from '../../molecules';
import { InfiniteScrollView, ScrollableTabBar } from '../../atoms';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var statusBarHeightAndroid = ExtraDimensions.get('STATUS_BAR_HEIGHT');

var Feeds = React.createClass({

  _scrollViewPos: new Animated.Value(0),
  _translateYVal: new Animated.Value(0),
  _scrollViewHorizontalPos: new Animated.Value(0),
  _customAnimatedValue: new Animated.Value(0),

  defaultProps: {
    windowHeight: 2,
    distanceToLoadMore: 400,
    horizontal: false,    
  },

  getInitialState: function() {
    return {
      playVideos: true,
      delayInitialRender: true,
      activatePage: 0
    }
  },

  componentWillMount: function() {
    const { dispatch, navigator } = this.props;
    dispatch(getFeeds());
    navigator.navigationContext.addListener('didfocus', (e) => {
      this.setState({ playVideos: (e._data.route.root) ? true : false })
    });
    setTimeout(() => this.setState({ delayInitialRender: false }), 1000);
  },

  _animateNavBar: function(e) {
    this._scrollViewPos.setValue(e.nativeEvent.contentOffset.y);

    if(this._scrollViewPos._value <= 0) {
      Animated.spring(this._translateYVal, {
        toValue: 0,
        friction: 11,
        tension: 96,
        overshootClamping: true
      }).start();
    } else {
      Animated.spring(this._translateYVal, {
        toValue: (Platform.OS === 'ios') ? -44 : -statusBarHeightAndroid - 44,
        friction: 11,
        tension: 96,
        overshootClamping: true
      }).start();
    }
  },

  _getTabs: function(objArr){
    let tabNames = []
    for(var i = 0 ; i < objArr.length ; i++){
      tabNames.push(objArr[i].name.toUpperCase());
    }    
    return tabNames
  },

  render: function() {
    var { feed, navigator, auth } = this.props;
    var { playVideos, delayInitialRender } = this.state;
    return (
      <View style={{ flex: 1 }}>       
        {(feed.items.length > 0 && !delayInitialRender) &&
          <ScrollableTabView
            onScroll={() => Animated.spring(this._translateYVal, {toValue: 0, friction: 11, tension: 80 }).start()}
            tabBarPosition='overlayTop'
            renderTabBar={() => 
              <ScrollableTabBar
                underlineHeight={0}
                textStyle={{ color: 'rgba(255,255,255,0.4)', fontWeight: '600', fontSize: 13, letterSpacing: 0.8 }}
                activeTextStyle={{ color: 'white', fontWeight: '600' }}
                containerStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.6)',  
                  borderWidth: 0, 
                  height: 64, 
                  transform: [{ translateY: (feed.items.length == 1) ? -44 : this._translateYVal }]  }}
              /> 
            }
            >
            {
              feed.items.map((item, index) => {
                return (
                  <Feed 
                    onScroll={(e, dy) => this._animateNavBar(e)}
                    isLoading={this.props.feed.isLoading} 
                    navigator={navigator}
                    feed={item}
                    key={index}
                    tabLabel={item.name.toUpperCase()}
                    playVideos={playVideos}
                  />
                );
              })
            }
          </ScrollableTabView>
        }
      </View>
    );
  }
})

const styles = StyleSheet.create({
  paginationOuterContainer: {
    position: 'absolute',
    bottom: 50,
    width: deviceWidth,
    height: 24,
    backgroundColor: 'transparent',
  },
  paginationInnerContainer: {
    height: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    margin: 4,
    borderRadius: 4,
  },
  paginationDotSelector: {
    position: 'absolute',
    top: 4,
    width: 16,
    height: 16,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 8,
  }
});

const mapStateToProps = (state) => ({ feed: state.feed, auth: state.auth });

export default connect(mapStateToProps)(Feeds);
