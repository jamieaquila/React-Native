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
    TextInput,
    Platform,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    WebView,
    PickerIOS,
    Picker,
    PickerItemIOS,
    Animated,
    Image,
    Linking
} from 'react-native'
import base64 from 'base-64'
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import InfiniteScroll from 'react-native-infinite-scroll';
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePreview from 'react-native-image-preview';

import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs'
import DialogBox from 'react-native-dialogbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import FileOpener from 'react-native-file-opener';
const FilePickerManager = require('NativeModules').FilePickerManager;
import moment from 'moment'

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { RichTextEditorModal, PickerModal, CustomWebView } from '../../../components'
import { startMainTab } from '../../../app'






export default class TicketDetailScreen extends Component {   
    constructor(props){
        super(props)
        this.state ={
            ticketId: this.props.id,
            loading: true,
            ticket:{},
            pageTitle:{},
            reply:{
                text:'',
                replayFile:''
            },
            sign:'',
            role:GlobalVals.user.role,           
            detailTicketCustomFields:{},
            detailExpended:false,
            noteExpended:false,
            slaTargetExpended:false,
            replyExpended:false,
            templateList:[],
            selectedTemplate:'Select Template',
            attachedDocuments: [],
            firstLoading: true,
            isLoading: false,
            isDownloading: false,
            menuExpended: false,
            imagePreview: false,
            imgUrl:'',
            thype:'',
            templateExpended: false,
            httpDomain:'',
            // richRextModalVisible: false,
            pickerModal: false,
            offSet: new Animated.Value(0),
            

        }
        
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            this.props.navigator.pop()
        }else if(event.id === 'menu') {
            this.setState({menuExpended: !this.state.menuExpended})
        }
    }

    componentDidMount(){  

        this.getInitialization()
    }

    showWebViewModal(link){
        this.props.navigator.showModal({
            screen: 'deskero.WebViewModal', // unique ID registered with Navigation.registerScreen
            title: '', // title of the screen as appears in the nav bar (optional)
            passProps: {
                link: link
            }, 
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
            },
            animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
          });
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

    goToAddEditTicketScreen(){
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
    }

    goToTicketForwardScreen(){
        this.props.navigator.push({
            title: Locale.t('TICKET_FORWARD.TITLE'),
            screen: "deskero.TicketForwardScreen",  
            passProps: {
                id: this.state.ticketId
            },  
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

    goToScenariosScreen(){
        this.props.navigator.push({
            title: Locale.t('SCENARIOS.TITLE'),
            screen: "deskero.ScenariosScreen",  
            passProps: {
                id: this.state.ticketId
            },  
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
                ]
            },
        })
    }  

    goToTextEditorScreen(){
        this.props.navigator.push({
            screen: "deskero.TextEditorScreen",     
            navigatorStyle: {
                navBarHidden: true               
            },      
            passProps: {
                title: Locale.t('TICKET_DETAIL.EDIT_TICKET_REPLY'),
                text: this.state.reply.text,
                sign: this.state.sign,
                ticketId:this.state.ticketId
            },
            animated: true, 
            animationType: 'fade',
        })
    }

    getInitialization(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                localStorage.get('httpDomain').then((httpDomain) => {
                    Client.getUpdates(bearer, clientId)
                        .then((res) => {
                            if(res == 'OK'){
                                if(GlobalVals.userDetails && GlobalVals.userDetails.signature != ""){
                                    if(GlobalVals.userDetails.signature != null || GlobalVals.userDetails.signature != undefined){
                                        let sign = GlobalVals.userDetails.signature;                                        
                                        this.setState({
                                            sign,
                                            httpDomain
                                        })
                                    }
                                }else{
                                    let reply = {}
                                    reply.text = ""
                                    this.setState({reply})
                                }
                                this.getTicketDetails(bearer, clientId)
                            }else{
                                this.setState({
                                    loading: false,
                                    httpDomain
                                })
                            }                
                        })
                        .catch((err) => {
                            this.setState({
                                loading:false,
                                httpDomain
                            })
                    })
                })
            })
        })
    }

    getTicketDetails(bearer, clientId){
        if(!GlobalVals.ticketDetails || !GlobalVals.ticketDetails[this.state.ticketId]) {
            Client.getTicket(bearer, clientId, this.state.ticketId)
                .end((err, res) => {
                    if(err){
                        this.setState({loading:false})
                    }else{
                        if(res.body){
                            let ticket = res.body;
                            let reply = this.state.reply
                            let pageTitle = {}
                            let detailTicketCustomFields = {}
                            let templateList = [];
                            GlobalVals.ticketToEdit = ticket;
                            
                            pageTitle.number = ticket.number;
                            
                            if(ticket.openedBy.name)
                                pageTitle.name = " - " + ticket.openedBy.name;
                            
                            pageTitle.cid = ticket.openedBy.id;
    
                            if(ticket.source.source == 'twitter'){
                                reply.text = ticket.openedBy.twitterName;                                
                            }

    
                            if(ticket.attachedDocuments){
                                
                                localStorage.get('httpDomain').then((domain) =>{
                                    for(var key in ticket.attachedDocuments){
                                        let url = ticket.attachedDocuments[key].documentURL;
                                        let id = url.split("/")[4]
                                        ticket.attachedDocuments[key].documentAppUrl = domain + 'document/' + id;
                                        ticket.attachedDocuments[key].isDownloading = false
                                    }
                                })                                
                            }
                            if(ticket.replies){
                                for(var i = 0 ; i < ticket.replies.length ; i++){
                                    if(ticket.replies[i].attachedDocuments){
                                        for(var j = 0 ; j < ticket.replies[i].attachedDocuments.length ; j++){
                                            ticket.replies[i].attachedDocuments[j].isDownloading = false
                                        }
                                    }
                                }
                            }
                            
    
                            if(ticket.customFields){
                                for (var key in ticket.customFields) {
                                    var field = GlobalVals.ticketCustomFields.filter(el => el.name == key)[0]
                                    if(field && this.getCurrnetLanguage(field.labels)){
                                        var labelKey = this.getCurrnetLanguage(field.labels);
                                        detailTicketCustomFields[labelKey] = ticket.customFields[key]
                                    }else{
                                        detailTicketCustomFields[key] = ticket.customFields[key]
                                    }
                                }
                            }
    
                            
                            if(GlobalVals.replyTemplates){
                                templateList.push({
                                    id:'empty',
                                    title:'Select Template'
                                })
                                for(var i = 0 ; i < GlobalVals.replyTemplates.length ; i++){
                                    let temp = {
                                        id:GlobalVals.replyTemplates[i].id,
                                        title:GlobalVals.replyTemplates[i].title
                                    }
                                    templateList.push(temp)
                                }
                            }

                            console.log(ticket)
                            
                            this.setState({
                                ticket,
                                reply,
                                pageTitle,
                                detailTicketCustomFields,
                                loading: false,
                                templateList,
                                firstLoading: false
                            })
                        }else{
                            this.setState({loading: false})
                        }
                        
                    }
            })
        }else{
            let ticket = GlobalVals.ticketDetails[this.state.ticketId];
            let pageTitle = {}
            let templateList = [];
            GlobalVals.ticketToEdit = ticket;
            let detailTicketCustomFields = {}
            pageTitle.number = ticket.number;
            if(ticket.opendBy.name)
                pageTitle.name = " - " + ticket.opendBy.name;
            pageTitle.cid = ticket.opendBy.id;

            if(ticket.attachedDocuments){
                localStorage.get('httpDomain').then((domain) =>{
                    for(var key in ticket.attachedDocuments){
                        let url = ticket.attachedDocuments[key].documentURL;
                        let id = url.split("/")[4]
                        ticket.attachedDocuments[key].documentAppUrl = domain + 'document/' + id;
                        ticket.attachedDocuments[key].isDownloading = false
                    }
                })
            }
            if(ticket.replies){
                for(var i = 0 ; i < ticket.replies.length ; i++){
                    if(ticket.replies[i].attachedDocuments){
                        for(var j = 0 ; j < ticket.replies[i].attachedDocuments.length ; j++){
                            ticket.replies[i].attachedDocuments[j].isDownloading = false
                        }
                    }
                }
            }

            if(ticket.customFields){
                for (var key in ticket.customFields) {
                    var field = GlobalVals.ticketCustomFields.filter(el => el.name == key)[0]
                    if(field && this.getCurrnetLanguage(field.labels)){
                        var labelKey = this.getCurrnetLanguage(field.labels);
                        detailTicketCustomFields[labelKey] = ticket.customFields[key]
                    }else{
                        detailTicketCustomFields[key] = ticket.customFields[key]
                    }
                }
            }

            if(GlobalVals.replyTemplates){
                templateList.push({
                    id:'empty',
                    title:'Select Template'
                })
                for(var i = 0 ; i < GlobalVals.replyTemplates.length ; i++){
                    let temp = {
                        id:GlobalVals.replyTemplates[i].id,
                        title:GlobalVals.replyTemplates[i].title
                    }
                    templateList.push(temp)
                }
            }
            this.setState({
                ticket,
                pageTitle,
                detailTicketCustomFields,
                loading: false,
                templateList,
                firstLoading: false
            })
 
        }
        
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
        let date = new Date(milliseconds).toDateString()    
        let dateStr = date + " " + moment(new Date(milliseconds).toISOString()).format('HH:mm')
        return dateStr
    }

    setTextLength(text, len){
        return (text.length > len ? (text.substring(0, len) + "...") : text);
    }

    getStringFromCCArray(arr){
        // console.log(arr)
        var str = "";
        for(var i = 0 ; i < arr.length ; i++){
            str += arr[i].name
            if(i < arr.length - 1)
                str += ","
        }
        return str
    }

    getStringFromTagArray(arr){
        var str = "";
        for(var i = 0 ; i < arr.length ; i++){
            str += arr[i]
            if(i < arr.length - 1)
                str += ","
        }
        return str
    }

    getTargetLabel(label){
        if(label == 'CLOSING'){
            return 'Closing target'
        }else if(label == 'REPLY'){
            return 'Reply target'
        }else if(label == 'MISSED'){
            return 'Missed'
        }else if(label == 'ON_TIME'){
            return 'On time'
        }else if(label == 'PROCESSING'){
            return 'Processing'
        }else{
            return 'Processing'
            // console.log(label)
        }
    }    

    getHtmlStr(htmlStr){
        var textToReplace = String(htmlStr) 
        if(textToReplace.includes('width=')){            
            textToReplace = textToReplace.replace(/width=/g, '')
        }
        if(textToReplace.includes('height=')){
            textToReplace = textToReplace.replace(/height=/g, '')
        }
        // console.log(textToReplace)
        textToReplace = textToReplace.replace('src="/inlineImage', 'src="' + this.state.httpDomain + "inlineImage")
        // console.log(textToReplace)
        return textToReplace
    }

       

    loadingReplyText(){
        let value = this.state.selectedTemplate
        if(value != 'Select Template'){
            let id = '';
            for(var i = 0 ; i < this.state.templateList.length ; i++){
                if(this.state.templateList[i].title == value){
                    id = this.state.templateList[i].id;
                    break;
                }
            }
           
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.getReplyTemplatesUse(bearer, clientId, id, this.state.ticketId)
                        .then((res) => {
                            let reply = this.state.reply;
                            let chkTemplate = res.data.msg;
                            reply.text = chkTemplate
                            

                            this.setState({
                                reply,                               
                            }, () => {
                                this.goToTextEditorScreen()
                            })
                            
                        })  
                        .catch((err) => {
                            console.log(err.message)
                        })       
                        
                })
            })
        }else{
            let reply = this.state.reply;    
            reply.text = ""                 
                
            
            this.setState({
                reply
            }, () => {
                this.goToTextEditorScreen()
            })
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

  
    removeTicket(){
        Alert.alert(
            '',
            Locale.t('TICKETS.DELETE_CONFIRM_TEXT'),
            [
              {text: Locale.t('TICKETS.DELETE_CONFIRM_NO'), onPress: () => {
      
               }},
              {text:  Locale.t('TICKETS.DELETE_CONFIRM_YES'), onPress: () => {
                this.setState({menuExpended: false})
                localStorage.get('bearer').then((bearer) => {
                    localStorage.get('clientId').then((clientId) => {
                        Client.removeTicket(bearer, clientId, this.state.ticketId)
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
                }},
            ],
            { cancelable: false }
          )
        
    }

    openDocument(data, fileName, link1, type){
        let fileNameToSave = fileName.replace(/\s+/g, '-')
        fileNameToSave = fileNameToSave.replace(/-+$|(-)+/g, '$1')
        let link = encodeURI(link1)
        let sPath = (Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.ExternalDirectoryPath) + '/' + fileNameToSave

        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                let ticket = this.state.ticket
                if(data.type == 'detail'){
                    ticket.attachedDocuments[data.attDocIdx].isDownloading = true
                }else{
                    ticket.replies[data.replyIdx].attachedDocuments[data.attDocIdx].isDownloading = true
                }
                this.setState({ticket}, () => {
                    RNFS.downloadFile({fromUrl: link, toFile: sPath, 
                        headers:
                            {
                                "Authorization": 'Bearer ' + bearer,
                                "clientId": clientId
                            }  
                        }).promise.then(res => {
                            if(data.type == 'detail'){
                                ticket.attachedDocuments[data.attDocIdx].isDownloading = false
                            }else{
                                ticket.replies[data.replyIdx].attachedDocuments[data.attDocIdx].isDownloading = false
                                
                            }
                            // this.setState({ticket})
                            if(res.statusCode == 200){
                                if(Platform.OS == 'ios'){
                                    if(type.includes('image')){
                                        this.setState({
                                            imagePreview: true, 
                                            imgUrl:sPath,
                                            type: type,
                                            ticket
                                        })
                                    }else{
                                        this.setState({ticket}, () => {
                                            this.openFile(sPath, type)
                                        })
                                        
                                    }   
                                }else{
                                    this.setState({ticket}, () => {
                                        this.openFile(sPath, type)
                                    })                                    
                                }
                            }
                        }).catch(err => {
                            if(data.type == 'detail'){
                                ticket.attachedDocuments[data.attDocIdx].isDownloading = false
                            }else{
                                ticket.replies[data.replyIdx].attachedDocuments[data.attDocIdx].isDownloading = false
                            }
                            this.setState({ticket})
                    });
                })

                
            })
        }) 
    }

    openFile(filePath, type){
        FileOpener.open(
            filePath,
            type
        ).then((msg) => {
            // console.log(msg);
        },(e) => {
            // console.log('error!!');
        });
    }

    setVisibleToFalse(){
        let url = this.state.imgUrl
        let type = this.state.type
        
        this.setState({
            imagePreview: false,
            imgUrl: '',
            type:''
        }, () => {
            setTimeout(() => {
                this.openFile(url, type)
            }, 200)            
        })
    }

      
    renderFieldList(){
        if(this.state.detailTicketCustomFields){
            let fieldArray = [];
            var i = 0;
            for(var key in this.state.detailTicketCustomFields){                
                if(this.state.detailTicketCustomFields[key] && this.state.detailTicketCustomFields[key] != ""){
                    i++;
                    let field = <View key={i} style={styles.subRow}>
                                    <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{key}</Text>
                                    <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.state.detailTicketCustomFields[key]}</Text>                        
                                </View> 
                    fieldArray.push(field)
                } 
            }
            if(fieldArray.length == 0)
                return null;
            else
                return fieldArray;
        }else{
            return null
        }
    }

    renderDetailAtachedDocumentList(){
        let attachedDocs = this.state.ticket.attachedDocuments.map((attachedDocument, i) => {
            return (               
                <View key={i} style={styles.subRow}>
                    <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.ATTACHED_DOCUMENT')}</Text>
                    <View style={{flexDirection:'row', width:'100%'}}>
                        <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)', width:'90%'}}>{attachedDocument.documentName}</Text>                        
                        {
                            attachedDocument.isDownloading == false ?
                                <TouchableOpacity style={{width:'10%'}} onPress={() => {
                                        this.openDocument(
                                            {
                                                type: 'detail',
                                                attDocIdx: i
                                            },
                                            attachedDocument.documentName, 
                                            attachedDocument.documentURL, 
                                            attachedDocument.documentType
                                        )
                                    }}>
                                    <Icon style={{textAlign:'right', color:'rgb(128, 128, 128)'}} name="download" size={18}/>
                                </TouchableOpacity>
                            :
                                <View style={{width:'10%', justifyContent:'center', alignItems:'flex-end'}}>
                                    <ActivityIndicator size="small" color="rgb(128, 128, 128)" />
                                </View>
                        }
                        
                    </View>
                    
                </View>
            )
        })

        return attachedDocs;
    }

    renderDetails(){
        return(
            <View style={[styles.row, {backgroundColor:'rgb(230, 228, 228)'}]}>
            {
                !this.state.detailExpended ?
                    <TouchableOpacity onPress={() => {
                        this.setState({detailExpended:true})
                        }}>
                        <View style={{flexDirection:'row', width:'100%'}}>
                            <Text style={{width:'90%', color:'rgb(223, 61, 0)', fontFamily:'Helvetica Neue', fontSize:11}}>{Locale.t('TICKET_DETAIL.DETAILS').toUpperCase()}</Text>
                            <Icon style={{textAlign:'right', width:'10%', color:'rgb(128, 128, 128)'}} name="angle-down" size={18}/>
                        </View>
                    </TouchableOpacity>
                :
                    <View>
                        <TouchableOpacity style={{flexDirection:'row', width:'100%'}} onPress={() => {
                            this.setState({detailExpended:false})
                            }}>                                                
                                <Text style={{width:'90%', color:'rgb(223, 61, 0)', fontFamily:'Helvetica Neue', fontSize:11}}>{Locale.t('TICKET_DETAIL.DETAILS').toUpperCase()}</Text>
                                <Icon style={{textAlign:'right', width:'10%', color:'rgb(128, 128, 128)'}} name="angle-up" size={18}/>                                                
                        </TouchableOpacity>
                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.CUSTOMER')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.state.ticket.openedBy.name}{this.state.ticket.openedBy.company ? (" - " + this.state.ticket.openedBy.company) : ''}</Text>
                        </View>

                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.INSERT_DATE')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.convertDate(this.state.ticket.insertDate)}</Text>
                        </View>

                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.MANAGED_DATE')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.convertDate(this.state.ticket.managedDate)}</Text>
                        </View>

                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.CLOSED_DATE')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.convertDate(this.state.ticket.closedDate)}</Text>
                        </View>

                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.AGENT')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.state.ticket.assignedTo && this.state.ticket.assignedTo.name}</Text>
                        </View>

                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.STATUS')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.getCurrnetLanguage(this.state.ticket.status.labels) ? this.getCurrnetLanguage(this.state.ticket.status.labels) : this.state.ticket.status.status}</Text>
                        </View>

                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.PRIORITY')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.state.ticket.priority ? 'yes' : 'no'}</Text>
                        </View>
                        {
                            this.state.ticket.cc &&
                            <View style={styles.subRow}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.CC')}</Text>
                                <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.getStringFromCCArray(this.state.ticket.cc)}</Text>
                            </View>
                        }

                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.SOURCE')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.getCurrnetLanguage(this.state.ticket.source.labels) ? this.getCurrnetLanguage(this.state.ticket.source.labels) : this.state.ticket.source.labels.source}</Text>
                        </View>

                        <View style={styles.subRow}>
                            <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.TYPE')}</Text>
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.getCurrnetLanguage(this.state.ticket.type.labels) ? this.getCurrnetLanguage(this.state.ticket.type.labels) : this.state.ticket.type.type}</Text>
                        </View>

                        {   this.state.ticket.area &&
                            <View style={styles.subRow}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.AREA')}</Text>
                                <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.getCurrnetLanguage(this.state.ticket.area.labels) ? this.getCurrnetLanguage(this.state.ticket.area.labels) : this.state.ticket.area.area}</Text>
                            </View>
                        }

                        {
                            this.state.ticket.group &&
                            <View style={styles.subRow}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.GROUP')}</Text>
                                <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.getCurrnetLanguage(this.state.ticket.group.labels) ? this.getCurrnetLanguage(this.state.ticket.group.labels) : this.state.ticket.group.group}</Text>
                            </View>
                        }

                        {
                            this.state.ticket.tags &&
                            <View style={styles.subRow}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.TAGS')}</Text>
                                <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.getStringFromTagArray(this.state.ticket.tags)}</Text>
                            </View>
                        }
                        
                        {
                            this.state.role == 'AGEN' && (this.state.ticket.workedTimeHours > 0 || this.state.workedTimeMinutes > 0) &&
                            <View style={styles.subRow}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{Locale.t('TICKET_DETAIL.WORKED_TIME')}</Text>
                                <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{this.state.ticket.workedTimeHours}:{this.state.ticket.workedTimeMinutes}</Text>
                            </View>
                        }
                        
                        {
                            this.state.detailTicketCustomFields &&
                                this.renderFieldList()
                        }
                        {
                            this.state.ticket.attachedDocuments &&
                                this.renderDetailAtachedDocumentList()
                        }
                        
                    </View>

            }
            </View>
        )
    }

    renderNotesFields(){
        let noteFieldArr = this.state.ticket.ticketNotes.map((note, i) => {
            return(
                <View key={i} style={styles.subRow}>
                    <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{this.convertDate(note.date)}</Text>
                    {
                        note.note != 'undefined' &&
                        <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{note.note}</Text>
                    }
                    {
                        note.assignedTo && note.assignedTo != note.insertBy ?
                            <View style={{flexDirection:'row', paddingTop:5}}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:11, color:'rgb(86, 85, 85)'}}>{note.insertByName}</Text>
                                <Image style={{width:5, height:6.5, marginTop:4, marginLeft:10, marginRight:8}} source={Images.arrowIcon} />
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:11, color:'rgb(86, 85, 85)'}}>{note.assignedToName}</Text>
                            </View>
                        :
                            <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:11, color:'rgb(86, 85, 85)'}}>{note.insertByName}</Text>
                    }
                    
                </View>
            )
        })
        return noteFieldArr;
    }

    renderNotes(){
        return (
            this.state.role == 'AGENT' && this.state.ticket.ticketNotes && this.state.ticket.ticketNotes.length > 0 &&
                <View style={styles.row}>
                    {
                        !this.state.noteExpended ?
                            <TouchableOpacity onPress={() => {
                                this.setState({noteExpended:true})
                                }}>
                                <View style={{flexDirection:'row', width:'100%'}}>
                                    <Text style={{width:'90%', color:'rgb(223, 61, 0)', fontFamily:'Helvetica Neue', fontSize:11}}>{Locale.t('TICKET_DETAIL.NOTES')}</Text>
                                    <Icon style={{textAlign:'right', width:'10%', color:'rgb(128, 128, 128)'}} name="angle-down" size={18}/>
                                </View>
                            </TouchableOpacity>
                        :
                        <View>
                            <TouchableOpacity style={{flexDirection:'row', width:'100%'}} onPress={() => {
                                this.setState({noteExpended:false})
                                }}>                                                
                                    <Text style={{width:'90%', color:'rgb(223, 61, 0)', fontFamily:'Helvetica Neue', fontSize:11}}>{Locale.t('TICKET_DETAIL.NOTES')}</Text>
                                    <Icon style={{textAlign:'right', width:'10%', color:'rgb(128, 128, 128)'}} name="angle-up" size={18}/>                                                
                            </TouchableOpacity>                            
                            {
                                this.renderNotesFields()                                
                            }
                                
                        </View>
                    }
                </View>
        )
    }

    renderSlaTargetField(status){
        if(status == 'sla_missed'){
            return (
                <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'#ef473a'}}>{Locale.t('TICKET_DETAIL.SLA_MISSED')}</Text>
            )
        }else if(status == 'on_time'){
            return (
                <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'#33cd5f'}}>{Locale.t('TICKET_DETAIL.SLA_ON_TIME')}</Text>
            )
        }else if(status == 'processing'){
            return (
                <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'#ffc900'}}>{Locale.t('TICKET_DETAIL.SLA_PROCESSING')}</Text>
            )
        }else{
            return null
        }
    }

    renderSlaTargetFields(){
        let slaTargetArr = this.state.ticket.slaTargets.map((target, i) => {
            return (
                <View key={i} style={styles.subRow}>
                    <Text style={{fontFamily:'Helvetica Neue', fontSize:10.9, color:'rgb(156, 155, 155)'}}>{this.getTargetLabel(target.event)}</Text>                                            
                    {
                        this.renderSlaTargetField(target.status)
                    }                                            
                </View>
            )
         
        })
        return slaTargetArr
    }

    renderSlaTargets(){
        return (
            this.state.role == "AGENT" && this.state.ticket.slaTargets && this.state.ticket.slaTargets.length > 0 &&
            <View style={styles.row}>
            {
                !this.state.slaTargetExpended ?
                    <TouchableOpacity onPress={() => {
                        this.setState({slaTargetExpended:true})
                        }}>
                        <View style={{flexDirection:'row', width:'100%'}}>
                            <Text style={{width:'90%', color:'rgb(223, 61, 0)', fontFamily:'Helvetica Neue', fontSize:11}}>{Locale.t('TICKET_DETAIL.SLA_TARGETS').toUpperCase()}</Text>
                            <Icon style={{textAlign:'right', width:'10%', color:'rgb(128, 128, 128)'}} name="angle-down" size={18}/>
                        </View>
                    </TouchableOpacity>
                :
                    <View>
                        <TouchableOpacity style={{flexDirection:'row', width:'100%'}} onPress={() => {
                            this.setState({slaTargetExpended:false})
                            }}>                                                
                                <Text style={{width:'90%', color:'rgb(223, 61, 0)', fontFamily:'Helvetica Neue', fontSize:11}}>{Locale.t('TICKET_DETAIL.SLA_TARGETS').toUpperCase()}</Text>
                                <Icon style={{textAlign:'right', width:'10%', color:'rgb(128, 128, 128)'}} name="angle-up" size={18}/>                                                
                        </TouchableOpacity>
                        {
                            this.renderSlaTargetFields()
                            
                            
                        }

                    </View>
            }
            </View>
        )
    }

    renderReplyAttachedDocumentList(replyIdx, attachedDocuments){
        let attachedList = attachedDocuments.map((attachedDocument, i) => {
            return (
                <View key={i} style={{flexDirection:'row', width:'100%', justifyContent:'center'}}>
                    <Text style={{fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)', width:'90%'}}>{attachedDocument.documentName}</Text>                                                
                    {
                        attachedDocument.isDownloading == false ?
                            <TouchableOpacity style={{width:'10%'}} onPress={() => {
                                    this.openDocument(
                                        {
                                            type: 'reply',
                                            replyIdx: replyIdx,
                                            attDocIdx: i
                                        },
                                        attachedDocument.documentName, 
                                        attachedDocument.documentURL, 
                                        attachedDocument.documentType
                                    )
                                }}>
                                <Icon style={{textAlign:'right', color:'rgb(128, 128, 128)'}} name="download" size={18}/>
                            </TouchableOpacity>
                        :
                            <View style={{width:'10%', justifyContent:'center', alignItems:'flex-end'}}>
                                <ActivityIndicator size="small" color="rgb(128, 128, 128)" />
                            </View>
                    }
                </View>
            )
        })
        return (
            <View style={[styles.subRow, {borderBottomWidth:0}]}>
                {
                    attachedList
                }
            </View>
        )
    }

    renderReplyFields(){
        let replyArr = []
        for(var i = this.state.ticket.replies.length - 2 ; i > -1 ; i--){
            replyArr.push(
                <View key={i} style={styles.subRow}>
                    <View style={{width:'100%', flexDirection:'row'}}>
                    {
                        this.state.ticket.replies[i].replyFromCustomer ?
                            <Text style={{width: '50%', fontFamily:'Helvetica Neue', fontSize:15, color:'#000', fontWeight:'bold', textAlign:'left'}}>{this.state.ticket.replies[i].replyFromCustomer.name}</Text>
                        :
                            <Text style={{width: '50%',fontFamily:'Helvetica Neue', fontSize:15, color:'#000', fontWeight:'bold', textAlign:'left'}}>{this.state.ticket.replies[i].replyFromOperator.name}</Text> 
                    }  
                        <Text style={{width: '50%', fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(156, 155, 155)', textAlign:'right'}}>{this.convertDate(this.state.ticket.replies[i].replyDate)}</Text>  
                    </View>
                    <CustomWebView 
                        html={this.state.ticket.replies[i].text}
                        styles={{width:'100%'}}
                        openURL={(url) => {
                            Linking.canOpenURL(url).then(supported => {
                                if (supported) {
                                    Linking.openURL(url);
                                } else {
                                    // console.log('Don\'t know how to open URI: ' + url);
                                }
                                return false
                            });
                        }}
                    /> 
                    
                    {
                        this.state.ticket.replies[i].attachedDocuments && this.state.ticket.replies[i].attachedDocuments.length > 0 &&
                            this.renderReplyAttachedDocumentList(i, this.state.ticket.replies[i].attachedDocuments)
                    }
                                                             
                </View>
            )
        }
        return replyArr
    }

    renderLatestReplyField(flag){
        let idx = this.state.ticket.replies.length - 1     
        // console.log(this.state.ticket.replies[idx].text)
        return (
            <View style={[styles.subRow, !flag && {borderBottomWidth:0}]}>
                <View style={{flexDirection:'row', width:'100%'}}>
                    <Text style={{fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(156, 155, 155)', width:'50%', textAlign:'left'}}>{this.convertDate(this.state.ticket.replies[idx].replyDate)}</Text>  
                    <Text style={{fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(156, 155, 155)', width:'50%', textAlign:'right'}}>{Locale.t('TICKET_DETAIL.LATEST_REPLY').toUpperCase()}</Text>  

                </View> 
                <CustomWebView 
                    html={this.state.ticket.replies[idx].text}
                    styles={{width:'100%'}}
                    openURL={(url) => {
                        Linking.canOpenURL(url).then(supported => {
                            if (supported) {
                                Linking.openURL(url);
                            } else {
                                // console.log('Don\'t know how to open URI: ' + url);
                            }
                            return false
                        });
                    }}
                />                                                               
                {
                    this.state.ticket.replies[idx].replyFromCustomer ?
                        <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(156, 155, 155)', textAlign:'right'}}>{this.state.ticket.replies[idx].replyFromCustomer.name}</Text>
                    :
                        <Text style={{paddingTop:5, fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(156, 155, 155)', textAlign:'right'}}>{this.state.ticket.replies[idx].replyFromOperator.name}</Text> 
                }  
                {
                    this.state.ticket.replies[idx].attachedDocuments && this.state.ticket.replies[idx].attachedDocuments.length > 0 &&
                        this.renderReplyAttachedDocumentList(idx, this.state.ticket.replies[idx].attachedDocuments)
                }
                                                            
            </View>
        )
    }

    renderReplies(){
        return (
            this.state.ticket.replies && this.state.ticket.replies.length > 0 &&
            <View style={styles.row}>
            {
                this.renderLatestReplyField(false)
            }
            {
                this.state.ticket.replies.length > 1 &&
                <View style={{borderTopColor:'rgb(228, 228, 228)', borderTopWidth:1}} />
            }
            {
                this.state.ticket.replies.length > 1 && (
                    !this.state.replyExpended ?                
                        <TouchableOpacity style={{paddingTop:10}} onPress={() => {
                            this.setState({replyExpended:true})
                            }}>
                            <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>                            
                                <Text style={{color:'rgb(51, 51, 51)', fontFamily:'Helvetica Neue', fontSize:11}}>{Locale.t('TICKET_DETAIL.REPLIES', {count: this.state.ticket.replies.length - 1}).toUpperCase()}</Text>
                                <Icon style={{marginLeft:10, textAlign:'right', color:'rgb(51, 51, 51)'}} name="angle-down" size={18}/>
                            </View>
                        </TouchableOpacity>
                    :
                        <View style={{width:'100%', paddingTop:10}}>
                            <TouchableOpacity style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                                this.setState({replyExpended:false})
                                }}> 
                                <Text style={{color:'rgb(51, 51, 51)', fontFamily:'Helvetica Neue', fontSize:11}}>{Locale.t('TICKET_DETAIL.REPLIES', {count: this.state.ticket.replies.length - 1}).toUpperCase()}</Text>                            
                                <Icon style={{marginLeft:10, textAlign:'right', color:'rgb(51, 51, 51)'}} name="angle-up" size={18}/>                                                
                            </TouchableOpacity>                    
                            {
                                this.renderReplyFields()
                            }
                        </View>
                )
                
            }
            </View>
        )
    }

    renderMenuList(){
        return (
            <View style={{ 
                width:Metrics.screenWidth - 13,
                backgroundColor:'white',       
                marginTop:11,
                marginLeft:6.5,
                marginRight:6.5,
                }}>
                {
                    GlobalVals.permissions.edit 
                    && (GlobalVals.user.role == 'CUSTOMER' || (GlobalVals.user.role == 'AGENT' && this.state.ticket.assignedTo && this.state.ticket.assignedTo.id == GlobalVals.user.id) 
                    || (GlobalVals.user.role == 'AGENT' && this.state.ticket.assignedTo && this.state.ticket.assignedTo.id != GlobalVals.user.id && GlobalVals.permissions.global)) && 
                    <TouchableOpacity style={styles.item} onPress={() => {
                        this.setState({menuExpended: false}, () => {
                            this.goToAddEditTicketScreen()
                        })
                        
                        }}>
                        <View style={{width:'20%', alignContent:'center', alignItems:'flex-start'}}>
                            <Icon style={{color:'rgb(86, 85, 85)'}} name="pencil" size={20}/>
                        </View>
                        <View style={{width:'80%', alignContent:'center', alignItems:'flex-start'}}>
                            <Text style={styles.labelText}>{Locale.t('TICKET_DETAIL.EDIT')}</Text>
                        </View>
                    </TouchableOpacity>
                }

                {
                     GlobalVals.permissions.delete 
                     && (GlobalVals.user.role == 'CUSTOMER' || (GlobalVals.user.role == 'AGENT' && this.state.ticket.assignedTo && this.state.ticket.assignedTo.id == GlobalVals.user.id)
                     || (GlobalVals.user.role == 'AGENT' && this.state.ticket.assignedTo && this.state.ticket.assignedTo.id != GlobalVals.user.id && GlobalVals.permissions.global)) &&
                     <TouchableOpacity style={styles.item} onPress={() => {
                        
                            this.removeTicket()
                    
                        }}>
                        <View style={{width:'20%', alignContent:'center', alignItems:'flex-start'}}>
                            <Icon style={{color:'rgb(86, 85, 85)'}} name="trash" size={20}/>
                        </View>
                        <View style={{width:'80%', alignContent:'center', alignItems:'flex-start'}}>
                            <Text style={styles.labelText}>{Locale.t('TICKET_DETAIL.DELETE')}</Text>
                        </View>
                    </TouchableOpacity>
                }

                {
                    GlobalVals.permissions.forward
                    && ((GlobalVals.user.role == 'AGENT' && this.state.ticket.assignedTo && this.state.ticket.assignedTo.id == GlobalVals.user.id)
                    || (GlobalVals.user.role == 'AGENT' && this.state.ticket.assignedTo && this.state.ticket.assignedTo.id != GlobalVals.user.id && GlobalVals.permissions.global)) &&
                    <TouchableOpacity style={styles.item} onPress={() => {
                        this.setState({menuExpended: false}, () => {
                            this.goToTicketForwardScreen()
                        })
                        }}>
                        <View style={{width:'20%', alignContent:'center', alignItems:'flex-start'}}>
                            <Icon style={{color:'rgb(86, 85, 85)'}} name="share" size={20}/>
                        </View>
                        <View style={{width:'80%', alignContent:'center', alignItems:'flex-start'}}>
                            <Text style={styles.labelText}>{Locale.t('TICKET_DETAIL.FORWARD')}</Text>
                        </View>
                    </TouchableOpacity>
                }

                {
                    GlobalVals.user.role == 'AGENT' &&
                    <TouchableOpacity style={styles.item} onPress={() => {
                        this.setState({menuExpended: false}, () => {
                            this.goToScenariosScreen()
                        })
                        }}>
                        <View style={{width:'20%', alignContent:'center', alignItems:'flex-start'}}>
                            <Icon style={{color:'rgb(86, 85, 85)'}} name="folder" size={20}/>
                        </View>
                        <View style={{width:'80%', alignContent:'center', alignItems:'flex-start'}}>
                            <Text style={styles.labelText}>{Locale.t('TICKET_DETAIL.EXECUTE_SCENARIO')}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    }
    
    render() {     
        return (    
            <View style={styles.container}> 
                {
                    this.state.menuExpended && 
                    this.renderMenuList()                    
                }
                
                {
                    !this.state.loading ?
                        !this.state.firstLoading && 
                        <KeyboardAwareScrollView ref="scroll"> 
                            <View style={styles.content}>
                                <View style={{backgroundColor:'rgb(97, 154, 40)', height:3}} />                                              
                                <View style={[styles.row, {borderBottomWidth: 0, backgroundColor:'rgb(230, 228, 228)'}]}>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Image style={{width:20, height:20}} source={this.getImageObj(this.state.ticket.source.source)} />
                                        {
                                            this.state.ticket.meInCc == true ?
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={[styles.ticketNumber, {fontWeight:'bold'}]}>{Locale.t('TICKET_NEW.CC')} #{this.state.ticket.number}></Text>
                                                    <Text style={[styles.ticketNumber]}> - {this.convertDate(this.state.ticket.insertDate)}</Text>
                                                </View>  
                                            :
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={[styles.ticketNumber, {fontWeight:'bold'}]}>#{this.state.ticket.number}</Text>
                                                    <Text style={[styles.ticketNumber]}> - {this.convertDate(this.state.ticket.insertDate)}</Text>
                                                </View>
                                        }
                                    </View>
                                    <View style={{flexDirection:'row', paddingTop:9}}>
                                        {
                                            (this.state.role == 'AGENT' && this.state.ticket.assignedTo && this.state.ticket.assignedTo.id != this.state.role) ?
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={styles.openedBy} >{this.state.ticket.openedBy.name}</Text>
                                                    <Image style={{width:5, height:6.5, marginTop:4, marginLeft:10, marginRight:8}} source={Images.arrowIcon} />
                                                    <Text style={styles.openedBy}>{this.state.ticket.assignedTo.name}</Text>
                                                </View>
                                            :
                                                <Text style={styles.openedBy}>{this.state.ticket.openedBy.name}</Text>
                                        }                                  
                                    </View>
                                    <Text style={styles.ticketSubject} >{this.state.ticket.subject}</Text>
                                </View>                           
                                
                                <View style={[styles.row, {backgroundColor:'rgb(230, 228, 228)', borderBottomColor:'rgb(195, 195, 195)'}]}>
                                {
                                    this.state.ticket.source.source == 'email' ?                                        
                                        <CustomWebView 
                                            html={this.state.ticket.description}
                                            styles={{width:'100%'}}
                                            openURL={(url) => {
                                                Linking.openURL(url)
                                            }}
                                        />                                         
                                    :   
                                        <CustomWebView 
                                            html={this.getHtmlStr(this.state.ticket.description)}
                                            styles={{width:'100%'}}
                                            openURL={(url) => {
                                                Linking.openURL(url)
                                            }}
                                        />                                   
                                }                                                                 
                                </View>
                                {
                                    this.renderDetails()                                
                                }
                                {
                                    this.renderNotes()
                                }
                                {
                                    this.renderSlaTargets()
                                }
                                {
                                    this.renderReplies()
                                }                                                
                            
                                <View style={{paddingTop: 30}} />
                                <Button 
                                    style={[styles.sendBtnStyle, {marginBottom: 10}]}  
                                    isLoading={this.state.isLoading}
                                    activityIndicatorColor = 'white'                                                      
                                    onPress={()=>{
                                        this.setState({
                                            selectedTemplate:'Select Template'
                                        }, () => {
                                            this.loadingReplyText()
                                        })
                                                                
                                    }}
                                    >
                                    <Text style={styles.sendBtnText}>{Locale.t('TICKET_DETAIL.ADD_REPLY')}</Text>
                                </Button>  
                                {
                                    this.state.templateList.length > 0 && 
                                    <Button 
                                        style={[styles.sendBtnStyle, {marginTop:0, backgroundColor:'#4f88d5', borderBottomColor:'rgb(34, 99, 183)',}]}  
                                        isLoading={this.state.isLoading}
                                        activityIndicatorColor = 'white'                                                      
                                        onPress={()=>{                                        
                                            this.setState({pickerModal: true})                       
                                        }}
                                        >
                                        <Text style={styles.sendBtnText}>{Locale.t('TICKET_DETAIL.REPLY_FOR_TEMPLATE')}</Text>
                                    </Button> 
                                }
                                 
                                {
                                    this.state.pickerModal &&
                                    <PickerModal 
                                        selectedTemplate={this.state.selectedTemplate}
                                        items={this.state.templateList}
                                        offSet={this.state.offSet}
                                        changeTemplate={(template) => {
                                            this.setState({
                                                selectedTemplate: template
                                            })
                                        }}
                                        closeModal={() => {
                                            this.setState({pickerModal: false})
                                        }}
                                        done={() => {
                                            this.setState({
                                                pickerModal: false
                                            }, () => {
                                                this.loadingReplyText()
                                            })
                                        }}                                  
                                    />

                                }
                            </View>
                            
                        </KeyboardAwareScrollView>
                    :
                    <ActivityIndicator size="large" color="#ff0000" />
                }
                  
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>                
                
                
                <ImagePreview visible={this.state.imagePreview} source={{uri: this.state.imgUrl}} close={() => {
                    this.setVisibleToFalse()
                }} />
                
            </View>
            
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: '#f5f5f5',
    },        
    content:{
        flex:1,
        width:Metrics.screenWidth - 13,
        backgroundColor:'white',       
        marginTop:11,
        marginLeft:6.5,
        marginRight:6.5,
        marginBottom:11,      
    },
    row:{
        // flex:1,
        paddingLeft:12,
        paddingRight:12,
        paddingTop:14,
        paddingBottom:14,
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1,
        backgroundColor:'#fff'
    },
    ticketSubject:{
        fontFamily:'Helvetica Neue',
        paddingTop:7, 
        fontSize:16, 
        color:'rgb(223, 61, 0)'
    },
    ticketNumber:{
        paddingLeft:9,
        fontFamily:'Helvetica Neue',
        fontSize:14, 
        color:'rgb(156, 155, 155)',
    },
    openedBy:{
        fontFamily:'Helvetica Neue',
        fontSize:11,
        color:'rgb(128, 128, 128)'
    },
    ticketDescription:{
        fontFamily:'Helvetica Neue',
        fontSize:12,
        color:'rgb(85, 85, 85)'
    },
    subRow:{
        width:'100%',
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1,
        paddingTop:15,
        paddingBottom:11
    },
    dropDownBtnStyle:{
        width:'55%', 
        borderColor:'rgb(177, 176, 176)', 
        borderWidth:1, 
        borderRadius:6, 
        alignItems:'center'
    },
    dropDownBtnTxtStyle:{
        color:'rgb(86, 85, 85)', 
        fontFamily:'Helvetica Neue', 
        fontSize:14
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
    sendBtnStyle: {
        marginTop:17,
        marginBottom:29,
        marginHorizontal:35.5,
        height: 43.5 * Metrics.scaleHeight,
        backgroundColor:'rgb(112, 180, 44)',
        alignItems: 'center',
        justifyContent: 'center',    
        borderRadius:0,
        borderWidth:0,    
        borderBottomColor:'rgb(75, 121, 28)',
        borderBottomWidth:3 * Metrics.scaleHeight,
    },
    sendBtnText:{
        fontFamily:'Helvetica Neue',
        fontSize:16,
        color:'#ffffff'
    },
    richText: {
        paddingTop: 20,
        height:150,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',     
    },
    item:{
        flexDirection:'row',
        height:44,
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: 'transparent',
        borderBottomColor:'rgb(228, 228, 228)', 
        borderBottomWidth:1
    },	
    labelText:{
        fontFamily:'Helvetica Neue',
        fontSize:16, 
        color:'rgb(86, 85, 85)', 
        backgroundColor:'transparent'
    },
})