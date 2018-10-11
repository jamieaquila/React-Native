import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { connect } from 'react-redux';

import BuyOrRedeemAlbumPass from './BuyOrRedeemAlbumPass';

class AlbumAndTrackUnlock extends React.Component {

  renderScene(route, navigator) {
    var Component = route.component;

    return <Component modalNavigator={this.props.navigator} navigator={navigator} route={route} {...route.passProps} />;
  }

  render () {
    var { app, album, track, auth } = this.props;

    return (
      <View style={{flex: 1}}>
        <Navigator
          ref="navigator"
          renderScene={this.renderScene.bind(this)}
          initialRoute={{ component: BuyOrRedeemAlbumPass, passProps: { album, track } }}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    height: Dimensions.get('window').height + 200,
    top: -120,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: -120,
    right:0,
    left:0,
    bottom:0,
    resizeMode: 'contain'
  }
});

const mapStateToProps = state => ({ app: state.app, auth: state.auth })

module.exports = connect(mapStateToProps)(AlbumAndTrackUnlock);
