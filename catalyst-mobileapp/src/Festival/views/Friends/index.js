import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, AsyncStorage, Alert, Platform, Image, PermissionsAndroid } from 'react-native';
import { connect } from 'react-redux';
import {getMyLocation, getMyFriendsLocation} from '../../../actions/FindFriendActions'; 

import { NavigationBar } from '../../../components/molecules';
import FriendsMap from './components/Map';
import SearchAddress from './SearchAddress'
import albumReducer from '../../../reducers/albumReducer';
import Profile from '../../../../src/components/views/Profile'

const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = 0.0421


class Friends extends Component {

  constructor(props) {
    super(props);
    this.state = {
      myPosition:{},
      region: {
        latitude: Number(37.426727),
        longitude: Number(-122.080377),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
     };
     this.mounted = false;
     this.updateMyLocation = this.updateMyLocation.bind(this);
     this.updateFriendLocation = this.updateFriendLocation.bind(this);
  }

  updateMyLocation(){
    AsyncStorage.getItem('auth')
      .then(authString => {
        var auth = JSON.parse(authString);
        if(auth) {
          if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
              .then(granted => {
                if (granted){
                  this.currentPosition()  
                } 
              });
          } else {
            this.currentPosition()  
          }
        }else{
          Alert.alert(
            "Uh Oh", 
            "Please connect your Facebook account to use Find Friends!",
            [
              {text: 'OK', onPress: () => {
                this.props.navigator.push({
                  component: Profile,
                  passProps: {
                    findFriend: true
                  }
                })
              }},
            ]
          )
        }
    })
    
  }

  updateFriendLocation(){
    const { dispatch } = this.props;
    AsyncStorage.getItem('auth')
		.then(authString => {
      var auth = JSON.parse(authString);
      if(auth) {
        dispatch(getMyFriendsLocation());
      }else{
        Alert.alert(
          "Uh Oh", 
          "Please connect your Facebook account to use Find Friends!",
          [
            {text: 'OK', onPress: () => {
              this.props.navigator.push({
                component: Profile,
                passProps: {
                  findFriend: true
                }
              })
            }},
          ]
        )
      }
    })
  }

  componentWillUnmount() {
  } 

  componentDidMount() {  
    // this.currentPosition();
  }

  currentPosition(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
        }, () => {
          const { dispatch } = this.props;
          dispatch(getMyLocation(position.coords.longitude, position.coords.latitude));   
        })
      },
      (error) => {
        // console.log(JSON.stringify(error))     
      },
      {enableHighAccuracy: Platform.OS == 'android' ? false : true, timeout: 20000, maximumAge: 1000}
    );
  }

  regionChangeComplete(region){
    this.setState({region: region.region})
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  
  render() {
    const { navigator, friends, auth } = this.props,
    
      styles = StyleSheet.create({
        wrapper: {
          flex: 1,
          backgroundColor:'transparent',
          flexDirection: 'column'
        },              
        lastUpdated:{
          color: 'white',
          textAlign: 'center',
          paddingTop: 15,
        },
        buttonWrap: {
          bottom:'12%',
          position:'absolute',          
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor:'transparent',
          zIndex:10
        },
        button: {          
          width: 30,
          height: 30,
          justifyContent: 'center'
        },
      })
      // console.log(auth)
  
    return (
      <View style={styles.wrapper}>
        {/* <NavigationBar
          navigator={navigator}
          title="Find My Friends"
          style={{
            flex: 0,
          }}
        /> */}
        <FriendsMap 
          friends={friends.friends}
          region={this.state.region}
          regionChangeComplete={this.regionChangeComplete.bind(this)}
        />
        {
          this.state.region &&
          <View style={styles.buttonWrap}>
            <View style={{width:'25%', justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity
                onPress={this.updateMyLocation}
                activeOpacity={0.7}
                style={styles.button}>
                <Image style={{width:30, height: 30}} source={require("./assets/mylocation.png")} />          
              </TouchableOpacity>
            </View>
            
            <View style={{width:'50%', justifyContent:'center', alignItems:'center'}}>
            {
              auth && auth.role === 'admin' &&
              <TouchableOpacity
                onPress={() => { 
                  navigator.push({
                    component: SearchAddress,
                    passProps: {
                      latlng: {
                        lat:this.state.region.latitude,
                        lng:this.state.region.longitude
                      },
                      prevPage: 'friend'
                    }
                  }) 
                }}
                style={styles.button}>            
                <Image style={{width:30, height: 30}} source={require("./assets/appLocation.png")} />
              </TouchableOpacity>
            }              
            </View>

            <View style={{width:'25%', justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity
                onPress={this.updateFriendLocation}
                style={styles.button}>            
                <Image style={{width:30, height: 30}} source={require("./assets/friendIcon.png")} />
              </TouchableOpacity>
            </View>
          </View>  
        }              
        <Text
          style={styles.lastUpdated}>
          Location Last Updated At:
        </Text>

      </View>
    );
  }

}

var mapStateToProps = state => ({ friends: state.findMyFriends, auth: state.auth });
export default connect(mapStateToProps)(Friends);
