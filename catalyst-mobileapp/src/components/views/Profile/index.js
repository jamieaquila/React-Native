import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Animated, Dimensions, SwitchIOS, TouchableHighlight, TouchableOpacity, ActionSheetIOS, Platform, Alert } from 'react-native';

import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Navigator } from 'react-native-deprecated-custom-components';

import { titleCase, shortNumber } from '../../../helpers';

import { colors } from '../../../config';

import { Pop } from '../../atoms';

import { push as pushModal } from '../../../actions/ModalActions';

import { MessageThreadComposer } from '../'


// actions
import { deleteOwn as deleteAuthStrategy } from '../../../actions/AuthStrategyActions'
import { popModal } from '../../../actions/ModalActions';

// first party components
import { Settings, ProfileEmptyState } from '../../views';
import { NavigationBar, ActivitiesList, LeadersList } from '../../molecules';
import MessageThreads from '../MessageThreads'
import { ScrollableTabBar } from '../../atoms';

import ScrollableTabView from 'react-native-scrollable-tab-view';

// empty state
import { ConnectTwitterButton, ConnectFacebookButton, ConnectGoogleButton } from '../../molecules'

var Mailer = require('NativeModules').RNMail;
import DeviceInfo from 'react-native-device-info';
import albumReducer from '../../../reducers/albumReducer';

const { width: deviceWidth } = Dimensions.get('window');

class Profile extends React.Component {

  promptFeebackMailer() {
    const { app } = this.props;

    Mailer.mail({
      subject: app.name + ' App Support ' + ' (' + DeviceInfo.getModel() + ' running ' + DeviceInfo.getVersion() + '(' + DeviceInfo.getBuildNumber() + '))',
      recipients: ['support@buzznog.com'],
      body: 'Tell us in a few lines what’s going on.',
    }, (error, event) => {
        if(error) {
          Alert.alert('Error', 'Could not send mail. Please send an email to support@buzznog.com');
        }
    });
  }

  goToBackScreen(){
    setTimeout(() => {
      this.props.navigator.pop()
    }, 1000)
  }

  componentDidMount() {
    this.popStatus = false;
  }

  _onShowMessageButtonPress() {
    this.props.dispatch(pushModal(
      { component: MessageThreadComposer },
      () => ({...Navigator.SceneConfigs.FloatFromBottom, gestures: null })
    ));
  }

  render () {
    var { windowHeight, navigator, user, activities, app, findFriend, auth } = this.props;
    // console.log(app.styles)
    if(findFriend && user.currentUser && !this.popStatus){
      this.popStatus = true
      this.goToBackScreen()
    }

    return (
      <View style={{ flex: 1 }}>
        {user.currentUser && <View style={{ flex: 1 }}>
          <View style={{ padding: 32, paddingRight: 0, paddingLeft:0}}>
            <Image
              style={styles.coverImage}
              source={(user.currentUser && user.currentUser.bannerImageUrl) ? {uri:user.currentUser.bannerImageUrl} : require('./default-banner-image.png')}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'black']}
              style={styles.gradient}
            />
            <View style={{width:'100%', flexDirection:'row'}}>
              {
                auth.role === 'admin' ?
                <View style={{width:'50%', paddingLeft:5, alignItems: 'flex-start'}}>
                  <TouchableOpacity style={{width:48, height:48}}
                    onPress={() => this._onShowMessageButtonPress()}
                  >
                    <Image
                      style={{ tintColor: app.styles.messageIconColor }}
                      source={require('./new-message.png')}
                    />
                  </TouchableOpacity>
                </View>
                :
                <View style={{width:'50%'}} />
              }
              <View style={{width:'50%', alignItems: 'flex-end'}}>
                <TouchableOpacity
                  style={{ width:48, height:48, alignItems: 'flex-end'}}
                  onPress={() => this.props.navigator.push({
                    component: Settings
                })}>
                  <Image
                    style={{ opacity: 0.8 }}
                    defaultSource={require('./settings.png')}
                    source={require('./settings.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 0, marginLeft:32, flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.profileImageOuterRing, {backgroundColor: app.styles.primaryColor} ]}/>
              <View style={[styles.profileImageInnerRing, {backgroundColor: app.styles.primaryColor} ]}/>
              <Image
                style={styles.profileImage}
                source={(user.currentUser) ? {uri:user.currentUser.profileImageUrl} : require('./default-profile-image.png')}
              />
              <View>
                <Text style={styles.username}>{user.currentUser ? '@' + user.currentUser.screenName : '@you'}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ paddingRight: 16, alignItems: 'center' }}>
                    <Text style={styles.userGamificationStat}>{user.currentUser.leader ? user.currentUser.leader.points : 0}</Text>
                    <Text style={styles.userGamificationStatLabel}>POINTS</Text>
                  </View>
                  <View style={{ paddingRight: 16, alignItems: 'center' }}>
                    <Text style={styles.userGamificationStat}>{user.currentUser.leader ? shortNumber(user.currentUser.leader.rank) : 0}</Text>
                    <Text style={styles.userGamificationStatLabel}>RANK</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <ScrollableTabView style={{ backgroundColor: 'transparent' }} renderTabBar={ () =>
            <ScrollableTabBar
              underlineHeight={2}
              textStyle={{ color: 'rgba(255,255,255,0.4)', fontWeight: '600', fontSize: 13, letterSpacing: 0.8 }}
              activeTextStyle={{ color: 'white', fontWeight: '600' }}
              underlineColor={app.styles.primaryColor}
              containerStyle={{ backgroundColor: 'transparent',  borderWidth: 0, height: 64 }}
              tabsStyle={{ flex: 1 }}
            />
          }>
            <View style={[{ flex: 1 }, { backgroundColor: app.styles.grayDarker}]} tabLabel={'Messages'.toUpperCase()}>
              <MessageThreads user={user} activities={activities} navigator={navigator} />
            </View>
            <View style={[{ flex: 1 }, { backgroundColor: app.styles.grayDarker}]} tabLabel={'Activity'.toUpperCase()}>
              <ActivitiesList user={user} activities={activities} />
            </View>
            <View style={[{ flex: 1 }, { backgroundColor: app.styles.grayDarker}]} tabLabel={'Leaderboard'.toUpperCase()}>
              <LeadersList user={user} activities={activities} />
            </View>
          </ScrollableTabView>
        </View>}


