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
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import DialogBox from 'react-native-dialogbox'

import { Metrics, Images } from '../../themes'
import { Client, localStorage } from '../../services'

export default class TermsOfServiceAlertScreen extends Component{  
    constructor(props){
        super(props)        
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    showDialogBox(msg){
        this.dialogbox.tip({
            title:'Whoops!',
            content: msg,
            btn :{
                text:'OK'
            }
        })
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    goToLogin(){
        localStorage.get('userInfo').then((userInfo) => {
            let info = JSON.parse(userInfo)
            let body = {
                accept_notification: false
            }
    
            Client.setNotification(body, info.authentication_token)
                .end((err, res) => {
                    if(err){
                        this.showDialogBox('There\'s a connection problem!\nTry later.')
                    }else{
                        if(res.body.status == 1){
                            localStorage.remove('userLogin')
                            localStorage.remove('userInfo')
                            Navigation.startSingleScreenApp({
                                screen:{
                                  screen: 'mechaniku.LoginScreen',
                                  title: '',
                                  navigatorStyle: {
                                    drawUnderNavBar: false,
                                    navBarHidden: true,
                                    navBarBackgroundColor:'rgba(248, 248, 248, 0.82)'
                                  }
                                }
                            })
                        }
                    }
            })
        })
    }

    render() {
        return (
            <View style={styles.container}> 
                <View style={styles.content}>
                    <Text style={{fontSize:18, padding:12, color:'rgba(2, 6, 33, 0.8)', textAlign:'center', fontWeight:'bold'}}>
                        We're sorry, you will not be able to work with Mekaniku.</Text>                                        
                </View>
                <View style={{paddingTop:300 * Metrics.scaleHeight, justifyContent:'center', alignItems:'center'}} >
                    <TouchableOpacity  onPress={() => {
                        this.goToLogin()
                    }}>
                        <Text style={{fontSize:17, color:'rgb(61, 59, 238)'}}>Logout</Text>
                    </TouchableOpacity>    
                </View>
                <DialogBox ref={dialogbox => {this.dialogbox = dialogbox}} />
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
        marginTop:155 * Metrics.scaleHeight, 
        backgroundColor:'rgb(240, 241, 246)',
        marginHorizontal:34 * Metrics.scaleWidth,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:4,
        // height: 63 * Metrics.scaleHeight
    },    
    
   
})