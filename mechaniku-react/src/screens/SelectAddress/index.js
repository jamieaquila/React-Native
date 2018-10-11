'use strict'

import React, { Component } from 'react'
import  { 
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    ListView,
    ScrollView,
    TextInput,
    Platform,
    PermissionsAndroid,
    Keyboard,
    InteractionManager
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import MapView from 'react-native-maps'
import Geocoder from 'react-native-geocoder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Permissions from 'react-native-permissions'

import { Metrics, Images } from '../../themes'
import { Client, localStorage, stateNames } from '../../services'

export default class SelectAddressScreen extends Component{   
    constructor(props){
        super(props)

        this.state = {
            location:{
                address1:'',
                address2:'',
                state:'',
                city:'',
                zip:'',                
            },            
            region: undefined,
            selectedRigion: undefined,
            date: this.props.date,
            time: this.props.time,
            keyboardHeight: 0

        }
        this._onKeyboardWillShow = this._onKeyboardWillShow.bind(this);
        this._onKeyboardWillHide = this._onKeyboardWillHide.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentWillMount() {
        if(Platform.OS == 'ios') {
            this.keyboardEventListeners = [
                Keyboard.addListener('keyboardWillShow', this._onKeyboardWillShow),
                Keyboard.addListener('keyboardWillHide', this._onKeyboardWillHide)
            ];
        } else {
            this.keyboardEventListeners = [
                Keyboard.addListener('keyboardDidShow', this._onKeyboardWillShow),
                Keyboard.addListener('keyboardDidHide', this._onKeyboardWillHide)
            ];
        }       
    }
    
    componentWillUnmount() {
        this.keyboardEventListeners.forEach((eventListener) => eventListener.remove());
    }

    _onKeyboardWillShow(event) {
        const newKeyboardHeight = event.endCoordinates.height;
        if (this.state.keyboardHeight === newKeyboardHeight) {
            return;
        }   
        this.setState({keyboardHeight: newKeyboardHeight});
    }

    _onKeyboardWillHide(event) {
        this.setState({keyboardHeight: 0});
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.checkAndroidLocationPermission()
        } else {
            this.currentPosition();
        }
    }    

    checkAndroidLocationPermission(){
        InteractionManager.runAfterInteractions(() => {
            Permissions.checkMultiple(['location']).then(response => {
                if(response.location === 'authorized'){
                    this.currentPosition()
                }

                if(response.location === 'undetermined'){
                    this.requestLocationPermission()
                }
            })
        })
    }

    requestLocationPermission(){
        Permissions.request('location').then(response => {
            if(response.location === 'authorized'){
                this.currentPosition()
            }
        })
    }

    currentPosition(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922/1.2,
                    longitudeDelta: 0.0421/1.2
                }

                this.setState({
                    region,
                    selectedRigion: region
                }, ()=>{
                    let latlng ={
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    this.getAddress(latlng)
                })
            },
            (error) => console.log(error)
        ),
        {enableHighAccuracy: Platform.OS == 'android' ? false : true, timeout: 20000, maximumAge: 1000};
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }
    
    onRegionChangeComplete(region){         
        let latlng = {
            lat:region.latitude,
            lng:region.longitude
        }        
        this.setState({region})          
    }

    async getAddress(latlng){    
        try {
            const res = await Geocoder.geocodePosition(latlng);
            let location = {}
            // alert(JSON.stringify(latlng))
            if(res[0].locality == null || res[0].postalCode == null || res[0].adminArea == null){
                location = {
                    address1: '',
                    address2: '',
                    city: '',
                    zip: '',
                    state: ''
                }
            }else {
                location = {
                    address1: res[0].formattedAddress,
                    address2: '',
                    city: res[0].locality,
                    zip: res[0].postalCode,
                    state: res[0].adminArea
                }
            }            
            this.setState({location}, () => {
                this.gpaInput.setAddressText(this.state.location.address1)
            })
        }
        catch(err) {
            // alert(err.message)
            let location = {
                address1: '',
                address2: '',
                city: '',
                zip: '',
                state: ''
            }
            this.setState({location}, () => {
                this.gpaInput.setAddressText(this.state.location.address1)
            })
        }

    }

    goToVehicleDetailScreen(){        
        this.props.navigator.push({
            title: "Vehicle Details",            
            screen: "mechaniku.VehicleDetailsScreen",    
            passProps:{
                date: this.state.date,
                time: this.state.time,
                location: this.state.location
            },        
            navigatorStyle:{
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true
            },
            navigatorButtons: {
                leftButtons: [
                    {
                        id:'back',
                        icon: Images.backBtnIcon
                    }
                    
                ]
            }
        })
    }

    render() {
        return (
            // <KeyboardAwareScrollView contentContainerStyle={{flexGrow:1}}>
            <View style={{flex:1}}> 
                {
                    this.state.region &&
                    <MapView
                        ref = {ref => { this.map = ref; }}
                        style={styles.map}
                        region={this.state.region}
                        onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
                        showsUserLocation={true}
                        onPress={(e)=>{
                            let latlng = {
                                lat:e.nativeEvent.coordinate.latitude,
                                lng:e.nativeEvent.coordinate.longitude
                            }
                            let region = {
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude,
                                latitudeDelta: 0.0922/1.2,
                                longitudeDelta: 0.0421/1.2
                            } 
                  
                            this.setState({
                                region,
                                selectedRigion: region
                            }, () => {
                                this.getAddress(latlng)
                            })
                            
                        }}
                        >
                        <MapView.Marker
                            coordinate={this.state.selectedRigion}
                            image={Images.mapPinIcon}
                        />
                    </MapView>
                }              
            
                <View style={[styles.addressView, Platform.OS == 'ios' && {bottom: 10 + this.state.keyboardHeight}]}>
                    <GooglePlacesAutocomplete
                        ref={(input) => { this.gpaInput = input; }} 
                        placeholder="Search For An Address...."
                        placeholderTextColor="#000"
                        minLength={1}
                        autoFocus={false}
                        listViewDisplayed="auto"
                        fetchDetails={true}
                        renderDescription={row => row.description}
                        onPress={(data, details = null) => {
                            let region = {
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng,
                                latitudeDelta: 0.0922/1.2,
                                longitudeDelta: 0.0421/1.2
                            }
                        
                            this.setState({
                                region,
                                selectedRigion: region
                            }, ()=>{
                                let latlng ={
                                    lat: details.geometry.location.lat,
                                    lng: details.geometry.location.lng
                                }
                                this.getAddress(latlng)
                            })
                        }}
                        
                        query={{
                            key: 'AIzaSyCFQXyosWbxw95jnNtruOY4btR1ztnuXQE',
                            language: 'en',
                            types: ''
                        }}					
                        nearbyPlacesAPI="GooglePlacesSearch"
                        GoogleReverseGeocodingQuery={{}}
                        GooglePlacesSearchQuery={{
                            rankby: 'distance',
                            types: 'food'
                        }}
                        styles={
                            {
                                textInputContainer: {      
                                    backgroundColor: '#fff',                                    
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0,
                                    
                                },
                                textInput: {
                                    width:'100%',
                                    fontSize: 15,
                                    color: '#000',
                                    fontWeight:'bold',
                                    backgroundColor: '#fff',
                                    textAlign: 'left',
                                },
                                listView: {                                           
                                    width: '100%',
                                    height: 250 * Metrics.scaleHeight,                                        
                                    backgroundColor:'#fff',
                                    zIndex:11

                                },
                                container: { 
                                    zIndex:10,
                                },                                
                                description: {
                                    fontWeight: 'bold',
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb',
                                },
                            }
                        }
                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                        debounce={200}      
                        renderRightButton={() => {
                            if(Platform.OS == 'android'){
                                return  <TouchableOpacity style={{justifyContent:'center', paddingRight:5}} onPress={() => {
                                    this.gpaInput.setAddressText('')
                                }}>
                                        <Icon style={{color:'grey'}} name="times-circle" size={15} />
                                    </TouchableOpacity>
                            }else return null
                        }}                         
                    /> 
                </View>      
                {
                    this.state.keyboardHeight == 0 &&
                    <Button 
                        style={styles.selectBtnStyle}
                        isDisabled={this.state.location.address1 == '' ? true : false}                        
                        onPress={() => {
                            this.goToVehicleDetailScreen()
                        }}
                        >
                        <Text style={{fontSize:16, color:'#ffffff'}}>Select Location!</Text>
                    </Button> 
                }
                                     
            </View>
            // </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,         
    },
    map: { 
        flex: 1
    },
    addressView: {    
        position:'absolute',
        left: '3%',
        bottom: 10,
        width:'94%',
        height:147 * Metrics.scaleHeight,
        backgroundColor:'#ffffff',
        borderRadius: 10
    },
    selectBtnStyle: {       
        position: 'absolute',
        left:'5%',
        bottom:20,
        width: '90%',
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
        zIndex:11
    },
    locationTxt: {
        width:'100%',        
        fontSize: 17,
        paddingHorizontal: 10,
        color: 'rgb(2, 6, 33)'
    }
})