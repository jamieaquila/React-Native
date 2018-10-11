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
    TextInput,
    Platform,
    TouchableHighlight,
    WebView,
    Image
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome'
import MyWebView from 'react-native-webview-autoheight';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import { Avatar } from 'react-native-elements';
import UserAvatar from 'react-native-user-avatar';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs'
import RNFetchBlob from 'react-native-fetch-blob'
import HTML from 'react-native-render-html';

import { Client, localStorage } from '../../../services'
import { GlobalVals  } from '../../../global'
import { Metrics, Images, Locale } from '../../../themes'
import { RichTextEditorModal } from '../../../components'

const options = [ Locale.t('PROFILE.CANCEL'), Locale.t('PROFILE.SELECT_CAMERA'), Locale.t('PROFILE.SELECT_LIBRARY') ]
const CANCEL_INDEX = 0
const customStyle = "<style>* {max-width: 100%;} body {font-family: Helvetica Neue;}}</style>";


export default class ProfileScreen extends Component {    

    constructor(props){
        super(props)

        this.state = {
            displayProfile:false,
            imageData:undefined,
            profile:{
                name: GlobalVals.user.name
            },
            customerProfile:{},  
            isLoading:false,
            richRextModalVisible: false,
            lastPress: 0,
            miniHeight: 150
        }
        
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'back') {
            this.props.navigator.pop()
        }
    }

    componentDidMount(){
        this.setProfile();
    }

    setProfile(){
        var d = new Date();
        var dtime = d.getTime();
        let profile = GlobalVals.userDetails;
        if(profile.signature == null) profile.signature = ""
        
        let imageData = this.state.imageData

        if(profile.profilePhotoURL){
            if(GlobalVals.user.role == 'CUSTOMER'){
                GlobalVals.user.profilePhoto = GlobalVals.propertis.domain + "profilePhoto/customer/" + GlobalVals.user.id + "?t=" + dtime;
            }else{
                GlobalVals.user.profilePhoto = GlobalVals.propertis.domain + "profilePhoto/agent/" + GlobalVals.user.id + '?t=' + dtime;
            }
            let imagePath = null
            const fs = RNFetchBlob.fs
            RNFetchBlob
                .config({ 
                    fileCache : true 
                })
                .fetch('GET', GlobalVals.user.profilePhoto)
                .then((resp) => {       
                    imagePath = resp.path()
                    return resp.readFile('base64')
                })
                .then((base64Data) => {
                    // here's base64 encoded image
                    profile.profilePhotoBase64 = base64Data
                    imageData = 'data:image/jpeg;base64,' + base64Data
                    this.setState({
                        profile,
                        imageData
                    })
                    // remove the file from storage
                    return fs.unlink(imagePath)
                }).catch((err)=>{
                    // console.log(err.message)
                })
        }else{
            this.setState({
                profile
            })
        }
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

    showActionSheet(){
        this.ActionSheet.show()  
    }

    openImagePicker(index){       
        let profile = this.state.profile 
        if(index == 1){
            var options = {
                storageOptions: {
                  skipBackup: true,
                  path:'images'
                },
                maxWidth: 300,
                maxHeight: 300
            }          
            ImagePicker.launchCamera(options, (response)  => {
                if(response.didCancel){
                }
                else if(response.error){
                }
                else {        
                    profile.profilePhotoBase64 = response.data
                    let imageData = 'data:image/jpeg;base64,' + response.data
                    this.setState({
                        profile,
                        imageData
                    }) 
                }
            });
        }else if(index == 2){
            var options = {
                storageOptions: {
                  skipBackup: true,
                  path:'images'
                },
                maxWidth: 300,
                maxHeight: 300,
            }
            ImagePicker.launchImageLibrary(options, (response)=>{
                if(response.didCancel){
                }
                else if(response.error){
                }
                else {                    
                    profile.profilePhotoBase64 = response.data
                    let imageData = 'data:image/jpeg;base64,' + response.data
                    this.setState({
                        profile,
                        imageData
                    }) 
                }
            });            
        }
    }   

    updateProfile(){        
        let profile = JSON.parse(JSON.stringify(this.state.profile))        

        GlobalVals.userDetails = profile

        if(profile.profilePhotoBase64 == "" || profile.profilePhotoBase64 == null){
            delete profile.profilePhotoBase64
        }
        delete profile.profilePhotoBlob
        delete profile.profilePhotoURL
        
        if(GlobalVals.user.role == 'CUSTOMER'){            
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.updateCustomer(bearer, clientId, profile)
                        .end((err, res) => {
                            if(err){       
                                // console.log(err.message)                    
                                this.setState({isLoading: false})
                            }else{
                                // console.log(res.body)
                                this.setState({isLoading: false})
                            }
                        })
                })
            })
            
        }else{            

            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    Client.updateAgent(bearer, clientId, profile)
                        .end((err, res) => {
                            if(err){
                                // console.log(err.message)
                                this.setState({isLoading: false})
                            }else{
                                // console.log(res.body)
                                this.setState({isLoading: false})
                            }
                        })
                })
            })
        }
    }    
    

    render() { 
        return (    
                 
            <View style={styles.container}>
                <KeyboardAwareScrollView  
                    contentContainerStyle={{flexGrow:1}} 
                    ref="scroll"
                    scrollEnabled={true}>   
                    <View style={styles.content}>
                        <View style ={{flexDirection:'row', alignItems: 'center', padding:12, width:'100%'}}>
                            <View style={{width:'25%'}}>
                                {
                                    this.state.imageData ?
                                        <Avatar width={58 * Metrics.scaleHeight} rounded indicator={ProgressBar} source = {{ uri:this.state.imageData }} />
                                    :
                                        <UserAvatar name={this.getName(this.state.profile.name)} size={58 * Metrics.scaleHeight} color={'gray'}/>
                                }
                                
                                <TouchableOpacity style={styles.avatarCircle} onPress={()=>{
                                    this.showActionSheet()
                                    
                                    }} >
                                    <Image style={{width:25.5 * Metrics.scaleHeight, height:25.5 * Metrics.scaleHeight}} source={Images.editItemIcon} />
                                </TouchableOpacity>
                            </View>
                            <TextInput 
                                style={{fontSize:20, color:'rgb(223, 61, 0)',fontFamily:'Helvetica Neue', textAlign:'left', width:'75%'}}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let profile = this.state.profile
                                    profile.name = text
                                    this.setState({profile})
                                }}
                                value={this.state.profile.name}
                                /> 
                        </View>

                        <View style={{marginLeft:12, marginRight:12, borderBottomColor:'rgb(228, 228, 228)', borderBottomWidth:1}}></View>

                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('PROFILE.EMAIL')}</Text>
                            <TextInput 
                                style={[styles.textInput, Platform.OS == 'ios' && {height: 40 * Metrics.scaleHeight}]}
                                underlineColorAndroid="transparent"
                                KeyboardType={'email-address'}
                                onChangeText={(text) => {
                                    let profile = this.state.profile
                                    profile.email = text
                                    this.setState({profile})
                                }}
                                value={this.state.profile.email}
                                /> 
                        </View> 

                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('PROFILE.PHONE')}</Text>
                            <TextInput 
                                style={[styles.textInput, Platform.OS == 'ios' && {height: 40 * Metrics.scaleHeight}]}
                                underlineColorAndroid="transparent"
                                keyboardType={"numeric"}
                                onChangeText={(text) => {
                                    let profile = this.state.profile
                                    profile.phoneNumber = text
                                    this.setState({profile})
                                }}
                                value={this.state.profile.phoneNumber}
                                /> 
                        </View> 

                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('PROFILE.MOBILE')}</Text>
                            <TextInput 
                                style={[styles.textInput, Platform.OS == 'ios' && {height: 40 * Metrics.scaleHeight}]}
                                underlineColorAndroid="transparent"
                                keyboardType={"numeric"}
                                onChangeText={(text) => {
                                    let profile = this.state.profile
                                    profile.mobileNumber = text
                                    this.setState({profile})
                                }}
                                value={this.state.profile.mobileNumber}
                                /> 
                        </View> 

                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('PROFILE.ADDRESS')}</Text>
                            <TextInput 
                                style={[styles.textInput, Platform.OS == 'ios' && {height: 40 * Metrics.scaleHeight}]}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let profile = this.state.profile
                                    profile.address = text
                                    this.setState({profile})
                                }}
                                value={this.state.profile.address}
                                /> 
                        </View> 

                        <View style={styles.textInputView}>
                            <Text style={styles.label}>{Locale.t('PROFILE.CITY')}</Text>
                            <TextInput 
                                style={[styles.textInput, Platform.OS == 'ios' && {height: 40 * Metrics.scaleHeight}]}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => {
                                    let profile = this.state.profile
                                    profile.city = text
                                    this.setState({profile})
                                }}
                                value={this.state.profile.city}
                                /> 
                        </View> 
                
                        <View style={{
                            marginLeft:12,
                            marginRight:12,
                            justifyContent:'center',
                            paddingBottom: 15 * Metrics.scaleHeight
                            }}>
                            <Text style={styles.label}>{Locale.t('PROFILE.SIGNATURE')}</Text>   
                        </View>
                        <View style={{paddingTop: 15 * Metrics.scaleHeight}} />
                        <View      
                            style={{
                                flex: 1,
                                backgroundColor:'#ffffff',
                                borderColor:'rgb(218, 217, 217)',                                
                                marginHorizontal:'5%',                                
                                borderWidth:1,
                            }}
                            > 
                            <View style={{width:'100%', alignItems:'flex-end'}}>
                                <TouchableOpacity style={{marginTop:6, marginRight:6}} onPress={() => {
                                    this.setState({richRextModalVisible: true})
                                }}>
                                    <Icon
                                        style={{color:'rgb(86, 85, 85)'}}
                                        name="pencil" size={20}
                                    />
                                </TouchableOpacity>
                            </View>
                            {
                                Platform.OS == 'ios' ?
                                <WebView 
                                    style={{                                    
                                        height: 150
                                    }}                           
                                    automaticallyAdjustContentInsets={true}
                                    source={{html: this.state.profile.signature + customStyle}}
                                />
                                :
                                <MyWebView
                                    width={'90%'}
                                    defaultHeight={150}
                                    autoHeight={this.state.profile.signature != '' ? true : false}
                                    source={{html: this.state.profile.signature + customStyle}}
                                />
                            }
                        </View>                             

                        <View style={{paddingTop:24.5 * Metrics.scaleHeight}}/>  

                        <Button 
                            style={styles.btnStyle}
                            textStyle={{color: 'white'}}
                            isLoading={this.state.isLoading}
                            activityIndicatorColor = 'white'
                            onPress={()=>{
                                this.setState({isLoading: true}, ()=>{
                                    this.updateProfile()
                                })
                            }}
                            >
                            <Text style={styles.loginBtnText}>{Locale.t('PROFILE.SAVE')}</Text>
                        </Button>                            
                    </View>  
                </KeyboardAwareScrollView>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={Locale.t('PROFILE.SELECT_PHOTO')}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={(idx) => {
                        this.openImagePicker(idx)
                    }}
                />
                {
                    this.state.richRextModalVisible &&
                    <RichTextEditorModal
                        title={'Edit your signature'}
                        text={this.state.profile.signature}
                        closeEditorModal={() => {this.setState({richRextModalVisible: false})}}
                        getText={(html) => {
                            let profile = this.state.profile
                            profile.signature = html
                            this.setState({
                                richRextModalVisible: false,
                                profile
                            })
                        }}
                    />
                }   
            </View>
            
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex:1,   
        backgroundColor: '#f5f5f5',
        paddingHorizontal:6.5
    },
    content:{
        flex: 1,
        width:"100%",
        backgroundColor:'white',
        marginTop:11,
        marginBottom:11,  
    },
    avatarCircle: {
        position: 'absolute',
        top: 35 * Metrics.scaleHeight,
        left: 35 * Metrics.scaleHeight,       
    },
    bottomLine:{
        flex:1, 
        marginLeft:12,
        marginRight:12, 
        borderBottomColor:'rgb(228, 228, 228)', 
        borderBottomWidth:1
    },
    textInputView:{
        marginLeft:12,
        marginRight:12,
        borderBottomColor:'rgb(228, 228, 228)',
        borderBottomWidth:1,
        height: 64.5 * Metrics.scaleHeight,
        justifyContent:'center'

    },
    label:{
        fontFamily:'Helvetica Neue',
        textAlign:'left',
        fontSize:10.9,
        color:'rgb(156, 155, 155)'
    },    
    textInput:{
        // paddingTop:7.5 * Metrics.scaleHeight,
        fontFamily:'Helvetica Neue',
        textAlign:'left',
        fontSize:15,
        color:'rgb(86, 85, 85)',
        
    },
    btnStyle:{
        marginHorizontal:38,
        height: 44 * Metrics.scaleHeight,
        backgroundColor:'rgb(112, 180, 44)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgb(75, 121, 28)',
        shadowOffset:{
           width: 0, height: 3
        },
        shadowRadius:3,
        shadowOpacity:1.0,
        borderRadius:0,
        borderWidth:0,
    },
    loginBtnText:{
        color:'white',
        fontSize:16,
    },
    richText: {
        paddingTop: 20,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',  
    },
    
})