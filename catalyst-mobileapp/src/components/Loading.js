import React from 'react';
import { View, Image, Animated, Easing, StyleSheet, Platform, InteractionManager} from 'react-native';
//import Permissions from 'react-native-permissions';
import { connect } from 'react-redux';
import Router from './Router';

class Loading extends React.Component {
  /*state = {
    cameraPermission: "",
    photoPermission: ""
  }*/
  _launchImageOpacityVal = new Animated.Value(1);

  componentDidMount() {
  //  if (Platform.OS === 'android') {
  //    this.checkPermission();
  //  }


  }  
  /*_requestPhotoPermission = () => {
    Permissions.request('photo').then(response => {
      this.setState({ photoPermission: response })
    })
  }
  _requestCameraPermission = () => {
    Permissions.request('camera').then(response => {
      this.setState({ cameraPermission: response })
    })
  }
  checkPermission() {
      InteractionManager.runAfterInteractions(() => {

        Permissions.checkMultiple(['camera', 'photo']).then(response => {
          //response is an object mapping type to permission

          this.setState({
            cameraPermission: response.camera,
            photoPermission: response.photo
          })          
          if(response.photo === "undetermined") {
            this._requestPhotoPermission();
          }
          if(response.camera === "undetermined") {
            this._requestCameraPermission();
          }     
          if(response.photo)     
        })
      });
  } */

  checkIsReadyToLoad() {
    var keys = Object.keys(this.props);
    var i = 0;
    while (keys[i]) {
      if (this.props[keys[i]].isLoading) return false;
      i++;
    }
    this.hideLaunchImage();
  }

  hideLaunchImage() {
    Animated.timing(this._launchImageOpacityVal, {
      toValue: 0,
      easing: Easing.linear,
      duration: 200,
      delay: 1000,
    }).start();
  }

  render() {
    this.checkIsReadyToLoad();
    return (
      <View style={{flex:1}}>
        <Router/>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Loading);
