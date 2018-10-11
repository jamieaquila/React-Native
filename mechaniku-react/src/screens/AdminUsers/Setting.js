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
    NativeModules,
    
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Spinner from 'react-native-loading-spinner-overlay'
import moment, { locale } from 'moment';
import { Metrics, Images } from '../../themes'
import { stateNames } from '../../services'
import { SetTimeModal } from '../../components'
import { Client, localStorage } from '../../services'

export default class SettingScreen extends Component{   
    constructor(props){
        super(props)        
        this.state = {
            day: '',
            interval: 0,
            bookings: 0,
            startTime: {
                h:'',
                m:'',
                state:''
            },
            endTime: {
                h:'',
                m:'',
                state:''
            },
            visible: false,
            status:0,
            loading: false
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    componentDidMount() {
        this.getTimeSlot()
    }  

    getTimeSlot(){
        Client.timeSlot()
            .end((err, res) => {
                if(err){
                    this.setState({loading: false})
                }else{
                    if(res.body.status == 1){ 
                        this.getDataFromTimeSlot(res.body.data)
                    }else{
                        this.setState({loading: false})
                    }
                }
        })
    }

    getDataFromTimeSlot(timeSlot){
        if(timeSlot){
            let day = timeSlot.day;
            let interval = timeSlot.interval
            let bookings = timeSlot.bookings        
            
            let startTime = {}
            let endTime = {}
            let startTimeArr = timeSlot.start_time.split(" ")        
            startTime.state = startTimeArr[1]
            startTime.h = parseInt(startTimeArr[0].split(":")[0]).toString()
            startTime.m = startTimeArr[0].split(":")[1]      
            

            let endTimeArr = timeSlot.end_time.split(" ")
            endTime.state = endTimeArr[1]
            endTime.h = parseInt(endTimeArr[0].split(":")[0]).toString()
            endTime.m = endTimeArr[0].split(":")[1]
            
            this.setState({
                day,
                interval,
                bookings,
                startTime,
                endTime,
                loading: false,
                isLoading: false
            })
        }else{
            this.setState({
                loading: false,
                isLoading: false
            })
        }
        
    }

    getTimeStr(timeObj){
        let str = ""
        if(parseInt(timeObj.h) < 10) str += "0" + timeObj.h
        else str += timeObj.h
        str += ":" + timeObj.m + " " + timeObj.state
        return str
    }

    checkDisableBtnStatus(){        
        if(this.state.day == '' || this.state.interval == 0 || this.state.bookings == 0 || this.state.startTime.h == '' || this.state.startTime.m == '' || this.state.startTime.state == ''
            || this.state.endTime.h == '' || this.state.endTime.m == '' || this.state.endTime.state == ''){
                return true
        }else{
            return false
        }
    }

    closeModal(saveStatus, timeStatus, value){  
        if(saveStatus){
            if(timeStatus == 1){
                this.setState({
                    startTime: value,
                    visible: false
                })
            }else{
                this.setState({
                    endTime: value,
                    visible: false
                })
            }
        }else{
            this.setState({visible: false})
        }
    }

    saveTimeSlot(){
        localStorage.get('userInfo').then((userInfo) =>{
            let userData = JSON.parse(userInfo)
            let body = {
                id: userData.id,
                day: this.state.day,
                interval: this.state.interval,
                bookings: this.state.bookings,
                start_time: (parseInt(this.state.startTime.h) < 10 ? ('0' + parseInt(this.state.startTime.h)) : parseInt(this.state.startTime.h)) + ":" + (parseInt(this.state.startTime.m) < 10 ? ("0" + parseInt(this.state.startTime.m)) : parseInt(this.state.startTime.m)) + " " + this.state.startTime.state,
                end_time: (parseInt(this.state.endTime.h) < 10 ? ('0' + parseInt(this.state.endTime.h)) : parseInt(this.state.endTime.h)) + ":" + (parseInt(this.state.endTime.m) < 10 ? ("0" + parseInt(this.state.endTime.m)) : parseInt(this.state.endTime.m)) + " " + this.state.endTime.state
            }
            
            Client.setTimeSlot(body)
                .end((err, res) => {
                    if(err){
                        this.setState({isLoading: false})
                        console.log("error")
                    }else{
                        this.setState({isLoading: false})
                        if(res.body.status == 1){
                            console.log(res.body.data)
                        }else{
                            console.log(res.body.data)
                        }        

                    }
            })
        })
        
    }

    render() {  
        return (
            <View style={styles.container}> 
                <View style={styles.content}>
                    <Text style={[{paddingTop: 15 * Metrics.scaleHeight}, styles.titleText]}>Select Number of Buffer Days</Text>  
                    <View style={{paddingTop: 25 * Metrics.scaleHeight, width:'100%', flexDirection:'row'}}>
                        <TouchableOpacity style={[this.state.day == '1 day' ? styles.btnSelect : styles.btnUnselect, {width:'28%'}]} onPress={() =>{this.setState({day:'1 day'})}}>
                            <Text style={[styles.btnText, this.state.day == '1 day' && {color:'rgba(255, 255, 255, 0.9)'}]}>1 day</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.day == '2 days' ? styles.btnSelect : styles.btnUnselect, {width:'28%', marginLeft:'8%'}]} onPress={() =>{this.setState({day:'2 days'})}}>
                            <Text style={[styles.btnText, this.state.day == '2 days' && {color:'rgba(255, 255, 255, 0.9)'}]}>2 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.day == '3 days' ? styles.btnSelect : styles.btnUnselect, {width:'28%', marginLeft:'8%'}]} onPress={() =>{this.setState({day:'3 days'})}}>
                            <Text style={[styles.btnText, this.state.day == '3 days' && {color:'rgba(255, 255, 255, 0.9)'}]}>3 days</Text>
                        </TouchableOpacity>
                    </View>  

