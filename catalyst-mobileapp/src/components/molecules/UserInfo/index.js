import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, Animated } from 'react-native';

import { connect } from 'react-redux';

var UserInfo = React.createClass({

  _statsOffset: new Animated.Value(16),

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      currentShownStat: 'points'
    }
  },

  toggleGamificationStat: function() {
    switch (this.state.currentShownStat) {
      case 'rank':
        this.setState({ currentShownStat: 'points' })
        Animated.spring(
          this._statsOffset,
          {
            toValue: 16,
          })
        .start(); 
        break;      
      case 'points':
        this.setState({ currentShownStat: 'rank' })
        Animated.spring(
          this._statsOffset,
          {
            toValue: -16,
          })
        .start(); 
        break;
    }
  },

  render: function() {
    var { user, app } = this.props;


    return (
      <TouchableWithoutFeedback onPress={this.toggleGamificationStat}>
        <View style={{flexDirection: 'row', overflow: 'hidden', height: 32, paddingRight: 8 }}>
          <Animated.View style={[{ alignItems: 'flex-end', justifyContent: 'center', alignItems: 'center' }, { top: this._statsOffset }]}>
            <View style={{ alignItems: 'center', justifyContent: 'center', height: 32 }}>
              <Text style={{ fontWeight: '700', color: app.styles.primaryColor }}>{user.currentUser.leader.points}</Text>
              <Text style={styles.pointsLabel}>POINTS</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', height: 32 }}>
              <Text style={{ fontWeight: '700', color: app.styles.primaryColor }}>{user.currentUser.leader.rank}</Text>
              <Text style={styles.pointsLabel}>RANK</Text>
            </View>
          </Animated.View>                
          <Image style={styles.currentUserProfileImage} source={{uri:user.currentUser.profileImageUrl}}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
});

var styles = StyleSheet.create({
  currentUserProfileImage: {
    width: 32,
    height: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    marginLeft: 4
  },
  pointsLabel: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: 'white',
  },
});

const mapStateToProps = state => ({ app: state.app });

module.exports = connect(mapStateToProps)(UserInfo);