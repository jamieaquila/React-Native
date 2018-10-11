import React, { Component } from 'react';
import { 
    StyleSheet, 
    Image, 
    View, 
    Text, 
    TouchableOpacity,
    Modal,
    Platform,
    TextInput,
    Keyboard
} from 'react-native'

import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ActionSheet from 'react-native-actionsheet'
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'apsl-react-native-button'
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs'
const FilePickerManager = require('NativeModules').FilePickerManager;
import DialogBox from 'react-native-dialogbox'
import moment from 'moment'
import { isIphoneX } from 'react-native-iphone-x-helper'

import metrics, { Images, Metrics, Locale } from '../../../themes';
import { Client, localStorage } from '../../../services'
import { GlobalVals } from '../../../global'
import { startMainTab } from '../../../app'

const options = Platform.OS === 'ios' ? 
    [ Locale.t('PROFILE.CANCEL'), Locale.t('PROFILE.SELECT_CAMERA'), Locale.t('PROFILE.SELECT_LIBRARY'), Locale.t('PROFILE.BROWSE') ] 
    : 
    [ Locale.t('PROFILE.CANCEL'), Locale.t('PROFILE.SELECT_CAMERA'), Locale.t('PROFILE.BROWSE') ]
const CANCEL_INDEX = 0

export default class TextEditorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachedDocuments: [],
            message: this.props.text,
            sign: this.props.sign,
            start: false
        }
       
    }

    componentDidMount(){   
        setTimeout(() => {
            this.setState({start: true})
        }, 700)
    }     

   

    getContentHtml(){
        this.props.getText(this.state.message)
    }

    showDialogBox(msg){
        this.dialogbox.tip({
          title:Locale.t('ALERT_TITLE.WHOOPS'),
          content: msg,
          btn: {
              text: Locale.t('TICKET_NEW.CONFIRM_OK')
          }
        })
    }

    showActionSheet(){
        this.ActionSheet.show()  
    }

    openPicker(index){ 
        if(index == 1){
            ImagePicker.openCamera({
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
                includeBase64: true,
              }).then(image => {
                const split = image.path.split('/');
                let name = "IMG_" + moment(new Date().toISOString()).valueOf() + "." + split.pop().split('.')[1];
                let afile = {}
                let attachedDocuments = [];
                afile.documentName = name;
                afile.documentType = image.mime;
                afile.documentBase64 = image.data;                
                attachedDocuments.push(afile)
                this.setState({
                    attachedDocuments
                })   
              })//.catch(e => alert(e));
        }else if(index == 2){
            if(Platform.OS === 'ios'){
                ImagePicker.openPicker({
                    compressImageMaxWidth: 500,
                    compressImageMaxHeight: 500,
                    multiple: true,
                    includeBase64: true,
                }).then(images => {                
                    let attachedDocuments = [];
                    for(var i = 0 ; i < images.length; i++){
                        let afile = {}
                        afile.documentName = images[i].filename;
                        afile.documentType = images[i].mime;
                        afile.documentBase64 = images[i].data;                
                        attachedDocuments.push(afile)
                    }                
                    this.setState({
                        attachedDocuments
                    })  
                })
            }else{
                FilePickerManager.showFilePicker(null, (response) => {                    
                    
                    // console.log('Response = ', response);               
                    if (response.didCancel) {
                    //   console.log('User cancelled file picker');
                    }
                    else if (response.error) {
                    //   console.log('FilePickerManager Error: ', response.error);
                    }
                    else {
                        RNFS.readFile(response.path, 'base64')
                            .then((success) => {
                                let afile = {}
                                let attachedDocuments = [];
                                afile.documentName = response.fileName;
                                afile.documentType = response.type;
                                afile.documentBase64 = success;                
                                attachedDocuments.push(afile)
                                this.setState({
                                    attachedDocuments
                                })   
                            })
                            .catch((err) => {
                                // console.log(err)
                        })
                    }
                });
            }            
        }else if(index == 3){
            DocumentPicker.show({
                filetype: [DocumentPickerUtil.allFiles()],
              },(error,res) => {
                
                const split = res.uri.split('/');
                let name = split.pop();
                if(name.includes("%20")){
                    name = name.replace("%20", " ")
                }
                const inbox = split.pop();
                const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
                RNFS.readFile(realPath, 'base64')
                    .then((success) => {
                        // console.log(success)
                        let afile = {}
                        let attachedDocuments = [];
                        afile.documentName = name;
                        afile.documentType = this.getFileType(name);
                        afile.documentBase64 = success;                
                        attachedDocuments.push(afile)
                        this.setState({
                            attachedDocuments
                        })   
                    })
                    .catch((err) => {
                        // console.log(err)
                    })
            });
           
        }
    }

    sendReply(){       
        if(this.state.message == ''){
            Keyboard.dismiss()
            this.showDialogBox('Please enter reply text.')

        }else{
            let reply = {}       
            let msg = JSON.parse(JSON.stringify(this.state.message)) 
            msg = msg.replace(/\n/g, '<br>')
            if(this.state.sign) reply.text = msg + "<br><br>" + this.state.sign
            else reply.text = msg        

            reply.attachedDocuments = this.state.attachedDocuments;

            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    localStorage.get('userId').then((userId) => {
                        Client.ticketSendReply(bearer, clientId, userId, reply, this.props.ticketId)
                            .end((err, res) => {
                                if(err){
                                    this.setState({isLoading:false}, () => {
                                        this.showDialogBox(err.message)                                    
                                    })
                                    
                                }else{
                                    if(res.body && res.body.id){
                                        this.setState({isLoading: false}, () => {
                                            if(GlobalVals.user.role == 'CUSTOMER'){
                                                startMainTab(1)
                                            }else{
                                                setTimeout(() => {
                                                    startMainTab(2)
                                                })
                                                
                                            }
                                        })
                                        
                                    }else{
                                        ths.setState({isLoading: false}, () => {
                                            this.showDialogBox("Server not responded positively. Please check the ticket details if the reply is send.")
                                        })
                                    }
                                }
                            })
                    })
                })
            })
        }
        
    }

    renderHeader(){
        return(            
            Platform.OS === 'ios' ?
            <View style={styles.header}> 
                <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>                    
                    <View style={{width:'20%', paddingTop: isIphoneX() ? 54 : 32, paddingLeft:15, alignItems:'flex-start'}} >
                        <TouchableOpacity onPress={() => {this.props.navigator.pop({animated: true, animationType: 'fade'})}}>
                            <Image style={{width:24, height:24}} source={Images.closeIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'60%', alignItems:'center', justifyContent:'center', paddingTop: isIphoneX() ? 44 : 22}}>                            
                        <Text style={{fontFamily:'Helvetica Neue', color:'#ffffff', fontSize:17, textAlign:'center', fontWeight:"600",}}>{this.props.title}</Text>                                                        
                    </View>
                    <View style={{width:'20%', paddingTop: isIphoneX() ? 54 : 32, alignItems:'flex-end', paddingRight:15}}>
                        <TouchableOpacity onPress={() => {
                                this.sendReply()                            
                            }}>
                            <Text style={{fontSize:17, fontFamily:'Helvetica Neue', color:'#ffffff', fontWeight:'bold'}}>{Locale.t('SEND')}</Text>                               
                        </TouchableOpacity>
                    </View>
                </View>                 
            </View>
            :
            <View style={[styles.header, {height:57}]}>                
                <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>                    
                    <View style={{width:'22.5%', paddingTop:16, paddingLeft:15, alignItems:'flex-start'}} >
                        <TouchableOpacity onPress={() => {this.props.navigator.pop({animated: true, animationType: 'fade'})}}>
                            <Image style={{width:24, height:24}} source={Images.closeIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'55%', alignItems:'flex-start', justifyContent:'center', paddingTop:16}}>     
                        <Text style={{fontFamily:'Helvetica Neue', color:'#ffffff', fontSize:17, textAlign:'center', fontWeight:"400",}}>{this.props.title}</Text>                                                            
                    </View>
                    <View style={{width:'22.5%', paddingTop:16, alignItems:'flex-end', paddingRight:15}}>
                        <TouchableOpacity onPress={() => {
                                this.sendReply() 
                            }}>
                            <Text style={{fontSize:17, fontFamily:'Helvetica Neue', color:'#ffffff', fontWeight:'bold'}}>{Locale.t('SEND')}</Text>                                
                        </TouchableOpacity>
                    </View>
                </View>                 
            </View>
        )
    }

    render() {
        return ( 
            <View style={styles.container}>  
                {
                    this.renderHeader()
                }
                <View style={styles.content}>      
                    <View style={{flex: 1, borderColor:'rgb(177, 176, 176)', borderWidth:1}}>   
                    {
                        !this.state.start ?
                        <TextInput
                            style={styles.textArea}
                            multiline={true}
                            value={this.state.message}
                            clearButtonMode="never"
                            autoFocus={true}
                            selection={{start: 0, end: 0}}
                            onChangeText={(text) => {
                                this.setState({ message: text })
                            }}
                            onSubmitEditing={() => {}}
                            underlineColorAndroid="transparent"
                        />   
                        :
                        <TextInput
                            style={styles.textArea}
                            multiline={true}
                            value={this.state.message}
                            clearButtonMode="never"
                            autoFocus={true}
                            onChangeText={(text) => {
                                this.setState({ message: text })
                            }}
                            onSubmitEditing={() => {}}
                            underlineColorAndroid="transparent"
                        />   
                    }
                                            
                    </View>
                    
                    {
                        this.state.attachedDocuments.length == 0 ?
                            <Button 
                                style={styles.attachBtnStyle}                                                        
                                onPress={()=>{
                                    this.showActionSheet()
                                }}
                                >
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                    <Text style={styles.attachBtnText}>{Locale.t('TICKET_DETAIL.UPLOADFILE')}</Text>
                                    <View style={{width:6}} />
                                    <Icon style={{color:'rgb(129, 129, 129)'}} name="paperclip" size={18}/>
                                </View> 
                            </Button> 
                        : 
                            <Button 
                                style={styles.attachBtnStyle}                                                        
                                onPress={()=>{
                                    this.setState({attachedDocuments:[]})                       
                                }}
                                >
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', width:'100%'}}>
                                    <Text style={styles.attachBtnText}>{this.state.attachedDocuments[0].documentName}</Text>
                                    <View style={{width:6}} />
                                    <Icon style={{color:'rgb(129, 129, 129)'}} name="minus-circle" size={18}/>
                                </View>
                            </Button> 
                    }
                </View> 
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={Locale.t('TICKET_NEW.SELECT_FILES')}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={(idx) => {
                        this.openPicker(idx)
                    }}
                /> 
                
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }}/>
                        
            </View>                
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    content: {
        flex: 1,
        width: Metrics.screenWidth - 13,
        backgroundColor:'white',
        margin: 6.5
    },
    richText: {
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginTop: 15,
        
    },   
    header:{
        backgroundColor:'#df3d00',
        width:'100%',
        height: isIphoneX() ? 88 : 64
    },
    attachBtnStyle: {
        marginTop:27,
        marginHorizontal:35.5,
        height: 43.5 * Metrics.scaleHeight,
        backgroundColor:'#ffffff',
        alignItems: 'center',
        justifyContent: 'center',    
        borderRadius:6,
        borderWidth:1,
        borderColor:'rgb(177, 176, 176)',
    },
    attachBtnText: {
        fontFamily:'Helvetica Neue',
        fontSize:16,
        color:'rgb(128, 128, 128)'
    },
    textArea: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        textAlignVertical: "top",
        // borderColor:'rgb(177, 176, 176)',
        // borderWidth:1,
        backgroundColor: "transparent",
        fontFamily: "Helvetica Neue",
        fontSize:17
    },
    
})