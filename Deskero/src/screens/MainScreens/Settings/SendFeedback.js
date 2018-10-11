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
    Alert,
    TextInput,
    Image  
} from 'react-native'
// import Image from 'react-native-image-progress'
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import DialogBox from 'react-native-dialogbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Metrics, Images, Locale } from '../../../themes'
import { Client, localStorage } from '../../../services'
import { GlobalVals } from '../../../global'
import { startUserLogin } from '../../../app'


export default class SendFeedbakScreen extends Component {
    
  constructor(props){
    super(props)
    this.state = {
      subject: Locale.t('FEEDBACK.SUBJECT_DEFAULT'),
      text:'',
      emptySubject: false,
      emptyText: false
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'close') {
      this.showDialogBox()
    }else if(event.id === 'save') {
      this.checkSave()    
    }
  }
  
  checkSave(){
    let emptySubject = false;
    let emptyText = false
    if(this.state.subject == '') emptySubject = true
    if(this.state.text == '') emptyText = true
    if(!emptySubject && !emptyText){
      localStorage.get('bearer').then((bearer) => {
        localStorage.get('clientId').then((clientId) => {
          localStorage.get('userId').then((userId) => {
            localStorage.get('userRole').then((userRole) => {
              let feedback = {
                subject: this.state.subject,
                text: this.state.text
              }

              Client.sendFeedback(bearer, clientId, userId, userRole, feedback)
                .then((res) => {
                    if(res && res.msg == 'OK'){
                      this.props.navigator.dismissModal({
                        animationType: 'slide-down'
                      })
                    }
                })  
                .catch((err) => {
                    // console.log(err)
                })  
            })
          })
        })
      })
    }else{
      this.setState({
        emptySubject,
        emptyText
      }, () => {
        setTimeout(() => {
          this.setState({
            emptySubject: false,
            emptyText: false
          })
        }, 2000)
        
      })
    }
  }

  showDialogBox(){    
    Alert.alert(
      Locale.t('CONFIRM_DISCARD_TITLE'),
      Locale.t('CONFIRM_DISCARD_TEXT'),
      [
        {text: Locale.t('CONFIRM_DISCARD_NO'), onPress: () => {

         }},
        {text: Locale.t('CONFIRM_DISCARD_YES'), onPress: () => {          
          this.props.navigator.dismissModal({
            animationType: 'slide-down'
          })
        }},
      ],
      { cancelable: false }
    )
  }

  showErroDialogBox(msg){
    this.dialogbox.tip({
        title: Locale.t('ALERT_TITLE.WHOOPS'),
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
            <View style={styles.content}>
              {/* Subject */}
              <View style={styles.dropdownView}>
                <View style={{flexDirection:'row', width:'40%', paddingLeft:20}}>
                  <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('FEEDBACK.SUBJECT')}</Text>
                  <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                </View> 
                <TextInput 
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => {
                    this.setState({subject: text})
                  }}
                  value={this.state.subject}
                />  
                {
                  this.state.emptySubject &&
                  <View style={styles.emptyField}>
                      <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                  </View>
                } 
              </View>
              {/* Description */}                        
              <View style={[styles.dropdownView, {borderBottomWidth:0}]}>
                <View style={{flexDirection:'row', paddingLeft:20}}>
                  <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('FEEDBACK.TEXT')}</Text>
                  <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                </View> 
                {
                  this.state.emptyText &&
                  <View style={styles.emptyField}>
                      <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                  </View>
                } 
              </View>  
              <View style={{backgroundColor:'#ffffff', marginTop:13, marginHorizontal:12, marginBottom:20, borderColor:'rgba(0,0,0,0.2)', borderWidth:1}}>
                <TextInput 
                    multiline = {true}
                    underlineColorAndroid="transparent"
                    numberOfLines = {4}
                    style={{textAlignVertical: "top", height:120, width:'100%', fontFamily:'Helvetica Neue', fontSize: 16, color: 'rgb(77, 77, 77)',backgroundColor:'#ffffff'}}
                    onChangeText={(text) => {
                      this.setState({text: text})
                    }}
                    value={this.state.text}
                />  
              </View>
            </View>
          </View>
          <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>  
        </KeyboardAwareScrollView>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',   
  },    
  content:{
    width:Metrics.screenWidth - 13,
    height: Metrics.screenHeight,
    backgroundColor:'white',
    marginTop:11,
    marginBottom:11,   
  },
  dropdownView:{
    height:44 * Metrics.scaleHeight,
    width:'100%',
    flexDirection:'row', 
    alignItems: 'center',
    borderBottomColor:'rgb(228, 228, 228)',
    borderBottomWidth:1
  },  
  labelText:{
    fontFamily:'Helvetica Neue',
    paddingLeft:20,        
    fontSize:16, 
    color: 'rgb(77, 77, 77)'
  },
  input:{
    width:'55%',
    fontFamily:'Helvetica Neue',
    fontSize: 16,
    color: 'rgb(77, 77, 77)',
  },  
  emptyField:{
    position:'absolute',
    top:5.5 * Metrics.scaleHeight,
    right:3,
  }
})