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
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native'
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import InfiniteScrollView from 'react-native-infinite-scroll-view'

import { Metrics, Images } from '../../themes'
import { stateNames, Client, localStorage } from '../../services'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export default class MechanicAppointmentScreen extends Component{   
    constructor(props){
        super(props)        
        this.state = {
            appointments:[],
            tabIdx: 1,
            loading: true,
            refreshing: false,
            infiniteLoading: false,
            canLoadMore: true,
            page: 1,
            active: true
        }
        this.ds = new ListView.DataSource({rowHasChanged: (rk, r2) => r1 !== r2})
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event){
        if(event.id === 'logout'){
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
    }

    componentDidMount() {
        localStorage.get('userInfo').then(info => {
            let user = JSON.parse(info)
            if(user.status == 1){
                this.getPendingAppointments()
            }else{
                this.setState({active: false})
            }
        })
    }

    getPendingAppointments(){
        localStorage.get('userInfo').then(userInfo => {
            let info = JSON.parse(userInfo)            
            Client.getPendingAppointments(info.authentication_token, 1)
            .end((err, res) => {
                if(err){
                    this.setState({
                        loading: false,
                        refreshing: false,
                        infiniteLoading: false
                    })
                }else{
                    if(res.body.status == 1){
                        let page = this.state.page
                        let canLoadMore = this.state.canLoadMore

                        if(res.body.data.length > 0){
                            page++
                        }

                        if(res.body.data.length < 20)
                            canLoadMore = false
                        else    
                            canLoadMore = true

                        let appointments = this.state.appointments
                        if(this.state.refreshing) appointments = []

                        appointments.push.apply(appointments, res.body.data);

                        this.setState({
                            loading: false,
                            refreshing: false,
                            infiniteLoading: false,
                            appointments,
                            page,
                            canLoadMore
                        })
                    }else{
                        this.setState({
                            loading: false,
                            refreshing: false,
                            infiniteLoading: false
                        })
                    }
                }
            })
        })
    }

    getAcceptedAppointments(){
        localStorage.get('userInfo').then(userInfo => {
            let info = JSON.parse(userInfo)            
            Client.getAcceptedAppointments(info.authentication_token, 1)
            .end((err, res) => {
                if(err){
                    this.setState({
                        loading: false,
                        refreshing: false,
                        infiniteLoading: false
                    })
                }else{
                    if(res.body.status == 1){
                        let page = this.state.page
                        let canLoadMore = this.state.canLoadMore

                        if(res.body.data.length > 0){
                            page++
                        }

                        if(res.body.data.length < 20)
                            canLoadMore = false
                        else    
                            canLoadMore = true

                        let appointments = this.state.appointments
                        if(this.state.refreshing) appointments = []

                        appointments.push.apply(appointments, res.body.data);

                        this.setState({
                            loading: false,
                            refreshing: false,
                            infiniteLoading: false,
                            appointments,
                            page,
                            canLoadMore
                        })
                    }else{
                        this.setState({
                            loading: false,
                            refreshing: false,
                            infiniteLoading: false
                        })
                    }
                }
            })
        })
    }

    onRefresh(){
        this.setState({
            refreshing: true,
            page: 1
        }, () => {
            if(this.state.tabIdx == 1){
                this.getPendingAppointments()
            }else{
                this.getAcceptedAppointments()
            }
        })
    }

    _infiniteScroll(event){        
        if (this.state.loading || this.state.refreshing || this.state.infiniteLoading || !this.state.canLoadMore) return;
        if (this._distanceFromEnd(event) < -50 ) {
            this.setState({infiniteLoading: true}, () => {
                if(this.state.tabIdx == 1){
                    this.getPendingAppointments()
                }else {
                    this.getAcceptedAppointments()
                }
            })
            console.log(this._distanceFromEnd(event) )
        }
    }

    _distanceFromEnd(event) {
        let {
          contentSize,
          contentInset,
          contentOffset,
          layoutMeasurement,
        } = event.nativeEvent;
    
        var contentLength = contentSize.height;
        var trailingInset = contentInset.bottom;
        var scrollOffset = contentOffset.y;
        var viewportLength = layoutMeasurement.height;
    
        return contentLength + trailingInset - scrollOffset - viewportLength;
    }
    
    viewAppointment(appointment){
        let curDate = new Date(appointment.appointment.date);
        let status
        if(this.state.tabIdx == 1) status = "mechanic"
        else status = "finish"
        let dateStr = MONTHS[curDate.getMonth()] + " " + curDate.getDate() + ", " + curDate.getFullYear();
        let time = appointment.appointment.time

        let location = {
            address1: appointment.address.address1,
            address2: appointment.address.address2,
            city: appointment.address.city,
            zip: appointment.address.zip,
            state: appointment.address.state
        }

        let vehicle = {
            make:appointment.vehicle.make,
            model:appointment.vehicle.model,
            year:appointment.vehicle.year,
            mileage:appointment.vehicle.mileage,
            license_plate_state: appointment.vehicle.license_plate_state,
            license_plate_number:appointment.vehicle.license_plate_number,
        }
        let selectOption
        if(appointment.appointment.price == null || appointment.appointment.price == 80.00)
            selectOption = 'standard'
        else selectOption = 'premium'

        this.props.navigator.push({
            title: "Appointment #" + appointment.vehicle.license_plate_number,            
            screen: "mechaniku.AppointmentScreen",   
            passProps: {
                status: status,
                appointmentId: appointment.appointment.id,
                date: {
                    date: dateStr,
                    dateStr: appointment.appointment.date
                },
                time: time,
                location: location,
                vehicle: vehicle,
                selectOption: selectOption
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

    getStateName(state){
        let stateName = ""
        for(var i = 0 ; i < stateNames.length ; i++){
            if(state == stateNames[i].abbreviation){
                stateName = stateNames[i].name
                break
            }
        }
        return stateName
    }

    getDateStr(str){
        let dateStr = new Date(str + " GMT").toUTCString()
        let arr = dateStr.split(" ")
        let fullDateStr = arr[0] + " " + arr[2] + " " + arr[1] + ", " + arr[3]
        return fullDateStr
    }

    getAddressStr(appointment){
        
        return appointment.address ? (appointment.address.address1 + ", " + appointment.address.zip) : ''
    }

    getDateTimeStr(appointment){
        let curDate = new Date(appointment.appointment.date);
        let dateStr = MONTHS[curDate.getMonth()] + " " + curDate.getDate() + ", " + curDate.getFullYear();
        let time = appointment.appointment.time

        return this.getDateStr(dateStr) + ", " + time
    }
    
    renderTab(){
        return (
            <View style={styles.tabView}>
                <TouchableOpacity style={[styles.tab, this.state.tabIdx == 1 && {borderBottomColor:'rgba(0, 0, 0, 0.5)', borderBottomWidth: 2}]} onPress={() => {
                    if(this.state.tabIdx != 1){                        
                        this.setState({
                            tabIdx: 1,
                            appointments: [],
                            page: 1,
                            loading: true,
                            refreshing: false,
                            infiniteLoading: false,
                            canLoadMore: true
                        }, () => {
                            this.getPendingAppointments()
                        })
                    }
                    
                }}>
                    <Text style={styles.btnText}>Pending</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tab, this.state.tabIdx == 2 && {borderBottomColor:'rgba(0, 0, 0, 0.5)', borderBottomWidth: 2}]} onPress={() => {                  
                    if(this.state.tabIdx != 2){                        
                        this.setState({
                            tabIdx: 2,
                            appointments: [],
                            page: 1,
                            loading: true,
                            refreshing: false,
                            infiniteLoading: false,
                            canLoadMore: true
                        }, () => {
                            this.getAcceptedAppointments()
                        })
                    }
                }}>
                    <Text style={styles.btnText}>Accepted</Text>
                </TouchableOpacity>
            </View>
        )
    }
    
    renderListRow(appointment){
        return (           
            <TouchableOpacity style={{
                width:'100%',
                paddingVertical: 5 * Metrics.scaleHeight,                 
                borderBottomColor:'rgba(188, 187, 193, 0.5)', 
                borderBottomWidth:0.5, 
                paddingHorizontal:16, 
                alignItems:'center', 
                justifyContent:'center',
                flexDirection:'row'
                }} onPress={() => {this.viewAppointment(appointment)}}>
                <View style={{width:'40%', alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={{fontSize:15, fontWeight:'bold', color:'rgba(2, 6, 33, 0.8)'}}>#{appointment.vehicle.license_plate_number}</Text>
                    <Text style={{fontSize:13, color:'rgba(2, 6, 33, 0.56)'}}>{this.getStateName( appointment.address ? appointment.address.state : "")}</Text>
                </View>
                <View style={{width:'60%', alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={{fontSize:15, color:'rgba(2, 6, 33, 0.8)'}}>{this.getAddressStr(appointment)}</Text>
                    <Text style={{fontSize:15, color:'rgba(2, 6, 33, 0.8)'}}>{this.getDateTimeStr(appointment)}</Text>
                </View>
            </TouchableOpacity>               
        )
    }

    render() {
        return (
            <View style={styles.container}> 
                {
                    this.renderTab()
                }
                {
                    !this.state.active && this.state.tabIdx == 1 ?
                        <View style={styles.content} >
                            <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)'}}>Your account has been suspended by admin.</Text>
                        </View>
                    :
                    this.state.loading ?
                        <View style={styles.content}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    : this.state.appointments.length == 0 && !this.state.refreshing && !this.state.loading ?
                        <View style={styles.content}>
                            <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)'}}>No result data</Text>
                        </View>
                    :
                        <View style={styles.content}>                            
                            <ListView
                                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                                dataSource={this.ds.cloneWithRows(this.state.appointments)}
                                enableEmptySections={true}
                                renderRow={(appointment, selId, rowId, rowMap) => {
                                    return this.renderListRow(appointment)
                                }}
                                canLoadMore={this.state.canLoadMore}
                                onLoadMoreAsync={() => {}}
                                onScroll={(event) => {
                                    this._infiniteScroll(event);
                                }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={() => {
                                            this.onRefresh()
                                        }}
                                        tintColor="#0000ff"
                                        colors={['#ff0000', '#00ff00', '#0000ff']}
                                        progressBackgroundColor="#0000ff"
                                    />
                                }
                            />
                        </View>
                }
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
        paddingTop: 14,
        alignItems:'center',
        justifyContent: 'center',
        marginHorizontal:16 * Metrics.scaleWidth
    },   
    tabView: {
        width:'100%',
        flexDirection: 'row',
    },
    tab: {
        width:'50%', 
        alignItems:'center', 
        justifyContent:'center', 
        paddingVertical: 
        15 * Metrics.scaleHeight,
    },
    btnText:{
        fontSize:17,
        color:'rgba(2, 6, 33, 0.9)',
    }    
})