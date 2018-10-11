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
import { Client, localStorage } from '../../services'

export default class SignupScreen extends Component{   
    constructor(props){
        super(props)

        this.state = {
            firstName:'',
            lastname:'',
            company:'',
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

    checkEmailValidation(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    checkDisableBtnStatus(){
        if(this.state.firstName != '' && this.state.lastname != '' && 
            (this.state.email != '' && 
            this.checkEmailValidation(this.state.email)) && this.state.password != ''){
            return false
        }else{
            return true
        }
    }

    checkSignup(){
        localStorage.get('deviceInfo').then((deviceInfo) => {            
            let info = JSON.parse(deviceInfo)
            let body = {
                first_name: this.state.firstName,
                last_name: this.state.lastname,
                email: this.state.email,
                company: this.state.company,
                password: this.state.password,
                device_token: info.token,
                device_type: info.os
                // device_token: "60a1ab18fced30c952cfcd4e37e1430efc457d1dc86b02713757f24a662c085e",
                // device_type: 'ios'
            }
            Client.signUp(body)
                .end((err, res) => {
                    if(err){
                        this.setState({isLoading: false}, () =>{
                            this.showDialogBox('There\'s a connection problem!\nTry later.')
                        })
                        
                    }else{
                        if(res.body.status == 1){
                            this.setState({isLoading: false}, () => {
                                localStorage.set('loginStatus', true);                                                
                                localStorage.set('userInfo', JSON.stringify(res.body.data))
                                this.setState({isLoading: false}, () => {
                                    this.goToAddAddressScreen()
                                })
                            })
                        }else{
                            let str = ""
                            if(res.body.data.email){
                                str += "Email " + res.body.data.email[0] + (res.body.data.email[0].substr(res.body.data.email[0].length  - 1, 1) != "." ? "." : "")
                            }
                            if(res.body.data.password){
                                if(str != "")
                                    str += "\nPassword " + res.body.data.password[0] + (res.body.data.password[0].substr(res.body.data.password[0].length  - 1, 1) != "." ? "." : "")
                                else
                                    str += "Password " + res.body.data.password[0] + (res.body.data.password[0].substr(res.body.data.password[0].length  - 1, 1) != "." ? "." : "")
                            }
                            if(res.body.data.first_name){
                                if(str != "")
                                    str += "\nFirst Name " + res.body.data.first_name[0] + (res.body.data.first_name[0].substr(res.body.data.first_name[0].length  - 1, 1) != "." ? "." : "")
                                else
                                    str += "First Name " + res.body.data.first_name[0] + (res.body.data.first_name[0].substr(res.body.data.first_name[0].length  - 1, 1) != "." ? "." : "")
                            }
                            if(res.body.data.last_name){
                                if(str != "")
                                    str += "\nLast Name " + res.body.data.last_name[0] + (res.body.data.last_name[0].substr(res.body.data.last_name[0].length  - 1, 1) != "." ? "." : "")
                                else
                                    str += "Last Name " + res.body.data.last_name[0] + (res.body.data.last_name[0].substr(res.body.data.last_name[0].length  - 1, 1) != "." ? "." : "")
                            }                            
                            this.setState({isLoading: false}, () =>{
                                this.showDialogBox(str)
                            })
                        }                    
                    }
                })
        })
        
    }

    goToAddAddressScreen(){        
        this.props.navigator.push({
            title:'Add Your Address',
            screen:"mechaniku.AddAddressScreen",                                          
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
            <KeyboardAwareScrollView ref="scroll">
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{marginTop:24 * Metrics.scaleHeight, marginLeft:10, alignItems:'flex-start', justifyContent:'flex-start', width:'100%'}}>
                            <Image style={{width:120 * Metrics.scaleHeight, height:120 * Metrics.scaleHeight}} source={Images.avatarMechanicsIcon} />
                            <Text style={{fontSize:36, color:'rgba(2, 6, 33, 0.6)', paddingTop:12 * Metrics.scaleHeight, fontWeight:'bold'}}>Create Mechanic Account</Text>
                        </View>
                        <View style={{paddingTop:22 * Metrics.scaleHeight, borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5, width:Metrics.screenWidth}} />
                        
                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>First Name</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'First Name'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({firstName: text})
                                }}
                                value={this.state.firstName}
                                /> 
                            {
                                this.state.firstName == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                      
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'Last Name'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({lastname: text})
                                }}
                                value={this.state.lastname}
                                /> 
                            {
                                this.state.lastname == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }    
                                                    
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Company</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'Company'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({company: text})
                                }}
                                value={this.state.company}
                                />                  
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Email</Text>
                            <TextInput 
                                style={styles.input}
                                keyboardType={'email-address'}
                                placeholder={'Email'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                autoCapitalize='none'
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
                            

                        <Button 
                            style={styles.loginButton}
                            isLoading={this.state.isLoading}
                            activityIndicatorColor="#ffffff"
                            isDisabled={this.checkDisableBtnStatus()}
                            onPress={() => {
                                this.setState({isLoading: true}, () => {
                                    this.checkSignup()
                                })
                                
                            }}
                            >
                            <Text style={{fontSize:16, color:'#ffffff'}}>Sign Up</Text>
                        </Button>

                        <TouchableOpacity style={{marginTop:6 * Metrics.scaleHeight}} onPress={() => {                            
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
                        }}>
                            <Text style={{color:'rgb(83, 170, 243)', fontSize:17}}>Already have an account?</Text>
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
        marginTop:49 * Metrics.scaleHeight,
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