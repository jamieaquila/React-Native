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


export default class BankAccountScreen extends Component {
    constructor(props){
        super(props);
            
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
            
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
                        if(state){
                            this.goToLinkBankAccountScreen()
                        }else {
                            this.goToUnlinkBankScreen()
                        }
                    }
                }
            })
        })
    }

    goToLinkBankAccountScreen(){
        this.props.navigator.push({
            title: "Link Bank Account",         
            screen: "mechaniku.LinkBankAccountScreen",                  
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

    goToUnlinkBankScreen(){
        this.props.navigator.push({
            title: "",         
            screen: "mechaniku.UnlinkingBankScreen",                  
            navigatorStyle:{
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true
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
        return(            
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{paddingTop:130 * Metrics.scaleHeight, alignItems:'center', justifyContent:'center'}}>
                        <Image style={{width:165 * Metrics.scaleHeight, height:112 * Metrics.scaleHeight}} source={Images.visacardIcon} />
                    </View>
                    <Text style={{paddingTop: 73 * Metrics.scaleHeight, fontSize:19, color:'rgba(2, 6, 33, 0.9)', textAlign:'center'}}>Link Bank Account</Text>
                    <View style={{paddingTop:20 * Metrics.scaleHeight, height:64 * Metrics.scaleHeight, paddingHorizontal:12, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:14, color:'rgba(2, 6, 33, 0.4)', textAlign:'center'}}>
                            It won't be a bigger problem to find one video game lover in your neighbor. Since the introduction of Virtual Game.
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
                            <Text style={{fontSize:16, color:'#ffffff'}}>Link Account</Text>
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