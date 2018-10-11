import React from 'react';
import { View, Text, Image, TouchableHighlight, TouchableOpacity, Linking, StyleSheet, Animated, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import { LogIn } from '../../views';
import { ConnectTwitterButton, ConnectFacebookButton, ConnectInstagramButton, ConnectGoogleButton } from '../../molecules'

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this._scrollViewHorizontalPos = new Animated.Value(0);
    this.state = {
      activeSlide: 0,
    }
  }

  onLogInPress() {
    this.props.navigator.push({
      component: LogIn
    });
  }

  render () {
    const { app } = this.props;

    var slides = [
      {'title': 'Welcome!', 'image': false, 'copy': 'Get closer to ' + app.name + ' and see everything right here.'},
      {'title': 'See Everything', 'image': require('./see-everything.png'), 'copy': 'View social media plus exclusive content, music, and messages from ' + app.name + '.'},
      {'title': 'Stream Music', 'image': require('./stream-music.png'), 'copy': 'Listen to music while you use the app and watch official music videos.'},
      {'title': 'Get Messages', 'image': require('./get-messages.png'), 'copy': 'Receive direct or group messages from ' + app.name + '.'},
      {'title': 'Earn Points', 'image': require('./win-rewards.png'), 'copy': 'Accomplish tasks and earn points to compete against other fans.'}
    ];

    var left = -10000;
    left = this._scrollViewHorizontalPos.interpolate({
      inputRange: Object.keys(slides), 
      outputRange: slides.map((tab, i) =>  i * 16),
      extrapolate: 'clamp'
    });

    overlayOpacityVal = this._scrollViewHorizontalPos.interpolate({
      inputRange: [0, 1], 
      outputRange: [0, 0.8],
      extrapolate: 'clamp'
    });

    return (
      <View style={styles.container}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={styles.gradient}/>
        <Animated.View style={[ styles.overlay, {opacity: overlayOpacityVal} ]}/>
        <View style={styles.swiper}>
          <ScrollableTabView
            onChangeTab={val => this.setState({activeSlide: val.i})}
            onScroll={val => this._scrollViewHorizontalPos.setValue(val)}
            renderTabBar={false}
          >
            {
              slides.map((slide, index) => {
                  return (
                    <View style={styles.slideContainer} key={index}>
                      {slide.image && <Image style={{tintColor: 'white'}} source={slide.image} />}
                      <View style={{ marginBottom: 8 }}>
                        <Text style={[ styles.slideTitle, (index === 0) && styles.slideTitleBig, {color: (index === 0) ? 'white' : app.styles.primaryColor} ]}>
                          {slide.title.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.slideCopy}>
                        {slide.copy}
                      </Text>
                    </View>
                  );
              })
            }
          </ScrollableTabView>

          <Animated.View style={styles.paginationOuterContainer}>
            <View style={styles.paginationInnerContainer}>
              <Animated.View style={[ styles.paginationDotSelector, {left: left, borderColor: app.styles.primaryColor} ]} />
                {
                  slides.map((slide, index) => {
                      var isTabActive = index === this.state.activeSlide;
                      return (
                        <View key={index}>
                          <View style={[ styles.paginationDot, {opacity: isTabActive ? 1 : 0.4} ]}/>
                        </View>
                      );
                  })
                }
            </View>
          </Animated.View>
        </View>
        
        <View style={styles.connectButtonsContainer}>
          <ConnectFacebookButton text="Sign up with Facebook" />
          <ConnectTwitterButton text="Sign up with Twitter" />
          <ConnectGoogleButton text="Sign up with Google" />
        </View>
        <View style={styles.logInContainer}>
          <Text style={styles.logInLink}>Already have an account? </Text>
          <TouchableOpacity onPress={() => this.onLogInPress()}>
            <Text style={[styles.logInLink, {color: app.styles.primaryColor} ]}>Log in</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  swiper: {
    flex: 6,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
  slideTitleBig: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.25,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.25,
  },
  slideCopy: {
    textAlign: 'center',
    lineHeight: 24,
    color: 'white',
  },
  artistNameContainer: {
    position: 'absolute',
    width: deviceWidth,
  },
  artistName: {
    textAlign: 'center',
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1,
    color: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  connectButtonsContainer: {
    flex: 2,
    justifyContent: 'center',
    marginLeft: 24,
    marginRight: 24,
  },
  logInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 16,
  },
  logInLink: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  termsPrivacyContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  termsPrivacyTextInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 4,
  },
  termsPrivacyText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  paginationOuterContainer: {
    position: 'absolute',
    bottom: 24,
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
    width: 8,
    height: 8,
    margin: 4,
    backgroundColor: 'white',
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
  },
});

const mapStateToProps = state => ({ app: state.app })

module.exports = connect(mapStateToProps)(SignUp);
