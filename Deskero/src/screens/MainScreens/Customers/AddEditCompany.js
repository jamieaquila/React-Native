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
    ActivityIndicator,
    Image
  } from 'react-native'
// import Image from 'react-native-image-progress'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TagInput from 'react-native-tag-input';

import { Client, localStorage, countryNames } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { startMainTab } from '../../../app'

export default class AddEditCompanyScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,              
            company:{
                company:'',
                vatNumber:'',
                phoneNumber:'',
                faxNumber:'',
                address:'',
                postalNumber:'',
                city:'',
                province:'',
                state:'',
                note:''
            },
            autocomplete:{                
                state:{
                    value:'',
                    disabled: false,
                    states:[]
                }
            },   
            companyId:this.props.companyId ,
            emptyCompany: false,
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'close') {
            this.showDialogBox()
        }else if(event.id === 'save'){
            if(this.state.companyId){
                this.updateCompany()
            }else{
                this.saveNewCompany()
            }
        }
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
        if(this.state.companyId){
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.getCompany(bearer, clientId, this.state.companyId)
                        .end((err, res) => {
                            // console.log(res.body)
                            let company = res.body
                            let autocomplete = this.state.autocomplete
                            if(res.body.state != null && res.body.state != ""){
                                let match = countryNames.filter(x => x.code == res.body.state)
                                if(match.length > 0){
                                    company.state = match[0].code
                                    autocomplete.state.value = match[0].value
                                    autocomplete.state.disabled = true;
                                    autocomplete.state.states = [];
                                }
                            }
                            
                            this.setState({company, loading: false})
                        })
                })
            })
        }else{
            this.setState({loading: false})
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

    saveNewCompany(){
        if(this.state.company.company != ''){
            let company = {}
            for(var key in this.state.company){
                if(this.state.company[key] != "")
                    company[key] = this.state.company[key]
            }
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.createCompany(bearer, clientId, company)
                        .end((err, res) => {
                            if(res.body && res.body.id != ""){
                                // this.props.navigator.pop()
                                setTimeout(()=>{                                                                         
                                    startMainTab(1)                                                                            
                                }, 500)
                            }
                        })
                })
            })

        }else{
            this.setState({emptyCompany: true}, () => {
                setTimeout(() => {
                    this.setState({emptyCompany: false})
                }, 2000)
            })
        }
    }
    
    updateCompany(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.updateCompany(bearer, clientId, this.state.company)
                    .end((err, res) => {
                        if(err){

                        } else{
                            if(res.body.id){
                                // this.props.navigator.pop()
                                setTimeout(()=>{                      
                                    startMainTab(1)                        
                                }, 700)
                            }
                        }
                        
                    })
            })
        })
    }

    stateAutocomplete(text){
        if(text.length > 3){
            let matches = countryNames.filter(x => x.value.toLowerCase().indexOf(text.toLowerCase()) !== -1)
            if(matches){
                let autocomplete = this.state.autocomplete
                autocomplete.state.states = matches
                this.setState({autocomplete})
            }
        }
    }
    
    renderSearchStates(){
        let states = this.state.autocomplete.state.states.map((state, i) => {
            return (
                <TouchableOpacity style={styles.autocompleteView} key={i} onPress={() => {
                    let company = this.state.company;
                    company.state = state.code;
                    let autocomplete = this.state.autocomplete;
                    autocomplete.state.value = state.value
                    autocomplete.state.disabled = true;
                    autocomplete.state.states = [];
                    this.setState({company, autocomplete})
                }}>
                    <Text style={{fontSize:14, color: 'rgb(128, 128, 128)'}}>{state.value}</Text>
                </TouchableOpacity>
            )
        });
        return states
    }

    render(){
        return(            
            <View style={styles.container}>   
            {
                !this.state.loading ?
                <KeyboardAwareScrollView ref="scroll">
                    <View style={styles.content}>
                        {/* Company Name */}
                        <View style={styles.dropdownView}>
                            <View style={{flexDirection:'row', width:'30%', paddingLeft:20}}>
                                <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('COMPANY_NEW.NAME')}</Text>
                                <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                            </View>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.company = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.company}
                                />   
                            {
                                this.state.emptyCompany &&
                                    <View style={styles.emptyField}>
                                        <Image style={{width: 161 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                    </View>
                            } 
                        </View>      
                        {/* VAT number */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.TAXID')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.vatNumber = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.vatNumber}
                                />   
                        </View>      
                        {/* Phone number */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.PHONE')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.phoneNumber = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.phoneNumber}
                                />   
                        </View>       
                        {/* Fax number */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.FAX')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.faxNumber = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.faxNumber}
                                />   
                        </View>        
                        {/* Address */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.ADDRESS')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.address = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.address}
                                />   
                        </View>      
                        {/* Postal number */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.POSTAL_NUMBER')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.postalNumber = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.postalNumber}
                                />   
                        </View>  
                        {/* City */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.CITY')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.city = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.city}
                                />   
                        </View>  
                        {/* Province */}
                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.STATE')}</Text>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.province = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.province}
                                />   
                        </View> 
                        {/* Country */}
                        {
                            this.state.autocomplete.state.disabled ?
                                <View style={styles.dropdownView}>
                                    <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.COUNTRY')}</Text>                                    
                                    <Text style={[styles.buttonText, {width:'60%'}]}>{this.state.autocomplete.state.value}</Text>
                                    <TouchableOpacity style={{width:'10%', alignItems:'flex-end'}} onPress={() => {
                                        let company = this.state.company;
                                        let autocomplete = this.state.autocomplete
                                        company.state = ''
                                        autocomplete.state.value = ''
                                        autocomplete.state.disabled = false
                                        autocomplete.state.states = [];
                                        this.setState({company, autocomplete})
                                    }}>
                                        <Ionicons name='ios-remove-circle-outline' size={20}/>
                                    </TouchableOpacity>
                                </View>
                                
                            : 
                                <View style={styles.dropdownView}>
                                    <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('COMPANY_NEW.COUNTRY')}</Text>
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
                            <Text style={[styles.labelText, {}]}>{Locale.t('COMPANY_NEW.MEMO')}</Text>                             
                        </View>      
                        <View style={{backgroundColor:'#ffffff', marginTop:13, marginHorizontal:12, marginBottom:20, borderColor:'rgba(0,0,0,0.2)', borderWidth:1}}>
                            <TextInput 
                                multiline = {true}
                                numberOfLines = {4}
                                underlineColorAndroid="transparent"
                                style={[styles.input, {textAlignVertical: "top", height:120, width:'100%', backgroundColor:'#ffffff'}]}
                                onChangeText={(text) => {
                                    let company = this.state.company
                                    company.note = text;
                                    this.setState({company})
                                }}
                                value={this.state.company.note}
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
        borderBottomWidth:1
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
        fontSize: 15,
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
    }

})