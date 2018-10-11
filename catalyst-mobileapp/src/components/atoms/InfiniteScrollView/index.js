import React from 'react';
import { ScrollView, RefreshControl, Dimensions } from 'react-native';

import { connect } from 'react-redux';

class InfiniteScrollView extends React.Component {

  onScroll(event) {
    if (this.props.onScroll) this.props.onScroll(event);
    this._infiniteScroll(event);
  }

  _infiniteScroll(event) {
    if (this.props.isLoading || !this.props.canLoadMore) return;
    
    if (this._distanceFromEnd(event) < this.props.distanceToLoadMore) {
      this.props.onBottomHit()
    }
  }

  _distanceFromEnd(event) {
    let {
      contentSize,
      contentInset,
      contentOffset,
      layoutMeasurement,
    } = event.nativeEvent;

    var contentLength = contentSize.height;
    var trailingInset = contentInset.bottom;
    var scrollOffset = contentOffset.y;
    var viewportLength = layoutMeasurement.height;
    return contentLength + trailingInset - scrollOffset - viewportLength;
  }

  render() {
    return (
      <ScrollView
        onScroll={this.onScroll.bind(this)}
        scrollEventThrottle={this.props.scrollEventThrottle}
        style={this.props.style}
        contentContainerStyle={this.props.contentContainerStyle}
        contentOffset={this.props.contentOffset}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isRefreshing}
            onRefresh={this.props.onRefresh}
            tintColor="white"
          />
        }
      >
        {this.props.children}
      </ScrollView>
    )
  }

}

InfiniteScrollView.propTypes = {
  onScroll: React.PropTypes.func,
  onBottomHit: React.PropTypes.func.isRequired,
  children: React.PropTypes.any.isRequired,
  distanceToLoadMore: React.PropTypes.number,
  scrollEventThrottle: React.PropTypes.number,
  style: React.PropTypes.any
}

InfiniteScrollView.defaultProps = {
  distanceToLoadMore: Dimensions.get('window').height + Dimensions.get('window').height * 0.6,
  scrollEventThrottle: 16,
  isRefreshing: false,
  canLoadMore: true
}

export default InfiniteScrollView