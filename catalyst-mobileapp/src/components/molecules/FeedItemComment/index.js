import React from 'react';
import { Image, View, Text, StyleSheet, Linking, Platform } from 'react-native';

import { connect } from 'react-redux';
import AutoLink from 'react-native-autolink';
import SafariView from 'react-native-safari-view';

import { setStyle as setStatusBarStyle } from '../../../actions/StatusBarActions';

import { ProfileMediaObject } from '../../molecules';

import { TimeSince, SocialMediaBadge } from '../../atoms';

import { colors } from '../../../config';

var FeedItemComment = React.createClass({
  onLinkPress: function(url) {
    var { dispatch } = this.props;

    if(Platform.OS == 'android'){
      Linking.openURL(url)
    }else{
      SafariView.show({ url });
      SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
      SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
    }    
  },

	render: function () {
    var { message, name, createdAt, platform, profileImageUrl, app } = this.props;

		return (
			<View style={[ styles.container, {borderBottomColor: colors.grayLighter} ]}>
			  <View style={styles.userInfoContainer}>
			  	<Image
            style={styles.profileImage}
            source={{ uri: profileImageUrl }}
            resizeMode="cover"
          />
          <View style={styles.platformImage}>
            <SocialMediaBadge platform={platform} />
          </View>
	        <View style={{flex: 1}}>
	          <Text style={styles.userName}>
	            {name}
	          </Text>
	          <Text style={styles.accountHandle}>
	            @{name} • {''}
	            <TimeSince date={createdAt}/>
	          </Text>           
              <AutoLink
                onPress={(link) => this.onLinkPress(link)}
                style={styles.comment}
                linkStyle={{ color: app.styles.primaryColor }}
                text={message}              
              />           
	        </View>
	      </View>
			</View>
		);
	}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
	userInfoContainer: {
    flex: 1,
    width:'100%',
    flexDirection: 'row',
  },
  profileImage: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,.08)',
    borderRadius: 24,
  },
  platformImage: {
    position: 'absolute',
    top: 24,
    left: 28,
    backgroundColor: 'transparent'
  },
  userName: {
    marginBottom: 2,
    fontSize: 16,
    fontWeight: '600',
    color: '#131314'
  },
  accountHandle: {
  	marginBottom: 8,
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)'
  },
	comment: {
		// flex: 1,
		fontSize: 15,
		lineHeight: 20,
		color: '#131314',
	},
});

const mapStateToProps = state => ({ app: state.app });

export default connect(mapStateToProps)(FeedItemComment);
