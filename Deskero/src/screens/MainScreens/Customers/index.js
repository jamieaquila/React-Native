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
import Ionicons from 'react-native-vector-icons/Ionicons'
import InfiniteScroll from 'react-native-infinite-scroll';
import { SearchBar } from 'react-native-elements'
import CardView from 'react-native-cardview'

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'

import { Customers, Companies } from '../../../components'

export default class CustomersScreen extends Component {
    static navigatorButtons = {        
        rightButtons: [            
            {
                id: 'addCustomer',
                icon: Images.addCustomerIcon          
            },
            {
                id: 'search',
                icon: Images.searchIcon
            },
        ]
    };
    constructor(props){
        super(props)
        this.state = {
            button_objs:[Locale.t('CUSTOMERS.AD'), Locale.t('CUSTOMERS.EL'), Locale.t('CUSTOMERS.MR'), Locale.t('CUSTOMERS.SZ'), Locale.t('CUSTOMERS.COMPANIES').toUpperCase()],
            customer:{},
            customers:[],
            searchCustomers:[],
            companies:[],
            searchCompanies:[],
            addNewCompany:false,
            morePageToLoad:true,
            nextPage:1,
            refreshing:false,
            selectedIdx: 0,
            loading:false,
            loadingComplete:true,
            searchStatus:false
        }
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'addCustomer') {
            this.goToAddEditCustomer('new', undefined)
        }else if(event.id == 'addCompany'){
            this.goToAddEditCompany('new', undefined)
        }else if(event.id == "search"){
            let searchStatus = this.state.searchStatus;
            this.setState({searchStatus:!searchStatus})
        }
    }

    componentDidMount(){       
        this.checkCustomerSearch()
    }  

    checkCustomerSearch(){
        let selectedIdx = 0
        if(!GlobalVals.customerSearch){
            GlobalVals.customerSearch = {
                query:null,
                message:null,
                inProgress:true,
                filter: 'a-d',                
            }
        }else{            
            if(GlobalVals.customerSearch.filter == 'a-d'){
                selectedIdx = 0;
            }else if(GlobalVals.customerSearch.filter == 'e-l'){
                selectedIdx = 1;
            }else if(GlobalVals.customerSearch.filter == 'm-r'){
                selectedIdx = 2;
            }else if(GlobalVals.customerSearch.filter == 's-z'){
                selectedIdx = 3;
            }else if(GlobalVals.customerSearch.filter == 'companies'){
                selectedIdx = 4;
                this.props.navigator.setTitle({title:Locale.t('CUSTOMERS.COMPANIES')})
                this.props.navigator.setButtons({
                    rightButtons:[
                        {
                            id: 'addCompany', 
                            icon: Images.addCompanyIcon
                        },
                        {
                            id: 'search', 
                            icon: Images.searchIcon
                        }                                        
                    ]
                });
            }
            GlobalVals.customerSearch.inProgress = true;
        }
        this.setState({
            loading:true,
            loadingComplete: false,
            selectedIdx
        }, () => {
            this.loadingPage()
        })
        
    }

    loadingPage(){
        GlobalVals.customerSearch.inProgress = true;
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                if(GlobalVals.customerSearch.filter == 'companies'){                    
                    Client.allCompanies(bearer, clientId, this.state.nextPage)
                        .end((err, res)=>{
                            let loadingComplete = true
                            if(err){
                                
                            }else{
                                let result = res.body
                                
                                GlobalVals.customerSearch.inProgress = false;
                                let morePageToLoad = this.state.morePageToLoad;
                                let nextPage = this.state.nextPage;

                                let companies = this.state.companies;
                                let searchCompanies = this.state.searchCompanies;
                                if(nextPage == 1) {
                                    companies = [];
                                    searchCompanies = [];
                                }

                                if(result.company.records.length < 10){
                                    morePageToLoad = false;
                                }else{
                                    nextPage++;
                                }
                                
                                for(var i = 0 ; i < result.company.records.length ; i++)
                                    companies.push(result.company.records[i])
                                
                                searchCompanies = companies;
                                    
                                this.setState({
                                    morePageToLoad,
                                    nextPage,
                                    companies,
                                    searchCompanies,
                                    refreshing: false,
                                    loading:false,
                                    loadingComplete
                                })
                            }
                        })
                    
                }else{
                    Client.allCustomers(bearer, clientId, this.state.nextPage, GlobalVals.customerSearch)
                        .end((err, res)=>{
                            let loadingComplete = true
                            if(err){

                            }else{
                                if(res.body){
                                    let result = res.body.customer.records
                                    
                                    let customers = this.state.customers;
                                    let searchCustomers = this.state.searchCustomers;
                                    

                                    let morePageToLoad = this.state.morePageToLoad;
                                    let nextPage = this.state.nextPage;
                                    
                                    if(nextPage == 1){
                                        customers = [];
                                        searchCustomers = [];
                                    }
                                        
                                    
                                    if(result.length < 10)    morePageToLoad = false;
                                    else   nextPage++;
    
                                    
                                    for(var i = 0 ; i < result.length ; i++)
                                        customers.push(result[i]);

                                    searchCustomers = customers
                                    // console.log(searchCustomers)
                                    this.setState({
                                        morePageToLoad,
                                        nextPage,
                                        customers,
                                        searchCustomers,
                                        refreshing:false,
                                        loading:false,
                                        loadingComplete
                                    })
                                }else{
                                    this.setState({
                                        morePageToLoad: false,
                                        loading:false,
                                        loadingComplete
                                    });
                                }
                            }
                            
                        })                        
                }
            })
        })
    }

    onRefresh() {        
        if(!this.state.loadingComplete)
            return
            
        let morePageToLoad = true;
        let nextPage = 1;
        let customers = [];
        let searchCustomers = [];
        let companies = [];
        let searchCompanies = [];
        let addNewCompany;
        if(GlobalVals.customerSearch.filter == 'companies'){
            addNewCompany = true;
        }else{
            addNewCompany = false;
        }
        this.setState({
            morePageToLoad,
            nextPage,
            customers,
            searchCustomers,
            companies,
            searchCompanies,
            addNewCompany,
            refreshing: true,
            loadingComplete: false
        }, () => {
            this.loadingPage()
        })
    }

    onSearchRefresh(){

        let morePageToLoad = true;
        let nextPage = 1;
        let customers = [];
        let searchCustomers = [];
        let companies = [];
        let searchCompanies = [];
        let addNewCompany;
        if(GlobalVals.customerSearch.filter == 'companies'){
            addNewCompany = true;
        }else{
            addNewCompany = false;
        }

        this.setState({
            morePageToLoad,
            nextPage,
            customers,
            searchCustomers,
            companies,
            searchCompanies,
            addNewCompany,
            // refreshing: true,
            loading:true,
            loadingComplete: false
        }, () => {
            this.loadingPage()
        })
    }  

    changeFilter(filter){
        GlobalVals.customerSearch.query = null;
        GlobalVals.customerSearch.message = null;
        GlobalVals.customerSearch.inProgress = true;
        GlobalVals.customerSearch.filter = filter;
        this.onSearchRefresh()
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
                    this.deleteCustomer(id)
                })
                
              
              }},
          ],
          { cancelable: false }
        )
    }

    showDeleteCompanyDialogBox(id){    
        Alert.alert(
          '',
          Locale.t('COMPANIES.DELETE_CONFIRM_TEXT'),
          [
            {text: Locale.t('CUSTOMERS.DELETE_CONFIRM_NO'), onPress: () => {
    
             }},
            {text: Locale.t('CUSTOMERS.DELETE_CONFIRM_YES'), onPress: () => {
                this.setState({loading: true}, () => {
                    this.deleteCompany(id)
                })
                
              
              }},
          ],
          { cancelable: false }
        )
    }
    
    editCustomer(customer){
        this.goToAddEditCustomer('edit', customer.id)
    }

    deleteCustomer(customerId){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.removeCustomer(bearer, clientId, customerId)
                    .end((err, res) => {
                        if(res.body.id){
                            this.setState({loading: false}, () => {
                                this.onRefresh()
                            })
                            
                        }else{
                            this.setState({loading: false})
                        }
                    })
            })
        })
    }

    editCompany(company){
        this.goToAddEditCompany('eidt', company.id);
    }

    deleteCompany(companyId){
        localStorage.get('bearer').then((bearer) => {
            localStorage.get('clientId').then((clientId) => {
                Client.removeCompany(bearer, clientId, companyId)
                    .end((err, res)=>{                        
                        if(res.body.id){
                            this.setState({loading: false}, () => {
                                this.onRefresh()
                            })
                        }else{
                            this.setState({loading: false})
                        }                        
                    })
            })
        })
    }

    goToAddEditCustomer(status, customerId){
        if(status == 'new'){
            this.props.navigator.push({
                title:Locale.t('CUSTOMER_NEW.TITLE'),
                screen: "deskero.AddEditCustomerScreen",                                           
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
        }else{
            this.props.navigator.push({
                title: Locale.t('CUSTOMER_EDIT.TITLE'),
                screen: "deskero.AddEditCustomerScreen",    
                passProps:{
                    customerId: customerId
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
        
    }

    goToAddEditCompany(status, companyId){
        if(status == 'new'){
            this.props.navigator.push({
                title:Locale.t('COMPANY_NEW.TITLE'),
                screen: "deskero.AddEditCompanyScreen",                            
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
        }else{
            this.props.navigator.push({
                title: Locale.t('COMPANY_NEW.EDITTITLE'),
                screen: "deskero.AddEditCompanyScreen",    
                passProps:{
                    companyId: companyId
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
                ],
                rightButtons: [
                    {
                        id: 'menu',
                        icon: Images.menuIcon
                    }
                ]
            },
        })
    }

    goToCompanyDetail(company){
        this.props.navigator.push({
            title:company.company,
            screen: "deskero.CompanyDetailScreen",   
            passProps:{
                companyId:company.id
            },             
            navigatorButtons: {
                leftButtons: [
                    {
                        id:'back',
                        icon: Images.backIcon
                    }
                ],
                rightButtons: [
                    {
                        id: 'menu',
                        icon: Images.menuIcon
                    }
                ]
            },
        })
    }

    renderSearchButtons(){
        let buttons = this.state.button_objs.map((text, i) => {
            return (
                <Button 
                    key={i}             
                    style={[styles.searchBtn, this.state.selectedIdx == i ? (i == 4 ? {width:'28%', backgroundColor:'rgb(223, 61, 0)', marginRight:0} : {backgroundColor:'rgb(223, 61, 0)'}) : (i == 4 ? {width:'28%', marginRight:0} : {})]} 
                    onPress={()=>{                    
                        this.setState({selectedIdx:i}, () => {
                            if(i == 4){
                                this.props.navigator.setTitle({title:Locale.t('CUSTOMERS.COMPANIES')})
                                this.props.navigator.setButtons({
                                    rightButtons:[
                                        {
                                            id: 'addCompany', 
                                            icon: Images.addCompanyIcon
                                        },
                                        {
                                            id: 'search', 
                                            icon: Images.searchIcon
                                        }                                        
                                    ]
                                });
                            }else{
                                this.props.navigator.setTitle({title:Locale.t('CUSTOMERS.TITLE')})
                                this.props.navigator.setButtons({
                                    rightButtons:[
                                        {
                                            id: 'addCustomer',
                                            icon: Images.addCustomerIcon          
                                        },
                                        {
                                            id: 'search',
                                            icon: Images.searchIcon
                                        },
                                    ]
                                });
                            }
                            
                            this.changeFilter(text.toLowerCase())
                        })
                    }}
                    >
                    <Text style={[styles.searchBtnText, this.state.selectedIdx == i ? {color:'#fff'} : {}]}>{text}</Text>
                    
                </Button>  
            )
        })
        return buttons;
    }

    render() {
        return (            
            <View style={styles.container}> 
                {
                    this.state.searchStatus == true &&
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
                            if(GlobalVals.customerSearch.filter == 'companies'){
                                let searchCompanies = this.state.companies.filter(x => x.company.toLowerCase().includes(text.toLowerCase()));
                                this.setState({searchCompanies})
                            }else{
                                let searchCustomers = this.state.customers.filter(x => x.name.toLowerCase().includes(text.toLowerCase()));
                                this.setState({searchCustomers})
                            }
                        }}
                        placeholder={Locale.t('CUSTOMERS.SEARCH_PLACEHOLDER')}                         
                        />
                }
                
                <View style={styles.searchButtonContent}>
                {
                    this.renderSearchButtons()
                }
                </View>  
                {
                    this.state.loading &&
                    <View style={{width:'100%', height:40, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator size="large" color="#ff0000" />
                    </View>
                }
                
                <InfiniteScroll
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.onRefresh()
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
                                this.loadingPage()
                            })
                        }
                            
                    }}
                    distanceFromEnd={400} // distance in density-independent pixels from the right end
                    >
                   
                    <View style={styles.content}>
                    {
                        this.state.searchCustomers.length == 0 && GlobalVals.customerSearch && GlobalVals.customerSearch.filter != 'companies' && !this.state.loading && !this.state.refreshing ?
                            <View style={{width:'100%', alignItems:'center', backgroundColor: '#f5f5f5'}}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{Locale.t('CUSTOMERS.NO_RESULTS')}</Text>
                            </View>
                        :                         
                            this.state.searchCustomers.length > 0 && GlobalVals.customerSearch && GlobalVals.customerSearch.filter != 'companies' &&
                            <Customers
                                searchCustomers={this.state.searchCustomers}
                                editCustomer={(customer) => {
                                    this.editCustomer(customer)
                                }}
                                showDeleteCustomerDialogBox={(id) => {
                                    this.showDeleteCustomerDialogBox(id)
                                }}
                                goToHistory={(customer) => {
                                    this.goToHistory(customer)
                                }}
                            />
                    }  
                    {
                        this.state.searchCompanies.length == 0 && GlobalVals.customerSearch && GlobalVals.customerSearch.filter == 'companies' && !this.state.loading && !this.state.refreshing ?
                            <View style={{width:'100%', alignItems:'center', backgroundColor: '#f5f5f5'}}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:15, color:'rgb(86, 85, 85)'}}>{Locale.t('CUSTOMERS.NO_RESULTS')}</Text>
                            </View>
                        : 
                            this.state.searchCompanies.length > 0 && GlobalVals.customerSearch && GlobalVals.customerSearch.filter == 'companies' &&
                            <Companies 
                                searchCompanies={this.state.searchCompanies}
                                editCompany={(company) => {
                                    this.editCompany(company)
                                }}
                                showDeleteCompanyDialogBox={(id) => {
                                    this.showDeleteCompanyDialogBox(id)
                                }}
                                goToCompanyDetail={(company) =>{
                                    this.goToCompanyDetail(company)
                                }}
                            /> 
                    }                
                    </View>      
                </InfiniteScroll>          
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
    searchButtonContent:{
        width:'94%',
        flexDirection:'row',
        marginTop:14.5,
        marginLeft:'3%',
        marginRight:'3%',
        marginBottom:8,  
    },
    searchBtn:{
        height:25,
        width:'16%',
        backgroundColor:'#fff',
        alignItems: 'center',
        justifyContent: 'center',  
        borderColor:'rgb(228, 228, 228)',
        borderWidth:1,
        marginRight:'2%'
    },
    searchBtnText:{
        fontFamily:'Helvetica Neue',
        color:'rgb(86,85, 85)',
        fontSize:13
    },
    content:{
        width:Metrics.screenWidth - 13,
        backgroundColor:'white',
        marginLeft:6.5,
        marginRight:6.5,
        marginBottom:11,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
            width: 1, height: 1,
        },        
        elevation: 2,        
        shadowOpacity: 1,
        shadowRadius: 4,  
        zIndex:10,  
    },
    listItem:{        
		backgroundColor: '#fff',		
        height: 58,
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1,
    },    
    listingPicture:{
        backgroundColor: 'rgb(156, 155, 155)',        
        alignSelf: 'flex-start',        
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
})