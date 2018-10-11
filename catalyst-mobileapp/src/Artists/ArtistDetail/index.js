import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Linking,
    ScrollView,
    Dimensions,
    WebView,
    TouchableHighlight,
    TouchableOpacity,
    RefreshControl,
    ListView
  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SafariView from 'react-native-safari-view';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
    createFestivalArtistFavorite,
    updateFestivalArtistFavorite,
    getFestivalArtistSetTime,
    // createFestivalArtistSetTime,
    // updateFestivalArtistSetTime,
    createFestivalUserSchedule,
    updateFestivalUserSchedule
} from '../../actions/FestivalActions'

const {
    width: deviceWidth,
    height: deviceHeight
} = Dimensions.get('window');

class ArtistDetail extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            btnIdx: 1,
            artist: this.props.data
        }
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(getFestivalArtistSetTime(this.state.artist.id))
    }

    componentWillReceiveProps(nextProps){  
        if(nextProps.festival.festivalArtists.length > 0 && !nextProps.festival.isLoading){
            this.changeArtist(nextProps.festival.festivalArtists)
        }
    }

    changeArtist(festivalArtists){        
        let artist = this.state.artist
        for(var i = 0 ; i < festivalArtists.length ; i++){
            if(festivalArtists[i].id == artist.id){
                artist = festivalArtists[i]
                break
            }
        }
        this.setState({artist})
    }

    changeFavoriteState(artist){
        const { auth, dispatch } = this.props
        let flag = false
        let favorites = artist.festivalArtistFavorite
        let favorite = {}
        for(var i = 0 ; i < favorites.length ; i++){
            if(favorites[i].user == auth.userId){
                favorite = favorites[i]
                flag = true
                break;
            }
        }

        let active
        if(JSON.stringify(favorite) == JSON.stringify({})){
            active = true
        }else{
            active = favorite.active ? false : true
        }

        let body = {           
            festivalArtistId: artist.id,
            user: auth.userId,
            active: active
        }

        if(flag){
            dispatch(updateFestivalArtistFavorite(favorite.id, body))
        }else{
            dispatch(createFestivalArtistFavorite(body))
        }

    }    

    myFavoriteState(favorites){
        const { curUser } = this.props
        let flag = false
        for(var i = 0 ; i < favorites.length ; i++){
          if(favorites[i].user == curUser && favorites[i].active == true){
            flag = true
            break
          }
        }
        return flag
    }

    checkMyScheduleState(schedules){
        const { auth } = this.props
        let flag = false
        for(var i = 0 ; i < schedules.length ; i++){
            if(schedules[i].user == auth.userId && schedules[i].active){
                flag = true
                break
            }
        }
        return flag
    }

    changeFestivalMySchedule(data){
        const { auth, dispatch } = this.props
        let mySchedule = {}
        for(var i = 0 ; i < data.festivalUserSchedules.length ; i++){
            if(auth.userId == data.festivalUserSchedules[i].user){
                mySchedule = data.festivalUserSchedules[i]
                break
            }
        }

        let body = {
            festivalArtistSetTime: data.id,
            user: auth.userId
        }

        if(JSON.stringify(mySchedule) == JSON.stringify({})){
            dispatch(createFestivalUserSchedule(body))
        }else {
            if(mySchedule.active) body.active = false
            else body.active = true
            // console.log(body, mySchedule.id)
            dispatch(updateFestivalUserSchedule(mySchedule.id, body))
        }

    }

    getDate(dateStr){
        let date = new Date(dateStr).toDateString()
        return date
    }

    getTimeStr(start, end){
        let startDate = new Date(start)
        let startH, startMin, startStr = ""
        startH = startDate.getHours()
        startMin = startDate.getMinutes()

        if(startH > 12) startStr += startH - 12
        else startStr += startH

        startStr += ":"

        if(startMin < 10) startStr += "0" + startMin
        else startStr += startMin

        startStr += " "

        if(startH < 12) startStr += "am"
        else startStr += "pm"

        let endDate = new Date(end)
        let endH, endMin, endStr = ""
        endH = endDate.getHours()
        endMin = endDate.getMinutes()

        if(endH > 12) endStr += endH - 12
        else endStr += endH

        endStr += ":"

        if(endMin < 10) endStr += "0" + endMin
        else endStr += endMin

        endStr += " "

        if(endH < 12) endStr += "am"
        else endStr += "pm"

        return startStr + " - " + endStr
    }

    renderTopView(data){
        return (
            data.artistBackgroundPic ?
            <Image style={styles.headerView} source={{uri: data.artistBackgroundPic}} >
                <View style={{paddingTop:30}} />
                <View style={styles.header}>
                    <View style={{width:'15%', paddingLeft:15}}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigator.pop()
                        }}>
                            <Ionicons style={{color:'#fff'}} name={'ios-arrow-round-back-outline'} size={40} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{width:'70%', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:'white', fontSize:17, fontWeight:'bold'}}>Profile</Text>
                        
                    </View>
                    <View style={{width:'15%'}}>
                    </View>
                </View>
                <View style={{width:'100%', alignItems:'center', paddingTop: 15}}>
                    <View style={{width:70, height:70, alignItems:'center', justifyContent:'center'}}>
                    {
                        data.artistProfilePic ?
                        <Image style={{width: 70, height: 70, borderRadius: 35}} source={{uri: data.artistProfilePic}} />
                        :
                        <Image style={{width: 70, height: 70, borderRadius: 35}} source={require('../images/profile.png')} />
                    }
                        <TouchableOpacity style={{
                            position:'absolute',
                            right: -5,
                            bottom: -5,
                            backgroundColor:'transparent'
                            }}
                            onPress={() => {
                                this.changeFavoriteState(data)
                            }}
                            >
                            {
                                this.myFavoriteState(data.festivalArtistFavorite) ?
                                    <Ionicons style={{color:'#36d489'}} name={'ios-checkmark-circle-outline'} size={30} />
                                :
                                    <Ionicons style={{color:'#44a3ff'}} name={'ios-add-circle-outline'} size={30} />                          
                            }
                            
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <View style={{width:'100%', alignItems:'center', justifyContent:'center', paddingTop: 15}}>
                    <Text style={{color:'white', fontSize:17, fontWeight:'bold'}}>{data.artistName}</Text>
                </View>   
            </Image>
            : 
            <View style={[styles.headerView, {backgroundColor:'#434242'}]}>
                <View style={{paddingTop:30}} />
                <View style={styles.header}>
                    <View style={{width:'15%', paddingLeft:15}}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigator.pop()
                        }}>
                            <Ionicons style={{color:'#fff'}} name={'ios-arrow-round-back-outline'} size={40} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{width:'70%', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:'white', fontSize:17, fontWeight:'bold'}}>Profile</Text>
                        
                    </View>
                    <View style={{width:'15%'}}>
                    </View>
                </View>
                <View style={{width:'100%', alignItems:'center', paddingTop: 15}}>
                    <View style={{width:70, height:70, alignItems:'center', justifyContent:'center'}}>
                    {
                        data.artistProfilePic ?
                        <Image style={{width: 70, height: 70, borderRadius: 35}} source={{uri: data.artistProfilePic}} />
                        :
                        <Image style={{width: 70, height: 70, borderRadius: 35}} source={require('../images/profile.png')} />
                    }
                        <TouchableOpacity style={{
                            position:'absolute',
                            right: -5,
                            bottom: -5,
                            backgroundColor:'transparent'
                            }}
                            onPress={() => {

                            }}
                            >
                            <Ionicons style={{color:'#44a3ff'}} name={'ios-add-circle-outline'} size={30} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <View style={{width:'100%', alignItems:'center', justifyContent:'center', paddingTop: 15}}>
                    <Text style={{color:'white', fontSize:17, fontWeight:'bold'}}>{data.artistName}</Text>
                </View>   
            </View>
        )
        
    }

    renderBio(){
        const { data } = this.props
        return (
            <View style={{backgroundColor:'white', padding: 14, width:'100%', height: deviceHeight - 255}}>
                <ScrollView 
                    ref={ref => this.scroll = ref}
                    horizontal={false}
                    style={{backgroundColor:'transparent', height: '100%'}}
                    >
                    <Text style={{
                        fontSize: 15,
                        color:'#929292'
                    }}>{data.artistBio}</Text>

                </ScrollView>
            </View>
        )
    }

    renderSetTimeRow(data, id){
        // console.log(data)
        return (
            <TouchableOpacity style={{ paddingVertical: 5}}>
                <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Text style={{color:'#8c8c8c', fontSize: 18, fontWeight:'bold'}}>{this.getDate(data.startDateTime)}</Text>
                    <View style={{paddingLeft:15}} />
                    <TouchableOpacity onPress={() => {
                        this.changeFestivalMySchedule(data)
                    }}>
                    {
                        this.checkMyScheduleState(data.festivalUserSchedules) ?
                        <Ionicons style={{color:'#36d489'}} name={'ios-checkmark-circle-outline'} size={22} />
                        :
                        <Ionicons style={{color:'#44a3ff'}} name={'ios-add-circle-outline'} size={22} />
                    }
                    </TouchableOpacity>
                </View>
                <Text style={{color:'#8c8c8c', fontSize: 16}}>{data.festivalStageId.stageName}</Text>
                <Text style={{color:'#8c8c8c', fontSize: 14}}>{this.getTimeStr(data.startDateTime, data.endDateTime)}</Text>
            </TouchableOpacity>
        )
    }

    renderSetTimes(festivalArtistSetTimes){
        // console.log(festivalArtistSetTimes)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 })
        ds = ds.cloneWithRows(festivalArtistSetTimes)

        return (
            <View style={{backgroundColor:'white', padding: 14, width:'100%', height: deviceHeight - 300}}>
                <ListView 
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    dataSource={ds}
                    renderRow={(rowData, sectionId, rowId) => {
                        return this.renderSetTimeRow(rowData, rowId)
                    }}        
                />
            </View>
        )
    }

    render() {
        const { festival } = this.props
        return (
            <View style={{ flex: 1 }}>
                {
                    this.renderTopView(this.state.artist)                    
                }
                <View style={{width:'100%', height: 45, backgroundColor:'#030303', flexDirection:'row'}}>
                    <View style={{width:'25%'}}/>
                    
                    <View style={{width:'25%', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => {
                            this.setState({btnIdx: 1})
                        }}>
                            <Text style={[{fontSize:17, color:'#fff'}, this.state.btnIdx == 1 && {fontWeight:'bold'}]}>Biography</Text>
                        </TouchableOpacity>
                        {
                            this.state.btnIdx == 1 &&
                            <View style={{
                                width:19,
                                height:18,
                                position:'absolute',
                                bottom: 0,
                                backgroundColor:'transparent'                               
                            }}>
                                <Ionicons style={{color:'#fff'}} name={'md-arrow-dropup'} size={30} />
                            </View>
                        }    
                    </View>
                    
                    <View style={{width:'25%', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => {
                            this.setState({btnIdx: 2})
                        }}>
                            <Text style={[{fontSize:17, color:'#fff'}, this.state.btnIdx == 2 && {fontWeight:'bold'}]}>Set Times</Text>
                        </TouchableOpacity>
                        {
                            this.state.btnIdx == 2 &&
                            <View style={{
                                width:19,
                                height:18,
                                position:'absolute',
                                bottom: 0,
                                backgroundColor:'transparent'                               
                            }}>
                                <Ionicons style={{color:'#fff'}} name={'md-arrow-dropup'} size={30} />
                            </View>
                        }  
                    </View>
                    <View style={{width:'25%'}}/>                
                </View> 
                {
                    this.state.btnIdx == 1 ?
                    this.renderBio()
                    : 
                    this.renderSetTimes(festival.festivalArtistSetTimes)
                }
            </View>
        );
      }
    }
    
    const styles = StyleSheet.create({
        headerView: {           
            width:'100%',
            height: 210,
            backgroundColor:'transparent'
            // backgroundColor:'#434242'
        },
        header: {
            flexDirection:'row',
            // paddingTop: 32,
            width:'100%',
            height: 35,
            backgroundColor:'transparent',
            alignItems:'center',
            justifyContent:'center'
        }
    });
    
    const mapStateToProps = state => ({ app: state.app, auth: state.auth, festival: state.festival });
    
    export default connect(mapStateToProps)(ArtistDetail);