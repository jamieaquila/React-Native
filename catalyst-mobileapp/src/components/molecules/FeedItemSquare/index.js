import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { connect } from 'react-redux';
import SafariView from 'react-native-safari-view';

import { FeedItemQuickLook } from '../../molecules';

import { push as pushModal } from '../../../actions/ModalActions';
import { setStyle as setStatusBarStyle } from '../../../actions/StatusBarActions';

class FeedItemSquare extends React.Component {

  onPress(feedItem) {
    if (feedItem.platform === 'youtube') {
        this.openLink('https://www.youtube.com/watch?v=' + feedItem.sourceId);
    } else {
        if(feedItem.media !== null) {
          this.props.dispatch(pushModal({
          component: FeedItemQuickLook,
          passProps: { feedItem }
        }));
      }

    }
  }

  openLink(url) {
    var { dispatch } = this.props;

    SafariView.show({ url });
    SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
    SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
  }

  render() {
    const { feed, feedItem, isLiked, dispatch } = this.props;

    if (!feedItem.image) {
      return null;
    } else {
      return (
        <TouchableOpacity
          style={styles.mediaTouchable}
          activeOpacity={0.6}
          onPress={() => this.onPress(feedItem)}
        >
          <Image 
            style={styles.media}
            source={{uri: feedItem.image}}
          />
        </TouchableOpacity>
      );
    }
  }
}

FeedItemSquare.propTypes = {
  navigator: React.PropTypes.object.isRequired
}

var styles = StyleSheet.create({
  media: {
    height: (Dimensions.get('window').width / 3) - 2,
    width: (Dimensions.get('window').width / 3) - 2,
  },
  mediaTouchable: {
    height: Dimensions.get('window').width / 3,
    padding: 1,
  },
});

const mapStateToProps = state => ({ feed: state.feed })

export default connect(mapStateToProps)(FeedItemSquare);
