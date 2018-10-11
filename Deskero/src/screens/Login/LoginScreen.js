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
    Image,
    TextInput,
    Platform,
    KeyboardAvoidingView
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome'
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import DialogBox from 'react-native-dialogbox'
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';

import { Metrics, Images, Locale } from '../../themes'
import { Client, localStorage } from '../../services'
import { startMainTab } from '../../app'
import { GlobalVals  } from '../../global'


export default class LoginScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            // domain: "example.deskero.com",
            // email: "fausto@deskero.com",
            // password: "fausto2",
            // domain: "langetech.deskero.com",
            // email: "antonio.langerano@gmail.com",
            // password: "antmat16",
            // domain: "example.deskero.com",
            // email: "fausto.iannuzzi@gmail.com",
            // password: "chat",            
            // domain: "nemo.deskero.com",
            // email: "newnemobooks@gmail.com",
            // password: "mallon2",
            // domain: "ganfer.deskero.com",
            // email: "soporte@ganfer.com",
            // password: "LeoMarPena#0118",
            // domain: "pfnb.deskero.com",
            // email: "shaunc@plusfitness.com.au",
            // password: "plus247",
            // domain: "cadtec.deskero.com",
            // email: "sstanojevic@cadtec.it",
            // password: "#Sl4dj4n123#",
            // domain:'mymasoporte.deskero.com',
            // email:'victor@becorp.com.mx',
            // password:'123456', 
            domain:'.deskero.com',
            email:'',
            password:'',            
            isLoading:false,
            loading:false,
            emptyDomain: false,
            emptyEmail: false,
            emptyPassword: false,
            focus: false
        }
    }

    componentDidMount(){   
          
    }     

    goToForgetPasswordScreen(){
        this.props.navigator.push({
            screen: 'deskero.ForgetPasswordScreen',
            navigatorStyle: {
                drawUnderNavBar: false,
                navBarHidden: true,
            }
        })
    }

    goToTabScreen(){
        // this.props.navigator.dismissAllModals({ animationType: "slide-down" });
        // this.props.navigator.switchToTab({ tabIndex: 0 });
        startMainTab(0)
    }

    getSelectionObj(){
        // {start: 0, end: 0}
        // if()
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

    loginCheck(){        
        localStorage.get('deviceToken').then((deviceToken) => {
            Client.login(this.state.domain, this.state.email, this.state.password, deviceToken)
            .then(res => {
                if(res.status == 204){
                    this.setState({isLoading:false}, ()=>{
                        this.showDialogBox(Locale.t('LOGIN.FAILED'))
                    })
                }else{
                    let result = res.body;                       
                    GlobalVals.forceDataRefresh = true;
                    GlobalVals.dataKeyId = result.clientId + '-' + result.id;
                    localStorage.set('loginStatus', true);
                    localStorage.set('domain', this.state.domain);
                    localStorage.set('httpDomain', "https://" + this.state.domain + "/")
                    localStorage.set('clientId', result.clientId);
                    localStorage.set('userId', result.id);
                    localStorage.set('chatUserId', result.chatUserId);
                    localStorage.set('userName', result.name);
                    localStorage.set('userRole', result.role);
                    localStorage.set('profilePhoto', result.profilePhoto);
                    localStorage.set('permissions', JSON.stringify(result.permissions));                        
                    GlobalVals.propertis.domain = "https://" + this.state.domain + "/";
                    GlobalVals.propertis.clientId = result.clientId;
                    GlobalVals.permissions = result.permissions;    
                    this.authCheck(result)
                }            
            })
            .catch(err => {
                this.setState({isLoading:false}, ()=>{
                    this.showDialogBox(Locale.t('LOGIN.CONNECTION_ERROR'))
                }) 
            })
        })
       
       
    }

    authCheck(data){
        Client.auth(data)
            .end((err, res) => {
                if(err){
                    this.setState({isLoading:false}, () => {
                        this.showDialogBox(Locale.t('CONNECTION_ERROR'))
                    })
                }else{
                    if(res.status == 204){
                        
                    }else{
                        let result = res.body;
                        localStorage.set('bearer', result.access_token);      
                        GlobalVals.chatRetry = 0;
                        GlobalVals.user.authenticated = true;
                        localStorage.get('badges').then((badges) => {
                            if(badges) GlobalVals.badges = JSON.parse(badges)
                        })
                        localStorage.get('chatBadges').then((chatBadges) => {
                            if(chatBadges) GlobalVals.chatBadges = JSON.parse(chatBadges)
                        })
                        localStorage.get('clientId').then((clientId) => {
                            localStorage.get('userId').then((userId) => {
                                Client.chatAuth(clientId, userId)
                                    .end((err, res) => {
                                        if(err){
                
                                        }else{
                                            if(res.body.authorized){
                                                GlobalVals.token = res.body.token
                                                Client.connect()
                                            }
                                        }
                                    this.prepareUserCheck()
                                })    
                            })
                        })
                        
                    }
                }
            })        
    }

    prepareUserCheck(){   
        localStorage.get('userName').then((userName) => {
            GlobalVals.user.name = userName;
            localStorage.get('userId').then((userId) => {
                GlobalVals.user.id = userId;
                localStorage.get('chatUserId').then((chatUserId) => {
                    GlobalVals.user.chatUserId = chatUserId;
                    localStorage.get('userRole').then((userRole) => {
                        GlobalVals.user.role = userRole;
                        localStorage.get('profilePhoto').then((profilePhoto) => {
                            if(profilePhoto == 'true'){
                                localStorage.get('httpDomain').then((httpDomain) => {
                                    GlobalVals.user.profilePhoto = httpDomain + "profilePhoto/" + GlobalVals.user.role.toLowerCase() + "/" + GlobalVals.user.id;
                                })
                            }else{
                                GlobalVals.user.profilePhoto = false;
                            }
                            var callUrl;
                            if(GlobalVals.user.role == "CUSTOMER"){
                                
                                callUrl = GlobalVals.propertis.apiBaseUrl + 'customer/' + GlobalVals.user.id;
                            }else{
                                callUrl = GlobalVals.propertis.apiBaseUrl + 'agent/' + GlobalVals.user.id;
                            }
                            localStorage.get('bearer').then((bearer) => {
                                localStorage.get('clientId').then((clientId) => {
                                    localStorage.get('deviceToken').then((deviceToken) => {
                                        Client.prepareUser(callUrl, bearer, clientId)
                                            .end((err, res) => {
                                                if(err){
                                                    this.setState({isLoading:false}, () => {
                                                        this.showDialogBox('There\'s a connection problem!\nTry later.')
                                                    })
                                                }else{
                                                    if(res.status == 204){
                                                        this.setState({isLoading: false})
                                                    }else{
                                                        GlobalVals.userDetails = res.body;   
                                                        this.setState({isLoading:false}, ()=>{
                                                            this.goToTabScreen();
                                                        })
                                                    }
                                                }
                                        })  
                                    })
                                                                          
                                })
                            })
                        })
                    })
                })
            })
        })
            
    }

    showDialogBox(msg){
        this.dialogbox.tip({
            title: Locale.t('ALERT_TITLE.WHOOPS'),
            content: msg,
            btn: {
                text: Locale.t('TICKET_NEW.CONFIRM_OK')
            }
        })
    }

    render() {

        
        return (
            <KeyboardAwareScrollView
                style={{ backgroundColor: 'white' }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
                >

                <View style={{paddingTop:89 * Metrics.scaleHeight}} />

                <Image style={{width:137 * Metrics.scaleHeight * 1.1, height:137 * Metrics.scaleHeight}} source={Images.logoIcon} />

                <View style={{paddingTop:86 * Metrics.scaleHeight}} />

                <Text style={{fontFamily:'Helvetica Neue', fontSize:19, color:'rgb(156, 155, 155)'}} >{Locale.t('LOGIN.SIGN_IN_TO')}</Text>

                <View style={{paddingTop:20.5 * Metrics.scaleHeight}}/>

                <View style={[styles.textInputView, {borderTopColor:'rgb(197, 197, 197)', borderTopWidth:1}]} >
                    <View style={styles.labelView}>
                        <Text style={styles.label}>{Locale.t('LOGIN.DOMAIN')}</Text>
                        <Text style={[styles.label, {color:'red'}]}>*</Text>
                    </View>   
                    { 
                        (this.state.focus && this.state.domain == '.deskero.com') ?      
                        <TextInput 
                            style={styles.input}
                            placeholder={Locale.t('LOGIN.DOMAIN_PLACEHOLDER')}
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
                            placeholder={Locale.t('LOGIN.DOMAIN_PLACEHOLDER')}
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
                        <Text style={styles.label}>{Locale.t('LOGIN.EMAIL')}</Text>
                        <Text style={[styles.label, {color:'red'}]}>*</Text>
                    </View>                        
                    <TextInput 
                        style={[styles.input, this.state.email == '' ? {width:'64.6%'} : {width:'56.4%'}]}
                        keyboardType={'email-address'}
                        placeholder={Locale.t('LOGIN.EMAIL_PLACEHOLDER')}
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
                        this.state.email != "" && this.checkEmailValidation(this.state.email) == false &&
                            <View style={styles.validation}>
                                <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                            </View>                           
                    }                        
                </View>

                <View style={styles.textInputView} >
                    <View style={styles.labelView}>
                        <Text style={styles.label}>{Locale.t('LOGIN.PASSWORD')}</Text>
                        <Text style={[styles.label, {color:'red'}]}>*</Text>
                    </View>                        
                    <TextInput 
                        style={styles.input}
                        placeholder={Locale.t('LOGIN.PASSWORD')}
                        secureTextEntry={true}
                        placeholderTextColor="rgb(156, 155, 155)"
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => {
                            this.setState({password: text})
                        }}
                        value={this.state.password}
                    /> 
                    {
                        this.state.emptyPassword &&
                        <View style={styles.emptyField}>
                            <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                        </View>
                    }  
                </View>                  

                <View style={{paddingTop:36 * Metrics.scaleHeight}}/>    

                <Button 
                    style={styles.loginBtn}                        
                    activityIndicatorColor = 'white'
                    isLoading={this.state.isLoading}
                    onPress={()=>{
                        if(this.checkEmptyFieldCheck()){
                            let emptyDomain = false
                            let emptyEmail = false
                            let emptyPassword = false
                            if(this.state.domain == '') emptyDomain = true
                            if(this.state.email == '') emptyEmail = true
                            if(this.state.password == '') emptyPassword = true
                            this.setState({
                                emptyDomain,
                                emptyEmail,
                                emptyPassword
                            }, () => {
                                setTimeout(() => {
                                    this.setState({
                                        emptyDomain: false,
                                        emptyEmail: false,
                                        emptyPassword: false
                                    })
                                }, 2000)
                            })
                        }else{
                            if(this.checkEmailValidation(this.state.email)){
                                this.setState({isLoading: true}, () => {
                                    this.loginCheck()
                                })
                                
                            }
                        }                       
                    }}
                    >
                    <Text style={styles.loginBtnText}>{Locale.t('LOGIN.LOGIN_BUTTON')}</Text>
                    
                </Button>         
                
                <View style={{paddingTop:18 * Metrics.scaleHeight}}/>

                <TouchableOpacity onPress={()=>{
                    this.goToForgetPasswordScreen();
                    }}>
                    <Text style={styles.forgetPasswordText}>{Locale.t('LOGIN.FORGOT_PASSWORD_BUTTON')}</Text>
                </TouchableOpacity>  
                
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>   
                    
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
        color:'#fff',
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
});