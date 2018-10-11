import React from 'react';
import { ScrollView, Image, StyleSheet, View, Text, TouchableHighlight, RefreshControl, Dimensions } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { connect } from 'react-redux';
import { findOwn, startRefreshing } from '../../../actions/MessageThreadActions';

import LinearGradient from 'react-native-linear-gradient';

import { MessageThread } from '../../views';
import { NavigationBar } from '../../molecules';
import { SocialMediaBadge, TimeSince } from '../../atoms';

import NoMessageThreadsEmptyState from './NoMessageThreadsEmptyState';
import LoggedOutEmptyState from './LoggedOutEmptyState';

import { colors } from '../../../config';

var {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

class MessageThreads extends React.Component {

  componentDidMount() { 
    this.props.dispatch(findOwn());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.currentUser && !nextProps.messageThread.items && !nextProps.messageThread.isLoading) {
      this.props.dispatch(findOwn());
    }
  }

  onRefresh() {
    var { dispatch } = this.props;

    dispatch(startRefreshing());
    dispatch(findOwn());
  }

  render () {
    var { navigator, user, messageThread, app } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <ScrollView
          scrollsToTop={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          refreshControl={
            user.currentUser && <RefreshControl
              refreshing={messageThread.isRefreshing}
              onRefresh={() => this.onRefresh()} 
              tintColor='white'
            />
          }
        >
        {messageThread.items && messageThread.items.length > 0 && messageThread.items.map((messageThread, i) => {
            return (
              <TouchableHighlight
                key={i}
                activeOpacity={1}
                underlayColor='rgba(255,255,255,0.2)'
                onPress={() => navigator.push({component: MessageThread, passProps: { messageThread: messageThread } })}
              >
                <View>
                    <View style={styles.listView}>
                      <View>
                        <Image
                          style={styles.profileImage}
                          source={{uri: messageThread.author.profileImageUrl}}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[styles.userName, {color: 'white'} ]}>
                            {messageThread.author.name}
                          </Text>
                          <Text numberOfLines={1} style={[styles.messageText, {color: 'rgba(255,255,255,0.8)'} ]}>
                            {messageThread.messages[messageThread.messages.length - 1].message}
                          </Text>
                        </View>
                        <View style={{ position: 'absolute', top: 0, right: 0 }}>
                          <Text style={[styles.timeStamp, {color: 'rgba(255,255,255,0.4)'} ]}>
                            <TimeSince date={messageThread.createdAt}/>
                          </Text>
                        </View>
                      </View>
                    </View>
                  <View style={[styles.listViewBorderBottom, {backgroundColor: 'rgba(0,0,0,0.2)'} ]}/>
                </View>
              </TouchableHighlight>
            );
          })
        }
        {messageThread.items === null || messageThread.items.length === 0 && <NoMessageThreadsEmptyState navigator={navigator} />}
        {!user.currentUser && <LoggedOutEmptyState />}
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  listView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  listViewInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,.04)',
    borderRadius: 32,
  },
  socialMediaBadgeContainer: {
    position: 'absolute',
    top: 28,
    left:  36,
    backgroundColor: 'transparent'
  },
  userName: {
    marginBottom: 2,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.24,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  timeStamp: {
    fontSize: 12,
  },
  listViewBorderBottom: {
    height: 1,
    marginLeft: 80,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight - 114,
    backgroundColor: 'transparent',
  },
  emptyStateImage: {
    tintColor: 'rgba(255,255,255,0.8)',
    marginBottom: 24
  },
  emptyStateText: {
    marginLeft: 40,
    marginRight: 40,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    letterSpacing: -0.32,
    lineHeight: 22,
    textAlign: 'center',
  }
});

const mapStateToProps = state => ({ user: state.user, messageThread: state.messageThread, app: state.app });

export default connect(mapStateToProps)(MessageThreads);
