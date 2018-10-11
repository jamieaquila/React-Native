import React, { Component } from 'react';
import { 
    StyleSheet, 
    View, 
    TouchableOpacity, 
    Text, 
    TextInput,
    AsyncStorage, 
    Alert, 
    Platform, 
    Image, 
    PermissionsAndroid, 
    Dimensions, 
    DatePickerIOS, 
    DatePickerAndroid,
    TimePickerAndroid,
    ScrollView 
} from 'react-native';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import { setLocation, setLocaiontInit } from '../../../actions/SetLocationAction'; 
import { 
    createLightshowLocation, 
    updateLightshowLocation
} from '../../../actions/LightshowAction'
import ChooseColor from '../../../components/views/LightshowAdmin/ChooseColor'
import { app, api } from '../../../config'
import { NavigationBar } from '../../../components/molecules';
import Geocoder from 'react-native-geocoder'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import moment, { locale } from 'moment';
import albumReducer from '../../../reducers/albumReducer';

class SetLocation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            latlng: this.props.data.position,
            address: this.props.data.address,
            venueName: this.props.data.venueName,
            prevPage: this.props.prevPage,
            startDateTime: new Date(),
            endDateTime: new Date(),
            startDate:{
                date: new Date(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes() 
            },
            endDate:{
                date: new Date(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes() 
            },
            radius:'5000',
            checkStatus: false
        }
    }

    componentDidMount() {  
        var { prevData } = this.props
        if(prevData){
           this.calcData(prevData)
        }        
        this.setSuccess = false
    }

    componentWillReceiveProps(nextProps){  
        if(nextProps.location.data != undefined){
            if(!this.setSuccess && this.state.prevPage == 'friend'){
                this.setSuccess = true 
                this.goToFindMyFriendScreen(navigator, dispatch)
            }
        }        
            
        if(nextProps.lightshow.lightshowLocation != undefined){
            if((this.state.prevPage == 'lightshow' || this.state.prevPage == 'editLightshow') 
                && nextProps.lightshow.curPage == 'location' && nextProps.lightshow.lightshowDetail == undefined){            
                this.goToChooseColorScreen(nextProps.lightshow.lightshowLocation)   
            }                     
        }
    }

    calcData(prevData){
        let radius = this.state.radius
        let startDateTime = this.state.startDateTime
        let endDateTime = this.state.endDateTime
        let startDate = this.state.startDate
        let endDate = this.state.endDate
        if(prevData.radius){
            radius = prevData.radius
        }
        let checkStatus = this.state.checkStatus
        if(prevData.startDateTime){
            checkStatus = true
            if(Platform.OS == 'ios'){
                startDateTime = new Date(prevData.startDateTime)
            }else{
                startDate.date = new Date(prevData.startDateTime)
                startDate.hour = new Date(prevData.startDateTime).getHours()
                startDate.minute = new Date(prevData.startDateTime).getMinutes()
            }
            
        }

        if(prevData.endDateTime){
            if(Platform.OS == 'ios'){
                endDateTime = new Date(prevData.endDateTime)
            }else{
                endDate.date = new Date(prevData.endDateTime)
                endDate.hour = new Date(prevData.endDateTime).getHours()
                endDate.minute = new Date(prevData.endDateTime).getMinutes()
            }
        }
        if(Platform.OS == 'ios'){
            this.setState({
                radius,
                startDateTime,
                endDateTime,      
                checkStatus          
            })
        }else{
            this.setState({
                radius,
                startDate,
                endDate,        
                checkStatus        
            })
        }            
    }

    async showDatePicker(selDate, status){
        try {
            var options = {date: selDate, mode:'spinner'}
            const { action, year, month, day } = await DatePickerAndroid.open(options);
            if (action !== DatePickerAndroid.dismissedAction) {
                let date = new Date(year, month, day);
                let dateObj;
                if(status == 1){
                    dateObj = this.state.startDate
                    dateObj.date = date
                    this.setState({startDate: dateObj})
                }else{
                    dateObj = this.state.endDate
                    dateObj.date = date
                    this.setState({endDate: dateObj})
                } 
            } 
        } catch ({code, message}) {
            
        }
    }

    async showTimePicker(options, status){
        try {
            const { action, hour, minute } = await TimePickerAndroid.open(options)
            if (action !== TimePickerAndroid.dismissedAction) {
                let dateObj
                if(status == 1){
                    dateObj = this.state.startDate
                    dateObj.hour = hour
                    dateObj.minute = minute
                    this.setState({startDate: dateObj})
                }else{
                    dateObj = this.state.endDate
                    dateObj.hour = hour
                    dateObj.minute = minute
                    this.setState({endDate: dateObj})
                }
            }
        } catch({code, message}){

        }
    }

    getDateStr(date){
        let str = moment(date.date).format("YYYY-MM-DD") + " " + date.hour + ":" + date.minute
        return str
    }

    setLocation(){
        const { dispatch } = this.props;
        if(this.state.radius == ''){
            Alert.alert(
                "Uh Oh", 
                "Please input radius.",
                [
                  {text: 'OK', onPress: () => {
                  }},
                ]
              )
        }else{
            let body = {}
            if(Platform.OS == 'ios'){
                body = {
                    venueName: this.state.venueName,
                    radius: Number(this.state.radius),
                    latitude: Number(this.state.latlng.lat),
                    longitude: Number(this.state.latlng.lng),
                    startDateTime: this.state.checkStatus ? moment(this.state.startDateTime).utc().format("YYYY-MM-DD HH:mm:ss") : null,
                    endDateTime: this.state.checkStatus ? moment(this.state.endDateTime).utc().format("YYYY-MM-DD HH:mm:ss") : null,
                    active: true
                }            
            }else{
                let startDateStr = moment(this.state.startDate.date).format("YYYY-MM-DD") + " " + this.state.startDate.hour + ":" + this.state.startDate.minute
                let endDateStr = moment(this.state.endDate.date).format("YYYY-MM-DD") + " " + this.state.endDate.hour + ":" + this.state.endDate.minute
                body = {
                    venueName: this.state.venueName,
                    radius: Number(this.state.radius),
                    latitude: Number(this.state.latlng.lat),
                    longitude: Number(this.state.latlng.lng),
                    startDateTime: this.state.checkStatus ? moment(startDateStr).utc().format("YYYY-MM-DD HH:mm:ss") : null,
                    endDateTime: this.state.checkStatus ? moment(endDateStr).utc().format("YYYY-MM-DD HH:mm:ss") : null, 
                    active: true
                }
            }
           
            if(this.state.prevPage == 'friend'){
                dispatch(setLocation(body))
            }else{
                if(this.state.prevPage == 'lightshow'){                    
                    body.AppId = app.id
                    dispatch(createLightshowLocation(body))
                }else{
                    body.id = this.props.prevData.lightshowlocationId
                    body.AppId = this.props.prevData.appId
                    dispatch(updateLightshowLocation(body))
                }                
            }
            
        }
    }

    goToFindMyFriendScreen(navigator, dispatch){        
        setTimeout(() => {
            dispatch(setLocaiontInit())
            navigator._jumpN(-2)
        }, 500)
    }

    goToChooseColorScreen(location){     
        const { navigator, dispatch, lightshow, prevData, lightshowName } = this.props           

        let data 
        if(this.state.prevPage == 'lightshow'){
            data = {
                lightshowlocation: location.id,
                lightshowName: lightshowName
            }
        }else if(this.state.prevPage == 'editLightshow'){
            data = {
                id: prevData.lightshowId,
                lightshowlocation: location[0].id,
                lightshowName: prevData.lightshowName
            }
        }
        navigator.push({
            component: ChooseColor,
            passProps: {
                data: data,
                prevPage: this.state.prevPage                    
            }
        }) 
    }

    render () {
        const { navigator, app, location, dispatch, lightshow } = this.props
        


        return (
            <View style={styles.wrapper}>
                <NavigationBar
                    navigator={navigator}
                    title="Set Location"                
                />
                <View style={styles.content}>
                    <ScrollView>
                        <View style={{}}>
                            <Text style={styles.title}>Address</Text>
                            <Text style={styles.address}>{this.state.address}</Text>
                        </View>                        
                        
                        {
                            this.state.prevPage == 'lightshow' || this.state.prevPage == 'editLightshow' ?
                                <View style={{width:'100%', paddingTop:15}}>
                                    <CheckBox
                                        title='Set Start/End Date/Time'
                                        checked={this.state.checkStatus}
                                        containerStyle={{backgroundColor:'transparent', borderWidth:0}}
                                        textStyle={{color:'white'}}
                                        onPress={() => {
                                            this.setState({checkStatus: !this.state.checkStatus})
                                        }}
                                    />
                                    {
                                        this.state.checkStatus &&
                                        <View>
                                            <View style={styles.picker}>
                                                <Text style={styles.title}>Start Date/Time</Text>
                                                <View style={[styles.pickerView, Platform.OS == 'android' && {backgroundColor:'#000'}]}>
                                                    {
                                                        Platform.OS == 'ios' ?
                                                            <DatePickerIOS
                                                                style={{width:'100%', height:200}}
                                                                date={this.state.startDateTime}
                                                                mode="datetime"
                                                                onDateChange={(date)=>{  
                                                                    this.setState({startDateTime:date});
                                                                }}
                                                            />
                                                        :
                                                            <View style={{width:'100%'}}>
                                                                <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                                    <View style={styles.dateTimeLblView}>
                                                                        <Text style={styles.dateTimeTxt}>Date:</Text>
                                                                    </View>
                                                                    
                                                                    <TouchableOpacity style={[styles.dateTimeBody, {borderColor:app.styles.primaryColor}]} onPress={() => {
                                                                        this.showDatePicker(this.state.startDate.date, 1)
                                                                    }}>
                                                                        <Text style={styles.dateTimeTxt}>{moment(this.state.startDate.date.toUTCString()).format("YYYY-MM-DD")}</Text>
                                                                    </TouchableOpacity>                                            
                                                                </View>
                                                                <View style={{paddingTop:10}} />
                                                                <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                                    <View style={styles.dateTimeLblView}>
                                                                        <Text style={styles.dateTimeTxt}>Time:</Text>
                                                                    </View>
                                                                    
                                                                    <TouchableOpacity style={[styles.dateTimeBody, {borderColor:app.styles.primaryColor}]} onPress={() => {
                                                                        let options = {
                                                                            hour: this.state.startDate.hour,
                                                                            minute: this.state.startDate.minute,
                                                                            is24Hour: false,
                                                                            mode:'spinner'
                                                                        }
                                                                    this.showTimePicker(options, 1)
                                                                    }}>
                                                                        <Text style={styles.dateTimeTxt}>{moment(this.getDateStr(this.state.startDate)).format("hh:mm A")}</Text>
                                                                    </TouchableOpacity>                                            
                                                                </View>
                                                            </View>
                                                    }                            
                                                </View>
                                            </View>
                                            <View style={{paddingTop:10}} />
                                            <View style={styles.picker}>
                                                <Text style={styles.title}>End Date/Time</Text>
                                                <View style={[styles.pickerView,  Platform.OS == 'android' && {backgroundColor:'#000'}]}>
                                                    {
                                                        Platform.OS == 'ios' ?
                                                            <DatePickerIOS
                                                                style={{width:'100%', height:200}}
                                                                date={this.state.endDateTime}
                                                                mode="datetime"
                                                                onDateChange={(date)=>{                          
                                                                    this.setState({endDateTime:date});
                                                                }}
                                                            />
                                                        :
                                                            <View style={{width:'100%'}}>
                                                                <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                                    <View style={styles.dateTimeLblView}>
                                                                        <Text style={styles.dateTimeTxt}>Date:</Text>
                                                                    </View>
                                                                    
                                                                    <TouchableOpacity style={[styles.dateTimeBody, {borderColor:app.styles.primaryColor}]} onPress={() => {
                                                                        this.showDatePicker(this.state.endDate.date, 2)
                                                                    }}>
                                                                        <Text style={styles.dateTimeTxt}>{moment(this.state.endDate.date.toUTCString()).format("YYYY-MM-DD")}</Text>
                                                                    </TouchableOpacity>                                            
                                                                </View>
                                                                <View style={{paddingTop:10}} />
                                                                <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                                    <View style={styles.dateTimeLblView}>
                                                                        <Text style={styles.dateTimeTxt}>Time:</Text>
                                                                    </View>
                                                                    
                                                                    <TouchableOpacity style={[styles.dateTimeBody, {borderColor:app.styles.primaryColor}]} onPress={() => {
                                                                        let options = {
                                                                            hour: this.state.endDate.hour,
                                                                            minute: this.state.endDate.minute,
                                                                            is24Hour: false,
                                                                            mode:'spinner'
                                                                        }
                                                                    this.showTimePicker(options, 2)
                                                                    }}>
                                                                        <Text style={styles.dateTimeTxt}>{moment(this.getDateStr(this.state.endDate)).format("hh:mm A")}</Text>
                                                                    </TouchableOpacity>                                            
                                                                </View>
                                                            </View>
                                                    }                            
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </View>
                            :
                            <View>
                                <View style={styles.picker}>
                                    <Text style={styles.title}>Start Date/Time</Text>
                                    <View style={[styles.pickerView, Platform.OS == 'android' && {backgroundColor:'#000'}]}>
                                        {
                                            Platform.OS == 'ios' ?
                                                <DatePickerIOS
                                                    style={{width:'100%', height:200}}
                                                    date={this.state.startDateTime}
                                                    mode="datetime"
                                                    onDateChange={(date)=>{  
                                                        this.setState({startDateTime:date});
                                                    }}
                                                />
                                            :
                                                <View style={{width:'100%'}}>
                                                    <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                        <View style={styles.dateTimeLblView}>
                                                            <Text style={styles.dateTimeTxt}>Date:</Text>
                                                        </View>
                                                        
                                                        <TouchableOpacity style={[styles.dateTimeBody, {borderColor:app.styles.primaryColor}]} onPress={() => {
                                                            this.showDatePicker(this.state.startDate.date, 1)
                                                        }}>
                                                            <Text style={styles.dateTimeTxt}>{moment(this.state.startDate.date.toUTCString()).format("YYYY-MM-DD")}</Text>
                                                        </TouchableOpacity>                                            
                                                    </View>
                                                    <View style={{paddingTop:10}} />
                                                    <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                        <View style={styles.dateTimeLblView}>
                                                            <Text style={styles.dateTimeTxt}>Time:</Text>
                                                        </View>
                                                        
                                                        <TouchableOpacity style={[styles.dateTimeBody, {borderColor:app.styles.primaryColor}]} onPress={() => {
                                                            let options = {
                                                                hour: this.state.startDate.hour,
                                                                minute: this.state.startDate.minute,
                                                                mode:'spinner'
                                                            }
                                                        this.showTimePicker(options, 1)
                                                        }}>
                                                            <Text style={styles.dateTimeTxt}>{moment(this.getDateStr(this.state.startDate)).format("hh:mm A")}</Text>
                                                        </TouchableOpacity>                                            
                                                    </View>
                                                </View>
                                        }                            
                                    </View>
                                </View>
                                <View style={{paddingTop:10}} />
                                <View style={styles.picker}>
                                    <Text style={styles.title}>End Date/Time</Text>
                                    <View style={[styles.pickerView,  Platform.OS == 'android' && {backgroundColor:'#000'}]}>
                                        {
                                            Platform.OS == 'ios' ?
                                                <DatePickerIOS
                                                    style={{width:'100%', height:200}}
                                                    date={this.state.endDateTime}
                                                    mode="datetime"
                                                    onDateChange={(date)=>{                          
                                                        this.setState({endDateTime:date});
                                                    }}
                                                />
                                            :
                                                <View style={{width:'100%'}}>
                                                    <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                        <View style={styles.dateTimeLblView}>
                                                            <Text style={styles.dateTimeTxt}>Date:</Text>
                                                        </View>
                                                        
                                                        <TouchableOpacity style={[styles.dateTimeBody, {borderColor:app.styles.primaryColor}]} onPress={() => {
                                                            this.showDatePicker(this.state.endDate.date, 2)
                                                        }}>
                                                            <Text style={styles.dateTimeTxt}>{moment(this.state.endDate.date.toUTCString()).format("YYYY-MM-DD")}</Text>
                                                        </TouchableOpacity>                                            
                                                    </View>
                                                    <View style={{paddingTop:10}} />
                                                    <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                                                        <View style={styles.dateTimeLblView}>
                                                            <Text style={styles.dateTimeTxt}>Time:</Text>
                                                        </View>
                                                        
                                                        <TouchableOpacity style={[styles.dateTimeBody, {borderColor:app.styles.primaryColor}]} onPress={() => {
                                                            let options = {
                                                                hour: this.state.endDate.hour,
                                                                minute: this.state.endDate.minute,
                                                                mode:'spinner'
                                                            }
                                                        this.showTimePicker(options, 2)
                                                        }}>
                                                            <Text style={styles.dateTimeTxt}>{moment(this.getDateStr(this.state.endDate)).format("hh:mm A")}</Text>
                                                        </TouchableOpacity>                                            
                                                    </View>
                                                </View>
                                        }                            
                                    </View>
                                </View>
                            </View>

                        }
                        

                        <View style={styles.picker}>
                            <Text style={styles.title}>Radius</Text>
                            <View style={{paddingTop:10}} />
                            <TextInput 
                                style={{paddingLeft:10,  color:'#000', fontSize:14, backgroundColor:'#fff', height:35, borderRadius:10}}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    this.setState({radius: text})
                                }}
                                value={this.state.radius}
                                />                                                        
                        </View>

                        <View style={{alignItems:'center', paddingTop:30}}>
                            <TouchableOpacity style={[styles.button, {borderColor:app.styles.primaryColor}]} onPress={()=>{
                                this.setLocation()
                            }}>
                                <Text style={styles.buttonText}>SET LOCATION</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{paddingTop:70}} />
                    </ScrollView>
                </View>                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor:'transparent',
    }, 
    content: {
        paddingTop:10,
        paddingHorizontal: 25
    },   
    title: {
        color:'#fff',
        fontSize: 18,
        fontWeight:'bold'
    },
    address: {
        paddingTop:5,
        color:'#fff',
        fontSize:14
    },
    picker: {
        paddingTop:15,
        width:'100%'
    },
    pickerView: {
        backgroundColor:'#fff', 
        borderRadius:10, 
        width:'100%', 
        alignItems:'center', 
        marginTop:10
    },
    button: {
        width:150,
        height:50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 21.25,
    },
    buttonText : {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.8,
        color: 'white',
    },
    dateTimeLblView: {
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        height: 40,
    },
    dateTimeTxt: {
        color:'#fff', 
        fontSize:17
    },
    dateTimeBody: {
        marginLeft: '5%',
        height: 40,
        alignItems:'center',
        justifyContent:'center',
        width:'70%',
        borderWidth:1
    }

});

var mapStateToProps = state => ({ app: state.app, location: state.setLocation, lightshow: state.lightshows })
export default connect(mapStateToProps)(SetLocation);