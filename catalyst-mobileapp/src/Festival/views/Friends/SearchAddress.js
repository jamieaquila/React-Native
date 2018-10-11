import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, AsyncStorage, Alert, Platform, Image, PermissionsAndroid, Dimensions, ScrollView, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { connect } from 'react-redux';
import { NavigationBar } from '../../../components/molecules';
import Geocoder from 'react-native-geocoder'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SetLocation from './SetLocation'

class SearchAddress extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            latlng: this.props.latlng,
            lightshowName:'',
            address: '',
            venueName: '',
        }
    }

    componentDidMount() {  
        Geocoder.geocodePosition(this.state.latlng).then((res) => {
            console.log(res)
            let address = res[0].streetNumber + " " 
                            + res[0].streetName + ", " 
                            + res[0].locality + ", " 
                            + res[0].adminArea + " " 
                            + res[0].postalCode + ", " 
                            + res[0].country
            let venueName = res[0].streetNumber + " " + res[0].streetName
            this.setState({
                address,
                venueName
            })
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    goToSetLocationScreen(data){
        const { navigator, prevPage, prevData } = this.props
        
        if(prevPage == 'lightshow'){
            if(this.state.lightshowName == ''){
                Alert.alert(
                    "Uh Oh", 
                    "Please enter lightshow name.",
                    [
                      {text: 'OK', onPress: () => {
                      }},
                    ]
                  )
            }else{
                navigator.push({
                    component: SetLocation,
                    passProps: {
                        data:data,
                        prevPage: prevPage,                        
                        lightshowName: this.state.lightshowName
                    }
                }) 
            }
        }else{
            navigator.push({
                component: SetLocation,
                passProps: {
                    data:data,
                    prevPage: prevPage,
                    prevData: prevData,
                }
            }) 
        }
    }

    render () {
        const { navigator, latlng } = this.props

        return (
            <View style={styles.wrapper}>
                <NavigationBar
                    navigator={navigator}
                    title="Use Current Address"                
                />
                <KeyboardAwareScrollView contentContainerStyle={{flexGrow:1}}>
                    <View style={styles.content}>
                    {
                        this.props.prevPage == 'lightshow' &&
                        <View style={{}}>
                            <Text style={styles.title}>Lightshow Name</Text>
                            <View style={{paddingTop:10}} />
                            <TextInput 
                                style={{paddingLeft:10,  color:'#000', fontSize:14, backgroundColor:'#fff', height:35, borderRadius:10}}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({lightshowName: text})
                                }}
                                value={this.state.lightshowName}
                                />
                        </View>
                    }
                        
                        <View style={styles.currentAddress}>
                            <View style={{paddingTop:10}} />
                            <Text style={styles.title}>Address</Text>
                            <TouchableOpacity onPress={() => {
                                if(this.state.address != '' && this.state.venueName != ''){
                                    let selInfo = {
                                        position:{
                                            lat: this.state.latlng.lat,
                                            lng: this.state.latlng.lng
                                        },
                                        address: this.state.address,
                                        venueName: this.state.venueName
                                    }
                                    this.goToSetLocationScreen(selInfo)
                                }                                
                            }}>
                                <Text style={styles.address}>{this.state.address}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.latlng}>
                            <View style={{width:'50%'}}>
                                <Text style={styles.title}>Latitude</Text>
                                <Text style={styles.address}>{latlng.lat}</Text>
                            </View>
                            <View style={{width:'50%'}}>
                                <Text style={styles.title}>Longitude</Text>
                                <Text style={styles.address}>{latlng.lng}</Text>
                            </View>
                        </View>
                        <View style={{paddingTop:25}} />
                        <View style={{width:'100%', alignItems:'center'}}>
                            <GooglePlacesAutocomplete
                                placeholder="Search For An Address...."
                                placeholderTextColor="#000"
                                minLength={1}
                                autoFocus={false}
                                listViewDisplayed="auto"
                                fetchDetails={true}
                                renderDescription={row => row.description}
                                onPress={(data, details = null) => {  
                                    let selInfo = {
                                        position:{
                                            lat: details.geometry.location.lat,
                                            lng: details.geometry.location.lng
                                        },
                                        address: data.description,
                                        venueName: details.name
                                    }
                                    this.goToSetLocationScreen(selInfo)
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
                                styles={{
                                    textInputContainer: {                                   
                                        backgroundColor: '#fff',
                                        borderTopWidth:0,
                                        borderBottomWidth:0,
                                        borderRadius:15
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
                                        height: 300,
                                        alignSelf: 'center',
                                        backgroundColor:'#fff'

                                    },
                                    container: {                                 
                                        // position: 'absolute',
                                        // top: 0,
                                        width:'100%',
                                        height:300
                                    },                                
                                    description: {
                                        fontWeight: 'bold',
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#1faadb',
                                    },
                                }}
                                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                                debounce={200}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor:'transparent',
    }, 
    content: {
        flex: 1,
        paddingTop:15,
        paddingHorizontal: 25
    },  
    title: {
        color:'#fff',
        fontSize: 18,
        fontWeight:'bold'
    },
    address: {
        paddingTop:5,
        color:'#fff',
        fontSize:14
    },
    latlng: {
        paddingTop:25,
        flexDirection:'row'
    }  
});

export default SearchAddress;