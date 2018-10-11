'use strict'

import React, { Component } from 'react'
import {Navigation} from 'react-native-navigation';
import  { 
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native'

import stripe from 'tipsi-stripe'

import Button from 'apsl-react-native-button'
import { Metrics, Images } from '../../themes'

export default class HomeScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            modalVisible: false
        }

    }

    goToScreen(){                       
        this.props.navigator.push({
            title: "Appointment Confirmed",         
            screen: "mechaniku.AppointmentConfirmedScreen",                  
            navigatorStyle:{
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true
            },
            navigatorButtons:{
                rightButtons: [
                    {
                        id:'home',
                        title: 'HOME'
                    }
                ]
              }
        })
    }

    goToScheduleScreen(){
        let navButtons = {}
        if(Platform.OS == 'ios'){
            navButtons = {
                leftButtons: [
                    {
                        id: 'back',
                        title:' Cancel'
                    }
                ]
            }
        }else{
            navButtons = {
                leftButtons: [
                    {
                        id: 'back',
                        icon: Images.cancelIcon
                    }
                ]
            }
        }
        this.props.navigator.push({
            title:'Schedule',            
            screen:"mechaniku.DeteSelectionScreen",             
            navigatorStyle:{
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true 
            },
            navigatorButtons: navButtons
        })
    }

    goToSignupScreen(){    
        Navigation.startSingleScreenApp({
            screen:{
              screen: 'mechaniku.SignupScreen',
              title: '',
              navigatorStyle: {
                drawUnderNavBar: false,
                navBarHidden: true
                
              }
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content} >
                    <View style={{paddingTop: 40.5 * Metrics.scaleHeight}} />

                    <Image style={{width:147 * Metrics.scaleHeight * 1.1, height: 147 * Metrics.scaleHeight}} source={Images.oilIcon} />

                    <View style={{paddingTop: 24 * Metrics.scaleHeight}} />

                    <Image style={{width:22 * Metrics.scaleHeight * 7.12, height: 22 * Metrics.scaleHeight}} source={Images.mechanikuTxtIcon} />

                    <View style={{paddingTop: 102 * Metrics.scaleHeight}} />
                    <Text style={styles.titleTxt}>Need an oil change?</Text>
                    <View style={{paddingTop: 28 * Metrics.scaleHeight}} />
                    <Button 
                        style={styles.buttonStyle}
                        onPress={() => {
                            // this.goToScreen()
                            this.goToScheduleScreen()
                        }}
                    >
                        <Text style={styles.buttonTxtStyle} >Schedule Oil Change</Text>
                    </Button>
                    <View style={{paddingTop: 153 * Metrics.scaleHeight}} />
                    <View style={{}}>
                        <TouchableOpacity onPress={() => {
                            this.goToSignupScreen()                        
                        }}>
                            <Text style={{fontSize:17, color:'rgb(61, 59, 238)'}}>Are you a mechanic?</Text>
                        </TouchableOpacity>                        
                    </View>
                </View>                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
    content:{
        alignItems:'center',
        justifyContent: 'center',
    },
    titleTxt:{
        color:'rgba(2,6,33, 0.9)',
        fontSize:30,
        fontWeight:'bold'
    },
    buttonStyle:{
        marginHorizontal: 38 * Metrics.scaleWidth,
        height: 41 * Metrics.scaleHeight,
        backgroundColor:'rgb(61,59,238)',
        alignItems:'center',
        justifyContent:'center',
        // borderRadius:0,
        borderWidth:0
    },
    buttonTxtStyle:{
        // fontFamily:'SF Pro Text',
        color:'#ffffff',
        fontSize:16
    }

})