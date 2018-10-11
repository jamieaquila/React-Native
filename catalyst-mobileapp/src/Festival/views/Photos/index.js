import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Button, Text, Image, StyleSheet,ScrollView, TouchableWithoutFeedback,TouchableOpacity,Dimensions, Alert, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';

import { NavigationBar } from '../../../components/molecules';
import Photos from './components/Camera';
import RNFS from 'react-native-fs'
import Share from 'react-native-share';

import { app as appConfig } from '../../../config'
import { getGeoFilters } from '../../../actions/AppActions'
import { geoFilterPostcall } from '../../../actions/GeoFiltersActions'

import Orientation from 'react-native-orientation';


let windowHeight = Dimensions.get('window').height
let windowWidth = Dimensions.get('window').width
var CameraComp;




class PhotoBooth extends Component {

  constructor(props) {
    super(props);
    this.camera = null;

    this.state = {
      isCamera:true,
      isPreview:true,
      isCurrentFilter:'',
      isFilterEnable:false,
      uriToShare:'',
      capturedImageURI:'',
      geoFilterId:'',
      showAnimation:false,
      latitude:-100,
      longitude:-100,
      windowWidth:windowWidth,
      windowHeight:windowHeight,
    }

     if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
              .then(granted => {
                if (granted){
                  this.currentPosition()
                }
                else
                  this.loadGeoFilters();
              });
          } else {
            this.currentPosition()
    }
  }

  currentPosition(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude:position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // console.warn(position.coords.latitude);
        // console.warn(position.coords.longitude);
        this.loadGeoFilters();

      },
      (error) => {
        this.loadGeoFilters();

      },
      {enableHighAccuracy: Platform.OS == 'android' ? false : true, timeout: 20000, maximumAge: 1000}
    );
  }


  loadGeoFilters(){
     const { dispatch } = this.props
    dispatch(getGeoFilters(appConfig.id));
  }

  takePicture(){
    this.refs.camera.takePicture();
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

  switchType = () => {
    this.setState({isCamera:!this.state.isCamera});
  }


  renderGallery(){
    return (
      <Image
           source={{uri: this.state.capturedImageURI, isStatic:true}}
           style={{width: this.state.windowWidth, height: this.state.windowHeight-50-50-50-40}}/>
    );
  }

  render() {
    const { navigator, app } = this.props,
    { geoFilterObject } = app,
    styles = StyleSheet.create({
      box: {
        width: 60,
        height: 90,
        borderRadius:10,
        marginHorizontal:3,
        marginTop:5,
        marginBottom:5,
        backgroundColor: 'rgba(0,0,0,0.4)',
      }
    });


    let marginFilter = this.state.isPreview?80:0;
    return (
      <View style={{flex: 1, width: this.state.windowWidth, backgroundColor: 'black', flexDirection: 'column'}} ref = {"rootView"} onLayout={this.onLayout.bind(this)}>
        <NavigationBar
          navigator={navigator}
          title="Photo Booth"
          style={{
            flex: 0,
          }}
        />

        <View style={{flex: 1, backgroundColor: 'black', flexDirection: 'column'}} pointerEvents = "box-none">
          <Photos
            ref = "camera"
            setFilterEnable = {(val) => this.setFilterEnable(val) }
            capturedImageCallBack={(image) => {this.capturedImageCallBack(image)}}
            getPhotoObjCallBack={this.getPhotoObjCallBack}
            filterImage = {this.isCurrentFilter}
            />
        </View>

        {
          this.state.isCurrentFilter ?
            this.renderFilter()
          :
            null
        }
        <View
          style = {{flexDirection:'row',  position:'absolute' , bottom:marginFilter}}>
          <ScrollView horizontal ={true} >
          {
            geoFilterObject.map((item, index) => {
              let canShow = true;
              if(item.locationLock){
                if(item.startDateTime === undefined || item.startDateTime === ''|| item.startDateTime === null)
                  canShow = false;
                if(item.endDateTime === undefined || item.endDateTime === '' || item.endDateTime === null)
                  canShow = false;

                if(item.latitude - item.radius > this.state.latitude || this.state.latitude > item.latitude + item.radius)
                    canShow = false;
                if(item.longitude - item.radius > this.state.longitude || this.state.longitude > item.longitude + item.radius)
                    canShow = false;
              }
              if(!canShow) return;
              return (
                <TouchableWithoutFeedback
                  onPress = {()=>this.applyFilter(item.geofiltersURL,item.id)} >
                  <Image
                    resizeMode = {'stretch'}
                    key={index}
                    style={styles.box}
                    source={{uri: item.geofiltersURL}}
                  />
                </TouchableWithoutFeedback>
              )
            })
          }
          </ScrollView>
        </View>

        {
          this.state.showAnimation &&
            <ActivityIndicator
              style = {{position:'absolute',alignSelf:'center',top:300}}
              animating={true}
              size="large"
            />
        }
      </View>
    );
  }

  capturedImageCallBack(capturedImageURI){
    // console.log(capturedImageURI)
    this.setState({capturedImageURI:capturedImageURI ,isPreview:false})
    this.renderFilter();

  }

  getPhotoObjCallBack(cameraObj){
    CameraComp =cameraObj;
  }

  onImageLoad(isShared=false, activityType){
    const { dispatch } = this.props
    CameraComp.addFilterImageOverlayOnBaseImage(this.state.capturedImageURI, this.state.isCurrentFilter).then((data)=>{
      // console.log('final image -----')
      // console.log(data)
      this.setState({
        uriToShare: data.path,
        showAnimation: false
      }, () => {
        dispatch(geoFilterPostcall(this.props.auth.userId,this.state.geoFilterId,activityType))
        if(isShared == true) {
          if(Platform.OS == 'android'){
            RNFS.readFile(this.state.uriToShare, 'base64')
              .then((success) => {
                const base64Url = 'data:image/jpeg;base64,' + success
                Share.open({
                  url: base64Url,
                  subject: "Check out my photo!"
                })
              })
              .catch((err) => {
                  // console.log(err)
            })
          }else{
            // console.log(this.state.uriToShare)
            Share.open({
              url: this.state.uriToShare,
              subject: "Check out my photo!"
            })
          }
          // Alert.alert('Shared Success');
        } else {
          Alert.alert('Successfully Saved');
        }
      })
    })
    return

  };

  renderFilter() {
    const crossIcon = require('./assets/cross.png');
    const shareIcon = require('./assets/share.png');
    const saveIcon = require('./assets/save.png');

    let filterImage = this.state.isCurrentFilter


    if(!this.state.isFilterEnable) {
      this.refs.camera.renderFilter(filterImage);
      return;
    }

    return (
      <View
        style = {{flex:1, backgroundColor:'transparent',position: 'absolute',top:60}}
        pointerEvents="box-none">
        <Image
          pointerEvents="none"
          resizeMode = {'stretch'}
          source = {{uri:filterImage,isStatic:true}}
          style={{width: windowWidth, height: windowHeight-50-50}}
          />
        <TouchableOpacity style={styles.crossButton}
          onPress = {()=> {
            this.setState({ isCurrentFilter:'', isPreview:true});
            this.refs.camera.initCamera();
        }} >
          <Image source={crossIcon}/>
        </TouchableOpacity>

        <View style = {{flex:1, backgroundColor:'transparent', flexDirection: 'row',position: 'absolute',top:30,
          justifyContent: 'center',  alignItems: 'center', padding: 10,
          right: 0 ,left: 0}}>
          {
            !this.state.isPreview ?
              <TouchableOpacity
                style={styles.share}
                onPress={()=> {
                  this.setState({
                    showAnimation:true,
                  }, () => {
                    this.onImageLoad(true,"shared");
                  });
                }}>
                <Image
                  source={shareIcon}
                />
              </TouchableOpacity>
            :null
          }

          {
            !this.state.isPreview ?
              <TouchableOpacity style={styles.download}
                onPress = {()=> {
                  this.setState({
                    showAnimation:true,
                  }, () => {
                    this.onImageLoad(false, "saved")
                  });
                }} >
              <Image
                source={saveIcon}
                />

            </TouchableOpacity>
          :
            null
          }
        </View>

      </View>
    )
  }


  setFilterEnable(val) {
    this.setState({
      isFilterEnable:val,
    })
  }

  applyFilter(url,geoFilterId) {
    this.setState({
      isCurrentFilter:url,
      geoFilterId:geoFilterId
    })

  }
}

const mapStateToProps = state => ({
  app: state.app,
  auth: state.auth
});


const styles = StyleSheet.create({

  crossButton: {
    position: 'absolute',
    paddingTop: 16,
    left: 40,
    top:130,
  },
  share: {
    paddingTop:16,
    paddingRight: 16,
    marginRight:10,
    alignItems:'flex-end',
    flex:1,
  },
  typeButton: {
   padding: 10,
  },
  download: {
    paddingTop:16,
    paddingRight: 16,
    marginLeft:10,
    alignItems:'flex-start',
    flex:1,
  },
});

export default connect(mapStateToProps)(PhotoBooth);
