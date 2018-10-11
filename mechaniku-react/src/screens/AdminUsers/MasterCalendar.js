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
    Platform,
    ActivityIndicator
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Spinner from 'react-native-loading-spinner-overlay'
import moment, { min } from 'moment';
import { Metrics, Images } from '../../themes'
import { Client, localStorage } from '../../services'

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const WEEKS = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S"
]

export default class MasterCalendarScreen extends Component{   
    constructor(props){
        super(props)        
        this.state = {
            years:[],
            months: MONTHS,
            days:[],
            selectedDate:{
                year: - 1,
                month: -1,
                day: -1
            },            
            selectedTabIdx:0,
            selectedWeekIdx:0,
            availableDates:[],
            timeSlot:{},
            unavailableDates: [],
            times:[],
            loading: true,
            firstLoading: true,
            lastPress: 0,
            authentication_token: '',
            initialState: false
            
        }
        this.ds = new ListView.DataSource({rowHasChanged: (rk, r2) => r1 !== r2})
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }
 
    componentDidMount() {        
        localStorage.get('userInfo').then((userInfo) => {
            let userData = JSON.parse(userInfo)
            this.setState({authentication_token: userData.authentication_token}, () => {
                this.getTimeSlot()
            })
        })
    }

    /******************   Api call start  *************************/
    getTimeSlot(){
        Client.timeSlot()
            .end((err, res) => {
                if(err){
                    console.log(err)
                    this.setState({loading: false})
                }else{
                    if(res.body.status == 1){ 
                        this.setState({timeSlot: res.body.data}, () => {
                            this.getUnavailableDates()
                        })                            
                    }else{
                        this.setState({loading: false})
                    }
                }
        })
    }

    getUnavailableDates(){
        Client.unavailableDatesByAdmin(this.state.authentication_token)
            .end((err, res) => {
                if(err){
                    this.setState({loading: false})
                }else{
                    if(res.body.status == 1){
                        if(!this.state.initialState){
                            this.setState({unavailableDates: res.body.data, initialState: true}, () =>{                                
                                this.initialSetting()
                            })
                        }else{
                            this.setState({unavailableDates: res.body.data}, () =>{   
                                this.getUnavailableTime()
                            })
                        }
                    }else{
                        this.setState({loading: false})
                    }
                }
        })
    }

    getUnavailableTime(){
        let today = new Date()
        let y = this.state.selectedDate.year
        let m = this.state.selectedDate.month + 1
        let d = this.state.selectedDate.day
        let str = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) 
        let dateStr = moment(str).format("YYYY-MM-DD")

        let unavailableTimes = []
        
