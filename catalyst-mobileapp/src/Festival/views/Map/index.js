import React, { Component } from 'react';
import PhotoView from 'react-native-photo-view';
import { View, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux';

import { NavigationBar } from '../../../components/molecules';
import SiteMap from './sitemap.jpg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Map extends Component {
  render() {
    const { navigator, app } = this.props;
    const mapImage = app.settings.rollingLoudInfo.mapURL;

    return (
      <View style={{flex: 1, backgroundColor: 'black', flexDirection: 'column'}}>
        <NavigationBar
          navigator={navigator}
          title="Map"
          style={{
            flex: 0,
          }}
        />
        <PhotoView
          source={{ uri: mapImage }}
          resizeMode='contain'
          maximumZoomScale={10}
          androidScaleType="fitCenter"
          style={{
            borderWidth: 0,
            flex: 2,
            alignSelf: 'stretch'
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  app: state.app
});

export default connect(mapStateToProps)(Map);