import React from 'react';
import { CameraRoll, Animated, View, ScrollView, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TouchableHighlight, Dimensions, InteractionManager } from 'react-native';


import { connect } from 'react-redux';

import Orientation from 'react-native-orientation'

import { pop as popModal } from '../../../actions/ModalActions';
import { setMedia } from '../../../actions/FeedItemComposerActions';

import { VideoPlayer, CameraRollView } from '../../molecules';

import RNCamera from 'react-native-camera';

import moment from 'moment';
import 'moment-duration-format';

var {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window')

var AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
var AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);

class Camera extends React.Component {

  state = {
    cameraType: 'back',
    isCapturingVideo: false,
    cameraViewWidth: deviceWidth,
    cameraViewHeight: deviceHeight,
    cameraRollOpacity: true,
    rotateControls: false,
    time: 0,
    recorded: false,
   isRecording: false,
  }

  constructor(props) {
    super(props);
    this._orientation = 'PORTRAIT';
    this._selectedImage = new Animated.Value(1);
    this._shutterButtonScaleVal = new Animated.Value(1);
    this._rotateControls = new Animated.Value(0);
    this._controlsAndCameraRollPos = new Animated.Value(0);
    this._instructionsTextOpacityVal = new Animated.Value(1);
  }

  componentDidMount() {
    Orientation.lockToPortrait();

    Orientation.addSpecificOrientationListener((specificOrientation) => this._orientationDidChange(specificOrientation));
  }