        {!user.currentUser && <View style={{ flex: 1 }}>
          <ScrollView
            scrollsToTop={false}
            contentContainerStyle={styles.emptyStateScrollViewContentContainer}
          >
            <View style={styles.emptyStateContainer}>
              <Image
                style={styles.emptyStateIllustration}
                defaultSource={require('./happy-user-features.png')}
                source={require('./happy-user-features.png')}/>
              <Text style={styles.emptyStateTitle}>Join the community!</Text>
              <Text style={styles.emptyStateCopy}>Connect an account to get started.</Text>
            </View>
            <View style={styles.emptyStateCTA}>
              <ConnectFacebookButton text="Connect with Facebook" />
              {
                !findFriend &&
                <ConnectTwitterButton text="Connect with Twitter" />

              }
             {
                !findFriend &&
                <ConnectGoogleButton text="Connect with Google" style={{ marginTop: 16}}/>

              }
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
              <Text style={{ fontSize: 13, letterSpacing: -0.078, color: 'rgba(255,255,255,0.75)' }}>Need help? </Text>
              <TouchableOpacity
                hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
                onPress={() => this.promptFeebackMailer()}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', letterSpacing: -0.078, color: 'white' }}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>}
        {
          (findFriend && !user.currentUser) &&
            <View style={{position: 'absolute', top: 16}}>
              <Pop
                onPress={() => {
                    this.props.navigator.pop()
                }}
                iconType='x'
              />
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileImageOuterRing: {
    position: 'absolute',
    top: -16,
    left: -16,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.6,
  },
  profileImageInnerRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  profileImage: {
    width: 88,
    height: 88,
    marginRight: 32,
    backgroundColor: 'transparent',
    borderRadius: 44
  },
  username: {
    marginBottom: 8,
    fontSize: 21,
    fontWeight: '600',
    color: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.48
  },
  usernameContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  headerText: {
    position: 'absolute',
    top: 206,
    width: Dimensions.get('window').width,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 21,
    fontWeight: '400',
    color: '#fff'
  },
  coverImage: {
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    bottom: -64,
    left: 0,
    right: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: -64,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
  listViewCellContainer: {
    flex: 1,
    backgroundColor: '#0B0C0D'
  },
  listViewContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderTopColor: '#161717',
    borderBottomColor: '#161717'
  },
  listViewTitle: {
    padding: 16,
    fontWeight: '500',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.32)'
  },
  listViewCell: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingRight: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.5,
    borderBottomColor: '#161717'
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
    backgroundColor: '#1f1f1f',
  },
  logOutButtonText: {
    color: '#7F7F7F',
  },
  userGamificationStat: {
    fontSize: 24,
    fontWeight: '600',
    color: '#55A1ED',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.48
  },
  userGamificationStatLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.48
  },
  emptyStateScrollViewContentContainer: {
    flex: 1,
    marginBottom: 50,
  },
  emptyStateContainer: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyStateIllustration: {
    width: deviceWidth - 120,
    resizeMode: 'contain',
    marginBottom: 16,
    tintColor: 'white'
  },
  emptyStateTitle: {
    marginBottom: 4,
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 0.364,
    color: 'white'
  },
  emptyStateCopy: {
    fontSize: 14,
    letterSpacing: -0.154,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)'
  },
  emptyStateCTA: {
    flex: 2,
    justifyContent: 'flex-end',

    paddingLeft: 24,
    paddingRight: 24,
  },
});

var mapStateToProps = state => ({ user: state.user, messageThread: state.messageThread, activities: state.activities, auth: state.auth, app: state.app });

export default connect(mapStateToProps)(Profile);
