import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Image, TextInput, DeviceEventEmitter, Animated, Easing, TouchableWithoutFeedback, Linking, Keyboard } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import RNCamera from 'react-native-camera';

import { connect } from 'react-redux';
import DismissKeyboard from 'dismissKeyboard';
import LinearGradient from 'react-native-linear-gradient';

import { pop } from '../../../actions/ModalActions';
import { redeem, modalDismissed, setCode, setAlbumToRedeem } from '../../../actions/RedemptionCodeActions';

import { NavigationBar } from '../../molecules'

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Camera extends React.Component {

  textInputTopVal = new Animated.Value(0);
  viewFinderOpacityVal = new Animated.Value(1);
  viewFinderSuccessOpacityVal = new Animated.Value(0);

  state = {
    viewfinderSize: 0,
    throttleRead: false,
    hasCameraPermissions: false
  }

  componentWillMount() {
    const { album, dispatch } = this.props;

    dispatch(setAlbumToRedeem(album));
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
  }

  componentDidMount() {
    RNCamera.checkDeviceAuthorizationStatus().then(isApproved => {
      if (isApproved) this.setState({ hasCameraPermissions: true });
      else this.setState({ hasCameraPermissions: false });
    })
  }

  componentWillUnmount() {
    if (this.refs.message) this.refs.message.blur();
    clearTimeout(this.throttleReadTimeout);
  }

  keyboardWillShow(e) {
    let newSize = e.endCoordinates.height - 8;

    Animated.timing(this.textInputTopVal, {
      toValue: -newSize,
      duration: e.duration,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
  }

  keyboardWillHide(e) {
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
      case 'org.iso.QRCode':
      case 'org.ansi.Interleaved2of5':
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
      this.props.dispatch(pop());
      this.refs.message.blur();
      this.props.dispatch(modalDismissed());
    }
  }

  measureViewfinder(size) {
    this.setState({ viewfinderSize: size });
  }

  renderCamera() {
    var { app, code, albums, dispatch, navigator, modalNavigator, isPerformingAPIRequest } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>
          <View style={{ flex: 1 }}>
            <RNCamera
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              onBarCodeRead={(code) => this.onBarCodeRead(code)}
              captureAudio={false}
            >
              <View style={{ height: (deviceHeight - this.state.viewfinderSize) / 2, position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', }} />
              <View style={{ height: (deviceHeight - this.state.viewfinderSize) / 2, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', }} />
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
              <View style={{ flex: 6, justifyContent: 'center', }}>
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
                  pointerEvents={code.length === 0 ? 'none' : 'auto'}
                  style={{ flex: 2.25, marginBottom: 24, }}
                >
                  <TouchableOpacity
                    hitSlop={{ top: 16, left: 16, bottom: 16, right: 16, }}
                    style={[
                      styles.submitButton,
                      { backgroundColor: (code.length === 0 || isPerformingAPIRequest) ? 'transparent' : app.styles.primaryColor }
                    ]}
                    onPress={() => this.onRedeemPress()}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '600', letterSpacing: -0.24, color: (code.length === 0 || isPerformingAPIRequest) ? 'rgba(255,255,255,0.1)' : 'white' }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </RNCamera>
          </View>
        </TouchableWithoutFeedback>
        <NavigationBar title='Unlock Album' style={styles.navBar} showUserInfo={false} navigator={navigator} />
      </View>
    );
  }

  renderEmptyState() {
    const { app } = this.props;

    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
        <View style={{ marginTop: 16, marginBottom: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 28, letterSpacing: 0.364, color: 'white', }}>Whoops!</Text>
        </View>
        <View style={{ marginBottom: 24, marginHorizontal: 16 }}>
          <Text style={{ fontSize: 16, letterSpacing: -0.32, lineHeight: 21, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
            We need permission to use your camera. Follow the instructions to unlock your album.
          </Text>
        </View>
        <View style={{ marginBottom: 40, marginHorizontal: 24 }}>
          <Text style={{ fontSize: 16, letterSpacing: -0.32, lineHeight: 28, color: 'rgba(255,255,255,0.8)' }}>
            1. Tap the button below {'\n'}
            2. Scroll down and tap {app.name} {'\n'}
            3. Toggle Camera on {'\n'}
            4. Come back here and scan your code!
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center', height: 56, marginBottom: 16, marginHorizontal: 16, backgroundColor: 'white', borderRadius: 8 }}
            onPress={() => Linking.openURL('prefs://')}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', letterSpacing: 0.24, color: '#111', }}>CHANGE CAMERA PERMISSIONS</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render () {
    return this.state.hasCameraPermissions ? this.renderCamera() : this.renderEmptyState();
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
  app: state.app
});

module.exports = connect(mapStateToProps)(Camera);
