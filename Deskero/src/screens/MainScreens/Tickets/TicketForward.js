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
    Modal,
    Platform,
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
import ModalDropdown from 'react-native-modal-dropdown'

import { Client, localStorage, countryNames } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'

import { startMainTab } from '../../../app'

export default class TicketForwardScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            forward: {
                id: this.props.id,
                forwardTo:'',
                currentInCc:false,
                note:''
            },
            agents:[],
            emptyAssignedTo: false,
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            this.showDialogBox()
        }else if(event.id === 'save'){
            this.saveForward()
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
                    if(GlobalVals.user.role == 'CUSTOMER'){
                        // this.props.navigator.dismissAllModals({ animationType: "slide-down" });
                        // this.props.navigator.switchToTab({ tabIndex: 1 });
                        startMainTab(1)
                    }else{
                        // this.props.navigator.dismissAllModals({ animationType: "slide-down" });
                        // this.props.navigator.switchToTab({ tabIndex: 2 });
                        startMainTab(2)
                    }
                        
                
                }},
            ],
            { cancelable: false }
        )
    }

    saveForward(){
        if(this.state.forward.forwardTo == '' || !this.state.forward.forwardTo){
            this.setState({
                emptyAssignedTo: true
            }, () =>{
                setTimeout(() => {
                    this.setState({emptyAssignedTo: false})
                }, 2000)
            })
        }else{
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.forwardTicket(bearer, clientId, this.state.forward)
                        .end((err, res) => {
                            if(err){
                                // console.log(err)
                            }else{
                                if(res.body.id){
                                    if(GlobalVals.user.role == 'CUSTOMER'){
                                        // this.props.navigator.dismissAllModals({ animationType: "slide-down" });
                                        // this.props.navigator.switchToTab({ tabIndex: 1 });
                                        startMainTab(1)
                                    }else{
                                        // this.props.navigator.dismissAllModals({ animationType: "slide-down" });
                                        // this.props.navigator.switchToTab({ tabIndex: 2 });
                                        startMainTab(2) 
                                    }
                                        
                                }
                            }
                        })
                })
            })
        }
    }

    componentDidMount(){   
        this.getGlobalData()
    }  

    getGlobalData(){
        let agents = []
        if(GlobalVals.agents){
            for(var i = 0 ; i < GlobalVals.agents.length ; i++){
                let agent = {
                    id: GlobalVals.agents[i].id,
                    name: GlobalVals.agents[i].name,
                }
                agents.push(agent)
            }
        }

        this.setState({
            loading: false,
            agents
        })
    }

    getAgentNameArr(){
        let names = ['...']
        for(var i = 0 ; i < this.state.agents.length ; i++){
            names.push(this.state.agents[i].name)
        }
        return names
    }

    getDropdownAssignedText(){
        let selText = "...";        
        for(var i = 0 ; i < this.state.agents.length ; i++){
            if(this.state.agents[i].id == this.state.forward.forwardTo){
                selText = this.state.agents[i].name;
                break;
            }
        }
        return selText
    }
    
    render(){
        return(            
            <View style={styles.container}> 
            {
                !this.state.loading ?
                <KeyboardAwareScrollView ref="scroll">             
                    <View style={styles.content}>
                        <View style={styles.dropdownView}>
                            <View style={{flexDirection:'row', paddingLeft:20}}>
                                    <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_FORWARD.AGENT')}</Text>
                                    <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                            </View>
                            <ModalDropdown
                                defaultIndex={0}
                                options={this.getAgentNameArr()}
                                style={styles.filterButtonContainerStyle}
                                // dropdownStyle={
                                //     this.getAgentNameArr().length < 5 ? {                                
                                //         height: (33 + StyleSheet.hairlineWidth) * (this.getAgentNameArr().length + 1)                                
                                //     }
                                //     : {}
                                // }
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let forward = this.state.forward
                                    if(value != '...'){
                                        for(var i = 0 ; i < this.state.agents.length ; i++){
                                            if(value == this.state.agents[i].name){                                                    
                                                forward.forwardTo = this.state.agents[i].id
                                                break;
                                            }
                                        }
                                    }else{
                                        forward.forwardTo = undefined
                                    }
                                    this.setState({
                                        forward
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                <Text style={styles.buttonText}>{this.getDropdownAssignedText()}</Text>
                                    <Icon
                                    style={styles.filterDropdownIcon}
                                    name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                            {
                                this.state.emptyAssignedTo &&
                                <View style={styles.emptyField}>
                                    <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                </View>
                            } 
                        </View>

                        <View style={styles.dropdownView}>
                            <Text style={[styles.labelText, {width:'60%'}]}>{Locale.t('TICKET_FORWARD.CURRENT_IN_CC')}</Text>
                            <View style={{alignItems:'flex-end', justifyContent:'flex-end', width:'40%'}}>
                                <Switch
                                    onValueChange={(value) => {   
                                        let forward = this.state.forward
                                        forward.currentInCc = value 
                                        this.setState({forward})                    
                                        }}
                                    value={this.state.forward.currentInCc} />
                            </View>
                        </View>

                        <View style={[styles.dropdownView, {borderBottomWidth:0}]}>
                            <View style={{paddingLeft:20}}>
                                <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_FORWARD.NOTE')}</Text>                                
                            </View> 
                        </View>      
                        <View style={{backgroundColor:'#ffffff', marginTop:13, marginHorizontal:12, marginBottom:20, borderColor:'rgba(0,0,0,0.2)', borderWidth:1}}>
                            <TextInput 
                                multiline = {true}
                                underlineColorAndroid="transparent"
                                numberOfLines = {4}
                                style={{textAlignVertical: "top", height:120, width:'100%', fontFamily:'Helvetica Neue', fontSize: 16, color: 'rgb(77, 77, 77)',backgroundColor:'#ffffff'}}
                                onChangeText={(text) => {
                                    let forward = this.state.forward
                                    forward.note = text                                
                                    this.setState({forward})
                                }}
                                value={this.state.forward.note}
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
    },
    content:{
        width:Metrics.screenWidth - 13,
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
    emptyField:{
        position:'absolute',
        top:5.5 * Metrics.scaleHeight,
        right:3,
    }

})