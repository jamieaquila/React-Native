import React, { Component } from 'react';
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
    Image
} from 'react-native'
// import Image from 'react-native-image-progress'
import { Avatar } from 'react-native-elements';
import UserAvatar from 'react-native-user-avatar';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import { Images, Metrics, Locale } from '../../themes'
import { GlobalVals  } from '../../global'

export default class Customers extends Component {
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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

    setTextLength(text, len){
        return (text.length > len ? (text.substring(0, len) + "...") : text);
    }

    renderListRow(customer){
        return (
            <View style={styles.rowFront}>
                <TouchableHighlight
                    onPress={ () =>{
                        this.props.goToHistory(customer)
                    }}
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
                                <View style={[styles.badge, customer.ticketCount > 99 && {width: 19.5}]}>
                                    <Text style={styles.badgeText}>{customer.ticketCount}</Text>
                                </View>                                                
                        }
                        </View>
                        <View style={{alignItems:'flex-start', padding:12}}>
                            <Text style={styles.nameText}>{this.setTextLength(customer.name, 30)}</Text>
                            {
                                customer.email &&
                                    <Text style={styles.emailText}>{this.setTextLength(customer.email, 30)}</Text>
                            }
                            
                        </View> 
                    </View>
                </TouchableHighlight>
            </View>
        )
    }   

    renderListHiddenRow(customer){
        return (
            <View style={styles.rowBack}>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {right: 0}]} onPress={() => {
                    this.props.showDeleteCustomerDialogBox(customer.id)
                    
                    }}>
                    <Image style={{width: 33.5, height: 33.5}} source={Images.deleteItemIcon} />
                    
                </TouchableOpacity>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {right: 44}]} onPress={() => {
                    this.props.editCustomer(customer)
                    }}>
                    <Image style={{width: 33.5, height: 33.5}} source={Images.editItemIcon} />
                </TouchableOpacity>                
            </View>
        )
    }

    render() {   
        return (      
            <SwipeListView
                dataSource={this.ds.cloneWithRows(this.props.searchCustomers)}
                enableEmptySections={true}
                renderRow={ (customer, secId, rowId, rowMap) => {
                    return this.renderListRow(customer)
                }}
                renderHiddenRow={ (customer, secId, rowId, rowMap) => {
                    return this.renderListHiddenRow(customer)
                }}
                rightOpenValue={-88}
            />            
                        
        );
    }
}

const styles = StyleSheet.create({    
    rowFront: {               
		justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomColor:'rgb(228, 228, 228)', 
        borderBottomWidth: 1
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
    buttonContainer: {
        backgroundColor:'#ffffff',    
        height:58    
    },
})
