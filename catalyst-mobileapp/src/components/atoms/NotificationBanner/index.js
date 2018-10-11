import React from 'react';
import { Animated, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';

import { shown as notificationShown } from '../../../actions/NotificationActions';
import { processNotification } from "../../../helpers/NotificationProcessor";
import { hide as hideStatusBar, show as showStatusBar } from '../../../actions/StatusBarActions';

var NotificationBanner = React.createClass({

  mixins: [TimerMixin],

  _topVal: new Animated.Value(-64),

  _showBanner: function() {
    this.props.dispatch(hideStatusBar());
    Animated.spring( this._topVal, {
      toValue: 0,
      friction: 11,
      tension: 80
    }).start();

    this.setTimeout(this._dismissBanner, 3000);
  },

  _dismissBanner: function() {
    this.props.dispatch(showStatusBar());
    Animated.spring( this._topVal, {
      toValue: -64,
      friction: 11,
      tension: 80
    }).start();
  },

  componentWillReceiveProps(nextProps) {
    var { notification, dispatch } = nextProps;

    if (notification.shouldDisplay) { 
      this._showBanner();
      dispatch(notificationShown());
    }
  },
  doDeeplinking: function(data) {
    var { dispatch } = this.props;
    console.log("NotificationBanner:", data);
    if(data) {
      processNotification(dispatch, data);
    }else {
      console.log("NotificationBanner", "data is null");
    }

  },
  render: function() {
    const { notification } = this.props;


    return(
        
        <Animated.View style={[styles.bannerContainer, {top: this._topVal} ]}>
          <TouchableOpacity
              onPress={()=>this.doDeeplinking(notification.data)}
              style={styles.touchArea}
           >
          <Text numberOfLines={2} style={styles.text}>{notification.message}</Text>
             </TouchableOpacity>
        </Animated.View>
  
    );
  }
})

const styles = StyleSheet.create({
  touchArea: {
    flex:1,
    backgroundColor: '#55a1ed',
    justifyContent: 'center',
    alignItems: 'center'      
  },
  bannerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 64,
    flex: 1,
    flexDirection: 'row'


  },
  text: {
    padding: 10,
    fontSize: 15,
    color: 'white',

  }
});

const mapPropsToState = state => ({ notification: state.notification })

module.exports = connect(mapPropsToState)(NotificationBanner);
