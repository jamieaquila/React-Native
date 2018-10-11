'use strict'
import React, { Component} from 'react'


import {
    Text,
    View,
    ListView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    TextInput,
    Image
  } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Image from 'react-native-image-progress'
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import DialogBox from 'react-native-dialogbox'
import Icon from 'react-native-vector-icons/FontAwesome'


import { Metrics, Images, Locale } from '../../themes'
import { Client, localStorage } from '../../services'


export default class ForgetPasswordScreen extends Component {
      constructor(props){
          super(props)
          this.state = {
            isLoading:false,
            domain:'.deskero.com',
            email:'',
            emptyDomain: false,
            emptyEmail: false,
            focus: false
          }
      }

    goToLogin(){
        this.props.navigator.pop();
    }

    onConfirm(){
        Client.forgetPassword(this.state.domain, this.state.email)
            .end((err, res) => {
                if(err){
                    this.setState({isLoading:false}, ()=>{
                        this.showDialogBox(Locale.t('ALERT_TITLE.WHOOPS'), Locale.t('FORGOT_PASSWORD.CONNECTION_ERROR'))
                    })
                }else{
                    if(res.status == 204){
                        this.setState({isLoading:false}, ()=>{
                            this.showDialogBox(Locale.t('ALERT_TITLE.WHOOPS'), Locale.t('FORGOT_PASSWORD.FAILED'))
                        })                        
                    }else{
                        this.setState({isLoading:false}, ()=>{
                            this.showDialogBox(Locale.t('ALERT_TITLE.GREAT'), Locale.t('FORGOT_PASSWORD.EMAIL_SENT'))
                        })
                    }
                }
            })        
    }

