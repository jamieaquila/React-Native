'use strict'
import React, { Component} from 'react'
import { Navigation } from 'react-native-navigation'
import {
    Text,
    View,
    ListView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableHighlight,
    Alert
  } from 'react-native'

import isEqual from 'lodash.isequal'
// import { SideMenu, List, ListItem  } from 'react-native-elements';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { startMainTab } from '../../../app'

export default class DashboardScreen extends Component {
    static navigatorButtons = {        
        rightButtons: [            
            {
                id: 'profile',
                icon: Images.userIcon          
            },
            {
                id: 'setting',
                icon: Images.settingIcon
            },
        ]
    };

    constructor(props){
        super(props)
        this.state = {
            badges:[],
            customFilters:[],
            loading:false
        }
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        console.ignoredYellowBox = [
            'Setting a timer'
         ];
    }

    onNavigatorEvent(event) {
        if (event.id === 'setting') {
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true
            });
        }else if(event.id === "profile"){            
            this.props.navigator.push({
                title:Locale.t('PROFILE.TITLE'),
                screen: "deskero.ProfileScreen",               
                navigatorButtons: {
                    leftButtons:[
                        {
                            id: 'back', 
                            icon: Images.backIcon,
                        }
                    ]
                },
            })
        }else if(event.id === 'bottomTabReselected' || event.id === 'bottomTabSelected' || event.id === 'willAppear'){
            GlobalVals.currentPage = 'dashboard'
        } 
    }

    componentDidMount(){   
        GlobalVals.currentPage = 'dashboard'     
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getAllBadges(bearer, clientId)
                    .end((err, res) => {
                        if(err){
                            
                        }else{
                            if(res.status == 204){

                            }else{
                                for(var i = 0 ; i < res.body.badge.length ; i++){
                                    GlobalVals.badges[res.body.badge[i].name] = res.body.badge[i].number;                                    
                                }
                                
                                localStorage.set('badges', JSON.stringify(GlobalVals.badges));
                                Client.socketStatusCheck(this, 'dashboard')  
                                this.setState({
                                    badges:GlobalVals.badges
                                }, () => {
                                    this.getCustomFilters();
                                    this.setTabBadge();
                                })
                                
                            }
                        }
                    })
            })
        })
    } 

    changeSocketStatus(currentChatSessionId, otherUserId){
        this.setTabBadge()
    }

    setTabBadge(){
        if(GlobalVals.user.role == 'AGENT' || GlobalVals.user.role == 'CUSTOMER'){
            let tabIndex = 2
            if(GlobalVals.user.role == 'CUSTOMER')
                tabIndex = 1
            let badges = GlobalVals.badges['tickets_pending']
            if(badges == 0) badges = null
            this.props.navigator.setTabBadge({
                tabIndex: tabIndex,
                badge: badges,
            });

        }
        if(GlobalVals.user.role == 'AGENT' || (GlobalVals.user.role == 'CUSTOMER' && GlobalVals.permissions.chat)){
            let tabIndex = 3
            if(GlobalVals.user.role == 'CUSTOMER')
                tabIndex = 2
            let badges = GlobalVals.badges['chat_unread']
            if(badges == 0) badges = null
            this.props.navigator.setTabBadge({
                tabIndex: tabIndex,
                badge: badges
            });
        }        
    }

    showDialogBox(id, secId, rowId, rowMap){    
        Alert.alert(
          '',
          Locale.t('CUSTOM_FILTER.DELETE_CONFIRM_TEXT'),
          [
            {text: Locale.t('CUSTOM_FILTER.DELETE_CONFIRM_NO'), onPress: () => {
    
             }},
            {text: Locale.t('CUSTOM_FILTER.DELETE_CONFIRM_YES'), onPress: () => {
                this.deleteFilter(id, secId, rowId, rowMap)
              
              }},
          ],
          { cancelable: false }
        )
    }    

    deleteFilter(id, secId, rowId, rowMap){
        rowMap[`${secId}${rowId}`].closeRow();
		const newData = [...this.state.customFilters];
		newData.splice(rowId, 1);
        this.setState({customFilters: newData});
        
        for(var i = 0 ; i < GlobalVals.customFilters.length ; i++){
            if(GlobalVals.customFilters[i].id == id){
                GlobalVals.customFilters.splice(i, 1);
                break;
            }
        }
        localStorage.set('customFilters-' + GlobalVals.dataKeyId, JSON.stringify(GlobalVals.customFilters))
    }

    getCustomFilters(){
        localStorage.get('customFilters-' + GlobalVals.dataKeyId).then((data) => {
            if(data){                
                GlobalVals.customFilters = JSON.parse(data)
                this.setState({
                    customFilters:GlobalVals.customFilters
                })
            }else{
                GlobalVals.customFilters = this.state.customFilters;
            }
        })
    }

    showCustomerFilterScreen(status){  
        let title = Locale.t('CUSTOM_FILTER_NEW.TITLE')
        if(status == 'edit') 
            title = Locale.t('CUSTOM_FILTER_EDIT.TITLE')

        this.props.navigator.push({
            title: title,
            screen: "deskero.AddEditCustomerFilterScreen",   
            passProps:{
                status:status
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

    addNewCustomerFilter(){  
        this.showCustomerFilterScreen('new')
    }    

    editRow(data){
        GlobalVals.customFilter = data;
        this.showCustomerFilterScreen('edit')
    }

    deleteRow(id, secId, rowId, rowMap){
        this.showDialogBox(id, secId, rowId, rowMap)
    }

    applyFilter(filterToApply){        
        // console.log(filterToApply)
        let filterParam = {
            standard: 'pending'
        }
        let title = Locale.t('TICKETS.TITLE_PENDING')

        if(typeof filterToApply === 'object'){
            filterParam = filterToApply;
            title = filterToApply.name
        }else{
            filterParam = {
                standard: filterToApply
            }
            if(filterToApply == 'pending'){
                title = Locale.t('TICKETS.TITLE_PENDING')
            }else if(filterToApply == 'toReply'){
                title = Locale.t('TICKETS.TITLE_TOREPLY')
            }else if(filterToApply == 'priority'){
                title = Locale.t('TICKETS.TITLE_PRIORITY')
            }else if(filterToApply == 'topClients'){
                title = Locale.t('TICKETS.TITLE_TOPCLIENTS')
            }else if(filterToApply == 'all'){
                title = Locale.t('TICKETS.TITLE_ALL')
            }
        }

        GlobalVals.currentSearchFilterParam = JSON.stringify(filterParam);        

        this.props.navigator.push({
            title:title,
            screen: "deskero.TicketsSearchResultScreen",
            passProps:{
                filter: filterParam
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
                        id: 'add',
                        icon: Images.ticketPlusIcon,
                    },
                    {
                        id: 'search',
                        icon: Images.searchIcon,
                    },
                ]
            },
        })
    }

    goToChatTab(){
        GlobalVals.currentPage = 'chat'
        if(GlobalVals.user.role == 'CUSTOMER'){
            this.props.navigator.dismissModal({ animationType: "slide-down" });
            this.props.navigator.switchToTab({ tabIndex: 2 });
            // startMainTab(2)
        }            
        else{
            this.props.navigator.dismissModal({ animationType: "slide-down" });
            this.props.navigator.switchToTab({ tabIndex: 3 });
            // startMainTab(3)
        }
            
    }

    render() {     
        return (
            <ScrollView ref="scroll">
                <View style={styles.container}> 
                    <View style={styles.content}>
                        <View>
                            <View style={styles.headerSection}>
                                <Image style={{width:18.5, height:20}} source={Images.yourTicketsIcon} />
                                <Text style={{fontSize:15,color:'rgb(223, 61, 0)', paddingLeft:9.5, fontFamily:'Helvetica Neue',}}>{Locale.t('DASHBOARD.TICKETS_HEADING').toUpperCase()}</Text>
                            </View>

                            <TouchableOpacity style={styles.item} onPress={() => {   
                                    this.applyFilter("pending")                      
                                }}>
                                <Text style={styles.leftText}>{Locale.t('DASHBOARD.TICKETS_PENDING')}</Text>
                                <View style={[styles.badge, this.state.badges['tickets_pending'] <= 0 && styles.badgeEmpty, this.state.badges['tickets_pending'] >= 100 && styles.bigBadge]}>
                                    <Text style={styles.badgeText}>{this.state.badges['tickets_pending']}</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.bottomLine} />

                            <TouchableOpacity style={styles.item} onPress={() => {     
                                this.applyFilter("toReply")                            
                                }}>
                                <Text style={styles.leftText}>{Locale.t('DASHBOARD.TICKETS_TO_REPLY')}</Text>
                                {
                                    GlobalVals.user.role == 'AGENT' ?
                                        <View style={[styles.badge, this.state.badges['tickets_toReply'] <= 0 && styles.badgeEmpty, this.state.badges['tickets_toReply'] >= 100 && styles.bigBadge]}>
                                            <Text style={styles.badgeText}>{this.state.badges['tickets_toReply']}</Text>
                                        </View>
                                    :
                                        <View style={[styles.badge, this.state.badges['tickets_toReplyCustomer'] <= 0 && styles.badgeEmpty, this.state.badges['tickets_toReply'] >= 100 && styles.bigBadge]}>
                                            <Text style={styles.badgeText}>{this.state.badges['tickets_toReplyCustomer']}</Text>
                                        </View>
                                }                                
                            </TouchableOpacity>

                            <View style={styles.bottomLine} />
                                    
                            <TouchableOpacity style={styles.item} onPress={() => {   
                                this.applyFilter("priority")                              
                                }}>
                                <Text style={styles.leftText}>{Locale.t('DASHBOARD.TICKETS_PRIORITY')}</Text>
                                <View style={[styles.badge, this.state.badges['tickets_priority'] <= 0 && styles.badgeEmpty, this.state.badges['tickets_priority'] >= 100 && styles.bigBadge]}>
                                    <Text style={styles.badgeText}>{this.state.badges['tickets_priority']}</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.bottomLine} />
                            
                            {                        
                                GlobalVals.user.role == "AGENT" ?                            
                                    <TouchableOpacity style={styles.item} onPress={() => {  
                                        this.applyFilter("topClients")                               
                                        }}>
                                        <Text style={styles.leftText}>{Locale.t('DASHBOARD.TICKETS_TOP_CLIENTS')}</Text>
                                        <View style={[styles.badge, this.state.badges['tickets_topClients'] <= 0 && styles.badgeEmpty, this.state.badges['tickets_topClients'] >= 100 && styles.bigBadge]}>
                                            <Text style={styles.badgeText}>{this.state.badges['tickets_topClients']}</Text>
                                        </View>
                                    </TouchableOpacity>
                                :
                                    null
                            }                    

                            {
                                GlobalVals.user.role == "AGENT" ?
                                    <View style={styles.bottomLine} />
                                : 
                                    null
                            }

                            <TouchableOpacity style={styles.item} onPress={() => {       
                                this.applyFilter("all")                          
                                }}>
                                <Text style={styles.leftText}>{Locale.t('DASHBOARD.TICKETS_ALL')}</Text>
                                <View style={[styles.badge, this.state.badges['tickets_total'] <= 0 && styles.badgeEmpty, this.state.badges['tickets_total'] >= 100 && styles.bigBadge]}>
                                    <Text style={styles.badgeText}>{this.state.badges['tickets_total']}</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <View style={[styles.bottomLine, {marginLeft:0, width:'100%'}]} /> 
                        </View>                        
                        {/* Custom Filters Header  */}
                        {
                            GlobalVals.user.role == 'AGENT' ?
                                <View style={styles.headerSection}>   
                                    <View style={{width:'8%', alignItems:'flex-start'}}>
                                        <Image style={{width:18.5, height:20}} source={Images.customFilterIcon} />
                                    </View>           
                                    <Text style={{fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(223, 61, 0)', width:'83%',textAlign:'left'}}>{Locale.t('DASHBOARD.CUSTOM_FILTERS_HEADING').toUpperCase()}</Text>                                   
                                    <TouchableOpacity style={{width:'9%', alignItems:'flex-start'}} onPress={() => {
                                        this.addNewCustomerFilter();
                                    }}>
                                        <Image style={{width:11.5, height:11.5}} source={Images.plusIcon} />
                                    </TouchableOpacity>
                                </View> 
                            :
                                null
                        }
                        {
                            GlobalVals.user.role == 'AGENT' &&
                                <View>
                                    {
                                        this.state.customFilters.length == 0 ?
                                            <Text style={{fontFamily:'Helvetica Neue',color:'#444', fontSize:16, marginLeft:11.5}} >{Locale.t('DASHBOARD.NO_CUSTOM_FILTERS')}</Text>
                                        :
                                            <SwipeListView
                                                dataSource={this.ds.cloneWithRows(this.state.customFilters)}
                                                enableEmptySections={true}
                                                renderRow={ (data, secId, rowId, rowMap) => (
                                                    <SwipeRow
                                                        disableRightSwipe={false}
                                                        disableLeftSwipe={false}                                           
                                                        rightOpenValue={-88}
                                                        style={{width:'100%'}}
                                                        >
                                                        <View style={styles.rowBack}>
                                                            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft, {alignItems:'center'}]} onPress = { () =>{
                                                                this.editRow(data)                                                    
                                                            }}>    
                                                                <Image style={{width:33, height:33}} source={Images.editItemIcon} />                                                
                                                                
                                                            </TouchableOpacity>
                                                            
                                                            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {alignItems:'center'}]} onPress={ () => {
                                                                this.deleteRow(data.id, secId, rowId, rowMap)
                                                            }}>
                                                                <Image style={{width:33, height:33}} source={Images.deleteItemIcon} />  
                                                            </TouchableOpacity>
                                                        </View>
                                                        <TouchableHighlight
                                                            onPress={ () =>{
                                                                this.applyFilter(data);
                                                            }}
                                                            style={styles.rowFront}
                                                            underlayColor={'#ddd'}
                                                            >
                                                            <View style={styles.filterNameText}>
                                                                <Text style={{fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{data.name}</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                    </SwipeRow>
                                                
                                                )}
                                            />
                                    }                  
                                </View>                               
                                    
                        }  
                        {/* Custome Filters Bottom Line  */}
                        {
                            GlobalVals.user.role == 'AGENT' &&
                                <View style={[styles.bottomLine, {marginLeft:0, width:'100%'}]} />                            
                        } 
                        {
                            (GlobalVals.user.role == 'AGENT' || (GlobalVals.user.role == 'CUSTOMER' && GlobalVals.permissions.chat)) &&
                                <View>
                                    <View style={styles.headerSection}>
                                        <Image style={{width:22.5, height:20}} source={Images.chatSectionIcon} />
                                        <Text style={{fontSize:15,color:'rgb(223, 61, 0)', paddingLeft:9.5, width:'85%'}}>{Locale.t('DASHBOARD.CHAT_HEADING')}</Text>                            
                                    </View> 
                                    {
                                        GlobalVals.user.role == 'AGENT' && GlobalVals.permissions.publicChat &&
                                            <View>
                                                <TouchableOpacity style={styles.item} onPress={() => {  
                                                    this.goToChatTab()                              
                                                    }}>
                                                    <Text style={styles.leftText}>{Locale.t('DASHBOARD.CHAT_VISITORS')}</Text>
                                                    <View style={[styles.badge, this.state.badges['online_visitors'] > 0 ? {} : styles.badgeEmpty]}>
                                                        <Text style={styles.badgeText}>{this.state.badges['online_visitors'] ? this.state.badges['online_visitors'] : '0'}</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <View style={styles.bottomLine} />
                                            </View>                                       
                                    }

                                    {
                                        GlobalVals.user.role == 'AGENT' &&
                                            <View>
                                                <TouchableOpacity style={styles.item} onPress={() => {   
                                                    this.goToChatTab()                             
                                                    }}>
                                                    <Text style={styles.leftText}>{Locale.t('DASHBOARD.CHAT_CUSTOMERS')}</Text>
                                                    <View style={[styles.badge, this.state.badges['online_customers'] > 0 ? {} : styles.badgeEmpty]}>
                                                        <Text style={styles.badgeText}>{this.state.badges['online_customers'] ? this.state.badges['online_customers'] : '0'}</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <View style={styles.bottomLine} />
                                            </View>                                        
                                    }

                                    <TouchableOpacity style={styles.item} onPress={() => {   
                                        this.goToChatTab()                             
                                        }}>
                                        <Text style={styles.leftText}>{Locale.t('DASHBOARD.CHAT_AGENTS')}</Text>
                                        <View style={[styles.badge, this.state.badges['online_agents'] > 0 ? {} : styles.badgeEmpty]}>
                                            <Text style={styles.badgeText}>{this.state.badges['online_agents'] ? this.state.badges['online_agents'] : 0}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>                            
                        }  
                        <View style={{paddingTop:10}} />
                    </View>
                </View>
            </ScrollView>
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
        marginLeft:6.5,
        marginRight:6.5,
        marginBottom:11,       
    },
    headerSection:{
        width:'100%',
        flexDirection:'row',
        paddingLeft:11.5,
        height:44,
        alignItems: 'center',
    },
    item:{
        flexDirection:'row',
        paddingLeft:11.5,
        height:44,
        alignItems: 'center',
    },
    leftText:{
        fontFamily:'Helvetica Neue',
        paddingLeft:6,
        fontSize:15, 
        color:'rgb(86, 85, 85)',
        width:"90%"
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
    bottomLine:{
        paddingTop:10, 
        marginLeft:'5%', 
        width:'90%', 
        borderBottomColor:'rgb(228, 228, 228)', 
        borderBottomWidth:1
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
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
        paddingLeft:11.5,       
        height: 44,
    },
    filterNameText:{
        width:158,
        height:24.5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffffff',
        borderColor:'rgb(177, 176, 176)',
        borderWidth:1,
        borderRadius:6
    }

})