'use strict'
import React, { Component} from 'react'
import { Navigation } from 'react-native-navigation'
import {
    Text,
    View,
    ListView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    Image,
    Platform
  } from 'react-native'
// import Image from 'react-native-image-progress'
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome'
import DialogBox from 'react-native-dialogbox'
import { isIphoneX } from 'react-native-iphone-x-helper'
import VersionNumber from 'react-native-version-number';

import { Metrics, Images, Locale } from '../../../themes'
import { Client, localStorage } from '../../../services'
import { GlobalVals } from '../../../global'
import { startUserLogin, startMainTab } from '../../../app'


export default class SettingScreen extends Component {
    
  constructor(props){
      super(props)
      this.state = {
        selectedState: '',
        selectedLang: GlobalVals.language,
        isLoading:false,
        states: [],
        languages: []
      }
  }

  componentDidMount(){    
    let selectedState = ''
    let states = [
      {
        id: 'online',
        text: Locale.t('CHAT.STATUS_ONLINE'),
      },
      {
          id: 'busy',
          text: Locale.t('CHAT.STATUS_BUSY'),
      },
      {
          id: 'invisible',
          text: Locale.t('CHAT.STATUS_INVISIBLE'),
      },
      {
          id: 'online for agents',
          text: Locale.t('CHAT.STATUS_ONLINE_FOR_AGENTS'),
      },
      {
          id: 'offline',
          text: Locale.t('CHAT.STATUS_OFFLINE'),
      }
    ]

    let languages = [
      {
        id:'en',
        lang: Locale.t('LANGUAGE.EN')
      },
      {
        id:'fr',
        lang: Locale.t('LANGUAGE.FR')
      },
      {
        id:'it',
        lang: Locale.t('LANGUAGE.IT')
      },
      {
        id:'sp',
        lang: Locale.t('LANGUAGE.SP')
      }
    ]

    localStorage.get('chatStartStatus').then((chatStartStatus) => {
      if(chatStartStatus){
        selectedState = chatStartStatus
        this.setState({selectedState: chatStartStatus})
      }else{
        selectedState = states[0].id
      }

      this.setState({
        selectedState,
        states,
        languages
      })
    })    
  }

  
  
  logoutcheck(){
    this.showDialogBox()
  }

  showDialogBox(){    
    Alert.alert(
      '',
      Locale.t('PROFILE.LOGOUT_CONFIRM_TEXT'),
      [
        {text: Locale.t('PROFILE.LOGOUT_CONFIRM_NO'), onPress: () => {

         }},
        {text: Locale.t('PROFILE.LOGOUT_CONFIRM_YES'), onPress: () => {
          this.setState({
            isLoading:true
          }, () => {
            this.clearLoginData()
          })
          
          }},
      ],
      { cancelable: false }
    )
  }

  clearLoginData(){
    localStorage.get('deviceToken').then((_deviceToken) => {      
      let deviceToken = _deviceToken;
      localStorage.get('bearer').then((_bearer) => {
        let bearer = _bearer;
        localStorage.get('clientId').then((_clientId) => {
          let clientId = _clientId;
          
          let email = GlobalVals.userDetails.email;
          Client.clearDeviceToken(email, deviceToken, bearer, clientId)
            .end((err, res) => {
              if(err){
                // alert(JSON.stringify(err))
              }else{
                // console.log(res.body)
                localStorage.clear();
                GlobalVals.ws = null
                GlobalVals.user.authenticated = false;
                GlobalVals.currentTicket = {};
                GlobalVals.badges = {};
                GlobalVals.chatRetry = 0;
                GlobalVals.chatBadges = {};
                GlobalVals.customersDetail = [];
                GlobalVals.ticketDetails = [];
                GlobalVals.user = {
                  authenticated: false,
                  name:null,
                  id:null,
                  profilePhoto:null,
                  role:null
                }                
                GlobalVals.userDetails = {};
                if(GlobalVals.chatSocket){
                  GlobalVals.chatSocket.disconnect(() => {
                    GlobalVals.chatSocket = null
                  })
                }else{
                  GlobalVals.chatSocket = null
                }

                if(GlobalVals.notificationSocket){
                  GlobalVals.notificationSocket = null
                }

                if(GlobalVals.badgeSocket){
                  GlobalVals.badgeSocket = null
                }

                if(GlobalVals.client){
                  GlobalVals.client.disconnect(() => {
                    GlobalVals.client = null
                  })
                }

                GlobalVals.platform = null
                GlobalVals.forceDataRefresh = false
                GlobalVals.dataKeyId = null
                GlobalVals.permissions = null
                GlobalVals.agentFound = false
                GlobalVals.customerFound = false
                GlobalVals.currentPage = null
                
                startUserLogin()
              }
          })
        })
      })
    })
  }    

