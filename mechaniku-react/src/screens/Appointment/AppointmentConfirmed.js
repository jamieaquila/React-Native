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
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import { Navigation } from 'react-native-navigation';

import { Metrics, Images } from '../../themes'
import { Client, localStorage, stateNames } from '../../services'


export default class AppointmentConfirmedScreen extends Component{   
    constructor(props){
        super(props)
        this.state = {
            appointmentId:this.props.appointmentId
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        
    }
    onNavigatorEvent(event){
        if(event.id === 'home'){
            localStorage.remove('curStatus')
            localStorage.remove('appointmentId')
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
    }

    goToFindAppointmentScreen(){
        this.props.navigator.push({
            title: "Find Your Appointment",         
            screen: "mechaniku.FindAppointmentScreen", 
            passProps: {
                appointmentId: this.state.appointmentId                
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
            <View style={styles.container}> 
                <View style={styles.content}>
                    <Text style={{fontSize:13, padding:12, color:'rgba(2, 6, 33, 0.6)', textAlign:'center'}}>A mechanic has accepted your appointment.</Text>
                </View>
                <View style={{paddingTop:72 * Metrics.scaleHeight}} />
                <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Image style={{width:190 * Metrics.scaleHeight, height: 175 * Metrics.scaleHeight}} source={Images.mechanicCheckedIcon} />
                </View>
                <View style={{paddingTop:70 * Metrics.scaleHeight, paddingHorizontal:42, justifyContent:'center', alignItems:'center' }}>
                    <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.9)', textAlign:'center'}}>Confirmation: #{this.state.appointmentId}</Text>
                </View>               
                <View style={{paddingTop:155 * Metrics.scaleHeight}}/>
                <TouchableOpacity style={{alignItems:'center', justifyContent:'center'}} onPress={() => {
                    this.goToFindAppointmentScreen()
                }}>
                    <Text style={{fontSize:17, color:'rgb(61, 59, 238)'}}>Cancel This Appointment</Text>
                </TouchableOpacity>
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
        height: 44 * Metrics.scaleHeight
    },     
   
})