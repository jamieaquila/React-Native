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
    ActivityIndicator
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Spinner from 'react-native-loading-spinner-overlay'

import { Metrics, Images } from '../../themes'
import { Client, localStorage } from '../../services';


const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default class DeteSelectionScreen extends Component{            
    constructor(props){
        super(props)

        this.state = {
            loading: true,
            dateList:[],
        }

      

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    componentDidMount(){      
        this.getTimeSlot() 
    }

    getDateStr(date){
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let fullDateStr = year + "-" + (month > 9 ? month : ("0" + month)) + "-" + (day > 9 ? day : "0" + day)
        return fullDateStr
    }

    checkUnavailableDate(curDate, unavailableDateArr){
        let dateStr = this.getDateStr(curDate)
        let flag = false
        for(var i = 0 ; i < unavailableDateArr.length ; i++){
            if(unavailableDateArr[i] == dateStr){
                flag = true
                break;
            }
        }
        return flag
    }


    getDates(unavailableDateArr){ 
        if(this.state.timeSlot){
            let stepArr = this.state.timeSlot.day.split(" ")
            let step = parseInt(stepArr[0])
            let curMilliseconds = (new Date().valueOf()) + 86400000
            let dateList = []
            let available = true
            for(var i = 1 ; i < 15 ; i++){
                let curDate = new Date(curMilliseconds);
                if(this.checkUnavailableDate(curDate, unavailableDateArr)){
                    available = false
                }else
                    available = true
                let dateValue = {
                    available: available,
                    dateStr: this.getDateStr(curDate),
                    day: WEEKS[curDate.getDay()], 
                    date: MONTHS[curDate.getMonth()] + " " + curDate.getDate() + ", " + curDate.getFullYear(),
                }
                dateList.push(dateValue)
                curMilliseconds += 86400000 * step
            }
            this.setState({
                dateList,
                loading: false
            })
        }else{
            this.setState({loading: false})
        }
    }

    getUnavailableDates(){
        Client.unavailableDates()
            .end((err, res) => {
                if(err){
                    this.setState({loading: false})
                }else{
                    if(res.body.status == 1){       
                        // console.log(res.body.data)                                         
                        this.getDates(res.body.data)
                    }else{
                        this.setState({loading: false})
                    }
                }
            })
    }

    getTimeSlot(){
        Client.timeSlot()
            .end((err, res) => {
                if(err){
                    this.setState({loading: false})
                    console.log('err')
                }else{
                    if(res.body.status == 1){         
                        this.setState({timeSlot: res.body.data}, () => {
                            this.getUnavailableDates()
                        }) 
                    }else{
                        this.setState({loading: false})
                        console.log(res.body)
                    }
                }
            })
    }

    gotoScheduleTime(oil){
        let date = {
            dateStr:oil.dateStr,
            day: oil.day,
            date: oil.date
        }
        console.log(date)
        this.props.navigator.push({
            title: oil.day + ", " + oil.date,            
            screen:"mechaniku.TimeSelectionScreen",            
            passProps:{
                selectDate:date,
                timeSlot: this.state.timeSlot
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

    renderListingRow(oil, rowId){
        return (
            oil.available ? 
                <TouchableOpacity style={styles.listing} onPress={() => {
                        this.gotoScheduleTime(oil)
                    }}>
                    <View style={{flexDirection:'row',alignItems: 'center'}}>
                        <View style={{width:'60%'}}>
                            <Text style={{fontSize:15, color:'rgb(2, 6, 33)', fontWeight:'bold'}} >{oil.day}</Text>
                            <Text style={{fontSize:15, color:'rgb(2, 6, 33)'}}>{oil.date}</Text>
                        </View>
                        <View style={{width:'32%', alignItems:'flex-end'}}>
                            <View style={styles.available} >
                                <Text style={{fontSize:13, color:'#ffffff'}}>Available</Text>
                            </View>
                        </View>
                        <View style={{width:'8%', alignItems:'flex-end'}}>
                            <Icon style={{color:'rgb(83, 170, 243)'}} name='angle-right' size={20} />
                        </View>
                        
                    </View>
                </TouchableOpacity>
            :
                <View style={styles.listing}>
                    <View style={{flexDirection:'row',alignItems: 'center'}}>
                        <View style={{width:'60%'}}>
                            <Text style={{fontSize:15, color:'rgb(2, 6, 33)', fontWeight:'bold'}} >{oil.day}</Text>
                            <Text style={{fontSize:15, color:'rgb(2, 6, 33)'}}>{oil.date}</Text>
                        </View>
                        <View style={{alignItems:'flex-end', width:'40%'}}>
                            <View style={styles.unavailable}>
                                <Text style={{fontSize:13, color:'#ffffff'}}>Unavailable</Text>
                            </View>
                        </View>
                        
                    </View>
                </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.headerTxt}>Select A Day for Your Oil Change</Text>

                    {
                        this.state.loading ?
                            <View style={styles.content}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        : this.state.dateList.length > 0 ?
                            <ListView 
                                dataSource={this.ds.cloneWithRows(this.state.dateList)}
                                enableEmptySections={true}
                                renderRow={(oil, secId, rowId, rowMap)=>{
                                    return this.renderListingRow(oil, rowId)
                                }}
                            />
                        :
                            <View style={styles.content}>
                                <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)'}}>No result data</Text>
                            </View>
                    }                    
                    <View style={{paddingTop:60}} />
                </View>                
                
            </View>
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
        backgroundColor:'#ffffff',
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
    listing:{
        width:Metrics.screenWidth - 32 * Metrics.scaleWidth,        
        justifyContent:'center',
        borderBottomColor:'rgb(188, 187, 193)',
        borderBottomWidth:0.5,
        height:60
    },
    available:{
        width:77, 
        height:20, 
        backgroundColor:'rgb(83, 170, 243)', 
        justifyContent:'center', 
        alignItems:'center',
        borderColor:'rgb(83, 170, 243)',
        borderRadius:3
    },
    unavailable:{
        width:93, 
        height:20, 
        backgroundColor:'rgb(192, 203, 214)', 
        justifyContent:'center', 
        alignItems:'center',
        borderRadius:3
    }
 })