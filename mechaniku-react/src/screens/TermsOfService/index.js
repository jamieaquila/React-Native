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

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import ModalDropdown from 'react-native-modal-dropdown'
import DialogBox from 'react-native-dialogbox'

import { Metrics, Images } from '../../themes'
import { NotificationModal, BankAccountModal } from '../../components'
import { Client, localStorage } from '../../services'

export default class TermsOfServiceScreen extends Component{   
    constructor(props){
        super(props)
        this.state = {
            
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        
    }
    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    showDialogBox(msg){
        this.dialogbox.tip({
            title:'Whoops!',
            content: msg,
            btn :{
                text:'OK'
            }
        })
    }

    goToNotificationScreen(){
        this.props.navigator.push({
            title:'',
            screen:"mechaniku.NotificationScreen",                                          
            navigatorStyle:{
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true
            },
            navigatorButtons: {
                leftButtons: [
                    {
                        id:'back',
                        icon: Images.backBtnIcon
                    }
                    
                ]
            }           
        }) 
    }

    goToTermsOfServiceAlertScreen(){
        this.props.navigator.push({
            title:'',
            screen:"mechaniku.TermsOfServiceAlertScreen",                                          
            navigatorStyle:{
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true
            },
            navigatorButtons: {
                leftButtons: [
                    {
                        id:'back',
                        icon: Images.backBtnIcon
                    }
                    
                ]
            }
        }) 
    }
   
    render() {
        return (
            <View style={styles.container}> 
                <View style={[styles.content, {}]}>
                    {/* <View style={{marginTop:15 * Metrics.scaleHeight, alignItems:'flex-start', justifyContent:'flex-start', width:'100%'}}>
                        <Text style={{fontSize:36, color:'rgba(2, 6, 33, 0.6)', fontWeight:'bold'}}>Terms of Service</Text>
                    </View> */}

                    <View style={{paddingTop:35 * Metrics.scaleHeight}} />

                    <ScrollView style={{height: 411 * Metrics.scaleHeight}} ref="scroll">
                        <Text style={{fontSize:15, color:'rgba(2, 6, 33, 0.8)'}}>
                            They are big, bold and beautiful. 
                            Billboards have been around for quite a while. 
                            In almost all places nowadays you can find billboards of just about every product there is in the market. 
                            No matter how you see it, billboard advertising is on the rise. 
                            Compared to other forms of advertising, billboards are a more affordable way of getting your message across to the public. 
                            If newspaper advertising lasts only for a day and a television advertisement last for only about forty seconds, billboard adverting last 24/7. 
                            Billboards can connect easily with potential markets because more people are mobile nowadays – referring to the increasing number of commuters and more time spent outside of the house.
                            Advances in technology have also made billboards more cost effective.
                            Advances in digital printing have also allowed billboards to be printed cheaply and quickly on canvas. Lately, billboards have been getting pocket-friendly as well.
                            But before you get your creative juices flowing and before you plunge into the exciting world of billboard advertising there things you need to understand. 
                            First, don’t expect the billboard to contain a lot of information. 
                            This is not just possible. The number one rule in billboard advertising is simplicity. 
                            This rule simply means that you need to use only a few words to get your message across. 
                            But this doesn’t mean that you can no longer make complex, intelligent and intriguing statements. 
                            You still can but in the simplest way you can. Say three balls are thrown to you at the same time. 
                            Chances are you will not catch all these balls let alone catch one. 
                            Throwing three balls at the same time is like throwing several ideas and message to your audience at the same time. 
                            If you throw one idea at a time chances are most of your readers will grasp it and walk away with the message. 
                            But if you throw two ideas at the same time only few will be able to get your message. 
                            So pay attention to the golden rule and keep your billboard simple. 
                            The price for disregarding the rule is wastage of thousands of dollars but the reward can lead to huge fame and fortune.  
                            In billboard advertising it is also important to know your market. 
                            It pays to be aware of what your customers need and where most of your customers are to be able to strategically and effectively place your billboard. 
                            If billboards are put up in the wrong place and at the wrong crowd you might as well forget your chance of getting a lot of customers. 
                            Money is indeed being made in billboard advertising, lots of it in fact, although trying to keep track of just how much the outdoor-advertising industry is collecting in can be tricky, since there is no system for measuring the budgets and revenues of those connected with it. 
                            But the opportunity is there. 
                            Businesses just have to make an effort and take advantage of it.
                        </Text>
                    </ScrollView>
                    
                    <View style={{flexDirection:'row', paddingTop:78 * Metrics.scaleHeight, paddingBottom:24 * Metrics.scaleHeight, marginHorizontal:12, width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <Button 
                            style={[styles.button, {borderColor:'rgba(87, 99, 112, 0.3)', borderWidth:2, borderRadius:5}]}
                            isDisabled={false}
                            onPress={() => {
                                this.goToTermsOfServiceAlertScreen()
                            }}
                            >
                            <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.4)'}}>Cancel</Text>
                        </Button>
                        <View style={{width:'5%'}}></View>
                        <Button 
                            style={[styles.button, {backgroundColor:'rgb(61, 59, 238)', borderRadius:5, borderWidth:0}]}
                            isDisabled={false}
                            onPress={() => {
                                this.goToNotificationScreen()
                            }}
                            >
                            <Text style={{fontSize:16, color:'#ffffff'}}>Accept</Text>
                        </Button>
                    </View>
                </View>                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,         
    },    
    content:{        
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'rgba(239, 241, 245, 0.74)',
        paddingHorizontal:26 * Metrics.scaleWidth
    },    
    button: {
        width:'45%',
        height:50 * Metrics.scaleHeight,        
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
    filterButtonContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width:'40%',
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
        fontSize:17,
        color:'rgb(2, 6, 33)',
    },
    buttonText: {
        fontSize:17,
        color:'rgb(2, 6, 33)',
    },
   
})