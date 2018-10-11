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
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Metrics, Images } from '../../themes'
import { stateNames, Client, localStorage, countries, currencies } from '../../services'
import { NotificationModal, BankAccountModal } from '../../components'
import DialogBox from 'react-native-dialogbox'
import stripe from 'tipsi-stripe'

const LEGAL_TYPE = ["Select Legal Type", "Company", 'Individual']

export default class LinkBankAccountScreen extends Component{   
    constructor(props){
        super(props)
        this.state = {        
            isLoading: false,    
            params: {                
                accountNumber: '', // required field
                countryCode: '', // required field
                currency: 'Select Currency', // required field
                routingNumber: '', // 9 digits
                accountHolderName: '',
                accountHolderType: LEGAL_TYPE[0],
            },
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

    getCountryNames(){
        let countryNames = []
        for(var i = 0 ; i < countries.length; i++){
            countryNames.push(countries[i].name)
        }
        return countryNames;
    }

    getCountryCode(name){
        let code = ''
        for(var i = 0 ; i < countries.length ; i++){
            if(name == countries[i].name){
                code = countries[i].code
                break;
            }
        }
        return code
    }

    getCountryName(){
        let name = ''
        if(this.state.params.countryCode == ''){
            name = 'Select Country'
        }else {
            for(var i = 0 ; i < countries.length ; i++){
                if(this.state.params.countryCode == countries[i].code){
                    name = countries[i].name
                    break
                }
            }
        }
        
        return name
    }

    async bankSetup(){     
        let params = JSON.parse(JSON.stringify(this.state.params)) 
        params.accountHolderType = params.accountHolderType.toLocaleLowerCase()
        try {
            this.setState({
                isLoading: true                
            })
            const token = await stripe.createTokenWithBankAccount(params)            
            this.linkBankAccount(token.tokenId)
        } catch (error) {
            this.setState({isLoading: false}, () => {
                let msg = error.message
                if(msg.substr(error.message.length - 1, 1) != ".") msg += "."                
                this.showDialogBox(msg)
            })
        }
    }

    linkBankAccount(token){
        localStorage.get('userInfo').then((userData) => {
            let user = JSON.parse(userData)
            let body = {
                id: user.id,
                legal_type: this.state.params.accountHolderType,
                stripe_token: token
            }
            // alert(JSON.stringify(body))
            Client.linkBankAccount(body)
                .end((err, res) => {
                    if(err){
                        this.setState({isLoading: false}, () => {
                            this.showDialogBox('There\'s a connection problem!\nTry later.')
                        })
                    }else{
                        if(res.body.status == 1){
                            this.setState({
                                isLoading: false
                            }, () => {
                                this.goToLinkingSuccessScreen()
                            })
                        }else{
                            this.setState({isLoading: false}, () =>{
                                this.showDialogBox(res.body.data)
                            })
                        }
                    }
                })
        })
    }

    goToLinkingSuccessScreen(){
        this.props.navigator.push({
            title: "",         
            screen: "mechaniku.LinkingSuccessScreen",                  
            navigatorStyle:{
                navBarHidden: true,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true 
            }
        })
    }

    setButtonDisable(){
        if(this.state.params.accountNumber != '' 
            && this.state.params.countryCode != '' 
            && this.state.params.currency != 'Select Currency' 
            && this.state.params.accountHolderType != 'Select Legal Type'
            && (this.state.params.routingNumber != '' 
            && this.state.params.routingNumber.length == 9)){
                return false
        }else{
            return true
        }
    }
   
    render() {
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View style={styles.container}> 
                    <View style={[styles.content, {}]}>
                        <View style={{paddingTop:42 * Metrics.scaleHeight, alignItems:'center', justifyContent:'center'}} >
                            <Image style={{width:160 * Metrics.scaleHeight, height: 143 * Metrics.scaleHeight}} source={Images.bankIcon} />
                        </View>

                        <View style={[
                                {
                                    paddingTop:60 * Metrics.scaleHeight, 
                                    borderBottomColor:'rgb(200, 199, 204)', 
                                    borderBottomWidth: 0.5, 
                                    width:Metrics.screenWidth
                                },
                                Platform.OS == 'android' &&
                                {paddingTop: 50 * Metrics.scaleHeight}
                            ]} />

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Account Name</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'Account Name'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                underlineColorAndroid={'transparent'}
                                
                                onChangeText={(text) => {
                                    let params = this.state.params
                                    params.accountHolderName = text
                                    this.setState({params: params})
                                }}
                                value={this.state.params.accountHolderName}
                                />                  
                        </View>     

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Legal Type</Text>                            
                            <ModalDropdown
                                defaultIndex={0}
                                options={LEGAL_TYPE}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                dropdownStyle={{
                                    height: (33 + StyleSheet.hairlineWidth) * (LEGAL_TYPE.length)
                                }}
                                onSelect={(idx, value) => {
                                    let params = this.state.params
                                    params.accountHolderType = value
                                    this.setState({params: params})                                   
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.state.params.accountHolderType}</Text>                           
                                </View>
                            </ModalDropdown> 
                            {
                                this.state.params.accountHolderType == 'Select Legal Type' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            } 
                        </View> 

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Account Number</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'Account Number'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                keyboardType={"numeric"}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    let params = this.state.params
                                    params.accountNumber = text
                                    this.setState({params: params})
                                }}
                                value={this.state.params.accountNumber}
                                /> 
                            {
                                this.state.params.accountNumber == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }    
                                                    
                        </View> 

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Routing Number</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder={'Routing Number'}
                                placeholderTextColor='rgb(200, 199, 204)'
                                keyboardType={"numeric"}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    let params = this.state.params
                                    params.routingNumber = text.toString()
                                    this.setState({params: params})
                                }}
                                value={this.state.params.routingNumber}
                                /> 
                            {
                                this.state.params.routingNumber.length != 9 &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                       
                        </View>

                        <View style={[styles.txtInputView, {}]} >
                            <Text style={styles.label}>Country</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['Select Country'].concat(this.getCountryNames())}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    if(value != 'Select Country'){
                                        let params = this.state.params
                                        params.countryCode = this.getCountryCode(value)
                                        this.setState({params: params})
                                    }else{
                                        let params = this.state.params
                                        params.countryCode = ''
                                        this.setState({params: params})
                                    }                                                                       
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.getCountryName()}</Text>                           
                                </View>
                            </ModalDropdown> 
                            {
                                this.state.params.countryCode == '' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                       
                        </View>

                        <View style={[styles.txtInputView, {borderBottomWidth: 0}]} >
                            <Text style={styles.label}>Currency</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['Select Currency'].concat(currencies)}
                                style={styles.filterButtonContainerStyle}                           
                                textStyle={styles.filterButton}
                                
                                onSelect={(idx, value) => {
                                    let params = this.state.params
                                    params.currency = value
                                    this.setState({params: params})                                   
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.state.params.currency}</Text>                           
                                </View>
                            </ModalDropdown> 
                            {
                                this.state.params.currency == 'Select Currency' &&
                                <View style={styles.validation}>
                                    <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                </View>  
                            }                       
                        </View>
                        
                        <View style={{paddingBottom:20 * Metrics.scaleHeight, borderTopColor:'rgb(200, 199, 204)', borderTopWidth: 0.5, width:Metrics.screenWidth}} />

                        <Button 
                            style={styles.button}
                            isLoading={this.state.isLoading}
                            activityIndicatorColor="#ffffff"
                            isDisabled={this.setButtonDisable()}
                            onPress={() => {
                                this.bankSetup()
                                // this.goToLinkingSuccessScreen()
                                // this.props.navigator.pop()
                            }}
                            >
                            <Text style={{fontSize:16, color:'#ffffff'}}>Link This Account</Text>
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
    button: {
        marginHorizontal: 22,
        backgroundColor:'rgb(61, 59, 238)',
        height:50 * Metrics.scaleHeight,   
        borderWidth:0, 
        borderRadius:5     
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
        width:'52%',
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