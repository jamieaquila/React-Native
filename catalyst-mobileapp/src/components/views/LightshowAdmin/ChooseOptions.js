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
    Easing,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import { ColorPicker, TriangleColorPicker, toHsv, fromHsv } from 'react-native-color-picker'
import { NavigationBar } from '../../molecules';
import moment from 'moment';
import SortableList from 'react-native-sortable-list';

import EditColor from './EditColor'
import WatchLightshow from './WatchLightshow'

import { 
    getLightshowColorsList,
    deleteLightshowColor,
    updateLightshowColors,
    initialLightshowColor,
    beginLightshow,
    changeColorsOrder,
    saveForLater,
    updateLightshowTitle 
} from '../../../actions/LightshowAction'

import { startLightshow, setCurrentPage } from '../../../actions/MessageActions'


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = 0.0421

class ChooseOptions extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            editStatus: false,
            title:'',
            selColerIdx: 0,
            totalTime: '0:00:00:000'
        }
        this.orderKeys = []
        this.ds = new ListView.DataSource({rowHasChanged: (rk, r2) => r1 !== r2})
    }

    componentDidMount() {  
        const { dispatch, lightshow } = this.props
        this.changeTitle = false
        this.btnIdx = -1
        this.setState({title: lightshow.lightshowDetail.lightshowName})
        dispatch(getLightshowColorsList(lightshow.lightshowDetail.id))
    }


    componentWillReceiveProps(nextProps) {       
       
        if(nextProps.lightshow.lightshowColors.length > 0){
            this.getTotalDuration(nextProps.lightshow.lightshowColors)
        }

        if( nextProps.soketMessage.startedLightshow && nextProps.soketMessage.curPage == 'choose' ){
            this.goToBeginLightshow(nextProps.soketMessage.startedLightshow)
        }
        
        if(nextProps.lightshow.changeLightshowTitle && this.btnIdx > -1){
            if(this.btnIdx == 0){
                this.updateLightColors()
            }else if(this.btnIdx == 1){
                nextProps.dispatch(initialLightshowColor())
            }else if(this.btnIdx == 2){
                nextProps.dispatch(saveForLater()) 
            }else if(this.btnIdx == 3){
                this.setBeginLightshow()
            }
            this.btnIdx = -1
        }
    }

    getTotalDuration(colors){
        let hour = 0, min = 0, sec = 0, millisec = 0
        for(var i = 0 ; i < colors.length; i++){
            var durationArr = colors[i].duration.split(':')
            hour += parseInt(durationArr[0])
            min += parseInt(durationArr[1])
            sec += parseInt(durationArr[2])
            millisec += parseInt(durationArr[3])
        }

        let count = Math.floor(millisec / 1000)
        if(count > 0){
            sec += count
            millisec = millisec % 1000
        }
        count = Math.floor(sec / 60)
        if(count > 0){
            min += count
            sec = sec % 60 
        }
        count = Math.floor(min / 60)
        if(count > 0){
            hour += count
            min = min % 60
        }

        let totalTime = hour.toString() + ":"

        if(min < 10) totalTime += "0" + min + ":"
        else totalTime += min.toString() + ":"

        if(sec < 10) totalTime += "0" + sec + ":"
        else totalTime += sec.toString() + ":"

        if(millisec < 10) totalTime += "00" + millisec
        else if(millisec < 100) totalTime += "0" + millisec
        else totalTime += millisec.toString()
        
        
        this.setState({totalTime})

    }

    setBeginLightshow(){   
        var { lightshow, dispatch } = this.props;    
        dispatch(setCurrentPage('choose'))
        dispatch(startLightshow(lightshow.lightshowDetail.id))
    }

    goToBeginLightshow(lightshowId){        
        const { lightshow, navigator } = this.props  
        navigator.push({
            component: WatchLightshow,
            passProps: {
                lightshowName: lightshow.lightshowDetail.lightshowName,
                lightshowId: lightshowId,
                page: 5
            }
        }) 
    }

    goToLightshowListScreen(){
        const { navigator, dispatch } = this.props     
        navigator._jumpN(-4)            
    }

    goToBackScreen(){
        const { navigator } = this.props
        navigator.pop()           
        
    }

    goToEditColor(item){
        const { navigator } = this.props  
        navigator.push({
            component: EditColor,
            passProps: {
                item: item
            }
        }) 
    }
    
    onRemoveColor(color){
        const { dispatch, lightshow } = this.props        
        color.active = false

        let colors = []
        for(var i = 0 ; i < this.orderKeys.length ; i++){
            colors.push(lightshow.lightshowColors[this.orderKeys[i]])
        }


        for(var i = 0 ; i < colors.length ; i++){
            if(color.id == colors[i].id){
                colors.splice(i, 1);
                break;
            }
        }

        for(var i = 0 ; i < colors.length ; i++){
            colors[i].order = i + 1
        }

        dispatch(deleteLightshowColor(colors))
        this.orderKeys = []
    }
    
    changeOrders(keys){
        this.orderKeys = keys        
    }

    getColors(){
        const { lightshow } = this.props  
        var arr = []                
        for(var i = 0 ; i < this.orderKeys.length ; i++){
            lightshow.lightshowColors[this.orderKeys[i]].order = i + 1
            arr.push(lightshow.lightshowColors[this.orderKeys[i]])
        }        
        return arr
    }

    updateLightColors(){     
        const { dispatch, lightshow } = this.props
        let body = {
            data: this.getColors()
        }   
        dispatch(updateLightshowColors(lightshow.lightshowDetail.id, body))
        this.orderKeys = []
    }

    setLightshowDetail(){
        const { dispatch, lightshow } = this.props
        if(this.state.title == ''){
            Alert.alert(
                "Uh Oh", 
                "Please enter lightshow name.",
                [
                  {text: 'OK', onPress: () => {
                  }},
                ]
              )
        }else{
            if(this.changeTitle){
                let body = {
                    id: lightshow.lightshowDetail.id,
                    lightshowlocation: lightshow.lightshowDetail.lightshowlocation.id,
                    lightshowName: this.state.title,
                    createdBy: lightshow.lightshowDetail.createdBy,
                    createdAt: lightshow.lightshowDetail.createdAt,
                    active: lightshow.lightshowDetail.active
                }
                this.changeTitle = false
                dispatch(updateLightshowTitle(body))   
            }else{
                if(this.btnIdx == 0){
                    this.updateLightColors()
                }else if(this.btnIdx == 1){
                    dispatch(initialLightshowColor())
                    this.goToBackScreen()
                }else if(this.btnIdx == 2){
                    dispatch(saveForLater()) 
                    this.goToLightshowListScreen()
                }else if(this.btnIdx == 3){
                    this.setBeginLightshow()
                }
                this.btnIdx = -1
            }            
        }
    }

    getOrderedColorData(data){
        let colorData = {}
        
        if(this.orderKeys.length == 0){
            for(var i = 0 ; i < data.length ; i++)
                this.orderKeys.push(i)
        }

        if(this.state.editStatus){
            for(var i = 0 ; i < data.length ; i++){
                colorData[i] = data[i]
            }
        }else{
            colorData = []
            for(var i = 0 ; i < this.orderKeys.length ; i++){
                colorData.push(data[this.orderKeys[i]]) 
            } 
        }      
          
       
        return colorData
    }

    renderListRow(item, id){      
        return (
            <TouchableOpacity style={[styles.rowFront]} onPress={() => {
                this.setState({selColerIdx: id + 1})
            }}>
                <View style={{flexDirection:'row', width:'100%'}} >
                {
                    this.state.selColerIdx == id + 1 ?
                    <TouchableOpacity style={{width:'10%', alignItems:'flex-start', paddingLeft:15}} onPress={() => {
                        this.goToEditColor(item)
                    }}>
                        <Icon style={[{color:'white'}, {color:'#007a45'}]} name="pencil" size={18}/>                            
                    </TouchableOpacity>
                    :
                    <View style={{width:'10%', alignItems:'flex-start', paddingLeft:15}}>
                        <Icon style={[{color:'white'}, {color:'#007a45'}]} name="circle" size={18}/>                            
                    </View>
                }                    
                    <View style={{width:'40%', alignItems:'flex-start'}}>
                        <Text style={[{color:'#fff', fontSize:17, paddingLeft:'7%'}, (id + 1) == this.state.selColerIdx && {color:'#007a45'}]}>{item.color}</Text>
                    </View>
                    <View style={{width:'40%', alignItems:'flex-start'}}>
                        <Text style={[{color:'#fff', fontSize:17}, (id + 1) == this.state.selColerIdx && {color:'#007a45'} ]}>{item.duration}</Text>
                    </View>   
                    <View style={{width:'10%', alignItems:'flex-end', paddingRight:15}}>
                        <Icon style={[{color:'white'}, (id + 1) == this.state.selColerIdx && {color:'#007a45'}]} name="align-justify" size={18}/>
                    </View>             
                </View>
            </TouchableOpacity>                      
        )     
    }

    renderSortRow = ({data, active}) => {
        return <Row data={data} active={active} onRemoveColor={(data) =>{this.onRemoveColor(data)}} />
    }

    render() {
        var { lightshow, navigator, auth, dispatch } = this.props;
     
        if(lightshow.lightshowColors.length == 0 && this.state.editStatus){
            this.setState({editStatus: false})
        }

        return (
          <View style={styles.wrapper}>
            <NavigationBar
                navigator={navigator}
                editable
                title={this.state.title}      
                showBackButton={false}   
                txt={this.state.editStatus ? 'Done' : 'Edit'} 
                onChangeText={(text) => {
                    this.changeTitle = true
                    this.setState({title:text})
                }}
                onRightBtnPress={() => {
                    if(lightshow.lightshowColors.length > 0){
                        if(this.state.editStatus){
                            this.setState({editStatus: false}, () => {
                                this.btnIdx = 0
                                this.setLightshowDetail()
                            })
                        }else{
                            this.setState({editStatus: true})
                        }
                        
                    }
                 }}                            
            />          
            <View style={{height: deviceHeight / 2 - 32, paddingTop: 10}}>
            {
                lightshow.lightshowColors.length > 0 ?
                    this.state.editStatus ?
                    <SortableList
                        contentContainerStyle={styles.contentContainer}
                        data={this.getOrderedColorData(lightshow.lightshowColors)}
                        renderRow={this.renderSortRow} 
                        onChangeOrder={(keys) => {
                            this.changeOrders(keys)
                        }}
                        />           
                    :
                    <ListView
                        dataSource={this.ds.cloneWithRows(this.getOrderedColorData(lightshow.lightshowColors))}
                        enableEmptySections={true}
                        renderRow={(item, selId, rowId, rowMap) => {
                            return this.renderListRow(item, rowId)
                        }}
                    />
                :
                <View style={styles.emptyView}>
                    <Text style={styles.emptyTxt}>No result found</Text>
                </View>
            }
            </View>
            <View style={{height: deviceHeight / 2 - 32, alignItems:'center', paddingTop:'5%'}}>
                <Button 
                    isDisabled={this.state.editStatus}
                    style={[styles.button, {backgroundColor:'#00ce74'}]}
                    onPress={() => {
                        this.btnIdx = 1
                        this.setLightshowDetail()                        
                    }}
                    >
                    <Text style={{fontSize:16, color:'#ffffff'}}>Add More Colors</Text>
                </Button>


                <Button 
                    isDisabled={this.state.editStatus}
                    style={[styles.button, {backgroundColor:'#ff3b30'}]}
                    onPress={() => {
                        this.btnIdx = 2
                        this.setLightshowDetail()   
                    }}
                    >
                    <Text style={{fontSize:16, color:'#ffffff'}}>Save For Later</Text>
                </Button>

                <Button 
                    isDisabled={this.state.editStatus}
                    style={[styles.button, {backgroundColor:'#007aff'}]}
                    onPress={() => {
                        this.btnIdx = 3
                        this.setLightshowDetail()
                    }}
                    >
                    <Text style={{fontSize:16, color:'#ffffff'}}>Begin Lightshow</Text>
                </Button>
            </View>
            <View style={{
                position:'absolute',
                top: 22,
                left: 10,
                backgroundColor:'transparent'
            }}>
                <Text style={{                
                    color:'white', 
                    fontSize: 15,
                    fontWeight:'bold'}}>{this.state.totalTime}</Text>
            </View>
            
          </View>
        );
    }
}