                    <View style={[{marginTop: 23.5 * Metrics.scaleHeight}, styles.borderView]} />

                    <Text style={[styles.titleText, {paddingTop: 17 * Metrics.scaleHeight}]}>Show Availability in Increments of</Text>
                    <View style={{paddingTop: 25 * Metrics.scaleHeight, width:'100%', flexDirection:'row'}}>
                        <TouchableOpacity style={[this.state.interval == 15 ? styles.btnSelect : styles.btnUnselect, {width:'22%'}]} onPress={() =>{this.setState({interval:15})}}>
                            <Text style={[styles.btnText, this.state.interval == 15 && {color:'rgba(255, 255, 255, 0.9)'}]}>15 min</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.interval == 30 ? styles.btnSelect : styles.btnUnselect, {width:'22%', marginLeft:'4%'}]} onPress={() =>{this.setState({interval:30})}}>
                            <Text style={[styles.btnText, this.state.interval == 30 && {color:'rgba(255, 255, 255, 0.9)'}]}>30 min</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.interval == 45 ? styles.btnSelect : styles.btnUnselect, {width:'22%', marginLeft:'4%'}]} onPress={() =>{this.setState({interval:45})}}>
                            <Text style={[styles.btnText, this.state.interval == 45 && {color:'rgba(255, 255, 255, 0.9)'}]}>45 min</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.interval == 60 ? styles.btnSelect : styles.btnUnselect, {width:'22%', marginLeft:'4%'}]} onPress={() =>{this.setState({interval:60})}}>
                            <Text style={[styles.btnText, this.state.interval == 60 && {color:'rgba(255, 255, 255, 0.9)'}]}>60 min</Text>
                        </TouchableOpacity>
                    </View>  

                    <View style={[{marginTop: 23.5 * Metrics.scaleHeight}, styles.borderView]} />

                    <Text style={[styles.titleText, {paddingTop: 17 * Metrics.scaleHeight}]}>Max Number of Bookings per Hour</Text>
                    <View style={{paddingTop: 25 * Metrics.scaleHeight, width:'100%', flexDirection:'row'}}>
                        <TouchableOpacity style={[this.state.bookings == 1 ? styles.btnSelect : styles.btnUnselect, {width:'28%'}]} onPress={() =>{this.setState({bookings:1})}}>
                            <Text style={[styles.btnText, this.state.bookings == 1 && {color:'rgba(255, 255, 255, 0.9)'}]}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.bookings == 2 ? styles.btnSelect : styles.btnUnselect, {width:'28%', marginLeft:'8%'}]} onPress={() =>{this.setState({bookings:2})}}>
                            <Text style={[styles.btnText, this.state.bookings == 2 && {color:'rgba(255, 255, 255, 0.9)'}]}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.bookings == 3 ? styles.btnSelect : styles.btnUnselect, {width:'28%', marginLeft:'8%'}]} onPress={() =>{this.setState({bookings:3})}}>
                            <Text style={[styles.btnText, this.state.bookings == 3 && {color:'rgba(255, 255, 255, 0.9)'}]}>3</Text>
                        </TouchableOpacity>
                    </View>  

                    <View style={[{marginTop: 23.5 * Metrics.scaleHeight}, styles.borderView]} />

                    <TouchableOpacity style={{width:'100%', height:46.5 * Metrics.scaleHeight, flexDirection:'row', alignItems:'center'}} onPress={() => {  
                        this.setState({visible: true, status:1})                      
                        }}>
                        <View style={{width:'65%', alignItems:'flex-start'}}>
                            <Text style={{fontSize:17, color:'rgba(2, 6, 33, 0.9)', fontWeight:'600'}}>Start Time</Text>
                        </View>
                        <View style={{width:'25%', alignItems:'flex-end'}}>
                            {
                                this.state.startTime.h && this.state.startTime.m && this.state.startTime.state ?
                                    <View style={{backgroundColor:'rgb(83, 170, 243)', borderRadius:4, alignItems:'center', paddingVertical:3, paddingHorizontal:7,}}>
                                        <Text style={{fontSize:13, color:'#fff'}}>{this.getTimeStr(this.state.startTime)}</Text>
                                    </View>
                                :
                                    <Text style={{fontSize:13, color:'rgba(2, 6, 33, 0.45)'}}>SET TIME</Text>
                            }
                        </View>
                        <View style={{width:'10%', alignItems:'flex-end'}}>
                            <Ionicons style={{color:'rgb(83, 170, 243)'}} name='ios-arrow-forward-outline' size={20}/>
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.borderView]} />

                    <TouchableOpacity style={{width:'100%', height:46.5 * Metrics.scaleHeight, flexDirection:'row', alignItems:'center'}} onPress={() => { 
                        this.setState({visible: true, status: 2}) 
                        }}>
                        <View style={{width:'65%', alignItems:'flex-start'}}>
                            <Text style={{fontSize:17, color:'rgba(2, 6, 33, 0.9)', fontWeight:'600'}}>End Time</Text>
                        </View>
                        <View style={{width:'25%', alignItems:'flex-end'}}>
                            {
                                this.state.endTime.h && this.state.endTime.m && this.state.endTime.state ?
                                    <View style={{backgroundColor:'rgb(83, 170, 243)', borderRadius:4, alignItems:'center', paddingVertical:3, paddingHorizontal:7}}>
                                        <Text style={{fontSize:13, color:'#fff'}}>{this.getTimeStr(this.state.endTime)}</Text>
                                    </View>
                                :
                                    <Text style={{fontSize:13, color:'rgba(2, 6, 33, 0.45)'}}>SET TIME</Text>
                            }
                        </View>
                        <View style={{width:'10%', alignItems:'flex-end'}}>
                            <Ionicons style={{color:'rgb(83, 170, 243)'}} name='ios-arrow-forward-outline' size={20}/>
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.borderView]} />

                    <Button 
                        style={styles.saveButton}
                        isDisabled={this.checkDisableBtnStatus()}
                        isLoading={this.state.isLoading}
                        activityIndicatorColor="#ffffff"
                        onPress={() => {
                            this.setState({isLoading: true}, ()=> {
                                this.saveTimeSlot()
                            })
                            
                        }}
                        >
                        <Text style={{fontSize:16, color:'#ffffff'}}>Save</Text>
                    </Button> 
                </View>     
                {
                    this.state.visible &&
                    <SetTimeModal
                        visible={this.state.visible}
                        data={this.state.status == 1 ? 
                            {
                                start: this.state.startTime,
                                end: this.state.endTime
                            } : 
                            {
                                start: this.state.startTime,
                                end: this.state.endTime
                            }}
                        status={this.state.status}
                        closeModal={this.closeModal.bind(this)}
                    />   
                }                  

                <Spinner 
                    animation={'fade'}
                    visible={this.state.loading}
                    overlayColor={'rgba(0, 0, 0, 0.4)'}
                />      
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
        paddingHorizontal: 16       
    },    
    btnSelect:{
        height: 46 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',        
        borderRadius: 4,
        alignItems:'center',
        justifyContent:'center'
    },
    titleText: {
        fontSize:17, 
        color:'rgba(2, 6, 33, 0.9)', 
        fontWeight:'600'
    },
    btnUnselect: {
        height: 46 * Metrics.scaleHeight,
        borderColor:'rgba(31, 49, 74, 0.12)',
        borderWidth: 1,
        borderRadius: 4,
        alignItems:'center',
        justifyContent:'center'
    },    
    btnText : {
        fontSize:15
    },
    borderView: {
        width: '100%',
        borderColor:'rgba(188, 187, 193, 0.5)',
        borderWidth: 0.5,
    },
    saveButton:{
        marginTop: 25 * Metrics.scaleHeight,
        marginHorizontal:22,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
    },    
})