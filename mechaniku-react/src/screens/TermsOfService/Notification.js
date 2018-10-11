import React, { Component } from 'react';
import { 
    StyleSheet, 
    Image, 
    View, 
    Text, 
    TouchableOpacity,
    Modal 
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'apsl-react-native-button'
import DialogBox from 'react-native-dialogbox'

import { Metrics, Images } from '../../themes'
import { Client, localStorage } from '../../services'


export default class NotificationScreen extends Component {
    constructor(props){
        super(props);
            
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
            
    }

    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    goToBankAccountScreen(){
        this.props.navigator.push({
            title:'',
            screen:"mechaniku.BankAccountScreen",                                          
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

    showDialogBox(msg){
        this.dialogbox.tip({
            title:'Whoops!',
            content: msg,
            btn :{
                text:'OK'
            }
        })
    }

    setNotification(state){
        localStorage.get('userInfo').then((userInfo) => {
            let info = JSON.parse(userInfo)
            let body = {
                accept_notification: state
            }

            Client.setNotification(body, info.authentication_token)
            .end((err, res) => {
                if(err){
                    this.showDialogBox('There\'s a connection problem!\nTry later.')
                }else{
                    if(res.body.status == 1){
                        this.goToBankAccountScreen()                           
                    }
                }
            })
        })
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{paddingTop:110 * Metrics.scaleHeight, alignItems:'center', justifyContent:'center'}}>
                        <Image style={{width:174 * Metrics.scaleHeight, height:169 * Metrics.scaleHeight}} source={Images.bellIcon} />
                    </View>
                    <Text style={{paddingTop: 38 * Metrics.scaleHeight, fontSize:19, color:'rgba(2, 6, 33, 0.9)', textAlign:'center'}}>Turn on Notification</Text>
                    <View style={{paddingTop:20 * Metrics.scaleHeight, height:64 * Metrics.scaleHeight, paddingHorizontal:12, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)', textAlign:'center'}}>
                            Do you want to download free song for ipod? If so, reading this article could save you from getting in to a lot of trouble!
                        </Text>
                    </View>
                    <View style={{flexDirection:'row', paddingTop:130 * Metrics.scaleHeight, paddingBottom:24 * Metrics.scaleHeight, marginHorizontal:12, width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <Button 
                            style={[styles.button, {borderColor:'rgba(87, 99, 112, 0.3)', borderWidth:2, borderRadius:5}]}
                            isDisabled={false}
                            onPress={() => {
                                this.setNotification(false)
                            }}
                            >
                            <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.4)'}}>Not Now</Text>
                        </Button>
                        <View style={{width:'5%'}}></View>
                        <Button 
                            style={[styles.button, {backgroundColor:'rgb(61, 59, 238)', borderRadius:5, borderWidth:0}]}
                            isDisabled={false}
                            onPress={() => {
                                this.setNotification(true)                                    
                            }}
                            >
                            <Text style={{fontSize:16, color:'#ffffff'}}>Turn On</Text>
                        </Button>
                    </View>
                </View>
                <DialogBox ref={dialogbox => {this.dialogbox = dialogbox}} />
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
        paddingHorizontal:38 * Metrics.scaleWidth
    },    
    button: {
        width:'45%',
        height:50 * Metrics.scaleHeight,        
    },
})