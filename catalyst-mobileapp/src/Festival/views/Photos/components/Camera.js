import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import Camera from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
import Orientation from 'react-native-orientation';
import ViewTransformer from 'react-native-view-transformer';

let windowHeight = Dimensions.get('window').height
let windowWidth = Dimensions.get('window').width
import PhotoView from 'react-native-photo-view';
class PhotoBooth extends Component { 
    constructor(props) {
      super(props);
  
      this.camera = null;
  
      this.state = {
        camera: {
          aspect: Camera.constants.Aspect.fill,
          captureTarget: Camera.constants.CaptureTarget.cameraRoll,
          type: Camera.constants.Type.back,
          orientation: Camera.constants.Orientation.auto,
          flashMode: Camera.constants.FlashMode.auto,
        },
        imageUri:'',
        showImage:false,
        filterImage:'',
        windowWidth:windowWidth,
        windowHeight:windowHeight,
      };
    }

  componentDidMount() {
      Dimensions.addEventListener('change', () => {
          windowHeight = Dimensions.get('window').height;
          windowWidth = Dimensions.get('window').width;
          this.setState({ windowWidth:windowWidth, windowHeight:windowHeight});
      });
  }

  onLayout(e) {
      const {width, height} = Dimensions.get('window');
      windowHeight = Dimensions.get('window').height;
      windowWidth = Dimensions.get('window').width;
      this.setState({ windowWidth:windowWidth, windowHeight:windowHeight});
  }


  openImagePicker= () => {
    var options = {
      title:'Select ID photo',
      storageOptions: {
        skipBackup: true,
        path:'images'
      }
    }

        
    ImagePicker.launchImageLibrary(options, (response)=>{
      if(response.didCancel){
      }
      else if(response.error){
      }
      else {        
        let url = Platform.OS == 'ios' ? response.origURL : "file://" + response.path;
        this.setState({imageUri:url, filterImage:''});
        this.props.setFilterEnable(true)    
        this.props.capturedImageCallBack(url);
      }
    });
  }

    setFilter = (url) => {
      alert(url);
    }

    get galleryIcon() {
      icon = require('../assets/ic_gallery_mode.png');
      return icon;
    }

    openGallery = () => {
       this.openImagePicker();
    }

    initCamera = () => {
       this.setState({filterImage:''});
      this.props.setFilterEnable(false); 
      this.setState({imageUri:''}); 
    }

    takePicture = () => {
    
      this.setState({filterImage:''});
      
      if (this.camera) {
        this.props.setFilterEnable(true)        
        this.camera.capture()
          .then((data) => {
            this.setState({imageUri:data.path,showImage:true})
            this.props.capturedImageCallBack(data.path)
          })
          .catch(err => console.error(err));
      }
    }
  
    renderFilter(filterImage) {
      this.setState({filterImage:filterImage});
    }

    switchType = () => {
      let newType;
      const { back, front } = Camera.constants.Type;
  
      if (this.state.camera.type === back) {
        newType = front;
      } else if (this.state.camera.type === front) {
        newType = back;
      }
  
      this.setState({
        camera: {
          ...this.state.camera,
          type: newType,
        },
      });
    }
  
    get typeIcon() {
      let icon;
      const { back, front } = Camera.constants.Type;
  
      if (this.state.camera.type === back) {
        icon = require('../assets/ic_camera_rear_white_2x.png');
      } else if (this.state.camera.type === front) {
        icon = require('../assets/ic_camera_front_white_2x.png');
      }
  
      return icon;
    }
  
    switchFlash = () => {
      let newFlashMode;
      const { auto, on, off } = Camera.constants.FlashMode;
  
      if (this.state.camera.flashMode === auto) {
        newFlashMode = on;
      } else if (this.state.camera.flashMode === on) {
        newFlashMode = off;
      } else if (this.state.camera.flashMode === off) {
        newFlashMode = auto;
      }
  
      this.setState({
        camera: {
          ...this.state.camera,
          flashMode: newFlashMode,
        },
      });
    }
  
