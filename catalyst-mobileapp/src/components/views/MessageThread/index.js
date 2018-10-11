import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Dimensions, Linking } from 'react-native';

import { connect } from 'react-redux';
import AutoLink from 'react-native-autolink';
// import SafariView from 'react-native-safari-view';

import { setStyle as setStatusBarStyle } from '../../../actions/StatusBarActions';

import { colors } from '../../../config';

import { NavigationBar } from '../../molecules';

var {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window')

class MessageThread extends React.Component {
  onLinkPress(url) {
    var { dispatch } = this.props;

    SafariView.show({ url });
    SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
    SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
  }

  render() {
    var { messageThread, app } = this.props;

    return(
      <View style={[ styles.container, { backgroundColor: colors.grayDarker } ]}>
        <NavigationBar 
          navigator={this.props.navigator}
          title="Message"
        />
        <ScrollView
          scrollsToTop={false}
          style={{ transform: [{ scaleY: -1 }] }}
          contentContainerStyle={{ paddingTop: 96, paddingBottom: 16 }}
        >
          { 
            messageThread.messages.map((message, i) => {
              return (
                <View
                  key={i}
                  style={styles.scrollViewContentContainer}
                >
                  <View>
                    <Image
                      style={styles.profileImage}
                      source={{uri: messageThread.author.profileImageUrl}}
                      resizeMode="cover"
                    />
                  </View>
                  <View key={i} style={[ styles.chatBubble, { borderWidth: 2, borderColor: colors.grayMedium }, message.message.length > 40 && { flex: 1 } ]}>
                    <AutoLink
                      onPress={(link) => this.onLinkPress(link)}
                      style={styles.text}
                      linkStyle={{ color: app.styles.primaryColor }}
                      text={message.message}
                    />
                  </View>
                </View>
              );
            })
        }
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollViewContentContainer: {
    transform: [{ scaleY: -1 }],
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 8,
    paddingBottom: 24
  },
  profileImage: {
    top: 24,
    width: 48,
    height: 48,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,.04)',
    borderRadius: 24,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 24,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.16,
    color: 'white',
  },
});

const mapStateToProps = state => ({ app: state.app });

export default connect(mapStateToProps)(MessageThread);
