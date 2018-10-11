import React from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, TouchableHighlight, StyleSheet, Alert } from 'react-native';


import { connect } from 'react-redux';
import SafariView from 'react-native-safari-view';

import { colors } from '../../../config'

import { PushNotifications, About, Lightshow } from '../../views';

import { NavigationBar } from '../../molecules';

import { logout, unauthorized } from '../../../actions/AuthActions';
import { destroy as destroyAuthStrategy } from '../../../actions/AuthStrategyActions';
import { findMe } from '../../../actions/UserActions'
import { setStyle as setStatusBarStyle } from '../../../actions/StatusBarActions';

var Mailer = require('NativeModules').RNMail;
import DeviceInfo from 'react-native-device-info'; 

var Settings = React.createClass({

  componentDidMount: function() {
    this._logoutButtons = [{
      text: 'Log out',
      onPress: () => this._logout()
    }, {
      text: 'Cancel',
      style: 'cancel'
    }];
  },

  _promptFeebackMailer: function() {
    const { app } = this.props;

    Mailer.mail({
      subject: app.name + ' App Support ' + ' (' + DeviceInfo.getModel() + ' running ' + DeviceInfo.getVersion() + '(' + DeviceInfo.getBuildNumber() + '))',
      recipients: ['support@buzznog.com'],
      body: 'Tell us in a few lines what’s going on.',
      // attachment: {
      //   path: '',  // The absolute path of the file from which to read data.
      //   type: '',  // Mime Type: jpg, png, doc, ppt, html, pdf
      //   name: ''   // Optional: Custom filename for attachment
      // }
    }, (error, event) => {
        if(error) {
          Alert.alert('Error', 'Could not send mail. Please send a mail to support@buzznog.com');
        }
    });
  },

  _logout: function() {
    this.props.dispatch(logout());
    this.props.navigator.pop()
  },

  _destroyAuthStrategy: function (authStrategy) {
    this
      .props
      .dispatch(destroyAuthStrategy(authStrategy))
      .then(res => {
        if (res.logout) {
          this._logout();
        }
      })
      .catch(err => {
        // console.log('[error in destroying auth strategy]', err)
      });
  },

  openLink: function(url) {
    var { dispatch } = this.props;

    SafariView.show({ url });
    SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
    SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
  },

  render: function() {
    var { navigator, user, auth, app } = this.props;

    var twitterStrategy, facebookStrategy, instagramStrategy, youtubeStrategy;
    
    if (user && user.currentUser && user.currentUser.authStrategies) {
      twitterStrategy = user.currentUser.authStrategies.find(strategy => strategy.type === 'twitter' && strategy.status === 'connected');
      facebookStrategy = user.currentUser.authStrategies.find(strategy => strategy.type === 'facebook' && strategy.status === 'connected');
      instagramStrategy = user.currentUser.authStrategies.find(strategy => strategy.type === 'instagram' && strategy.status === 'connected');
      youtubeStrategy = user.currentUser.authStrategies.find(strategy => strategy.type === 'youtube' && strategy.status === 'connected');
    }
    
    return(
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <NavigationBar
          navigator={navigator}
          title={'Settings'}/>
        <ScrollView
          scrollsToTop={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={{ padding: 16 }}>
            <Text style={styles.listViewTitle}>SOCIAL NETWORKS</Text>
          </View>
          <View style={[styles.listViewContainer, {backgroundColor: colors.grayDarker} ]}>
            <View style={styles.listViewCell}>
              <View style={{width: 28, marginRight: 6}}>
                <Image
                  defaultSource={require('./facebook.png')}
                  source={require('./facebook.png')}/>
              </View>
              <Text style={styles.listViewCellText}>{(facebookStrategy && facebookStrategy.providerData) ? facebookStrategy.providerData.name : 'Facebook'}</Text>
              {facebookStrategy ?
                <TouchableOpacity onPress={() => this._destroyAuthStrategy(facebookStrategy)}>
                  <Text style={styles.listViewCellTextValue}>Disconnect</Text>
                </TouchableOpacity>
                : 
                <TouchableOpacity onPress={() => this.props.dispatch(unauthorized(findMe, 'facebook'))}>
                  <Text style={[styles.listViewCellTextValue, { color: app.styles.primaryColor } ]}>Connect</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.listViewCell}>
              <View style={{width: 28, marginRight: 6}}>
                <Image
                  defaultSource={require('./twitter.png')}
                  source={require('./twitter.png')}/>
              </View>
              <Text style={styles.listViewCellText}>{(twitterStrategy && twitterStrategy.providerData) ? '@' + twitterStrategy.providerData.screen_name : 'Twitter'}</Text>
              {twitterStrategy ?
                <TouchableOpacity onPress={() => this._destroyAuthStrategy(twitterStrategy)}>
                  <Text style={styles.listViewCellTextValue}>Disconnect</Text>
                </TouchableOpacity>
                : 
                <TouchableOpacity onPress={() => this.props.dispatch(unauthorized(findMe, 'twitter'))}>
                  <Text style={[styles.listViewCellTextValue, { color: app.styles.primaryColor } ]}>Connect</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.listViewCell}>
              <View style={{width: 28, marginRight: 6}}>
                <Image
                  defaultSource={require('./instagram.png')}
                  source={require('./instagram.png')}/>
              </View>
              <Text style={styles.listViewCellText}>{(instagramStrategy && instagramStrategy.providerData) ? instagramStrategy.providerData.username : 'Instagram'}</Text>
              {instagramStrategy ?
                <TouchableOpacity onPress={() => this._destroyAuthStrategy(instagramStrategy)}>
                  <Text style={styles.listViewCellTextValue}>Disconnect</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => this.props.dispatch(unauthorized(findMe, 'instagram'))}>
                  <Text style={[styles.listViewCellTextValue, { color: app.styles.primaryColor } ]}>Connect</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.listViewCellLast}>
              <View style={{width: 28, marginRight: 6}}>
                <Image
                  defaultSource={require('./youtube.png')}
                  source={require('./youtube.png')}/>
              </View>
              <Text style={styles.listViewCellText}>{(youtubeStrategy && youtubeStrategy.providerData) ? youtubeStrategy.providerData.displayName : 'YouTube'}</Text>
              {youtubeStrategy ?
                <TouchableOpacity onPress={() => this._destroyAuthStrategy(youtubeStrategy)}>
                  <Text style={styles.listViewCellTextValue}>Disconnect</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => this.props.dispatch(unauthorized(findMe, 'youtube'))}>
                  <Text style={[styles.listViewCellTextValue, { color: app.styles.primaryColor } ]}>Connect</Text>
                </TouchableOpacity>
              }
            </View>
          </View>

          <View style={{ padding: 16 }}>
            <Text style={styles.listViewTitle}>DEVICE</Text>
          </View>
          <View style={[styles.listViewContainer, {backgroundColor: colors.grayDarker} ]}>
            <View style={styles.listViewCellContainer}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor='rgba(255,255,255,0.08)'
                onPress={() => this.props.navigator.push({
                  component: PushNotifications
              })}>
                <View style={styles.listViewCell}>
                  <Text style={styles.listViewCellText}>Notifications</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Image
                      style={styles.chevron}
                      defaultSource={require('./right-chevron.png')}
                      source={require('./right-chevron.png')}
                    />
                  </View>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.listViewCellContainer}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor='rgba(255,255,255,0.08)'
                onPress={() => this._promptFeebackMailer()}>
                <View style={styles.listViewCell}>
                  <Text style={styles.listViewCellText}>Contact Support</Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Image
                      style={styles.chevron}
                      defaultSource={require('./right-chevron.png')}
                      source={require('./right-chevron.png')}/>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.listViewCellContainer}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor='rgba(255,255,255,0.08)'
                onPress={() => this.props.navigator.push({
                  component: About
              })}>
                <View style={styles.listViewCellLast}>
                  <Text style={styles.listViewCellText}>About</Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Image
                      style={styles.chevron}
                      defaultSource={require('./right-chevron.png')}
                      source={require('./right-chevron.png')}/>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </View>


          {app.sumAllLinks && auth.role === 'admin' &&
            <View>
              <View style={{ padding: 16 }}>
                <Text style={styles.listViewTitle}>SUMALL ANALYTICS</Text>
              </View>
              <View style={[styles.listViewContainer, {backgroundColor: colors.grayDarker} ]}>
                <View style={styles.listViewCellContainer}>
                  <TouchableHighlight
                    activeOpacity={1}
                    underlayColor='rgba(255,255,255,0.08)'
                    onPress={() => this.openLink(app.sumAllLinks.daily)}>
                    <View style={styles.listViewCell}>

                      <Text style={styles.listViewCellText}>Daily Stats</Text>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Image
                          style={styles.chevron}
                          defaultSource={require('./right-chevron.png')}
                          source={require('./right-chevron.png')}/>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={styles.listViewCellContainer}>
                  <TouchableHighlight
                    activeOpacity={1}
                    underlayColor='rgba(255,255,255,0.08)'
                    onPress={() => this.openLink(app.sumAllLinks.weekly)}>
                    <View style={styles.listViewCell}>
                      <Text style={styles.listViewCellText}>Weekly Stats</Text>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Image
                          style={styles.chevron}
                          defaultSource={require('./right-chevron.png')}
                          source={require('./right-chevron.png')}/>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={styles.listViewCellContainer}>
                  <TouchableHighlight
                    activeOpacity={1}
                    underlayColor='rgba(255,255,255,0.08)'
                    onPress={() => this.openLink(app.sumAllLinks.monthly)}>
                    <View style={styles.listViewCell}>
                      <Text style={styles.listViewCellText}>Monthly Stats</Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          style={styles.chevron}
                          defaultSource={require('./right-chevron.png')}
                          source={require('./right-chevron.png')}/>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>

              <View style={{ padding: 16 }}>
                <Text style={styles.listViewTitle}>LIGHT SETTING</Text>
              </View>
              <View style={[styles.listViewContainer, {backgroundColor: colors.grayDarker} ]}>
                <View style={styles.listViewCellContainer}>
                  <TouchableHighlight
                    activeOpacity={1}
                    underlayColor='rgba(255,255,255,0.08)'
                    onPress={() => {
                      this.props.navigator.push({
                        component: Lightshow
                      })
                    }}>
                    <View style={styles.listViewCell}>

                      <Text style={styles.listViewCellText}>Lightshows</Text>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Image
                          style={styles.chevron}
                          defaultSource={require('./right-chevron.png')}
                          source={require('./right-chevron.png')}/>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>                
              </View>
            </View>
          }

          <View style={[ styles.listViewContainer, {marginTop: 32, backgroundColor: colors.grayDarker} ]}>
            <View style={styles.listViewCellContainer}>
              <TouchableOpacity onPress={() => Alert.alert('Are you sure you want to log out?', null, this._logoutButtons, null, null)}>
                <View style={styles.listViewCellLast}>
                  <Text style={[ styles.listViewCellText, {textAlign: 'center', color: app.styles.primaryColor} ]}>Log out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'transparent'
  },
  listViewContainer: {
    backgroundColor: '#111112',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  listViewTitle: {
    fontWeight: '500',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.32)',
    backgroundColor: 'transparent',
  },
  listViewCell: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingRight: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  listViewCellLast: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
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
  chevron: {
    tintColor: '#7F7F7F'
  },
  logOutButton: {
    alignItems: 'center', 
    padding: 16, 
    marginTop: 32, 
    backgroundColor: '#111112',
  },
  logOutButtonText: {
    color: '#7F7F7F',
  },
});

const mapStateToProps = state => ({ user: state.user, app: state.app, auth: state.auth })

module.exports = connect(mapStateToProps)(Settings);
