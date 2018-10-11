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
    TextInput
} from 'react-native'
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'

import { Metrics, Images } from '../../themes'

import { NotificationModal, BankAccountModal } from '../../components'

export default class LinkingSuccessScreen extends Component{   
    constructor(props){
        super(props)
      

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        
    }
    
    onNavigatorEvent(event){
        if(event.id === 'back'){
            Navigation.startSingleScreenApp({
                screen:{
                  screen: 'mechaniku.LoginScreen',
                  title: '',
                  navigatorStyle: {
                    drawUnderNavBar: false,
                    navBarHidden: true,
                    navBarBackgroundColor:'rgba(248, 248, 248, 0.82)',
                    navBarTitleTextCentered:true 
                  }
                }
            })
        }
    }    

    goToAppointments(){        
        Navigation.startSingleScreenApp({
            screen:{
              title:'Appointments',            
              screen:"mechaniku.MechanicAppointmentScreen",   
              navigatorStyle: {
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true 
              },
              navigatorButtons : {
                rightButtons: [
                    {
                        id:'logout',
                        title: 'Logout'
                    }
                ]
              }
            }
        })                          
    }
   
    render() {
        return (
            <View style={styles.container}> 
                <View style={styles.content}>
                    <Text style={{fontSize:13, color:'rgba(2, 6, 33, 0.6)', textAlign:'center'}} >Bank Account Saved!</Text>                                        
                </View>                
                <View style={{paddingTop:92 * Metrics.scaleHeight, alignItems:'center', justifyContent:'center'}}>
                    <Image style={{width:192 * Metrics.scaleHeight, height:143 * Metrics.scaleHeight}} source={Images.bankCheckedIcon} />
                </View>
                <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.9)', textAlign:'center', paddingTop:52 * Metrics.scaleHeight}}>You may now begin receiving payouts.</Text>
                <View style={{paddingTop:150 * Metrics.scaleHeight, justifyContent:'center', alignItems:'center'}} >
                    <TouchableOpacity  onPress={() => {
                        this.goToAppointments()
                    }}>
                        <Text style={{fontSize:17, color:'rgb(61, 59, 238)'}}>Go to Appointments</Text>
                    </TouchableOpacity>    
                </View>
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
        marginTop: 75 * Metrics.scaleHeight,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'rgb(204, 241, 246)',
        marginHorizontal:34,
        height: 44 * Metrics.scaleHeight,
        borderRadius:4
    },    
    button: {
        marginHorizontal: 22,
        backgroundColor:'rgb(61, 59, 238)',
        height:50 * Metrics.scaleHeight,   
        borderWidth:0, 
        borderRadius:5     
    },
    txtInputView:{
        flexDirection:'row', 
        height:44.5 * Metrics.scaleHeight, 
        width:'100%',   
        borderBottomColor:'rgb(200, 199, 204)', 
        borderBottomWidth:0.5,
        alignItems:'center',
    },
    label:{
        width:'40%',
        fontSize:17,
        color:'rgb(114, 129, 145)'
    },
    input:{
        width:'52%',
        fontSize:17,
        color:'rgba(2, 6, 33, 0.9)',
    },
    validation:{
        width:'8%',
        justifyContent:'center',
        height:'99%',
    },        
   
})