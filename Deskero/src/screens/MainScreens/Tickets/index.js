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
import { SearchBar } from 'react-native-elements'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import CardView from 'react-native-cardview'
import moment from 'moment'
import { isIphoneX } from 'react-native-iphone-x-helper'

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { TicketMenus } from '../../../components'

export default class TicketScreen extends Component {   
    static navigatorStyle = {
        navBarHidden: true
    };


    constructor(props){
        super(props)
        this.state = {
            filter:{standard: "pending"},
            title:'',
            tickets:[],
            morePageToLoad:true,
            nextPage:1,
            loadingComplete:false,
            refreshing:false,
            loading:true,
            role:GlobalVals.user.role,
            badges:{},
            menuExpended: false
        }

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if(event.id === 'bottomTabReselected' || event.id === 'bottomTabSelected' || event.id === 'willAppear'){
            GlobalVals.currentPage = 'ticket'
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

    goToSearchTicketScreen(){
        this.props.navigator.push({
            title:Locale.t('TICKETS_SEARCH.TITLE'),
            screen: "deskero.SearchTicketScreen",               
            navigatorButtons: {
                leftButtons:[
                    {
                        id: 'back', 
                        icon: Images.backIcon,
                    }
                ],
                rightButtons: [            
                    {
                        id: 'search',
                        icon: Images.searchIcon,
                    
                    }                        
                ]
            },
        })
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
        this.setState({title: Locale.t('TICKETS.TITLE_PENDING')})
        
        GlobalVals.currentSearchFilterParam = JSON.stringify(this.state.filter)        
        
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                let morePageToLoad = this.state.morePageToLoad;
                let nextPage = this.state.nextPage;
                let tickets = this.state.tickets; 
                Client.getUpdates(bearer, clientId)
                    .then((res) => {
                        if(res == 'OK'){
                            this.loadPage(morePageToLoad, nextPage, tickets)                                                    
                        }                
                    })
                    .catch((err) => {
                        this.loadPage(morePageToLoad, nextPage, tickets)
                })
                Client.getAllBadges(bearer, clientId)
                    .end((err, res) => {
                        if(err){
                            // console.log(err)
                        }else{
                            // console.log(res.status)
                            // console.log(res.body)
                            if(res.status == 204){

                            }else{
                                for(var i = 0 ; i < res.body.badge.length ; i++){
                                    GlobalVals.badges[res.body.badge[i].name] = res.body.badge[i].number;                                    
                                }
                                localStorage.set('badges', JSON.stringify(GlobalVals.badges));
                                this.setState({
                                    badges:GlobalVals.badges
                                })
                                
                            }
                        }
                    })
            })
        })

        
    }

    applyFilter(filterToApply){        
        let filter = {
            standard: 'pending'
        }
        let title = ""
        filter = {
            standard: filterToApply
        }
        if(filterToApply == 'toReply'){
            title = Locale.t('TICKETS.TITLE_TOREPLY')
        }else if(filterToApply == 'priority'){
            title = Locale.t('TICKETS.TITLE_PRIORITY')
        }else if(filterToApply == 'topClients'){
            title = Locale.t('TICKETS.TITLE_TOPCLIENTS')
        }else if(filterToApply == 'all'){
            title = Locale.t('TICKETS.TITLE_ALL')
        }


        GlobalVals.currentSearchFilterParam = JSON.stringify(filter);  
        let morePageToLoad = true;
        let nextPage = 1;
        let tickets = []; 

        this.setState({title, filter, morePageToLoad, nextPage, tickets, loading: true}, () => {
            
            this.loadPage(morePageToLoad, nextPage, tickets)
        }) 
    }  

    
    loadPage(morePageToLoad, nextPage, tickets){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                if(this.state.filter.standard == 'pending'){  
                    
                    Client.getTicketAll(bearer, clientId, nextPage, this.state.filter)
                        .end((err, res) => {
                            let loadingComplete = true;
                            
                            if(err){
                                this.setState({loadingComplete})
                            }else{
                                if(res.body){
                                    // console.log(loadingComplete)
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
                                    refreshing:false,
                                })
                            }
                        })
                
                }else{
                    Client.getTicketSearchAll(bearer, clientId, nextPage, this.state.filter)
                        .end((err, res) => {
                            let loadingComplete = true;
                            if(err){
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
                }
            })
        })
    }

    doRefresh(){
        if(!this.state.loadingComplete)
            return
            
        let tickets = [];
        let nextPage = 1;
        let morePageToLoad = true;
        this.setState({
            tickets,
            nextPage,
            refreshing: true,
            loadingComplete: false,
            morePageToLoad
        }, () => {
            this.loadPage(morePageToLoad, nextPage, tickets);
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
        }else if(source == 'mysms'){            
            return Images.phoneOutIcon         
        }else {
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
 
    renderHeader(){
        return(            
            Platform.OS === 'ios' ?
            <View style={styles.header}> 
                <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>                    
                    <View style={{width:'30%', paddingTop: isIphoneX() ? 54 : 32}} />
                    <TouchableOpacity style={{
                        flexDirection:'row', 
                        width:'40%', 
                        alignItems:'center', 
                        justifyContent:'center', 
                        paddingTop: isIphoneX() ? 54 : 32}}
                        onPress={() => { this.setState({menuExpended:!this.state.menuExpended})}}>                            
                        <Text style={{fontFamily:'Helvetica Neue', color:'#ffffff', fontSize:17, textAlign:'center', fontWeight:"600", paddingRight: 3}}>{this.state.title}</Text>                                
                        {
                            this.state.menuExpended == false ?
                                <Icon style={{color: '#fff'}} name="angle-down" size={18} />
                            :
                                <Icon style={{color: '#fff'}} name="angle-up" size={18} />
                        }
                    </TouchableOpacity>
                    <View style={{width:'30%', flexDirection:'row', paddingTop: isIphoneX() ? 54 : 32}}>
                        <View style={{width:'16%'}} />
                        <TouchableOpacity style={{width:'42%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                            this.goToSearchTicketScreen()
                        }}>
                            <Image style={{width:24, height: 24}} source={Images.searchIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:'42%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                            this.goToAddEditTicketScreen('new')
                        }}>
                            <Image style={{width:24, height: 24}} source={Images.ticketPlusIcon} />
                        </TouchableOpacity>
                    </View>
                </View>                 
            </View>
            :
            <View style={[styles.header, {height:57}]}>                
                <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>                    
                    <View style={{width:'5%', paddingTop:16}} />
                    <View style={{width:'65%', alignItems:'flex-start', justifyContent:'center', paddingTop:16}}>     
                        <View style={{flexDirection:'row'}}>                       
                            <Text style={{fontFamily:'Helvetica Neue', color:'#ffffff', fontSize:17, textAlign:'center', fontWeight:"400",}}>{this.state.title}</Text>                                
                            <TouchableOpacity style={{marginLeft:5}} onPress={() => { this.setState({menuExpended:!this.state.menuExpended})}}>
                                {
                                    this.state.menuExpended == false ?
                                        <Icon style={{color: '#fff'}} name="angle-down" size={18} />
                                    :
                                        <Icon style={{color: '#fff'}} name="angle-up" size={18} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width:'30%', flexDirection:'row', paddingTop:16}}>
                        <View style={{width:'10%'}} />
                        <TouchableOpacity style={{width:'45%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                            this.goToSearchTicketScreen()
                        }}>
                            <Image style={{width:18, height: 18}} source={Images.searchIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:'45%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                            this.goToAddEditTicketScreen('new')
                        }}>
                            <Image style={{width:21, height: 18}} source={Images.ticketPlusIcon} />
                        </TouchableOpacity>
                    </View>
                </View>                 
            </View>
        )
    }

    renderListRowContent(ticket, rowId){
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
                                <Text style={[styles.ticketNumber, {fontWeight:'bold'}]}>{Locale.t('TICKET_NEW.CC')} #{ticket.number}></Text>
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
  
    renderListRow(ticket, rowId){
        return (
            Platform.OS == 'android' ?
                <CardView
                    cardElevation={2}
                    cardMaxElevation={2}
                    >
                    {
                        this.renderListRowContent(ticket, rowId)
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
                        this.renderListRowContent(ticket, rowId)
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
                <View style={{width:Metrics.screenWidth, alignItems:'center', paddingTop:11}}>
                    <Text style={styles.emptyTxt}>{Locale.t('CUSTOMERS.NO_RESULTS')}</Text>
                </View>
            :
                <View style={styles.content}>
                    <SwipeListView
                        dataSource={this.ds.cloneWithRows(this.state.tickets)}
                        enableEmptySections={true}
                        renderRow={ (ticket, secId, rowId, rowMap) => {
                            return this.renderListRow(ticket, rowId)
                        }}
                        renderHiddenRow={ (ticket, secId, rowId, rowMap) => {
                            return this.renderListHiddenRow(ticket)
                        }}
                        rightOpenValue={-132}
                        // leftOpenValue={132}
                    />                     
                </View>
        )
    }

    render() { 
        return (
            <View style={styles.container}>   
            {
                this.renderHeader()
            }
            {
                this.state.menuExpended && 
                <TicketMenus 
                    styles={styles}
                    badges={this.state.badges}
                    selectMenuBtn={(text) => {
                        this.setState({menuExpended: false}, () => {
                            this.applyFilter(text)
                        })
                    }}
                />
            }
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
                                let morePageToLoad = this.state.morePageToLoad;
                                let nextPage = this.state.nextPage;
                                let tickets = this.state.tickets; 
                                this.loadPage(morePageToLoad, nextPage, tickets)
                            })                         
                            
                        }                            
                    }}
                    distanceFromEnd={400} // distance in density-independent pixels from the right end
                    >     
                    {                        
                        this.renderContent()
                    }
                </InfiniteScroll>                              
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,    
      backgroundColor: '#f5f5f5',
    },    
    header:{
        backgroundColor:'#df3d00',
        width:'100%',
        height: isIphoneX() ? 88 : 64
    },
    content:{
        width: Metrics.screenWidth - 13,
        marginLeft:6.5,
        marginRight:6.5,
        backgroundColor:'white',
        marginTop:11,
        marginBottom:11,       
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
        right: 0,
        zIndex:0
    },
    rowFront: {               
		justifyContent: 'center',
        backgroundColor: '#fff',        
    },
    leftBar:{
        width:5,
    },   
    itemView:{
        flexDirection:'row',
    },
    ticketSubject:{
        fontFamily:'Helvetica Neue',
        paddingLeft:9, 
        fontSize:16, 
        color:'rgb(223, 61, 0)',
        
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
    bigBadge: {
        width:27
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