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

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay'
import InfiniteScrollView from 'react-native-infinite-scroll-view'

import { Metrics, Images } from '../../themes'
import { stateNames, Client, localStorage } from '../../services'


const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default class AllAppointmentsScreen extends Component{   
    constructor(props){
        super(props)        
        this.state = {
            appointments:[],
            loading: true,
            refreshing: false,
            infiniteLoading: false,
            canLoadMore: true,
            page: 1
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
        this.getAppointments()
    }

    onRefresh(){
        this.setState({
            refreshing: true,
            page: 1
        }, () => {
            this.getAppointments()
        })
    }

    _infiniteScroll(event){        
        if (this.state.loading || this.state.refreshing || this.state.infiniteLoading || !this.state.canLoadMore) return;
        if (this._distanceFromEnd(event) < -50 ) {
            this.setState({infiniteLoading: true}, () => {
                this.getAppointments()
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

    showDialogBox(appointment){    
        Alert.alert(
            '',
            'Are you sure you want to delete appointment #' + appointment.vehicle.license_plate_number + '?',
            [
            {text: 'Yes, Delete', onPress: () => {
                this.setState({loading: true}, () => {
                    this.deleteAppointment(appointment.appointment.id)
                })
                
            }},
            {text: 'No, Cancel', onPress: () => {

                }},
            
            ],
            { cancelable: false }
        )
    }

    getAppointments(){
        localStorage.get('userInfo').then(userInfo => {
            let info = JSON.parse(userInfo)
            Client.getAllAdminAppointments(info.authentication_token, this.state.page)
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

    deleteAppointment(id){
        localStorage.get('userInfo').then(userInfo => {
            let info = JSON.parse(userInfo)
            Client.deleteAppointment(info.authentication_token, id)
                .end((err, res) => {
                    if(err){
                        this.setState({loading: false})
                        console.log(err)
                    }else{
                        if(res.body.status == 1){
                            console.log(res.body.data)
                            this.setState({
                                loading: false,
                                refreshing: true,
                                page: 1
                            }, () => {
                                this.getAppointments()
                            })
                        }else{
                            this.setState({loading: false})
                            console.log(res.body)
                        }
                    }
                })
            })
    }

    viewAppointment(appointment){
        let curDate = new Date(appointment.appointment.date);
        let status = "admin" //'mechanic'// 
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

    editAppointment(appointment){

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

    renderListRow(appointment){
        return (
            <View style={{flexDirection:'row', width:'100%', height:60 * Metrics.scaleHeight, borderBottomColor:'rgba(188, 187, 193, 0.5)', borderBottomWidth:0.5, paddingHorizontal:16, alignItems:'center'}}>
                <View style={{width:'60%', alignItems:'flex-start'}}>
                    <Text style={{fontSize:15, fontWeight:'bold', color:'rgba(2, 6, 33, 0.8)'}}>#{appointment.vehicle.license_plate_number}</Text>
                    <Text style={{fontSize:15, color:'rgba(2, 6, 33, 0.56)'}}>{this.getStateName( appointment.address ? appointment.address.state : "")}</Text>
                </View>
                <View style={{width:'40%', flexDirection:'row'}}>                 
                    <TouchableOpacity style={{width:'50%', alignItems:'center', justifyContent:'center'}} onPress={() => {                        
                        this.showDialogBox(appointment)                        
                    }}>
                        <Image style={{width:16, height:16}} source={Images.deleteIcon} />
                        <Text style={{fontSize:12, color:'rgb(238, 99, 92)'}}>Delete</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{width:'50%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                        this.viewAppointment(appointment)
                    }}>                     
                        <Image style={{width:16, height:16}} source={Images.viewIcon} />
                        <Text style={{fontSize:12, color:'rgb(141, 141, 254)'}}>View</Text>    
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        return (
            
            <View style={styles.container}> 
            {
                this.state.loading ?
                    <View style={styles.content}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                : 
                this.state.appointments.length == 0 && !this.state.refreshing && !this.state.loading ?
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
                        {
                            this.state.infiniteLoading && 
                            <View style={styles.content}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <View style={{paddingTop: 80}} />
                            </View>
                        }
                    </View>
                    
                    
            }
            
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,   
        // backgroundColor:'rgba(239, 241, 245, 0.74)'      
    },    
    content:{        
        paddingTop:14 * Metrics.scaleHeight,
        alignItems:'center',
        justifyContent: 'center',
        marginHorizontal:16 * Metrics.scaleWidth
    },        
})