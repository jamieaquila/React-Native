import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, DeviceEventEmitter, Animated, Easing, TouchableWithoutFeedback, InteractionManager, Platform, Keyboard } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import RNCamera from 'react-native-camera';
import BarcodeScanner from 'react-native-barcode-scanner-universal'

import { connect } from 'react-redux';
import DismissKeyboard from 'dismissKeyboard';
import LinearGradient from 'react-native-linear-gradient';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Permissions from 'react-native-permissions';

import { pop } from '../../../actions/ModalActions';
import { redeem, modalDismissed, setCode, setAlbumToRedeem } from '../../../actions/RedemptionCodeActions';

import { NavigationBar } from '../../molecules'

import Auth from './Auth';

const deviceWidth = ExtraDimensions.get('REAL_WINDOW_WIDTH');
const deviceHeight = ExtraDimensions.get('REAL_WINDOW_HEIGHT');
const softMenuHeight = ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT');

class Camera extends React.Component {

  textInputTopVal = new Animated.Value(0);
  viewFinderOpacityVal = new Animated.Value(1);
  viewFinderSuccessOpacityVal = new Animated.Value(0);

  state = {
    text: '',
    viewfinderSize: 0,
    isReady: false
  }

  componentDidMount() {
    const { album } = this.props;

    if (!this.props.auth.accessToken) {
      InteractionManager.runAfterInteractions(() => this.props.navigator.push({
        component: Auth, passProps: { album }
      }));
    } else {
      InteractionManager.runAfterInteractions(() => {
        Permissions.check('camera').then(response => {
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'


          if(response.photo === "authorized") {
             this.setState({ isReady: true })
            //  console.log("Already Granted!");
          }else if(response.location === "undetermined"){
            Permissions.request('camera').then(response => {

              if(response.location === "authorized") {
                 this.setState({ isReady: true })
              }else {
                 this.setState({ isReady: false })
                //  console.log("Not Granted!");
              }
            })
          }else {
            this.setState({ isReady: false })
            // console.log("Not Granted!");
          }
        })

      });
    }
  }

  componentWillMount() {
    const { album, dispatch } = this.props;

    dispatch(setAlbumToRedeem(album));
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
  }

  componentWillUnmount() {
    if (this.refs.message) this.refs.message.blur();
    clearTimeout(this.throttleReadTimeout);
  }

