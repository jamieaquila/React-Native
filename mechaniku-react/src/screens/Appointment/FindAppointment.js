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
    Modal
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Metrics, Images } from '../../themes'
import { Client, stateNames, localStorage } from '../../services'
import DialogBox from 'react-native-dialogbox'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class FindAppointmentScreen extends Component{   
    constructor(props){
        super(props)
        this.state = {
            appointmentId: this.props.appointmentId,
            licensePlateState:'',
            licensePlateNumber:'',
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

    getStateNameFromCode(code){
        let name = 'Select License Plate State';
        for(var i = 0 ; i < stateNames.length ; i++){
            if(stateNames[i].abbreviation == code){
                name = stateNames[i].name
                break;
            }
        }
        return name
    }

    getStateCodeFromName(name){
        let code = '';
        for(var i = 0 ; i < stateNames.length ; i++){
            if(stateNames[i].name == name){
                code = stateNames[i].abbreviation
                break;
            }
        }
        return code
    }

    getStateNameArr(){
        let names = []
        for(var i = 0 ; i < stateNames.length ; i++){
            names.push(stateNames[i].name)
        }
        return names
    }

    disableStatus(){
        if(this.state.licensePlateState != '' 
            && this.checkLicensePlateNumber()){
            return false
        }else{
            return true
        }
    }

    findAppointment(){
        
        let body = {
            license_plate_state: this.state.licensePlateState,
            license_plate_number: this.state.licensePlateNumber
        }

        Client.findAppointment(body)
            .end((err, res) => {
                if(err){
                    alert(JSON.stringify(err.message))
                    this.setState({loading: false}, () => {
                        this.showDialogBox('There\'s a connection problem!\nTry later.')
                    })
                    // console.log(err)

                }else{
                    if(res.body.status == 1){
                        this.setState({loading: false}, () => {
                            console.log(res.body.data)
                            this.goToFoundAppointment(res.body.data[0])
                        })
                        
                    }else{
                        console.log(res.body.data)
                        this.setState({loading: false}, () => {
                            this.showDialogBox(res.body.data)
                        })
                        
                    }
                }
            })
    }

    goToFoundAppointment(appointment){
        let curDate = new Date(appointment.appointment.date);
        let status = "found"
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
        if(appointment.appointment.price == null){
            selectOption = undefined
        }else if(appointment.appointment.price == 80.00){
            selectOption = 'standard'
        }else{
            selectOption = 'premium'
        }
        

        this.props.navigator.push({
            title: "Your Appointment",            
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

    checkLicensePlateNumber(){
        let count = 0
        for(var i = 0 ; i < this.state.licensePlateNumber.length ; i++){
            if(this.state.licensePlateNumber.charAt(i) == ' '){
                count++
            }
        }
        if((this.state.licensePlateNumber != '' && count == this.state.licensePlateNumber.length) || this.state.licensePlateNumber == ''){
            return false
        }else{
            return true
        }
    }

    render() {
        return (            
            <View style={styles.container}> 
                <KeyboardAwareScrollView ref="scroll">
                    <View style={styles.content}>
                        <View style={{paddingTop:120 * Metrics.scaleHeight, borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5}} />
                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>License Plate State</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['Select License Plate State'].concat(this.getStateNameArr())}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let licensePlateState = this.getStateCodeFromName(value)
                                    this.setState({licensePlateState})
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.getStateNameFromCode(this.state.licensePlateState)}</Text>                           
                                </View>
                            </ModalDropdown>  
                            {
                                this.state.licensePlateState == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }  
                        </View>
                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>License Plate Number</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'License Plate Number'}
                                placeholderTextColor='rgb(156, 155, 155)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({licensePlateNumber:text})
                                }}
                                value={this.state.licensePlateNumber}
                            />     
                            {
                                !this.checkLicensePlateNumber() &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }         
                        </View>
                        <Button 
                            style={styles.confirmButton}
                            isDisabled={this.disableStatus()}
                            isLoading={this.state.loading}
                            activityIndicatorColor="#ffffff"
                            onPress={() => {
                                // this.findAppointment()
                                this.setState({loading: true}, () => {
                                    this.findAppointment()
                                })
                                
                            }}
                            >
                            <Text style={{fontSize:16, color:'#ffffff', paddingLeft: 10}}>Find Appointment</Text>                        
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
                <DialogBox ref={dialogbox => {this.dialogbox = dialogbox}} />
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
        paddingHorizontal:16 * Metrics.scaleWidth  
    },     
    txtInputView:{
        flexDirection:'row', 
        height:44.5 * Metrics.scaleHeight, 
        width:'100%',   
        borderBottomColor:'rgb(200, 199, 204)', 
        borderBottomWidth:0.5,
        alignItems:'center',
    },
    label:{
        width:'42%',
        fontSize:17,
        color:'rgb(114, 129, 145)'
    },
    input:{
        width:'50%',
        fontSize:17,
        color:'rgb(2, 6, 33)',
    },
    filterButtonContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width:'50%',
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
        fontSize:17,
        color:'rgb(2, 6, 33)',
    },
    buttonText: {
        fontSize:17,
        color:'rgb(2, 6, 33)',
    },
    confirmButton:{        
        marginTop:310 * Metrics.scaleHeight,
        marginBottom:24 * Metrics.scaleHeight,
        marginHorizontal:38,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
    },  
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
    },
   
})