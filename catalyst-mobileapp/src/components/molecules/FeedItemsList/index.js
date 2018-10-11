import React from 'react';
import { StyleSheet, View } from 'react-native';
;
import { connect } from 'react-redux';

import { FeedItemCard } from '../../molecules';


var FeedItemsList = React.createClass({



  render: function() {
    var { items, navigator, user, layout, playVideos, itemType } = this.props;
    var { currentUser } = user;

    return (
      <View>
        {
          items.map((item, index) => {
            return (
              <FeedItemCard
                key={index}
                feedItem={item}
                itemType={itemType}
                isLiked={(currentUser && currentUser.feedItemLikes.find(feedItemLike => feedItemLike.feedItem === item.id)) ? true : false}
                isReshared={(currentUser && currentUser.feedItemReshares.find(feedItemReshare => feedItemReshare.feedItem === item.id)) ? true : false}
                navigator={navigator}
                playVideos={playVideos}
              />
            );
          })
        }
      </View>
    );
  }
})

FeedItemsList.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  items: React.PropTypes.array.isRequired,
  layout: React.PropTypes.string
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(FeedItemsList);
