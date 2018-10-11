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
    Alert
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DialogBox from 'react-native-dialogbox'

import { Metrics, Images } from '../../themes'
import { stateNames, Client, localStorage } from '../../services'

export default class AddAddressScreen extends Component{   
    constructor(props){
        super(props)

        this.state = {
            street1:'',
            street2:'',
            city:'',
            zip:'',
            states:[],
            selectState:'',
            isLoading: false
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
        let name = "Select State"
        for(var i = 0 ; i < stateNames.length ; i++){
            if(stateNames[i].abbreviation == this.state.selectState){
                name = stateNames[i].name
                break;
            }
        }
        return name
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

    zipcodeValidation(){
        let checkStr = /(^\d{5}$)|(^\d{5}-\d{4}$)/
        if(this.state.zip == '')
            return true
        else{
            return checkStr.test(this.state.zip)
        }
        
    }

    checkButtonStatus(){
        if(this.state.street1 != '' && this.state.city != ''
            && this.state.selectState != '' && this.zipcodeValidation()){
            return true
        }else{
            return false
        }
    }

    createAddress(){
        let body = {
            address1: this.state.street1,
            address2: this.state.street2,
            state: this.state.selectState,
            city: this.state.city,
            zip: this.state.zip,
        }
        localStorage.get('userInfo').then((userData) => {
            let data = JSON.parse(userData);
            Client.createAddress(data.authentication_token, body)
                .end((err, res) => {
                    if(err){
                        this.setState({isLoading: false})
                        // alert(JSON.stringify(err))
                    }else{
                        if(res.body.status == 1){
                            this.setState({isLoading: false}, () => {
                                localStorage.get('userInfo').then((userData) => {
                                    let data = JSON.parse(userData)
                                    data.owner_type = res.body.data.owner_type;
                                    data.owner_id = res.body.data.owner_id
                                    data.address1 = res.body.data.address1
                                    data.address2 = res.body.data.address2
                                    data.city = res.body.data.city
                                    data.state = res.body.data.state
                                    data.zip = res.body.data.zip
                                    data.create_at = res.body.data.create_at
                                    data.update_at = res.body.data.update_at
                                    localStorage.set('userInfo', JSON.stringify(data))
                                    this.goToTermsOfServiceScreen()
                                })
                            })
                            console.log(res.body)
                            // localStorage.set('address', res)
                        }else{
                            let str = ""
                            if(res.body.data.address1){
                                str += "Street Address 1 " + res.body.data.address1[0] + "."
                            }
                            if(res.body.data.city){
                                if(str != "")
                                    str += "\nCity " + res.body.data.city[0] + "."
                                else
                                    str += "City " + res.body.data.city[0] + "."
                            }                            
                            this.setState({isLoading: false}, () =>{
                                this.showDialogBox(str)
                            })
                        }
                    }
            })
        })
        
       
    }

    goToTermsOfServiceScreen(){
        this.props.navigator.push({
            title:'Terms of Service',
            screen:"mechaniku.TermsOfServiceScreen",                                          
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
   
    render() {
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View style={styles.container}> 
                    <View style={[styles.content, {}]}>
                        <View style={{paddingTop:110 * Metrics.scaleHeight, borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5, width:Metrics.screenWidth}} />

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Street Address 1</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'Street Address 1'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({street1: text})
                                }}
                                value={this.state.street1}
                                /> 
                            {
                                this.state.street1 == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                      
                        </View>
                        
                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Street Address 2</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'Street Address 2'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({street2: text})
                                }}
                                value={this.state.street2}
                                />                                              
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>City</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'City'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({city: text})
                                }}
                                value={this.state.city}
                                /> 
                            {
                                this.state.city == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                      
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>State</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['Select State'].concat(this.getStateArr())}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    this.setState({selectState: this.getStateCode(value)})                                    
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.getStateName()}</Text>                           
                                </View>
                            </ModalDropdown>     
                            {
                                this.state.selectState == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                          
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Zip</Text>
                            <TextInput 
                                style={styles.input}
                                keyboardType={'numeric'}
                                placeholder={'Zip Code'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({zip: text})
                                }}
                                value={this.state.zip}
                                /> 
                            {
                                !this.zipcodeValidation() &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                      
                        </View>

                        <View style={{borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5, width:Metrics.screenWidth}} />
                        <Button 
                            style={styles.nextBtn}
                            isLoading={this.state.isLoading}
                            activityIndicatorColor="#ffffff"
                            isDisabled={this.checkButtonStatus() ? false : true}
                            onPress={() => {
                                this.setState({isLoading : true}, () => {
                                    this.createAddress()
                                })                                
                            }}
                            >
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontSize:16, color:'#ffffff'}}>Next</Text>
                                <Ionicons style={{marginLeft:10, color:'#ffffff'}} name='ios-arrow-round-forward-outline' size={30}/>
                            </View>
                        </Button>

                    </View>
                    <DialogBox ref={dialogbox => {this.dialogbox = dialogbox}} />
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
        backgroundColor:'rgba(239, 241, 245, 0.74)',
        paddingHorizontal:16 * Metrics.scaleWidth
    },    
    nextBtn: {
        marginTop: 190 * Metrics.scaleHeight,
        marginHorizontal:22,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
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
        width:'40%',
        fontSize:17,
        color:'rgb(114, 129, 145)'
    },
    input:{
        width:'52%',
        fontSize:17,
        color:'rgba(2, 6, 33, 0.9)',
    },
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
    },
    filterButtonContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width:'40%',
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
   
})