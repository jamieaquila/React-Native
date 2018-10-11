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
    Alert,
    ActivityIndicator,
    Image
  } from 'react-native'
// import Image from 'react-native-image-progress'
import { Avatar } from 'react-native-elements';
import UserAvatar from 'react-native-user-avatar';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import InfiniteScroll from 'react-native-infinite-scroll';
import DialogBox from 'react-native-dialogbox'

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'
import { startMainTab } from '../../../app'


export default class CompanyDetailScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading:true,
            companyId: this.props.companyId,
            morePageToLoad: true,
            nextPage: 1,
            loadingComplete:true,
            customers:[],
            menuExpended: false
        }
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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

    goToEditComany(){        
        this.props.navigator.push({
            title: Locale.t('COMPANY_NEW.EDITTITLE'),
            screen: "deskero.AddEditCompanyScreen",    
            passProps:{
                companyId: this.state.companyId
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

    deleteCompany(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.removeCompany(bearer, clientId, this.state.companyId)
                    .end((err, res)=>{                        
                        if(err){
                            this.showDialogBox(Locale.t('LOGIN.CONNECTION_ERROR'))
                        }else{
                            if(res.body.id){
                                // setTimeout(()=>{                                                                         
                                    startMainTab(1)                                                                            
                                // }, 500)
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
        this.getCompanyData()
    }  

    getCompanyData(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) =>{
                Client.getCompany(bearer, clientId, this.state.companyId)
                    .end((err, res) => {                        
                        if(err){
                            this.setState({loading: false})
                        } else {
                            if(res.body){
                                let company = res.body;
                                this.setState({company:company}, () => {
                                    this.loadPage()
                                })
                            }else{
                                this.setState({loading: false})
                            }
                        }
                        
                    })
            })
        })
    }

    loadPage(){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.getByCompany(bearer, clientId, this.state.companyId, this.state.nextPage)
                    .end((err, res) => {
                        let loadingComplete = true
                        if(err){
                            this.setState({loading: false})
                        }else{
                            if(res.body){
                                let result = res.body;
                                // console.log(result)
                                let morePageToLoad = this.state.morePageToLoad
                                let nextPage = this.state.nextPage
                                let customers = []
                                if(result.customer.records.length < 10){
                                    morePageToLoad = false
                                }else{
                                    nextPage++
                                }

                                for(var i = 0 ; i < result.customer.records.length ; i++){
                                    customers.push(result.customer.records[i])
                                }

                                this.setState({
                                    customers,
                                    morePageToLoad,
                                    nextPage,
                                    loadingComplete,
                                    loading: false
                                })
                            }else{
                                let morePageToLoad = this.state.morePageToLoad
                                morePageToLoad = false;
                                this.setState({
                                    morePageToLoad, 
                                    loadingComplete,
                                    loading: false
                                })
                            }
                        }
                    })
            })
        })
    }

    setTextLength(text){
        return text // (text.length > 30 ? (text.substring(0, 30) + "...") : text);
    }

    getUserProfilePhoto(id){
        let url = GlobalVals.propertis.domain + 'profilePhoto/customer/' + id;
        return url;
    }

    showDeleteCustomerDialogBox(id){    
        Alert.alert(
          '',
          Locale.t('CUSTOMERS.DELETE_CONFIRM_TEXT'),
          [
            {text: Locale.t('CUSTOMERS.DELETE_CONFIRM_NO'), onPress: () => {
    
             }},
            {text: Locale.t('CUSTOMERS.DELETE_CONFIRM_YES'), onPress: () => {
                this.setState({loading: true}, () => {
                    this.deleteCustomer(id, secId, rowId, rowMap)
                })
            }},
          ],
          { cancelable: false }
        )
    }

    goToHistory(customer){
        this.props.navigator.push({
            title:customer.name,
            screen: "deskero.CustomerHistoryScreen",   
            passProps:{
                customerId:customer.id
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

    editCustomer(customer){
        this.props.navigator.push({
            title: Locale.t('CUSTOMER_EDIT.TITLE'),
            screen: "deskero.AddEditCustomerScreen",    
            passProps:{
                customerId: customer.id
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

    deleteCustomer(customerId){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.removeCustomer(bearer, clientId, customerId)
                    .end((err, res) => {
                        if(res.body.id){
                            this.setState({loading: false, loadingComplete: false}, () => {
                                this.loadPage()
                            })
                            
                        }else{
                            this.setState({loading: false, loadingComplete: false})
                        }
                    })
            })
        })
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
                        this.goToEditComany()
                    })
                    
                    }}>
                    <View style={{width:'20%', alignContent:'center', alignItems:'flex-start'}}>
                        <Icon style={{color:'rgb(86, 85, 85)'}} name="pencil" size={20}/>
                    </View>
                    <View style={{width:'80%', alignContent:'center', alignItems:'flex-start'}}>
                        <Text style={styles.labelText}>{Locale.t('COMPANY_DETAIL.EDIT')}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={() => {
                    this.setState({
                        menuExpended: false,
                        loading: true
                    }, () => {
                        this.deleteCompany()
                    })
                    
                    }}>
                    <View style={{width:'20%', alignContent:'center', alignItems:'flex-start'}}>
                        <Icon style={{color:'rgb(86, 85, 85)'}} name="trash" size={20}/>
                    </View>
                    <View style={{width:'80%', alignContent:'center', alignItems:'flex-start'}}>
                        <Text style={styles.labelText}>{Locale.t('COMPANY_DETAIL.DELETE')}</Text>
                    </View>
                </TouchableOpacity>

                
            </View>
        )
    }

    renderListRow(customer){
        return (
            <TouchableHighlight
                onPress={ () =>{
                    this.goToHistory(customer)
                }}
                style={styles.listItem}
                underlayColor={'#ddd'}
                >
                <View style={{flexDirection:'row'}}>
                    <View style={{margin:12, width:34, height:34}}>
                    {                                                
                        customer.profilePhotoUrl ?
                            <Avatar width={34} height={34} rounded={true} indicator={ProgressBar} source={{uri: this.getUserProfilePhoto(customer.id)}} avatarStyle={styles.listingPicture}/>
                        :
                            <UserAvatar name={this.getName(customer.name)} size="34" color={'gray'}/>
                        
                    }
                    {
                        customer.ticketCount && customer.ticketCount > 0 &&
                            <View style={[styles.badge]}>
                                <Text style={styles.badgeText}>{customer.ticketCount}</Text>
                            </View>                                                
                    }
                    </View>
                    <View style={{alignItems:'flex-start', padding:12}}>
                        <Text style={styles.nameText}>{this.setTextLength(customer.name)}</Text>
                        {
                            customer.email &&
                                <Text style={styles.emailText}>{this.setTextLength(customer.email)}</Text>
                        }
                        
                    </View> 
                </View>
            </TouchableHighlight>
        )
    }

    renderListHiddenRow(customer){
        return (
            <View style={styles.rowBack}>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {right: 0}]} onPress={() => {
                    this.showDeleteCustomerDialogBox(customer.id)
                    
                    }}>
                    <Image style={{width: 33.5, height: 33.5}} source={Images.deleteItemIcon} />
                    
                </TouchableOpacity>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {right: 44}]} onPress={() => {
                    this.editCustomer(customer)
                    }}>
                    <Image style={{width: 33.5, height: 33.5}} source={Images.editItemIcon} />
                </TouchableOpacity>                
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
                <InfiniteScroll                
                    horizontal={false}  //true - if you want in horizontal
                    onLoadMoreAsync={()=>{
                        if(this.state.morePageToLoad && this.state.loadingComplete){
                            this.setState({loadingComplete: false}, () => {
                                this.loadPage()
                            })
                        }
                            
                    }}
                    distanceFromEnd={100} // distance in density-independent pixels from the right end
                    >
                    {
                        this.state.company &&
                        <View style={styles.content}>
                            <View style={styles.textInputView}>
                                <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.NAME')}</Text>
                                <Text style={styles.textInput}>{this.state.company.company}</Text>                        
                            </View>
                            {
                                this.state.company.vatNumber &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.VAT')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.vatNumber}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.address &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.ADDRESS')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.address}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.city &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.CITY')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.city}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.province &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.PROVINCE')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.province}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.stateName &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.COUNTRY')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.stateName}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.postalNumber &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.POSTAL_NUMBER')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.postalNumber}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.phoneNumber &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.PHONE')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.phoneNumber}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.faxNumber &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.FAX')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.faxNumber}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.note &&
                                <View style={styles.textInputView}>
                                    <Text style={styles.label}>{Locale.t('COMPANY_DETAIL.NOTE')}</Text>
                                    <Text style={styles.textInput}>{this.state.company.note}</Text>                        
                                </View>
                            }
                            {
                                this.state.company.count > 0 &&
                                <View style={styles.row}>
                                    <View style={{flexDirection:'row', width:'100%'}}>
                                        <Text style={{color:'rgb(223, 61, 0)', fontFamily:'Helvetica Neue', fontSize:16}}>{Locale.t('COMPANY_DETAIL.CUSTOMERS').toUpperCase()}</Text>
                                        <View style={{marginLeft:7, width:18, height:18, backgroundColor:'rgb(193, 191, 191)', alignItems:'center', justifyContent:'center', borderRadius:9}} >
                                            <Text style={{fontFamily:'Helvetica Neue', fontSize:11, color:'#ffffff'}}>{this.state.company.count}</Text>
                                        </View>
                                    </View>
                                </View>
                            }                            
                            <SwipeListView
                                dataSource={this.ds.cloneWithRows(this.state.customers)}
                                enableEmptySections={true}
                                renderRow={ (customer, secId, rowId, rowMap) => {
                                    return this.renderListRow(customer)
                                }}
                                renderHiddenRow={ (customer, secId, rowId, rowMap) => {
                                    return this.renderListHiddenRow(customer)
                                }}
                                rightOpenValue={-88}
                            />   
                        </View>
                    }                    
                </InfiniteScroll>  
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
        justifyContent:'center',
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
    textInputView:{
        padding:12,
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1
    },
    label:{
        textAlign:'left',
        fontSize:10,
        color:'#777'
    },
    textInput:{
        textAlign:'left',
        fontSize:16,
        color:'#444'
    },       
    row:{
        width:'100%',
        paddingLeft:12,
        paddingRight:12,
        paddingTop:14,
        paddingBottom:14,
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1
    },
    badge: {
        position: 'absolute',
        top: 20,
        right: 0,      
        width:13,
        height:13,
        backgroundColor:"rgb(223, 61, 0)",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6.5,
        borderWidth: 1,
        borderColor: 'rgb(223, 61, 0)' 
    },
    badgeText:{
        fontFamily:'Helvetica Neue',
        color:'white',
        fontSize:8
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
    nameText: {
        fontFamily:'Helvetica Neue',  
        fontSize:15,
        color:"rgb(86, 85, 85)",
    },
    emailText: {
        fontFamily:'Helvetica Neue',  
        fontSize:10.9,
        color:"rgb(156, 155, 155)",
    },
    listingPicture:{
        backgroundColor: 'rgb(156, 155, 155)',        
        alignSelf: 'flex-start',        
    },
    listItem:{        
		backgroundColor: '#fff',		
        height: 58,
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1
    },
    rowFront: {               
		justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1
    }, 
    buttonContainer: {
        backgroundColor:'#ffffff',        
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