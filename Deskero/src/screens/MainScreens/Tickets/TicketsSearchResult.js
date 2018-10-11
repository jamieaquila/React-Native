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
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import InfiniteScroll from 'react-native-infinite-scroll';
import TagInput from 'react-native-tag-input';
import ModalDropdown from 'react-native-modal-dropdown'
import { SearchBar } from 'react-native-elements'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import CardView from 'react-native-cardview'
import moment from 'moment'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'


export default class TicketsSearchResultScreen extends Component {    

    constructor(props){
        super(props)
        this.state ={
            filter:this.props.filter,
            tickets:[],
            morePageToLoad:true,
            nextPage:1,
            loadingComplete:false,
            refreshing:false,
            loading:true,
            role:GlobalVals.user.role,
            modalVisible:false,

            customer:{},
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
            dataReadStatus:false
        }
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            this.props.navigator.pop()
        }else if(event.id === 'add'){
            this.goToAddEditTicketScreen('new')
        }else if(event.id === 'search'){
            this.setState({modalVisible: true})
        }
    }

    runAction(item, ticket){
        if(item.action == 'edit'){
            GlobalVals.ticketToEdit = ticket;
            this.props.navigator.push({
                title: Locale.t('TICKET_EDIT.TITLE'),
                screen: "deskero.AddEditTicketScreen",     
                navigatorStyle: {
                    navBarHidden: false,
                    navBarButtonColor: '#ffffff',
                    navBarTextFontFamily:'Helvetica Neue',  
                    navBarBackgroundColor: 'rgb(223, 61, 0)',  
                    navBarTextColor: '#ffffff',
                },      
                passProps: {
                    status: 'edit'
                },    
                navigatorButtons: {
                    leftButtons:[
                        {
                            id: 'back', 
                            icon: Images.closeIcon,
                        }
                    ],
                    rightButtons: [            
                        {
                            id: 'save',
                            icon: Images.checkIcon,
                        }                        
                    ]
                },
            })
        }else if(item.action == 'delete'){
            Alert.alert(
                '',
                Locale.t('TICKETS.DELETE_CONFIRM_TEXT'),
                [
                    {text: Locale.t('TICKETS.DELETE_CONFIRM_NO'), onPress: () => {
            
                    }},
                    {text: Locale.t('TICKETS.DELETE_CONFIRM_YES'), onPress: () => {
                    localStorage.get('bearer').then((bearer) => {
                        localStorage.get('clientId').then((clientId) => {
                            Client.removeTicket(bearer, clientId, ticket.id)
                                .end((err, res) => {
                                    if(err){
                                        this.setState({loading: false})
                                    }else{
                                        if(res.body.id){
                                            let morePageToLoad = true;
                                            let nextPage = 1;
                                            let tickets = []; 
                                            this.setState({
                                                morePageToLoad,
                                                nextPage,
                                                tickets,
                                                loading: true
                                            }, () => {
                                                this.loadPage(morePageToLoad, nextPage, tickets)
                                            })
                                            
                                        }else{
                                            this.setState({loading: false})
                                        }
                                    }
                                })
                        })
                    })
                    }},
                ],
                { cancelable: false }
                )
                
        }else if(item.action == 'reply'){
            this.goToDetail(ticket)
        }
    }

    goToAddEditTicketScreen(status){
        if(status == 'new'){
            this.props.navigator.push({
                title: Locale.t('TICKET_NEW.TITLE'),
                screen: "deskero.AddEditTicketScreen",    
                navigatorStyle: {
                    navBarHidden: false,
                    navBarButtonColor: '#ffffff',
                    navBarTextFontFamily:'Helvetica Neue',  
                    navBarBackgroundColor: 'rgb(223, 61, 0)',  
                    navBarTextColor: '#ffffff',
                },           
                navigatorButtons: {
                    leftButtons:[
                        {
                            id: 'back', 
                            icon: Images.closeIcon,
                        }
                    ],
                    rightButtons: [            
                        {
                            id: 'save',
                            icon: Images.checkIcon,
                        }                        
                    ]
                },
            })
        }
    }

    goToDetail(ticket){
        this.props.navigator.push({
            title: ticket.number + " - " + ticket.subject,
            screen: "deskero.TicketDetailScreen",
            passProps:{
                id: ticket.id
            },
            navigatorStyle:{
                navBarTextFontSize: 20
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
                        id: 'menu',
                        icon: Images.menuIcon,
                    }                        
                ]
            },
        })
    }
    
    componentDidMount(){  
        
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getUpdates(bearer, clientId)
                    .then((res) => {
                        if(res == 'OK'){
                            this.loadPage()
                            // setTimeout(() => {
                            //     this.getGlobalData()
                            // }, 1500)                            
                        }                
                    })
                    .catch((err) => {
                        this.getGlobalData() 
                })
            })
        })
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

    ///////////////////////

    getGlobalData(){
        let search = this.state.search;        
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
        

        let priority = false
        search.priority = priority

        let tags = [];
        search.tags = [];

        let searchCustomFields = {}
        
        if(GlobalVals.ticketCustomFields){
            for(var i = 0 ; i < GlobalVals.ticketCustomFields.length ; i++){
                let field = GlobalVals.ticketCustomFields[i];
                searchCustomFields[field.name] = "...";                
            }
        }

        this.setState({
            search,            
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

    getShowText(text, len){        
        return (text.length > len ? (text.substring(0, len) + "...") : text);
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
            if(this.state.agents[i].id == this.state.search.assignedTo){
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

    getDropdownSourceText(){
        let selText = "...";        
        for(var i = 0 ; i < this.state.sources.length ; i++){
            if(this.state.sources[i].source == this.state.search.source){
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

    getDropdownStatusText(){
        let selText = "...";
        for(var i = 0 ; i < this.state.statuses.length ; i++){
            if(this.state.statuses[i].status == this.state.search.status){
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

    getDropdownTypeText(){
        let selText = "...";
        for(var i = 0 ; i < this.state.types.length ; i++){
            if(this.state.types[i].id == this.state.search.type){
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

    getDropdownAreaText(){
        let selText = "...";
        for(var i = 0 ; i < this.state.areas.length ; i++){
            if(this.state.areas[i].id == this.state.search.area){
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

    getDropdownGroupText(){
        let selText = "...";
        for(var i = 0 ; i < this.state.groups.length ; i++){
            if(this.state.groups[i].id == this.state.search.group){
                selText = this.state.groups[i].label;
                break;
            }
        }
        return selText
    }

    getShowText(text, len){        
        return (text.length > len ? (text.substring(0, len) + "...") : text);
    }  

    getFieldList(values){       
        let arr = [];
        arr.push('...');       
        for(var i = 0 ; i < values.length ; i++)
            arr.push(values[i].value)
        return arr
    }   

    customerAutocomplete(text){
        if(text.length > 3){
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
                    this.setState({autocomplete, search})
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
                                this.state.searchCustomFields[field.name] = text;
                                this.setState({
                                    searchCustomFields:this.state.searchCustomFields
                                })
                                
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
                                    this.state.searchCustomFields[field.name] = value;
                                    this.setState({
                                        searchCustomFields:this.state.searchCustomFields
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
                                    this.state.searchCustomFields[field.name] = value;
                                    this.setState({
                                        searchCustomFields:this.state.searchCustomFields
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

    doRefresh(){
        if(!this.state.loadingComplete)
            return

        let tickets = [];
        let nextPage = 1;
        this.setState({
            tickets,
            nextPage,
            refreshing: true,
            loadingComplete: false
        }, () => {
            this.loadPage();
        })
        
    }

    loadPage(){
        let morePageToLoad = this.state.morePageToLoad;
        let nextPage = this.state.nextPage;
        let tickets = this.state.tickets;
        if(nextPage == 1){
            tickets = [];
        }

        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getTicketSearchAll(bearer, clientId, this.state.nextPage, this.state.filter)
                    .end((err, res) => {
                        let loadingComplete = true;
                        let dataReadStatus = this.state.dataReadStatus
                        if(!dataReadStatus){
                            dataReadStatus = true
                            this.setState({dataReadStatus}, () => {
                                this.getGlobalData()
                            })                            
                        }
                        
                        if(err){
                            // console.log(err)
                            this.setState({loading: false})
                        }else{
                            if(res.body){
                                let result = res.body;
                                var j = 0;
                                var len = result.ticket.records.length;
                                if(nextPage == 1){
                                    tickets = [];
                                }
                                for(var i = 0 ; i < result.ticket.records.length ; i++){
                                    tickets.push(result.ticket.records[i]);
                                    j++;
                                    if(j == len){
                                        if(tickets.length < result.ticket.totalRecords){
                                            nextPage++;
                                        }else{
                                            morePageToLoad = false;
                                        }
                                    }
                                }
                            }else{
                                morePageToLoad = false;
                            }

                            this.setState({
                                loadingComplete,
                                morePageToLoad,
                                nextPage,
                                tickets,
                                loading:false,
                                refreshing:false
                            })
                        }
                    })

            })
        })
        
    }

    getLeftBarColor(status){
        let bgColor = {}
        switch(status){
            case 'solved':
                bgColor = {backgroundColor:'#099e00'}
                break;
            case 'opened':
                bgColor = {backgroundColor:'#d90000'}
                break;
            case 'closed':
                bgColor = {backgroundColor:'#099e00'}
                break;
            case 'onhold':
                bgColor = {backgroundColor:'#ffcc00'}
                break;
        }
        return bgColor;
    }

    getImageObj(source){
        if(source == 'web'){
            return Images.homeIcon
        }else if(source == 'chat'){
            return Images.chatIcon
        }else if(source == 'email'){
            return Images.emailIcon
        }else if(source == 'facebook'){
            return Images.facebookIcon
        }else if(source == 'twitter'){
            return Images.twitterIcon
        }else{
            return Images.phoneOutIcon
        }    
    }

    convertDate(milliseconds){
        let dateStr = moment(new Date(milliseconds).toISOString()).format("MM/DD/YY H:mm")
        return dateStr
    }

    createButtonArray(ticket){
        let arr = []
        if(GlobalVals.permissions.delete 
            && (GlobalVals.user.role == 'CUSTOMER' || (GlobalVals.user.role == 'AGENT' && ticket.assignedTo && ticket.assignedTo.id == GlobalVals.user.id)
            || (GlobalVals.user.role == 'AGENT' && ticket.assignedTo && ticket.assignedTo.id != GlobalVals.user.id && GlobalVals.permissions.global)))
        {
            let item = {
                action:'delete',
                right: 0,
                img: Images.deleteItemIcon
            }
            arr.push(item)
        }

        if(GlobalVals.permissions.edit 
            && (GlobalVals.user.role == 'CUSTOMER' || (GlobalVals.user.role == 'AGENT' && ticket.assignedTo && ticket.assignedTo.id == GlobalVals.user.id) 
            || (GlobalVals.user.role == 'AGENT' && ticket.assignedTo && ticket.assignedTo.id != GlobalVals.user.id && GlobalVals.permissions.global)))
        {
            let item = {
                action:'edit',
                right: arr.length == 1 ? 44 : 0,
                img: Images.editItemIcon
            }
            arr.push(item)
        }
        let item = {}
        item.action = 'reply';
        if(arr.length == 2){
            item.right = 88;
            item.img = Images.replyItemIcon
        }else if(arr.length == 1){
            item.right = 44;
            item.img = Images.replyItemIcon
        }else{
            item.right = 0;
            item.img = Images.replyItemIcon
        }

        arr.push(item)
        return arr;
    }

    renderTicketSearchModal(){
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {console.log("Modal has been closed.")}}
                >
                <View style={[{width:'100%', backgroundColor:'rgb(223, 61, 0)'}, Platform.OS === 'ios' ? { height: isIphoneX() ? 88 : 64 } : {height:57}]}>
                    <View style={Platform.OS === 'ios' ? { marginTop: isIphoneX() ? 54 : 32 } : { marginTop:22 }} />
                    <View style={{paddingHorizontal:16, width:'100%', flexDirection:'row', alignItems:'center'}}>
                        <TouchableOpacity style={{width:'15%', alignItems:'flex-start'}} onPress={()=>{ 
                                this.setState({modalVisible: false})
                            }}>
                            <Image style={Platform.OS === 'ios' ? {width:24, height:24} : {width:18, height:18}} source={Images.closeIcon} />
                        </TouchableOpacity>
                        <View style={ Platform.OS === 'ios' ? {width:'70%', alignItems:'center'} : {width:'70%', alignItems:'flex-start'}}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:18, color:'#ffffff', fontWeight:'400'}} >{Locale.t('TICKETS_SEARCH.TITLE')}</Text>
                        </View>
                        <TouchableOpacity style={{width:'15%', alignItems:'flex-end'}} onPress={()=>{ 
                                let search = JSON.parse(JSON.stringify(this.state.search))
                                GlobalVals.currentSearchFilterParam = JSON.stringify(search)
                                let filter = search
                                let loadingComplete = false;
                                let morePageToLoad = true;
                                let nextPage = 1;
                                let tickets = [];
                                
                                this.setState({
                                    filter, 
                                    modalVisible: false,
                                    loadingComplete,
                                    morePageToLoad,
                                    nextPage,
                                    tickets,
                                    loading: true
                                }, () => {
                                    this.loadPage()
                                })
                            }}>
                            <Image style={Platform.OS === 'ios' ? {width:24, height:24} : {width:18, height:18}} source={Images.searchIcon} />
                        </TouchableOpacity>                        
                    </View>
                </View>
                
                <View style={{width:'100%', backgroundColor: '#f5f5f5'}} >
                    <SearchBar
                            round
                            lightTheme
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
                                this.setState({search})
                            }}
                            placeholder={Locale.t('TICKETS_SEARCH.INPUT_PLACEHOLDER')}
                    />
                    <ScrollView ref="scroll">
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
                                            this.setState({autocomplete})
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
                                                this.setState({autocomplete, search}, ()=>{
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
                                            this.setState({
                                                search
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
                                            this.setState({
                                                search
                                            })
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownSourceText()}</Text>
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
                                            this.setState({
                                                search
                                            })
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownStatusText()}</Text>
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
                                            this.setState({
                                                search
                                            })
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownTypeText()}</Text>
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
                                            this.setState({
                                                search
                                            })
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownAreaText()}</Text>
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
                                            this.setState({
                                                search
                                            })
                                        }}
                                        >
                                        <View style={styles.filterButtonContent}>
                                        <Text style={styles.buttonText}>{this.getDropdownGroupText()}</Text>
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
                            <View style={{paddingHorizontal:20, borderBottomColor:'rgba(0,0,0,0.2)', borderBottomWidth:1}}>
                                <TagInput
                                    inputColor={'rgb(128, 128, 128)'}
                                    inputProps={{
                                        placeholder:Locale.t('ADD_A_TAG')
                                    }}
                                    value={this.state.search.tags ? this.state.search.tags : []}
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
                    </ScrollView>     
                </View>   
                
            </Modal>
        )
    }
    
    renderListRowContent(ticket){
        return (
            <TouchableHighlight
                onPress={ () =>{
                    this.goToDetail(ticket)
                }}
                style={[styles.rowFront]}
                underlayColor={'#ddd'}
                >
                <View style={styles.itemView}>
                    <View style={[styles.leftBar, ticket.status ? this.getLeftBarColor(ticket.status.status) : {backgroundColor:'#099e00'}]} />
                    <View style={{padding:12}}>
                        <View style={{flexDirection:'row', paddingBottom:8, width:'100%'}}>
                            <View style={{width:'8%'}}>
                                <Image style={{width:20, height:20}} source={this.getImageObj(ticket.source.source)} />
                            </View>
                            <View style={{width:'92%'}}>
                                <Text style={styles.ticketSubject} numberOfLines={1} ellipsizeMode={'tail'}>{ticket.subject}</Text>
                            </View>
                        </View>
                        {
                            ticket.meInCc == true ?
                            <View style={{flexDirection:'row'}}>
                                <Text style={[styles.ticketNumber, {fontWeight:'bold'}]}>CC #{ticket.number}></Text>
                                <Text style={[styles.ticketNumber]}> - {this.convertDate(ticket.insertDate)}</Text>
                            </View>  
                            :
                            <View style={{flexDirection:'row'}}>
                                <Text style={[styles.ticketNumber, {fontWeight:'bold'}]}>#{ticket.number}</Text>
                                <Text style={[styles.ticketNumber]}> - {this.convertDate(ticket.insertDate)}</Text>
                            </View>
                        }                                
                        <View style={{flexDirection:'row', paddingBottom:9}}>
                            {
                                (this.state.role == 'AGENT' && ticket.assignedTo && ticket.assignedTo.id != this.state.role) ?
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={styles.openedBy} >{ticket.openedBy.name}</Text>
                                        <Image style={{width:5, height:6.5, marginTop:4, marginLeft:10, marginRight:8}} source={Images.arrowIcon} />
                                        <Text style={styles.openedBy}>{ticket.assignedTo.name}</Text>
                                    </View>
                                :
                                    <Text style={styles.openedBy}>{ticket.openedBy.name}</Text>
                            }                                  
                        </View>                                    
                    </View>
                </View>
            </TouchableHighlight>  
        )
    }

    renderListRow(ticket){
        return (
            Platform.OS == 'android' ?
                <CardView
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={0}>
                    {
                        this.renderListRowContent(ticket)
                    }
                    <View style={{width:'100%', height: 5 * Metrics.scaleHeight}} />    
                </CardView>    
            :
                <View style={{
                    width:'100%',
                    backgroundColor:'transparent',
                    shadowColor:'rgba(0, 0, 0, 0.2)',
                    shadowOffset: {
                        width:1,
                        height: 1
                    },
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    zIndex:10,
                    }}>
                    {
                        this.renderListRowContent(ticket)
                    }
                    <View style={{width:'100%', height: 5 * Metrics.scaleHeight}} />
                </View>  
        )      
    }

    renderListHiddenRow(ticket){
        let arr = this.createButtonArray(ticket)
        let buttons = arr.map((item, i) => {
            return (
                <TouchableOpacity key={i} style={[styles.backRightBtn, styles.backRightBtnRight, {right: item.right}]} onPress={() => {
                    this.runAction(item, ticket)
                }}>
                    <Image style={{width: 33.5, height: 33.5}} source={item.img} />
                    
                 </TouchableOpacity>
            )
        })
        
        return (
            <View style={styles.rowBack}>
            { buttons }            
            </View>
        )
    }

    renderContent(){
        return (
            this.state.tickets.length == 0 && !this.state.loading && !this.state.refreshing ?
                <View style={{width:'100%', alignItems:'center', paddingTop:11}}>
                    <Text style={styles.emptyTxt}>No results found</Text>
                </View>
            :
                <View style={styles.content}>
                    <SwipeListView
                        dataSource={this.ds.cloneWithRows(this.state.tickets)}
                        enableEmptySections={true}
                        renderRow={ (ticket, secId, rowId, rowMap) => {
                            return this.renderListRow(ticket)
                        }}
                        renderHiddenRow={ (ticket, secId, rowId, rowMap) => {
                            return this.renderListHiddenRow(ticket)
                        }}
                        rightOpenValue={-132}
                    />   
                </View>
            
            
        )
    }

    render() { 
        return (
            <View style={styles.container}> 
            {
                this.state.loading &&
                <View style={{width:'100%', height:40, paddingTop:20, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#ff0000" />
                </View>
            } 
             
                <InfiniteScroll
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.doRefresh()
                            }}
                            tintColor="#ff0000"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#fff"
                        />
                    }
                    horizontal={false}  //true - if you want in horizontal
                    onLoadMoreAsync={()=>{
                        if(this.state.morePageToLoad && this.state.loadingComplete){     
                            this.setState({loadingComplete: false}, () => {
                                this.loadPage()
                            })                       
                            
                        }                            
                    }}
                    distanceFromEnd={400} // distance in density-independent pixels from the right end
                    >
                    {
                        this.renderContent()
                    }
                    
                </InfiniteScroll>        
                {
                    this.renderTicketSearchModal()
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
        width:Metrics.screenWidth - 13,
        backgroundColor:'white',
        marginTop:11,
        marginBottom:11,
        // borderColor:'rgb(228, 228, 228)',
        // borderWidth:0.5        
    },
    emptyTxt:{
        fontFamily:'Helvetica Neue',
        color:'#ef473a',

    },
    rowBack: {
		alignItems: 'center',
		backgroundColor: '#fff',
		flex: 1,
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
	backRightBtnLeft: {
		backgroundColor: 'white',
		right: 44
	},
	backRightBtnRight: {
		backgroundColor: 'white',
		right: 0
    },
    rowFront: {               
		justifyContent: 'center',
		backgroundColor: '#fff',		
        // borderBottomColor:'rgb(228, 228, 228)',
        // borderBottomWidth:0.5 * Metrics.scaleHeight
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
    buttonContainer: {
        backgroundColor:'#ffffff',        
    }

})