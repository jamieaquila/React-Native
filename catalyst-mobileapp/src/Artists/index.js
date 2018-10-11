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
    RefreshControl
  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SafariView from 'react-native-safari-view';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'

import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollableTabBar } from '../components/atoms';
import { InfiniteScrollView } from '../components/atoms';

import {
    getFestivalArtist,
    createFestivalArtistFavorite,
    updateFestivalArtistFavorite
} from '../actions/FestivalActions'

import Headliners from './Headliners'
import AZArtists from './AZArtists'
import MyFavorites from './MyFavorites'
import ArtistDetail from './ArtistDetail'

var {
    width: deviceWidth,
    height: deviceHeight
} = Dimensions.get('window');

class Artists extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 1,
            gridState: true,
            listData: [],
        }
    }

    componentDidMount() {  
        const { dispatch } = this.props  
        dispatch(getFestivalArtist())
    }

    componentWillReceiveProps(nextProps){  
        if( nextProps.festival.festivalArtists.length > 0){          
            this.changeListData(nextProps.festival.festivalArtists)
        }
    }

    searchArtists(text){
        const { festival } = this.props
        const data = festival.festivalArtists.filter(x => x.artistName.toLowerCase().includes(text.toLowerCase()))
        this.changeListData(data)
    }  

    changeListData(data){
        const { auth } = this.props
        let realData = []
        if(this.state.selectedTab == 1){
            for(var i = 0 ; i < data.length; i++){
                if(data[i].festivalHeadliner){
                    realData.push(data[i])
                }
            }
        }else if(this.state.selectedTab == 2){            
            realData = data.slice()
        }else if(this.state.selectedTab == 3){            
            for(var i = 0 ; i < data.length ;  i++){
                let flag = false
                for(var j = 0 ; j < data[i].festivalArtistFavorite.length ; j++){
                    if(auth.userId == data[i].festivalArtistFavorite[j].user && data[i].festivalArtistFavorite[j].active){
                        flag = true
                        break
                    }                    
                }
                if(flag) realData.push(data[i])                
            }
        }

        if(this.state.gridState) this.sortGridData(realData)        
        else this.sortListData(realData) 
    }

    sortListData(data){        
        data.sort((a, b) => {
            const nameA = a.artistName.toUpperCase()
            const nameB = b.artistName.toUpperCase()
            if(nameA > nameB){
                return 1
            }else if(nameA == nameB) {
                return 0
            }else{
                return -1
            }
        })
        let listData = {}
        for(var i = 0 ; i < data.length; i++){
            if(Object.keys(listData).length == 0){
                listData[data[i].artistName.substring(0, 1).toUpperCase()] = []
                listData[data[i].artistName.substring(0, 1).toUpperCase()].push(data[i])
            }else{
                if(this.existingKey(listData, data[i].artistName.substring(0, 1).toUpperCase())){
                    listData[data[i].artistName.substring(0, 1).toUpperCase()].push(data[i])
                }else{
                    listData[data[i].artistName.substring(0, 1).toUpperCase()] = []
                    listData[data[i].artistName.substring(0, 1).toUpperCase()].push(data[i])
                }
            }
        }
        this.setState({listData})
    }

    existingKey(list, key1){
        let flag = false
        for(let key in list){
            if(key == key1){
                flag = true
                break
            }
        }
        return flag
    }

    sortGridData(data){
        data.sort((a, b) => {
            const nameA = a.artistName.toUpperCase()
            const nameB = b.artistName.toUpperCase()
            if(nameA > nameB){
                return 1
            }else if(nameA == nameB) {
                return 0
            }else{
                return -1
            }
        })

        let listData = this.chunkArray(data, 2)
        this.setState({listData})
    }

    chunkArray(array, size){
        return array.reduce((acc, val) => {
            if(acc.length === 0) acc.push([])
            const last = acc[acc.length - 1]
            if(last.length < size)
                last.push(val)
            else
                acc.push([val])
            return acc
        }, [])
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

    onRefresh(idx){
        const { dispatch } = this.props
        dispatch(getFestivalArtist())
    }

    goToDetailScreen(data){
        const { navigator, auth, dispatch } = this.props
        navigator.push({
            component: ArtistDetail,
            passProps: { 
                curUser: auth.userId,
                dispatch,
                data, 
                navigator
            }
          });
    }

    render() {
        const { navigator, app, festival, dispatch, auth } = this.props;
        // console.log(auth)
        return (
            <View style={{ flex: 1 }}>
                <View style={{paddingTop: 64}} />
                <View style={{
                    width: '100%',  
                    flexDirection:'row'}}
                    >
                    <TouchableHighlight
                        onPress={ () =>{
                            let selectedTab = this.state.selectedTab                           
                            if(selectedTab != 1){
                                this.search.clearText()
                                this.setState({
                                    selectedTab: 1,
                                }, () => this.changeListData(festival.festivalArtists))
                            }
                            
                        }}
                        style={[styles.tabBtn, this.state.selectedTab == 1 && {borderBottomColor:'#244567', borderBottomWidth: 2}]}
                        underlayColor={'transparent'}
                        >
                        <Text style={[{fontSize:12, color:'white'}]}>HEADLINERS</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={ () =>{
                            let selectedTab = this.state.selectedTab
                            if(selectedTab != 2){
                                this.search.clearText()
                                this.setState({
                                    selectedTab: 2
                                }, () => {
                                    this.changeListData(festival.festivalArtists)
                                })
                            }
                            
                        }}
                        style={[styles.tabBtn, this.state.selectedTab == 2 && {borderBottomColor:'#244567', borderBottomWidth: 2}]}
                        underlayColor={'transparent'}
                        >
                        <Text style={[{fontSize:12, color:'white'}]}>A - Z</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={ () =>{
                            let selectedTab = this.state.selectedTab
                            if(selectedTab != 3){
                                this.search.clearText()
                                this.setState({
                                    selectedTab: 3,
                                }, () => {
                                    this.changeListData(festival.festivalArtists)
                                })
                            }
                            
                        }}
                        style={[styles.tabBtn, this.state.selectedTab == 3 && {borderBottomColor:'#244567', borderBottomWidth: 2}]}
                        underlayColor={'transparent'}
                        >
                        <Text style={[{fontSize:12, color:'white'}]}>MY FAVORITES</Text>
                    </TouchableHighlight>
                </View>   
                <View style={{width:'100%', flexDirection:'row', paddingTop: 10}}>
                    <SearchBar 
                        ref={search => this.search = search}
                        lightTheme                   
                        containerStyle={{                            
                            width:'90%', 
                            backgroundColor:'#dedde2'
                        }}
                        inputStyle={{
                            backgroundColor: '#ffffff',
                            textAlign: 'center'
                        }}
                        onChangeText={(text) => {
                            this.searchArtists(text)
                        }}
                        placeholder="Search for Artists"
                    />       
                    <TouchableOpacity style={{
                        width:'10%', 
                        alignItems:'center', 
                        justifyContent:'center', 
                        backgroundColor:'#dedde2'
                        }}
                        activeOpacity={0.9}
                        onPress={() => {                            
                            this.setState({gridState: !this.state.gridState}, () => {                                
                                this.changeListData(festival.festivalArtists)
                                
                            })
                        }}>
                        {
                            this.state.gridState ?
                            <Ionicons style={{color:'#fff'}} name={'ios-list-outline'} size={40} />
                            :
                            <Ionicons style={{color:'#fff'}} name={'md-grid'} size={35} />
                        }
                        
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor:'#18181a'}} />         
                {
                    this.state.selectedTab == 1 ?                    
                        <Headliners 
                            listData={this.state.listData}
                            refreshing={festival.isRefreshing}
                            onRefresh={() => this.onRefresh(this.state.selectedTab)}
                            goToDetailScreen={(data) => { this.goToDetailScreen(data) }}
                            gridState={this.state.gridState}
                            curUser={auth.userId}
                            changeFavoriteState={(artist) => {
                                this.changeFavoriteState(artist)
                            }}                            
                        /> 
                    : this.state.selectedTab == 2 ?
                        <AZArtists 
                            listData={this.state.listData}
                            refreshing={festival.isRefreshing}
                            onRefresh={() => this.onRefresh(this.state.selectedTab)}
                            goToDetailScreen={(data) => { this.goToDetailScreen(data) }}
                            gridState={this.state.gridState}
                            curUser={auth.userId}
                            changeFavoriteState={(artist) => {
                                this.changeFavoriteState(artist)
                            }}
                        />
                    : this.state.selectedTab == 3 &&
                        <MyFavorites 
                            listData={this.state.listData}
                            refreshing={festival.isRefreshing}
                            onRefresh={() => this.onRefresh(this.state.selectedTab)}
                            goToDetailScreen={(data) => { this.goToDetailScreen(data) }}
                            gridState={this.state.gridState}
                            curUser={auth.userId}
                            changeFavoriteState={(artist) => {
                                this.changeFavoriteState(artist)
                            }}
                        />
                }
            </View>
        );
      }
    }
    
    const styles = StyleSheet.create({
        tabBtn: {
            width:'33.33%',
            backgroundColor:'transparent',
            justifyContent:'center',
            alignItems:'center',
            paddingVertical: 10,
        }
    });
    
    const mapStateToProps = state => ({ app: state.app, auth: state.auth, festival: state.festival });
    
    export default connect(mapStateToProps)(Artists);