  _orientationDidChange(specificOrientation) {
    if(specificOrientation == 'UNKNOWN') return;

    this._orientation = specificOrientation;

    switch(specificOrientation) {
      case 'PORTRAIT':
        Animated.parallel([
          Animated.timing(this._rotateControls, {
            toValue: 0,
            duration: 150
          }),
          Animated.spring(this._controlsAndCameraRollPos, {
            toValue: 0
          }),
          Animated.timing(this._instructionsTextOpacityVal, {
            toValue: 1,
            duration: 150
          })
        ]).start();
        break;
      case 'LANDSCAPE-LEFT':
        Animated.parallel([
          Animated.timing(this._rotateControls, {
            toValue: 1,
            duration: 150
          }),
          Animated.spring(this._controlsAndCameraRollPos, {
            toValue: deviceHeight * .15,
          }),
          Animated.timing(this._instructionsTextOpacityVal, {
            toValue: 0,
            duration: 150
          })
        ]).start();
        break;
      case 'LANDSCAPE-RIGHT':
        Animated.parallel([
          Animated.timing(this._rotateControls, {
            toValue: 2,
            duration: 150
          }),
          Animated.spring(this._controlsAndCameraRollPos, {
            toValue: deviceHeight * .15,
          }),
          Animated.timing(this._instructionsTextOpacityVal, {
            toValue: 0,
            duration: 150
          })
        ]).start();
        break;
    }
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  onCancelPress() {
    if (this.props.navigator) this.props.navigator.pop();
    else this.props.dispatch(popModal())
  }

  _toggleCameraType() {
    if(this.state.cameraType === 'back') {
      this.setState({cameraType: 'front'});
    } else {
      this.setState({cameraType: 'back'});
    }
  }

  _capturePhoto() {
    this.refs.cam.capture({rotation: this._determineCaptureRotation()})
    .then(photo => {
      this.props.navigator.pop();
      InteractionManager.runAfterInteractions(() => this.props.dispatch(setMedia({
        type: 'image',
        url: photo.path
      })));
    })
    .catch(err => {
      // console.log(err)
    });
  }

  _determineCaptureRotation() {
    switch(this._orientation) {
      case 'PORTRAIT':
        if(this.state.cameraType == 'back') return -90;
        else return -90;
      case 'LANDSCAPE-LEFT':
        if(this.state.cameraType == 'back') return 0;
        else return -180;
      case 'LANDSCAPE-RIGHT':
        if(this.state.cameraType == 'back') return -180;
        else return 0
    }
  }

  _selectImage(asset) {
    this.props.navigator.pop();
    InteractionManager.runAfterInteractions(() => this.props.dispatch(setMedia({
      type: asset.type === 'video' ? 'video' : 'image',
      url: asset.url,
      width: asset.width,
      height: asset.height,
    })));
  }

  _captureVideo() {
    this.setState({ isCapturingVideo: true });
    this.refs.cam.capture({ mode: RNCamera.constants.CaptureMode.video, rotation: this._determineCaptureRotation() })
    .then(video => {

      this.props.navigator.pop();
      this.setState({
          recorded: true,
        });

      InteractionManager.runAfterInteractions(() => this.props.dispatch(setMedia({
        type: 'video',
        url: video.path,
        width: video.width,
        height: video.height,
      })));
    });

     setTimeout(() => {
        this.startTimer();
        this.setState({
          isRecording: true,
          recorded: false,
          time: 0,
        });
      });

    Animated.spring(this._shutterButtonScaleVal, {
      toValue: 1.3
    }).start();
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      this.setState({ time: this.state.time + 1 });
    }, 1000);
  }

  stopTimer = () => {
    if (this.timer) clearInterval(this.timer);
  }

  convertTimeString = (time) => {
    return moment().startOf('day').seconds(time).format('mm:ss');
  }

  renderTimer() {
    const { isRecording, time, recorded } = this.state;
    return (
      <View>
        {
          (recorded || isRecording) &&
          <Text style={styles.durationText}>
            <Text style={styles.dotText}>●</Text> {this.convertTimeString(time)}
          </Text>
        }
      </View>
    );
  }


  _stopCapture() {
    this.refs.cam.stopCapture();
    this.setState({ isCapturingVideo: false , isRecording: false});
    this.stopTimer();

    Animated.spring(this._shutterButtonScaleVal, {
      toValue: 1
    }).start();
  }

  _renderCameraRollMedia(asset) {
    var base64Image = 'data:image/png;base64,' + asset.thumbnail;

    return (
      <TouchableOpacity onPress={() => this._selectImage(asset)}>
        <Image style={styles.asset} source={{ uri: base64Image }}>
          {!!asset.duration &&
            <View style={styles.durationTextContainer}>
              <Text style={styles.durationText} >{moment.duration(asset.duration, "seconds").format("m:ss", { trim: false })}</Text>
            </View>
          }
        </Image>
      </TouchableOpacity>
    );
  }

  render() {
    const { app } = this.props

    return(
      <View style={{ flex: 1 }}>
        <RNCamera
          type={this.state.cameraType}
          orientation="auto"
          ref="cam"
          style={styles.container}
          onFocusChanged={() => {}}
          captureAudio={true}
        >
          <Animated.View pointerEvents='none' style={[styles.instructionsTextContainer, {opacity: this._instructionsTextOpacityVal} ]}>
            <Text style={styles.instructionsText}>Tap for photo, hold for video</Text>
            {this.renderTimer()}
            

          </Animated.View>

          <Animated.View
            style={[styles.controlsContainer, 
              {
                transform: [{ translateY: this._controlsAndCameraRollPos }],
              }
            ]}>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => this.onCancelPress()}>
                <Animated.Text
                  style={[styles.cancelText, 
                    {
                      transform: [{
                        rotate: this._rotateControls.interpolate({
                          inputRange: [0, 1, 2],
                          outputRange: ['0deg',  '90deg', '-90deg']
                        })
                      }]
                    }
                  ]}>
                  Cancel
                </Animated.Text>
              </TouchableOpacity>
            </View>

            <View style={styles.controls}>
              <View style={styles.shutterButtonBorder}>
                <AnimatedTouchableHighlight
                  underlayColor={app.styles.primaryDarkColor}
                  onLongPress={e => this._captureVideo()}
                  onPress={() => this._capturePhoto()}
                  onPressOut={() => this._stopCapture()}
                  style={[styles.shutterButton, 
                    {
                      transform: [{ scale: this._shutterButtonScaleVal }],
                      backgroundColor: app.styles.primaryColor,
                      borderColor: app.styles.primaryLightColor
                    },
                  this.state.isCapturingVideo && styles.shutterButtonRecording]}
                >
                  <View />
                </AnimatedTouchableHighlight>
              </View>
            </View>



            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => this._toggleCameraType()}
              >
                <Animated.Image style={[styles.icon, 
                  {
                    transform: [{
                      rotate: this._rotateControls.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: ['0deg',  '90deg', '-90deg']
                      })
                    }]
                  } 
                ]} 
                source={this.state.cameraType == 'back' ? require('./back-camera.png') : require('./front-camera.png')}/>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </RNCamera>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: deviceHeight,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  instructionsTextContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  instructionsText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.078,
    color: 'white',
    shadowOffset:{
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 40,
  },
  controls: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelText: {
    fontSize: 17,
    letterSpacing: -0.4,
    color: 'rgba(255,255,255,.8)',
    backgroundColor: 'transparent',
    shadowOffset:{
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  shutterButton: {
    width: 64, 
    height: 64, 
    borderWidth: 4, 
    borderColor: 'rgba(0,0,0,.2)', 
    borderRadius: 32
  },
  shutterButtonBorder: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 100,
  },
  shutterButtonRecording: {
    backgroundColor: '#f35',
    borderColor: 'transparent',
  },
  icon: {
    tintColor: 'rgba(255,255,255,0.8)',
    shadowOffset:{
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  buttonContainer: {
    padding: 16,
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: deviceHeight * 0.15,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  asset: {
    width: deviceHeight * 0.15 - 8,
    height: deviceHeight * 0.15 - 8,
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
    borderRadius: 2
  },
  durationTextContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 2
  },
  durationText: {
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: -0.078,
    color: 'white',
    shadowOffset:{
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.5,

  },
  loadingAnimationContainerStyle: {
    padding: 16,
    height: deviceHeight * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

var mapStateToProps = state => ({ app: state.app });

module.exports = connect(mapStateToProps)(Camera);