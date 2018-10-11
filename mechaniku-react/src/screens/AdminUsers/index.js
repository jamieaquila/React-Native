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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Metrics, Images } from '../../themes'
import { stateNames } from '../../services'
import { Client, localStorage } from '../../services'
export default class AdminUsersScreen extends Component{   
    constructor(props){
        super(props)        
        this.state = {
            userType:0
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        localStorage.get('userInfo').then((userInfo) =>{
            let info = JSON.parse(userInfo)
            this.setState({userType: info.user_type})
        })
    }
    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    goToSettingScreen(){
        this.props.navigator.push({
            title:'Settings',            
            screen:"mechaniku.SettingScreen",            
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

    goToAllMechanicsScreen(){
        this.props.navigator.push({
            title:'All Mechanics',            
            screen:"mechaniku.AllMechanicsScreen",            
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

    goToAllAppointmentsScreen(){
        this.props.navigator.push({
            title:'All Appointments',            
            screen:"mechaniku.AllAppointmentsScreen",            
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

    goToMasterCalendarScreen(){
        this.props.navigator.push({
            title:'Master Calendar',            
            screen:"mechaniku.MasterCalendarScreen",            
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

    goToLoginScreen(){
        localStorage.remove('userLogin')
        localStorage.remove('userInfo')
        Navigation.startSingleScreenApp({
            screen:{
              screen: 'mechaniku.LoginScreen',
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

    render() {
        return (
            <View style={styles.container}> 
                <View style={styles.content}>
                    <View style={{paddingTop:75 * Metrics.scaleHeight}} />   

                    <TouchableOpacity style={{
                                    width:'100%',
                                    height: 93 * Metrics.scaleHeight,
                                    marginHorizontal:24 * Metrics.scaleWidth,
                                    flexDirection:'row', 
                                    alignItems:'center', 
                                    borderBottomColor:'rgba(31, 49, 74, 0.1)', 
                                    borderBottomWidth:1
                                }}
                            onPress={() => {
                                this.goToAllMechanicsScreen()
                            }}>
                        <View style={{width:'20%', alignItems:'flex-start'}}>
                            <Image style={{width:53 * Metrics.scaleHeight, height:53 * Metrics.scaleHeight}} source={Images.mechanikuIcon} />
                        </View>
                        <Text style={{width:'75%', paddingLeft:24 * Metrics.scaleWidth, fontSize:22, fontWeight:'bold', color:'rgba(31, 49, 74, 0.9)'}}>Mechanics</Text>
                        
                        <View style={{width:'5%', alignItems:'flex-end'}}>
                            <Ionicons style={{color:'rgb(209, 209, 214)'}} name='ios-arrow-forward-outline' size={30}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                                    width:'100%',
                                    height: 93 * Metrics.scaleHeight,
                                    marginHorizontal:24 * Metrics.scaleWidth,
                                    flexDirection:'row', 
                                    alignItems:'center', 
                                    borderBottomColor:'rgba(31, 49, 74, 0.1)', 
                                    borderBottomWidth:1
                                }}
                            onPress={() => {
                                this.goToAllAppointmentsScreen()
                            }}>
                        <View style={{width:'20%', alignItems:'flex-start'}}>
                            <Image style={{width:53 * Metrics.scaleHeight, height:53 * Metrics.scaleHeight}} source={Images.timeIcon} />
                        </View>
                        <Text style={{width:'75%', paddingLeft:24 * Metrics.scaleWidth, fontSize:22, fontWeight:'bold', color:'rgba(31, 49, 74, 0.9)'}}>Appointments</Text>
                        
                        <View style={{width:'5%', alignItems:'flex-end'}}>
                            <Ionicons style={{color:'rgb(209, 209, 214)'}} name='ios-arrow-forward-outline' size={30}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                                    width:'100%',
                                    height: 93 * Metrics.scaleHeight,
                                    marginHorizontal:24 * Metrics.scaleWidth,
                                    flexDirection:'row', 
                                    alignItems:'center', 
                                    borderBottomColor:'rgba(31, 49, 74, 0.1)', 
                                    borderBottomWidth:1
                                }}
                            onPress={() => {
                                this.goToMasterCalendarScreen()
                            }}>
                        <View style={{width:'20%', alignItems:'flex-start'}}>
                            <Image style={{width:53 * Metrics.scaleHeight, height:53 * Metrics.scaleHeight}} source={Images.weeklyCalendarIcon} />
                        </View>
                        <Text style={{width:'75%', paddingLeft:24 * Metrics.scaleWidth, fontSize:22, fontWeight:'bold', color:'rgba(31, 49, 74, 0.9)'}}>Calendar</Text>
                        
                        <View style={{width:'5%', alignItems:'flex-end'}}>
                            <Ionicons style={{color:'rgb(209, 209, 214)'}} name='ios-arrow-forward-outline' size={30}/>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={{
                            width:'100%',
                            height: 93 * Metrics.scaleHeight,
                            marginHorizontal:24 * Metrics.scaleWidth,
                            flexDirection:'row', 
                            alignItems:'center', 
                            borderBottomColor:'rgba(31, 49, 74, 0.1)', 
                            borderBottomWidth:1
                        }}
                        onPress={() => {
                            this.goToSettingScreen()
                        }}>
                        <View style={{width:'20%', alignItems:'flex-start'}}>
                            <Image style={{width:53 * Metrics.scaleHeight, height:53 * Metrics.scaleHeight}} source={Images.calendarCrossIcon} />
                        </View>
                        <Text style={{width:'75%', paddingLeft:24 * Metrics.scaleWidth, fontSize:22, fontWeight:'bold', color:'rgba(31, 49, 74, 0.9)'}}>Settings</Text>

                        <View style={{width:'5%', alignItems:'flex-end'}}>
                            <Ionicons style={{color:'rgb(209, 209, 214)'}} name='ios-arrow-forward-outline' size={30}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                                                    width:'100%',
                                                    height: 93 * Metrics.scaleHeight,
                                                    marginHorizontal:24 * Metrics.scaleWidth,
                                                    flexDirection:'row', 
                                                    alignItems:'center', 
                                                    borderBottomColor:'rgba(31, 49, 74, 0.1)', 
                                                    borderBottomWidth:1
                                                }}
                            onPress={() => {
                                this.goToLoginScreen()
                            }}>
                        <View style={{width:'20%', alignItems:'flex-start'}}>
                            
                        </View>
                        <Text style={{width:'75%', paddingLeft:24 * Metrics.scaleWidth, fontSize:22, fontWeight:'bold', color:'rgba(31, 49, 74, 0.9)'}}>Log Out</Text>                        
                        <View style={{width:'5%', alignItems:'flex-end'}}>
                            <Ionicons style={{color:'rgb(209, 209, 214)'}} name='ios-arrow-forward-outline' size={30}/>
                        </View>
                    </TouchableOpacity>
                    
                </View>
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
        alignItems:'center',
        justifyContent: 'center',
        marginHorizontal:24 * Metrics.scaleWidth
    },        
})