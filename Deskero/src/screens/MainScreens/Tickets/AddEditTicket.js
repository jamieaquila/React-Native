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
    FlatList,
    ActivityIndicator,
    WebView,
    Image
  } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TagInput from 'react-native-tag-input';
import ModalDropdown from 'react-native-modal-dropdown'
import ActionSheet from 'react-native-actionsheet'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs'
const FilePickerManager = require('NativeModules').FilePickerManager;
import MyWebView from 'react-native-webview-autoheight';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import moment from 'moment'
import { isIphoneX } from 'react-native-iphone-x-helper'

import { Client, localStorage, countryNames } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { startMainTab } from '../../../app'
import { RichTextEditorModal } from '../../../components'

const options = Platform.OS === 'ios' 
    ? [ Locale.t('PROFILE.CANCEL'), Locale.t('PROFILE.SELECT_CAMERA'), Locale.t('PROFILE.SELECT_LIBRARY'), Locale.t('PROFILE.BROWSE')] 
    : [ Locale.t('PROFILE.CANCEL'), Locale.t('PROFILE.SELECT_CAMERA'), Locale.t('PROFILE.BROWSE') ]
const CANCEL_INDEX = 0

const customStyle = "<style>* {max-width: 100%;} body {font-family: Helvetica Neue;}}</style>";

