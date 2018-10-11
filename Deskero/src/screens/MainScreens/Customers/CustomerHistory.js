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
    RefreshControl,
    ActivityIndicator,
    Image
  } from 'react-native'
// import Image from 'react-native-image-progress'
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import InfiniteScroll from 'react-native-infinite-scroll';
import { Avatar } from 'react-native-elements';
import UserAvatar from 'react-native-user-avatar';
import DialogBox from 'react-native-dialogbox'

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { startMainTab } from '../../../app'


export default class CustomerHistoryScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            customer:{},
            customerId:this.props.customerId,
            openedVsClosed:'...',
            morePageToLoad:true,
            nextPage:1,
            tickets:[],
            detailCustomerCustomFields:{},
            refreshing:false,
            loading:true,
            loadingComplete:true,
            menuExpended: false
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            this.props.navigator.pop()
        }else if(event.id === 'menu'){
            this.setState({
                menuExpended: true
            })
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

    goToEditCustomer(){        
        this.props.navigator.push({
            title: Locale.t('CUSTOMER_EDIT.TITLE'),
            screen: "deskero.AddEditCustomerScreen",    
            passProps:{
                customerId: this.state.customerId
            },                        
            navigatorButtons: {
                leftButtons: [
                    {
                        id:'close',
                        icon: Images.closeIcon
                    }
                ],
                rightButtons: [                        
                    {
                        id: 'save',
                        icon: Images.checkIcon
                    },
                ]
            },
        })
        
    }

    deleteCustomer(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.removeCustomer(bearer, clientId, this.state.customerId)
                    .end((err, res) => {
                        if(err){
                            this.showDialogBox(Locale.t('LOGIN.CONNECTION_ERROR'))
                        }else{
                            if(res.body.id){
                                setTimeout(()=>{                                                                         
                                    startMainTab(1)                                                                            
                                }, 500)
                            }else{
                                this.showDialogBox(res.body.data)
                            }
                        }
                        
                    })
            })
        })
    }

    showDialogBox(msg){
        this.dialogbox.tip({
            title: Locale.t('ALERT_TITLE.WHOOPS'),
            content: msg,
            btn: {
                text: Locale.t('TICKET_NEW.CONFIRM_OK')  
            }
        })
    }

    componentDidMount(){      
        this.getCustomer()

    }  

    getCustomer(){
        let customer = {} 
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getCustomer(bearer, clientId, this.state.customerId)
                    .end((err, res) => {
                        if(err){
                            if(GlobalVals.customersDetail && GlobalVals.customersDetail[this.state.customerId]){
                                customer = GlobalVals.customersDetail[this.state.customerId];
                                this.setState({customer}, () => {
                                    this.getOpenedVsClosed(customer);
                                })
                            }else{
                                this.setState({loading: false})
                            }
                            
                        }else{
                            customer = res.body;
                            GlobalVals.customersDetail[this.state.customerId] = res.body;                                
                            this.setState({customer}, () => {
                                this.getOpenedVsClosed(customer);
                            })
                        }
                    })
            })
        })       

    }

    getOpenedVsClosed(customer){
        let openedVsClosed = "...";
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getCustomerOpenedVsClosed(bearer, clientId, this.state.customerId)
                    .then((res) => {
                        openedVsClosed = res.data.msg;                        
                        this.setState({openedVsClosed}, () => {
                            this.getUpdateData(customer)
                        })
                    })  
                    .catch((err) => {
                        this.getUpdateData(customer)
                    })       
                    
            })
        })
    }

    getUpdateData(customer){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getUpdates(bearer, clientId)
                    .then((res) => {
                        if(res == 'OK'){
                            setTimeout(() => {
                                this.getDetailCustomerCustomFields()
                            }, 500)
                        }                
                    })
                    .catch((err) => {
                        this.setState({loading:false})
                    })
            })
        })
    }

    getDetailCustomerCustomFields(){
        let detailCustomerCustomFields = {};
        if(this.state.customer.customFields){   
            for(var key in this.state.customer.customFields){
                let field = GlobalVals.customerCustomFields.filter(el=>el.name == key)[0]
                if(field && this.getCurrnetLanguage(field.labels)){
                    var labelKey = this.getCurrnetLanguage(field.labels);
                    detailCustomerCustomFields[labelKey] = this.state.customer.customFields[key];
                }else{
                    detailCustomerCustomFields[key] = this.state.customer.customFields[key];
                }                                              
            }
            
            this.setState({detailCustomerCustomFields}, () =>{
                this.loadPage()
                
            })
        }else(           
            this.loadPage()           
        )
    }

    doRefresh(){
        let tickets = [];
        let nextPage = 1;
        this.setState({
            tickets,
            nextPage,
            loadingComplete: false
        }, () => {
            this.loadPage()
        })
    }

    loadPage(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getTicketsSearchByCustomer(bearer, clientId, this.state.nextPage, this.state.customerId)
                    .end((err, res) => {
                        let loadingComplete = true
                        if(err){
                            this.setState({loading:false, loadingComplete})
                        }else{
                            if(res.body){
                                let result = res.body;
                                let morePageToLoad = this.state.morePageToLoad;
                                let nextPage = this.state.nextPage;
                                let tickets = this.state.tickets;
                                if(result.ticket.records.length < 10){
                                    morePageToLoad = false;
                                }else{
                                    nextPage++;
                                }

                                for(var i = 0 ; i < result.ticket.records.length ; i++){
                                    tickets.push(result.ticket.records[i])
                                }
                                let loading = false;
                                this.setState({
                                    morePageToLoad,
                                    nextPage, 
                                    tickets,
                                    loading,
                                    loadingComplete
                                })
                            }else{
                                this.setState({loading:false, loadingComplete})
                            }
                        }
                    })
            })
        })
    }

    convertDate(milliseconds){
        return new Date(milliseconds).toDateString()
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

    getUserProfilePhoto(id){
        let url = GlobalVals.propertis.domain + 'profilePhoto/customer/' + id;
        return url;
    }

    getName(text){
        let arr = text.split(" ");
        let nameStr = ""
        if(arr.length > 1){
            nameStr = arr[0].substring(0, 1) + arr[1].substring(0, 1);
        }else{
            nameStr = arr[0].substring(0, 2)
        }
        return nameStr.toUpperCase()
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
                    
                <TouchableOpacity style={styles.item} onPress={() => {
                    this.setState({menuExpended: false}, () => {
                        this.goToEditCustomer()
                    })
                    
                    }}>
                    <View style={{width:'20%', alignContent:'center', alignItems:'flex-start'}}>
                        <Icon style={{color:'rgb(86, 85, 85)'}} name="pencil" size={20}/>
                    </View>
                    <View style={{width:'80%', alignContent:'center', alignItems:'flex-start'}}>
                        <Text style={styles.labelText}>{Locale.t('CUSTOMER_EDIT.TITLE')}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={() => {
                    this.setState({
                        menuExpended: false,
                        loading: true
                    }, () => {
                        this.deleteCustomer()
                    })
                    
                    }}>
                    <View style={{width:'20%', alignContent:'center', alignItems:'flex-start'}}>
                        <Icon style={{color:'rgb(86, 85, 85)'}} name="trash" size={20}/>
                    </View>
                    <View style={{width:'80%', alignContent:'center', alignItems:'flex-start'}}>
                        <Text style={styles.labelText}>{Locale.t('CUSTOMER_EDIT.DELETE')}</Text>
                    </View>
                </TouchableOpacity>

                
            </View>
        )
    }

    renderTicketHistories(){
        let tickets = this.state.tickets.map((ticket, i) => {
            return (
                <TouchableOpacity key={i} style={{flexDirection:'row'}} onPress={() => {
                    this.goToDetail(ticket)
                }}>
                    <View style={[styles.leftBar, this.getLeftBarColor(ticket.status.status)]} />
                    <View style={styles.historyBody}>
                        <Text style={styles.historyText}>#{ticket.number} - {this.convertDate(ticket.insertDate)}</Text>
                        <Text style={[styles.historyText, {color:'#000', fontSize:16}]}>{ticket.subject}</Text>
                        <Text style={styles.historyText}>Assigned to {ticket.assignedTo ? ticket.assignedTo.name : ''}, from {this.getCurrnetLanguage(ticket.source.labels)} in {this.getCurrnetLanguage(ticket.type.labels)}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return tickets;
    }

    renderFieldList(){
        if(this.state.detailCustomerCustomFields){
            let fieldArray = [];
            var i = 0;
            for(var key in this.state.detailCustomerCustomFields){                
                if(this.state.detailCustomerCustomFields[key] && this.state.detailCustomerCustomFields[key] != ""){
                    i++;
                    let field = <View key={i} style={styles.textInputView}>
                                    <Text style={styles.label}>{key}</Text>
                                    <Text style={styles.textInput}>{this.state.detailCustomerCustomFields[key]}</Text>                        
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

    renderContent(){
        return (
            <View style={styles.content}>
                {
                    this.state.customer.ticketCount > 0 && 
                        <View style={{paddingTop:30 * Metrics.scaleHeight, paddingBottom:20 * Metrics.scaleHeight, alignItems:'center', borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1}}>
                            <Text style={{color:'#000', fontSize:70}}>{this.state.openedVsClosed}</Text>
                            <Text style={{color:'#000', fontSize:15}}>{Locale.t('CUSTOMER_HISTORY.OPENED_VS_CLOSED')}</Text>
                        </View>
                }
                <View>                    
                    <View style={[styles.textInputView, {flexDirection: 'row', alignItems:'center'}]}>
                        {
                            this.state.customer.profilePhotoUrl ?
                                <Avatar width={58} height={58} rounded={true} indicator={ProgressBar} source={{uri: this.getUserProfilePhoto(this.state.customer.id)}} avatarStyle={styles.listingPicture}/>
                            :
                                // <Avatar width={58} height={58} rounded={true} indicator={ProgressBar} source={Images.userIcon} avatarStyle={styles.listingPicture}/>
                                <UserAvatar name={this.state.customer.name ? this.getName(this.state.customer.name) : '..'} size="58" color={'gray'}/>
                        }
                        <Text style={styles.textName}>{this.state.customer.name}</Text>                        
                    </View>

                    {
                        this.state.customer.company &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.COMPANY')}</Text>
                            <Text style={styles.textInput}>{this.state.customer.company}</Text>                        
                        </View>                        
                    }
                    {
                        this.state.customer.email &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.EMAIL')}</Text>
                            <Text style={styles.textInput}>{this.state.customer.email}</Text>                        
                        </View>                          
                    }
                    {
                        this.state.customer.phoneNumber &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.PHONE')}</Text>
                            <Text style={styles.textInput}>{this.state.customer.phoneNumber}</Text>                        
                        </View>                        
                    }   
                    {
                        this.state.customer.mobileNumber &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.MOBILE')}</Text>
                            <Text style={styles.textInput}>{this.state.customer.mobileNumber}</Text>                        
                        </View>                         
                    }     
                    {
                        this.state.customer.address &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.ADDRESS')}</Text>
                            <Text style={styles.textInput}>{this.state.customer.address}</Text>                        
                        </View>                         
                    }    
                    {
                        this.state.customer.city &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.CITY')}</Text>
                            <Text style={styles.textInput}>{this.state.customer.city}</Text>                        
                        </View>                         
                    }   
                    {
                        this.state.customer.stateName &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.STATE')}</Text>
                            <Text style={styles.textInput}>{this.state.customer.stateName}</Text>                        
                        </View>                          
                    } 
                    {                       
                        this.renderFieldList()
                    } 
                    {
                        this.state.customer.topClient &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.TOPCLIENT')}</Text>
                            <Text style={styles.textInput}>Yes</Text>                        
                        </View>                         
                    } 
                    {
                        this.state.customer.memo &&
                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('CUSTOMER_HISTORY.MEMO')}</Text>
                            <Text style={styles.textInput}>{this.state.customer.memo}</Text>                        
                        </View>                         
                    } 
                    {
                        this.state.customer.ticketCount > 0 &&
                            <View style={[styles.textInputView, {backgroundColor:'#f5f5f5'}]}>
                                <Text style={[styles.textInput, {color:'#000'}]}>{Locale.t('CUSTOMER_HISTORY.TITLE')}</Text> 
                            </View>
                    }
                    {
                        this.state.customer.ticketCount > 0 &&
                            this.renderTicketHistories()
                    }

                </View>
                
            </View>
        )
    }

    render() {
        return (            
            <View style={[styles.container, this.state.loading && {justifyContent:'center'}]}> 
            {
                this.state.menuExpended && 
                this.renderMenuList()   
            }
            {
                !this.state.loading ?
                    this.state.customer.ticketCount > 0 ?
                        <InfiniteScroll
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => {
                                        this.doRefresh()
                                    }}
                                    tintColor="#ff0000"
                                    colors={['#ff0000', '#00ff00', '#0000ff']}
                                    progressBackgroundColor="#ffff00"
                                />
                            }
                            horizontal={false}  //true - if you want in horizontal
                            onLoadMoreAsync={()=>{
                                if(this.state.morePageToLoad && this.state.loadingComplete && this.state.customer.ticketCount > 0){
                                    this.setState({loadingComplete: false}, () => {
                                        this.loadPage()
                                    })
                                }
                                    
                            }}
                            distanceFromEnd={10} // distance in density-independent pixels from the right end
                            >
                            {
                                this.renderContent()
                            }                            
                        </InfiniteScroll>
                    : 
                    this.renderContent()
                :
                <ActivityIndicator size="large" color="#ff0000" />        
            }       
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>           
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        
        backgroundColor: '#f5f5f5',
    },   
    content:{
        width:Metrics.screenWidth - 13,
        backgroundColor:'white',
        marginTop: 11,
        marginLeft:6.5,
        marginRight:6.5,
        marginBottom:11,       
    },
    textInputView:{
        padding:12,
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1
    },
    label:{
        fontFamily:'Helvetica Neue',
        textAlign:'left',
        fontSize:10,
        color:'#777'
    },
    textName:{
        paddingLeft:22,
        fontFamily:'Helvetica Neue',
        color:'rgb(223, 61, 0)',
        fontSize:20
    },
    textInput:{
        fontFamily:'Helvetica Neue',
        textAlign:'left',
        fontSize:16,
        color:'#444'
    },
    historyItem:{

    },
    leftBar:{
        width:5,
    },
    historyBody:{
        width:'100%',
        paddingTop:5,
        paddingLeft:15,
        paddingBottom:5,
        borderBottomColor:'#ddd',
        borderBottomWidth:1
    },
    historyText:{
        fontFamily:'Helvetica Neue',
        fontSize:12.5,
        color:'#666'
    },
    listingPicture:{
        backgroundColor: 'rgb(156, 155, 155)',        
        alignSelf: 'flex-start',        
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