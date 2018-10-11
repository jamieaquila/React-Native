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
    RefreshControl,
    TouchableHighlight,
    Modal,
    Platform,
    TextInput,
    Switch,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
// import Image from 'react-native-image-progress'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TagInput from 'react-native-tag-input';
import ModalDropdown from 'react-native-modal-dropdown'
import { SearchBar } from 'react-native-elements'

import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { Client, localStorage } from '../../../services'

export default class SearchTicketScreen extends Component {   
  
    constructor(props){
        super(props)
        this.state = {
            search:{
                query:'',
                assignedTo:null,
                source:null,
                status:null,
                type:null,
                area:null,
                group:null,
                priority:false,
                openedById:null,
                openedByName:null,
                tags:[]
            },
            autocomplete:{
                customer:{
                    customer:"",
                    disabled:false,
                    customers:[]
                },
                company:{
                    disabled:false,
                    companies:[]
                }
            },
            searchCustomFields:{},
            ticketCustomFields:[], 
            agents:[],
            sources:[],
            statuses:[],
            types:[],
            areas:[],
            groups:[], 
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) {
        if(event.id === 'back'){
            this.props.navigator.pop()
        }else if(event.id === 'search'){
            this.goToSearchResultScreen()
        }
    } 

    componentDidMount(){ 
        this.getGlobalData()
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
        let agents = []
        if(GlobalVals.agents){
            for(var i = 0 ; i < GlobalVals.agents.length ; i++){
                let agent = {
                    id: GlobalVals.agents[i].id,
                    name: GlobalVals.agents[i].name,
                    state: false
                }
                agents.push(agent)
            }
        }

        let sources = []
        if(GlobalVals.sources){
            for(var i = 0 ; i < GlobalVals.sources.length ; i++){
                let source = {
                    source: GlobalVals.sources[i].source,
                    label: this.getCurrnetLanguage(GlobalVals.sources[i].labels) ? this.getCurrnetLanguage(GlobalVals.sources[i].labels) : GlobalVals.sources[i].source
                }
                sources.push(source)
            }
        }

        let statuses = []
        if(GlobalVals.statuses){
            for(var i = 0 ; i < GlobalVals.statuses.length ; i++){
                let status = {
                    status:GlobalVals.statuses[i].status,
                    label: this.getCurrnetLanguage(GlobalVals.statuses[i].labels) ? this.getCurrnetLanguage(GlobalVals.statuses[i].labels) : GlobalVals.statuses[i].status
                }
                statuses.push(status)
            }
        }

        let types = [];
        if(GlobalVals.types){
            for(var i = 0 ; i < GlobalVals.types.length ; i++){
                let type = {
                    id:GlobalVals.types[i].id,
                    label: this.getCurrnetLanguage(GlobalVals.types[i].labels) ? this.getCurrnetLanguage(GlobalVals.types[i].labels) : GlobalVals.types[i].type
                }
                types.push(type)
            }
        }

        let areas = [];
        if(GlobalVals.areas){
            for(var i = 0 ; i < GlobalVals.areas.length ; i++){
                let area = {
                    id:GlobalVals.areas[i].id,
                    label: this.getCurrnetLanguage(GlobalVals.areas[i].labels) ? this.getCurrnetLanguage(GlobalVals.areas[i].labels) : GlobalVals.areas[i].area
                }
                areas.push(area)
            }
        }
        

        let groups = [];        
        if(GlobalVals.groups){
            for(var i = 0 ; i < GlobalVals.groups.length ; i++){
                let group = {
                    id: GlobalVals.groups[i].id,
                    label: this.getCurrnetLanguage(GlobalVals.groups[i].labels) ? this.getCurrnetLanguage(GlobalVals.groups[i].labels) : GlobalVals.groups[i].group
                }
                groups.push(group)
            }
        }

        let searchCustomFields = {}
        if(GlobalVals.ticketCustomFields){
            for(var i = 0 ; i < GlobalVals.ticketCustomFields.length ; i++){
                let field = GlobalVals.ticketCustomFields[i];
                searchCustomFields[field.name] = "...";                
            }
        }

        this.setState({
            agents,
            sources,
            statuses,
            types,
            areas,
            groups,
            searchCustomFields,
            ticketCustomFields: GlobalVals.ticketCustomFields
        })
        
    }

    getAgentNameArr(){
        let names = ['...']
        for(var i = 0 ; i < this.state.agents.length ; i++){
            names.push(this.state.agents[i].name)
        }
        return names
    }

    getDropdownAssignedText(text){
        let selText = "...";        
        for(var i = 0 ; i < this.state.agents.length ; i++){
            if(this.state.agents[i].id == text){
                selText = this.state.agents[i].name;
                break;
            }
        }
        return selText
    }

    getSourceNameArr(){
        let names = ['...']
        for(var i = 0 ; i < this.state.sources.length ; i++){
            names.push(this.state.sources[i].label)
        }
        return names
    }

    getDropdownSourceText(text){
        let selText = "...";        
        for(var i = 0 ; i < this.state.sources.length ; i++){
            if(this.state.sources[i].source == text){
                selText = this.state.sources[i].label;
                break;
            }
        }
        return selText
    }

    getStatusNameArr(){
        let names = ['...']
        for(var i = 0 ; i < this.state.statuses.length ; i++){
            names.push(this.state.statuses[i].label)
        }
        return names
    }

    getDropdownStatusText(text){
        let selText = "...";
        for(var i = 0 ; i < this.state.statuses.length ; i++){
            if(this.state.statuses[i].status == text){
                selText = this.state.statuses[i].label;
                break;
            }
        }
        return selText
    }

    getTypeNameArr(){
        let names = ['...']
        for(var i = 0 ; i < this.state.types.length ; i++){
            names.push(this.state.types[i].label)
        }
        return names
    }

    getDropdownTypeText(text){
        let selText = "...";
        for(var i = 0 ; i < this.state.types.length ; i++){
            if(this.state.types[i].id == text){
                selText = this.state.types[i].label;
                break;
            }
        }
        return selText
    }

    getAreaNameArr(){
        let names = ['...']
        for(var i = 0 ; i < this.state.areas.length ; i++){
            names.push(this.state.areas[i].label)
        }
        return names
    }

    getDropdownAreaText(text){
        let selText = "...";
        for(var i = 0 ; i < this.state.areas.length ; i++){
            if(this.state.areas[i].id == text){
                selText = this.state.areas[i].label;
                break;
            }
        }
        return selText
    }

    getGroupNameArr(){
        let names = ['...']
        for(var i = 0 ; i < this.state.groups.length ; i++){
            names.push(this.state.groups[i].label)
        }
        return names
    }

    getDropdownGroupText(text){
        let selText = "...";
        for(var i = 0 ; i < this.state.groups.length ; i++){
            if(this.state.groups[i].id == text){
                selText = this.state.groups[i].label;
                break;
            }
        }
        return selText
    }  

    getShowText(text, len){        
        return text
        // return (text.length > len ? (text.substring(0, len) + "...") : text);
    } 

    getFieldList(values){       
        let arr = [];
        arr.push('...');       
        for(var i = 0 ; i < values.length ; i++)
            arr.push(values[i].value)
        return arr
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
                                    let autocomplete = this.state.autocomplete
                                    autocomplete.customer = {
                                        customer:text,                                        
                                        disabled:false,
                                        customers:res.body
                                    }                                    

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
    
    goToSearchResultScreen(){
        let filter = JSON.parse(JSON.stringify(this.state.search))
        filter.name = 'Custom search'
        // console.log(filter)
        // GlobalVals.currentSearchFilterParam = filter
      
        this.props.navigator.push({
            title: Locale.t('TICKETS_SEARCH.CUSTOM_SEARCH'),
            screen: "deskero.CustomSearchTicketsScreen",               
            passProps: {
                filter: filter
            },
            navigatorButtons: {
                leftButtons:[
                    {
                        id: 'back', 
                        icon: Images.backIcon,
                    }
                ],
                rightButtons: [    
                    {
                        id: 'addTicket',
                        icon: Images.ticketPlusIcon
                    },        
                    {
                        id: 'search',
                        icon: Images.searchIcon          
                    },
                    
                ]
            },
            
        })
       
    }

    renderCustomerList(){
        let customers = this.state.autocomplete.customer.customers.map((customer, i) => {
            return (
                <TouchableOpacity style={styles.autocompleteView} key={i} onPress={() => {
                    let autocomplete = this.state.autocomplete
                    let search = this.state.search
                    search.openedById = customer.id
                    search.openedByName = customer.name
                    autocomplete.customer ={
                        customer:customer.name,
                        disabled:true,
                        customers:[],
                        
                    };
                    
                    this.setState({
                        autocomplete,
                        search
                    })
                }}>
                    <Text style={{fontSize:14, color: 'rgb(128, 128, 128)'}}>{this.getShowText(customer.name + " " + (customer.email ? ("<" + customer.email + ">") : ""), 40)}</Text>
                </TouchableOpacity>
            )
        });
        return customers
    }

    renderCustomFields(){        
        let ticketFields = this.state.ticketCustomFields.map((field, i) => {
            return (
                field.type == 'TEXT' ?
                    <View style={styles.dropdownView}>
                        <Text style={[styles.labelText, {width:'40%'}]} numberOfLines={1} ellipsizeMode={'tail'}>{this.getCurrnetLanguage(field.labels) ? this.getCurrnetLanguage(field.labels) : field.name}</Text>
                        <TextInput 
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => {
                                let searchCustomFields = this.state.searchCustomFields;
                                searchCustomFields[field.name] = text;
                                this.setState({searchCustomFields})                 
                            }}
                            value={this.state.searchCustomFields[field.name]}
                        /> 
                    </View>                    
                : field.type == 'COMBO' ?
                    <View style={styles.dropdownView} key={i}>
                        <View style={{width:'60%'}}>
                            <Text style={styles.labelText} numberOfLines={2} ellipsizeMode={'tail'}>{this.getCurrnetLanguage(field.labels) ? this.getCurrnetLanguage(field.labels) : field.name}</Text>
                        </View>
                        <View style={{width:'40%'}}>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['...'].concat(field.values)}
                                style={styles.filterButtonContainerStyle}                            
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let searchCustomFields = this.state.searchCustomFields
                                    searchCustomFields[field.name] = value;
                                    this.setState({
                                        searchCustomFields
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                    <Text style={styles.buttonText}>{this.state.searchCustomFields[field.name]}</Text>
                                    <Icon
                                    style={styles.filterDropdownIcon}
                                    name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>
                    </View>
                : field.type == 'LINKED_COMBO' ?
                    <View style={styles.dropdownView} key={i}>
                        <View style={{width:'60%'}}>
                            <Text style={styles.labelText} numberOfLines={2} ellipsizeMode={'tail'}>{this.getCurrnetLanguage(field.labels) ? this.getCurrnetLanguage(field.labels) : field.name}</Text>
                        </View>
                        <View style={{width:'40%'}}>
                            <ModalDropdown
                                defaultIndex={0}
                                options={this.getFieldList(field.linkedValues)}
                                style={styles.filterButtonContainerStyle}                            
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    let searchCustomFields = this.state.searchCustomFields
                                    searchCustomFields[field.name] = value;
                                    this.setState({
                                        searchCustomFields
                                    })                             
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                <Text style={styles.buttonText}>{this.state.searchCustomFields[field.name]}</Text>
                                    <Icon
                                    style={styles.filterDropdownIcon}
                                    name="angle-down" size={18}
                                    />
                                </View>
                            </ModalDropdown>
                        </View>
                    </View>
                : null
                
            )            
        })
        return ticketFields;
    }

    render() { 
        return (
            <View style={styles.container}>   
                <View style={{width:'100%', backgroundColor: '#f5f5f5'}} >
                    <SearchBar
                        round
                        lightTheme
                        autoCapitalize = 'none'
                        containerStyle={{
                            width:'94%',
                            marginTop:14.5,
                            marginLeft:'3%',
                            marginRight:'3%',
                            backgroundColor:'transparent',
                            borderTopWidth:0,
                            borderBottomWidth:0                            
                        }}
                        inputStyle={{
                            backgroundColor:'#ffffff'
                        }}
                        onChangeText={(text) =>{
                            let search = this.state.search
                            search.query = text
                            this.setState({
                                search
                            })
                        }}
                        placeholder={Locale.t('TICKETS_SEARCH.INPUT_PLACEHOLDER')}
                        returnKeyType={'search'}
                        onSubmitEditing={(event) => {
                            this.goToSearchResultScreen()
                        }}
                    />
                    <KeyboardAwareScrollView ref="scroll">  
                        <View style={{marginHorizontal:'2.5%', marginTop:11, marginBottom:11,  backgroundColor:'#ffffff'}}>
                            
                            {/* Customer */}
                            {
                                this.state.autocomplete.customer.disabled ?
                                    <View style={styles.dropdownView}>
                                        <Text style={[styles.labelText, {width:'40%'}]}>{Locale.t('TICKETS_SEARCH.CUSTOMER')}</Text>                                    
                                        <Text style={[styles.buttonText, {width:'55%'}]}>{this.getShowText(this.state.autocomplete.customer.customer, 25)}</Text>
                                        <TouchableOpacity style={{alignItems:'flex-end'}} onPress={() => {
                                            let autocomplete = this.state.autocomplete;
                                            let search = this.state.search
                                            search.openedById = null
                                            search.openedByName = null
                                            autocomplete.customer = {
                                                customer:'',
                                                disabled:false,
                                                customers:[],                                          
                                            }      
                                            this.setState({
                                                autocomplete
                                            })                                  
                                        }}>
                                            <Ionicons name='ios-remove-circle-outline' size={20}/>
                                        </TouchableOpacity>
                                    </View>
                                    
                                :   
                                    <View style={styles.dropdownView}>
                                        <Text style={[styles.labelText, {width:'40%'}]}>{Locale.t('TICKETS_SEARCH.CUSTOMER')}</Text>
                                        <TextInput 
                                            style={styles.input}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(text) => {
                                                let autocomplete = this.state.autocomplete
                                                let search = this.state.search
                                                search.openedByName = text
                                                search.openedById = null
                                                autocomplete.customer.customer = text;                                                
                                                this.setState({autocomplete}, () => {
                                                    this.customerAutocomplete(text)
                                                })
                                            }}
                                            value={this.state.autocomplete.customer.customer}
                                        />                                  
                                    </View>                                               
                            }     
                            {/* Customers Search List */}
                            {
                                this.state.autocomplete.customer.customers.length > 0 &&
                                    this.renderCustomerList()                            
                            }   
                            {/* Assigned to */}
                            {
                                GlobalVals.permissions.viewAll &&
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('TICKETS_SEARCH.AGENT')}</Text>
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
                                            let search = this.state.search
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.agents.length ; i++){
                                                    if(value == this.state.agents[i].name){                                                    
                                                        search.assignedTo = this.state.agents[i].id
                                                        break;
                                                    }
                                                }
                                            }else{
                                                search.assignedTo = null
                                            }
 
                                            this.setState({search})                               
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownAssignedText(this.state.search.assignedTo)}</Text>
                                            <Icon
                                            style={styles.filterDropdownIcon}
                                            name="angle-down" size={18}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>
                            }   
                            {/* Sources */}
                            {
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('TICKETS_SEARCH.SOURCE')}</Text>
                                    <ModalDropdown
                                        defaultIndex={0}
                                        options={this.getSourceNameArr()}
                                        style={styles.filterButtonContainerStyle}
                                        // dropdownStyle={
                                        //     this.getSourceNameArr().length < 5 ? {                                
                                        //         height: (33 + StyleSheet.hairlineWidth) * (this.getSourceNameArr().length + 1)                                
                                        //     }
                                        //     : {}
                                        // }
                                        dropdownTextStyle={styles.filterButton}
                                        textStyle={styles.filterButton}
                                        onSelect={(idx, value) => {
                                            let search = this.state.search
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.sources.length ; i++){
                                                    if(value == this.state.sources[i].label){                                                    
                                                        search.source = this.state.sources[i].source
                                                        break;
                                                    }
                                                }
                                            }else{
                                                search.source = null
                                            }
                                            this.setState({search})   
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownSourceText(this.state.search.source)}</Text>
                                            <Icon
                                            style={styles.filterDropdownIcon}
                                            name="angle-down" size={18}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>
                            }                   
                            {/* Status */}
                            {
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('TICKETS_SEARCH.STATUS')}</Text>
                                    <ModalDropdown
                                        defaultIndex={0}
                                        options={this.getStatusNameArr()}
                                        style={styles.filterButtonContainerStyle}
                                        // dropdownStyle={
                                        //     this.getStatusNameArr().length < 5 ? {                                
                                        //         height: (33 + StyleSheet.hairlineWidth) * (this.getStatusNameArr().length + 1)                                
                                        //     }
                                        //     : {}
                                        // }
                                        dropdownTextStyle={styles.filterButton}
                                        textStyle={styles.filterButton}
                                        onSelect={(idx, value) => {
                                            let search = this.state.search
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.statuses.length ; i++){
                                                    if(value == this.state.statuses[i].label){
                                                        search.status = this.state.statuses[i].status
                                                        break;
                                                    }
                                                }
                                            }else{
                                                search.status = null
                                            }
                                            this.setState({search})   
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownStatusText(this.state.search.status)}</Text>
                                            <Icon
                                            style={styles.filterDropdownIcon}
                                            name="angle-down" size={18}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>
                            }       
                            {/* Types */}
                            {
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('TICKETS_SEARCH.TYPE')}</Text>
                                    <ModalDropdown
                                        defaultIndex={0}
                                        options={this.getTypeNameArr()}
                                        style={styles.filterButtonContainerStyle}
                                        // dropdownStyle={
                                        //     this.getTypeNameArr().length < 5 ? {                                
                                        //         height: (33 + StyleSheet.hairlineWidth) * (this.getTypeNameArr().length + 1)                                
                                        //     }
                                        //     : {}
                                        // }
                                        dropdownTextStyle={styles.filterButton}
                                        textStyle={styles.filterButton}
                                        onSelect={(idx, value) => {
                                            let search = this.state.search
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.types.length ; i++){
                                                    if(value == this.state.types[i].label){
                                                        search.type = this.state.types[i].id
                                                        break;
                                                    }
                                                }
                                            }else{
                                                search.type = null
                                            }
                                            this.setState({search})   
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownTypeText(this.state.search.type)}</Text>
                                            <Icon
                                            style={styles.filterDropdownIcon}
                                            name="angle-down" size={18}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>
                            }  
                            {/* Areas */}
                            {
                                this.state.areas.length > 0 &&
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('TICKETS_SEARCH.AREA')}</Text>
                                    <ModalDropdown
                                        defaultIndex={0}
                                        options={this.getAreaNameArr()}
                                        style={styles.filterButtonContainerStyle}
                                        // dropdownStyle={
                                        //     this.getAreaNameArr().length < 5 ? {                                
                                        //         height: (33 + StyleSheet.hairlineWidth) * (this.getAreaNameArr().length + 1)                                
                                        //     }
                                        //     : {}
                                        // }
                                        dropdownTextStyle={styles.filterButton}
                                        textStyle={styles.filterButton}
                                        onSelect={(idx, value) => {
                                            let search = this.state.search
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.areas.length ; i++){
                                                    if(value == this.state.areas[i].label){
                                                        search.area = this.state.areas[i].id
                                                        break;
                                                    }
                                                }
                                            }else{
                                                search.area = null
                                            }
                                            this.setState({search})   
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownAreaText(this.state.search.area)}</Text>
                                            <Icon
                                            style={styles.filterDropdownIcon}
                                            name="angle-down" size={18}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>
                            } 
                            {/* Groups */}
                            {
                                this.state.groups.length > 0 &&
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('TICKETS_SEARCH.GROUP')}</Text>
                                    <ModalDropdown
                                        defaultIndex={0}
                                        options={this.getGroupNameArr()}
                                        style={styles.filterButtonContainerStyle}
                                        // dropdownStyle={
                                        //     this.getGroupNameArr().length < 5 ? {                                
                                        //         height: (33 + StyleSheet.hairlineWidth) * (this.getGroupNameArr().length + 1)                                
                                        //     }
                                        //     : {}
                                        // }
                                        dropdownTextStyle={styles.filterButton}
                                        textStyle={styles.filterButton}
                                        onSelect={(idx, value) => {
                                            let search = this.state.search
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.groups.length ; i++){
                                                    if(value == this.state.groups[i].label){
                                                        search.group = this.state.groups[i].id
                                                        break;
                                                    }
                                                }
                                            }else{
                                                search.group = null
                                            }
                                            this.setState({search})   
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownGroupText(this.state.search.group)}</Text>
                                            <Icon
                                            style={styles.filterDropdownIcon}
                                            name="angle-down" size={18}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>
                            } 
                            {/* Priority */}
                            <View style={styles.dropdownView}>
                                <Text style={[styles.labelText, {width:'60%'}]}>{Locale.t('TICKETS_SEARCH.PRIORITY')}</Text>
                                <View style={{alignItems:'flex-end', justifyContent:'flex-end', width:'40%'}}>
                                    <Switch
                                        onValueChange={(value) => {   
                                            let search = this.state.search
                                            search.priority = value 
                                            this.setState({search})                        
                                        }}
                                        value={this.state.search.priority} />
                                </View>
                            </View>
                            {/* Tag */}
                            <View style={{paddingHorizontal:20, borderBottomColor:'rgba(0,0,0,0.2)', borderBottomWidth:0.8}}>
                                <TagInput
                                    inputColor={'rgb(128, 128, 128)'}
                                    inputProps={{
                                        placeholder:Locale.t('ADD_A_TAG')
                                    }}
                                    value={this.state.search.tags}
                                    onChange={(tags) => {
                                        let search = this.state.search
                                        search.tags = tags
                                        this.setState({search})    
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
                            <View style={{paddingTop: 44 * Metrics.scaleHeight}} />  
                        </View>  
                    </KeyboardAwareScrollView>      
                </View> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,    
      backgroundColor: '#f5f5f5',
    },        
    content:{
        width: Metrics.screenWidth - 13,
        marginLeft:6.5,
        marginRight:6.5,
        backgroundColor:'white',
        marginTop:11,
        marginBottom:11,
        borderColor:'rgb(228, 228, 228)',
        borderWidth:1       
    },
    emptyTxt:{
        fontFamily:'Helvetica Neue',
        color:'#ef473a',

    },
    rowBack: {
        flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff',		
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 44
	},	
	backRightBtnRight: {
		backgroundColor: 'white',
		right: 0
    },
    rowFront: {               
		justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1
    },
    leftBar:{
        width:5,
    },   
    itemView:{
        // height: 44,
        flexDirection:'row',
    },
    ticketSubject:{
        fontFamily:'Helvetica Neue',
        paddingLeft:9, 
        fontSize:16, 
        color:'rgb(223, 61, 0)'
    },
    ticketNumber:{
        fontFamily:'Helvetica Neue',
        paddingBottom:8, 
        fontSize:14, 
        color:'rgb(156, 155, 155)',
    },
    openedBy:{
        fontFamily:'Helvetica Neue',
        fontSize:11,
        color:'rgb(128, 128, 128)'
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
        width:'55%',
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
    badge:{
        width:18,
        height: 18,
        backgroundColor:"rgb(223, 61, 0)",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        borderWidth: 1,
        borderColor: 'rgb(223, 61, 0)'
    },   
    badgeEmpty:{
        backgroundColor:"rgb(182, 181, 181)",
        borderColor: 'rgb(182, 181, 181)'
    },
    badgeText:{
        fontFamily:'Helvetica Neue',
        color:'white',
        fontSize:10
    },
    buttonContainer: {
        backgroundColor:'#ffffff',        
    },    	
    item:{
        flexDirection:'row',
        height:44,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderBottomColor:'rgb(228, 228, 228)', 
        borderBottomWidth:1
    },	

})