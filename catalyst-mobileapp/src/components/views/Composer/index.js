import React from 'react';
import { View } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import PostComposer from './PostComposer';
import Camera from './Camera';

class Composer extends React.Component {

  static propTypes = {
    attachmentRoute: React.PropTypes.object
  }

  configureScene = (route, routeStack) => ({
    ...Navigator.SceneConfigs.FloatFromBottom,
    gestures: null,
  });

  renderScene(route, navigator) {
    var Component = route.component;

    return <Component navigator={navigator} route={route} {...route.passProps} />;
  }

  render () {
    var initialRouteStack = [{ component: PostComposer }];
    if (this.props.attachmentRoute) initialRouteStack.push(this.props.attachmentRoute);

    return (
      <Navigator
        sceneStyle={{ backgroundColor:'white' }}
        ref="navigator"
        renderScene={this.renderScene}
        configureScene={this.configureScene}
        initialRouteStack={initialRouteStack}
        initialRoute={initialRouteStack[initialRouteStack.length]}
      />
    );
  }
}

export default Composer;
