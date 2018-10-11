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


export default class CustomSearchTicketsScreen extends Component {    
    constructor(props){
        super(props)
        this.state = {
            filter: this.props.filter,
            tickets:[],
            morePageToLoad:true,
            nextPage:1,
            loadingComplete:false,
            refreshing:false,
            loading:true,
            role:GlobalVals.user.role,
            visible:false,            
            dataReadStatus: false
        }

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            this.props.navigator.pop()
        }else if(event.id === 'search'){
            this.props.navigator.pop()
        }else if(event.id === 'addTicket'){
            this.goToAddEditTicketScreen('new')
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
            })
        })

        
    }
    
    ////////////////////////////////////////////////////////

    loadPage(morePageToLoad, nextPage, tickets){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getTicketAll(bearer, clientId, nextPage, this.state.filter)
                    .end((err, res) => {
                        let loadingComplete = true;                                          
                        if(err){
                            // console.log(err)
                            // this.setState({dataReadStatus})
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
                                refreshing:false,
                            })
                        }
                })
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
                    <View style={[styles.leftBar, this.getLeftBarColor(ticket.status.status)]} />
                    <View style={{padding:12}}>
                        <View style={{flexDirection:'row', paddingBottom:8}}>
                            <Image style={{width:20, height:20}} source={this.getImageObj(ticket.source.source)} />
                            <Text style={styles.ticketSubject} >{ticket.subject}</Text>
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
                <View style={{width:Metrics.screenWidth, alignItems:'center', paddingTop:11}}>
                    <Text style={styles.emptyTxt}>{Locale.t('TICKETS_SEARCH.NO_RESULTS')}</Text>
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