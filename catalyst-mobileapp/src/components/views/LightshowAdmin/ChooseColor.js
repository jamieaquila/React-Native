import React, { Component } from 'react';
import { 
    StyleSheet, 
    View, 
    ScrollView, 
    Image, 
    Text, 
    Animated, 
    Dimensions, 
    Platform,
    ListView, 
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    Picker
} from 'react-native';
import { connect } from 'react-redux';
import Button from 'apsl-react-native-button'
import { ColorPicker, TriangleColorPicker, toHsv, fromHsv } from 'react-native-color-picker'
import { NavigationBar } from '../../molecules';
import moment from 'moment';

import { 
    createLightshowColor, 
    createLightshowDetail, 
    updateLightshowDetail, 
    initialLightshowLocation 
} from '../../../actions/LightshowAction'
import ChooseOptions from './ChooseOptions'
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = 0.0421

class ChooseColor extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            selectBtnIdx:0,
            hexColor:fromHsv({ h: 200, s: 0.4, v:0.4 }),            
            duration: {
                h:'0',
                m:'00',
                s:'00',
                ms:'250'
            }
        }       
        this.onColorChange = this.onColorChange.bind(this)
    }

    componentDidMount() {  
        const { data, prevPage, dispatch } = this.props
        if(prevPage == 'lightshow'){           
            dispatch(createLightshowDetail(data))
        }else{
            dispatch(updateLightshowDetail(data))
        }
        this.backBtnPress = false;
    }

    componentWillReceiveProps(nextProps) {
        const { lightshow } = this.props
        
        if(nextProps.lightshow.lightshowColor != undefined && nextProps.lightshow.curPage == 'chooseColor' && !nextProps.lightshow.changeLightshowTitle){
            this.goToChooseOptionScreen()            
        }

        if(nextProps.lightshow.lightshowLocation == undefined && nextProps.lightshow.curPage == '' && this.backBtnPress){
            this.goToBackScreen()
        }else{
            this.backBtnPress = false
        }
    }

    setInitLightshowLocation(){
        var { dispatch } = this.props;
        dispatch(initialLightshowLocation())
    }

    goToBackScreen(){
        var { navigator } = this.props;        
        navigator.pop()
    }

    goToChooseOptionScreen(){
        var { navigator, dispatch } = this.props;
        navigator.push({
            component: ChooseOptions                    
        })
    }

    onColorChange(color) {
        this.setState({hexColor: fromHsv(color) })
    }

    saveDuration(){
        var { lightshow, navigator, auth, dispatch, data } = this.props;
        if(this.state.duration.h == '0' && this.state.duration.m == '00' && this.state.duration.s == '00' && this.state.duration.ms == '000'){
            Alert.alert(
                "Uh Oh", 
                "Please select time.",
                [
                  {text: 'OK', onPress: () => {
                  }},
                ]
              )
        }else{
            if(this.state.hexColor.length != 7 && !this.state.hexColor.includes("#")){
                Alert.alert(
                    "Uh Oh", 
                    "Please enter correct HEX string.",
                    [
                      {text: 'OK', onPress: () => {
                      }},
                    ]
                  )
            }else{
                
                let duration = ''
                if(this.state.duration.h == '0') duration = '00'
                else duration = parseInt(this.state.duration.h) > 9 ? this.state.duration.h : ('0' + parseInt(this.state.duration.h))

                duration += ":" + this.state.duration.m
                duration += ":" + this.state.duration.s
                duration += ":" + this.state.duration.ms

                let body = {
                    lightshowdetails:lightshow.lightshowDetail.id,
                    color: this.state.selectBtnIdx == 1 ? 'Random' : this.state.hexColor,
                    colorType: 'HEX',
                    duration: duration
                }
                dispatch(createLightshowColor(body))               
            }
        }
    }

    renderTimeItems(){
        let pickerItems = []
        for(var i = 0 ; i < 24 ; i++){
            let val = i.toString()
            pickerItems.push(
                <Picker.Item key={i} label={val} value={val} />
            )
        } 
        return pickerItems
    }

    renderMinItems(){
        let pickerItems = []
        for(var i = 0 ; i < 60 ; i++){
            let val = ""
            if(i < 10) val = "0" + i.toString()
            else val = i.toString()

            pickerItems.push(
                <Picker.Item key={i} label={val} value={val} />
            )
        }
        return pickerItems
    }

    renderSecItems() {
        let pickerItems = []
        for(var i = 0 ; i < 60 ; i++){
            let val = ""
            if(i < 10) val = "0" + i.toString()
            else val = i.toString()

            pickerItems.push(
                <Picker.Item key={i} label={val} value={val} />
            )
        }
        return pickerItems
    }

    renderMilliSecItems(){
        let pickerItems = []
        for(var i = 0 ; i < 1000 ; i = i + 50){
            let val = ""
            if(i == 0) val = "000"
            else if(i < 100) val = "0" + i.toString()            
            else val = i.toString()

            pickerItems.push(
                <Picker.Item key={i} label={val} value={val} />
            )
        }
        return pickerItems
    }

    render() {
        var { lightshow, navigator, auth, dispatch } = this.props;

        return (
          <View style={styles.wrapper}>
            <NavigationBar
                navigator={navigator}
                title="" 
                onBackPress={() => {
                    this.backBtnPress = true
                    this.setInitLightshowLocation()
                }}                                   
            />          
            <ScrollView style={{flex: 1}}>
                <View style={{paddingTop:14}} />
                <TouchableOpacity
                    onPress={ () =>{
                        this.setState({selectBtnIdx: 1})
                    }}
                    style={[styles.button, this.state.selectBtnIdx == 1 && {backgroundColor:'#0079fe'}]}
                    >
                    <Text style={{fontSize:16, color:'#ffffff'}}>Random Colors</Text>
                </TouchableOpacity>

                <View style={{paddingTop:14}} />
                <TouchableOpacity
                    onPress={ () =>{
                        this.setState({selectBtnIdx: 2})
                    }}
                    style={[styles.button, this.state.selectBtnIdx == 2 && {backgroundColor:'#0079fe'}]}
                    >
                    <Text style={{fontSize:16, color:'#ffffff'}}>Choose Colors</Text>
                </TouchableOpacity>

            
                <View style={{paddingTop:20}} />
                <View style={{justifyContent:'center', alignItems:'center', width:'100%'}}>                    
                {
                    this.state.selectBtnIdx == 2 &&
                    <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}> 
                        <View style={{justifyContent:'center', alignItems:'center'}}>                           
                            <TextInput 
                                style={{color:'white', width:80, fontSize:14, textAlign:'center', backgroundColor:'#484f66',height:35, borderRadius:6}}
                                underlineColorAndroid={'transparent'} 
                                onChangeText={(text) => {                                    
                                    this.setState({hexColor: text})
                                }}
                                value={this.state.hexColor}
                                />
                        </View>
                    </View>                       
                }
                </View>
                {
                    this.state.selectBtnIdx == 2 && 
                    <View style={{flex:1, paddingTop:15, paddingBottom:15, justifyContent:'center', alignItems:'center'}}>
                        <ColorPicker
                            oldColor='purple'
                            color={this.state.hexColor}
                            onColorChange={this.onColorChange}
                            onColorSelected={(color) =>{ this.setState({hexColor: color})}}
                            onOldColorSelected={(color) =>{ this.setState({hexColor: color})}}
                            style={{width:250, height:250}}
                        />                            
                    </View>
                }
                {
                    this.state.selectBtnIdx != 0 &&
                    <View style={{width:'100%'}}>
                        <View style={{backgroundColor:'#181818', padding:15, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'#fff', fontSize:15}}>Timer</Text>
                        </View>
                        <View style={{backgroundColor:'#0c0c0c', width:'100%', flexDirection:'row'}}>
                            <View style={[{backgroundColor:'transparent', width:'21.25%'}, Platform.OS == 'android' && {paddingLeft:'5%'}]}>
                                <View style={{alignItems:'center', paddingTop:10}}>
                                    <Text style={{color:'#fff', fontSize:15}}>Hours</Text>
                                </View>
                                <Picker
                                    selectedValue={this.state.duration.h}                                    
                                    onValueChange={(value, index) => {
                                        let duration = this.state.duration
                                        duration.h = value
                                        this.setState({duration})
                                    }}
                                    itemStyle={{color:'#fff'}}
                                    >
                                    {
                                        this.renderTimeItems()
                                    }
                                </Picker>
                            </View>
                            <View style={{width:'5%'}} />
                            <View style={{backgroundColor:'transparent', width:'21.25%'}}>
                                <View style={{alignItems:'center', paddingTop:10}}>
                                    <Text style={{color:'#fff', fontSize:15}}>Min</Text>
                                </View>
                                <Picker
                                    selectedValue={this.state.duration.m}                                    
                                    onValueChange={(value, index) => {
                                        let duration = this.state.duration
                                        duration.m = value
                                        this.setState({duration})
                                    }}
                                    itemStyle={{color:'#fff'}}
                                    >
                                    {
                                        this.renderMinItems()
                                    }
                                </Picker>
                            </View>
                            <View style={{width:'5%'}} />
                            <View style={{backgroundColor:'transparent', width:'21.25%'}}>
                                <View style={{alignItems:'center', paddingTop:10}}>
                                    <Text style={{color:'#fff', fontSize:15}}>Sec</Text>
                                </View>
                                <Picker
                                    selectedValue={this.state.duration.s}                                    
                                    onValueChange={(value, index) => {
                                        let duration = this.state.duration
                                        duration.s = value
                                        this.setState({duration})
                                    }}
                                    itemStyle={{color:'#fff'}}
                                    mode={'dialog'}
                                    >
                                    {
                                        this.renderSecItems()
                                    }
                                </Picker>
                            </View>
                            <View style={{width:'5%'}} />
                            <View style={{backgroundColor:'transparent', width:'21.25%'}}>
                                <View style={{alignItems:'center', paddingTop:10}}>
                                    <Text style={{color:'#fff', fontSize:15}}>MilliSec</Text>
                                </View>
                                <Picker
                                    selectedValue={this.state.duration.ms}                                    
                                    onValueChange={(value, index) => {
                                        let duration = this.state.duration
                                        duration.ms = value
                                        this.setState({duration})
                                    }}
                                    itemStyle={{color:'#fff'}}
                                    mode={'dialog'}
                                    >
                                    {
                                        this.renderMilliSecItems()
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={{paddingTop:20, paddingBottom:20}} >
                            <TouchableHighlight
                                onPress={ () =>{
                                    this.saveDuration()
                                }}
                                style={[styles.button]}
                                underlayColor={'#007aff'}
                                >
                                <Text style={{fontSize:16, color:'#ffffff'}}>Set Duration</Text>
                            </TouchableHighlight> 
                        </View>
                    </View>
                }
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor:'transparent',
    }, 
    button: {
        width:'70%',
        marginHorizontal:'15%',
        height:50,
        backgroundColor:'#b8b8b8',
        borderRadius:10,  
        justifyContent:'center',
        alignItems:'center'      
    },
    emptyView: {
        width:'100%', 
        height: deviceHeight / 2, 
        justifyContent:'center', 
        alignItems:'center'
    },
    emptyTxt: {
        color:'#fff',
        fontSize: 14
    }
});

const mapStateToProps = (state) => ({ lightshow: state.lightshows, auth: state.auth });

export default connect(mapStateToProps)(ChooseColor);
