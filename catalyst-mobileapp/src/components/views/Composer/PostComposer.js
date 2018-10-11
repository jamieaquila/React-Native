import React from 'react';
import { Animated, View, Text, Image, TextInput, TouchableOpacity, Dimensions, DeviceEventEmitter, StyleSheet, InteractionManager, ScrollView, Easing, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';

import ImagePicker from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { pop as modalPop } from '../../../actions/ModalActions';
import { setMessage, deleteMedia, clear, create, created, setMedia } from '../../../actions/FeedItemComposerActions';

import { colors } from '../../../config'

import Camera from './Camera'
import { VideoPlayer, CameraRollView } from '../../molecules'
import { Pop } from '../../atoms';

import moment from 'moment';
import 'moment-duration-format';
import Permissions from 'react-native-permissions'

var AnimatedVideoPlayer = Animated.createAnimatedComponent(VideoPlayer);

var {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window')

class PostComposer extends React.Component {

  keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
  keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))

  _mediaScaleVal = new Animated.Value(1);
  state = { 
    visibleHeight: new Animated.Value(deviceHeight),
    cameraPermission: "",
    photoPermission: ""
  }

  _requestPhotoPermission = () => {
    Permissions.request('photo').then(response => {
      this.setState({ photoPermission: response })
    })
  }
  _requestCameraPermission = () => {
    Permissions.request('camera').then(response => {
      this.setState({ cameraPermission: response })
    })
  }
  _checkCameraAndPhotos = () => {
    InteractionManager.runAfterInteractions(() => {
      Permissions.checkMultiple(['camera', 'photo']).then(response => {
        //response is an object mapping type to permission
        
        this.setState({
          cameraPermission: response.camera,
          photoPermission: response.photo,
        })
        if(response.photo === "undetermined") {
          this._requestPhotoPermission();
        }
        if(response.camera === "undetermined") {
          this._requestCameraPermission();
        }
      })
    });

  }
  
  componentDidMount() {
    if (Platform.OS === 'android') {
      this._checkCameraAndPhotos();
    } else {
      this.setState({ cameraPermission: "authorized", photoPermission: "authorized"});
    }
  }

  onClosePress() {
    const { dispatch } = this.props;

    dispatch(modalPop());
    this.refs.message.blur();
    InteractionManager.runAfterInteractions(() => dispatch(clear()));
  }

  onSubmitPress() {
    const { dispatch, feedItemComposer } = this.props;

    if (feedItemComposer.canSubmit) dispatch(create());
  }

  keyboardWillShow (e) {
    let newSize = deviceHeight - e.endCoordinates.height

    Animated.timing(this.state.visibleHeight, {
      toValue: newSize,
      duration: e.duration,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
  }

  keyboardWillHide (e) {
    Animated.timing(this.state.visibleHeight, {
      toValue: deviceHeight,
      duration: e.duration,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
  }

  calculateAspectRatioFit(srcWidth, srcHeight) {
    var ratio = Math.min(deviceWidth / srcWidth, deviceHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
  }

  onCameraPress() {
    const { navigator } = this.props;

    this.refs.message.blur();
    navigator.push({ component: Camera });

    this._mediaScaleVal.setValue(1)
  }

  handlePress(index) {
    var options = {      
      storageOptions: {
        skipBackup: true
      },      
    }

    if(index == 1){
      options.mediaType = 'photo'
    }else{
      options.mediaType = 'video'
    }
    this.onCameraRollPress(options)  
  }

  onCameraRollPress(options) {
    ImagePicker.launchImageLibrary(options, (response)=>{
      if(response.didCancel){
      }
      else if(response.error){
      }
      else { 
        let subStr;
        let asset = {}
        let lowercase
        if(Platform.OS == 'ios'){
          subStr = response.origURL.split('ext=')
          let extension = subStr[subStr.length-1];	
          lowercase = extension.toLowerCase();
          asset.url = response.origURL
          asset.width = response.width
          asset.height = response.height
        }else{
          const split = response.path.split('/');    
          lowercase = split.pop().split('.')[1] 
          asset.url = "file://" + response.path
          asset.width = response.width
          asset.height = response.height
        }        

        if(lowercase == 'jpg' || lowercase == 'jpeg' || lowercase == 'png'){
          asset.type = 'image'
        }else if(lowercase == 'mov' || lowercase == '3gp' || lowercase == 'wmv' || lowercase == "avi" || lowercase == "flv" || lowercase == "mp4"){
          asset.type = 'video'    
        }

        this.selectImage(asset)

      }
    });  
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, feedItemComposer } = this.props;

    if (nextProps.feedItemComposer.hasCreated) {
      this.refs.message.blur();
      dispatch(modalPop());
      dispatch(created());
      InteractionManager.runAfterInteractions(() => dispatch(clear()));
    }
  }

  removeMedia() {
    const { dispatch, feedItemComposer } = this.props;

    Animated.spring(this._mediaScaleVal, {
      toValue: 0,
      overshootClamping: true
    }).start(() => dispatch(deleteMedia({})))
  }

  renderCameraRollMedia(asset) {
    var base64Image = 'data:image/png;base64,' + asset.thumbnail;

    return (
      <TouchableOpacity style={{ padding: 2 }} onPress={() => this.selectImage(asset)}>
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

  selectImage(asset) {
    this.refs.message.focus();
    InteractionManager.runAfterInteractions(() => this.props.dispatch(setMedia({
      type: asset.type === 'video' ? 'video' : 'image',
      url: asset.url,
      width: asset.width,
      height: asset.height,
    })));
  }

  render() {
    const { dispatch, app, feedItemComposer } = this.props;

    var { width, height } = this.calculateAspectRatioFit(feedItemComposer.media.width, feedItemComposer.media.height);

    console.log(feedItemComposer.media)

    return(
      <View style={{ flex: 1 }}>       
        <Animated.View style={{ height: this.state.visibleHeight }}>
          <ScrollView
            scrollsToTop={false}
            style={{ flex: 3, marginBottom: 64 }}
            >
              <View style={{flex: 1, height: 64, flexDirection: 'row', alignItems: 'center', paddingRight: 16}}>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Image style={{width: 40, height: 40, marginTop: 20, backgroundColor: colors.grayDark, borderRadius: 20}} source={{uri: app.settings.avatarURL}}/>
                </View>
              </View>
              <TextInput
                ref="message"
                multiline={true}
                placeholder="What's happening?️"
                placeholderTextColor={colors.grayLight}
                selectionColor={app.styles.primaryColor}
                style={{ height: feedItemComposer.media.type == 'image' || feedItemComposer.media.type == 'video' ? 64 : deviceHeight, padding: 16, fontSize: 19, color: colors.grayDark, textAlignVertical: "top"}}
                onChangeText={text => dispatch(setMessage(text))}
                value={feedItemComposer.message}
              />
              {feedItemComposer.media.type === 'image' && 
              // <Animated.Image style={{ transform: [{ scale: this._mediaScaleVal }], width: width - 16, height: height - 16, marginLeft: 8, marginRight: 8, alignItems: 'flex-end'}} source={{ uri: feedItemComposer.media.url }}>
              <Image style={{width: width - 16, height: height - 16, marginLeft: 8, marginRight: 8, alignItems: 'flex-end'}} source={{ uri: feedItemComposer.media.url }}>
                <TouchableOpacity onPress={() => this.removeMedia()} style={{padding: 16}}>
                  <View style={styles.deleteMediaIconContainer}>
                    <Image
                      source={require('./delete.png')}
                      style={styles.deleteMediaIcon}/>
                  </View>
                </TouchableOpacity>
              </Image>
              // </Animated.Image>
              }
              {feedItemComposer.media.type === 'video' && 
                // <Animated.View style={{ transform: [{ scale: this._mediaScaleVal }], marginHorizontal: 8, width: deviceWidth - 16, height: deviceHeight }}>
                <View style={{marginHorizontal: 8, width: deviceWidth - 16, height: 300}}>
                  <AnimatedVideoPlayer style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }} repeat={true} resizeMode="cover" source={{ uri: feedItemComposer.media.url }}/>
                  <TouchableOpacity onPress={() => this.removeMedia()} style={{padding: 16}}>
                    <View style={[styles.deleteMediaIconContainer, { position: 'absolute', right: 8, top: 16 }]}>
                      <Image
                        source={require('./delete.png')}
                        style={styles.deleteMediaIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              // </Animated.View>
            }

          </ScrollView>
          <View style={[styles.composerControls, { borderTopColor: colors.grayLighter }]}>
            <View style={{flex: 3, flexDirection:'row', alignItems:'flex-start'}}>
            {
              this.state.cameraPermission === "authorized" && 
              <TouchableOpacity
                style={styles.iconsTouchableContainer}
                onPress={() => this.onCameraPress()}>
                <Image
                  source={require('./camera.png')}
                  style={{ tintColor: colors.gray }}/>
              </TouchableOpacity>
              
            }
            {
              this.state.photoPermission === "authorized" &&
              <TouchableOpacity
                style={styles.iconsTouchableContainer}
                onPress={() => {
                  if(Platform.OS == 'ios'){
                    this.onCameraRollPress(
                      {      
                        storageOptions: {
                          skipBackup: true
                        },
                        mediaType:'mixed'
                      }
                    )
                  }else{
                    this.ActionSheet.show()
                  }                  
                  }}>
                <Image
                  source={require('./gallery.png')}
                  style={{ tintColor: colors.gray }}/>
              </TouchableOpacity>
            }
            </View>
            
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              {!feedItemComposer.isUploading &&
                <TouchableOpacity
                  onPress={() => this.onSubmitPress()}
                  activeOpacity={feedItemComposer.canSubmit ? 0.4 : 1}
                  style={[styles.submitButton, { borderColor: colors.grayLighter }, feedItemComposer.canSubmit && { backgroundColor: app.styles.primaryColor, borderColor: app.styles.primaryColor }]}
                >
                  <Text style={[styles.submitText, { color: colors.grayLighter }, feedItemComposer.canSubmit && { color: 'white', borderColor: app.styles.primaryColor }]}>Post</Text>
                </TouchableOpacity>
              }
              {feedItemComposer.isUploading &&
                <View style={[styles.submitButton, { flexDirection: 'row', width: 120, backgroundColor: app.styles.primaryColor, borderColor: app.styles.primaryColor }]}>
                  <View style={{ left: -8 }}>
                    <ActivityIndicator color='white' />
                  </View>
                  <Text style={[styles.submitText, { color: colors.grayLighter }]}>Posting</Text>
                </View>
              }
            </View>
          </View>
          <View style={{ position: 'absolute', top: isIphoneX() ? 12 : 8, }}>
            <Pop
              onPress={() => this.onClosePress()}
              iconType='x'
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 0 }}/>
          </View>
        </Animated.View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={''}
          options={['Cancel', 'Select an image', 'Select a video']}
          cancelButtonIndex={0}
          onPress={(idx) => this.handlePress(idx)}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  iconsTouchableContainer: {
    padding: 16,
    width: 56,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'transparent'
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: 'transparent'
  },
  submitTextReady: {
    color: 'white'
  },
  composerControls: {
    position: 'absolute',
    bottom: isIphoneX() ? 22 : 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: 'white',
    borderTopWidth: 1
  },
  deleteMediaIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    marginTop: -8,
    marginRight: -8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowOffset:{
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  deleteMediaIcon: {
    tintColor: 'black',
  },
  asset: {
    width: deviceWidth * 0.3333333333 - 2.75,
    height: deviceWidth * 0.3333333333 - 2.75,
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
    fontSize: 10,
    fontWeight: '500'
  },
  loadingAnimationContainer: {
    flex: 1,
    height: deviceWidth * 0.3333333333 - 2.75,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

var mapStateToProps = state => ({ app: state.app, feedItemComposer: state.feedItemComposer });

export default connect(mapStateToProps)(PostComposer);