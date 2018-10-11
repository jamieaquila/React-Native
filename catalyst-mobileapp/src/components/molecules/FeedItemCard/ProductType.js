import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableHighlight, Dimensions, Linking } from 'react-native';
;
import { connect } from 'react-redux';
import AutoLink from 'react-native-autolink';
import SafariView from 'react-native-safari-view';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../../config';

import { titleCase, shortNumber, calculateConstrainedDimensions } from '../../../helpers';
import { Media, TimeSince, SocialMediaBadge, LikeToggleButton, CommentButton, ReshareButton, ShareButton } from '../../atoms';
import { VideoPlayer, ProfileMediaObject, FeedItemQuickLook } from '../../molecules';
import { FeedItemDetail } from '../../views';

import { setStyle as setStatusBarStyle } from '../../../actions/StatusBarActions';

var deviceDimensions = Dimensions.get('window');

class FeedItem extends React.Component {

  state = {
    imageDimensions: {
      width: deviceDimensions.width,
      height: deviceDimensions.width / 2
    }
  }

  static propTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    var { feedItem } = this.props;

    if (!!feedItem.image) {
      Image.getSize(feedItem.image, (width, height) => {
        const imageDimensions = { width, height };
        this.setState({ imageDimensions });
      });
    }
  }

  _openProductLink(url) {
    var { dispatch } = this.props;

    SafariView.show({ url });
    SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
    SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
  }

  render() {
    const { feed, feedItem, isLiked, isReshared, dispatch, playVideos, app } = this.props;

    var imageDimensions = calculateConstrainedDimensions(this.state.imageDimensions, deviceDimensions);
    
    return (
        <View style={styles.container}>
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor='black'
            onPress={() => this._openProductLink(feedItem.link)}
          >
            <View style={{ overflow: 'hidden' }}>
              <Image
                blurRadius={80}
                source={{uri: feedItem.image}}
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, transform: [{scale: 20}] }}
              />
              <Image
                source={{uri: feedItem.image}}
                style={[styles.media, {width: imageDimensions.width - 20, height: imageDimensions.height - 20} ]}
              />
              <View style={{ overflow: 'hidden', position: 'absolute', top: 0, right: 0, flexDirection: 'row', padding: 4, borderBottomLeftRadius: 6 }}>
                <Image
                  source={{uri: feedItem.image}}
                  style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, transform: [{scale: 20}] }}
                />
                <Text style={{ fontSize: 8, fontWeight: '800', color: 'white' }}>$</Text>
                <Text style={{ fontSize: 12, fontWeight: '800', letterSpacing: -0.2, color: 'white' }}>24.80</Text>
              </View>
              <View style={{ flex: 1, padding: 16 }}>
                <Text numberOfLines={1} style={{ fontSize: 24, fontWeight: '800', letterSpacing: 1, color: 'white' }}>{feedItem.message.toUpperCase()}</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 2,
    // paddingBottom: 0,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 2
  },
  media: {
    backgroundColor: 'rgba(0,0,0,0.12)'
  },
});

const mapStateToProps = state => ({ feed: state.feed, app: state.app })

export default connect(mapStateToProps)(FeedItem);
