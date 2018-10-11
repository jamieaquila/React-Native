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
    TouchableOpacity,
    RefreshControl,
    Modal,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';
import Button from 'apsl-react-native-button'
import { NavigationBar } from '../../molecules';
import SearchAddress from '../../../Festival/views/Friends/SearchAddress'
import WatchLightshow from './WatchLightshow'
import { 
    getLightshowDetailsList, 
    getLightshowLocation, 
    duplicateLightshowDetail,
    deleteLightshowDetail,
    beginLightshow,
    updateLightshowTitle
} from '../../../actions/LightshowAction'
import { startLightshow, setCurrentPage} from '../../../actions/MessageActions'
import moment from 'moment';
import { isIphoneX } from 'react-native-iphone-x-helper'

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = 0.0421

class Lightshow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region:{
                latitude: Number(37.426727),
                longitude: Number(-122.080377),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            selectedIdx:0,
            editStatus: false,
            refreshing: false,
            changeNameModalVisible: false,
            selectedLightshowName: ''
            
        }
        this.ds = new ListView.DataSource({rowHasChanged: (rk, r2) => r1 !== r2})
    }

    componentDidMount() {  

        this.currentPosition();
        var { dispatch, navigator } = this.props;
        dispatch(getLightshowDetailsList())
        
        
    }

    componentWillReceiveProps(nextProps){  
        // console.log(nextProps.soketMessage.startedLightshow)
        if( nextProps.soketMessage.startedLightshow && (nextProps.soketMessage.startedLightshow == this.state.selectedIdx) && nextProps.soketMessage.curPage == 'lightshowList' ){           
            this.goToBeginLightshow(nextProps.soketMessage.startedLightshow)
        }

        if(nextProps.lightshow.lightshowDetails.length == 0 && this.state.editStatus){
            this.setState({editStatus: false})
        }

        if(!nextProps.lightshow.isLoading) this.setState({refreshing: false})
    }

    currentPosition(){
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
            }, () => {
            //   const { dispatch } = this.props;
            //   dispatch(getMyLocation(position.coords.longitude, position.coords.latitude));   
            })
          },
          (error) => {
            // console.log(JSON.stringify(error))     
          },
          {enableHighAccuracy: Platform.OS == 'android' ? false : true, timeout: 20000, maximumAge: 1000}
        );
    }

    getLightshowDetail(lightshow){
        let lightshowDetail = ""
        for(var i = 0 ; i < lightshow.lightshowDetails.length ; i++){
            if(this.state.selectedIdx == lightshow.lightshowDetails[i].id){
                lightshowDetail = lightshow.lightshowDetails[i]
                break
            }
        }
        return lightshowDetail
    }

    addNewLightshow(navigator){
        navigator.push({
            component: SearchAddress,
            passProps: {
                latlng: {
                    lat:this.state.region.latitude,
                    lng:this.state.region.longitude
                },
                prevPage: 'lightshow'
            }
        }) 
    }

    goToEditLocation(){        
        var { lightshow, navigator } = this.props;
        
        let detail;
        for(var i = 0 ; i < lightshow.lightshowDetails.length; i++){
            if(this.state.selectedIdx == lightshow.lightshowDetails[i].id){
                detail = lightshow.lightshowDetails[i];
                break;
            }
        }

        let data = {
            lightshowId: detail.id,
            lightshowName: detail.lightshowName,
            radius: detail.lightshowlocation.radius,
            startDateTime: detail.lightshowlocation.startDateTime,
            endDateTime: detail.lightshowlocation.endDateTime,
            lightshowlocationId:detail.lightshowlocation.id,
            appId:detail.lightshowlocation.app
        }

        let latitude = Number(detail.lightshowlocation.latitude)
        let longitude = Number(detail.lightshowlocation.longitude)
        let latlng = {
            lat: latitude,
            lng: longitude
        }

        navigator.push({
            component: SearchAddress,
            passProps: {
                latlng: latlng,                
                prevPage: 'editLightshow',
                prevData: data
            }
        }) 
    }

    goToBeginLightshow(lightshowId){
        const { lightshow, navigator } = this.props  
        let lightshowDetail = this.getLightshowDetail(lightshow)
        navigator.push({
            component: WatchLightshow,
            passProps: {
                lightshowName: lightshowDetail.lightshowName,
                lightshowId : lightshowId,
                // lightshowTrigger: lightshow.lightshowTrigger,
                page: 1
            }
        }) 
    }
    
    setLightshowDetail(name){
        const { lightshow, dispatch } = this.props
        let lightshowDetail = this.getLightshowDetail(lightshow)        
        let body = {
            id: lightshowDetail.id,
            lightshowlocation: lightshowDetail.lightshowlocation.id,
            lightshowName: name,
            createdBy: lightshowDetail.createdBy,
            createdAt: lightshowDetail.createdAt,
            active: lightshowDetail.active
        }
        dispatch(updateLightshowTitle(body))  
    }
   
    duplicateLightshowDetail(item){
        let body = {
            id: item.id
        }
        var { dispatch } = this.props;
        dispatch(duplicateLightshowDetail(body))
    }

    deleteLightshowDetail(item){
        let body = {            
            lightshowlocation: item.lightshowlocation.id,
            lightshowName: item.lightshowName,         
            active: false
        }
        var { dispatch } = this.props;
        dispatch(deleteLightshowDetail(item.id, body))
    }

    setBeginLightshow(){
        const { lightshow, navigator, dispatch } = this.props
        let lightshowDetail = this.getLightshowDetail(lightshow)   
        dispatch(setCurrentPage('lightshowList'))
        dispatch(startLightshow(lightshowDetail.id))
    }

    onRefresh() {
        var { dispatch } = this.props;
        this.setState({refreshing: true});        
        dispatch(getLightshowDetailsList())
    }

    renderChangeTitleModal(){
        
        return (
            <Modal
                visible={true}
                animationType={'fade'}
                onRequestClose={() => this.closeModal()}
                transparent={true}
                >
                <View style={{flex: 1,  
                    backgroundColor:'rgba(0,0,0,0.3)',
                    alignItems:'center',
                    justifyContent:'center'}}>
                    <View style={{ width:'90%',
                        height: 160,       
                        backgroundColor:'#fff',
                        borderRadius:10,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        alignItems:'center'}}>
                        <View style={{width:'90%', alignItems:'center', paddingTop:20}}>
                            <Text style={{fontSize:17, fontWeight:'bold'}}>Change Lightshow Name</Text>
                            <View style={{marginTop:10, paddingLeft:10, width:'100%', borderColor:'rgba(0, 0, 0, 0.3)', borderWidth:1, borderRadius:6}} >
                                <TextInput 
                                    style={{ height: 35, }}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        let selectedLightshowName = text
                                        this.setState({selectedLightshowName})
                                    }}
                                    value={this.state.selectedLightshowName}
                                /> 
                            </View>
                        </View>
                        <View style={{paddingTop: 20, width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                            
                            <Button 
                                style={{width:'30%', height:35, borderWidth:1, borderColor:'rgba(87, 99, 112, 0.3)'}}
                                onPress={() => {                                    
                                    this.setState({
                                        changeNameModalVisible: false,
                                        selectedLightshowName: ''
                                    })                     
                                }}
                                >
                                <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.4)'}}>Cancel</Text>
                            </Button>
                            <View style={{width:'15%'}} />
                            <Button 
                                style={{width:'30%', height:35, borderWidth:0, backgroundColor:'#3d3bee'}}
                                onPress={() => {
                                    if(this.state.selectedLightshowName == ''){
                                        Alert.alert(
                                            "Uh Oh", 
                                            "Please enter lightshow name.",
                                            [
                                              {text: 'OK', onPress: () => {
                                              }},
                                            ]
                                          )
                                    }else{
                                        let lightshowName = JSON.parse(JSON.stringify(this.state.selectedLightshowName))
                                        this.setState({
                                            changeNameModalVisible: false,
                                            selectedLightshowName:''
                                        }, () => {
                                            this.setLightshowDetail(lightshowName)
                                        })
                                    }                 
                                }}
                                >
                                <Text style={{fontSize:16, color:'#ffffff'}}>Save</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>       
        )
    }

    renderListRow(item){
        const { lightshow } = this.props
        if(this.state.editStatus){
            return (
                <View style={[styles.rowFront]}>
                    <TouchableOpacity style={{width:'10%', alignItems:'flex-start', paddingLeft:14}} onPress={() => {
                        this.deleteLightshowDetail(item)
                    }}>
                        <Icon style={{color:'red'}} name="minus-circle" size={18}/>
                    </TouchableOpacity>
                    <View style={{flexDirection:'row', width:'90%'}}>
                        <View style={{width:'60%', alignItems:'flex-start'}}>                            
                            <Text style={[{color:'#fff', fontSize:17, paddingLeft:5}]}>{item.lightshowName}</Text>
                        </View>
                        <View style={{width:'30%', alignItems:'flex-start'}}>
                            <Text style={[{color:'#fff', fontSize:17}]}>{moment(item.createdAt).format("MM/DD/YYYY")}</Text>
                        </View>  
                        <View style={{width:'10%', alignItems:'flex-end', paddingRight:14}}>
                            <Icon style={[{color:'white'}]} name="file-text" size={18}/>
                        </View>
                    </View>
                </View>
            )
        }else{
            return (
                <View style={[styles.rowFront]}>
                    <TouchableOpacity
                        onPress={ () =>{
                            this.setState({selectedIdx:item.id})
                        }}
                        style={{flexDirection:'row', width:'90%'}}
                        >
                        <View style={{width:'10%', alignItems:'flex-start', paddingLeft:14}}>
                        {
                            this.state.selectedIdx == item.id ?
                            <Icon style={[{color:'white'}, {color:'#007a45'}]} name="circle" size={18}/>
                            :
                            <Icon style={[{color:'white'}, {}]} name="circle-thin" size={18}/>
                        }
                        </View>
                        <View style={[{width:'60%', alignItems:'flex-start'}, this.state.selectedIdx == item.id && {flexDirection:'row'}]}>
                            {
                                this.state.selectedIdx == item.id &&
                                <TouchableOpacity style={{marginLeft:5}} onPress={() => {
                                    let selectedLightshowName = this.getLightshowDetail(lightshow).lightshowName
                                    this.setState({
                                        changeNameModalVisible: true,
                                        selectedLightshowName
                                    })
                                }}>
                                    <Icon name="pencil" size={18} style={{color:'#007a45'}} />
                                </TouchableOpacity>
                            }
                            <Text style={[{color:'#fff', fontSize:17, paddingLeft:5}, this.state.selectedIdx == item.id && {color:'#007a45'}]}>{item.lightshowName}</Text>
                            
                        </View>

                        <View style={[{width:'30%', alignItems:'flex-start'}]}>
                            <Text style={[{color:'#fff', fontSize:17}, this.state.selectedIdx == item.id && {color:'#007a45'}]}>{moment(item.createdAt).format("MM/DD/YYYY")}</Text>
                            
                        </View>                
                    </TouchableOpacity>  
                    <TouchableOpacity style={{width:'10%', alignItems:'flex-end', paddingRight:14}} onPress={() => {
                        this.setState({selectedIdx: 0}, () => {
                            this.duplicateLightshowDetail(item)
                        })
                        
                        }}>
                        <Icon style={{ color:'white'}} name="file-text" size={18}/>
                    </TouchableOpacity>
                </View>                      
            )     
        }
        
    }

    render() {
        var { lightshow, navigator, auth, dispatch } = this.props;
        let lightshowName = ""
        
        return (
          <View style={styles.wrapper}>
            <NavigationBar
                navigator={navigator}
                title="Lightshows"    
                txt={this.state.editStatus ? 'Done' : 'Edit'}         
                onRightBtnPress={() => {
                   if(lightshow.lightshowDetails.length > 0){
                        let selectedIdx = this.state.selectedIdx
                        if(this.state.editStatus) selectedIdx = 0
                        this.setState({
                            editStatus: !this.state.editStatus,
                            selectedIdx
                        })
                   }
                }}   
            />
            <View style={{height: deviceHeight / 2 - 32, paddingTop: 10}}>
            {
                lightshow.lightshowDetails.length == 0 && !lightshow.isLoading ?
                    <View style={styles.emptyView}>
                        <Text style={styles.emptyTxt}>No result found</Text>
                    </View>
                :
                    <ListView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={ () => {this.onRefresh()}}
                                tintColor="#fff"
                                colors={['#ff0000', '#00ff00', '#0000ff']}
                                progressBackgroundColor="#fff"
                            />
                        }
                        dataSource={this.ds.cloneWithRows(lightshow.lightshowDetails)}
                        enableEmptySections={true}
                        renderRow={(item, selId, rowId, rowMap) => {
                            return this.renderListRow(item)
                        }}
                    />
                   
            }
            </View>
            <View style={{height: deviceHeight / 2 - 32, alignItems:'center', paddingTop:'5%'}}>                
                <Button 
                    style={[styles.button, {backgroundColor:'#00ce74'}]}
                    onPress={() => {
                        this.addNewLightshow(navigator)
                    }}
                    >
                    <Text style={{fontSize:16, color:'#ffffff'}}>Add New Lightshow</Text>
                </Button>

                <Button 
                    isDisabled={(this.state.editStatus || this.state.selectedIdx == 0) ? true : false}
                    style={[styles.button, this.state.editStatus ? {backgroundColor:'grey'} : {backgroundColor:'#ff3b30'}]}
                    onPress={() => {
                        if(this.state.selectedIdx > 0){
                            this.goToEditLocation()
                        }
                    }}
                    >
                    <Text style={{fontSize:16, color:'#ffffff'}}>Edit Selected</Text>
                </Button>

                <Button 
                    isDisabled={(this.state.editStatus || this.state.selectedIdx == 0) ? true : false}
                    style={[styles.button, this.state.editStatus ? {backgroundColor:'grey'} : {backgroundColor:'#007aff'}]}
                    onPress={() => {
                        this.setBeginLightshow()
                    }}
                    >
                    <Text style={{fontSize:16, color:'#ffffff'}}>Begin Lightshow</Text>
                </Button>
            </View>
            {
                this.state.changeNameModalVisible &&
                    this.renderChangeTitleModal()
            }
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
        marginHorizontal:50,
        height:50,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
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
});

const mapStateToProps = (state) => ({ lightshow: state.lightshows, auth: state.auth, soketMessage: state.socketMessage });

export default connect(mapStateToProps)(Lightshow);

