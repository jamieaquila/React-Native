import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';


import { SocialMediaBadge, TimeSince } from '../../atoms';
import { titleCase } from '../../../helpers';

import { colors } from '../../../config';

class ProfileMediaObject extends React.Component {

  static propTypes = {
    userName: React.PropTypes.string,
    imageURL: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
    platform: React.PropTypes.oneOf(['facebook', 'twitter','buzznog', 'instagram', 'youtube']).isRequired
  }

  render() {
    const {appName, socialNetwork, userName, imageURL, timestamp, platform, itemType } = this.props;

    return (
      <View>
        <View style={styles.userInfoContainer}>
          <View>
            <Image
              style={styles.profileImage}
              source={{uri: this.props.imageURL}}
              resizeMode="cover"
            />
            <View style={styles.socialMediaBadgeContainer}>
              <SocialMediaBadge borderColor={this.props.socialMediaBadgeBorderColor} platform={platform} />
            </View>
          </View>
          <View>
            <Text style={[ styles.userName, { color: colors.grayDark } ]}>
              {userName == null ? appName : userName}
            </Text>
            <Text style={[styles.accountHandle, {color: colors.gray} ]}>
              {itemType == 'Exclusive' ? '' : (titleCase(platform) + " • ")}
              <TimeSince date={timestamp}/>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 72,
    height: 72,
    marginTop: 8,
    marginLeft: 8,
    marginRight: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,.04)',
    borderRadius: 36
  },
  socialMediaBadgeContainer: {
    position: 'absolute',
    top: 44,
    left: 58,
    backgroundColor: 'transparent'
  },
  userName: {
    marginBottom: 2,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.24,
  },
  accountHandle: {
    fontSize: 12,
  },
});

export default ProfileMediaObject;
