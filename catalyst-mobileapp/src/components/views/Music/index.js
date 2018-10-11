import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Dimensions, Animated, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';


import ScrollableTabView from 'react-native-scrollable-tab-view';

import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../config';

import { connect } from 'react-redux';

import { Tracks, AlbumAndTrackUnlock } from '../../views'
import { TracksList, AlbumCards, TogglePlaybackButton, NavigationBar } from '../../molecules';

import { getTracks } from '../../../actions/TrackActions';
import { getAlbums } from '../../../actions/AlbumActions';
import { togglePlayback } from '../../../actions/MusicPlayerActions';
import { push as pushModal } from '../../../actions/ModalActions';

var {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

class Music extends React.Component {
  _scrollY = new Animated.Value(0);
  _translateYVal = new Animated.Value(0);

  static state = { activeSlide: 0 }

  componentWillMount() {
    this.props.dispatch(getTracks());
    this.props.dispatch(getAlbums());
  }

  _setActiveTab(activeIndex) {
    this.setState({activeSlide: activeIndex})
    // console.log(activeIndex)
  }

  renderLockOrClockIcon(album) {
    if (album.locked) {
      return (
        <Image
          style={{ tintColor: 'white' }}
          source={require('./lock.png')}
        />
      )
    } else if (Date.parse(album.releaseDate) > Date.now()) {
      return (
        <Image
          style={{ tintColor: 'white' }}
          source={require('./clock.png')}
        />
      )
    } else {
      return null
    }
  }

  _unlockAlbum(album) {
    const { dispatch } = this.props;

    dispatch(pushModal({ component: AlbumAndTrackUnlock, passProps: { album }}));
  }

  render() {
    var { tracks, albums, musicPlayer, navigator, app, album, navHide } = this.props;

    var musicSlides = [
      // {'image': 'http://image.posta.com.mx/sites/default/files/sop_chris_pizzelloin_cast_55.jpg', 'title': 'Fiesta Live', 'byline': 'Watch Will perform Fiesta Live with Bomba Estereo!'},
      // {'image': 'http://image.posta.com.mx/sites/default/files/sop_chris_pizzelloin_cast_55.jpg', 'title': 'Fiesta Live', 'byline': 'Watch Will perform Fiesta Live with Bomba Estereo!'}
    ];

    this._translateYVal = this._scrollY.interpolate({
      inputRange: [0, deviceWidth],
      outputRange: [0, 240],
      extrapolate: 'clamp'
    });

    return (
      <View style={{flex: 1}}>
      {
        navHide ?
          null
        :<NavigationBar
          navigator={navigator}
          title="Music"
          showBackButton={false}
        />
      }
        
        <ScrollView
          scrollsToTop={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this._scrollY}}}]
          )}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {(albums.data.length > 0 && tracks.data.length > 0) &&
            <View style={{backgroundColor: 'transparent', marginTop:64}}>

              {musicSlides.length > 0 &&
                <ScrollableTabView
                  onChangeTab={val => this._setActiveTab(val.i)}
                  renderTabBar={false}
                >
                  {
                    musicSlides.map((slide, index) => {
                      return (
                        <View key={index} style={{ backgroundColor: 'transparent' }}>
                          <Image
                            style={{ width: deviceWidth, height: deviceWidth }}
                            source={{ uri: slide.image }}
                          />
                          <LinearGradient colors={['transparent', 'black']} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, }}/>
                          <View style={{ padding: 16, position: 'absolute', bottom: 0, left: 0, right: 0, height: deviceWidth * 0.5, alignItems: 'center' }}>
                            <View style={{ marginBottom: 16 }}>
                              <TogglePlaybackButton size="large"/>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                              <Text style={{ fontSize: 20, fontWeight: '700', letterSpacing: 1, color: 'white' }}>
                                {slide.title.toUpperCase()}
                              </Text>
                              <Text style={{ textAlign: 'center', lineHeight: 20, color: 'rgba(255,255,255,0.8)' }}>
                                {slide.byline}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  }
                </ScrollableTabView>
              }

              {musicSlides.length === 0 &&
                <View style={{ height: deviceWidth, backgroundColor: 'transparent' }}>
                  <View style={{ position: 'absolute', top: -240, width: deviceHeight, height: deviceHeight }}>
                    <Animated.Image
                      blurRadius={80}
                      style={{ transform: [{translateY: this._translateYVal}], position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                      source={{ uri: tracks.data[0].album.imageUrl }}
                    />
                    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
                  </View>
                  <View style={{ height: deviceWidth }}>
                    {
                      albums.data.slice(0, 12).map((album, index) => {
                        var albumSize = 272 + index * -16;

                        return (
                          <View key={index} style={
                            {
                              transform: [{ translateY: -index * 16 }],
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 0,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }
                          }>
                            <Image
                              source={{ uri: album.imageUrl }}
                              style={{ width: albumSize, height: albumSize }}
                            >
                              {album.locked &&
                                <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', }}>
                                  <View style={{ flex: 2 }} />
                                  <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center', }}>
                                    { this.renderLockOrClockIcon(album) }
                                  </View>
                                  <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'center', }}>
                                    <TouchableOpacity onPress={() => this._unlockAlbum(album)} style={{ justifyContent: 'center', height: 32, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 2, borderColor: 'white', borderRadius: 16, }}>
                                      <Text style={{ fontSize: 13, fontWeight: '500', letterSpacing: 0.32, color: 'white', }}>UNLOCK THIS ALBUM</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              }
                            </Image>
                          </View>
                        )
                      }).reverse()
                    }
                  </View>
                </View>
              }

              {musicSlides.length > 0 &&
                <View style={styles.paginationOuterContainer}>
                  <View style={styles.paginationInnerContainer}>
                    {
                      musicSlides.map((slide, index) => {
                          var isTabActive = index === this.state.activeSlide;
                          return (
                            <View key={index}>
                              <View style={[ styles.paginationDot, {opacity: isTabActive ? 1 : 0.4} ]}/>
                            </View>
                          );
                      })
                    }
                  </View>
                </View>
              }

              <View>
                <LinearGradient colors={[app.styles.primaryColor, 'black']} style={styles.gradient}>
                  <View style={{ padding: 16 }}>
                    <Text style={styles.sectionTitle}>TOP LIKED SONGS</Text>
                  </View>
                  <TracksList
                    hasPadding={false}
                    musicPlayer={musicPlayer}
                    tracks={tracks.data.slice(0,4)}
                  />
                  <TouchableOpacity
                    style={[ styles.allSongsButton, {borderColor: app.styles.primaryColor} ]}
                    onPress={() => this.props.navigator.push({
                      component: Tracks
                    })}
                  >
                    <Text style={styles.allSongsButtonText}>ALL SONGS</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View style={{ padding: 16 }}>
                <Text style={styles.sectionTitle}>ALBUMS</Text>
              </View>
              <ScrollView
                scrollsToTop={false}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <AlbumCards
                  musicPlayer={musicPlayer}
                  navigator={this.props.navigator}
                  albums={albums.data}
                />
              </ScrollView>
            </View>
          }
          {(albums.data.length === 0 || tracks.data.length === 0) &&
            <View style={[styles.emptyStateContainer, {marginTop:64}]}>
              <Image style={[styles.emptyStateImage, { tintColor: colors.grayLight }]} source={require('./headphones.png')} />
              <Text style={[styles.emptyStateText, { color: colors.grayLight }]}>
                Check back soon for some new music!
              </Text>
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  scrollContentContainer: {
    paddingBottom: 40,
  },
  title: {
    padding: 16,
    color: 'white'
  },
  text: {
    color: '#fff',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: deviceWidth,
    height: deviceWidth,
    resizeMode: 'cover',
  },
  shuffleSongsButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginLeft: 80,
    marginRight: 80,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 28,
    backgroundColor: 'transparent',
  },
  shuffleSongsButtonText: {
    marginRight: 16,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'white',
  },
  gradient: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontWeight: '500',
    letterSpacing: 0.8,
    color: 'white'
  },
  allSongsButton: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 24,
    marginVertical: 32,
    borderWidth: 2,
    borderRadius: 21.25,
  },
  allSongsButtonText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: 'white',
  },
  album: {
    padding: 80,
    margin: 4,
    marginLeft: 0,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight - 114
  },
  emptyStateImage: {
    marginBottom: 24
  },
  emptyStateText: {
    marginLeft: 40,
    marginRight: 40,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  paginationOuterContainer: {
    position: 'absolute',
    top: deviceWidth - 40,
    width: deviceWidth,
    height: 20,
    backgroundColor: 'transparent',
  },
  paginationInnerContainer: {
    height: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: 7,
    height: 7,
    margin: 4,
    backgroundColor: 'white',
    borderRadius: 3.5,
  },
});

var mapStateToProps = state => ({ tracks: state.tracks, albums: state.albums, musicPlayer: state.musicPlayer, app: state.app })

export default connect(mapStateToProps)(Music);
