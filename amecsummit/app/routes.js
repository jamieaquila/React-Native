import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst} from 'react-native-router-flux';

import styles from './styles/NavigationContainerStyle'
import NavItems from './components/NavItems'

import TabView from './components/TabView';
import TabIcon from './components/TabIcon';

import speakers from './containers/summit/speakers';
import sponsors from './containers/summit/sponsors';

import accomodation from './containers/more/accomodation';
import bangkok from './containers/more/bangkok';
import tips from './containers/more/tips';

import speakers1 from './containers/agenda/speakers';

class Routes extends Component {
  render() {
    return (
      <Router>
        <Scene key='root'>
          <Scene key="tabbar" type={ActionConst.RESET} tabs={true} tabBarStyle={styles.tabBar}>
            <Scene key="more_tab" type={ActionConst.REFRESH} initial={true} title="Welcome" icon={TabIcon}>
              <Scene key="Welcome" component={TabView} hideNavBar={true} title="Welcome"/>
              <Scene key="accomodation" hideNavBar={true} panHandlers={null} component={accomodation}/>
              <Scene key="bangkok" hideNavBar={true} panHandlers={null} component={bangkok}/>
              <Scene key="tips" hideNavBar={true} panHandlers={null} component={tips}/>
            </Scene>
            <Scene key="agenda_tab" type={ActionConst.REFRESH} title="Agenda" icon={TabIcon}>
              <Scene key="Agenda" component={TabView} hideNavBar={true} title="Agenda"/>
              <Scene key="speakers1" hideNavBar={true} panHandlers={null} component={speakers1}/>
            </Scene>
            <Scene key="summit_tab" type={ActionConst.REFRESH} title="Summit" icon={TabIcon}>
              <Scene key="Summit" component={TabView} hideNavBar={true} title="Summit"/>
              <Scene key="speakers" hideNavBar={true} panHandlers={null} component={speakers}/>
              <Scene key="sponsors" hideNavBar={true} panHandlers={null} component={sponsors}/>
            </Scene>
            <Scene key="Map" type={ActionConst.REFRESH} component={TabView} hideNavBar={true} title="Map" icon={TabIcon}/>
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default Routes;
