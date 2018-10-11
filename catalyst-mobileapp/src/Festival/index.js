import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Linking,
    ScrollView,
    Dimensions,
    WebView
  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SafariView from 'react-native-safari-view';
import { connect } from 'react-redux';

import Lineup from './views/Lineup';
import Prohibited from './views/Prohibited';
import Map from './views/Map';
import Friends from './views/Friends';
import Photos from './views/Photos';
import Music from '../components/views/Music';
import Artists from '../Artists'
import { setStyle as setStatusBarStyle } from '../actions/StatusBarActions';





class Festival extends React.Component {  
  getComponents(tour, navigator){
    const { dispatch, loading, app } = this.props  
    if(tour.linkType == 'external'){     
          let url = tour.link          
          return (<WebView
            source={{uri: url}}
            style={{marginTop: 64}}
          />)
    }else{
        var rollingLoudInfoExist = app.settings.rollingLoudInfo != null;
        switch(tour.link){
            case 'FindMyFriend':
                return (
                    <Friends navigator={navigator} />
                )
                break;
            case 'Listen':
                return (
                    <Music  navigator={navigator} navHide />
                )
                break;
            case 'Lineup':
                if(rollingLoudInfoExist){
                  return (
                      <Lineup  navigator={navigator} navHide />
                  ) 
                }

                break;
            case 'Map':
               if(rollingLoudInfoExist){
                  return (
                      <Map  navigator={navigator} navHide />
                  )
               }
              break;
            case 'ArtistLineup':
               return (
                 <Artists navigator={navigator} navHide/>
               )
              break;
        }
    }
  }

  render() {
    const { tour, isLoading, isRefreshing, tabLabel, navigator, app } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {
            this.getComponents(tour, navigator)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbarBorderBottom: {
    position: 'absolute',
    top: 64,
    width: 375,
    height: 2,
    backgroundColor: 'rgba(255,255,255,.12)'
  },
  heroImageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: 'white',
  },
  heroByline: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    color: 'white',
  },
  buzznogLogo: {
    alignSelf: 'center',
  },
});

const mapStateToProps = state => ({ app: state.app });

export default connect(mapStateToProps)(Festival);