  sendFeedback(){
    Navigation.showModal({
      screen: "deskero.SendFeedbakScreen", // unique ID registered with Navigation.registerScreen
      title: Locale.t('FEEDBACK.TITLE'), // title of the screen as appears in the nav bar (optional)
      passProps: {}, // simple serializable object that will pass as props to the modal (optional)
      navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {
        leftButtons: [
            {
                id:'close',
                icon: Images.closeIcon
            }
        ],       
        rightButtons: [                        
            {
                id: 'save',
                icon: Images.checkIcon
            },
        ]
      },
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }

  getStatusArr(){
    let arr = []
    for(var i = 0 ; i < this.state.states.length ; i++){
      arr.push(this.state.states[i].text)
    }
    return arr
  }

  getStateStr(){
    let text = ''
    for(var i = 0 ; i < this.state.states.length ; i++){
      if(this.state.selectedState == this.state.states[i].id){
        text = this.state.states[i].text
        break
      }
    }
    return text
  }

  updateSettings(value){    
    localStorage.set('chatStartStatus', value)          
    this.setState({selectedState: value})
  }

  getLangArr(){
    let arr = []
    for(var i = 0 ; i < this.state.languages.length ; i++){
      arr.push(this.state.languages[i].lang)
    }
    return arr
  }

  getLangStr(){
    let text = ''
    for(var i = 0 ; i < this.state.languages.length ; i++){
      if(this.state.selectedLang == this.state.languages[i].id){
        text = this.state.languages[i].lang
        break
      }
    }
    return text
  }

  changLang(value){
    localStorage.set('lang', value)
    GlobalVals.language = value
    setTimeout(() => {
      startMainTab(0)
    }, 700)
  }

  clearCashe(){
    
  }

  render() {
      return (
            <View style={styles.container}>                    
                <View style={styles.header}>
                  <View style={{width:'15%'}} />
                  <Text style={styles.titleText}>{Locale.t('SETTINGS.TITLE')}</Text>
                  <TouchableOpacity
                    style={{width:'15%'}}
                    onPress={()=>{
                      this.props.navigator.toggleDrawer({
                          to: 'closed',
                          side: 'left',
                          animated: true
                      });  
                    }}
                    >
                    <Image style={{width:24, height:24}} source={Images.closeIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.content}>
                  <View style={{paddingTop:27 * Metrics.scaleHeight}} />
                  <View style={{flexDirection:'row', borderBottomColor:"rgb(228, 228, 228)", borderBottomWidth:1, paddingBottom:26 * Metrics.scaleHeight}}>
                    <Text style={{fontFamily:'Helvetica Neue',fontSize:15, color:"rgb(156, 155, 155)"}}>{Locale.t('SETTINGS.CHAT_START_STATUS')}</Text>
                    <ModalDropdown
                      defaultIndex={0}
                      options={this.getStatusArr()}
                      style={styles.filterButtonContainerStyle}
                      dropdownTextStyle={styles.filterButton}
                      textStyle={styles.filterButton}
                      onSelect={(idx, value) => {
                        this.updateSettings(this.state.states[idx].id)                        
                      }}
                      >
                      <View style={styles.filterButtonContent}>
                      <Text style={styles.buttonText}>{this.getStateStr()}</Text>
                        <Icon
                          style={styles.filterDropdownIcon}
                          name="angle-down" size={18}
                        />
                      </View>
                    </ModalDropdown>
                  </View>
                      
                  <View style={{paddingTop:27 * Metrics.scaleHeight}} />
                  <View style={{flexDirection:'row', borderBottomColor:"rgb(228, 228, 228)", borderBottomWidth:1, paddingBottom:26 * Metrics.scaleHeight}}>
                    <Text style={{fontFamily:'Helvetica Neue',fontSize:15, color:"rgb(156, 155, 155)"}}>{Locale.t('LANGUAGE.TITLE')}</Text>
                    <ModalDropdown
                      defaultIndex={0}
                      options={this.getLangArr()}
                      style={styles.filterButtonContainerStyle}
                      dropdownTextStyle={styles.filterButton}
                      textStyle={styles.filterButton}
                      onSelect={(idx, value) => {
                        this.changLang(this.state.languages[idx].id)                        
                      }}
                      >
                      <View style={styles.filterButtonContent}>
                      <Text style={styles.buttonText}>{this.getLangStr()}</Text>
                        <Icon
                          style={styles.filterDropdownIcon}
                          name="angle-down" size={18}
                        />
                      </View>
                    </ModalDropdown>
                  </View>

                  <View style={{paddingTop:19 * Metrics.scaleHeight}} />
                  <TouchableOpacity style={styles.roundButton} onPress={()=>{
                      this.sendFeedback()
                    }}>
                    <Text style={styles.roundButtonText}>{Locale.t('SETTINGS.SEND_FEEDBACK')}</Text>
                    <Image style={{width:15, height:15}} source={Images.sendFeedbackIcon} />
                  </TouchableOpacity>
                  <View style={{paddingTop:19 * Metrics.scaleHeight}} />
                  <TouchableOpacity style={styles.roundButton} onPress={()=>{
                    
                    }}>
                    <Text style={styles.roundButtonText}>{Locale.t('SETTINGS.CLEAR_CACHE')}</Text>
                    <Image style={{width:13, height:15}} source={Images.clearCacheIcon} />
                  </TouchableOpacity>
                  <View style={{paddingTop:19 * Metrics.scaleHeight}} />
                  <Button 
                      style={styles.logoutBtn}
                      textStyle={{color: 'white'}}
                      isLoading={this.state.isLoading}
                      activityIndicatorColor = 'white'
                      onPress={()=>{                         
                        this.logoutcheck();                         
                      }}
                    >
                      <Text style={styles.logoutBtnText}>{Locale.t('SETTINGS.LOGOUT')}</Text>
                  </Button>
                  <View style={{paddingTop:18 * Metrics.scaleHeight}} />
                  <Text style={{fontFamily:'Helvetica Neue',fontSize:15, color:"rgb(156, 155, 155)", textAlign:"center"}}>{Locale.t('SETTINGS.APP_VERSION')}: {VersionNumber.appVersion}</Text>
                  <View style={{paddingTop:19 * Metrics.scaleHeight}} />
                  <Text style={{fontFamily:'Helvetica Neue',fontSize:12, color:"rgb(85, 85, 85)", textAlign:"left", width:'100%'}}>
                  {
                    Locale.t('SETTINGS.DISCLAIMER_TEXT')
                  }                    
                  </Text>
                </View>
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>   
            </View>
      )
  }
}

const styles = StyleSheet.create({
    container: {
      flex:1,      
      backgroundColor: 'white',
    },
    header:{
      paddingTop: Platform.OS == 'ios' ? (isIphoneX() ? 54 : 32) : 16, 
      flexDirection: 'row', 
      width:'100%',
      height: Platform.OS == 'ios' ? (isIphoneX() ? 88 : 64) : 57,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:rgb(223, 61, 0),      
    },
    titleText:{      
      width:'70%',
      fontFamily:'Helvetica Neue',
      fontWeight:"400",
      color:"#ffffff", 
      fontSize:20, 
      textAlign:'center'
    },
    content:{
      // marginTop:60,
      paddingHorizontal:18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterButtonContainerStyle: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      paddingHorizontal: 8,
      borderRadius: 3,
      borderColor: 'rgb(128, 128, 128)'
    },  
    filterButtonContent: {
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    
    filterButton: {
      flex: 1,
      fontFamily:'Helvetica Neue',
      fontSize: 16,
      color: 'rgb(128, 128, 128)',
    },
  
    filterDropdownIcon: {
      marginLeft: 5,
      color: 'rgb(79, 136, 213)'
    },
    buttonText: {
      fontFamily:'Helvetica Neue',
      fontSize: 14,
      fontWeight: '300',
      color: 'rgb(128, 128, 128)'
    },
    roundButton:{
      flexDirection:'row', 
      width:'100%', 
      height:43 * Metrics.scaleHeight, 
      alignItems:'center',
      justifyContent:'center',
      borderColor:'rgb(177, 176, 176)',
      borderWidth:1,
      borderRadius:5,      
    },
    roundButtonText:{
      fontFamily:'Helvetica Neue',
      // width:'70%',
      textAlign:'right',
      fontSize:16, 
      color:"rgb(128, 128, 128)", 
      paddingRight:10
    },
    logoutBtn:{      
      height: 44 * Metrics.scaleHeight,
      backgroundColor:'rgb(112, 180, 44)',
      alignItems: 'center',
      justifyContent: 'center',    
      borderRadius:0,
      borderWidth:0,    
      borderBottomColor:'rgb(75, 121, 28)',
      borderBottomWidth:3 * Metrics.scaleHeight
  },
  logoutBtnText:{
    fontFamily:'Helvetica Neue',
      color:'white',
      fontSize:17
  },
})