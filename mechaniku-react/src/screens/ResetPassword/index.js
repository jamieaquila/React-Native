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
    Alert
} from 'react-native'
import DialogBox from 'react-native-dialogbox'
import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Navigation } from 'react-native-navigation';

import { Metrics, Images } from '../../themes'
import { Client } from '../../services';

export default class ResetPasswordScreen extends Component{   
    constructor(props){
        super(props)

        this.state = {
            email:'',
            isLoading: false
        }
    }

    checkEmailValidation(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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

    sendLinkAlert(msg){
        Alert.alert(
            '',
            msg,
            [
                {text: 'Ok', onPress: () => {
                    this.goToLoginScreen()                
                }},
            
            ],
            { cancelable: false }
        )
    }

    checkEmail(){
        let body = {
            email: this.state.email
        }
        Client.resetPassword(body)
            .end((err, res) => {
                if(err){
                    this.setState({isLoading: false}, () => {
                        this.showDialogBox('There\'s a connection problem!\nTry later.')
                    })
                }else{
                    if(res.body.status == 1){
                        this.setState({isLoading: false}, () => {
                            this.sendLinkAlert(res.body.data)                            
                        })
                        
                    }else{                        
                        this.setState({isLoading: false}, () => {
                            this.showDialogBox(res.body.data)
                        })
                    }
                }
            })
    }

    goToLoginScreen(){
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

    render() {
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{marginTop:150 * Metrics.scaleHeight, marginLeft:10, alignItems:'flex-start', justifyContent:'flex-start', width:'100%'}}>
                            <Text style={{fontSize:36, color:'rgba(2, 6, 33, 0.6)', fontWeight:'bold'}}>Reset Your Password</Text>
                        </View>

                        <View style={{paddingTop:64 * Metrics.scaleHeight, borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5, width:Metrics.screenWidth}} />

                        <View style={[styles.txtInputView, {borderBottomWidth:0}]} >
                            <Text style={styles.label}>Email</Text>
                            <TextInput 
                                style={styles.input}
                                keyboardType={'email-address'}
                                placeholder={'Email'}
                                placeholderTextColor='rgb(156, 155, 155)'
                                underlineColorAndroid={'transparent'}
                                autoCapitalize='none'
                                onChangeText={(text) => {
                                    this.setState({email:text})
                                }}
                                value={this.state.email}
                                />    
                            {
                                (this.state.email == '' || !this.checkEmailValidation(this.state.email))&&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                          
                        </View>

                        <View style={{borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5, width:Metrics.screenWidth}} />

                        <Button 
                            style={styles.button}
                            isDisabled={(this.state.email != '' && this.checkEmailValidation(this.state.email)) ? false : true}
                            isLoading={this.state.isLoading}
                            activityIndicatorColor="#ffffff"
                            onPress={() => {
                                this.setState({isLoading: true}, () => {
                                    this.checkEmail()
                                })
                            }}
                            >
                            <Text style={{fontSize:16, color:'#ffffff'}}>Reset Password</Text>
                        </Button>
                        
                        
                    </View>
                    <DialogBox ref={dialogbox => {this.dialogbox = dialogbox}} />
                </View>
            </KeyboardAwareScrollView>
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
        backgroundColor:'#ffffff',
        paddingHorizontal:16 * Metrics.scaleWidth
    },
    txtInputView:{
        flexDirection:'row', 
        height:44.5 * Metrics.scaleHeight, 
        width:'100%', 
        borderBottomColor:'rgb(200, 199, 204)', 
        borderBottomWidth:1,
        alignItems:'center',
    },
    label:{
        width:'25%',
        fontSize:17,
        color:'rgb(114, 129, 145)'
    },
    input:{
        width:'67%',
        fontSize:17,
        color:'rgb(2, 6, 33)'
    },
    button:{
        marginTop:223.5 * Metrics.scaleHeight,
        marginHorizontal:22,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
    },
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
    },      
    
})