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
    Switch,
    Alert,
    TextInput,
    ActivityIndicator,
    Image
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Image from 'react-native-image-progress'
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ModalDropdown from 'react-native-modal-dropdown'
import TagInput from 'react-native-tag-input';

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'

import { startMainTab } from '../../../app'

const ORDERS = [
    Locale.t('CUSTOM_FILTER_NEW.ORDER_INSERT_DATE_ASC'),
    Locale.t('CUSTOM_FILTER_NEW.ORDER_INSERT_DATE_DESC'),
    Locale.t('CUSTOM_FILTER_NEW.ORDER_MANAGED_DATE_ASC'),
    Locale.t('CUSTOM_FILTER_NEW.ORDER_MANAGED_DATE_DESC'),
    Locale.t('CUSTOM_FILTER_NEW.ORDER_CLOSED_DATE_ASC'),
    Locale.t('CUSTOM_FILTER_NEW.ORDER_CLOSED_DATE_DESC')
]

export default class AddEditCustomerFilterScreen extends Component { 

    constructor(props){
        super(props)
        this.state = {
            name:'',
            orderBy:'...',
            autocomplete:{
                customer:{
                    customer:"",
                    disabled:false,
                    customers:[]
                }
            },
            assignedTo:'...',
            channel:'...',
            status:'...',
            type:'...',
            area:'...',
            group:'...',
            priority:false,
            tags:[],      
            newCustomFilterFields:{},     
            loading:true,
            agents:[],
            sources:[],
            statuses:[],
            types:[],
            areas:[],
            groups:[],  
            ticketCustomFields:[],   
            permissions:{} ,
            emptyName: false
        }
        this.currentCustomFilter = {}
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        console.ignoredYellowBox = [
            'Setting a timer'
         ];

    }

