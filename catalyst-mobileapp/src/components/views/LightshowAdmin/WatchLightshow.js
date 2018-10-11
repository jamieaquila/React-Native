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
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import { ColorPicker, TriangleColorPicker, toHsv, fromHsv } from 'react-native-color-picker'
import { NavigationBar } from '../../molecules';
import moment from 'moment';

import { endLightshow } from '../../../actions/LightshowAction'

import { stopLightshow, setCurrentPage, initStopLightshow, initStartLightshow } from '../../../actions/MessageActions'

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = 0.0421

class WatchLightshow extends Component {
    constructor(props) {
        super(props); 
        
    }

    componentDidMount() {  
        var { dispatch } = this.props
        this.backStatus = false
        
        dispatch(initStartLightshow())
    }

    componentWillReceiveProps(nextProps){ 
        if(nextProps.soketMessage.endedLightshow == nextProps.lightshowId){     
            if(!this.backStatus){
                this.backStatus = true
                this.goToFirstScreen()
            }
        }
    }    

    endLightshow(){
        var { lightshow, dispatch, lightshowId } = this.props        
        console.log("WatchLightshow", "stopLightshow :"+ lightshowId);
        
        dispatch(stopLightshow(lightshowId))
    }

    goToFirstScreen(){
        var { navigator, page, dispatch } = this.props;
        dispatch(endLightshow())
        dispatch(setCurrentPage(''))
        dispatch(initStopLightshow())
        if(page == 1){
            navigator.pop()
        }else{
            navigator._jumpN(-5)
        }
    }

    render() {
        var { lightshow, navigator, auth, dispatch, lightshowName } = this.props;
        return (
          <View style={styles.wrapper}>
            <NavigationBar
                navigator={navigator}
                hideRight
                title={lightshowName}     
                showBackButton={false}   
            />                      
            <View style={{paddingTop:'50%'}} />
            <Button style={[styles.button, {backgroundColor:'#00ce74'}]}                
                onPress={() => {
                    this.endLightshow()
                }}>
                <Text style={{fontSize:16, color:'#ffffff'}}>End Current Lightshow</Text>
            </Button>
            
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
        backgroundColor:'gray',
        borderRadius:10,  
        justifyContent:'center',
        alignItems:'center'      
    },
    emptyView: {
        width:'100%', 
        height: deviceHeight / 2 + 39, 
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

export default connect(mapStateToProps)(WatchLightshow);