export default class AddEditTicketScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            customer:{},
            ticket:{
                assignedTo:{},
                openedBy:{},
                status:{
                    status: "opened"
                },
                type:{},
                priority: false,
                tags: [],
                subject: "",
                description: ""
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
            newTicketCustomFields:{},
            ticketCustomFields:[],  
            attachedDocuments:[],            
            newCustomerModalVisible:false,
            ccModalVisible:false,
            selectedCC:'',
            agents:[],
            statuses:[],
            types:[],
            areas:[],
            groups:[],

            emptyCustomer: false,
            emptyAssignedTo: false,
            emptyStatus: false,
            emptyType: false,
            emptySubject: false,
            emptyDescription: false,
            httpDomain: undefined,
            richRextModalVisible: false,
            lastPress: 0
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            this.showDialogBox('newTicket')
        }else if(event.id === 'save'){
            this.saveNewTicket()
        }
    }

    componentDidMount(){   
        localStorage.get('httpDomain').then((httpDomain) => {
            this.setState({httpDomain})
        })
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {

                Client.getUpdates(bearer, clientId)
                    .then((res) => {
                        if(res == 'OK'){
                            let ticket = this.state.ticket;
                            localStorage.get('userId').then((userId) =>{
                                ticket.assignedTo.id = userId;
                                this.setState({ticket}, () => {
                                    setTimeout(() => {
                                        this.getGlobalData()
                                    }, 1000)
                                })                                
                            })
                            
                            
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

    getGlobalData(){
        
        let newTicketCustomFields = {}        
        let ticket = this.state.ticket;
        let attachedDocuments = this.state.attachedDocuments

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
        // console.log(GlobalVals.types)

        let areas = [];
        if(GlobalVals.areas){
            ticket.area = {}
            ticket.area.id = "";
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
            ticket.group = {}
            ticket.group.id = "";
            for(var i = 0 ; i < GlobalVals.groups.length ; i++){
                let group = {
                    id: GlobalVals.groups[i].id,
                    label: this.getCurrnetLanguage(GlobalVals.groups[i].labels) ? this.getCurrnetLanguage(GlobalVals.groups[i].labels) : GlobalVals.groups[i].group
                }
                groups.push(group)
            }
        }

        let selectedCC = ""
        let autocomplete = this.state.autocomplete
        
        if( GlobalVals.ticketCustomFields){
            for(var i = 0 ; i < GlobalVals.ticketCustomFields.length ; i++){
                let field = GlobalVals.ticketCustomFields[i];
                newTicketCustomFields[field.name] = "...";                
            }
        }
        
        if(this.props.status == 'edit'){
            if(GlobalVals.ticketToEdit){                
                ticket = GlobalVals.ticketToEdit
                if(ticket.area == null){
                    ticket.area = {}
                    ticket.area.id = ""
                }

                if(ticket.group == null){
                    ticket.group = {}
                    ticket.group.id = ""
                }
                if(ticket.cc != null){
                    let cc = []
                    for(var i = 0 ; i < ticket.cc.length ; i++){                        
                        cc.push({id: ticket.cc[i].id})
                    }
                    ticket.cc = cc;

                    for(var i = 0 ; i < ticket.cc.length ; i++){
                        for(var j = 0 ; j < agents.length ; j++){
                            if(ticket.cc[i].id == agents[j].id){
                                selectedCC += agents[j].name + ","
                                agents[j].state = true
                                break;
                            }
                        }
                    }
                }

                autocomplete.customer = {
                    customer: ticket.openedBy.name,
                    disabled: true,
                    customers: []
                }

                if(typeof ticket.customFields !== 'undefined'){
                    for(var key in ticket.customFields){
                        var field = GlobalVals.ticketCustomFields.filter(el => el.name == key)[0]
                        if(field.type == 'LINKED_COMBO'){
                            var valueToSelect = field.linkedValues.filter(e=> e.value == ticket.customFields[key])[0]
                            if(valueToSelect == null || valueToSelect == "")
                                newTicketCustomFields[key] = "..."
                            else{
                                newTicketCustomFields[key] = valueToSelect.value
                            }
                        }else if(field.type == 'COMBO'){
                            if(ticket.customFields[key] == null || ticket.customFields[key] == "")
                                newTicketCustomFields[key] = "..."
                            else
                                newTicketCustomFields[key] = ticket.customFields[key];
                        }else{
                            newTicketCustomFields[key] = ticket.customFields[key];
                        }
                    }
                }

                if(ticket.priority == 0) ticket.priority = false
                else if(ticket.priority == 1) ticket.priority = true

                if(ticket.attachedDocuments){
                    for(var i = 0 ; i < ticket.attachedDocuments.length; i++){
                        if(ticket.attachedDocuments[i].documentName.length > 25){
                            ticket.attachedDocuments[i].documentName = ticket.attachedDocuments[i].documentName.substring(0, 25) + "..."
                        }
                    }
                    attachedDocuments = ticket.attachedDocuments
                }
                
                if(attachedDocuments.length > 0 && !attachedDocuments[0].documentId){
                    let url = attachedDocuments[0].documentURL;
                    let url_array = url.split("/")
                    let len = url_array.length - 1
                    attachedDocuments[0].documentId = url_array[len];
                }
            }
        }
        
        this.setState({
            ticket,
            selectedCC,
            agents,
            statuses,
            types,
            areas,
            groups,
            autocomplete,
            newTicketCustomFields,
            ticketCustomFields: GlobalVals.ticketCustomFields,
            attachedDocuments,
            loading:false
        })
        
    }

    saveNewTicket(){
        let newTicket = JSON.parse(JSON.stringify(this.state.ticket))
              
        let emptyCustomer = false
        let emptyAssignedTo = false
        let emptyStatus = false
        let emptyType = false
        let emptySubject = false
        let emptyDescription = false

        if(!newTicket.openedBy.id || newTicket.openedBy.id == "" || newTicket.openedBy.id == null){
            emptyCustomer = true
        }

        if(!newTicket.assignedTo.id || newTicket.assignedTo.id == "" || newTicket.assignedTo.id == null){  
            emptyAssignedTo = true
        }

        if(!newTicket.type.id || newTicket.type.id == "" || newTicket.type.id == null){
            emptyType = true
        }

        if(!newTicket.status.status || newTicket.status.status == "" || newTicket.status.status == "..." || newTicket.status.status == null){            
            emptyStatus = true
        }
        
        if(!newTicket.subject || newTicket.subject == "" || newTicket.subject == null){
            emptySubject = true
        }

        if(!newTicket.description || newTicket.description == "" || newTicket.description == null){
            emptyDescription = true
        }        

        newTicket.attachedDocuments = this.state.attachedDocuments
        if(newTicket.attachedDocuments.length == 0)
            delete newTicket.attachedDocuments

        if(GlobalVals.user.role == 'CUSTOMER'){            
            delete newTicket.assignedTo
            newTicket.openedBy = {
                id: GlobalVals.user.id
            }
            newTicket.status = {
                status: 'opened'
            }

            if(emptyAssignedTo || emptyStatus || emptyType || emptySubject || emptyDescription){
                this.setState({
                    emptyCustomer,
                    emptyAssignedTo,
                    emptyStatus,
                    emptyType,
                    emptySubject,
                    emptyDescription
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            emptyCustomer: false,
                            emptyAssignedTo: false,
                            emptyStatus: false,
                            emptyType: false,
                            emptySubject: false,
                            emptyDescription: false
                        })
                    }, 2000)
                })
                return;
            }
        }else{
            if(emptyCustomer || emptyAssignedTo || emptyStatus || emptyType || emptySubject || emptyDescription){
                this.setState({
                    emptyAssignedTo,
                    emptyStatus,
                    emptyType,
                    emptySubject,
                    emptyDescription
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            emptyAssignedTo: false,
                            emptyStatus: false,
                            emptyType: false,
                            emptySubject: false,
                            emptyDescription: false
                        })
                    }, 2000)
                })
                return;
            }
        }

        if(newTicket.tags == null || newTicket.tags.length == 0)
            newTicket.tags = null
        
        if(newTicket.priority == true) newTicket.priority = 1
        else newTicket.priority = 0

        if(!newTicket.area || !newTicket.area.id || newTicket.area.id == '' || newTicket.area.id == null)
            delete newTicket.area
        
        if(!newTicket.group || !newTicket.group.id || newTicket.group.id == '' || newTicket.group.id == null)
            delete newTicket.group
        
        if(typeof this.state.newTicketCustomFields != 'undefined'){
            let customFields = {}
            
            for (var key in this.state.newTicketCustomFields) {
                if(this.state.newTicketCustomFields[key] != '' && this.state.newTicketCustomFields[key] != '...'){
                    customFields[key] = this.state.newTicketCustomFields[key]
                }
            }
            newTicket.customFields = customFields;
        }
        this.setState({loading: true})

        
        if(this.props.status == 'edit'){
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.updateTicket(bearer, clientId, newTicket)
                        .end((err, res) => {
                            if(err){
                                // console.log(err)
                                this.setState({loading: false})
                            }else{
                                if(res.body.id){
                                    this.setState({loading: false}, () => {
                                        setTimeout(()=>{
                                            if(GlobalVals.user.role == 'CUSTOMER'){                                                    
                                                startMainTab(1)                                                    
                                            } else{                                                    
                                                startMainTab(2)
                                            }
                                                
                                        }, 700)
                                    })
                                    
                                }else{
                                    // console.log(res.body)
                                    this.setState({loading: false})
                                }
                            }
                        })
                })
            })
        }else{
            let strArr = this.state.ticket.description.split('\n')
            if(strArr.length > 0){
                newTicket.description = ""
                for(var i = 0 ; i < strArr.length ; i++){
                    newTicket.description += strArr[i].slice(0, strArr[i].length) + "<br>"
                }
            }
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.createTicket(bearer, clientId, newTicket)
                        .end((err, res) => {
                            if(err){
                                // console.log(err.message)
                                this.setState({loading: false})
                            }else{
                                if(res.body.number){
                                    // console.log(res.body.number)
                                    this.setState({loading: false}, () => {
                                        setTimeout(()=>{
                                            if(GlobalVals.user.role == 'CUSTOMER'){
                                                startMainTab(1)
                                            }else{
                                                startMainTab(2)
                                            }
                                                
                                        }, 700)
                                    })
                                    
                                }else{
                                    // console.log(res.body)
                                    this.setState({loading: false})
                                }
                            }
                        })
                })
            })
        }
    }

    getHtmlStr(htmlStr){
        var textToReplace = String(htmlStr)
        if(this.state.httpDomain)
            textToReplace = textToReplace.replace('src="/inlineImage', 'src="' + this.state.httpDomain + "inlineImage")
        return textToReplace
    }

    removeEditUpload(){
        if(this.props.status == 'edit'){
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.removeTicketAttachment(bearer, clientId, this.state.ticket.id, this.state.attachedDocuments[0].documentId)
                        .end((err, res) => {
                            // console.log(res.body)
                            this.setState({attachedDocuments: []})
                        })
                })
            })
        }else{
            this.setState({attachedDocuments:[]})  
        }
    }

    showDialogBox(state){    
        Alert.alert(
            Locale.t('CONFIRM_DISCARD_TITLE'),
            Locale.t('CONFIRM_DISCARD_TEXT'),         
            [
                {text: Locale.t('CONFIRM_DISCARD_NO'), onPress: () => {
        
                }},
                {text: Locale.t('CONFIRM_DISCARD_YES'), onPress: () => {
                    if(state == 'newTicket')
                        this.props.navigator.pop();
                    else if('newCustomer')
                        this.setState({newCustomerModalVisible: false})                
                
                }},
            ],
            { cancelable: false }
        )
    }

    showActionSheet(){
        this.ActionSheet.show()  
    }

    openPicker(index){ 
        if(index == 1){
            ImagePicker.openCamera({
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
                includeBase64: true,
              }).then(image => {
                const split = image.path.split('/');
                let name = "IMG_" + moment(new Date().toISOString()).valueOf() + "." + split.pop().split('.')[1];
                let afile = {}
                let attachedDocuments = [];
                afile.documentName = name
                afile.documentType = image.mime;
                afile.documentBase64 = image.data;                
                attachedDocuments.push(afile)
                this.setState({
                    attachedDocuments
                })   
              })//.catch(e => alert(e));
        }else if(index == 2){
            if(Platform.OS === 'ios'){
                ImagePicker.openPicker({
                    compressImageMaxWidth: 500,
                    compressImageMaxHeight: 500,
                    multiple: true,
                    includeBase64: true,
                }).then(images => {                
                    let attachedDocuments = [];
                    for(var i = 0 ; i < images.length; i++){
                        let afile = {}
                        afile.documentName = images[i].filename;
                        afile.documentType = images[i].mime;
                        afile.documentBase64 = images[i].data;                
                        attachedDocuments.push(afile)
                    }                
                    this.setState({
                        attachedDocuments
                    })  
                })
            }else{                
                FilePickerManager.showFilePicker(null, (response) => {
                    // console.log('Response = ', response);                  
                    if (response.didCancel) {
                    //   console.log('User cancelled file picker');
                    }
                    else if (response.error) {
                    //   console.log('FilePickerManager Error: ', response.error);
                    }
                    else {
                        RNFS.readFile(response.path, 'base64')
                            .then((success) => {
                                let afile = {}
                                let attachedDocuments = [];
                                afile.documentName = response.fileName;
                                afile.documentType = response.type;
                                afile.documentBase64 = success;                
                                attachedDocuments.push(afile)
                                this.setState({
                                    attachedDocuments
                                })   
                            })
                            .catch((err) => {
                                // console.log(err)
                        })
                    }
                });
            }
            
        }else if(index == 3){
            DocumentPicker.show({
                filetype: [DocumentPickerUtil.allFiles()],
              },(error,res) => {
                const split = res.uri.split('/');
                let name = split.pop();
                if(name.includes("%20")){
                    name = name.replace("%20", " ")
                }
                const inbox = split.pop();
                const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
                RNFS.readFile(realPath, 'base64')
                    .then((success) => {
                        let afile = {}
                        let attachedDocuments = [];
                        afile.documentName = name;
                        afile.documentType = this.getFileType(name);
                        afile.documentBase64 = success;                
                        attachedDocuments.push(afile)
                        this.setState({
                            attachedDocuments
                        })   
                    })
                    .catch((err) => {
                        // console.log(err)
                    })
            });
        }
    }

    getFileType(name){
        let arr = name.split('.')
        let ext = arr[1].toLowerCase()
        if(ext == 'jpeg' || ext == 'jpg' || ext == 'png'){
            return "image/" + ext
        }else if(ext == 'pdf'){
            return "application/" + ext
        }else if(ext == 'aac' || ext == 'mp3' || ext == 'wav' || ext == '3gpp' || ext == 'smf' || ext == 'ogg' || ext == 'mp4'){
            return "audio/" + ext
        }else return "application/" + ext 
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
            if(this.state.agents[i].id == this.state.ticket.assignedTo.id){
                selText = this.state.agents[i].name;
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
            if(this.state.statuses[i].status == this.state.ticket.status.status){
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
            if(this.state.types[i].id == this.state.ticket.type.id){
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
            if(this.state.areas[i].id == this.state.ticket.area.id){
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
            if(this.state.groups[i].id == this.state.ticket.group.id){
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

    getFieldList(field){       
        let arr = [];
        arr.push('...');       
        let fieldArr = field.linkedValues.filter(x =>  x.parentKey == this.state.newTicketCustomFields[field.linkedField])
        for(var i = 0 ; i < fieldArr.length ; i++)
            arr.push(fieldArr[i].value)
        return arr
    }   

    getIcons() {
        const texts = {};
        // texts['INST_IMAGE'] = require('../../../assets/img/icon_format_media.png');
        texts['bold'] = require('../../../assets/img/icon_format_bold.png');
        texts['italic'] = require('../../../assets/img/icon_format_italic.png');
        texts['unorderedList'] = require('../../../assets/img/icon_format_ul.png');
        texts['orderedList'] = require('../../../assets/img/icon_format_ol.png');
        texts['INST_LINK'] = require('../../../assets/img/icon_format_link.png');
        return texts;
    }

    customerAutocomplete(text){
        if(text.length > 2){
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.searchCustomer(bearer, clientId, text)
                        .end((err, res) => {                            
                            if(err){
                                // alert("err")
                                // this.state.autocomplete.customer.customer = text;
                                // this.setState({autocomplete:this.state.autocomplete})
                            }else{
                                if(res.body){   
                                    // alert(JSON.stringify(res.body))     
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
                                    // alert("err")
                                    // this.state.autocomplete.customer.customer = text;
                                    // this.setState({autocomplete:this.state.autocomplete})
                                }
                            }
                        })
                })
            })
        }
    }

    companyAutocomplete(text){
        if(text.length > 3){
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.getSearchCompany(bearer, clientId, text)
                        .end((err, res) => {                            
                            if(err){
                                // this.state.autocomplete.customer.customer = text;
                                // this.setState({autocomplete:this.state.autocomplete})
                            }else{
                                if(res.body){      
                                    let autocomplete = this.state.autocomplete
                                    autocomplete.company = {
                                        disabled:false,
                                        companies:res.body
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

    createCustomer(){
        if(this.state.customer.name && this.state.customer.name != '' && this.state.customer.email && this.state.customer.email != ''){
            let customer = this.state.customer
            customer.customFields = {}
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.createCustomer(bearer, clientId, customer)
                        .end((err, res) => {
                            if(err){
                                this.setState({loading: false})
                            }else{
                                if(res.body.id){
                                    let autocomplete = this.state.autocomplete
                                    autocomplete.customer.customer = customer.name
                                    autocomplete.customer.openedById = res.body.id
                                    autocomplete.customer.openedByName = customer.name
                                    customer = {}
                                    this.setState({autocomplete, customer, newCustomerModalVisible: false, loading: false})
                                }else{
                                    this.setState({loading: false})
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
                    let ticket = this.state.ticket
                    ticket.openedBy.id = customer.id
                    autocomplete.customer ={
                        customer:customer.name,
                        disabled:true,
                        customers:[],
                        openedById:customer.id,
                        openedByName:customer.name
                        
                    };
                    this.setState({autocomplete, ticket})
                }}>
                    <Text style={{fontSize:14, color: 'rgb(128, 128, 128)'}}>{this.getShowText(customer.name + " " + (customer.email ? ("<" + customer.email + ">") : ""), 40)}</Text>
                </TouchableOpacity>
            )
        });
        return customers
    }

    renderCompanyList(){
        let companies = this.state.autocomplete.company.companies.map((company, i) => {
            return (
                <TouchableOpacity style={styles.autocompleteView} key={i} onPress={() => {
                    let customer = this.state.customer
                    let autocomplete = this.state.autocomplete
                    customer.company = company.name
                    autocomplete.company.disabled = true;
                    autocomplete.company.companies = [];
                    
                    this.setState({autocomplete, customer})
                }}>
                    <Text style={{fontSize:14, color: 'rgb(128, 128, 128)'}}>{company.name}</Text>
                </TouchableOpacity>
            )
        })
        return companies
    }

    renderModalHeader(title, curModal){
        return (
            <View style={[{width:'100%', backgroundColor:'rgb(223, 61, 0)'}, Platform.OS === 'ios' ? { height: isIphoneX() ? 88 : 64 } : {height:57}]}>
                <View style={Platform.OS === 'ios' ? { marginTop: isIphoneX() ? 54 : 32 } : {marginTop:22}} />
                <View style={{paddingHorizontal:16, width:'100%', flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity style={{width:'15%', alignItems:'flex-start'}} onPress={()=>{ 
                        if(curModal == 'customer'){
                            this.showDialogBox('newCustomer')
                        }else if(curModal == 'cc'){
                            this.setState({ccModalVisible: false})
                        }
                        }}>
                        <Image style={Platform.OS === 'ios' ? {width:24, height:24} : {width:18, height:18}} source={Images.closeIcon} />
                    </TouchableOpacity>
                    <View style={ Platform.OS === 'ios' ? {width:'70%', alignItems:'center'} : {width:'70%', alignItems:'flex-start'}}>
                        <Text style={{fontFamily:'Helvetica Neue', fontSize:18, color:'#ffffff', fontWeight:'400'}} >{title}</Text>
                    </View>
                    <TouchableOpacity style={{width:'15%', alignItems:'flex-end'}} onPress={()=>{ 
                            if(curModal == 'customer'){
                                this.setState({loading: true}, () =>{
                                    this.createCustomer()
                                })
                                
                            }else if(curModal == 'cc'){
                                let ticket = this.state.ticket;
                                let selectedCC = ''
                                ticket.cc = []
                                for(var i = 0 ; i < this.state.agents.length ; i++){
                                    if(this.state.agents[i].state){
                                        ticket.cc.push({id:this.state.agents[i].id})
                                        selectedCC = selectedCC + this.state.agents[i].name + ", "
                                    }
                                }
                                this.setState({ticket, selectedCC, ccModalVisible: false})
                            }
                        }}>
                        <Image style={Platform.OS === 'ios' ? {width:24, height:24} : {width:18, height:18}} source={Images.checkIcon} />
                    </TouchableOpacity>                        
                </View>

            </View>
        )
    }

    renderNewCustomerModal(){
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.newCustomerModalVisible}
                onRequestClose={() => {console.log("Modal has been closed.")}}
                >
                {
                    this.renderModalHeader(Locale.t('CUSTOMER_NEW.TITLE'), 'customer')
                }
                <ScrollView ref="scroll">
                    <View style={{width:'100%', backgroundColor: '#f5f5f5'}} >
                        <View style={{marginHorizontal:'2.5%', marginTop:11, marginBottom:11,  backgroundColor:'#ffffff'}}>
                            <View style={styles.dropdownView}>
                                <View style={{flexDirection:'row', width:'40%', paddingLeft:20}}>
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
                                    value={this.state.customer.name ? this.state.customer.name : ''}
                                />  
                            </View>

                            <View style={styles.dropdownView}>
                                <View style={{flexDirection:'row', width:'40%', paddingLeft:20}}>
                                    <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('CUSTOMER_NEW.EMAIL')}</Text>
                                    <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                                </View>
                                <TextInput 
                                    style={styles.input}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(text) => {
                                        let customer = this.state.customer
                                        customer.email = text;
                                        this.setState({customer}) 
                                        
                                    }}
                                    value={this.state.customer.email ? this.state.customer.email : ''}
                                />  
                            </View>

                            <View style={styles.dropdownView}>
                                <Text style={styles.labelText}>{Locale.t('CUSTOMER_NEW.TOPCLIENT')}</Text>
                                <View style={{alignItems:'flex-end', justifyContent:'flex-end', width:'75%'}}>
                                    <Switch
                                        onValueChange={(value) => {    
                                            let customer = this.state.customer
                                            customer.topClient = value;
                                            this.setState({customer})                    
                                            }}
                                        value={this.state.customer.topClient ? this.state.customer.topClient : false} />
                                </View>
                            </View>

                            <View style={styles.dropdownView}>
                                <Text style={[styles.labelText, {width:'40%'}]}>{Locale.t('CUSTOMER_NEW.PHONE')}</Text>
                                <TextInput 
                                    style={styles.input}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(text) => {
                                        let customer = this.state.customer
                                        customer.phoneNumber = text;
                                        this.setState({customer}) 
                                        
                                    }}
                                    value={this.state.customer.phoneNumber ? this.state.customer.phoneNumber : ''}
                                />  
                            </View>

                            {
                                this.state.autocomplete.company.disabled ?
                                    <View style={styles.dropdownView}>
                                        <Text style={[styles.labelText, {width:'40%'}]}>{Locale.t('CUSTOMER_NEW.COMPANY')}</Text>                                    
                                        <Text style={[styles.buttonText, {width:'55%'}]}>{this.getShowText(this.state.customer.company, 25)}</Text>
                                        <TouchableOpacity style={{alignItems:'flex-end'}} onPress={() => {
                                            let autocomplete = this.state.autocomplete
                                            let customer = this.state.customer
                                            autocomplete.company.disabled = false
                                            autocomplete.company.companies = [];
                                            
                                            customer.company = ''
                                            this.setState({autocomplete, customer})
                                        }}>
                                            <Ionicons name='ios-remove-circle-outline' size={20}/>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <View style={styles.dropdownView}>
                                        <Text style={[styles.labelText, {width:'40%'}]}>{Locale.t('CUSTOMER_NEW.COMPANY')}</Text>
                                        <TextInput 
                                            style={styles.input}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(text) => {
                                                let customer = this.state.customer
                                                customer.company = text;
                                                this.setState({customer}, ()=>{
                                                    this.companyAutocomplete(text)
                                                })  
                                                
                                            }}
                                            value={this.state.customer.company ? this.state.customer.company : ''}
                                        />   
                                    </View>
                            }       

                            {
                                this.renderCompanyList()
                            }                     
                        </View>        
                    </View>   
                </ScrollView>
            </Modal>
        )
    }

    renderCcFieldList(){
        let ccArr = this.state.agents.map((agent, i) => {
            return (
                <View key={i} style={styles.dropdownView}>
                    <Text style={[styles.labelText, {width:'70%'}]}>{agent.name}</Text>
                    <View style={{alignItems:'flex-end', justifyContent:'flex-end', width:'30%'}}>
                        <Switch
                            onValueChange={(value) => {    
                                let agents = this.state.agents
                                agents[i].state = value
                                this.setState({agents})

                            }}
                            value={agent.state} />
                    </View>
                </View>
            )
        })
        return ccArr
    }

    renderCcModal(){
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.ccModalVisible}
                onRequestClose={() => {console.log("Modal has been closed.")}}
                >
                {
                    this.renderModalHeader(Locale.t('TICKET_NEW.CC_SELECT'), 'cc')
                }
                <ScrollView ref="scroll">
                    <View style={{width:'100%', backgroundColor: '#f5f5f5'}} >
                        <View style={{marginHorizontal:'2.5%', marginTop:11, marginBottom:11,  backgroundColor:'#ffffff'}}>
                        {
                            this.renderCcFieldList()
                        }                            
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        )
    }

    renderCustomFields(){        
        let ticketFields = this.state.ticketCustomFields.map((field, i) => {
            return (
                field.type == 'TEXT' ?
                    <View style={styles.dropdownView}>
                        <Text style={[styles.labelText, {width:'40%', }]} numberOfLines={1} ellipsizeMode={'tail'}>{this.getCurrnetLanguage(field.labels) ? this.getCurrnetLanguage(field.labels) : field.name}</Text>
                        <TextInput 
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => {
                                this.state.newTicketCustomFields[field.name] = text;
                                this.setState({
                                    newTicketCustomFields:this.state.newTicketCustomFields
                                })
                                
                            }}
                            value={this.state.newTicketCustomFields[field.name]}
                        /> 
                    </View>                    
                : field.type == 'COMBO' ?
                    <View style={styles.dropdownView} key={i}>
                        <View style={{width: '60%'}}>
                            <Text style={styles.labelText} numberOfLines={2} ellipsizeMode={'tail'}>{this.getCurrnetLanguage(field.labels) ? this.getCurrnetLanguage(field.labels) : field.name}</Text>
                        </View>
                        <View style={{width: '40%'}}>
                            <ModalDropdown
                                defaultIndex={0}
                                options={['...'].concat(field.values)}
                                style={styles.filterButtonContainerStyle}                            
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    this.state.newTicketCustomFields[field.name] = value;
                                    this.setState({
                                        newTicketCustomFields:this.state.newTicketCustomFields
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                <Text style={styles.buttonText}>{this.state.newTicketCustomFields[field.name]}</Text>
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
                        <View style={{width: '60%'}}>
                            <Text style={styles.labelText} numberOfLines={2} ellipsizeMode={'tail'}>{this.getCurrnetLanguage(field.labels) ? this.getCurrnetLanguage(field.labels) : field.name}</Text>
                        </View>
                        <View style={{width: '40%'}}>
                            <ModalDropdown
                                defaultIndex={0}
                                options={this.getFieldList(field)}
                                style={styles.filterButtonContainerStyle}                            
                                dropdownTextStyle={styles.filterButton}
                                textStyle={styles.filterButton}
                                onSelect={(idx, value) => {
                                    this.state.newTicketCustomFields[field.name] = value;
                                    this.setState({
                                        newTicketCustomFields:this.state.newTicketCustomFields
                                    })
                                }}
                                >
                                <View style={styles.filterButtonContent}>
                                <Text style={styles.buttonText}>{this.state.newTicketCustomFields[field.name]}</Text>
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
   
    render(){
        return(            
            <View style={styles.container}>                       
                {
                    !this.state.loading ?
                    <KeyboardAwareScrollView ref="scroll">  
                        <View style={styles.content}>
                            {/* Customer */}
                            {
                                GlobalVals.user.role == 'AGENT' && (                       
                                this.state.autocomplete.customer.disabled ?
                                    <View style={styles.dropdownView}>
                                        <View style={styles.labelView}>
                                            <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_NEW.CUSTOMER')}</Text>
                                            <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                                        </View>
                                        <Text style={[styles.buttonText, {width:'65%'}]}>{this.getShowText(this.state.autocomplete.customer.customer, 25)}</Text>
                                        <TouchableOpacity style={{alignItems:'flex-end'}} onPress={() => {
                                            let autocomplete = this.state.autocomplete;
                                            autocomplete.customer = {
                                                customer:'',
                                                disabled:false,
                                                customers:[],
                                                openedById:null,
                                                openedByName:null
                                            }                                        
                                            this.setState({autocomplete})
                                        }}>
                                            <Ionicons name='ios-remove-circle-outline' size={20}/>
                                        </TouchableOpacity>
                                    </View>
                                    
                                :   
                                    <View style={styles.dropdownView}>
                                        <View style={styles.labelView}>
                                            <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_NEW.CUSTOMER')}</Text>
                                            <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                                        </View>
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
                                        {
                                            this.state.autocomplete.customer.customer != ""  && this.state.autocomplete.customer.customer.length > 3 ?
                                                <TouchableOpacity style={{alignItems:'flex-end'}} onPress={() => {
                                                    let autocomplete = this.state.autocomplete                                                
                                                    autocomplete.customer = {
                                                        customer:'',
                                                        disabled:false,
                                                        customers:[],
                                                        openedById:null,
                                                        openedByName:null                                                    
                                                    };
                                                    this.setState({autocomplete})
                                                }}>
                                                    <Ionicons name='ios-remove-circle-outline' size={20}/>
                                                </TouchableOpacity>
                                            :
                                                <TouchableOpacity style={{alignItems:'flex-end'}} onPress={() => {
                                                    this.setState({newCustomerModalVisible: true})
                                                }}>
                                                    <Ionicons name='ios-add-circle-outline' size={20}/>
                                                </TouchableOpacity>
                                        }
                                        {
                                            this.state.emptyCustomer &&
                                            <View style={styles.emptyField}>
                                                <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                            </View>
                                        }                                      
                                    </View>    
                                )                                           
                            }     
                            {/* Customers Search List */}
                            {
                                GlobalVals.user.role == 'AGENT' && this.state.autocomplete.customer.customers.length > 0 &&
                                    this.renderCustomerList()                            
                            }   
                            {/* Assigned to */}
                            {
                                GlobalVals.user.role == 'AGENT' &&
                                <View style={styles.dropdownView}>
                                    <View style={{flexDirection:'row', paddingLeft:20}}>
                                        <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_NEW.AGENT')}</Text>
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
                                            let ticket = this.state.ticket
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.agents.length ; i++){
                                                    if(value == this.state.agents[i].name){                                                    
                                                        ticket.assignedTo.id = this.state.agents[i].id
                                                        break;
                                                    }
                                                }
                                            }else{
                                                ticket.assignedTo.id = undefined
                                            }
                                            this.setState({
                                                ticket
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
                            }
                            {/* CC */}
                            {
                                GlobalVals.user.role == 'AGENT' &&
                                <TouchableOpacity onPress={() =>{this.setState({ccModalVisible: true})}}>
                                    <View style={styles.dropdownView}>
                                        <Text style={[styles.labelText, {width:'20%'}]}>{Locale.t('TICKET_NEW.CC')} :</Text>                                    
                                        <Text style={[styles.buttonText, {width:'74%'}]}>{this.getShowText(this.state.selectedCC , 30)}</Text>
                                        <View style={{width:'6%', alignItems:'center'}}>                                    
                                            <Ionicons style={{color: 'rgb(79, 136, 213)'}} name='ios-arrow-forward-outline' size={20}/>                                    
                                        </View>
                                    </View>
                                </TouchableOpacity>                          
                            }    
                            {/* Status */}
                            {
                                GlobalVals.user.role == 'AGENT' &&
                                <View style={styles.dropdownView}>
                                    <View style={{flexDirection:'row', paddingLeft:20}}>
                                        <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_NEW.STATUS')}</Text>
                                        <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                                    </View>
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
                                            let ticket = this.state.ticket
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.statuses.length ; i++){
                                                    if(value == this.state.statuses[i].label){
                                                        ticket.status.status = this.state.statuses[i].status
                                                        break;
                                                    }
                                                }
                                            }else{
                                                ticket.status.status = undefined
                                            }
                                            this.setState({
                                                ticket
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
                                    {
                                        this.state.emptyStatus &&
                                        <View style={styles.emptyField}>
                                            <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                        </View>
                                    } 
                                </View>
                            }       
                            {/* Types */}
                            {
                                <View style={styles.dropdownView}>
                                    <View style={{flexDirection:'row', paddingLeft:20}}>
                                            <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_NEW.TYPE')}</Text>
                                            <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                                    </View>
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
                                            let ticket = this.state.ticket
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.types.length ; i++){
                                                    if(value == this.state.types[i].label){
                                                        ticket.type.id = this.state.types[i].id
                                                        break;
                                                    }
                                                }
                                            }else{
                                                ticket.type.id = undefined
                                            }
                                            this.setState({
                                                ticket
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
                                    {
                                        this.state.emptyType &&
                                        <View style={styles.emptyField}>
                                            <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                        </View>
                                    } 
                                </View>
                            }  
                            {/* Areas */}
                            {
                                this.state.areas.length > 0 &&
                                <View style={styles.dropdownView}>
                                    <Text style={styles.labelText}>{Locale.t('TICKET_NEW.AREA')}</Text>
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
                                            let ticket = this.state.ticket
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.areas.length ; i++){
                                                    if(value == this.state.areas[i].label){
                                                        ticket.area.id = this.state.areas[i].id
                                                        break;
                                                    }
                                                }
                                            }else{
                                                ticket.area.id = undefined
                                            }
                                            this.setState({
                                                ticket
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
                                    <Text style={styles.labelText}>{Locale.t('TICKET_NEW.GROUP')}</Text>
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
                                            let ticket = this.state.ticket
                                            if(value != '...'){
                                                for(var i = 0 ; i < this.state.groups.length ; i++){
                                                    if(value == this.state.groups[i].label){
                                                        ticket.group.id = this.state.groups[i].id
                                                        break;
                                                    }
                                                }
                                            }else{
                                                ticket.group.id = undefined
                                            }
                                            this.setState({
                                                ticket
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
                                <Text style={[styles.labelText, {width:'60%'}]}>{Locale.t('TICKET_NEW.PRIORITY')}</Text>
                                <View style={{alignItems:'flex-end', justifyContent:'flex-end', width:'40%'}}>
                                    <Switch
                                        onValueChange={(value) => {   
                                            let ticket = this.state.ticket
                                            ticket.priority = value 
                                            this.setState({ticket})                    
                                            }}
                                        value={this.state.ticket.priority} />
                                </View>
                            </View>
                            {/* Tag */}
                            {
                                GlobalVals.user.role == 'AGENT' && 
                                <View style={[styles.dropdownView, {paddingHorizontal:20}]}>
                                    <TagInput
                                        inputColor={'rgb(128, 128, 128)'}
                                        inputProps={{
                                            placeholder:Locale.t('ADD_A_TAG')
                                        }}                                        
                                        value={this.state.ticket.tags ? this.state.ticket.tags : []}
                                        onChange={(tags) => {
                                            let ticket = this.state.ticket
                                            ticket.tags = tags
                                            this.setState({ticket})
                                        }}
                                        labelExtractor={(tag) => tag}
                                        // maxHeight={100}
                                        />
                                </View>  
                            }                            
                            {/* Ticket Custom Fields */}
                            {
                                this.state.ticketCustomFields &&
                                this.renderCustomFields()
                            }
                            {/* Subject */}
                            <View style={styles.dropdownView}>
                                <View style={styles.labelView}>
                                    <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_NEW.SUBJECT')}</Text>
                                    <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                                </View> 
                                <TextInput 
                                    style={styles.input}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(text) => {
                                        let ticket = this.state.ticket
                                        ticket.subject = text
                                        this.setState({ticket})
                                    }}
                                    value={this.state.ticket.subject}
                                />  
                                {
                                    this.state.emptySubject &&
                                    <View style={styles.emptyField}>
                                        <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                    </View>
                                } 
                            </View>
                            {/* Description */}                        
                            <View style={[styles.dropdownView, {borderBottomWidth:0}]}>
                                <View style={{flexDirection:'row', paddingLeft:20}}>
                                    <Text style={[styles.labelText, {paddingLeft:0}]}>{Locale.t('TICKET_NEW.DESCRIPTION')}</Text>
                                    <Text style={[styles.labelText, {color:'red', paddingLeft:0}]}>*</Text>
                                </View> 
                                {
                                    this.state.emptyDescription &&
                                    <View style={styles.emptyField}>
                                        <Image style={{width:37 * 4.35 * Metrics.scaleHeight, height:37 * Metrics.scaleHeight}} source={Images.emptyFieldBgIcon} />
                                    </View>
                                } 
                            </View>         
                            {
                                this.props.status == 'edit' ?
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor:'#ffffff',
                                        borderColor:'rgb(218, 217, 217)',                                
                                        marginHorizontal:'5%',                                
                                        borderWidth:1,
                                    }}
                                    >      
                                    <View style={{width:'100%', alignItems:'flex-end'}}>
                                        <TouchableOpacity style={{marginTop:6, marginRight:6}} onPress={() => {
                                            this.setState({richRextModalVisible: true})
                                        }}>
                                            <Icon
                                                style={{color:'rgb(86, 85, 85)'}}
                                                name="pencil" size={20}
                                            />
                                        </TouchableOpacity>
                                    </View>                          
                                    {
                                        Platform.OS == 'ios' ?
                                        <WebView 
                                            style={{                                    
                                                height: 150
                                            }}                           
                                            automaticallyAdjustContentInsets={true}
                                            source={{html: this.getHtmlStr(this.state.ticket.description) + customStyle}}
                                        />
                                        :
                                        <MyWebView
                                            width={'90%'}
                                            defaultHeight={150}
                                            autoHeight={this.state.ticket.description != '' ? true : false}
                                            source={{html: this.getHtmlStr(this.state.ticket.description) + customStyle}}
                                        />
                                    }                                           
                                </View>
                                :
                                <View style={{
                                    flex: 1,
                                    backgroundColor:'#ffffff',
                                    borderColor:'rgb(218, 217, 217)',                                
                                    marginHorizontal:'5%',                                
                                    borderWidth:1,
                                    }}>
                                    <TextInput
                                        style={styles.textArea}
                                        multiline={true}
                                        numberOfLines = {4}
                                        value={this.state.ticket.description}
                                        clearButtonMode="never"
                                        onChangeText={(text) => {
                                            let ticket = this.state.ticket
                                            ticket.description = text
                                            this.setState({
                                                ticket
                                            })
                                        }}
                                        onSubmitEditing={() => {}}
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            }                         
                            
                            {
                                this.state.attachedDocuments.length == 0 ?
                                    <Button 
                                        style={styles.attachBtnStyle}                                                        
                                        onPress={()=>{
                                            // this.openImagePicker() 
                                            this.showActionSheet()                        
                                        }}
                                        >
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={styles.attachBtnText}>{Locale.t('TICKET_NEW.UPLOADFILE')}</Text>
                                            <View style={{width:6}} />
                                            <Icon style={{color:'rgb(129, 129, 129)'}} name="paperclip" size={18}/>
                                        </View> 
                                    </Button> 
                                : 
                                    <Button 
                                        style={styles.attachBtnStyle}                                                        
                                        onPress={()=>{    
                                            this.removeEditUpload()                                    
                                                                
                                        }}
                                        >
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={styles.attachBtnText}>{this.state.attachedDocuments[0].documentName}</Text>
                                            <View style={{width:6}} />
                                            <Icon style={{color:'rgb(129, 129, 129)'}} name="minus-circle" size={18}/>
                                        </View>
                                    </Button> 
                            }
                        </View>
                        {/* Modals */}
                        {
                            this.renderNewCustomerModal()                            
                        }
                        {
                            this.renderCcModal()
                        }   
                    </KeyboardAwareScrollView>
                    :
                    <ActivityIndicator size="large" color="#ff0000" />
                } 
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={Locale.t('TICKET_NEW.SELECT_FILES')}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={(idx) => {
                        this.openPicker(idx)
                    }}
                />
                {
                    this.state.richRextModalVisible && this.props.status == 'edit' &&
                        <RichTextEditorModal
                            title={Locale.t('TICKET_NEW.EDIT_TICKET_DESCRIPTION')}
                            text={this.getHtmlStr(this.state.ticket.description)}
                            closeEditorModal={() => {this.setState({richRextModalVisible: false})}}
                            getText={(html) => {
                                let ticket = this.state.ticket
                                ticket.description = html
                                this.setState({
                                    richRextModalVisible: false,
                                    ticket
                                })
                            }}
                        />
                    
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
    labelView:{
        flexDirection:'row', 
        width:'30%', 
        paddingLeft:20
    },
    input:{
        width:'65%',
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
    attachBtnStyle: {
        marginTop:27,
        marginHorizontal:35.5,
        height: 43.5 * Metrics.scaleHeight,
        backgroundColor:'#ffffff',
        alignItems: 'center',
        justifyContent: 'center',    
        borderRadius:6,
        borderWidth:1,
        borderColor:'rgb(177, 176, 176)',
    },
    attachBtnText: {
        fontFamily:'Helvetica Neue',
        fontSize:16,
        color:'rgb(128, 128, 128)'
    },
    emptyField:{
        position:'absolute',
        top:5.5 * Metrics.scaleHeight,
        right:3,
    },
    richText: {
        paddingTop:20,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',        
    },
    textArea: {
        height:120, 
        width:'100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        textAlignVertical: "top",
        // borderColor:'rgb(177, 176, 176)',
        // borderWidth:1,
        backgroundColor: "transparent",
        fontFamily: "Helvetica Neue",
        fontSize:17
    },

})