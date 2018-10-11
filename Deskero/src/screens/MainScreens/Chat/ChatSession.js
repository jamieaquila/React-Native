'use strict'
import React, { Component} from 'react'

import {
    Text,
    View,
    ListView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    RefreshControl,
    TouchableHighlight,
    Modal,
    Platform,
    TextInput,
    Switch,
    Alert,
    Keyboard,
    ActivityIndicator,
    Image
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
// import Image from 'react-native-image-progress'
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import InfiniteScroll from 'react-native-infinite-scroll';
import TagInput from 'react-native-tag-input';
import { SearchBar } from 'react-native-elements'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Images, Metrics, Locale } from '../../../themes'


const MENU_LIST = [
    Locale.t('CHAT_SESSION.CONVERT_TO_TICKET'),
    Locale.t('CHAT_SESSION.CLOSE_SESSION')
]

export default class ChatSessionScreen extends Component {
   
    constructor(props){
        super(props)

        this.state = {
            chatUserId: this.props.chatUserId,
            loading: true,
            globalData: GlobalVals,
            message:'',
            btnLocation:0,
            isMounted: false,
            currentChatSessionId:'',
            otherUserId:'',
            menuExtend: false
            
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this)); 
    }

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            GlobalVals.currentPage = 'chat'
            this.props.navigator.pop()
        }
    }

    keyboardDidShow(e) {
        if(Platform.OS == 'ios')
            this.setState({btnLocation: e.endCoordinates.height - 50})
        else{
            this.props.navigator.toggleTabs({
                to: 'hidden',
                animated: false
            });
            // this.setState({btnLocation: e.endCoordinates.height - 50})
        } 
    }
    
    keyboardDidHide(e) {
        this.props.navigator.toggleTabs({
            to: 'shown',
            animated: false
        });
        this.setState({btnLocation: 0})
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
        this.setState({isMounted: false})
    }
     
    componentDidMount(){     
        this.typingSent = false
        this.setState({isMounted: true})
        Client.socketStatusCheck(this, 'session')   
        localStorage.get('clientId').then((clientId) => {
            localStorage.get('chatUserId').then((chatUserId) => {
                Client.sendInitChatConversation(clientId, chatUserId, this.state.chatUserId)
                setTimeout(() => {
                    this.setState({loading: false})
                }, 1500)
            })
        })
        
    }

    changeSocketStatus(currentChatSessionId, otherUserId){
        let globalData = GlobalVals   
        if(this.state.isMounted){
            if(globalData.currentChatSession && globalData.currentChatSession.closed){
                this.keyboardDidHide(null)
            }
            this.setState({
                globalData,
                currentChatSessionId,
                otherUserId
            })
        }
            
        
    }

    changeTime(time){
        let date = new Date(time)
        let h = date.getHours()
        let m = date.getMinutes()
        return h + ":" + m
    }

    closeSession(){
        Client.sendCloseChatConversation(this.state.globalData.currentChatSession.chatSessionId)
        GlobalVals.currentPage = 'chat'
        this.props.navigator.pop()
    }
    

    handleShowTyping(text){
        var toId = ''
        if(this.state.globalData.currentChatSession.showTo){
            toId = this.state.globalData.currentChatSession.chatSessionTo.chatUserId
        }else{
            toId = this.state.globalData.currentChatSession.chatSessionFrom.chatUserId
        }
        if(text != '' && !this.typingSent){    
            this.typingSent = true
            Client.sendChatTyping(this.state.globalData.currentChatSession.chatSessionId, toId)

            this._interval = setInterval(() => {
                this.typingSent = false
                clearInterval(this._interval);
                Client.sendCancelChatTyping(this.state.globalData.currentChatSession.chatSessionId, toId)
            }, 5000);                     
        }        
    }

    sendChatMessage(){        
        if(this.typingSent){
            // console.log("close")
            var toId = ''
            if(this.state.globalData.currentChatSession.showTo){
                toId = this.state.globalData.currentChatSession.chatSessionTo.chatUserId
            }else{
                toId = this.state.globalData.currentChatSession.chatSessionFrom.chatUserId
            }
            this.typingSent = false
            // alert('ok')
            Client.sendCancelChatTyping(this.state.globalData.currentChatSession.chatSessionId, toId)  
            if(this._interval) clearInterval(this._interval)          
        }

        if(this.state.message != ''){
            // console.log("sent")
            Client.sendChatMessage(this.state.message, this.state.currentChatSessionId, this.state.otherUserId, this.guid())
            this.setState({message: ''})
        }
    }

    guid(){
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4()
    }

    s4(){
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }

    renderChatBody(){
        let messageLines = this.state.globalData.currentChatSession.logLines.map((line, i) => {
            return (
                <View key={i} style={{width:'100%', backgroundColor:'#f7f7f7'}}>
                    {
                        i == 0 ?
                            <View style={{width:'100%', paddingTop:24, alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:12, color:'rgb(158, 157, 157)'}}>{line.formattedDate}</Text>
                            </View>
                        : this.state.globalData.currentChatSession.logLines[i - 1].formattedDate != line.formattedDate &&
                            <View style={{width:'100%', paddingTop:17.5, alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:12, color:'rgb(158, 157, 157)'}}>{line.formattedDate}</Text>
                            </View>
                    }
                    {
                        line.me ?
                            <View style={{width:'100%', flexDirection:'row', paddingTop:18}}>
                                <View style={{width:'16%'}} />
                                <View style={{width:'77%', backgroundColor:'rgb(97, 154, 40)', borderRadius:10}}>
                                    <View style={{paddingLeft:18.5, paddingTop:18, flexDirection:'row', width:'100%'}}>
                                        <View style={{width:'80%', alignItems:'flex-start'}}>
                                            <Text style={{fontFamily:'Helvetica Neue', fontWeight:'bold', fontSize:10, color:'rgba(255, 255, 255, 0.4)'}}>{line.user.name}</Text>
                                        </View>
                                        <View style={{width:'13%', alignItems:'flex-end'}}>
                                            <Text style={{fontFamily:'Helvetica Neue', fontWeight:'bold', fontSize:10, color:'rgba(255, 255, 255, 0.4)'}}>{this.changeTime(line.date)}</Text>
                                        </View>
                                        <View style={{width:'7%',paddingLeft:5, alignItems:'flex-start'}}>
                                            <Icon style={{color:'rgba(255, 255, 255, 0.4)'}} name="check" size={10} />
                                        </View>
                                    </View>
                                    <View style={{paddingHorizontal:18.5, paddingTop:7.5, paddingBottom:14.5, width:'100%'}}>
                                        <Text style={{fontFamily:'Helvetica Neue', fontSize:14, color:'rgb(255, 255, 255)'}}>{line.text}</Text>
                                    </View>
                                </View>
                                <View style={{width:'7%', alignItems:'flex-start', justifyContent:'center'}}>
                                    <Ionicons style={{color:'rgb(97, 154, 40)'}} name='md-arrow-dropright' size={20}/>
                                </View>
                            </View>
                        :
                            <View style={{width:'100%', flexDirection:'row', paddingTop:18}}>
                                <View style={{width:'7%', alignItems:'flex-end', justifyContent:'center'}} >
                                    <Ionicons style={{color:'rgb(255, 255, 255)'}} name='md-arrow-dropleft' size={20}/>
                                </View>
                                <View style={{width:'77%', backgroundColor:'rgb(255, 255, 255)', borderRadius:10}}>
                                    <View style={{paddingLeft:18.5, paddingTop:18, flexDirection:'row', width:'100%'}}>
                                        <View style={{width:'80%', alignItems:'flex-start'}}>
                                            <Text style={{fontFamily:'Helvetica Neue', fontWeight:'bold', fontSize:10, color:'rgb(223, 61, 0)'}}>{line.user.name}</Text>
                                        </View>
                                        <View style={{width:'13%', alignItems:'flex-end'}}>
                                            <Text style={{fontFamily:'Helvetica Neue', fontWeight:'bold', fontSize:10, color:'rgb(190, 190, 190)'}}>{this.changeTime(line.date)}</Text>
                                        </View>
                                        <View style={{width:'7%', paddingLeft:5, alignItems:'flex-start'}}>
                                            <Icon style={{color:'rgb(83, 153, 0)'}} name="check" size={10} />
                                        </View>
                                    </View>
                                    <View style={{paddingHorizontal:18.5, paddingTop:7.5, paddingBottom:14.5, width:'100%'}}>
                                        <Text style={{fontFamily:'Helvetica Neue', fontSize:14, color:'rgb(86, 85, 85)'}}>{line.text}</Text>
                                    </View>
                                </View>
                                <View style={{width:'16%'}} />
                            </View>
                    }
                </View>
            )
        })
        return messageLines
    }

    render() {        
        return (
            <View style={styles.container}>  
            {
                !this.state.loading ?
                <ScrollView 
                    ref={ref => this.scroll = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{
                        if(contentHeight > Metrics.screenHeight - 120)
                        this.scroll.scrollTo({y: contentHeight - (Metrics.screenHeight - 120), animated: true});
                    }}  >
                    {
                        this.state.globalData.currentChatSession &&
                        this.renderChatBody()
                    }
                    {
                        this.state.globalData.showTyping && this.state.globalData.currentChatSession.showFrom &&
                            <View style={{width:'100%', paddingTop:17.5, paddingLeft:'7%', alignItems:'flex-start'}}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:12, color:'rgb(158, 157, 157)'}}>{this.state.globalData.currentChatSession.chatSessionFrom.name} {Locale.t('CHAT_SESSION.IS_TYPING')}</Text>
                            </View>
                    }    
                    {
                        this.state.globalData.showTyping && this.state.globalData.currentChatSession.showTo &&
                            <View style={{width:'100%', paddingTop:17.5, paddingLeft:'7%', alignItems:'flex-start'}}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:12, color:'rgb(158, 157, 157)'}}>{this.state.globalData.currentChatSession.chatSessionTo.name} {Locale.t('CHAT_SESSION.IS_TYPING')}</Text>
                            </View>
                    }  
                    {
                        this.state.globalData.currentChatSession && this.state.globalData.currentChatSession.closed &&
                            <View style={{width:'100%', paddingTop:17.5, alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Helvetica Neue', fontSize:12, color:'rgb(158, 157, 157)'}}>{Locale.t('CHAT_SESSION.CLOSED')}</Text>
                            </View>
                    }   
                    {                    
                        <View style={{paddingTop:50 + this.state.btnLocation}} />                    
                    }   
                </ScrollView>  
                :
                <ActivityIndicator size="large" color="#ff0000" />
            }
                
            {
                this.state.menuExtend && 
                <TouchableOpacity style={[styles.bottom, {height:25, bottom: this.state.btnLocation + 42, zIndex:10, borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1, alignItems:'center', justifyContent:'center'}]} onPress={() => {
                    this.setState({menuExtend: false}, () => {
                        this.closeSession()
                    })
                }}> 
                    <View style={{}}>
                        <Ionicons style={{color:"#4d4d4d"}} name='ios-close-circle-outline' size={14}/>
                    </View>
                    <View style={{paddingLeft:'5%'}}>
                        <Text style={{fontFamily:'Helvetica Neue', fontSize:14, color:"#4d4d4d"}}>{Locale.t('CHAT_SESSION.CLOSE_SESSION')}</Text>
                    </View>
                </TouchableOpacity>    
            }
            {                    
                this.state.globalData.currentChatSession && !this.state.globalData.currentChatSession.closed &&
                    <View style={[styles.bottom, {bottom: this.state.btnLocation, zIndex:10}]}>                        
                        <TextInput 
                            style={[styles.input, this.state.globalData.user.role == 'AGENT' ? {width:'90%'} : {width:'100%'}]}
                            placeholder={'Your message'}
                            placeholderTextColor="rgb(158, 157, 157)"
                            keyboardType={'default'}
                            underlineColorAndroid="transparent"
                            returnKeyType={'send'}
                            onChangeText={(text) => {
                                this.setState({message: text}, () => {
                                    this.handleShowTyping(text)
                                })
                            }}
                            onSubmitEditing={(e) => {
                                this.sendChatMessage()
                            }}
                            value={this.state.message}
                        /> 
                        {
                            this.state.globalData.user.role == 'AGENT' &&     
                            <TouchableOpacity style={{flexDirection:'row', width:'10%', alignItems:'center', justifyContent:'center'}} onPress={() => {
                                this.setState({menuExtend: !this.state.menuExtend})
                            }}>
                                <Icon style={{color:'rgb(200, 198, 198)', marginLeft:'2.5%'}} name="circle" size={10} />
                                <Icon style={{color:'rgb(200, 198, 198)', marginLeft:'2.5%'}} name="circle" size={10} />
                                <Icon style={{color:'rgb(200, 198, 198)', marginLeft:'2.5%'}} name="circle" size={10} />
                            </TouchableOpacity>     
                        } 
                    </View>    
            }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,    
        backgroundColor: '#f5f5f5',
    },    
    bottom:{
        position:'absolute',
        flexDirection:'row', 
        paddingHorizontal: 12.5,
        alignItems:'center',
        width:'100%',
        height:42,
        backgroundColor:'#ffffff',
        bottom:0,  
    },
    input:{
        width:'90%',
        height:'100%',
        paddingLeft:15,        
        fontFamily:'Helvetica Neue',
        fontSize:11,
        color:'rgb(158, 157, 157)',
        borderRadius:6,
        backgroundColor:'rgb(234, 234, 234)',
    },
})