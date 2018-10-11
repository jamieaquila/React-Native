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
    TextInput,
    Alert,
    ScrollView
} from 'react-native'
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import stripe from 'tipsi-stripe'
import DialogBox from 'react-native-dialogbox'
import { Metrics, Images } from '../../themes'
import { Client, localStorage, stateNames } from '../../services'


export default class AppointmentScreen extends Component{   
    constructor(props){
        super(props)
        this.state = {
            userName:'',        
            loading: false,    
            appointmentId: this.props.appointmentId,
            modalVisible: false,
            selBtnIdx: 0
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    showDialogBox(msg){
        this.dialogbox.tip({
            title:'Whoops!',
            content: msg,
            btn :{
                text:'OK'
            }
        })
    }

    getState(stateCode){
        let state = ""
        for(var i = 0 ; i < stateNames.length ; i++){
            if(stateCode == stateNames[i].abbreviation){
                state = stateNames[i].name
                break;
            }
        }
        return state
    }

    getDateStr(str){
        let dateStr = new Date(str + " GMT").toUTCString()
        let arr = dateStr.split(" ")
        let fullDateStr = arr[0] + " " + arr[2] + " " + arr[1] + ", " + arr[3]
        return fullDateStr
    }
    
    goToPaymentScreen(body){
        const { date, time, location, vehicle, selectOption } = this.props  

        localStorage.get('deviceInfo').then((deviceInfo) => {            
            let info = JSON.parse(deviceInfo)
            let body = {
                date: date.dateStr,
                time: time,
                location:{
                    address1: location.address1,
                    address2: location.address2,
                    state: location.state,
                    city: location.city,
                    zip: location.zip
                },
                vehicle:{
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    mileage: vehicle.mileage,
                    license_plate_state: vehicle.license_plate_state,
                    license_plate_number: vehicle.license_plate_number
                },
                device_token: info.token,
                device_type: info.os
            }
            this.props.navigator.push({
                title:'Payment',            
                screen:"mechaniku.PaymentScreen",            
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
                },
                passProps:{
                    data:body,
                    selectOption: selectOption                
                },
            })
        })

        
    }

    goToCancelledAppointmentScreen(){       
        Navigation.startSingleScreenApp({
            screen:{
              title:'Appointment Cancelled',            
              screen:"mechaniku.CancelledAppointmentScreen",               
              navigatorStyle: {
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true 
              },
              navigatorButtons : {
                rightButtons: [
                    {
                        id:'home',
                        title: 'Home'
                    }
                    
                ]
              }
            },
            passProps: {appointmentId: this.state.appointmentId}
          })  
    }

    goToMechanicAppointmentScreen(){
        Navigation.startSingleScreenApp({
            screen:{
              title:'Appointments',            
              screen:"mechaniku.MechanicAppointmentScreen",   
              navigatorStyle: {
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true 
              },
              navigatorButtons : {
                rightButtons: [
                    {
                        id:'logout',
                        title: 'Logout'
                    }
                    
                ]
              }
            }
          })  
    }

    async openCardForm(){
        try {           
            const token = await stripe.paymentRequestWithCardForm({})
            this.cancelAppointment(token.tokenId)
        } catch (error) {
            this.setState({loading: false}, () => {
                this.showDialogBox(error.message)
            })
        }
    }

    showAlert(){
        Alert.alert(
            '',
            'You will be charged a $5.00 free to cancel this appointment',
            [
              {text: "Don't Cancel", onPress: () => {
                  this.setState({loading: false})
              }, style: 'cancel'},
              {text: 'Agree, Cancel', onPress: () => {
                this.cancelAppointment()
              }},
            ],
            { cancelable: false }
          )
    }

    checkStripeToken(){
        localStorage.get('stripe_token').then((token) => {
            if(token){
                this.cancelAppointment(token)
            }else{     
                this.openCardForm()          
                // this.setState({modalVisible: true})
            }
        })
    }

    acceptAppointment(){
        localStorage.get('userInfo').then((userInfo) => {
            let info = JSON.parse(userInfo)
            let body = {
                id: this.state.appointmentId
            }
            Client.acceptAppointment(info.authentication_token, body)
                .end((err, res) => {
                    if(err){
                        console.log(err)
                        this.setState({selBtnIdx: 0})
                    }else{
                        if(res.body.status == 1){
                            console.log(res.body.data)
                            this.setState({selBtnIdx: 0}, () => {
                                this.goToMechanicAppointmentScreen()
                            })
                        }else{
                            console.log(res.body.data)
                            this.setState({selBtnIdx: 0})
                        }
                    }
                })
        })
    }

    rejectAppointment(){
        localStorage.get('userInfo').then((userInfo) => {
            let info = JSON.parse(userInfo)
            let body = {
                id: this.state.appointmentId,
            }
            Client.rejectAppointment(info.authentication_token, body)
                .end((err, res) => {
                    if(err){
                        console.log(err)
                        this.setState({loading: false})
                    }else{
                        if(res.body.status == 1){
                            this.setState({loading: false}, () => {
                                this.goToMechanicAppointmentScreen()
                            })
                            console.log(res.body.data)
                        }else{
                            console.log(res.body.data)
                            this.setState({loading: false})
                        }
                    }
                })
        })
    }

    finishAppointment(){
        localStorage.get('userInfo').then((userInfo) => {
            let info = JSON.parse(userInfo)
            let body = {
                id: this.state.appointmentId,
            }
            Client.finishAppointment(info.authentication_token, body)
                .end((err, res) => {
                    if(err){
                        console.log(err)
                        this.setState({loading: false})
                    }else{
                        if(res.body.status == 1){
                            this.setState({loading: false}, () => {
                                this.goToMechanicAppointmentScreen()
                            })
                            console.log(res.body.data)
                        }else{
                            console.log(res.body.data)
                            this.setState({loading: false})
                        }
                    }
                })
        })
    }

    checkFeeState(){
        Client.checkFeeStatus(this.state.appointmentId)
            .end((err, res) => {
                if(err){
                    this.setState({loading: false})
                }else{
                    if(res.body.status == 1){
                        if(res.body.data.fee_state){ 
                            this.showAlert()
                        }else{
                            this.cancelAppointment()
                        }
                    }else{
                        this.setState({loading: false})
                    }
                }
            })
    }
    

    cancelAppointment(){
        let body = {
            id: this.state.appointmentId
        }

        Client.cancelAppointment(body)
            .end((err, res) => {
                if(err){
                    alert(err.message)
                    this.setState({loading: false})
                }else{
                    if(res.body.status == 1){
                        this.setState({loading: false}, () => {
                            localStorage.remove('curStatus')
                            this.goToCancelledAppointmentScreen()
                        })
                    }else{
                        this.setState({loading: false})
                    }
                }
            })
    }

    render() {
        const { status, date, time, location, vehicle, selectOption } = this.props  
        
        let dateStr = this.getDateStr(date.date) 
        return (
            <ScrollView>
                <View style={styles.container}> 
                    <View style={styles.content}>
                        <Image style={{width:335 * Metrics.scaleWidth, height:142 * Metrics.scaleHeight, borderRadius:10}} source={Images.appointmentTopLogo} />
                        <View style={{marginHorizontal:30}}>
                            <View style={{paddingTop:10 * Metrics.scaleHeight, height: 20 * Metrics.scaleHeight, justifyContent:'center'}}>
                                {/* <TextInput 
                                    style={styles.input}
                                    placeholderTextColor='rgb(156, 155, 155)'
                                    underlineColorAndroid={'#ffffff'}
                                    onChangeText={(text) => {
                                        this.setState({userName:text})
                                    }}
                                    value={this.state.userName}
                                    />  */}
                            </View>
                            <View style={{paddingTop:10 * Metrics.scaleHeight, borderBottomColor:'rgba(31, 49, 74, 0.1)', borderBottomWidth:1}}/>

                            <View style={styles.item}>
                                <Image style={{width:30 * Metrics.scaleHeight, height:30 * Metrics.scaleHeight}} source={Images.calanderTimeoutIcon} />
                                <View style={{paddingLeft:11, width:'85%', justifyContent:'center'}}>
                                    <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.8)', textAlign:'left'}} >{time}</Text>
                                    <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.8)', textAlign:'left'}}>{dateStr}</Text>
                                </View>
                            </View>

                            <View style={styles.item}>                            
                                <Image style={{marginLeft:6 * Metrics.scaleHeight, width:24 * Metrics.scaleHeight, height:30 * Metrics.scaleHeight}} source={Images.locationPinHome} />
                                <View style={{paddingLeft:11, width:'85%'}}>
                                    <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.8)'}} >{location.address1}</Text>
                                </View>                            
                            </View>