    componentDidMount(){       
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getUpdates(bearer, clientId)
                    .then((res) => {
                        if(res == 'OK'){
                            setTimeout(() => {
                                this.getGlobalData()
                            }, 1000)
                        }                
                    })
                    .catch((err) => {
                        setTimeout(() => {
                            this.getGlobalData()
                        }, 1000)
                })
            })
        })
    }  
     
    onNavigatorEvent(event) {
        if (event.id === 'close') {
            this.showDialogBox();
        }else if(event.id == "save"){
            this.saveData()
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

    getGlobalData(){ 
        let agents = [];
        if(GlobalVals.agents){
            for(var i = 0 ; i < GlobalVals.agents.length; i++){
                let _agent = {
                    id:GlobalVals.agents[i].id,
                    name:GlobalVals.agents[i].name
                }
                agents.push(_agent);
            }
        }
        

        let sources = [];
        if(GlobalVals.sources){
            for(var i = 0 ; i < GlobalVals.sources.length ; i++){
                let _source = {
                    label: this.getCurrnetLanguage(GlobalVals.sources[i].labels) ? this.getCurrnetLanguage(GlobalVals.sources[i].labels) : GlobalVals.sources[i].source,
                    source: GlobalVals.sources[i].source
                }
                sources.push(_source);
            }
        }
        

        let statuses = [];
        if(GlobalVals.statuses){
            for(var i = 0 ; i < GlobalVals.statuses.length ; i++){
                let _status = {
                    label: this.getCurrnetLanguage(GlobalVals.statuses[i].labels) ? this.getCurrnetLanguage(GlobalVals.statuses[i].labels) : GlobalVals.statuses[i].status,
                    status: GlobalVals.statuses[i].status
                }
                statuses.push(_status);
            }
        }
        

        let types = [];
        if(GlobalVals.types){
            for(var i = 0 ; i < GlobalVals.types.length ; i++){
                let _type = {
                    label: this.getCurrnetLanguage(GlobalVals.types[i].labels) ? this.getCurrnetLanguage(GlobalVals.types[i].labels) : GlobalVals.types[i].type,
                    id:GlobalVals.types[i].id
                }
                types.push(_type)
            }
        }
        

        let areas = [];
        if(GlobalVals.areas){
            for(var i = 0 ; i < GlobalVals.areas.length ; i++){
                let _area = {
                    label: this.getCurrnetLanguage(GlobalVals.areas[i].labels) ? his.getCurrnetLanguage(GlobalVals.areas[i].labels) : GlobalVals.areas[i].area,
                    id:GlobalVals.areas[i].id
                }
                areas.push(_area)
            }
        }
        

        let groups = [];
        if(GlobalVals.groups){
            for(var i = 0 ; i < GlobalVals.groups.length ; i++){
                let _group = {
                    label: this.getCurrnetLanguage(GlobalVals.groups[i].labels) ? this.getCurrnetLanguage(GlobalVals.groups[i].labels) : GlobalVals.groups[i].group,
                    id:GlobalVals.groups[i].id
                }
                groups.push(_group)
            }
        }
        
        let newCustomFilterFields = {}
        if(GlobalVals.ticketCustomFields){
            for(var i = 0 ; i < GlobalVals.ticketCustomFields.length ; i++){
                let field = GlobalVals.ticketCustomFields[i];
                newCustomFilterFields[field.name] = "...";                
            }
        }
        

        const permissions = GlobalVals.permissions;

        this.setState({
            agents,
            sources,
            statuses,
            types,
            areas,
            groups,
            ticketCustomFields:GlobalVals.ticketCustomFields,
            newCustomFilterFields,
            permissions,
            loading:false
        }, () => {this.checkEditStatus()});
    }

    saveData(){
        if(this.state.name){ 
            this.currentCustomFilter.name = this.state.name;
            this.currentCustomFilter.order = this.getOrderId();

            for(var i = 0 ; i < this.state.agents.length; i++){
                if(this.state.agents[i].name == this.state.assignedTo){
                    this.currentCustomFilter.assignedTo = this.state.agents[i].id
                    break;
                }
            }

            for(var i = 0 ; i < this.state.sources.length; i++){
                if(this.state.sources[i].label == this.state.channel){
                    this.currentCustomFilter.source = this.state.sources[i].source
                    break;
                }
            }

            for(var i = 0 ; i < this.state.statuses.length; i++){
                if(this.state.statuses[i].label == this.state.status){
                    this.currentCustomFilter.status = this.state.statuses[i].status
                    break;
                }
            }

            for(var i = 0 ; i < this.state.types.length; i++){
                if(this.state.types[i].label == this.state.type){
                    this.currentCustomFilter.type = this.state.types[i].id
                    break;
                }
            }

            for(var i = 0 ; i < this.state.areas.length; i++){
                if(this.state.areas[i].label == this.state.area){
                    this.currentCustomFilter.area = this.state.areas[i].id
                    break;
                }
            }

            for(var i = 0 ; i < this.state.groups.length; i++){
                if(this.state.groups[i].label == this.state.group){
                    this.currentCustomFilter.group = this.state.groups[i].id
                    break;
                }
            }

            this.currentCustomFilter.priority = this.state.priority;
            this.currentCustomFilter.tags = this.state.tags;

            if(this.state.newCustomFilterFields !== undefined){
                
                var customFields = {};
                for (var key in this.state.newCustomFilterFields) {
                    if (this.state.newCustomFilterFields.hasOwnProperty(key)) {
                       if(this.state.newCustomFilterFields[key] != '...'){
                           if(typeof this.state.newCustomFilterFields[key] === 'string'){
                                customFields[key] = this.state.newCustomFilterFields[key];
                           }else{
                                customFields[key] = this.state.newCustomFilterFields[key].value;
                           }

                       }
                    }
                }    
                this.currentCustomFilter.customFields = customFields;
            }

            this.currentCustomFilter.openedById = this.state.autocomplete.customer.openedById;
            this.currentCustomFilter.openedByName = this.state.autocomplete.customer.openedByName;            
            
            if(this.props.status == 'new'){        
                this.currentCustomFilter.id = this.getGenerateId();
                GlobalVals.customFilters.push(this.currentCustomFilter); 
            }else{
                for(var i = 0 ; i < GlobalVals.customFilters.length ; i++){
                    if(GlobalVals.customFilters[i].id == this.currentCustomFilter.id){
                        GlobalVals.customFilters[i] = this.currentCustomFilter;
                        break;
                    }
                }
            }

            localStorage.set('customFilters-' + GlobalVals.dataKeyId, JSON.stringify(GlobalVals.customFilters))
            // this.props.navigator.dismissAllModals({ animationType: "slide-down" });
            // this.props.navigator.switchToTab({ tabIndex: 0 });
            startMainTab(0);             
        }else{
            this.setState({emptyName: true}, () => {
                setTimeout(() => {
                    this.setState({
                        emptyName: false,                        
                    })
                }, 2000)
            })
            
        }
        
    }

    checkEditStatus(){
        const { status } = this.props;
        
        if(status == 'edit'){
            // alert(JSON.stringify(GlobalVals.customFilter))
            this.currentCustomFilter.id = GlobalVals.customFilter.id;
            let name = GlobalVals.customFilter.name;
            let orderBy = this.getOrderLabel(GlobalVals.customFilter.order);

            let assignedTo = "...";
            if(GlobalVals.customFilter.assignedTo){
                for(var i = 0 ; i < this.state.agents.length; i++){
                    if(this.state.agents[i].id == GlobalVals.customFilter.assignedTo){
                        assignedTo = this.state.agents[i].name
                        break;
                    }
                }
            }

            let channel = "...";
            if(GlobalVals.customFilter.source){
                for(var i = 0 ; i < this.state.sources.length; i++){
                    if(this.state.sources[i].source == GlobalVals.customFilter.source){
                        channel = this.state.sources[i].label
                    }                    
                }
            }
            
            let status = "..."
            if(GlobalVals.customFilter.status){
                for(var i = 0 ; i < this.state.statuses.length; i++){
                    if(this.state.statuses[i].status == GlobalVals.customFilter.status){
                        status = this.state.statuses[i].label
                        break;
                    }                    
                }
            }

            let type = "..."
            if(GlobalVals.customFilter.type){
                for(var i = 0 ; i < this.state.types.length; i++){
                    if(this.state.types[i].id == GlobalVals.customFilter.type){
                        type = this.state.types[i].label
                        break;
                    }                    
                }
            }

            let area = "..."
            if(GlobalVals.customFilter.area){
                for(var i = 0 ; i < this.state.areas.length; i++){
                    if(this.state.areas[i].id == GlobalVals.customFilter.area){
                        area = this.state.areas[i].label
                        break;
                    }                    
                }
            }

            let group = "..."
            if(GlobalVals.customFilter.group){
                for(var i = 0 ; i < this.state.groups.length; i++){
                    if(this.state.groups[i].id == GlobalVals.customFilter.group){
                        group = this.state.groups[i].label
                        break;
                    }                    
                }
            }

            let priority = GlobalVals.customFilter.priority;

            let tags = GlobalVals.customFilter.tags;

            let autocomplete = {
                customer:{
                    customer:"",
                    disabled:false,
                    customers:[]
                }
            };

            if(GlobalVals.customFilter.openedByName && GlobalVals.customFilter.openedByName != ''){
                autocomplete = {
                    customer:{
                        customer: GlobalVals.customFilter.openedByName,
                        disabled: true,
                        customers:[]
                    }
                }
            }

            let newCustomFilterFields = {}; 

            if(GlobalVals.customFilter.customFields){
                for (var key in GlobalVals.customFilter.customFields) {
                    var field = this.state.ticketCustomFields.filter(el => el.name == key)
                    if(field.type == 'LINKED_COMBO'){
                        var valueToSelect = field.linkedValues.filter(el => el.value == GlobalVals.customFilter.customFields[key])
                        newCustomFilterFields[key] = valueToSelect;
                    }else{
                        newCustomFilterFields[key] = GlobalVals.customFilter.customFields[key]
                    }
                }
            }

            this.setState({
                name,
                orderBy,
                autocomplete,
                assignedTo,
                channel,
                status,
                type,
                area,
                group,
                priority,
                tags,
                newCustomFilterFields,
            })
        }
    }

    s4(){
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    getGenerateId(){
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    getOrderId(){
        let order = "";
        switch(this.state.orderBy){
            case '...':
                order = "";
                break;
            case ORDERS[0]:
                order = "insertDate_ASC";
                break;
            case ORDERS[1]:
                order = "insertDate_DESC";
                break;
            case ORDERS[2]:
                order = "managedDate_ASC";
                break;
            case ORDERS[3]:
                order = "managedDate_DESC";
                break;
            case ORDERS[4]:
                order = "closedDate_ASC";
                break;
            case ORDERS[5]:
                order = "closedDate_DESC";
                break;
        }
        return order;
    }

    getOrderLabel(id){
        if(!id || id == ''){
            return "..."
        }else if(id == 'insertDate_ASC'){
            return ORDERS[0]
        }else if(id == 'insertDate_DESC'){
            return ORDERS[1]
        }else if(id == 'managedDate_ASC'){
            return ORDERS[2]
        }else if(id == 'managedDate_DESC'){
            return ORDERS[3]
        }else if(id == 'closedDate_ASC'){
            return ORDERS[4]
        }else if(id == 'closedDate_DESC'){
            return ORDERS[5]
        }
    }

    selectCustomer(customer){
        let autocomplete = {
            customer:{
                customer:customer.name,
                disabled:true,
                customers:[],
                openedById:customer.id,
                openedByName:customer.name
            }
        };
        this.setState({autocomplete})
    }

    emptyCustomer(){
        let autocomplete = {
            customer:{
                customer:'',
                disabled:false,
                customers:[],
                openedById:null,
                openedByName:null
            }
        };
        this.setState({autocomplete})
    }
    
    customerAutocomplete(text){
        if(text.length > 2){
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.searchCustomer(bearer, clientId, text)
                        .end((err, res) => {                            
                            if(err){
                                // this.state.autocomplete.customer.customer = text;
                                // this.setState({autocomplete:this.state.autocomplete})
                            }else{
                                if(res.body){                                    
                                    let autocomplete = {
                                        customer:{
                                            customer:text,
                                            disabled:false,
                                            customers:res.body
                                        }
                                    };

                                    this.setState({
                                        autocomplete
                                    })
                                }else{
                                    // this.state.autocomplete.customer.customer = text;
                                    // this.setState({autocomplete:this.state.autocomplete})
                                }
                            }
                        })
                })
            })
        }
    }
    
    getAgentNames(){
        let names = [];
        for(var i = 0 ; i < this.state.agents.length ; i++){
            names.push(this.state.agents[i].name);
        }
        return names
    }

    getSourceLabels(){
        let labels = [];
        for(var i = 0 ; i < this.state.sources.length ; i++){
            labels.push(this.state.sources[i].label);
        }
        return labels
    }

    getStatusLabels(){
        let labels = [];
        for(var i = 0 ; i < this.state.statuses.length ; i++){
            labels.push(this.state.statuses[i].label);
        }
        return labels;
    }

    getTypeLabels(){
        let labels = [];
        for(var i = 0 ; i < this.state.types.length ; i++){
            labels.push(this.state.types[i].label);
        }
        return labels;
    }

    getAreaLabels(){
        let labels = [];
        for(var i = 0 ; i < this.state.areas.length ; i++){
            labels.push(this.state.areas[i].label);
        }
        return labels;
    }

    getGroupLabels(){
        let labels = [];
        for(var i = 0 ; i < this.state.groups.length ; i++){
            labels.push(this.state.groups[i].label);
        }
        return labels;
    }

    getFieldList(values){
        let list = [];
        for(var i = 0 ; i < values.length ; i++){
            list.push(values[i].value)
        }
        return list
    }

    getShowText(text, len){        
        return (text.length > len ? (text.substring(0, len) + "...") : text);
    }    

    renderCustomFields(){

        let ticketFields = this.state.ticketCustomFields.map((field, i) => {
            return (
                field.type == 'TEXT' ?
                    <View style={styles.dropdownView}>
                        <Text style={[styles.labelText, {width:'30%', paddingLeft:20}]}>{ this.getCurrnetLanguage(field.labels)}</Text>
                        <TextInput 
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => {
                                this.state.newCustomFilterFields[field.name] = text;
                                this.setState({
                                    newCustomFilterFields:this.state.newCustomFilterFields
                                })
                            }}
                            value={this.state.newCustomFilterFields[field.name]}
                            />   
                    </View>                      
                : field.type == 'COMBO' ?
                    <View style={styles.dropdownView} key={i}>
                        <Text style={styles.labelText}>{this.getCurrnetLanguage(field.labels)}</Text>
                        <ModalDropdown
                            defaultIndex={0}
                            options={['...'].concat(field.values)}
                            style={styles.filterButtonContainerStyle}
                            // dropdownStyle={
                            //     field.values.length < 5 ? {                                
                            //         height: (33 + StyleSheet.hairlineWidth) * (field.values.length + 1)                                
                            //     }
                            //     : {}
                            // }
                            dropdownTextStyle={styles.filterButton}
                            textStyle={styles.filterButton}
                            onSelect={(idx, value) => {
                                this.state.newCustomFilterFields[field.name] = value;
                                this.setState({
                                    newCustomFilterFields:this.state.newCustomFilterFields
                                })
                            }}
                            >
                            <View style={styles.filterButtonContent}>
                            <Text style={styles.buttonText}>{this.state.newCustomFilterFields[field.name]}</Text>
                                <Icon
                                style={styles.filterDropdownIcon}
                                name="angle-down" size={18}
                                />
                            </View>
                        </ModalDropdown>
                    </View>
                : field.type == 'LINKED_COMBO' ?
                    <View style={styles.dropdownView} key={i}>
                        <Text style={styles.labelText}>{this.getCurrnetLanguage(field.labels)}</Text>
                        <ModalDropdown
                            defaultIndex={0}
                            options={['...'].concat(this.getFieldList(field.linkedValues))}
                            style={styles.filterButtonContainerStyle}
                            // dropdownStyle={
                            //     field.linkedValues.length < 5 ? {                                
                            //         height: (33 + StyleSheet.hairlineWidth) * (field.linkedValues.length + 1)                                
                            //     }
                            //     : {}
                            // }
                            dropdownTextStyle={styles.filterButton}
                            textStyle={styles.filterButton}
                            onSelect={(idx, value) => {
                                this.state.newCustomFilterFields[field.name] = value;
                                this.setState({
                                    newCustomFilterFields:this.state.newCustomFilterFields
                                })
                            }}
                            >
                            <View style={styles.filterButtonContent}>
                            <Text style={styles.buttonText}>{this.state.newCustomFilterFields[field.name]}</Text>
                                <Icon
                                style={styles.filterDropdownIcon}
                                name="angle-down" size={18}
                                />
                            </View>
                        </ModalDropdown>
                    </View>
                : null
                
            )            
        })
        return ticketFields;
    }

    renderCustomerList(){
        let customers = this.state.autocomplete.customer.customers.map((customer, i) => {
            return (
                <TouchableOpacity style={styles.autocompleteView} key={i} onPress={() => {
                    this.selectCustomer(customer)
                }}>
                    <Text style={{fontSize:14, color: 'rgb(128, 128, 128)'}}>{this.getShowText(customer.name + " " + (customer.email ? ("<" + customer.email + ">") : ""), 40)}</Text>
                </TouchableOpacity>
            )
        });
        return customers
    }

    render() {
        return (            
            <View style={styles.container}> 
            {
                !this.state.loading ?
                <KeyboardAwareScrollView ref="scroll">
                    <View style={styles.content}>
                        {/* Name */}                        
                        <View style={styles.dropdownView}>
                            <View style={{flexDirection:'row', width:'30%', paddingLeft:20}}>
                                <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('CUSTOM_FILTER_NEW.NAME')}</Text>
                                <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                            </View>
                            <TextInput 
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    this.setState({name:text})
                                }}
                                value={this.state.name}
                                />   
                            {
                                this.state.emptyName &&
                                <View style={styles.emptyField}>
                                    <Image style={{width:161 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                </View>
                            }  
                        </View>  
                        {/* Order By */}
                        <View style={styles.dropdownView}>
                            <Text style={styles.labelText}>{Locale.t('CUSTOM_FILTER_NEW.ORDER')}</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['...'].concat(ORDERS)}
                                style={styles.filterButtonContainerStyle}
                                // dropdownStyle={
                                //     ORDERS.length < 5 ? {                                
                                //         height: (33 + StyleSheet.hairlineWidth) * (ORDERS.length + 1)                                
                                //     }
                                //     : {}
                                // }
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    this.setState({
                                        orderBy:value
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                <Text style={styles.buttonText}>{this.state.orderBy}</Text>
                                    <Icon
                                    style={styles.filterDropdownIcon}
                                    name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>
                        {/* Customer */}
                        {
                            this.state.autocomplete.customer.disabled ?
                                <View style={styles.dropdownView}>
                                    <Text style={[styles.labelText, {width:'30%'}]}>{Locale.t('CUSTOM_FILTER_NEW.CUSTOMER')}</Text>                                    
                                    <Text style={[styles.buttonText, {width:'55%'}]}>{this.getShowText(this.state.autocomplete.customer.customer, 25)}</Text>
                                    <TouchableOpacity style={{width:'15%', alignItems:'flex-end'}} onPress={() => {
                                        this.emptyCustomer()
                                    }}>
                                        <Ionicons name='ios-remove-circle-outline' size={20}/>
                                    </TouchableOpacity>
                                </View>
                                
                            : 
                                <View style={styles.dropdownView}>
                                        <Text style={[styles.labelText, {width:'30%', paddingLeft:20}]}>{Locale.t('CUSTOM_FILTER_NEW.CUSTOMER')}</Text>
                                    <TextInput 
                                        style={styles.input}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(text) => {
                                            this.state.autocomplete.customer.customer = text;
                                            this.setState({autocomplete: this.state.autocomplete}, ()=>{
                                                this.customerAutocomplete(text)
                                            })                                            
                                        }}
                                        value={this.state.autocomplete.customer.customer}
                                        />   
                                </View>                                 
                        }
                        {/* Customers Search List */}
                        {
                            this.state.autocomplete.customer.customers.length > 0 ?
                                this.renderCustomerList()
                            :
                                null
                        }
                        {/* Assigned to */}
                        {
                            this.state.permissions.viewAll ?
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('CUSTOM_FILTER_NEW.AGENT')}</Text>
                                    <View style={{flex:1}}>
                                        <ModalDropdown
                                            defaultIndex={0}
                                            options={['...'].concat(this.getAgentNames())}
                                            style={styles.filterButtonContainerStyle}
                                            // dropdownStyle={
                                            //     this.getAgentNames().length < 5 ? {                                
                                            //         height: (33 + StyleSheet.hairlineWidth) * (this.getAgentNames().length + 1)                                
                                            //     }
                                            //     : {}
                                            // }
                                            dropdownTextStyle={styles.filterButton}
                                            textStyle={styles.filterButton}
                                            onSelect={(idx, value) => {
                                                this.setState({
                                                    assignedTo:value
                                                })
                                            }}
                                            >
                                            <View style={styles.filterButtonContent}>
                                            <Text style={styles.buttonText}>{this.state.assignedTo}</Text>
                                                <Icon
                                                style={styles.filterDropdownIcon}
                                                name="angle-down" size={18}
                                                />
                                            </View>
                                        </ModalDropdown>
                                    </View>
                                </View>
                            : null
                        }                        
                        {/* Channel */}
                        <View style={styles.dropdownView}>
                            <Text style={styles.labelText}>{Locale.t('CUSTOM_FILTER_NEW.SOURCE')}</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['...'].concat(this.getSourceLabels())}
                                style={styles.filterButtonContainerStyle}
                                // dropdownStyle={
                                //     this.getSourceLabels().length < 5 ? {                                
                                //         height: (33 + StyleSheet.hairlineWidth) * (this.getSourceLabels().length + 1)                                
                                //     }
                                //     : {}
                                // }
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    this.setState({
                                        channel:value
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                <Text style={styles.buttonText}>{this.state.channel}</Text>
                                    <Icon
                                    style={styles.filterDropdownIcon}
                                    name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>
                        {/* Status */}
                        <View style={styles.dropdownView}>
                            <Text style={styles.labelText}>{Locale.t('CUSTOM_FILTER_NEW.STATUS')}</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['...'].concat(this.getStatusLabels())}
                                style={styles.filterButtonContainerStyle}
                                // dropdownStyle={
                                //     this.getStatusLabels().length < 5 ? {                                
                                //         height: (33 + StyleSheet.hairlineWidth) * (this.getStatusLabels().length + 1)                                
                                //     }
                                //     : {}
                                // }
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    this.setState({
                                        status:value
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                <Text style={styles.buttonText}>{this.state.status}</Text>
                                    <Icon
                                    style={styles.filterDropdownIcon}
                                    name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>
                        {/* Type */}
                        <View style={styles.dropdownView}>
                            <Text style={styles.labelText}>{Locale.t('CUSTOM_FILTER_NEW.TYPE')}</Text>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['...'].concat(this.getTypeLabels())}
                                style={styles.filterButtonContainerStyle}
                                // dropdownStyle={
                                //     this.getTypeLabels().length < 5 ? {                                
                                //         height: (33 + StyleSheet.hairlineWidth) * (this.getTypeLabels().length + 1)                                
                                //     }
                                //     : {}
                                // }
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    this.setState({
                                        type:value
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                <Text style={styles.buttonText}>{this.state.type}</Text>
                                    <Icon
                                    style={styles.filterDropdownIcon}
                                    name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>
                        {/* Area */}
                        {
                            this.getAreaLabels().length > 0 ?
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('CUSTOM_FILTER_NEW.AREA')}</Text>
                                    <ModalDropdown
                                        defaultIndex={0}
                                        options={['...'].concat(this.getAreaLabels())}
                                        style={styles.filterButtonContainerStyle}
                                        // dropdownStyle={
                                        //     this.getAreaLabels().length < 5 ? {                                
                                        //         height: (33 + StyleSheet.hairlineWidth) * (this.getAreaLabels().length + 1)                                
                                        //     }
                                        //     : {}
                                        // }
                                        dropdownTextStyle={styles.filterButton}
                                        textStyle={styles.filterButton}
                                        onSelect={(idx, value) => {
                                            this.setState({
                                                area:value
                                            })
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.state.area}</Text>
                                            <Icon
                                            style={styles.filterDropdownIcon}
                                            name="angle-down" size={18}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>
                            : null
                        }
                        {/* Group */}
                        {
                            this.getGroupLabels().length > 0 ?
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('CUSTOM_FILTER_NEW.GROUP')}</Text>
                                    <ModalDropdown
                                        defaultIndex={0}
                                        options={['...'].concat(this.getGroupLabels())}
                                        style={styles.filterButtonContainerStyle}
                                        // dropdownStyle={
                                        //     this.getGroupLabels().length < 5 ? {                                
                                        //         height: (33 + StyleSheet.hairlineWidth) * (this.getGroupLabels().length + 1)                                
                                        //     }
                                        //     : {}
                                        // }
                                        dropdownTextStyle={styles.filterButton}
                                        textStyle={styles.filterButton}
                                        onSelect={(idx, value) => {
                                            this.setState({
                                                group:value
                                            })
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.state.group}</Text>
                                            <Icon
                                            style={styles.filterDropdownIcon}
                                            name="angle-down" size={18}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>
                            : null
                        }
                        {/* Priority */}
                        <View style={styles.dropdownView}>
                            <Text style={styles.labelText}>{Locale.t('CUSTOM_FILTER_NEW.PRIORITY')}</Text>
                            <View style={{alignItems:'flex-end', justifyContent:'flex-end', width:'78%'}}>
                                <Switch
                                    onValueChange={(value) => {    
                                        this.setState({priority:value})                    
                                        }}
                                    value={this.state.priority} />
                            </View>
                        </View>
                        {/* Tag */}
                        <View style={{paddingHorizontal:20, borderBottomColor:'rgba(0,0,0,0.2)', borderBottomWidth:1}}>
                            <TagInput
                                inputColor={'rgb(128, 128, 128)'}
                                inputProps={{
                                    placeholder:Locale.t('ADD_A_TAG')
                                }}
                                value={this.state.tags}
                                onChange={(tags) => {
                                    this.setState({tags})
                                }}
                                labelExtractor={(tag) => tag}
                                maxHeight={100}
                                />
                        </View>  
                        {/* Ticket Custom Fields */}
                        {
                            this.state.ticketCustomFields &&
                            this.renderCustomFields()
                        }
                        
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
    bottomLine:{
        paddingTop:10, 
        marginLeft:'5%', 
        width:'90%', 
        borderBottomColor:'rgb(228, 228, 228)', 
        borderBottomWidth:1
    },
    dropdownView:{
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
    input:{
        width:'70%',
        fontFamily:'Helvetica Neue',
		fontSize: 16,
		color: 'rgb(77, 77, 77)',
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
        color: 'rgb(128, 128, 128)'
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