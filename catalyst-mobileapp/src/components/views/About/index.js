import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Linking, TouchableHighlight, InteractionManager } from 'react-native';

import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import CodePush from "react-native-code-push";

// helpers
import { dateFormat, truncateMiddle } from '../../../helpers'

// first party components
import { NavigationBar } from '../../molecules';

import colors from '../../../config/colors';

class About extends React.Component {

  state = {
    codePushLabel: 'Unknown'
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      CodePush.getUpdateMetadata().then(update => {
        this.setState({ codePushLabel: update.description || 'None' });
      })
      .catch(err => {
        // console.log(err)
      });
    });
  }

  render() {
    const { app, device, navigator, pushNotificationToken } = this.props;

    return(
      <View style={{ flex: 1, backgroundColor: colors.grayDarkest }}>
        <NavigationBar navigator={navigator} title="About" />
        <ScrollView scrollsToTop={false}>
          <View style={{ padding: 16 }}>
            <Text style={styles.listViewTitle}>DEVICE</Text>
          </View>
          <View style={[styles.listViewContainer, {backgroundColor: colors.grayDarker} ]}>
            <View style={styles.listViewCell}>
              <Text style={styles.listViewCellText}>Binary Version</Text>
              <Text style={styles.listViewCellTextValue}>{DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})</Text>
            </View>
            <View style={styles.listViewCell}>
              <Text style={styles.listViewCellText}>Code Push Version</Text>
              <Text style={styles.listViewCellTextValue}>{this.state.codePushLabel}</Text>
            </View>
            <View style={styles.listViewCell}>
              <Text style={styles.listViewCellText}>Device UUID</Text>
              <Text style={[styles.listViewCellTextValue, { fontSize: 8 }]}>{device.item.uuid}</Text>
            </View>
            <View style={styles.listViewCell}>
              <Text style={styles.listViewCellText}>APNS Token</Text>
              <Text style={[styles.listViewCellTextValue, { fontSize: 8 }]}>{pushNotificationToken.item ? truncateMiddle(pushNotificationToken.item.pnToken, 5, 5, "...") : "Unknown"}</Text>
            </View>
          </View>

          <View style={{ padding: 16 }}>
            <Text style={styles.listViewTitle}>GENERAL</Text>
          </View>
          <View style={[styles.listViewContainer, {backgroundColor: colors.grayDarker} ]}>
            {(app.settings && app.settings.privacyPolicyLink) && <TouchableHighlight activeOpacity={1} underlayColor='rgba(255,255,255,0.08)' onPress={() => Linking.openURL(app.settings.privacyPolicyLink)}>
              <View style={styles.listViewCell}>
                <Text style={styles.listViewCellText}>Privacy Policy</Text>
              </View>
            </TouchableHighlight>}
            {(app.settings && app.settings.tosLink) && <TouchableHighlight activeOpacity={1} underlayColor='rgba(255,255,255,0.08)' onPress={() => Linking.openURL(app.settings.tosLink)}>
              <View style={styles.listViewCell}>
                <Text style={styles.listViewCellText}>Terms of Service</Text>
              </View>
            </TouchableHighlight>}
          </View>
          <View style={styles.copyrightContainer}>
            <Image style={{ marginTop: 40, marginBottom: 8, tintColor: 'rgba(255,255,255,.2)' }} source={require('./logomark.png')}/>
            <Text style={{ color: 'rgba(255,255,255,.2)' }}>© {dateFormat('yyyy')} Buzznog</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  listViewContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  listViewTitle: {
    fontWeight: '500',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.32)'
  },
  listViewCell: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  listViewCellText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  listViewCellTextValue: {
    fontSize: 19,
    color: '#4d4d4d',
  },
  copyrightContainer: {
    alignItems: 'center'
  }
});

var mapStateToProps = state => ({ app: state.app, device: state.device, pushNotificationToken: state.pushNotificationToken });

export default connect(mapStateToProps)(About);
