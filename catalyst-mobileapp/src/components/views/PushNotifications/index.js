import React from 'react';
import { View, ScrollView, Text, Switch, StyleSheet, PushNotificationIOS } from 'react-native';


import { connect } from 'react-redux';

import { NavigationBar } from '../../molecules';

import { create, destroy } from '../../../actions/PushNotificationTokenActions';

import colors from '../../../config/colors';

import Platform from 'Platform';

// This page is for inside of settings

var PushNotifications = React.createClass({

  getInitialState: function() {
    return {
      allEnabled: false
    }
  },

  componentWillMount: function() {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('register', this._onRegisterHandler);

      PushNotificationIOS.checkPermissions(permissions => {
        var enabled = Object.values(permissions).some(value => value);

        this.setState({ enabled });
      });
    }
    else {
      // GcmAndroid.addEventListener('register', this._onRegisterHandler);
      // //Not Implemented Yet checkPermissions
      // GcmAndroid.checkPermissions(permissions => {
      //   var enabled = Object.values(permissions).some(value => value);
      //   this.setState({ enabled });
      // });
    }
  },

  componentWillUnmount: function () {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeEventListener('register', this._onRegisterHandler);
    }
    else {
      //GcmAndroid.removeEventListener('register', this._onRegisterHandler);
    }
  },

  _onRegisterHandler: function (token) {
    this.props.dispatch(create(token));
  },

  _onSwitchValueChangeHandler: function (enabled) {
    this.setState({enabled});
    if (Platform.OS === 'ios') {
      if (enabled) {
        PushNotificationIOS.requestPermissions();
      } else {
        this.props.dispatch(destroy());
        PushNotificationIOS.abandonPermissions();
      }
    }
    else {
      /*if (enabled) {
        GcmAndroid.requestPermissions();
      } else {
        this.props.dispatch(destroy());
        GcmAndroid.abandonPermissions();
      }*/
    }
  },

  render: function() {
    var { navigator, app } = this.props;

    return(
      <View style={{ flex: 1, backgroundColor: colors.grayDarkest }}>
        <NavigationBar
          navigator={navigator}
          title="Notifications"
        />
        <ScrollView scrollsToTop={false}>
          <View style={[styles.listViewContainer, {backgroundColor: colors.grayDarker} ]}>
            <View style={styles.listViewCellLast}>
              <Text style={styles.listViewCellText}>All Notifications</Text>
              <Switch
                tintColor={'rgba(255,255,255,.12)'}
                onTintColor={app.styles.primaryColor}
                onValueChange={this._onSwitchValueChangeHandler}
                value={this.state.enabled}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  listViewContainer: {
    flex: 1,
    marginTop: 32,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  listViewTitle: {
    padding: 16,
    fontWeight: '500',
    letterSpacing: 1,
    backgroundColor: 'black',
    color: 'rgba(255,255,255,0.32)'
  },
  listViewCell: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingRight: 16,
    backgroundColor: 'transparent',
  },
  listViewCellLast: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingRight: 16,
  },
  listViewCellText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  listViewCellTextValue: {
    fontSize: 19,
    color: '#4d4d4d',
  }
});

const mapStateToProps = state => ({ pushNotificationToken: state.pushNotificationToken, app: state.app })

module.exports = connect(mapStateToProps)(PushNotifications);
