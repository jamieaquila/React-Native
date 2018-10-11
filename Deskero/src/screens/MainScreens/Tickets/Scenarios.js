'use strict'
import React, { Component} from 'react'

import {
    Text,
    View,
    ListView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    Modal,
    Vibration,
    ActivityIndicator,
    Image
  } from 'react-native'
// import Image from 'react-native-image-progress'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HTML from 'react-native-render-html';
import _, { isEqual } from 'lodash';
import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'

export default class ScenariosScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            loading: true,
            ticketId: this.props.id,
            scenarioStep: 1,
            selectedScenario:{
                id:'',
                name:'',
                description:''
            },
            scenariosData:[],
            selectedScenarioConditions:[],
            selectedScenarioActions:[],
            scenarioLog:[]

        }
      

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            this.props.navigator.pop()
        }else if(event.id === 'save'){
            this.executeScenario()
        }
    }

    componentDidMount(){   
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.allScenarios(bearer, clientId)
                    .end((err, res) => {
                        if(err){
                            this.setState({loading: false})
                        }else{
                            if(res.body){
                                let scenariosData = this.state.scenariosData;
                                scenariosData = res.body.scenario
                                this.setState({
                                    scenariosData,
                                    loading: false,
                                })
                            }else{
                                this.setState({loading: false})
                            }
                        }
                    })
            })
        })
    }  

    getScenarios(id){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getScenarios(bearer, clientId, id)
                    .end((err, res) => {
                        if(res.body){
                            let result = res.body
                            let scenarioStep = 2;
                            let selectedScenario = this.state.selectedScenario
                            let selectedScenarioConditions = this.state.selectedScenarioConditions
                            let selectedScenarioActions = this.state.selectedScenarioActions
                            if (typeof result.conditions != 'undefined') {                                
                                _.forEach(result.conditions, (condition) => {
                                    var bean = {
                                        type: condition.conditionType
                                    };

                                    if (condition.matchType != null) {
                                        bean.matchType = condition.matchType.toLowerCase();
                                    }

                                    if (condition.conditionType == 'PRIORITY') {
                                        bean.value = condition.priority.toLowerCase();
                                    }

                                    if (condition.conditionType == 'TYPE') {
                                        bean.value = condition.ticketType.labels[GlobalVals.language];
                                    }

                                    if (condition.conditionType == 'SOURCE') {
                                        bean.value = condition.ticketSource.labels[GlobalVals.language];
                                    }

                                    if (condition.conditionType == 'STATUS') {
                                        bean.value = condition.ticketStatus.labels[GlobalVals.language];
                                    }

                                    if (condition.conditionType == 'AREA') {
                                        bean.value = condition.ticketArea.labels[GlobalVals.language];
                                    }

                                    if (condition.conditionType == 'GROUP') {
                                        bean.value = condition.ticketGroup.labels[GlobalVals.language];
                                    }

                                    if (condition.conditionType == 'NOTE' ||
                                        condition.conditionType == 'TITLE' ||
                                        condition.conditionType == 'TEXT') {
                                        bean.value = condition.value;
                                    }

                                    if (condition.conditionType == 'ASSIGNED_TO') {
                                        bean.value = condition.assignedTo.name;
                                    }

                                    if (condition.conditionType == 'TOP_CLIENT') {

                                        if (condition.topClient) {
                                            bean.matchType = "is";
                                        } else {
                                            bean.matchType = "is not";
                                        }

                                    }

                                    if (condition.conditionType == 'ARCHIVED') {

                                        if (condition.archived) {
                                            bean.matchType = "is";
                                        } else {
                                            bean.matchType = "is not";
                                        }

                                    }

                                    if (condition.conditionType == 'INSERT_DATE' ||
                                        condition.conditionType == 'MANAGED_DATE' ||
                                        condition.conditionType == 'CLOSED_DATE') {
                                        bean.value = condition.date.filter(date == 'dd MMM yyy')
                                        // bean.value = $filter('date')(condition.date, 'dd MMM yyyy');
                                    }

                                    if (condition.conditionType == 'TAGS') {

                                        bean.value = condition.conditionTags.join(", ");
                                        bean.plural = false;

                                        if (condition.conditionTags.length > 1) {
                                            bean.matchType = condition.matchType;
                                            bean.plural = true;
                                        }

                                    }

                                    selectedScenarioConditions.push(bean);

                                });

                            }

                            if (typeof result.actions != 'undefined') {

                                _.forEach(result.actions, (action) => {

                                    var bean = {
                                        type: action.actionType
                                    };

                                    if (action.actionType == 'PRIORITY') {
                                        bean.value = action.priority.toLowerCase();
                                    }

                                    if (action.actionType == 'TYPE') {
                                        bean.value = action.ticketType.labels[GlobalVals.language];
                                    }

                                    if (action.actionType == 'SOURCE') {
                                        bean.value = action.ticketSource.labels[GlobalVals.language];
                                    }

                                    if (action.actionType == 'STATUS') {
                                        bean.value = action.ticketStatus.labels[GlobalVals.language];
                                    }

                                    if (action.actionType == 'AREA') {
                                        bean.value = action.ticketArea.labels[GlobalVals.language];
                                    }

                                    if (action.actionType == 'GROUP') {
                                        bean.value = action.ticketGroup.labels[GlobalVals.language];
                                    }

                                    if (action.actionType == 'NOTE') {
                                        bean.text = action.noteText;
                                        bean.agent = action.noteAssignedTo.name;
                                    }

                                    if (action.actionType == 'TAGS') {
                                        bean.value = action.tags.join(", ");
                                    }

                                    if (action.actionType == 'ASSIGN') {
                                        bean.value = action.escaleTo.name;
                                    }

                                    if (action.actionType == 'ADD_CC') {
                                        var ccs = [];
                                        _.forEach(action.cc, (cc) => {
                                            ccs.push(cc.name);
                                        });
                                        bean.value = ccs.join(", ");
                                    }

                                    if (action.actionType == 'EMAIL') {
                                        bean.address = action.emailAddress;
                                        bean.subject = action.emailSubject;
                                        bean.body = action.emailText;
                                    }

                                    if (action.actionType == 'ARCHIVED') {
                                        bean.value = action.archived.toLowerCase();
                                    }

                                    selectedScenarioActions.push(bean);
                                });
                            }

                            selectedScenario = result;
                            
                            this.setState({
                                scenarioStep,
                                selectedScenario,
                                selectedScenarioConditions,
                                selectedScenarioActions
                            }, () => {
                                this.props.navigator.setButtons({
                                    rightButtons:[                                    
                                        {
                                            id: 'save',
                                            icon: Images.checkIcon,
                                        }                                         
                                    ]
                                });
                            })
                        }
                    })
            })
        })
    }

    executeScenario(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.executeScenarios(bearer, clientId, this.state.selectedScenario.id, this.state.ticketId)
                    .end((err, res) => {
                        if(err){

                        }else{
                            if(res.body){
                                let scenarioStep = 3
                                let scenarioLog = res.body
                                this.setState({
                                    scenarioStep,
                                    scenarioLog
                                }, () => {
                                    this.props.navigator.setButtons({
                                        rightButtons:[]
                                    });
                                })
                            }
                        }
                    })
            })
        })
    }

    setTextLength(text, len){
        return text // (text.length > len ? (text.substring(0, len) + "...") : text);
    }
   
    renderScenariosList(){
        let scenariosList = this.state.scenariosData.map((item, i) => {
            return (
                <TouchableOpacity key={i} onPress={() =>{
                        this.getScenarios(item.id)
                    }}>
                    <View style={styles.dropdownView}>
                        <Text style={[styles.labelText, {width:'90%'}]}>{this.setTextLength(item.name, 40)}</Text>                                    
                        <View style={{width:'10%', alignItems:'center'}}>                                    
                            <Ionicons style={{color:'#ccc'}} name='ios-arrow-forward-outline' size={20}/>                                    
                        </View>
                    </View>
                </TouchableOpacity> 
            )
        });
        return (
            <View style={styles.content}>
                {scenariosList}
            </View>
        )
    }

    renderSelectedScenarioConditions(){
        let conditionsArr = this.state.selectedScenarioConditions.map((condition, i) => {
            return(
                <View key={i} style={{margin:16, backgroundColor:'#fff', borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1 }}>
                    {
                        condition.type == 'PRIORITY' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_PRIORITY', {value: condition.value})}/> 
                        : condition.type == 'TYPE' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_TYPE', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'SOURCE' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_SOURCE', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'STATUS' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_STATUS', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'AREA' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_AREA', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'GROUP' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_GROUP', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'NOTE' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_NOTE', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'TITLE' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_TITLE', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'TEXT' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_TEXT', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'TAGS' && !condition.plural ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_TAGS', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'TAGS' && condition.plural ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_TAGS_PLURAL', {matchType: condition.matchType, value: condition.value})}/>
                        : condition.type == 'ASIGNED_TO' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_ASSIGNED_TO', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'CUSTOMER' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_CUSTOMER', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'INSERT_DATE' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_INSERT_DATE', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'MANAGED_DATE' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_MANAGED_DATE', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'CLOSED_DATE' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_CLOSED_DATE', {matchType: condition.matchType, value: condition.value})}/> 
                        : condition.type == 'TOP_CLIENT' ?
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_TOP_CLIENT', {matchType: condition.matchType})}/> 
                        : condition.type == 'ARCHIVED' &&
                            <HTML html={Locale.t('SCENARIO.CONDITIONS_ARCHIVED', {matchType: condition.matchType})}/> 
                    }
                </View>
            )
        })
        return conditionsArr
    }

    renderSelectedScenarioActions(){
        let actionsArr = this.state.selectedScenarioActions.map((action, i) => {
            return (
                <View key={i} style={{margin:16, backgroundColor:'#fff', borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1 }}>
                {
                    action.type == 'PRIORITY' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_PRIORITY', {value: action.value})}/> 
                    : action.type == 'TYPE' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_TYPE', {value: action.value})}/> 
                    : action.type == 'STATUS' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_STATUS', {value: action.value})}/> 
                    : action.type == 'AREA' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_AREA', {value: action.value})}/> 
                    : action.type == 'GROUP' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_GROUP', {value: action.value})}/> 
                    : action.type == 'NOTE' ?
                        <HTML value={Locale.t('SCENARIO.ACTIONS_NOTE', {text: action.text, agent: action.agent})}/> 
                    : action.type == 'TAGS' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_TAGS', {value: action.value})}/> 
                    : action.type == 'ASSIGN' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_ASSIGN', {value: action.value})}/> 
                    : action.type == 'ADD_CC' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_ADD_CC', {value: action.value})}/> 
                    : action.type == 'EMAIL' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_EMAIL', {address: action.address, subject: action.subject, body: action.body})}/> 
                    : action.type == 'DELETE' ?
                        <HTML html={Locale.t('SCENARIO.ACTIONS_DELETE')}/> 
                    : action.type == 'ARCHIVED' &&
                        <HTML html={Locale.t('SCENARIO.ACTIONS_ARCHIVED')}/> 
                }
                    
                </View>
            )
        })

        return actionsArr
    }

    renderScenario(){
        return(
            <View style={styles.content}>
                <View style={{margin:16, backgroundColor:'#fff'}}>
                    <Text style={{fontFamily:'Helvetica Neue', fontSize:16, color: '#444', fontWeight:'bold', marginTop:16}}>{this.state.selectedScenario.name}</Text>
                    <Text style={{fontFamily:'Helvetica Neue', fontSize:14, color: '#666', marginTop:16}}>{this.state.selectedScenario.description}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{Locale.t('SCENARIO.CONDITIONS')}</Text>
                </View>
                {
                    this.state.selectedScenarioConditions.length == 0 ?
                        <View style={{padding:16, width:'100%', alignItems:'center'}}>
                            <Text style={{ fontFamily:'Helvetica Neue', color:'#ef473a',}}>{Locale.t('SCENARIO.NO_CONDITIONS')}</Text>
                        </View>
                    :
                        this.renderSelectedScenarioConditions()
                }
                <View style={styles.title}>
                    <Text style={styles.titleText}>{Locale.t('SCENARIO.ACTIONS')}</Text>
                </View>
                {   
                    this.state.selectedScenarioActions.length == 0 ?
                        <View style={{padding:16, width:'100%', alignItems:'center'}}>
                            <Text style={{ fontFamily:'Helvetica Neue', color:'#ef473a',}}>{Locale.t('SCENARIO.NO_ACTIONS')}</Text>
                        </View>
                    :
                        this.renderSelectedScenarioActions()
                }
            </View>
        )
    }

    renderSenarioLogHtml(){
        let htmls = this.state.scenarioLog.map((item, i) => {
            return (
                <View key={i} style={{padding:16, backgroundColor:'#fff', borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1 }}>
                    <HTML html={item.logLine}/> 
                </View>
            )
        })
        return htmls
    }

    renderExecutedScenario(){
        return (
            <View style={styles.content}>
                <View style={styles.title}>
                    <Text style={[styles.titleText, {color:'#df3d00'}]}>{Locale.t('SCENARIO.EXECUTED')}</Text>
                </View>
                {
                    this.renderSenarioLogHtml()
                }
            </View>
        )
    }
   
    render(){
        return(            
            <View style={styles.container}>  
            {
                !this.state.loading ?
                <ScrollView ref="scroll">
                {
                    this.state.scenarioStep == 1 ?
                        this.renderScenariosList() 
                    :  this.state.scenarioStep == 2 ? 
                        this.renderScenario()
                    :  this.renderExecutedScenario()
                    
                }  
                </ScrollView>
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
        flex:1,
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
    buttonText: {
        fontFamily:'Helvetica Neue',
        fontSize: 16,
        fontWeight: '300',
        color: 'rgb(77, 77, 77)',
    },
    title: {        
        flex:1,            
        width:'100%',
        backgroundColor:'#fff',        
        justifyContent:'center',
        borderTopColor:'rgb(228, 228, 228)', 
        borderTopWidth:1,
        borderBottomColor:'rgb(228, 228, 228)', 
        borderBottomWidth:1
    },
    titleText: {
        paddingTop:9 * Metrics.scaleHeight,
        paddingLeft:16,
        fontFamily:'Helvetica Neue',
        fontSize:16, 
        color: 'rgb(223, 61, 0)',
        backgroundColor: '#ffffff',
        height:36.5 * Metrics.scaleHeight
    }

})