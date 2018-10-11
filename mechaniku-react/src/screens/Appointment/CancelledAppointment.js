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
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import { Metrics, Images } from '../../themes'
import { stateNames } from '../../services'

export default class CancelledAppointmentScreen extends Component{   
    constructor(props){
        super(props)
        this.state = {
            appointmentId: this.props.appointmentId,
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        
    }
    onNavigatorEvent(event){
        if(event.id === 'home'){
            Navigation.startSingleScreenApp({
                screen:{
                    title: '',
                    screen:'mechaniku.HomeScreen',
                    navigatorStyle: {
                        navBarHidden: true,
                        navBarBackgroundColor:'rgba(248,248,248,0.82)',
                        navBarNoBorder:true,
                        navBarTitleTextCentered:true 
                    },
                    navigatorButtons : {
                        rightButtons: [
                            {
                                id:'home',
                                title: 'Home'
                            }                            
                        ]
                    }
                }
            })  
        }
    }

    render() {
        return (
            <View style={styles.container}> 
                <View style={styles.content}>
                    <Text style={{fontSize:13, color:'rgba(2, 6, 33, 0.6)', textAlign:'center'}}>Your appointment has been cancelled.</Text>                    
                </View>
                <View style={{paddingTop:109 * Metrics.scaleHeight, justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width:175 * Metrics.scaleHeight, height:175 * Metrics.scaleHeight}} source={Images.calendarCrossIcon} />
                </View>
                <View style={{paddingTop:51 * Metrics.scaleHeight}} />
                <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.9)', textAlign:'center'}}>
                    Confirmation: #{this.state.appointmentId}
                </Text>
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
        marginTop:15 * Metrics.scaleHeight,
        marginHorizontal:34 * Metrics.scaleWidth,   
        height: 44 * Metrics.scaleHeight,        
        backgroundColor:'rgb(240, 241, 246)',
        justifyContent: 'center',
        alignItems: 'center'      
    },         
})