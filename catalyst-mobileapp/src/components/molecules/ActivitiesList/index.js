import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';


import { connect } from 'react-redux';

import { findMe } from '../../../actions/UserActions';
import { findOwn } from '../../../actions/ActivityActions';

import { Activity } from '../../molecules';

var ActivitiesList = React.createClass({

  componentWillMount: function(nextProps){
    this.props.dispatch(findOwn())
  },

  _onRefresh: function(){
    this.props.dispatch(findOwn())
    this.props.dispatch(findMe())
  },

  render: function() {
    var { user, activities } = this.props;


    return (
      <View style={{ flex: 1 }}>
        <ScrollView 
          scrollsToTop={false}
          refreshControl={
            <RefreshControl
              refreshing={activities.isLoading && user.isLoading}
              onRefresh={this._onRefresh}
              tintColor="white"
            />
          }
        >
        {
          activities.items.map((activity, index) => {
            return <Activity key={index} activity={activity} currentUser={user.currentUser} />;
          })
        }
        </ScrollView>
      </View>
    );
  }

});

module.exports = connect()(ActivitiesList);
