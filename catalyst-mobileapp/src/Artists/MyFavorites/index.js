import React from 'react';
import { 
    ScrollView, 
    Image, 
    StyleSheet, 
    View, 
    Text, 
    TouchableHighlight, 
    TouchableOpacity,
    RefreshControl, 
    Dimensions,
    ListView 
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';

var {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

class MyFavorites extends React.Component {

  componentDidMount() { 
    
  }

  onRefresh(){
    this.props.onRefresh()
  }

  renderSectionHeader(sectionData, category){
    return (
      <View style={{width: '100%', paddingHorizontal: 10, alignItems:'flex-start', backgroundColor:'transparent'}}>
        <Text style={{fontSize: 17, color:'#fff'}}>
          {category}
        </Text>
      </View>
    )
  }

  renderRow(data, id){   
    return (
      this.props.gridState ?
        <View style={{backgroundColor:'transparent', flexDirection:'row', width:'100%'}}>
          {
            data.map((item, i) => {
              return (
                <View key={i} style={{width: deviceWidth / 2, height: deviceWidth / 2}}>
                  <TouchableHighlight  
                    underlayColor={'rgba(0, 0, 0, 0.4)'}
                    onPress={() => {
                      this.props.goToDetailScreen(item)
                    }}
                    >
                    {
                      item.artistProfilePic ?
                      <Image style={{width: deviceWidth / 2, height: deviceWidth /2}} source={{uri: item.artistProfilePic}} />
                      :
                      <Image style={{width: deviceWidth / 2, height: deviceWidth /2}} source={require('../images/profile.png')} />
                    }                  
                  </TouchableHighlight>
                  <View style={{                     
                    position:'absolute', 
                    bottom: 8,                     
                    zIndex:100
                    }}>
                    <View style={{
                      flexDirection:'row',
                      justifyContent:'center',
                      alignItems:'center',
                      width: '100%'}}>
                      <Text style={{width:'80%', paddingLeft: 10, textAlign:'left', fontSize: 17, color:'#fff'}}>{item.artistName}</Text>
                    
                      <TouchableOpacity style={{
                        width:'20%', 
                        alignItems:'flex-end', 
                        paddingRight: 10}}
                        onPress={() => {
                          this.props.changeFavoriteState(item)
                        }}
                      >
                        <Ionicons style={{color:'#36d489'}} name={'ios-checkmark-circle-outline'} size={30} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>
      :
        <View style={{flex: 1, paddingHorizontal: 10, backgroundColor:'transparent', flexDirection:'row', height: 83}}>
          <TouchableOpacity style={{width:'20%', justifyContent:'center', alignItems:'flex-start'}} onPress={() => {
            this.props.goToDetailScreen(data)
          }}>
          {
            data.artistProfilePic ?
            <Image style={{width: 55, height: 55, borderRadius: 27.5}} source={{uri: data.artistProfilePic}} />
            :
            <Image style={{width: 55, height: 55, borderRadius: 27.5}} source={require('../images/profile.png')} />
          }
            
          </TouchableOpacity>
          <View style={{width:'80%', flexDirection:'row', borderBottomColor:'#dbdbdb', borderBottomWidth:1}}>
            <TouchableOpacity style={{width: '90%', justifyContent:'center'}} onPress={() => {
              this.props.goToDetailScreen(data)
            }}>
              <Text style={{fontSize: 17, color:'#fff'}}>{data.artistName}</Text>
              <Text style={{fontSize: 13, color:'#8b8b8c'}} numberOfLines={2} ellipsizeMode={'tail'} >{data.artistBio}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '10%', justifyContent:'center', alignItems:'flex-end'}} onPress={() => {
                this.props.changeFavoriteState(data)
              }}>
                <Ionicons style={{color:'#36d489'}} name={'ios-checkmark-circle-outline'} size={30} />              
            </TouchableOpacity>
          </View>
        </View>
    )
  }

  renderListView(){
    var { app } = this.props;

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {return r1 != r2},
      sectionHeaderHasChanged: (s1, s2) => {return s1 != s2}
    })

    ds = ds.cloneWithRowsAndSections(this.props.listData)

    return (
      <ListView 
        refreshControl={
          <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={ () => {this.onRefresh()}}
              tintColor="#fff"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#000"
          />
        }
        removeClippedSubviews={false}
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        dataSource={ds}
        renderRow={(rowData, sectionId, rowId) => {
          return this.renderRow(rowData, rowId)
        }}
        renderSectionHeader={(sectionData, category) => {
          return this.renderSectionHeader(sectionData, category)
        }}
      />
    )
  }


  renderGridView(){
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 })
    ds = ds.cloneWithRows(this.props.listData)

    return (
      <ListView 
        refreshControl={
          <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={ () => {this.onRefresh()}}
              tintColor="#fff"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#000"
          />
        }
        removeClippedSubviews={false}
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        dataSource={ds}
        renderRow={(rowData, sectionId, rowId) => {
          return this.renderRow(rowData, rowId)
        }}        
      />
    )
  }
  
  render () {  
    const { listData } = this.props
    return (
      <View style={{flex: 1}}>
        {          
          this.props.gridState ? 
            (
              listData.length == 0 ?
                <Text style={{paddingTop:10, color:'white', fontSize: 17, width:'100%', textAlign:'center'}}>No result data</Text>
              : 
                this.renderGridView()
            )         
          
          : (  
              JSON.stringify(listData) === JSON.stringify({}) ?
              <Text style={{paddingTop:10, color:'white', fontSize: 17, width:'100%', textAlign:'center'}}>No result data</Text>
              :
                this.renderListView()
            )
        }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  
});

const mapStateToProps = state => ({ app: state.app });

export default connect(mapStateToProps)(MyFavorites);