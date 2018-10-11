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
    ActivityIndicator
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import Spinner from 'react-native-loading-spinner-overlay'

import { Metrics, Images } from '../../themes'
import { Client, localStorage } from '../../services'

export default class TimeSelectionScreen extends Component{    
    
    constructor(props){
        super(props)

        this.state = {
            times:[],
            selectedTimeIdx: 0,
            selectDate: this.props.selectDate,
            timeSlot: this.props.timeSlot,
            loading: true
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    componentDidMount(){
        this.getUnavailableTime()
    }

    addTimeArr(h, m, status, unavailableTimes, times){
        let flag = true
        let timeStr = (h > 9 ? h : ("0" + h)) + ":" + (m > 9 ? m : ("0" + m)) + " " + status
        for(var i = 0 ; i < unavailableTimes.length ; i++){
            if(unavailableTimes[i] == timeStr){
                flag = false
                break;
            }
        }
        if(flag)
            times.push(timeStr)
        return times
    }
    
    getTimeArry(unavailableTimes){
        let startTimeStr = this.state.timeSlot.start_time
        let startTimeArr = startTimeStr.split(" ")
        let startTimeHMArr = startTimeArr[0].split(":")
        
        let endTimeStr = this.state.timeSlot.end_time;
        let endTimeArr = endTimeStr.split(" ")
        let endTimeHMArr = endTimeArr[0].split(":")

        let h = parseInt(startTimeHMArr[0])
        let m = parseInt(startTimeHMArr[1])
        let timeStatus = startTimeArr[1]

        let endH = parseInt(endTimeHMArr[0])
        let endMin = parseInt(endTimeHMArr[1])
        let endTimeStatus = endTimeArr[1]

        let times = []

        while(1){
            if(endTimeStatus == 'AM'){
                if(h > endH){
                    break
                }else if(h == endH){
                    if(m > endMin){
                        break
                    }else if(m == endMin){
                        times = this.addTimeArr(h, m, timeStatus, unavailableTimes, times)
                        break
                    }else{
                        times = this.addTimeArr(h, m, timeStatus, unavailableTimes, times)
                        m += parseInt(this.state.timeSlot.interval)
                        if(m == 60){
                            m = 0
                            h += 1                                
                        }else if(m > 60){
                            m = m - 60
                            h += 1                                                     
                        }
                    }
                }else{
                    times = this.addTimeArr(h, m, timeStatus, unavailableTimes, times)
                    m += parseInt(this.state.timeSlot.interval)
                    if(m == 60){
                        m = 0
                        h += 1                            
                    }else if(m > 60){
                        m = m - 60
                        h += 1                                             
                    }
                }
            }else if(endTimeStatus == 'PM'){
                if(timeStatus == 'AM'){
                    times = this.addTimeArr(h, m, timeStatus, unavailableTimes, times)
                    m += parseInt(this.state.timeSlot.interval)
                    if(m == 60){
                        m = 0
                        h += 1                        
                        if(h == 12)
                            timeStatus = "PM"
                    }else if(m > 60){
                        m = m - 60
                        h += 1                           
                        if(h == 12)
                            timeStatus = "PM"                        
                    }
                }else{
                    if(h != 12 && h > endH){
                        break
                    }else if(h == endH){
                        if(m > endMin){
                            break
                        }else if(m == endMin){
                            times = this.addTimeArr(h, m, timeStatus, unavailableTimes, times)
                            break
                        }else{
                            times = this.addTimeArr(h, m, timeStatus, unavailableTimes, times)
                            m += parseInt(this.state.timeSlot.interval)
                            if(m == 60){
                                m = 0
                                h += 1                                    
                            }else if(m > 60){
                                m = m - 60
                                h += 1                                                        
                            }
                        }
                    }else{
                        
                        times = this.addTimeArr(h, m, timeStatus, unavailableTimes, times)
                        m += parseInt(this.state.timeSlot.interval)
                        if(m == 60){
                            m = 0
                            h += 1 
                            if(h > 12){
                                h = 1;                                    
                            }                                   
                        }else if(m > 60){
                            console.log(h, m)
                            m = m - 60
                            h += 1   
                            if(h > 12){
                                h = 1;                                    
                            }                                                     
                        }
                    }
                }
            }
        }

        this.setState({
            times,
            loading: false
        })
    }

    getUnavailableTime(){     
        Client.unsvailableTimes(this.state.selectDate.dateStr)
            .end((err, res) => {
                if(err){
                    this.setState({loading: false})
                    console.log(err)
                }else{
                    if(res.body.status == 1){
                        console.log(res.body.data)
                        // this.setState({loading: false}, () => {
                            this.getTimeArry(res.body.data)
                        // })
                        
                    }else{
                        this.setState({loading: false})
                        console.log(res.body)
                    }
                }
            })
    }

    goToSelectLocationScreen(time){
        this.props.navigator.push({
            title: "Select Location",            
            screen: "mechaniku.SelectAddressScreen",   
            passProps:{
                date: this.state.selectDate,
                time: time
            },         
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

    renderTimeButtons(){
        let buttonList = this.state.times.map((item, i) => {
            return (
                this.state.selectedTimeIdx == i + 1 ?
                    <View key={i} style={{flexDirection:'row', marginBottom:10 * Metrics.scaleHeight}}>
                        <View style={[styles.buttonStyle, {backgroundColor:'#656974', width:'48%', marginBottom:0, marginRight:'2%'}]}>
                            <Text style={[styles.buttonText, {color:'#ffffff'}]}>{item}</Text>
                        </View>
                        <TouchableOpacity style={[styles.buttonStyle, {backgroundColor:'#00a0ff', width:'48%', marginBottom:0, marginLeft:'2%'}]} onPress={() => {
                            this.goToSelectLocationScreen(item)                            
                        }}>
                            <Text style={[styles.buttonText, {color:'#ffffff'}]}>Confirm!</Text>
                        </TouchableOpacity>
                    </View>
                :
                    <TouchableOpacity key={i} style={styles.buttonStyle} onPress={() => {
                            this.setState({selectedTimeIdx: i + 1})
                        }}>
                        <Text style={[styles.buttonText, this.state.selectedTimeIdx - 1 == i ? {color:'#ffffff'} : {}]}>{item}</Text>
                    </TouchableOpacity>
            )
        })
        return buttonList;
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.content} >
                        <Text style={styles.headerTxt}>Select A Time for Your Oil Change</Text>
                        {
                            this.state.loading ?
                                <View style={styles.content}>
                                    <ActivityIndicator size="large" color="#0000ff" />
                                </View>
                            : this.state.times.length > 0 ?
                                this.renderTimeButtons()
                            :
                                <View style={styles.content}>
                                    <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)'}}>No result data</Text>
                                </View>
                            
                        }                                         
                    </View>                    
                </View>
            </ScrollView>        
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
    //    backgroundColor:'#ffffff',
       paddingHorizontal:16 * Metrics.scaleWidth
    },  
    headerTxt:{
        paddingTop: 16 * Metrics.scaleHeight,
        paddingBottom: 21 * Metrics.scaleHeight,
        textAlign:'left',
        color:'rgb(2, 6, 33)',
        fontSize:17,
        fontWeight:'600'
    },
    buttonStyle:{
        width:'100%',
        height: 40 * Metrics.scaleHeight,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'#ffffff',
        borderColor:'rgba(31, 49, 74, 0.12)',
        borderWidth:1,
        borderRadius:3,
        marginBottom:10 * Metrics.scaleHeight
    },
    buttonText:{
        fontSize:15,
        color:'rgb(2, 6, 33)'
    },
    selectTimeBg:{

    },

    confirmBtn: {
        marginTop: 30 * Metrics.scaleHeight,
        marginHorizontal:38,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
    }
})