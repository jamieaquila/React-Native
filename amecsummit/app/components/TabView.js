import React from 'react';
import {PropTypes} from "react";
import {StyleSheet, Text, View} from "react-native";
import { Actions } from 'react-native-router-flux';

import Agenda from '../containers/agenda/agenda';
import Summit from '../containers/summit/summit';
import Map from '../containers/map';
import More from '../containers/more/more';

const contextTypes = {
  drawer: React.PropTypes.object,
};

const propTypes = {
  name: PropTypes.string,
  sceneStyle: View.propTypes.style,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const TabView = (props, context) => {
  const drawer = context.drawer;
  return (
    props.title == 'Summit' ? <Summit/> :
    props.title == 'Map' ? <Map/> :
    props.title == 'Welcome' ? <More/> :
    props.title == 'Agenda' ? <Agenda/> : null
  );
};

TabView.contextTypes = contextTypes;
TabView.propTypes = propTypes;

export default TabView;
