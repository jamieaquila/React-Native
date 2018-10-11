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

import { Images, Metrics } from '../../themes'
import { GlobalVals  } from '../../global'


export default class Companies extends Component {
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    } 

    renderListRow(company){
        return (
            <TouchableHighlight
                onPress={ () =>{
                    this.props.goToCompanyDetail(company)
                }}
                style={styles.rowFront}
                underlayColor={'#ddd'}
                >
                <View style={{margin:12}}>
                    <Text style={styles.nameText}>{company.company}</Text>
                    <View style={{flexDirection:'row', paddingTop:9}}>
                        <Text style={styles.emailText}>{company.details} {company.count > 0 && company.details !== '' ? ' - ' : ''}</Text>
                        <Ionicons style={styles.emailText} name='ios-man' size={10}/>
                        <Text style={[styles.emailText, {paddingLeft:9}]}>{company.count}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }   

    renderListHiddenRow(company){
        return (
            <View style={styles.rowBack}>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {right: 0}]} onPress={() => {
                    this.props.showDeleteCompanyDialogBox(company.id)
                    }}>
                    <Image style={{width: 33.5, height: 33.5}} source={Images.deleteItemIcon} />
                    
                </TouchableOpacity>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight, {right: 44}]} onPress={() => {
                    
                    this.props.editCompany(company)
                    }}>
                    <Image style={{width: 33.5, height: 33.5}} source={Images.editItemIcon} />
                </TouchableOpacity>                
            </View>
        )
    }

    render() {    	   
        return (             
            <SwipeListView
                dataSource={this.ds.cloneWithRows(this.props.searchCompanies)}
                enableEmptySections={true}
                renderRow={ (company, secId, rowId, rowMap) => {
                    return this.renderListRow(company)
                }}
                renderHiddenRow={ (company, secId, rowId, rowMap) => {
                    return this.renderListHiddenRow(company)
                }}
                rightOpenValue={-88}
            />
            
        );
    }

}

const styles = StyleSheet.create({ 
    rowFront:{        
		justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1
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
    }
})