        for(var i = 0 ; i < this.state.unavailableDates.length ; i++){
            if(dateStr == this.state.unavailableDates[i].date){
                if(this.state.unavailableDates[i].times != null && this.state.unavailableDates[i].times.length > 0){
                    for(var j = 0 ; j < this.state.unavailableDates[i].times.length ; j++){
                        if(this.state.unavailableDates[i].times[j] != ''){
                            unavailableTimes.push(this.state.unavailableDates[i].times[j])
                        }
                    }
                }
                
            }
        }
        this.getTimeArry(unavailableTimes)
        
    }
    /******************   Api call end  *************************/    

    initialSetting(){
        let selectedDate = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate()
        }        
        
        let years = [selectedDate.year, selectedDate.year + 1]
        let days = this.getDayArray(selectedDate.year, selectedDate.month)       
        let selData = this.getSelectedData(selectedDate.day, days)

        this.setState({
            years,
            days,
            selectedDate,
            selectedTabIdx: selData.selTabIdx,
            selectedWeekIdx: selData.selWeekIdx           
        }, () => { 
            if(Platform.OS == 'android'){
                setTimeout(() => {
                    this.monthScroll.scrollTo({x: Math.floor(selectedDate.month / 3) * Metrics.screenWidth, animated: true}) 
                })
            }else{
                this.monthScroll.scrollTo({x: Math.floor(selectedDate.month / 3) * Metrics.screenWidth, animated: true}) 
            }
            this.getUnavailableTime()
        })
    }
    
    getEditState(){
        let y = this.state.selectedDate.year
        let m = this.state.selectedDate.month + 1 > 9 ? this.state.selectedDate.month + 1 : "0" + (this.state.selectedDate.month + 1)
        let d = this.state.selectedDate.day > 9 ? this.state.selectedDate.day : "0" + this.state.selectedDate.day
        let selDateStr = new Date(y + "-" + m + "-" + d).toISOString();
        let curDateStr = new Date().toISOString()               
       
        if(moment(selDateStr).isAfter(curDateStr)){
            return true
        }else{
            return false
        }       
    }

    checkUnavailableDate(){
        if(this.state.selectedDate.month == -1 || this.state.selectedDate.day == -1){
            return true
        }else{
            let y = this.state.selectedDate.year
            let m = this.state.selectedDate.month + 1 > 9 ? this.state.selectedDate.month + 1 : "0" + (this.state.selectedDate.month + 1)
            let d = this.state.selectedDate.day > 9 ? this.state.selectedDate.day : "0" + this.state.selectedDate.day
            let str = y + "-" + m + "-" + d;

            let dateStr = moment(str).format("YYYY-MM-DD")
            let flag = false
            for(var i = 0 ; i < this.state.unavailableDates.length ; i++){
                if(this.state.unavailableDates[i].date == dateStr ){
                    if(this.state.unavailableDates[i].times == null || this.state.unavailableDates[i].times.length == 0){
                        flag = true
                        break;
                    }
                }                
            }
            return flag
        }
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
        let time = {};
        if(flag){         
            time = {
                timeStr: timeStr,
                available: true
            } 
        }else{
            time = {
                timeStr: timeStr,
                available: false
            } 
        } 
        times.push(time)
        return times
    }

    getTimeArry(unavailableTimes){
        if(this.state.timeSlot){
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

        }else{
            this.setState({
                loading: false
            })
        }
        
    }    

    getSelectedData(selectedDay, days){
        let data = {}
        for(var i = 0 ; i < days.length ; i++){
            let flag = false
            for(var j = 0 ; j < days[i].length ; j++){
                if(selectedDay == days[i][j]){
                    data = {
                        selTabIdx: i,
                        selWeekIdx: j,
                    }
                    flag = true
                    break;
                }
            }
            if(flag){
                break
            }
        }
        return data
    }

    getTotalDays(year, month){
        return new Date(year, month, 0).getDate()
    }

    getDayOfWeek(year, month, day){
        let str = year + "/"

        if(month > 9) str += month + "/"
        else str += "0" + month + "/"

        if(day > 9) str += day
        else str += "0" + day

        return new Date(str).getDay()
    }

    getDayArray(year, month){
        let curMonthDays = []
        let lastDay = this.getTotalDays(year, month + 1);
        for(var i = 1 ; i < lastDay + 1 ; i++){
            curMonthDays.push(i)
        }

        let totalArr = []
        let dayOfWeekForFirstDay = this.getDayOfWeek(year, month + 1, 1)
        if(dayOfWeekForFirstDay > 0){
            for(var i = 0 ; i < dayOfWeekForFirstDay ; i++){
                totalArr.push(-1)
            }            
        }
        totalArr.push.apply(totalArr, curMonthDays)

        let dayOfWeekForLastDay = this.getDayOfWeek(year, month + 1, lastDay)
        if(dayOfWeekForLastDay < 6){
            for(var i = 0 ; i < (6 - dayOfWeekForLastDay) ; i++){
                totalArr.push(-1)
            }
        }

        let days = []
        let idx = 0
        days[idx] = []
        for(var i = 0; i < totalArr.length ; i++){
            if(i != 0 && i % 7 == 0){
                idx++
                days[idx] = []
            }
            days[idx].push(totalArr[i])
        }
        return days
    }

    changeYear(idx, days){
        let firstLoading = this.state.firstLoading
        let selectedDate = this.state.selectedDate

        if(firstLoading){
            firstLoading = false
            this.setState({
                selectedDate,
                firstLoading,
                days
            })
        }else{
            selectedDate = {
                year:this.state.years[idx],
                month: (new Date().getFullYear() == this.state.years[idx]) ? new Date().getMonth() : 0,
                day: (new Date().getFullYear() == this.state.years[idx]) ? new Date().getDate() : 1               
            }

            days = this.getDayArray(selectedDate.year, selectedDate.month)   
            let selData = this.getSelectedData(selectedDate.day, days)

            if(Platform.OS === 'android'){
                setTimeout(() => {
                    if(selectedDate.year == new Date().getFullYear()){
                        this.monthScroll.scrollTo({x: Math.floor(selectedDate.month / 3) * Metrics.screenWidth, animated: true})                        
                    }else{
                        this.monthScroll.scrollTo({x: 0, animated: true}) 
                    }                                       
                })
            }else{
                if(selectedDate.year == new Date().getFullYear()){
                    this.monthScroll.scrollTo({x: Math.floor(selectedDate.month / 3) * Metrics.screenWidth, animated: true})                        
                }else{
                    this.monthScroll.scrollTo({x: 0, animated: true}) 
                }           
            }
            this.setState({
                selectedDate,
                firstLoading,
                days,
                selectedTabIdx: selData.selTabIdx,
                selectedWeekIdx: selData.selWeekIdx, 
                times: [],
                loading: true
            }, () => {
                this.getUnavailableTime()  
            })
        }
    }

    changeDays(date){
        let days = this.getDayArray(date.year, date.month)  
        let year = new Date().getFullYear()
        let month = new Date().getMonth()
        if(date.year == year && date.month == month){
            date.day = new Date().getDate()
            let selData = this.getSelectedData(date.day, days)
            this.setState({
                days,
                selectedDate: date,
                selectedTabIdx: selData.selTabIdx,
                selectedWeekIdx: selData.selWeekIdx 
            })
        }else{
            this.setState({
                days,
                selectedTabIdx: 0,
                selectedWeekIdx: 0          
            })
        }
        
    }  

    compareTwoArrs(arr1, arr2){
        if(arr1.length != arr2.length) return false
        for (var i = 0; i < arr2.length; i++) {
            if (arr1[i] != arr2[i]) { //To test values in nested arrays
                return false;
            }            
        }
        return true
    }

    setUnavailableDateByAdmin(){
        let str = this.state.selectedDate.year + "-" + 
        (this.state.selectedDate.month + 1 > 9 ? this.state.selectedDate.month + 1 : "0" + (this.state.selectedDate.month + 1)) + "-" +
        (this.state.selectedDate.day > 9 ? this.state.selectedDate.day : "0" + this.state.selectedDate.day)
        

        let flag = false
        let id = 0
        for(var i = 0 ; i < this.state.unavailableDates.length ; i++){
            if(str == this.state.unavailableDates[i].date){
                id = this.state.unavailableDates[i].id
                flag = true;
                break
            }
        }

       
        if(flag){
            let body = {
                authentication_token: this.state.authentication_token,                
                id: id
            }

            Client.deleteUnavailableDate(body)
            .end((err, res) => {
                if(err){
                    console.log(err)
                }else{
                    if(res.body.status == 1){
                        this.getUnavailableDates()
                    }else{
                        console.log(res.body.data)
                    }
                }
            })
        }else{
            let body = {
                authentication_token: this.state.authentication_token,
                date: str
            }
            Client.setUnavailableDateByAdmin(body)
            .end((err, res) => {
                if(err){
                    console.log(err)
                }else{
                    if(res.body.status == 1){
                        this.getUnavailableDates()
                    }else{
                        console.log(res.body.data)
                    }
                    
                }
            })
        }

        

    }

    setUnavailableTime(obj){
        let str = this.state.selectedDate.year + "-" + 
        (this.state.selectedDate.month + 1 > 9 ? this.state.selectedDate.month + 1 : "0" + (this.state.selectedDate.month + 1)) + "-" +
        (this.state.selectedDate.day > 9 ? this.state.selectedDate.day : "0" + this.state.selectedDate.day)

        let dateFlag = false
        let timeArr = []
        let id = 0
        for(var i = 0 ; i < this.state.unavailableDates.length ; i++){
            if(str == this.state.unavailableDates[i].date){
                timeArr = this.state.unavailableDates[i].times
                id = this.state.unavailableDates[i].id
                dateFlag = true
                break;               
            }
        }
        if(dateFlag){
            let timeFlag = false
            for(var i = 0 ; i < timeArr.length ; i++){
                if(obj.timeStr == timeArr[i]){
                    timeFlag = true
                    break
                }
            }
            
            if(timeFlag){
                var index = timeArr.indexOf(obj.timeStr);
                timeArr.splice(index, 1);
            }else{
                timeArr.push(obj.timeStr)
            }
            if(timeArr.length == this.state.times.length){
                let body = {
                    id: id,
                    authentication_token: this.state.authentication_token,
                    date: str,
                    times: null
                }
                Client.changeUnavailableDate(body)
                .end((err, res) => {
                    if(err){
                        console.log(err)
                    }else{
                        if(res.body.status == 1){
                            this.getUnavailableDates()
                        }else{
                            console.log(res.body.data)
                        }
                    }
                })                         
            }else if(timeArr.length == 0){
                let body = {
                    authentication_token: this.state.authentication_token,                
                    id: id
                }    
                Client.deleteUnavailableDate(body)
                .end((err, res) => {
                    if(err){
                        console.log(err)
                    }else{
                        if(res.body.status == 1){
                            this.getUnavailableDates()
                        }else{
                            console.log(res.body.data)
                        }
                        
                    }
                })   
            }else{
                let body = {
                    id: id,
                    authentication_token: this.state.authentication_token,
                    date: str,
                    times: timeArr
                }
                Client.changeUnavailableDate(body)
                .end((err, res) => {
                    if(err){
                        console.log(err)
                    }else{
                        if(res.body.status == 1){
                            this.getUnavailableDates()
                        }else{
                            console.log(res.body.data)
                        }
                    }
                })
            }
        }else{
            let body = {
                authentication_token: this.state.authentication_token,
                date: str,
                times: [obj.timeStr]
            }
            Client.setUnavailableDateByAdmin(body)
                .end((err, res) => {
                    if(err){

                    }else{
                        if(res.body.status == 1){
                            this.getUnavailableDates()
                        }else{

                        }
                    }
                })
        }        
       
    }

    renderMonthItems(){
        let monthArr = MONTHS.map((month, i) => {
            return (
                <TouchableOpacity key={i} style={{alignItems:'center', justifyContent:'center', width:Metrics.screenWidth / 3}} onPress={()=>{
                        let selectedDate = this.state.selectedDate
                        selectedDate.month = i
                        selectedDate.day = -1
                        this.setState({selectedDate, days:[]}, () => {
                            this.changeDays(selectedDate)
                        })
                    }}>
                    <Text style={[{fontSize:18, fontWeight:'bold'}, this.state.selectedDate.month == i ? {color:'rgb(61, 59, 238)'} : {color:'rgba(38, 38, 40, 0.2)'}]}>{month}</Text>
                </TouchableOpacity>
            )
        })
        return monthArr
    } 

    renderDayItems(slide){
        let dayArr = slide.map((day, i) => {
            return (
                day == -1 ?
                    <View key={i} style={{alignItems:'center', width:(Metrics.screenWidth - 50) / 7, paddingTop:27 * Metrics.scaleHeight}}>
                        <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)'}}>{WEEKS[i]}</Text>
                    </View>
                :
                    <View key={i} style={[
                        {alignItems:'center', width:(Metrics.screenWidth - 50) / 7, paddingTop:27 * Metrics.scaleHeight, height:129 * Metrics.scaleHeight},
                        (this.state.selectedDate.day == day) && {backgroundColor:'rgb(61, 59, 238)', borderBottomLeftRadius:30 *  Metrics.scaleHeight, borderBottomRightRadius:30 * Metrics.scaleHeight}
                        ]} >
                        <Text style={[
                            {fontSize:14, color:'rgba(2, 6, 33, 0.4)'},
                            (this.state.selectedDate.day == day) && {color:'rgba(255, 255, 255, 0.4)'}
                            ]}>{WEEKS[i]}
                        </Text>
                        <TouchableOpacity style={{paddingTop:24 * Metrics.scaleHeight}} onPress={()=>{
                            let selectedDate = this.state.selectedDate
                            selectedDate.day = day
                            let selectedWeekIdx = i
                            this.setState({
                                selectedDate,
                                selectedWeekIdx,
                                times:[],
                                loading: true
                            }, () => {
                                this.getUnavailableTime()                                
                            })
                            }}>
                            <Text style={[
                                {fontSize:14, color:'rgba(2, 6, 33, 0.9)', fontWeight:'bold'},
                                (this.state.selectedDate.day == day) && {color:'rgba(255,255,255, 0.9)'}
                                ]}>{day}
                            </Text>
                        </TouchableOpacity>
                        {
                            (this.state.selectedDate.day == day && this.getEditState()) &&
                            <TouchableOpacity style={{alignItems:'center',justifyContent:'center', paddingTop:12 * Metrics.scaleHeight}} onPress={() => {
                                var delta = new Date().getTime() - this.state.lastPress;
                                if(delta < 200) {
                                    this.setUnavailableDateByAdmin()
                                }
                                this.setState({
                                    lastPress: new Date().getTime()
                                })
                            }}>
                                <View style={
                                    [
                                        {
                                            width:12 * Metrics.scaleHeight, 
                                            height:12 * Metrics.scaleHeight, 
                                            backgroundColor:'rgb(0, 218, 152)', 
                                            borderRadius:6 * Metrics.scaleHeight
                                        }, this.checkUnavailableDate() && {backgroundColor:'red'} 
                                    ]} />
                            </TouchableOpacity>
                        }
                    </View>
            )
            
        })
        return dayArr
    }

    renderListRow(obj){
        return (
            <View style={{
                    flexDirection:'row', 
                    paddingHorizontal:16, 
                    height:60 * Metrics.scaleHeight,                    
                    borderBottomColor:'rgba(188, 187, 193, 0.5)', 
                    borderBottomWidth:0.5,
                    alignItems:'center'
                }}>
                <View style={{width:'75%', alignItems:'flex-start'}}>
                    <Text style={{fontSize:15, color:'rgba(2, 6, 33, 0.8)', fontWeight:'bold'}}>{obj.timeStr}</Text>
                </View>
                {
                    this.getEditState() ?
                    <TouchableOpacity style={{width:'25%', alignItems:'flex-end'}} onPress={() => {
                        this.setUnavailableTime(obj)
                        }}>
                        <View style={{
                            alignItems:'center', 
                            justifyContent:'center', 
                            paddingVertical:3, 
                            paddingHorizontal:7,
                            backgroundColor:'rgb(0, 218, 152)',
                            borderRadius:4
                        }}>
                            <Text style={{fontSize:13, color:'rgba(255, 255, 255, 0.55)'}}>{obj.available ? 'Available' : 'Unavailable'}</Text>
                        </View>                    
                    </TouchableOpacity>
                    :
                    <View style={{width:'25%', alignItems:'flex-end'}}>
                        <View style={{
                            alignItems:'center', 
                            justifyContent:'center', 
                            paddingVertical:3, 
                            paddingHorizontal:7,
                            backgroundColor:'rgb(0, 218, 152)',
                            borderRadius:4
                        }}>
                            <Text style={{fontSize:13, color:'rgba(255, 255, 255, 0.55)'}}>{obj.available ? 'Available' : 'Unavailable'}</Text>
                        </View>                    
                    </View>
                }
                
            </View>
        )
    }

    render() {  
        return (
            <View style={styles.container}> 
                <View style={styles.content}>
                    <View style={{width:'100%', paddingHorizontal:25, height: 44 * Metrics.scaleHeight}}>
                    {
                        this.state.years.length > 0 &&                        
                        <ScrollableTabView 
                            renderTabBar={false}
                            initialPage={0}
                            onChangeTab={(val) => {
                                let days = this.state.days
                                this.setState({days:[]}, () => {
                                    this.changeYear(val.i, days) 
                                })
                                                           
                            }}
                            >
                            {
                                this.state.years.map((year, i) => {
                                    return (
                                        <View key={i} style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                                            <Text style={{fontSize:15, color:'rgba(2, 6, 33, 0.8)'}}>{year}</Text>
                                        </View>
                                    )
                                })
                            }
                        </ScrollableTabView>
                    }   
                    </View>                 
                    <ScrollView ref={ref => this.monthScroll = ref}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}                          
                        style={{ backgroundColor:'#ffffff', height: 70 * Metrics.scaleHeight}}                                  
                        >
                        {
                            this.renderMonthItems()
                        }
                    </ScrollView>
                    <View style={{width:'100%', paddingHorizontal:25}}>                        
                        <View style={{height: 129 * Metrics.scaleHeight}}>
                        {
                            this.state.days.length > 0 &&
                            <ScrollableTabView 
                                renderTabBar={false}
                                initialPage={this.state.selectedTabIdx}
                                onChangeTab={(val) => {
                                    this.setState({selectedTabIdx: val.i})
                                }}
                                >
                                { 
                                    this.state.days.map((slide, i) => {
                                        return (                                            
                                            <View key={i} style={{flexDirection:'row'}}>                                            
                                            {
                                                this.renderDayItems(slide)
                                            }
                                            </View>
                                        )
                                    })
                                }
                            </ScrollableTabView>
                        }                            
                        </View>
                    </View>
                    <View style={{paddingTop:17 * Metrics.scaleHeight}} />
                    {
                        this.state.loading ?
                            <View style={{width:'100%', height: Metrics.screenHeight / 2, justifyContent:'center', alignItems:'center'}}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        :
                            this.state.timeSlot ?
                                this.checkUnavailableDate() ?
                                <View style={{paddingTop:45 * Metrics.scaleHeight, alignItems:'center'}}>
                                    <Image style={{width:175 * Metrics.scaleHeight, height: 157 * Metrics.scaleHeight}} source={Images.calendarCrossIcon} />
                                </View>
                                : this.state.times.length > 0 &&
                                <ListView
                                    style={{height: Metrics.screenHeight / 2}}
                                    dataSource={this.ds.cloneWithRows(this.state.times)}
                                    enableEmptySections={true}
                                    renderRow={(timeObj, selId, rowId, rowMap) => {
                                        return this.renderListRow(timeObj)
                                    }}
                                />
                            :
                            <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)'}}>Time Slot didn't select.</Text>
                            </View>           
                    }
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
        alignItems:'center'       
    },        
})