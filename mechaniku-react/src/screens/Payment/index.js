'use strict'

import React, { Component } from 'react'
import {Navigation} from 'react-native-navigation';
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
    Platform,
    Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DialogBox from 'react-native-dialogbox'
import stripe from 'tipsi-stripe'
import { TextInputMask } from 'react-native-masked-text'


import { Metrics, Images } from '../../themes'
import { Client, localStorage } from '../../services';

export default class PaymentScreen extends Component{   
    constructor(props){
        super(props)
        this.state = {
            expireDate:'',
            params: {
                number: '',
                expMonth: '',
                expYear: '',
                cvc: '',
                name: '',
            },
            loading: false
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

    async stripePay(){
        const { selectOption } = this.props
        let params = this.state.params
        let arr = this.state.expireDate.split("/")
      
        params.expMonth = parseInt(arr[0])
        params.expYear = parseInt(arr[1])
        
        let money = ''
        if(selectOption == 'standard') money = '60.00'
        else money = '80.00'

        try {
            const token = await stripe.createTokenWithCard(params)
            this.createAppointment(money, token.tokenId)
        } catch (error){
            this.setState({loading: false}, () => {
                let msg = error.message
                if(msg.substr(error.message.length - 1, 1) != ".") msg += "."                
                this.showDialogBox(msg)
            })
        } 
    }

    createAppointment(price, token){
        const { data } = this.props 

        let body = JSON.parse(JSON.stringify(data))
        body.stripe_token = token
        body.price = price
           
        Client.createAppointment(body)
            .end((err, res) => {
                if(err){
                    this.setState({loading: false})
                    console.log(err)
                }else{
                    if(res.body.status == 1){
                        localStorage.set('curStatus', 'pending')    
                        // alert(JSON.stringify(res.body.data))                    
                        this.setState({loading: false}, () => {
                            this.goToAppointmentPendingScreen()
                        })
                        
                    }else{
                        this.setState({loading: false})
                        console.log(res.body)
                    }
                }
            })
        
    }
    
    goToAppointmentPendingScreen(){ 
        Navigation.startSingleScreenApp({
            screen:{
                title: "Appointment Pending",   
                screen: "mechaniku.AppointmentPendingScreen", 
                navigatorStyle: {
                    drawUnderNavBar: false,
                    navBarHidden: false,
                    navBarBackgroundColor:'rgba(248, 248, 248, 0.82)',
                    navBarTitleTextCentered:true
                }
            }
        })
        
    }

    checkExpireDate(){
        if(this.state.expireDate.length == 5){
            let arr = this.state.expireDate.split("/");
            if(parseInt(arr[0]) > 1 && parseInt(arr[0]) < 13){
                let year = new Date().getFullYear().toString().substr(2, 2)
                let month = new Date().getMonth() + 1
                if(parseInt(arr[1]) == parseInt(year)){
                    if(parseInt(arr[0]) > month){
                        return true
                    }else return false
                }else if(parseInt(arr[1]) > parseInt(year)){
                    return true
                }else return false
            }else{
                return false
            }
        }else{
            return false
        }        
    }

    checkCVC(){
        let count = 0
        for(var i = 0 ; i < this.state.params.cvc.length ; i++){
            if(this.state.params.cvc.charAt(i) == ' '){
                count++
            }
        }
        if(this.state.params.cvc != '' && count == this.state.params.cvc.length){
            return false
        }else if(this.state.params.cvc.length < 3 || this.state.params.cvc.length > 4){
            return false
        }else if(this.state.params.cvc == ''){
            return false
        }else{
            return true
        }
    }

    checkVerification(){
        if(this.state.params.number != '' 
            && this.state.params.number.length == 16 
            && this.checkCVC()
            && this.checkExpireDate()){
            return true
        }else 
            return false
    }

    render() {
        const { selectOption } = this.props
        let money = ''
        if(selectOption == 'standard') money = 60
        else money = 80
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View style={styles.container}> 
                    <Image style={{width: Metrics.screenWidth, height: 142 * Metrics.scaleWidth}} source={Images.paymentbannerIcon} />
                    <View style={{width:'100%', height:97 * Metrics.scaleHeight, justifyContent:'center', borderBottomColor:'rgb(200, 199, 204)', borderBottomWidth:0.5}}>
                        <Text style={{fontSize:34, color:'rgb(61, 59, 238)', fontWeight:'bold', textAlign:'center'}} >${money}</Text>
                        <Text style={{fontSize:17, color:'rgba(2, 6, 33, 0.4)', textAlign:'center'}}>Total Amount</Text>
                    </View>
                    <View style={[styles.txtInputView, {}]} >
                        <Text style={styles.label}>Name</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder={'Name'}
                            placeholderTextColor='rgb(156, 155, 155)'
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                let params = this.state.params
                                params.name = text
                                this.setState({params: params})
                            }}
                            value={this.state.params.name}
                            />                                             
                    </View>

                    <View style={[styles.txtInputView, {}]} >
                        <Text style={styles.label}>Card Number</Text>
                        <TextInput 
                            style={[styles.input, {width:'52%'}]}
                            keyboardType={"numeric"}
                            placeholder={'4242424242424242'}
                            placeholderTextColor='rgb(156, 155, 155)'
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                let params = this.state.params
                                params.number = text
                                this.setState({params: params})
                            }}
                            value={this.state.params.number}
                            />  
                        {
                            this.state.params.number == '' || this.state.params.number.length != 16 &&
                            <View style={[styles.validation, {width:'5%'}]}>
                                <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                            </View>  
                        }  
                        <Image style={{width: 22 * Metrics.scaleHeight, height: 13 * Metrics.scaleHeight}} source={Images.mcLogoIcon}/>                    
                    </View>

                    <View style={[styles.txtInputView, {}]} >
                        <Text style={styles.label}>Expire Date</Text>                        
                        <TextInputMask
                            style={styles.input}
                            type={'datetime'}
                            placeholder={'MM/YY'}
                            options={{
                                format: 'MM/YY'
                            }}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                this.setState({expireDate:text})
                            }} 
                            value={this.state.expireDate}
                            />
                        {
                            !this.checkExpireDate() &&
                            <View style={styles.validation}>
                                <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                            </View>  
                        }                     
                    </View>

                    <View style={[styles.txtInputView, {}]} >
                        <Text style={styles.label}>Security Code</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder={'Security Code'}
                            placeholderTextColor='rgb(156, 155, 155)'
                            underlineColorAndroid={'transparent'}
                            keyboardType={"numeric"}
                            onChangeText={(text) => {
                                let params = this.state.params
                                params.cvc = text
                                this.setState({params: params})
                            }}
                            value={this.state.params.cvc}
                            />           
                        {
                            !this.checkCVC() &&
                            <View style={styles.validation}>
                                <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                            </View>  
                        }              
                    </View>

                    <Button 
                        style={styles.confirmButton}
                        isDisabled={!this.checkVerification()}
                        isLoading={this.state.loading}
                        activityIndicatorColor="#ffffff"
                        keyboardType={"numeric"}
                        onPress={() => {
                            this.setState({loading: true}, () => {
                                this.stripePay()
                            })                            
                        }}
                        >
                        <View style={{flexDirection:'row', width:'100%', justifyContent:'center'}}>
                            <Image style={{width: 15 * Metrics.scaleHeight, height: 20 * Metrics.scaleHeight}} source={Images.lockIcon} />
                            <Text style={{fontSize:16, color:'#ffffff', paddingLeft: 10}}>Pay ${money}.00</Text>
                        </View>                        
                    </Button>
                    <DialogBox ref={dialogbox => {this.dialogbox = dialogbox}} />  
                </View>
            </KeyboardAwareScrollView>
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
        marginHorizontal:19 * Metrics.scaleWidth,
        height: 475 * Metrics.scaleHeight,
        borderRadius:10
    },     
    confirmButton:{        
        marginTop:109 * Metrics.scaleHeight,
        marginBottom:24 * Metrics.scaleHeight,
        marginHorizontal:38,
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
        width:'35%',
        paddingLeft:16,
        fontSize:17,
        color:'rgb(114, 129, 145)'
    },
    input:{
        width:'57%',
        paddingRight:16,
        fontSize:17,
        color:'rgba(2, 6, 33, 0.9)',
    }, 
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
    },
})