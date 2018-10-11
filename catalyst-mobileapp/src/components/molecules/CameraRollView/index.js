import React from 'react';
import { ActivityIndicator, Image, ListView, Platform, StyleSheet, CameraRoll, View, InteractionManager } from 'react-native';

import CameraLibrary from 'react-native-camera-library';

var groupByEveryN = require('groupByEveryN');
var logError = require('logError');

var propTypes = {
  /**
   * Number of images that will be fetched in one page.
   */
  batchSize: React.PropTypes.number,

  /**
   * A function that takes a single image as a parameter and renders it.
   */
  renderCameraRollMedia: React.PropTypes.func,

  /**
   * imagesPerRow: Number of images to be shown in each row.
   */
  imagesPerRow: React.PropTypes.number,

  /**
   * The asset type, one of 'Photos', 'Videos' or 'All'
   */
  assetType: React.PropTypes.oneOf([
    'Photos',
    'Videos',
    'All',
  ]),
};

var CameraRollView = React.createClass({
  propTypes: propTypes,

  getDefaultProps: function(): Object {
    return {
      batchSize: 6,
      imagesPerRow: 1,
      assetType: 'All',
      loadingAnimationContainerStyle: {},
      renderCameraRollMedia: function(asset) {
        var base64Image = 'data:image/png;base64,' + asset.thumbnail;

        return (
          <Image
            source={{ uri: base64Image }}
            style={{ width: 50, height: 50 }}
          />
        );
      },
    };
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});

    return {
      assets: ([]: Array<Image>),
      nextPage: 1,
      noMore: false,
      loadingMore: false,
      dataSource: ds,
      assetType: this.props.assetType,
    };
  },

  /**
   * This should be called when the image renderer is changed to tell the
   * component to re-render its assets.
   */
  rendererChanged: function() {
    var ds = new ListView.DataSource({ rowHasChanged: this._rowHasChanged });
    this.state.dataSource = ds.cloneWithRows(
      groupByEveryN(this.state.assets, this.props.imagesPerRow)
    );
  },

  componentDidMount: function() {
    InteractionManager.runAfterInteractions(() => {
      this.fetch();
    });
  },

  componentWillReceiveProps: function(nextProps: {groupTypes?: string}) {
    if (this.props.groupTypes !== nextProps.groupTypes) {
      this.fetch(true);
    }
  },

  _fetch: function(clear?: boolean) {
    if (clear) {
      this.setState(this.getInitialState(), this.fetch);
      return;
    }

    CameraLibrary.getPhotos(
      { 
        page: this.state.nextPage, 
        perPage: 6,
        thumbnailWidth: 160,
        thumbnailHeight: 160
      }, 
      response => this._appendAssets(response)
    );
  },

  /**
   * Fetches more images from the camera roll. If clear is set to true, it will
   * set the component to its initial state and re-fetch the images.
   */
  fetch: function(clear?: boolean) {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => this._fetch(clear));
    }
  },

  render: function() {
    return (
      <ListView
        initialListSize={6}
        pageSize={6}
        scrollsToTop={false}
        style={this.props.style}
        contentContainerStyle={this.props.contentContainerStyle}
        horizontal={this.props.horizontal}
        renderRow={this._renderRow}
        renderFooter={this._renderFooterSpinner}
        onEndReached={this._onEndReached}
        dataSource={this.state.dataSource}
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
      />
    );
  },

  _rowHasChanged: function(r1: Array<Image>, r2: Array<Image>): boolean {
    if (r1.length !== r2.length) {
      return true;
    }

    for (var i = 0; i < r1.length; i++) {
      if (r1[i] !== r2[i]) {
        return true;
      }
    }

    return false;
  },

  _renderFooterSpinner: function() {
    if (!this.state.noMore) {
      return(
        <View style={[styles.spinnerContainer, this.props.loadingAnimationContainerStyle ]}>
          <ActivityIndicator color='white' />
        </View>
      );
    }
    return null;
  },

  // rowData is an array of images
  _renderRow: function(rowData: Array<Image>, sectionID: string, rowID: string)  {
    var images = rowData.map((image, i) => {
      if (image === null) {
        return null;
      }
      return (
        <View key={i}>
          {this.props.renderCameraRollMedia(image)}
        </View>
      );
    });

    return <View>{images}</View>;
  },

  _appendAssets: function(data: Object) {
    var assets = data.objects;
    var newState: Object = { loadingMore: false };

    if (!data.next_page) {
      newState.noMore = true;
    }

    if (assets.length > 0) {
      newState.nextPage = data.current_page + 1;
      newState.assets = this.state.assets.concat(assets);
      newState.dataSource = this.state.dataSource.cloneWithRows(
        groupByEveryN(newState.assets, this.props.imagesPerRow)
      );
    }

    this.setState(newState);
  },

  _onEndReached: function() {
    if (!this.state.noMore) {
      this.fetch();
    }
  },
});

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  url: {
    fontSize: 9,
    marginBottom: 14,
  },
  image: {
    margin: 4,
  },
  info: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default CameraRollView;
