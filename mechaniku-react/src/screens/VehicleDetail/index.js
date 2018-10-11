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
    Platform
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay'
import { Metrics, Images } from '../../themes'
import { Client, localStorage, stateNames, vehicles, licensePlates } from '../../services'


export default class VehicleDetailsScreen extends Component{   
    constructor(props){
        super(props)

        this.state = {
            vehicle: {
                make:'Select Make',
                model:'Select Model',
                year:'Select Year',
                mileage:'',
                license_plate_state:'',
                license_plate_number:'',
            },            
            years: [],
            makes: [],
            models: [],
            loading: false,
            date: this.props.date,
            time: this.props.time,
            location: this.props.location,
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    componentDidMount() {
        this.getInitialData()
    }

    getInitialData(){
        let makes = []
        for(var key in vehicles){
            makes.push(key)
        }   
        this.setState({makes})
    }

    getModels(){
        let models = []
        if(this.state.vehicle.make != 'Select Make'){            
            for(var key in vehicles[this.state.vehicle.make]){
                models.push(key)
            }
        }
        let vehicle = this.state.vehicle
        vehicle.model = 'Select Model'
        vehicle.year = 'Select Year'
        let years = []
        this.setState({
            vehicle,
            models,
            years,
        })
    }

    getYears(){
        let years = []
        if(this.state.vehicle.model != 'Select Model'){
            years = vehicles[this.state.vehicle.make][this.state.vehicle.model]
        }        
        let vehicle = this.state.vehicle
        vehicle.year = 'Select Year'
        let models = []
        this.setState({
            vehicle,
            years
        })
    }

    getStateArr(){
        let states = [];
        for(var  i = 0 ; i < stateNames.length ; i++){
            states.push(stateNames[i].name)
        }

        return states
    }

    getStateCode(value){       
        let str = ""
        for(var i = 0 ; i < stateNames.length ; i++){
            if(stateNames[i].name == value){
                str = stateNames[i].abbreviation
                break;
            }
        }
        return str
    }

    getStateName(){
        let name = ""
        if(this.state.vehicle.license_plate_state == ''){
            name = 'Select License Plate State'
        }else{
            for(var i = 0 ; i < stateNames.length ; i++){
                if(stateNames[i].abbreviation == this.state.vehicle.license_plate_state){
                    name = stateNames[i].name
                    break;
                }
            }
        }
        return name
    }
    
    
    goToTypeOfOilScreen(){
        this.props.navigator.push({
            title: "Type of Oil",            
            screen: "mechaniku.TypeOfOilScreen",    
            passProps:{
                date: this.state.date,
                time: this.state.time,
                location: this.state.location,
                vehicle: this.state.vehicle
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

    checkBtnStatus(){
        if(this.state.vehicle.make != 'Select Make' 
            && this.state.vehicle.model != 'Select Model' 
            && this.state.vehicle.year != 'Select Year' 
            && this.state.vehicle.mileage != '' 
            && this.state.vehicle.license_plate_state != '' 
            && this.checkLicensePlateNumber()){ 
            return false
        }else return true
    }

    correctMileage(text){
        let vehicle = this.state.vehicle         
        switch(text){
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '.':
            case 'Backspace':
                if(vehicle.mileage == ''){
                    if(text != '.' && text != 'Backspace'){
                        vehicle.mileage += text
                        this.setState({vehicle})
                    }
                }else{
                    let dotCheck = false
                    for(var i = 0 ; i < vehicle.mileage.length ; i++){
                        if(vehicle.mileage.charAt(i) == '.'){
                            dotCheck = true;
                            break
                        }
                    }

                    if(text == 'Backspace'){
                        vehicle.mileage = vehicle.mileage.substr(0, vehicle.mileage.length - 1)
                        this.setState({vehicle})
                    }else{
                        if(text.charAt(text.length - 1) == '.'){
                            if(!dotCheck){
                                vehicle.mileage += text
                                this.setState({vehicle})
                            }
                        }else{
                            vehicle.mileage += text
                            this.setState({vehicle})
                        }
                    }        
                    
                }  
                break
        }

    }
        
    checkLicensePlateNumber(){
        let count = 0
        for(var i = 0 ; i < this.state.vehicle.license_plate_number.length ; i++){
            if(this.state.vehicle.license_plate_number.charAt(i) == ' '){
                count++
            }
        }

        if(this.state.vehicle.license_plate_number != '' && count == this.state.vehicle.license_plate_number.length){
            return false
        }else if(this.state.vehicle.license_plate_number == ''){
            return false
        }else {
            return true
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View style={styles.container}> 
                    <Text style={styles.title}>Please Provide Details of Your Vehicle</Text>
                    <View style={{paddingTop:35 * Metrics.scaleHeight, borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5}}/>
                    <View style={styles.content}>
                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Make</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['Select Make'].concat(this.state.makes)}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {

                                    let vehicle = this.state.vehicle
                                    vehicle.make = value
                                    this.setState({vehicle:vehicle}, () => {
                                        this.getModels()
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.state.vehicle.make}</Text>                           
                                </View>
                            </ModalDropdown>   
                            {
                                this.state.vehicle.make == 'Select Make' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                     
                        </View>                       

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Model</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['Select Model'].concat(this.state.models)}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let vehicle = this.state.vehicle
                                    vehicle.model = value
                                    this.setState({vehicle:vehicle}, () => {
                                        this.getYears()
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.state.vehicle.model}</Text>                           
                                </View>
                            </ModalDropdown>   
                            {
                                this.state.vehicle.model == 'Select Model' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                     
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Year</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['Select Year'].concat(this.state.years)}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let vehicle = this.state.vehicle
                                    vehicle.year = value
                                    this.setState({vehicle: vehicle})
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.state.vehicle.year}</Text>                           
                                </View>
                            </ModalDropdown>   
                            {
                                this.state.vehicle.year == 'Select Year' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                     
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Mileage</Text>
                            {
                                Platform.OS == 'ios' ?
                                    <TextInput 
                                        style={styles.input}
                                        placeholder={'Mileage'}
                                        placeholderTextColor='rgb(156, 155, 155)'
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={"numeric"}
                                        onChangeText={(text) => {
                                            // this.correctMileage(text)                                        
                                        }}
                                        onKeyPress={(event) => {
                                            this.correctMileage(event.nativeEvent.key)
                                        }}
                                        value={this.state.vehicle.mileage}
                                    />    
                                
                                : 
                                    <TextInput 
                                        style={styles.input}
                                        placeholder={'Mileage'}
                                        placeholderTextColor='rgb(156, 155, 155)'
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={"numeric"}
                                        onChangeText={(text) => {
                                            let vehicle = this.state.vehicle         
                                            vehicle.mileage = text
                                            this.setState({vehicle})
                                            
                                        }}                                    
                                        value={this.state.vehicle.mileage}
                                    />    
                            }                        
                            
                            {
                                this.state.vehicle.mileage == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                           
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>License Plate State</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['Select License Plate State'].concat(this.getStateArr())}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let vehicle = this.state.vehicle
                                    vehicle.license_plate_state = this.getStateCode(value)
                                    this.setState({vehicle:vehicle})
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.getStateName()}</Text>                           
                                </View>
                            </ModalDropdown>     
                            {
                                this.state.vehicle.license_plate_state == '' &&
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
                                    let vehicle = this.state.vehicle
                                    vehicle.license_plate_number = text
                                    this.setState({vehicle}, () => {
                                        this.checkBtnStatus()
                                    })
                                }}
                                value={this.state.vehicle.license_plate_number}
                                />       
                            {
                                !this.checkLicensePlateNumber () &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                        
                        </View>

                        <Button 
                            style={styles.confirmBtnStyle}
                            isDisabled={this.checkBtnStatus()}
                            isLoading={this.state.loading}
                            activityIndicatorColor="#ffffff"
                            onPress={() => {
                                this.goToTypeOfOilScreen()
                                
                            }}
                            >
                            <Text style={{fontSize:16, color:'#ffffff'}}>Confirm!</Text>
                        </Button>
                    </View>                    
                </View>
            </KeyboardAwareScrollView>
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
        // backgroundColor:'#ffffff',
        paddingHorizontal:16 * Metrics.scaleWidth
    },  
    title:{
        fontSize:17,
        fontWeight:'bold',
        textAlign:'center',
        color:'rgb(2, 6, 33)',
        paddingTop:16 * Metrics.scaleHeight
    },
    txtInputView:{
        flexDirection:'row', 
        height: 44.5 * Metrics.scaleHeight, 
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
    confirmBtnStyle: {
        marginTop:180 * Metrics.scaleHeight,
        marginHorizontal:22,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
    },
    filterButtonContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width:'50%',
        // borderRadius: 3,
        // borderColor: 'rgb(128, 128, 128)'
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
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
    },
})