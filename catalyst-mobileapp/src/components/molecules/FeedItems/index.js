import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
;
import { connect } from 'react-redux';

import { FeedItemsGrid, FeedItemsList } from '../../molecules';

var FeedItems = React.createClass({

  render() {
    var { items, navigator, user, layout, playVideos, itemType } = this.props;
    var { currentUser } = user;

    return (
      <View>
        {(() => {
          switch(layout) {
            case "grid":
              return <FeedItemsGrid items={items} itemType={itemType} navigator={navigator} playVideos={playVideos} />
            default:
              return <FeedItemsList items={items} itemType={itemType} navigator={navigator} playVideos={playVideos} />
          }
        })()}
      </View>
    );
  }
});

FeedItems.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  items: React.PropTypes.array.isRequired,
  layout: React.PropTypes.string
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(FeedItems);