  keyboardWillShow (e) {
    let newSize = e.endCoordinates.height - 8;

    Animated.timing(this.textInputTopVal, {
      toValue: -newSize,
      duration: e.duration,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
  }

  keyboardWillHide (e) {
    Animated.timing(this.textInputTopVal, {
      toValue: 0,
      duration: e.duration,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
  }

  renderScene(route, navigator) {
    var Component = route.component;

    return <Component navigator={navigator} route={route} {...route.passProps} />;
  }

  onBarCodeRead(code) {
    const { dispatch, app, isPerformingAPIRequest } = this.props;
    const { throttleRead } = this.state;

    if (isPerformingAPIRequest || throttleRead) return false;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.viewFinderOpacityVal, { toValue: 0, duration: 0 }), 
        Animated.timing(this.viewFinderSuccessOpacityVal, { toValue: 1, duration: 0 }),
      ]),
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(this.viewFinderOpacityVal, { toValue: 1, duration: 0 }), 
        Animated.timing(this.viewFinderSuccessOpacityVal, { toValue: 0, duration: 0 }),
      ])
    ]).start();

    this.setState({ throttleRead: true });
    this.throttleReadTimeout = setTimeout(() => this.setState({ throttleRead: false }), 3000);

    switch(code.type) {
      case 'QR_CODE':
      case 'ITF':
        dispatch(setCode(code.data));
        dispatch(redeem());
      break;
    }

  }

  onRedeemPress() {
    const { dispatch, app, isPerformingAPIRequest } = this.props;

    if (isPerformingAPIRequest) return false;

    dispatch(redeem());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldDismissModal) {
      this.setState({ isReady: false });
      if (this.refs.message) this.refs.message.blur();

        Permissions.check('camera').then(response => {
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'


          if(response.photo === "authorized") {          
            //  console.log("Already Granted!");
          }else if(response.location === "undetermined"){
            Permissions.request('camera').then(response => {
              if(response.location === "authorized") {
                //  console.log("Granted!");
              }else {
                //  console.log("Not Granted!");
              }
            })
          }else {
            // console.log("Not Granted!");
          }
        })
    }
  }

  measureViewfinder(size) {
    this.setState({ viewfinderSize: size });
  }

  renderCamera() {
    const { app, code, albums, dispatch, isPerformingAPIRequest } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <BarcodeScanner
          style={{ position: 'absolute', width: deviceWidth, height: deviceHeight }}
          onBarCodeRead={code => this.onBarCodeRead(code)}
          captureAudio={false}
        />
      <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{ height: (deviceHeight - softMenuHeight - this.state.viewfinderSize) / 2, position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', }} />
          <View style={{ height: (deviceHeight - softMenuHeight - this.state.viewfinderSize) / 2, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', }} />
          <View style={{ justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, }}>
            <View style={{ width: (deviceWidth - this.state.viewfinderSize) / 2, height: this.state.viewfinderSize, backgroundColor: 'rgba(0,0,0,0.5)',  }} />
          </View>
          <View style={{ justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, right: 0, }}>
            <View style={{ width: (deviceWidth - this.state.viewfinderSize) / 2, height: this.state.viewfinderSize, backgroundColor: 'rgba(0,0,0,0.5)',  }} />
          </View>
          <View style={{ flex: 2, justifyContent: 'flex-end' }}>
            <View style={{ alignItems: 'center', marginHorizontal: 16 }}>
              <Text style={{ fontSize: 16, letterSpacing: -0.32, lineHeight: 21, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>Scan the code on your Album Pass, ticket, or type in your code below.</Text>
            </View>
          </View>
          <View style={{ flex: 6, justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, }}>
              <Animated.Image
                onLayout={e => this.measureViewfinder(e.nativeEvent.layout.height)}
                source={require('./viewfinder.png')}
                style={{ opacity: this.viewFinderOpacityVal, tintColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 16, }}
              />
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, }}>
              <Animated.Image
                onLayout={e => this.measureViewfinder(e.nativeEvent.layout.height)}
                source={require('./viewfinder.png')}
                style={{ opacity: this.viewFinderSuccessOpacityVal, tintColor: app.styles.primaryColor, alignItems: 'center', justifyContent: 'center', padding: 16, }}
              />
            </View>
          </View>
          <Animated.View style={{ flex: 2, flexDirection: 'row', alignItems: 'flex-end', top: this.textInputTopVal, paddingHorizontal: 12, }}>
            <LinearGradient
              style={{ height: 240, position: 'absolute', bottom: -16, left: 0, right: 0, }}
              colors={[ 'transparent', 'black' ]}
            />
            <View style={{ flex: 7.75, marginBottom: 24, }}>
              <TextInput
                ref="message"
                placeholder='Type Your Code…'
                placeholderTextColor='rgba(255,255,255,0.4)'
                selectionColor='white'
                autoCapitalize='characters'
                blurOnSubmit
                onChangeText={text => dispatch(setCode(text))}
                style={{ width: deviceWidth-12, height: 40, marginRight: 8, color: 'white', }}
                autoCorrect={false}
                value={code}
              />
            </View>
            <View
              pointerEvents={(code.length === 0) ? 'none' : 'auto'}
              style={{ flex: 2.25, marginBottom: 24, }}
            >
              <TouchableOpacity
                hitSlop={{ top: 16, left: 16, bottom: 16, right: 16, }}
                style={[
                  styles.submitButton,
                  { backgroundColor: (code.length === 0) ? 'transparent' : app.styles.primaryColor }
                ]}
                onPress={() => this.onRedeemPress()}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', letterSpacing: -0.24, color: (code.length === 0) ? 'rgba(255,255,255,0.1)' : 'white' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          </View>
        {/*</BarcodeScanner>*/}
      </TouchableWithoutFeedback>
      </View>
    )
  }

  render () {
    var { navigator } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {this.state.isReady && this.renderCamera()}
        <NavigationBar title='Unlock Album' style={styles.navBar} showUserInfo={false} navigator={navigator} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  },
  navBar: {
    height: 64,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    top: -120,
    right:0,
    left:0,
    bottom:0,
    resizeMode: 'contain'
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 20,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700'
  }
});

const mapStateToProps = state => ({
  code: state.redemptionCode.code,
  shouldDismissModal: state.redemptionCode.shouldDismissModal,
  isPerformingAPIRequest: state.redemptionCode.isPerformingAPIRequest,
  app: state.app,
  auth: state.auth
});

module.exports = connect(mapStateToProps)(Camera);
