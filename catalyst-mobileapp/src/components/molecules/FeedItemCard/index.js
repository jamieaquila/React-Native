import React from 'react';
import { View, Text } from 'react-native';

import PostType from './PostType';
import ProductType from './ProductType';

import { connect } from 'react-redux';

class FeedItem extends React.Component {

  render() {
    const { feedItem, auth, itemType } = this.props;
    
    if (feedItem.transcoderJobId && feedItem.transcoderJobStatus !== 'completed' && auth.role !== 'admin') return null;
    switch (feedItem) {
      default:
        return <PostType
          feedItem={feedItem}
          itemType={itemType}
          navigator={this.props.navigator}
          isLiked={this.props.isLiked}
          isReshared={this.props.isReshared}
          playVideos={this.props.playVideos}
        />
      case 'product':
        return <ProductType
          feedItem={feedItem}
          navigator={this.props.navigator}
          isLiked={this.props.isLiked}
          isReshared={this.props.isReshared}
          playVideos={this.props.playVideos}
        />
    }
  }

}

const mapPropsToState = state => ({ auth: state.auth });

export default connect(mapPropsToState)(FeedItem);