    get flashIcon() {
      let icon;
      const { auto, on, off } = Camera.constants.FlashMode;
  
      if (this.state.camera.flashMode === auto) {
        icon = require('../assets/ic_flash_auto_white_2x.png');
      } else if (this.state.camera.flashMode === on) {
        icon = require('../assets/ic_flash_on_white_2x.png');
      } else if (this.state.camera.flashMode === off) {
        icon = require('../assets/ic_flash_off_white_2x.png');
      }
  
      return icon;
    }


  renderCapturedImage () {
      let imageSource = this.state.imageUri
      if (this.state.imageUri=='' && this.state.showImage !=true ) {
        // console.log('Image not captured')
        return 
      } else {
        // console.log('Image captured')
        return ( 
           <ViewTransformer style={{flex: 1, backgroundColor: 'black', flexDirection: 'column'}} 
            enableScale = {true} enableTransform  = {true} maxScale ={3}>

            <Image
            style={{width: this.state.windowWidth, height: this.state.windowHeight-50, position:'absolute'}}
            source={{uri: imageSource, isStatic:true}}
            />
          </ViewTransformer>
 )} 


    }
  
    render() {

     const crossIcon = require('../assets/cross.png');
   
      const styles = StyleSheet.create({
        crossButton: {
          position: 'absolute',
          paddingTop: 16,
          left: 20, 
          top:70,
        },
        container: {
          flex: 1,
        },
        preview: {
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        },
        overlay: {
          position: 'absolute',
          padding: 10,
          right: 0,
          left: 0,
          alignItems: 'center',
        },
        topOverlay: {
          top: 0,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        bottomOverlay: {
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        captureButton: {
          padding: 10,
          backgroundColor: 'white',
          borderRadius: 40,
        },
        modeButton: {
          padding:10,
        },

        typeButton: {
          padding:5
        },
        flashButton: {
          padding: 5,
        },
        buttonsSpace: {
          width: 10,
        },
      });
      return (
        <View style={styles.container}  onLayout={this.onLayout.bind(this)}>
          <StatusBar
            animated
            hidden
          />
          {
            this.state.imageUri==''?
              <Camera
                  ref={(cam) => {
                  this.camera = cam;
                  if(cam != null)
                  this.props.getPhotoObjCallBack(cam)
                }}
                style={styles.preview}
                aspect={this.state.camera.aspect}
                captureTarget={this.state.camera.captureTarget}
                type={this.state.camera.type}
                flashMode={this.state.camera.flashMode}
                onFocusChanged={() => {}}
                onZoomChanged={() => {}}
                defaultTouchToFocus
                mirrorImage={false}
              />
            :
              this.renderCapturedImage()
          }
          
          { this.state.filterImage != '' ? 
             <View 
            style = {{flex:1, backgroundColor:'transparent',position: 'absolute'}}> 
            <Image
              resizeMode = {'stretch'}
              source = {{uri:this.state.filterImage,isStatic:true}}
              style={{width: windowWidth, height: windowHeight-50-50}}
              /> 
            <TouchableOpacity style={styles.crossButton}
              onPress = {()=> {this.setState({
              filterImage:'',
            })
            }} >
          <Image
            source={crossIcon}
            />
          </TouchableOpacity>

          </View> :null
          }

          {this.state.imageUri=='' ? 
          <View style={[styles.overlay, styles.topOverlay]}>

            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.switchType}
              >
              <Image
                source={this.typeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchFlash}
              >
              <Image
                source={this.flashIcon}
              />
            </TouchableOpacity>

             <TouchableOpacity
              style={styles.modeButton}
              onPress={this.openGallery}
            >
              <Image
                source={this.galleryIcon}
              />
            </TouchableOpacity>

          </View> : null }

          {this.state.imageUri=='' ? 
          <View style={[styles.overlay, styles.bottomOverlay]}>
            {
              <TouchableOpacity
                  style={styles.captureButton}
                  onPress={this.takePicture}
              >
                <Image
                    source={require('../assets/ic_photo_camera_36pt.png')}
                />
              </TouchableOpacity>
            }            
          </View> : null }
        </View>
      );
    }
  }

export default PhotoBooth;




