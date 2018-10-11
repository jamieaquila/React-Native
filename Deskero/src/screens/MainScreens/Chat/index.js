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
import _ from 'lodash';
import { isIphoneX } from 'react-native-iphone-x-helper'

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { startMainTab } from '../../../app'

export default class ChatScreen extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };
    constructor(props){
        super(props)

        this.state = {
            title:Locale.t('CHAT.TITLE'),
            menuExpended: false,
            selectedMenu: '',
            globalData: GlobalVals,
            currentChatSessionId: '',
            otherUserId: '',
            firsLoad: false,
            menuList: []
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        
    }

    onNavigatorEvent(event) {        
        if(event.id === 'bottomTabReselected' || event.id === 'bottomTabSelected' || event.id === 'willAppear'){
            GlobalVals.currentPage = 'chat'
        }        
    }
     
    componentDidMount(){   
        Client.socketStatusCheck(this, 'chat')   
        let menuList = [
            {
                id: 'online',
                text: Locale.t('CHAT.STATUS_ONLINE'),
            },
            {
                id: 'busy',
                text: Locale.t('CHAT.STATUS_BUSY'),
            },
            {
                id: 'invisible',
                text: Locale.t('CHAT.STATUS_INVISIBLE'),
            },
            {
                id: 'online for agents',
                text: Locale.t('CHAT.STATUS_ONLINE_FOR_AGENTS'),
            },
            {
                id: 'offline',
                text: Locale.t('CHAT.STATUS_OFFLINE'),
            }
        ]
        localStorage.get('chatStartStatus').then((chatStartStatus) => {
            let selectedMenu = ""
            if(chatStartStatus){
                selectedMenu = chatStartStatus
                
            }else{
                selectedMenu = menuList[0].id
            }
            this.setState({
                menuList,
                selectedMenu
            })
        })
    }

    changeSocketStatus(currentChatSessionId, otherUserId){        
        let globalData = GlobalVals                     
        if(!this.state.firsLoad){
            this.setState({firsLoad: true}, () => {
                this.changeStatus(this.state.selectedMenu)
            })
        }else{
            this.setState({
                globalData,
                currentChatSessionId,
                otherUserId
            })
        }
        
    }

    getMenuIcon(){
        let img = Images.onlineStatusIcon
        if(this.state.selectedMenu == this.state.menuList[0].id){
            img = Images.onlineStatusIcon
        }else if(this.state.selectedMenu == this.state.menuList[1].id){
            img = Images.busyStatusIcon
        }else if(this.state.selectedMenu == this.state.menuList[2].id){
            img = Images.invisibleStatusIcon
        }else if(this.state.selectedMenu == this.state.menuList[3].id){
            img = Images.onlineagentIcon
        }else if(this.state.selectedMenu == this.state.menuList[4].id){
            img = Images.offlineStatusIcon
        }

        return img
    }

    getIconColor(status){
        let color = ""
        if(status == this.state.menuList[0].id){
            color = "#439e06"
        }else if(status == this.state.menuList[1].id){
            color = "#b94a48"
        }else if(status == this.state.menuList[2].id){
            color = "#ccc"
        }else if(status == this.state.menuList[3].id){
            color = "#f89406"
        }else if(status == this.state.menuList[4].id){
            color = "#4d4d4d"
        }
        return color
    }

    changeStatus(status){
        let curStatus = ""
        if(status == this.state.menuList[0].id){
            curStatus = "AVAILABLE"
        }else if(status == this.state.menuList[1].id){
            curStatus = "BUSY"
        }else if(status == this.state.menuList[2].id){
            curStatus = "INVISIBLE"
        }else if(status == this.state.menuList[3].id){
            curStatus = "ONLY_AGENTS"
        }else if(status == this.state.menuList[4].id){
            curStatus = "OFFLINE"
        }
        localStorage.get('clientId').then((clientId) => {
            localStorage.get('chatUserId').then((chatUserId) => {
                Client.sendChangeStatus(clientId, chatUserId, curStatus)
            })
        })
    }

    getMenuName(id){
        var name = ''
        for(var i = 0 ; i < this.state.menuList.length ; i++){
            if(id == this.state.menuList[i].id){
                name = this.state.menuList[i].text
                break;
            }
        }
        // console.log(this.state.menuList)
        return name
    }

    showChatSesion(chatUserId){
        GlobalVals.currentPage = 'session'
        this.props.navigator.push({
            title: this.state.title,
            screen: "deskero.ChatSessionScreen",   
            passProps: {
                chatUserId: chatUserId
            },                         
            navigatorButtons: {
                leftButtons: [
                    {
                        id:'back',
                        icon: Images.backIcon
                    }
                ]
            },
        })
    }

    reconnect(){
    }   
    
    isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }    
        return JSON.stringify(obj) === JSON.stringify({});
    }

    renderHeader(){
        return(     
            Platform.OS === 'ios' ?       
                <View style={styles.header}>
                    <View style={{paddingTop: isIphoneX() ? 54 : 32}} />
                    <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>                    
                        <View style={{width:'44%'}} />
                        <View style={{width:'12%', alignItems:'center', justifyContent:'center'}}>                            
                            <Text style={{fontFamily:'Helvetica Neue', color:'#ffffff', fontSize:17, textAlign:'center', fontWeight:"600",}}>{this.state.title}</Text>                                                                
                        </View>
                        <View style={{width:'44%', flexDirection:'row'}}>
                            <View style={{width:'55%', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Helvetica Neue', color:'#ffffff', fontSize:12, textAlign:'right'}}>{this.getMenuName(this.state.selectedMenu)}</Text>
                            </View>
                            <View style={{width:'20%', alignItems:'center', justifyContent:'center'}}>
                            {
                                this.state.menuList.length > 0 && 
                                <Image style={{width:24, height: 24}} source={this.getMenuIcon()} />
                            }
                                
                            </View>
                            <TouchableOpacity style={{width:'15%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                                if(this.state.globalData.chatConnected == 'OK')
                                    this.setState({menuExpended:!this.state.menuExpended})
                            }}>
                                {
                                    this.state.menuExpended == false ?
                                        <Icon style={{color: '#fff'}} name="angle-down" size={20} />
                                    :
                                        <Icon style={{color: '#fff'}} name="angle-up" size={20} />
                                }                                
                            </TouchableOpacity>
                        </View>
                    </View>                      
                </View>
            :
                <View style={[styles.header, {height:57}]}>
                    <View style={{paddingTop: 16}} /> 
                    <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>                    
                        <View style={{width:'5%'}} />
                        <View style={{width:'51%', alignItems:'flex-start', justifyContent:'center'}}>                            
                            <Text style={{fontFamily:'Helvetica Neue', color:'#ffffff', fontSize:17, textAlign:'center', fontWeight:"400"}}>{this.state.title}</Text>                                                                
                        </View>
                        <View style={{width:'44%', flexDirection:'row'}}>
                            <View style={{width:'55%', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Helvetica Neue', color:'#ffffff', fontSize:12, textAlign:'right'}}>{this.getMenuName(this.state.selectedMenu)}</Text>
                            </View>
                            <View style={{width:'20%', alignItems:'center', justifyContent:'center'}}>
                            {
                                this.state.menuList.length > 0 && 
                                <Image style={{width:24, height: 24}} source={this.getMenuIcon()} />
                            }
                            </View>
                            <TouchableOpacity style={{width:'15%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                                if(this.state.globalData.chatConnected == 'OK')
                                    this.setState({menuExpended:!this.state.menuExpended})
                            }}>
                                {
                                    this.state.menuExpended == false ?
                                        <Icon style={{color: '#fff'}} name="angle-down" size={20} />
                                    :
                                        <Icon style={{color: '#fff'}} name="angle-up" size={20} />
                                }
                                
                            </TouchableOpacity>
                        </View>
                    </View>                   
                </View>   
        )
    }

    renderMenuList(){
        let menuItems = this.state.menuList.map((item, i) => {
            return (
                <TouchableOpacity key={i} style={styles.item} onPress={() => {
                    this.setState({
                        selectedMenu: item.id,
                        menuExpended: false
                    }, () => {
                        this.changeStatus(item.id)
                    })
                }}>
                    <View style={{width:'15%', alignContent:'center', alignItems:'flex-start'}}>
                        <Ionicons style={{color:this.getIconColor(item.id)}} name='md-radio-button-on' size={20}/>
                    </View>
                    <View style={{width:'70%', alignContent:'center', alignItems:'flex-start'}}>
                        <Text style={styles.labelText}>{this.getMenuName(item.id)}</Text>
                    </View>
                    {
                        this.state.selectedMenu == item.id &&
                        <View style={{width:'15%', alignContent:'center', alignItems:'flex-end'}}>
                            <Ionicons style={{color:"#4d4d4d"}} name='ios-checkmark-outline' size={20}/>
                        </View>
                    }
                    

                </TouchableOpacity>
            )
        })
        return (
            <View style={[styles.content, {marginBottom:0}]}>
                <View style={{backgroundColor:'#fff'}}>
                    {
                        menuItems
                    }
                </View>
            </View>
        )
    }

    renderVisitors(){
        let visitorItems = []
        let i = 0;
        for (var key in this.state.globalData.onlineUsers.visitors) {
            let chatBadges = this.state.globalData.chatBadges[this.state.globalData.onlineUsers.visitors[key].chatUserId]
            let item = 
                <TouchableOpacity key={i} style={styles.listItem} onPress={() => {
                    this.showChatSesion(this.state.globalData.onlineUsers.onlineUsers[key].chatUserId)
                }}>                    
                    <View style={[{alignItems:'flex-start'}, chatBadges > 0 ? {width:'80%'} : {width:'90%'}]}>
                        <Text style={styles.listItemText}>{this.state.globalData.onlineUsers.visitors[key].name}</Text>
                    </View>
                    {
                        chatBadges > 0 &&
                        <View style={{width:'10%', alignItems:'center', justifyContent:'center'}}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{chatBadges}</Text>
                            </View>
                        </View>
                    }  
                    <View style={{width:'10%', alignItems:'flex-end'}}>
                        <Ionicons style={{color: 'rgb(79, 136, 213)'}} name='ios-arrow-forward-outline' size={20}/>   
                    </View>
                </TouchableOpacity>
            visitorItems.push(item)
            i++            
        }

        return visitorItems
    }

    renderCustomers(){
        let customerItems = []
        let i = 0;
        for (var key in this.state.globalData.onlineUsers.customers) {
            if(this.state.globalData.onlineUsers.customers[key].chatUserId != this.state.globalData.user.chatUserId){
                let chatBadges = this.state.globalData.chatBadges[this.state.globalData.onlineUsers.customers[key].chatUserId]
                GlobalVals.customerFound = true
                let item = 
                    <TouchableOpacity key={i} style={styles.listItem} onPress={() => {
                        this.showChatSesion(this.state.globalData.onlineUsers.customers[key].chatUserId)
                    }}>                       
                        <View style={[{alignItems:'flex-start'}, chatBadges > 0 ? {width:'80%'} : {width:'90%'}]}>
                            <Text style={styles.listItemText}>{this.state.globalData.onlineUsers.customers[key].name}</Text>
                        </View>
                        {
                            chatBadges > 0 &&
                            <View style={{width:'10%', alignItems:'center', justifyContent:'center'}}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{chatBadges}</Text>
                                </View>
                            </View>
                        }
                        <View style={{width:'10%', alignItems:'flex-end'}}>
                            <Ionicons style={{color: 'rgb(79, 136, 213)'}} name='ios-arrow-forward-outline' size={20}/>   
                        </View>
                    </TouchableOpacity>
                customerItems.push(item)
                i++
            }
            
        }

        return customerItems
    }

    renderAgents(){      
        let agentItems = []
        let i = 0;
        for (var key in this.state.globalData.onlineUsers.agents) {
            if(this.state.globalData.onlineUsers.agents[key].chatUserId != this.state.globalData.user.chatUserId){
                let chatBadges = this.state.globalData.chatBadges[this.state.globalData.onlineUsers.agents[key].chatUserId]
                GlobalVals.agentFound = true
                let item = 
                    <TouchableOpacity key={i} style={styles.listItem} onPress={() => {
                        this.showChatSesion(this.state.globalData.onlineUsers.agents[key].chatUserId)
                    }}>
                        <View style={[{alignItems:'flex-start'}, chatBadges > 0 ? {width:'80%'} : {width:'90%'}]}>
                            <Text style={styles.listItemText}>{this.state.globalData.onlineUsers.agents[key].name}</Text>
                        </View>
                        {
                            chatBadges > 0 &&
                            <View style={{width:'10%', alignItems:'center', justifyContent:'center'}}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{chatBadges}</Text>
                                </View>
                            </View>
                        }  
                        <View style={{width:'10%', alignItems:'flex-end'}}>
                            <Ionicons style={{color: 'rgb(79, 136, 213)'}} name='ios-arrow-forward-outline' size={20}/>   
                        </View>
                    </TouchableOpacity>
                agentItems.push(item)
                i++
            }
            
        }

        return agentItems
    }

    render() {        
        return (
            <View style={styles.container}>                    
                {
                    this.renderHeader()
                }
                {
                    this.state.menuExpended && 
                    this.renderMenuList()
                    
                }
                <ScrollView ref="scroll">                    
                    {
                        this.state.globalData.chatConnected == 'PROGRESS' &&
                        <View style={{width:'100%', paddingTop:11.5, backgroundColor: '#f5f5f5', justifyContent:'center', alignItems:'center'}}>
                            <Text style={styles.aletText}>{Locale.t('CHAT.CONNECTION_IN_PROGRESS')}</Text>
                        </View>
                    }
                    {
                        this.state.globalData.chatConnected == 'ERROR' &&
                        <View style={{width:'100%', paddingTop:11.5, backgroundColor: '#f5f5f5', justifyContent:'center', alignItems:'center'}}>
                            <Ionicons style={{color:"#ef473a"}} name='ios-close-circle-outline' size={50}/>
                            <Text style={styles.aletText}>{Locale.t('ALERT_TITLE.WHOOPS')}</Text>
                            <Text style={styles.aletText}>{Locale.t('LOGIN.CONNECTION_ERROR')}</Text>
                            <TouchableOpacity onPress={()=>{}}>
                                <Text style={styles.aletText}>{Locale.t('CHAT.CONNECTION_RETRY')}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        this.state.globalData.chatConnected == 'OK' && this.state.globalData.chatUserStatus == 'OFFLINE' &&
                        <View style={{width:'100%', paddingTop:11.5, backgroundColor: '#f5f5f5', justifyContent:'center', alignItems:'center'}}>
                            <Ionicons style={{color:"#ef473a"}} name='ios-close-circle-outline' size={50}/>
                            <Text style={styles.aletText}>{Locale.t('CHAT.OFFLINE_MESSAGE')}</Text>                            
                        </View>
                    }
                    <View style={styles.content}>
                    {
                        this.state.globalData.chatConnected == 'OK' && this.state.globalData.chatUserStatus != 'OFFLINE' &&
                        <View style={{width:'100%', backgroundColor:'#fff'}}>
                        {
                            (this.state.globalData.chatUserStatus != 'ONLY_AGENTS' && this.state.globalData.user.role == 'AGENT' && this.state.globalData.permissions.publicChat) &&
                                <View style={{paddingTop:19, marginLeft:12, marginRight:12,  backgroundColor:'#fff'}}>
                                    <Text style={styles.title}>{Locale.t('CHAT.VISITORS')}</Text>
                                    {
                                        this.state.globalData.onlineUsers.visitors && !this.isEmpty(this.state.globalData.onlineUsers.visitors) ?
                                            this.renderVisitors()
                                        :
                                            <View style={{width:'100%', paddingBottom:19.5, borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1}}>
                                                <Text style={[styles.listItemText, {color:'rgb(156, 155, 155)'}]}>{Locale.t('CHAT.NO_VISITORS')}</Text>
                                            </View>
                                    }
                                </View>
                        }
                        {
                            (this.state.globalData.chatUserStatus != 'ONLY_AGENTS' && this.state.globalData.user.role == 'AGENT') &&
                                <View style={{paddingTop:19, marginLeft:12, marginRight:12,  backgroundColor:'#fff'}}>
                                    <Text style={styles.title}>{Locale.t('CHAT.CUSTOMERS')}</Text>
                                    {
                                        this.state.globalData.onlineUsers.customers &&
                                            this.renderCustomers()
                                    }
                                    {
                                    !GlobalVals.customerFound &&
                                        <View style={{width:'100%', paddingBottom:19.5, borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1}}>
                                            <Text style={[styles.listItemText, {color:'rgb(156, 155, 155)'}]}>{Locale.t('CHAT.NO_CUSTOMERS')}</Text>
                                        </View>
                                    }
                                </View>
                        }
                            <View style={{paddingTop:19, marginLeft:12, marginRight:12,  backgroundColor:'#fff'}}>
                                <Text style={styles.title}>{Locale.t('CHAT.AGENTS')}</Text>
                                {
                                    this.state.globalData.onlineUsers.agents &&
                                        this.renderAgents()
                                }
                                {
                                    !GlobalVals.agentFound &&
                                    <View style={{width:'100%', paddingBottom:19.5, borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1}}>
                                        <Text style={[styles.listItemText, {color:'rgb(156, 155, 155)'}]}>{Locale.t('CHAT.NO_AGENTS')}</Text>
                                    </View>
                                }
                            </View>
                        </View>                        
                    }                        
                    </View>
                </ScrollView>
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
        backgroundColor:'#fff',
        marginTop:11,
        marginBottom:11,
        borderColor:'rgb(228, 228, 228)',
        borderWidth:1        
    },
    item:{
        flexDirection:'row',
        height:44,
        alignItems: 'center',
        marginHorizontal: 10,
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
    aletText:{
        paddingTop:10,
        fontFamily:'Helvetica Neue',
        fontSize:14, 
        color:'#ef473a', 
    },
    title: {
        fontFamily: 'Helvetica Neue',
        fontSize:10.9, 
        color:'rgb(223, 61, 0)', 
    },
    listItem: {
        width:'100%',
        height: 36,
        flexDirection:'row',
        alignItems:'center',
        // justifyContent: 'center',
        backgroundColor:'#fff',
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1
    },
    listItemText: {
        fontFamily: 'Helvetica Neue',
        fontSize:15, 
        color:'rgb(86, 85, 85)', 
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
    badgeText:{
        fontFamily:'Helvetica Neue',
        color:'white',
        fontSize:10
    },
})