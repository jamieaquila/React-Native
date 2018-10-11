'use strict'
import React, { Component} from 'react'

import {
    Text,
    View,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    ScrollView,
    Switch,
    TextInput,
    Alert,
    ActivityIndicator
  } from 'react-native'
import Image from 'react-native-image-progress'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TagInput from 'react-native-tag-input';
import ModalDropdown from 'react-native-modal-dropdown'

import { Client, localStorage, countryNames } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { startMainTab } from '../../../app'

export default class AddEditCustomerScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            customer:{
                name:'',
                company:'',
                email:'',
                topClient: false,
                phoneNumber:'',
                mobileNumber:'',
                tags:[],
                address:'',
                city:'',
                state:'',
                memo:''
            },
            newCustomerCustomFields:null,
            customerCustomFields:null,
            autocomplete:{
                company:{
                    disabled:false,
                    companies:[]
                },
                state:{
                    value:'',
                    disabled: false,
                    states:[]
                }
            },      
            customerId: this.props.customerId,
            emptyName:false,
            emptyEmail: false,    
           
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'close') {
            this.showDialogBox()
        }else if(event.id === 'save'){
            if(this.state.customerId)
                this.updateCustomer()
            else
                this.saveNewCustomer()
        }
    }
    
    showDialogBox(){    
        Alert.alert(
          Locale.t('CONFIRM_DISCARD_TITLE'),
          Locale.t('CONFIRM_DISCARD_TEXT'),
          [
            {text: Locale.t('CONFIRM_DISCARD_NO'), onPress: () => {
    
             }},
            {text: Locale.t('CONFIRM_DISCARD_YES'), onPress: () => {
                this.props.navigator.pop();
              
              }},
          ],
          { cancelable: false }
        )
    }

    componentDidMount(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getUpdates(bearer, clientId)
                    .then((res) => {
                        if(res == 'OK'){
                            setTimeout(() => {
                                this.getGlobalData()
                            }, 500)
                            
                        }                
                    })
                    .catch((err) => {
                        this.getGlobalData() 
                })
            })
        })
    }  

    getGlobalData(){    
        let customerCustomFields = GlobalVals.customerCustomFields;
        let newCustomerCustomFields = {}
        if(customerCustomFields){
            for(var i = 0 ; i < customerCustomFields.length ; i++){
                if(customerCustomFields[i].type == 'TEXT')
                    newCustomerCustomFields[customerCustomFields[i].name] = ""
                else 
                    newCustomerCustomFields[customerCustomFields[i].name] = "..."
            }
        }
        
        if(this.state.customerId){
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.getCustomer(bearer, clientId, this.state.customerId)
                        .end((err, res)=>{
                            if(err){
                                this.setState({loading: false})
                            }else{
                                let customer = res.body
                                let autocomplete = this.state.autocomplete
                                if(res.body.state != null && res.body.state != ""){
                                    let match = countryNames.filter(x => x.code == res.body.state)
                                    if(match.length > 0){
                                        customer.state = match[0].code
                                        autocomplete.state.value = match[0].value
                                        autocomplete.state.disabled = true;
                                        autocomplete.state.states = [];
                                    }
                                }

                                if(typeof res.body.customFields !== 'undefined' && res.body.customFields != null){
                                    for (var key in res.body.customFields) {
                                        let field = customerCustomFields.filter(el => el.name == key)[0]
                                        if(field.type == 'LINKED_COMBO'){
                                            var valueToSelect = field.linkedValues.filter(e=> e.value == res.body.customFields[key])[0]
                                            if(valueToSelect == null || valueToSelect == "")
                                                newCustomerCustomFields[key] = "..."
                                            else
                                                newCustomerCustomFields[key] = valueToSelect.value
                                        }else if(field.type == 'COMBO'){
                                            if(res.body.customFields[key] == null || res.body.customFields[key] == "")
                                                newCustomerCustomFields[key] = "..."
                                            else
                                                newCustomerCustomFields[key] = res.body.customFields[key];
                                        }else{
                                            newCustomerCustomFields[key] = res.body.customFields[key];
                                        }
                                    }
                                }

                                if(customer.tags == null)
                                    customer.tags = []
                                
                                if(res.body.company != null && res.body.company != ""){
                                    autocomplete.company.disabled = true
                                }

                                this.setState({customer, customerCustomFields, newCustomerCustomFields, autocomplete, loading: false})
                            }
                        })
                })
            })
        }else{
            this.setState({customerCustomFields, newCustomerCustomFields, loading: false})
        }
        
    }

    getCurrnetLanguage(obj){
        if(GlobalVals.language == 'en'){
            return obj.en
        }else if(GlobalVals.language == 'fr'){
            if(obj.fr) return obj.fr
            else return obj.en            
        }else if(GlobalVals.language == 'it'){
            if(obj.it) return obj.it
            else return obj.en 
        }else if(GlobalVals.language == 'sp'){
            if(obj.sp) return obj.sp
            else return obj.en 
        }else{
            return obj.en
        }
    }

    getLinkedValues(item){
        let arr = [];
        arr.push('...');       
        let fieldArr = item.linkedValues.filter(x => x.parentKey == this.state.newCustomerCustomFields[item.linkedField])
        for(var i = 0 ; i < fieldArr.length ; i++)
            arr.push(fieldArr[i].value)
        return arr
    }

    checkEmailValidation(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    saveNewCustomer(){
        if(this.state.customer.name != '' && this.state.customer.email != '' && this.checkEmailValidation(his.state.customer.email)){
            let newCustomer = {}
            newCustomer.name = this.state.customer.name
            newCustomer.email = this.state.customer.email
            newCustomer.topClient = this.state.customer.topClient
            newCustomer.tags = this.state.customer.tags;

            if(this.state.customer.company != '') newCustomer.company = this.state.customer.company
            if(this.state.customer.phoneNumber != '') newCustomer.phoneNumber = this.state.customer.phoneNumber
            if(this.state.customer.mobileNumber != '') newCustomer.mobileNumber = this.state.customer.mobileNumber
            if(this.state.customer.address != '') newCustomer.address = this.state.customer.address
            if(this.state.customer.city != '') newCustomer.city = this.state.customer.city
            if(this.state.customer.state != '') newCustomer.state = this.state.customer.state
            if(this.state.customer.memo != '') newCustomer.memo = this.state.customer.memo

            let customFields = {}
            for (var key in this.state.newCustomerCustomFields) {
                if(this.state.newCustomerCustomFields[key] != '' && this.state.newCustomerCustomFields[key] != '...'){
                    customFields[key] = this.state.newCustomerCustomFields[key]
                }
            }
            newCustomer.customFields = customFields;
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId)=>{
                    Client.createCustomer(bearer, clientId, newCustomer)
                        .end((err, res) => {
                            if(err){

                            }else{
                                setTimeout(()=>{                                                                         
                                    startMainTab(1)                                                                            
                                }, 500)
                            }
                        })
                })
            })
        }else{
            let emptyEmail = this.state.emptyEmail
            let emptyName = this.state.emptyName
            if(this.state.customer.name == '')
                emptyName = true;

            if(this.state.customer.email == '' || !this.checkEmailValidation(this.state.customer.email))
                emptyEmail = true;
            
            this.setState({
                emptyName,
                emptyEmail
            }, () => {
                setTimeout(() => {
                    this.setState({
                        emptyName: false,
                        emptyEmail: false
                    })
                }, 2000)
            })
                
        }
        
    }

    updateCustomer(){
        if(this.state.customer.name != '' && this.state.customer.email != ''){
            let customer = this.state.customer
            let customFields = {}
            for (var key in this.state.newCustomerCustomFields) {
                if(this.state.newCustomerCustomFields[key] != '' && this.state.newCustomerCustomFields[key] != '...'){
                    customFields[key] = this.state.newCustomerCustomFields[key]
                }
            }
            customer.customFields = customFields;

            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId)=>{
                    Client.updateCustomer(bearer, clientId, customer)
                        .end((err, res) => {
                            if(err){

                            }else{
                                if(res.body.id){
                                    // console.log(res.body)
                                    // this.props.navigator.pop()
                                    setTimeout(()=>{                                                                         
                                        startMainTab(1)                                                                            
                                    }, 500)
                                }                                
                            }
                        })
                })
            })
        }
    }

    companyAutocomplete(text){
        if(text.length > 2){
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.getSearchCompany(bearer, clientId, text)
                        .end((err, res) => {
                            if(res.body){
                                let autocomplete = this.state.autocomplete
                                autocomplete.company.companies = res.body
                                this.setState({autocomplete})
                            }
                        })
                })
            })
        }
    }

    stateAutocomplete(text){
        if(text.length > 2){
            let matches = countryNames.filter(x => x.value.toLowerCase().indexOf(text.toLowerCase()) !== -1)
            if(matches){
                let autocomplete = this.state.autocomplete
                autocomplete.state.states = matches
                this.setState({autocomplete})
            }
        }
    }

    renderSearchCompanies(){
        let companies = this.state.autocomplete.company.companies.map((company, i) => {
            return (
                <TouchableOpacity style={styles.autocompleteView} key={i} onPress={() => {
                    let customer = this.state.customer;
                    customer.company = company.name;
                    let autocomplete = this.state.autocomplete;
                    autocomplete.company.disabled = true;
                    autocomplete.company.companies = [];
                    this.setState({customer, autocomplete})
                }}>
                    <Text style={{fontSize:14, color: 'rgb(128, 128, 128)'}}>{company.name}</Text>
                </TouchableOpacity>
            )
        });
        return companies
    }

    renderSearchStates(){
        let states = this.state.autocomplete.state.states.map((state, i) => {
            return (
                <TouchableOpacity style={styles.autocompleteView} key={i} onPress={() => {
                    let customer = this.state.customer;
                    customer.state = state.code;
                    let autocomplete = this.state.autocomplete;
                    autocomplete.state.value = state.value
                    autocomplete.state.disabled = true;
                    autocomplete.state.states = [];
                    this.setState({customer, autocomplete})
                }}>
                    <Text style={{fontSize:14, color: 'rgb(128, 128, 128)'}}>{state.value}</Text>
                </TouchableOpacity>
            )
        });
        return states
    }

    renderCustomerCustomField(){
        let customerCustomFieldArr = this.state.customerCustomFields.map((item, i) => {
            return (
                item.type == 'TEXT' ?
                    <View key={i} style={styles.dropdownView}>
                        <Text style={[styles.labelText, {width:'30%'}]}>{item.required ? (this.getCurrnetLanguage(item.labels) ? this.getCurrnetLanguage(item.labels) : item.name) + '*' : (this.getCurrnetLanguage(item.labels) ? this.getCurrnetLanguage(item.labels) : item.name) }</Text>
                        <TextInput 
                            style={[styles.input, {}]}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => {
                                let newCustomerCustomFields = this.state.newCustomerCustomFields
                                newCustomerCustomFields[item.name] = text
                                this.setState({newCustomerCustomFields})
                            }}
                            value={this.state.newCustomerCustomFields[item.name]}
                            />   
                    </View>                      
                : 
                    item.type == 'COMBO' ?
                        <View style={styles.dropdownView} key={i}>
                            <Text style={styles.labelText}>{item.required ? (this.getCurrnetLanguage(item.labels) ? this.getCurrnetLanguage(item.labels) : item.name) + '*' : (this.getCurrnetLanguage(item.labels) ? this.getCurrnetLanguage(item.labels) : item.name)}</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['...'].concat(item.values)}
                                style={styles.filterButtonContainerStyle}
                                // dropdownStyle={
                                //     item.values.length + 1 < 5 ? {                                
                                //         height: (33 + StyleSheet.hairlineWidth) * (item.values.length + 1)                                
                                //     }
                                //     : {}
                                // }
                                textStyle={styles.filterButton}
                                dropdownTextStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let newCustomerCustomFields = this.state.newCustomerCustomFields
                                    newCustomerCustomFields[item.name] = value
                                    this.setState({newCustomerCustomFields})
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.state.newCustomerCustomFields[item.name]}</Text>
                                    <Icon style={styles.filterDropdownIcon}
                                        name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>
                    : 
                        <View style={styles.dropdownView} key={i}>
                            <Text style={styles.labelText}>{item.required ? (this.getCurrnetLanguage(item.labels) ? this.getCurrnetLanguage(item.labels) : item.name) + '*' : (this.getCurrnetLanguage(item.labels) ? this.getCurrnetLanguage(item.labels) : item.name)}</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={this.getLinkedValues(item)}
                                style={styles.filterButtonContainerStyle}
                                // dropdownStyle={
                                //     this.getLinkedValues(item).length < 5 ? {                                
                                //         height: (33 + StyleSheet.hairlineWidth) * (this.getLinkedValues(item).length + 1)                                
                                //     }
                                //     : {}
                                // }
                                textStyle={styles.filterButton}
                                dropdownTextStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let newCustomerCustomFields = this.state.newCustomerCustomFields
                                    newCustomerCustomFields[item.name] = value
                                    this.setState({newCustomerCustomFields})
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.state.newCustomerCustomFields[item.name]}</Text>
                                    <Icon style={styles.filterDropdownIcon}
                                        name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>
            )
        })
        return customerCustomFieldArr
    }

    render(){
        return(            
            <View style={styles.container}>   
            {
                !this.state.loading ?
                <KeyboardAwareScrollView ref="scroll">
                    <View style={styles.content}>
                        {/* Full Name */}
                        <View style={styles.dropdownView}>
                            <View style={{flexDirection:'row', width:'30%', paddingLeft:20}}>
                                <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('CUSTOMER_NEW.NAME')}</Text>
                                <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                            </View>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let customer = this.state.customer
                                    customer.name = text;
                                    this.setState({customer})
                                }}
                                value={this.state.customer.name}
                            />   
                            {
                                this.state.emptyName &&
                                <View style={styles.emptyField}>
                                    <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                </View>
                            }  
                        </View>                         
                        {/* Company */}
                        {
                            this.state.autocomplete.company.disabled ?
                                <View style={styles.dropdownView}>
                                    <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('CUSTOMER_NEW.COMPANY')}</Text>                                    
                                    <Text style={[styles.buttonText, {width:'60%'}]}>{this.state.customer.company}</Text>
                                    <TouchableOpacity style={{width:'10%', alignItems:'flex-end'}} onPress={() => {
                                        let customer = this.state.customer;
                                        customer.company = '';
                                        let autocomplete = this.state.autocomplete;
                                        autocomplete.company.disabled = false;
                                        autocomplete.company.companies = [];
                                        this.setState({customer, autocomplete})
                                    }}>
                                        <Ionicons name='ios-remove-circle-outline' size={20}/>
                                    </TouchableOpacity>
                                </View>
                                
                            : 
                                <View style={styles.dropdownView}>
                                    <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('CUSTOMER_NEW.COMPANY')}</Text>
                                    <TextInput 
                                        style={styles.input}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(text) => {
                                            let customer = this.state.customer
                                            customer.company = text
                                            this.setState({customer}, ()=>{
                                                this.companyAutocomplete(text)
                                            }) 
                                            
                                        }}
                                        value={this.state.customer.company}
                                        />   
                                </View>
                        }
                        {/* search companies */}
                        {
                            this.state.autocomplete.company.companies.length > 0 &&
                                this.renderSearchCompanies()
                        }                         
                        {/* Email */}
                        <View style={styles.dropdownView}>
                            <View style={{flexDirection:'row', width:'30%', paddingLeft:20}}>
                                <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('CUSTOMER_NEW.EMAIL')}</Text>
                                <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                            </View>
                            <TextInput 
                                style={[styles.input, this.state.email == '' ? {width:'68%'} : {width:'60%'}]}
                                underlineColorAndroid="transparent"
                                keyboardType={'email-address'}
                                autoCapitalize = 'none'
                                onChangeText={(text) => {
                                    let customer = this.state.customer
                                    customer.email = text;
                                    this.setState({customer})
                                }}
                                value={this.state.customer.email}
                            />   
                            {
                                this.state.customer.email != "" && this.checkEmailValidation(this.state.customer.email) == false &&
                                    <View style={styles.validation}>
                                        <Icon style={{color:'red'}} name="exclamation-circle" size={18} />
                                    </View>                           
                            }  
                            {
                                this.state.emptyEmail &&
                                <View style={styles.emptyField}>
                                    <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                </View>
                            }
                            
                        </View>                         
                        {/* Top client */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'40%'}]}>{Locale.t('CUSTOMER_NEW.TOPCLIENT')}</Text>
                            <View style={{alignItems:'flex-end', justifyContent:'flex-end', width:'58%'}}>
                                <Switch
                                    onValueChange={(value) => {    
                                        let customer = this.state.customer
                                        customer.topClient = value
                                        this.setState({customer})                    
                                        }}
                                    value={this.state.customer.topClient} />
                            </View>
                        </View>
                        {/* Phone */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('CUSTOMER_NEW.PHONE')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                let customer = this.state.customer
                                customer.phoneNumber = text;
                                this.setState({customer})
                                }}
                                value={this.state.customer.phoneNumber}
                                />   
                        </View>                             
                        {/* Mobile Phone */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'35%'}]}>{Locale.t('CUSTOMER_NEW.MOBILE')}</Text>
                            <TextInput 
                                style={[styles.input, {width:'63%'}]}
                                underlineColorAndroid="transparent"
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                let customer = this.state.customer
                                customer.mobileNumber = text;
                                this.setState({customer})
                                }}
                                value={this.state.customer.mobileNumber}
                                />   
                        </View>                             
                        {/* Tags */}
                        <View style={{
                            paddingHorizontal:20, 
                            borderBottomColor:'rgb(228, 228, 228)', 
                            borderBottomWidth:1}}>
                            <TagInput
                                inputColor={'rgb(128, 128, 128)'}
                                inputProps={{
                                    placeholder:Locale.t('ADD_A_TAG')
                                }}
                                value={this.state.customer.tags}
                                onChange={(tags) => {
                                    let customer = this.state.customer
                                    customer.tags = tags
                                    this.setState({customer})
                                }}
                                labelExtractor={(tag) => tag}
                                maxHeight={100}
                                />
                        </View> 
                        {
                            this.state.customerCustomFields &&
                            this.renderCustomerCustomField()
                        }        
                        {/* Address */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('CUSTOMER_NEW.ADDRESS')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                let customer = this.state.customer
                                customer.address = text;
                                this.setState({customer})
                                }}
                                value={this.state.customer.address}
                                />   
                        </View>                           
                        {/* City */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('CUSTOMER_NEW.CITY')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                let customer = this.state.customer
                                customer.city = text;
                                this.setState({customer})
                                }}
                                value={this.state.customer.city}
                                />   
                        </View>         

                        {/* Country */}
                        {
                            this.state.autocomplete.state.disabled ?
                                <View style={styles.dropdownView}>
                                    <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('CUSTOMER_NEW.STATE')}</Text>                                    
                                    <Text style={[styles.buttonText, {width:'60%'}]}>{this.state.autocomplete.state.value}</Text>
                                    <TouchableOpacity style={{width:'10%', alignItems:'flex-end'}} onPress={() => {
                                        let customer = this.state.customer;
                                        let autocomplete = this.state.autocomplete
                                        customer.state = ''
                                        autocomplete.state.value = ''
                                        autocomplete.state.disabled = false
                                        autocomplete.state.states = [];
                                        this.setState({customer, autocomplete})
                                    }}>
                                        <Ionicons name='ios-remove-circle-outline' size={20}/>
                                    </TouchableOpacity>
                                </View>
                                
                            : 
                                <View style={styles.dropdownView}>
                                    <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('CUSTOMER_NEW.STATE')}</Text>
                                    <TextInput 
                                        style={styles.input}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(text) => {                                        
                                            let autocomplete = this.state.autocomplete
                                            autocomplete.state.value = text
                                            this.setState({autocomplete}, ()=>{
                                                this.stateAutocomplete(text)
                                            })

                                        }}
                                        value={this.state.autocomplete.state.value}
                                        />   
                                </View>
                        }
                        {/* search countries */}
                        {
                            this.state.autocomplete.state.states.length > 0 &&
                                this.renderSearchStates()
                        }                 
                        {/* Memo */}                        
                        <View style={[styles.dropdownView, {borderBottomWidth:0}]}>
                            <Text style={[styles.labelText, {}]}>{Locale.t('CUSTOMER_NEW.MEMO')}</Text>                             
                        </View>      
                        <View style={{backgroundColor:'#ffffff', marginTop:13, marginHorizontal:12, marginBottom:20, borderColor:'rgba(0,0,0,0.2)', borderWidth:1,}}>
                            <TextInput 
                                multiline = {true}
                                numberOfLines = {4}
                                underlineColorAndroid="transparent"
                                style={{textAlignVertical: "top", height:120, width:'100%', fontFamily:'Helvetica Neue', fontSize: 16, color: 'rgb(77, 77, 77)',backgroundColor:'#ffffff'}}
                                onChangeText={(text) => {
                                    let customer = this.state.customer
                                    customer.memo = text;
                                    this.setState({customer})
                                }}
                                value={this.state.customer.memo}
                            />  
                        </View>
                        
                    </View>
                </KeyboardAwareScrollView>
                :
                <ActivityIndicator size="large" color="#ff0000" />
            }
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal:6.5
    },
    content:{
        width:"100%",
        backgroundColor:'white',
        marginTop:11,
        marginBottom:11,       
    },   
    dropdownView:{
        flex: 1,
        height:44 * Metrics.scaleHeight,
        width:'100%',
        flexDirection:'row', 
        alignItems: 'center',
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1,
    },    
    labelText:{
        fontFamily:'Helvetica Neue',
        paddingLeft:20,        
        fontSize:16, 
        color: 'rgb(77, 77, 77)'
    },
    filterButtonContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
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
        // flex: 1,
        fontFamily:'Helvetica Neue',
        fontSize: 16,
        color: 'rgb(128, 128, 128)',
    },

    filterDropdownIcon: {
        marginLeft: 5,
        color: 'rgb(79, 136, 213)'
    },
    buttonText: {
        fontFamily:'Helvetica Neue',
        fontSize: 16,
        fontWeight: '300',
        color: 'rgb(77, 77, 77)',
    },
    input:{
        width:'68%',
        fontFamily:'Helvetica Neue',
		fontSize: 16,
		color: 'rgb(77, 77, 77)',
    },
    autocompleteView: {
        paddingHorizontal:20, 
        justifyContent: 'center',
        height:35 * Metrics.scaleHeight,
        backgroundColor:'#efefef',
        borderBottomColor:'rgb(228, 228, 228)', 
        borderBottomWidth:1
    },
    emptyField:{
        position:'absolute',
        top:5.5 * Metrics.scaleHeight,
        right:3,
    },
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
        backgroundColor:'#ffffff'
    },

})