                            <View style={{width:'100%',     
                                        height:58 * Metrics.scaleHeight, 
                                        borderBottomColor:'rgba(31, 49, 74, 0.1)', 
                                        borderBottomWidth:1, 
                                        justifyContent:'center'
                                        }}>
                                <Text style={{fontSize:32, color:'rgb(61, 59, 238)', fontWeight:'bold', textAlign:'center'}} >
                                    {selectOption ? (selectOption == 'standard' ? '$60' : '$80') : ''}
                                </Text>
                            </View>

                            <View style={{width:'100%',     
                                        height:95 * Metrics.scaleHeight, 
                                        justifyContent:'center'
                                        }}>
                                <Text style={{fontSize:14, color:'rgb(0, 0, 0)', textAlign:'center'}} >
                                    The vehicle to be serviced is a {vehicle.year} {vehicle.make} {vehicle.model} with {vehicle.mileage} miles. The license plate number is {this.getState(vehicle.license_plate_state)} {vehicle.license_plate_number}.
                                </Text>
                            </View>
                        </View>
                    </View>
                    {
                        status == 'admin' ?
                            <View style={{paddingTop: 110 * Metrics.scaleHeight}} />
                        : status == 'mechanic' ?
                            <View style={{flexDirection:'row', width:'100%', paddingTop:29 * Metrics.scaleHeight,}}>
                                <View style={{width:'10%'}} />
                                <View style={{width:'37%'}} >
                                    <Button 
                                        style={{
                                            height:50 * Metrics.scaleHeight,
                                            backgroundColor:'rgb(238, 99, 92)',
                                            borderWidth:0,}}
                                        isDisabled={this.state.selBtnIdx == 2 ? true : false}
                                        isLoading={this.state.selBtnIdx == 1 ? true : false}
                                        activityIndicatorColor="#ffffff"
                                        onPress={() => {
                                            this.setState({selBtnIdx: 1}, () => {
                                                this.acceptAppointment()
                                            })
                                            
                                        }}
                                        >
                                        <Text style={{fontSize:16, color:'#ffffff'}}>Accept</Text>
                                    </Button>
                                </View>
                                <View style={{width:'6%'}} />
                                <View style={{width:'37%'}} >
                                    <Button 
                                        style={{
                                            height:50 * Metrics.scaleHeight,
                                            backgroundColor:'rgb(61, 59, 238)',
                                            borderWidth:0,}}
                                        isDisabled={this.state.selBtnIdx == 1 ? true : false}
                                        isLoading={this.state.selBtnIdx == 2 ? true : false}
                                        activityIndicatorColor="#ffffff"
                                        onPress={() => {
                                            this.setState({selBtnIdx: 2}, () => {
                                                this.rejectAppointment()
                                            })
                                            
                                        }}
                                        >
                                        <Text style={{fontSize:16, color:'#ffffff'}}>Reject</Text>
                                    </Button>
                                </View>     
                                <View style={{width:'10%'}} />                           
                            </View>
                        : status == 'finish' ?
                            <Button 
                                style={[styles.confirmButton, {}]}
                                isDisabled={false}
                                isLoading={this.state.loading}
                                activityIndicatorColor="#ffffff"
                                onPress={() => {
                                    this.setState({loading: true}, () => {
                                        this.finishAppointment()                                            
                                    })
                                }}
                                >
                                <Text style={{fontSize:16, color:'#ffffff'}}>Finish</Text>
                            </Button>
                        :
                            <Button 
                                style={[styles.confirmButton, status == 'confirm' && {backgroundColor:'#3d3bee'}]}
                                isDisabled={false}
                                isLoading={this.state.loading}
                                activityIndicatorColor="#ffffff"
                                onPress={() => {
                                    if(status == 'confirm'){
                                        this.goToPaymentScreen()                              
                                    }else{
                                        this.setState({loading: true}, () => {
                                            this.checkFeeState()                                            
                                        })
                                    }
                                }}
                                >
                                <Text style={{fontSize:16, color:'#ffffff'}}>{status != 'confirm' ? 'Cancel' : 'Confirm!'}</Text>
                            </Button>
                        
                    }
                    <DialogBox ref={dialogbox => {this.dialogbox = dialogbox}} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,    
        backgroundColor:'rgba(239, 241, 245, 0.74)'     
    },    
    content:{       
        marginTop:15 * Metrics.scaleHeight, 
        backgroundColor:'#ffffff',
        marginHorizontal:20 * Metrics.scaleWidth,
        borderRadius:10
    },     
    confirmButton:{        
        marginTop:29 * Metrics.scaleHeight,
        marginBottom:24 * Metrics.scaleHeight,
        marginHorizontal:38,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(238, 99, 92)',
        borderWidth:0,
    },
    input:{
        fontSize:20,
        color:'rgb(61, 59, 238)',
        textAlign:'center'
    },
    item: {
        flexDirection:'row',
        width:'100%',     
        paddingVertical:5 * Metrics.scaleHeight,
        // height:64 * Metrics.scaleHeight, 
        borderBottomColor:'rgba(31, 49, 74, 0.1)', 
        borderBottomWidth:1, 
        alignItems:'center'
    },
})