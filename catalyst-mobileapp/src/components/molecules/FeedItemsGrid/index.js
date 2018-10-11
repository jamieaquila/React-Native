import React from 'react';
import { StyleSheet, View } from 'react-native';
;
import { connect } from 'react-redux';

import { FeedItemSquare } from '../../molecules';


class FeedItems extends React.Component {

  render() {
    var { items, navigator, user, layout, playVideos } = this.props;
    var { currentUser } = user;

    return (
      <View style={styles.container}>
        {
          items.map((item, index) => {
            if(item.media !== null) {
              return <FeedItemSquare
                  key={index}
                  feedItem={item}
                  isLiked={(currentUser && currentUser.feedItemLikes.find(feedItemLike => feedItemLike.feedItem === item.id)) ? true : false}
                  isReshared={(currentUser && currentUser.feedItemReshares.find(feedItemReshare => feedItemReshare.feedItem === item.id)) ? true : false}
                  navigator={navigator}
                  playVideos={playVideos}
                />
            }
          })
        }
      </View>
    );
  }
}

FeedItems.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  items: React.PropTypes.array.isRequired,
  layout: React.PropTypes.string
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(FeedItems);