    checkEmailValidation(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    checkEmptyFieldCheck(){        
        if(this.state.domain == '' || this.state.email == '' || this.state.password == '')
            return true
        else 
            return false
    }

    showDialogBox(title, msg){
        this.dialogbox.tip({
          title: title,
          content: msg,
          btn: {
              text: 'OK'                
          }
        })
    }

    render() {
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View style={styles.container}>
                    
                    <View style={{paddingTop:89 * Metrics.scaleHeight}} />
                    <Image style={{width:137 * Metrics.scaleHeight * 1.1, height:137 * Metrics.scaleHeight}} source={Images.logoIcon} />
                    <View style={{paddingTop:86 * Metrics.scaleHeight}} />
                    <Text style={{fontFamily:'Helvetica Neue',fontSize:19, color:'rgb(156, 155, 155)'}} >{Locale.t('FORGOT_PASSWORD.TITLE')}</Text>
                    <View style={{paddingTop:20.5 * Metrics.scaleHeight}}/>
                    
                    <View style={[styles.textInputView, {borderTopColor:'rgb(197, 197, 197)', borderTopWidth:1}]} >
                        <View style={styles.labelView}>
                            <Text style={styles.label}>{Locale.t('FORGOT_PASSWORD.DOMAIN')}</Text>
                            <Text style={[styles.label, {color:'red'}]}>*</Text>
                        </View>                        
                        
                        { 
                            (this.state.focus && this.state.domain == '.deskero.com') ?      
                            <TextInput 
                                style={styles.input}
                                placeholder={Locale.t('FORGOT_PASSWORD.DOMAIN_PLACEHOLDER')}
                                placeholderTextColor="rgb(156, 155, 155)"
                                keyboardType={'default'}
                                underlineColorAndroid="transparent"
                                autoCapitalize = 'none'
                                keyboardShouldPersistTaps={true}                                
                                selection={{start: 0, end: 0}}
                                onChangeText={(text) => {
                                    this.setState({
                                        domain:text,
                                        focus: false
                                    })
                                }}
                                onFocus={() => { 
                                    this.setState({focus: true})
                                }}
                                value={this.state.domain}
                            />          
                            :  
                            <TextInput 
                                style={styles.input}
                                placeholder={Locale.t('FORGOT_PASSWORD.DOMAIN_PLACEHOLDER')}
                                placeholderTextColor="rgb(156, 155, 155)"
                                keyboardType={'default'}
                                underlineColorAndroid="transparent"
                                autoCapitalize = 'none'
                                keyboardShouldPersistTaps={true}                                
                                onChangeText={(text) => {
                                    this.setState({domain:text})
                                }}
                                onFocus={() => { 
                                    this.setState({focus: true})
                                }}
                                value={this.state.domain}
                            />                         
                        }     
                        {
                            this.state.emptyDomain &&
                            <View style={styles.emptyField}>
                                <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                            </View>
                        }  
                    </View>

                    <View style={styles.textInputView} >
                        <View style={styles.labelView}>
                            <Text style={styles.label}>{Locale.t('FORGOT_PASSWORD.EMAIL')}</Text>
                            <Text style={[styles.label, {color:'red'}]}>*</Text>
                        </View>                        
                        <TextInput 
                            style={[styles.input, this.state.email == '' ? {width:'64.6%'} : {width:'56.4%'}]}
                            keyboardType={'email-address'}
                            placeholder={Locale.t('FORGOT_PASSWORD.EMAIL_PLACEHOLDER')}
                            placeholderTextColor="rgb(156, 155, 155)"
                            underlineColorAndroid="transparent"
                            autoCapitalize = 'none'
                            onChangeText={(text) => {
                                this.setState({email: text})
                            }}
                            value={this.state.email}
                        /> 
                        {
                            this.state.emptyEmail &&
                            <View style={styles.emptyField}>
                                <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                            </View>
                        }  
                        {
                            this.state.email != "" && this.checkEmailValidation(this.state.email) == false ?
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>
                            :   <View style={styles.validation}>
                                </View>
                        }
                    </View>

                    <View style={{paddingTop:84 * Metrics.scaleHeight}}/>                    
                    <Button 
                        style={styles.loginBtn}
                        textStyle={{color: 'white'}}
                        isLoading={this.state.isLoading}
                        activityIndicatorColor = 'white'
                        onPress={()=>{
                            if(this.checkEmptyFieldCheck()){
                                let emptyDomain = false
                                let emptyEmail = false
                                if(this.state.domain == '') emptyDomain = true
                                if(this.state.email == '') emptyEmail = true
                                this.setState({
                                    emptyDomain,
                                    emptyEmail,
                                }, () => {
                                    setTimeout(() => {
                                        this.setState({
                                            emptyDomain: false,
                                            emptyEmail: false,
                                        })
                                    }, 2000)
                                })
                            }else{
                                if(this.checkEmailValidation(this.state.email)){
                                    this.onConfirm();
                                }
                            }                                    
                        }}
                        >
                        <Text style={styles.loginBtnText}>{Locale.t('FORGOT_PASSWORD.BUTTON')}</Text>
                    </Button>
                    <View style={{paddingTop:18 * Metrics.scaleHeight}}/>
                    <TouchableOpacity onPress={()=>{
                        this.goToLogin();
                        }}>
                        <Text style={styles.forgetPasswordText}>{Locale.t('FORGOT_PASSWORD.GO_TO_LOGIN')}</Text>
                    </TouchableOpacity>
                
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    loginBtn:{
        marginHorizontal:42,
        height: 44 * Metrics.scaleHeight,
        backgroundColor:'rgb(112, 180, 44)',
        alignItems: 'center',
        justifyContent: 'center',    
        borderRadius:0,
        borderWidth:0,    
        borderBottomColor:'rgb(75, 121, 28)',
        borderBottomWidth:3 * Metrics.scaleHeight
    },
    loginBtnText:{
        fontFamily:'Helvetica Neue',
        color:'white',
        fontSize:17
    },
    forgetPasswordText:{
        fontFamily:'Helvetica Neue',
        textAlign:'center',
        fontSize:13,
        color:'rgb(79, 136, 213)',
    },
    textInputView: {
        width:'100%',
        flexDirection:'row', 
        height:48 * Metrics.scaleHeight,
        borderBottomColor:'rgb(197, 197, 197)', 
        borderBottomWidth:1,
        alignItems:'center',
    },
    labelView:{
        width:'35.6%',
        flexDirection:'row',
        paddingLeft:21.5 * Metrics.scaleWidth,
        alignItems:'center',
        backgroundColor:'#ffffff',
        height:'99%'
    },
    label:{        
        fontFamily:'Helvetica Neue',
        color:'rgb(77, 77, 77)',
        fontSize:16,
    },
    input:{
        width:'64.4%',
        fontFamily:'Helvetica Neue',
        fontSize:16,
        color:'rgb(77, 77, 77)',
        backgroundColor:'#ffffff',
        height:'99%'
    },
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
        backgroundColor:'#ffffff'
    },
    emptyField:{
        position:'absolute',
        top:5.5 * Metrics.scaleHeight,
        right:3,
    }
})