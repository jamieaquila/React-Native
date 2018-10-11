import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';


class MusicVideos extends React.Component {
  render() {
    return(
      <View style={styles.video}>
        <Image style={{justifyContent: 'center', alignItems: 'center', height: 200, resizeMode: 'cover', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)'}} source={{uri: 'http://www.huhmagazine.co.uk/images/uploaded/drake_energy_00.jpg'}} source={{uri: 'https://i.ytimg.com/vi/_WamkRSDeD8/maxresdefault.jpg'}}>
          <TouchableOpacity style={{alignSelf: 'center', padding: 16, backgroundColor: 'transparent'}}>
            <View style={{justifyContent: 'center', alignItems: 'center', width: 64, height: 64, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 4, borderColor: '#46ABE7', borderRadius: 48}}>
              <Image style={{marginRight: -5}} source={require('./play.png')}/>
            </View>
          </TouchableOpacity>
        </Image>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width,
    height: 200,
    marginBottom: 8,
    backgroundColor: '#A39061',
  }
});

default export MusicVideos;