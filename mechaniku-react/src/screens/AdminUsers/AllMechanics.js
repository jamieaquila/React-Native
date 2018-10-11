'use strict'

import React, { Component } from 'react'
import  { 
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    ListView,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { SearchBar } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay'

import { Metrics, Images } from '../../themes'
import { stateNames } from '../../services'
import localStorage from '../../services/localStorage';
import Client from '../../services/client';
import { locale } from 'moment';

export default class AllMechanicsScreen extends Component{   
    constructor(props){
        super(props)        
        this.state = {
            mechanics:[],
            searchMechanics:[],
            loading: true,
            searchText:''
        }
        this.ds = new ListView.DataSource({rowHasChanged: (rk, r2) => r1 !== r2})
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        this.getAllMechanics()
    }

    getAllMechanics(){
        localStorage.get('userInfo').then((userData) => {
            let data = JSON.parse(userData)
            Client.getAllMechanics(data.authentication_token)
                .end((err, res) => {
                    if(err){
                        this.setState({loading: false})
                    }else{
                        if(res.body.status == 1){
                            let mechanics = res.body.data
                            let searchMechanics = mechanics
                            if(this.state.searchText != '')
                                searchMechanics = mechanics.filter(x => (x.first_name + " " + x.last_name).toLowerCase().includes(this.state.searchText.toLowerCase()))
                            this.setState({
                                mechanics,
                                searchMechanics,
                                loading: false
                            })
                        }else{
                            this.setState({loading: false})
                        }

                    }
                })
        })
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    showDialogBox(btns, message, status, mechanic){    
        Alert.alert(
            '',
            message,
            [
            {text: btns[0], onPress: () => {      
                if(status == 'delete'){
                    this.setState({loading: true}, () => {
                        this.deleteMechanic(mechanic)
                    })
                }else if(status == 'suspend'){
                    this.setState({loading: true}, () => {
                        this.suspendMechanic(mechanic)
                    })
                    
                }else if(status == 'active'){
                    this.setState({loading: true}, () => {
                        this.activeMechanic(mechanic)
                    })
                    
                }       
                
            }},
            {text: btns[1], onPress: () => {

            }},
            
            ],
            { cancelable: false }
        )
    }

    searchMechanics(text){
        let searchMechanics = this.state.mechanics
        if(text != ''){
            searchMechanics = this.state.mechanics.filter(x => (x.first_name + " " + x.last_name).toLowerCase().includes(text.toLowerCase()))
        }       
        this.setState({
            searchMechanics,
            searchText: text
        })
    }

    editMechanic(mechanic){

    }

    deleteMechanic(mechanic){
        localStorage.get('userInfo').then((userData) => {
            let userInfo = JSON.parse(userData)
            let body = {
                id: mechanic.id,
                authentication_token: userInfo.authentication_token
            }
    
            Client.deleteMechanic(body)
                .end((err, res) => {
                    if(err){
                        this.setState({loading: false})
                        console.log(err)
                    }else{
                        if(res.body.status == 1){
                            console.log(res.body.data)
                            this.getAllMechanics()
                        }else{
                            this.setState({loading: false})
                            console.log(res.body.data)
                        }
                    }
                })
        })
        
    }

    suspendMechanic(mechanic){
        localStorage.get('userInfo').then((userData) => {
            let userInfo = JSON.parse(userData)
            let body = {
                id: mechanic.id,
                authentication_token:  userInfo.authentication_token
            }
        
            Client.suspendMechanic(body)
                .end((err, res) => {
                    if(err){
                        this.setState({loading: false})
                        console.log(err)
                    }else{
                        if(res.body.status == 1){
                            this.getAllMechanics()
                        }else{
                            this.setState({loading: false})
                            console.log(res.body)
                        }
                    }
                })
        })
    }

    activeMechanic(mechanic){
        localStorage.get('userInfo').then((userData) => {
            let userInfo = JSON.parse(userData)
            let body = {
                id: mechanic.id,
                authentication_token: userInfo.authentication_token
            }

            Client.activeMechanic(body)
                .end((err, res) => {
                    if(err){
                        this.setState({loading: false})
                        console.log(err)
                    }else{
                        if(res.body.status == 1){
                            this.getAllMechanics()
                        }else{
                            this.setState({loading: false})
                            console.log(res.body)
                        }
                    }
                })
        })
    }

    renderListRow(mechanic){
        return (
            <View style={{flexDirection:'row', width:'100%', borderBottomColor:'rgba(188, 187, 193, 0.5)', borderBottomWidth:0.5, paddingHorizontal:16, paddingVertical: 16, alignItems:'center'}}>
                <View style={{width:'60%', alignItems:'flex-start'}}>
                    <Text style={{fontSize:15, fontWeight:'bold', color:'rgba(2, 6, 33, 0.8)'}}>{mechanic.first_name + " " + mechanic.last_name}</Text>
                    <Text style={{fontSize:15, color:'rgba(2, 6, 33, 0.56)'}}>{mechanic.company}</Text>
                </View>
                <View style={{width:'40%', flexDirection:'row'}}>           
                    <TouchableOpacity style={{width:'50%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                        this.showDialogBox(["Yes, Delete", "No, Cancel"], "Are you sure you want to delete " + mechanic.first_name + " " + mechanic.last_name + "?", 'delete', mechanic)
                    }}>
                        <Image style={{width:16, height:16}} source={Images.deleteIcon} />
                        <Text style={{fontSize:12, color:'rgb(238, 99, 92)'}}>Delete</Text>
                    </TouchableOpacity>
                    {
                        mechanic.status == 0 ?
                            <TouchableOpacity style={{width:'50%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                                this.showDialogBox(["Yes, Active", "No, Cancel"], "Are you sure you want to active " + mechanic.first_name + " " + mechanic.last_name + "?", 'active', mechanic)
                            }}>                     
                                <Image style={{width:16, height:16}} source={Images.activateIcon} />
                                <Text style={{fontSize:12, color:'rgb(0, 218, 152)'}}>Activate</Text>    
                            </TouchableOpacity>
                        :
                            <TouchableOpacity style={{width:'50%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                                this.showDialogBox(["Yes, Suspend", "No, Cancel"], "Are you sure you want to suspend " + mechanic.first_name + " " + mechanic.last_name + "?", 'suspend', mechanic)
                                
                            }}>
                                <Image style={{width:16, height:16}} source={Images.banIcon} />
                                <Text style={{fontSize:12, color:'rgb(255, 184, 59)'}}>Suspend</Text>    
                            </TouchableOpacity>
                    }
                    
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}> 
                <SearchBar
                    round
                    lightTheme
                    containerStyle={{
                        width:'96%',
                        marginTop:14.5,
                        marginLeft:'2%',
                        marginRight:'2%',
                        backgroundColor:'transparent',
                        borderTopWidth:0,
                        borderBottomWidth:0
                    }}
                    inputStyle={{
                        backgroundColor:'#ffffff'
                    }}
                    onChangeText={(text) =>{
                        this.searchMechanics(text)
                    }}
                    placeholder='Search' />
                {
                    this.state.loading ?
                        <View style={styles.content}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    : this.state.searchMechanics.length > 0 ?
                        <ListView
                            dataSource={this.ds.cloneWithRows(this.state.searchMechanics)}
                            enableEmptySections={true}
                            renderRow={(mechanic, selId, rowId, rowMap) => {
                                return this.renderListRow(mechanic)
                            }}
                        />
                    :
                        <View style={styles.content}>
                            <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)'}}>No result data</Text>
                        </View>
                }           
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,   
        backgroundColor:'rgba(239, 241, 245, 0.74)'      
    },    
    content:{        
        alignItems:'center',
        justifyContent: 'center',
        paddingTop:14 * Metrics.scaleHeight,
        marginHorizontal:16 * Metrics.scaleWidth
    },        
})