class Row extends Component {

    constructor(props) {
      super(props);
  
      this._active = new Animated.Value(0);
  
      this._style = {
        ...Platform.select({
          ios: {
            transform: [{
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            }],
            shadowRadius: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 10],
            }),
          },
  
          android: {
            transform: [{
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            }],
            elevation: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 6],
            }),
          },
        })
      };
    }
  
    componentWillReceiveProps(nextProps) {
      if (this.props.active !== nextProps.active) {
        Animated.timing(this._active, {
          duration: 300,
          easing: Easing.bounce,
          toValue: Number(nextProps.active),
        }).start();
      }
    }
  
    render() {
        const {data, active} = this.props;
        return (
            <Animated.View style={[
                styles.rowFront,
                this._style,
                ]}>
                <View style={{flexDirection:'row', width:'100%'}} >
                    <TouchableOpacity style={{width:'10%', alignItems:'flex-start', paddingLeft:15}} onPress={() => {
                        this.props.onRemoveColor(data)
                        }}>
                        <Icon style={{color:'red'}} name="minus-circle" size={18}/>                            
                    </TouchableOpacity>
                    <View style={{width:'40%', alignItems:'flex-start'}}>
                        <Text style={[{color:'#fff', fontSize:17, paddingLeft:'7%'}]}>{data.color}</Text>
                    </View>
                    <View style={{width:'40%', alignItems:'flex-start'}}>
                        <Text style={[{color:'#fff', fontSize:17}, ]}>{data.duration}</Text>
                    </View>   
                    <View style={{width:'10%', alignItems:'flex-end', paddingRight:15}}>
                        <Icon style={{color:'white'}} name="align-justify" size={18}/>
                    </View>             
                </View>
            </Animated.View>
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
        backgroundColor:'gray',
        borderRadius:10,  
        justifyContent:'center',
        alignItems:'center'      
    },
    emptyView: {
        width:'100%', 
        justifyContent:'center', 
        alignItems:'center'
    },
    emptyTxt: {
        color:'#fff',
        fontSize: 14
    },
    rowFront: {     
        flexDirection:'row',    
        width:'100%',      
		justifyContent: 'center',
        backgroundColor: 'transparent',
        height:35
    },
    contentContainer: {
        width: '100%',    
        height: '100%'
    },
});

const mapStateToProps = (state) => ({ lightshow: state.lightshows, auth: state.auth, soketMessage: state.socketMessage });

export default connect(mapStateToProps)(ChooseOptions);
