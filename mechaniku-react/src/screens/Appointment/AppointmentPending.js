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
    TextInput
} from 'react-native'
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'

import { Metrics, Images } from '../../themes'
import { localStorage } from '../../services';

export default class AppointmentPendingScreen extends Component{   
    constructor(props){
        super(props)       
    
    }

    componentDidMount() {
        
    }

    goToHome(){
        localStorage.remove('curStatus')
        Navigation.startSingleScreenApp({
            screen:{
                title: '',
                screen:'mechaniku.HomeScreen',
                navigatorStyle: {
                    navBarHidden: true,
                    navBarBackgroundColor:'rgba(248,248,248,0.82)',
                    navBarNoBorder:true,
                    navBarTitleTextCentered:true 
                }
            }
        }) 
    }
    
    render() {
        return (
            <View style={styles.container}> 
                <View style={styles.content}>
                    <Text style={{fontSize:13, padding:12 * Metrics.scaleHeight, color:'rgba(2, 6, 33, 0.6)', textAlign:'center'}}>Payment method approved. You will not be charged until the appointment is complete.</Text>
                </View>
                <View style={{paddingTop:20 * Metrics.scaleHeight}} />
                <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Image style={{width:122 * Metrics.scaleHeight, height: 274 * Metrics.scaleHeight}} source={Images.appPendingIcon} />
                </View>
                <View style={{paddingTop:50 * Metrics.scaleHeight, paddingHorizontal:42, justifyContent:'center', alignItems:'center' }}>
                    <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.9)', textAlign:'center'}}>We’re locating an amazing mechanic. This may take a few minutes.</Text>
                </View>
                <View style={{paddingTop:30 * Metrics.scaleHeight, paddingHorizontal:50, justifyContent:'center', alignItems:'center' }}>
                    <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)', textAlign:'center'}}>Feel free to leave the application, we’ll ping you when it’s confirmed.</Text>
                </View>
                <View style={{paddingTop:15 * Metrics.scaleHeight, justifyContent:'center', alignItems:'center'}} >
                    <TouchableOpacity  onPress={() => {
                        this.goToHome()
                    }}>
                        <Text style={{fontSize:17, color:'rgb(61, 59, 238)'}}>Go to Home</Text>
                    </TouchableOpacity>    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,    
        backgroundColor:'rgba(239, 241, 245, 0.74)'     
    },    
    content:{       
        marginTop:15 * Metrics.scaleHeight, 
        backgroundColor:'rgb(240, 241, 246)',
        marginHorizontal:34 * Metrics.scaleWidth,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:4,
        height: 63 * Metrics.scaleHeight
    },     
   
})