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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DialogBox from 'react-native-dialogbox'


import { Metrics, Images } from '../../themes'
import { Client, localStorage } from '../../services';

export default class LoginScreen extends Component{   
    constructor(props){
        super(props)

        this.state = {
            // email:'admin@email.com',
            // password:'admin123',
            email:'',
            password:'',
            isLoading: false
        }
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

    checkLogin(){
        localStorage.get('deviceInfo').then((deviceInfo) => {            
            let info = JSON.parse(deviceInfo)
            // let body = {
            //     email: this.state.email,
            //     password: this.state.password,
            //     device_token: info.token,
            //     device_type: info.os
            // }
            let body = {
                email: this.state.email,
                password: this.state.password,
                device_token: "60a1ab18fced30c952cfcd4e37e1430efc457d1dc86b02713757f24a662c085e",
                device_type: 'ios'
            }
            Client.login(body)
                .end((err, res) => {
                    if(err){
                        this.setState({isLoading: false}, () => {
                            this.showDialogBox('There\'s a connection problem!\nTry later.')
                        })
                    }else{
                        if(res.body.status == 1){
                            localStorage.set('userLogin', 'true')
                            console.log(res.body.data)
                            let userInfo = res.body.data
                            localStorage.set('userInfo', JSON.stringify(userInfo))
                            this.setState({isLoading: false}, ()=>{
                                if(userInfo.user_type == 1){
                                    this.goToAdminUsersScreen()
                                }else{
                                    this.goToMechanicAppointmentsScreen()
                                }
                            })                            
                        }else{
                            this.setState({isLoading: false}, () =>{
                                let msg = res.body.data
                                if(msg.substr(msg - 1, 1) != ".") msg += "."                
                                this.showDialogBox(msg)
                            })
                        }
                    }
            })
        })
    }

    goToSignUpScreen(){
        Navigation.startSingleScreenApp({
            screen:{
              screen: 'mechaniku.SignupScreen',
              title: '',
              navigatorStyle: {
                drawUnderNavBar: false,
                navBarHidden: true,
                navBarBackgroundColor:'rgba(248, 248, 248, 0.82)',
                navBarTitleTextCentered:true
              }
            }
          })
    }

    goToResetPasswordScreen(){
        this.props.navigator.push({
            screen:"mechaniku.ResetPasswordScreen",            
            navigatorStyle:{
                navBarHidden: true,               
            }
        })
    }

    goToAdminUsersScreen(){
        this.props.navigator.push({
            title:'',            
            screen:"mechaniku.AdminUsersScreen",            
            navigatorStyle:{
                navBarHidden: true,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true
            }            
        })
    }

    goToMechanicAppointmentsScreen(){
        Navigation.startSingleScreenApp({
            screen: {
                title: 'Appointments',
                screen:'mechaniku.MechanicAppointmentScreen',
                navigatorStyle: {
                    navBarHidden: false,
                    navBarBackgroundColor:'rgba(248,248,248,0.82)',
                    navBarNoBorder:true,
                    navBarTitleTextCentered:true
                },
                navigatorButtons : {
                    rightButtons: [
                        {
                            id:'logout',
                            title: 'Logout'
                        }
                        
                    ]
                }
            }
            
        })        
    }

    checkEmailValidation(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    checkDisableBtnStatus(){
        if((this.state.email != '' && 
            this.checkEmailValidation(this.state.email)) && this.state.password != ''){
            return false
        }else{
            return true
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{marginTop:24 * Metrics.scaleHeight, paddingLeft:10, alignItems:'flex-start', justifyContent:'flex-start', width:'100%'}}>
                            <Image style={{width:120 * Metrics.scaleHeight, height:120 * Metrics.scaleHeight}} source={Images.avatarMechanicsIcon} />
                            <Text style={{fontSize:36, color:'rgba(2, 6, 33, 0.6)', paddingTop:16 * Metrics.scaleHeight, fontWeight:'bold'}}>Login as Mechanic</Text>
                        </View>
                        <View style={{paddingTop:60 * Metrics.scaleHeight, borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5, width:Metrics.screenWidth}} />
                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Email</Text>
                            <TextInput 
                                style={styles.input}
                                keyboardType={'email-address'}
                                placeholder={'Email'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                autoCapitalize='none'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({email: text})
                                }}
                                value={this.state.email}
                                /> 
                            {
                                (this.state.email == '' || this.checkEmailValidation(this.state.email) == false) &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }    
                                                    
                        </View>                            
                        
                        <View style={[styles.txtInputView, {borderBottomWidth:0}]} >
                            <Text style={styles.label}>Password</Text>
                            <TextInput 
                                style={styles.input}
                                secureTextEntry={true}
                                placeholder={'Password'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({password: text})
                                }}
                                value={this.state.password}
                                /> 
                            {
                                this.state.password == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }    
                                                    
                        </View>
                        <View style={{borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5, width:Metrics.screenWidth}} />   

                        <TouchableOpacity style={{marginTop:24 * Metrics.scaleHeight}} onPress={() => {
                            this.goToResetPasswordScreen()
                            }}>
                            <Text style={{color:'rgb(83, 170, 243)', fontSize:17}}>Forgot password?</Text>
                        </TouchableOpacity>

                        <Button 
                            style={styles.loginButton}
                            isDisabled={this.checkDisableBtnStatus()}
                            isLoading={this.state.isLoading}
                            activityIndicatorColor="#ffffff"
                            onPress={() => {
                                this.setState({isLoading: true}, () => {
                                    this.checkLogin()
                                })
                                
                                // this.goToAdminUsersScreen()
                            }}
                            >
                            <Text style={{fontSize:16, color:'#ffffff'}}>Login</Text>
                        </Button>

                        <TouchableOpacity style={{marginTop:10 * Metrics.scaleHeight}} onPress={() => {
                                this.goToSignUpScreen()
                            
                            
                            }}>
                            <Text style={{color:'rgb(83, 170, 243)', fontSize:17}}>Not member yet?</Text>
                        </TouchableOpacity>
                        
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
        paddingHorizontal:16 * Metrics.scaleWidth
    },      
    loginButton:{
        marginTop:136 * Metrics.scaleHeight,
        marginHorizontal:22,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
    },
    txtInputView:{
        flexDirection:'row', 
        height:44.5 * Metrics.scaleHeight, 
        width:'100%',   
        borderBottomColor:'rgb(200, 199, 204)', 
        borderBottomWidth:0.5,
        alignItems:'center',
    },
    label:{
        width:'35%',
        fontSize:17,
        color:'rgb(114, 129, 145)'
    },
    input:{
        width:'57%',
        fontSize:17,
        color:'rgba(2, 6, 33, 0.9)',
    },
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
    },
})