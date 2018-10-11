import React from 'react';
import { ListView, View, ScrollView, Text, Image, StyleSheet, RefreshControl } from 'react-native';

import { connect } from 'react-redux';

import { commaNumber } from '../../../helpers'

import { find } from "../../../actions/LeaderActions"
import { findMe } from "../../../actions/UserActions"


import { NavigationBar } from '../../molecules';

import colors from '../../../config/colors';

var LeadersList = React.createClass({

  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: this._rowHasChanged,
    });
    return {
      dataSource: dataSource,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.leaders.items !== this.props.leaders.items) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.leaders.items)
      })
    }
  },

  _renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
    var style = {height: 0.5, backgroundColor: colors.grayDark};
    if (adjacentRowHighlighted) {
      style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={rowID}  style={style}/>
    );
  },

  _rowHasChanged: function(oldRow, newRow) {
    return oldRow !== newRow;
  },

  componentWillMount: function() {
    this.props.dispatch(find())
    this.props.dispatch(findMe())
  },

  _onRefresh: function() {
    this.props.dispatch(find())
    this.props.dispatch(findMe())    
  },

  _renderRow(leader, index) {
    const { app } = this.props;

    return (
      <View key={index} style={styles.listViewItem}>
        <View style={styles.leftInnerContainer}>
          <Image
            style={styles.profileImage}
            defaultSource={require('./default-profile-image.png')}
            source={(leader.user.profileImageUrl) ? {uri: leader.user.profileImageUrl} : require('./default-profile-image.png')}
          />
          {(leader.rank == 1) && <View style={styles.crown}>
            <Text style={{ fontSize: 24 }}>👑</Text>
          </View>}
          <View>
            <Text style={styles.points}>{commaNumber(leader.points)} POINTS</Text>
            <Text numberOfLines={1} style={styles.username}>@{leader.user.screenName}</Text>
          </View>
        </View>
        <View style={styles.rankContainer}>
          <Text style={[ styles.rank, { color: app.styles.primaryColor } ]}>{leader.rank}</Text>
        </View>
      </View>
    );
  },

  render: function() {
    const { navigator, leaders, user } = this.props;

    return(
      <View style={{flex: 1}}>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
        scrollRenderAheadDistance={80}
        refreshControl={
          <RefreshControl
            refreshing={leaders.isLoading && user.isLoading}
            onRefresh={this._onRefresh}
            tintColor="white"
          />
        }
      />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: 'transparent'
  },
  listViewItem: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  leftInnerContainer: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profileImage: {
    marginRight: 8,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
    color: 'white',
  },
  crown: {
    position: 'absolute',
    top: -16,
    left: 0,
    transform: [{ rotate: '330deg' }]
  },
  points: {
    marginBottom: 4,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.078,
    color: 'rgba(255,255,255,.4)'
  },
  rankContainer: {
    flex: 1,
    height: 56,
    alignItems: 'flex-end',
  },
  rank: {
    fontSize: 28,
    letterSpacing: 0.364,
  },
});

const mapStateToProps = state => ({ user: state.user, leaders: state.leaders, app: state.app });

module.exports = connect(mapStateToProps)(LeadersList);
