import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { connect } from 'react-redux';

import Camera from './Camera';

const FLOAT_FROM_BOTTOM_NO_GESTURE = () => ({...Navigator.SceneConfigs.FloatFromBottom });

class RedeemCode extends React.Component {

  renderScene(route, navigator) {
    var Component = route.component;

    return <Component modalNavigator={this.props.navigator} navigator={navigator} route={route} {...route.passProps} />;
  }

  render () {
    var { app, album } = this.props;

    return (
      <View style={{flex: 1}}>
        <Navigator
          onWillFocus={this.onWillFocus}
          ref="navigator"
          renderScene={this.renderScene.bind(this)}
          configureScene={FLOAT_FROM_BOTTOM_NO_GESTURE}
          initialRoute={{ component: Camera, passProps: { album } }}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: -120,
    right:0,
    left:0,
    bottom:0,
    resizeMode: 'contain'
  }
});

const mapStateToProps = state => ({ app: state.app })

module.exports = connect(mapStateToProps)(RedeemCode);
