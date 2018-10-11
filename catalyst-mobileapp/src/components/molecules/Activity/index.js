import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Dimensions, StyleSheet, ActionSheetIOS, Platform } from 'react-native';
import { connect } from 'react-redux';

import { commaNumber, parseTemplate } from '../../../helpers';

import { ActivityIllustration, EllipsisActionSheet } from '../../atoms';

import colors from '../../../config/colors';

import AndroidShare from 'react-native-share';

var Activity = React.createClass({

  propTypes: {
    activity: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired
  },

  _showShareActionSheetForActivity: function(activity) {
    var app = this.props.app;
    var url = app.settings.shareHost + '/Activities/' + activity.id || '';
    var message = parseTemplate(activity.type.shareMessage, { activity, app });
    var title = parseTemplate(activity.type.shareMessage, { activity, app });
    if (Platform.OS === 'android') {
      AndroidShare.open({
          share_text: message,
          share_URL: url,
          title: title
      },(e) => {
          // console.log(e);
      });
    }
    else {
      ActionSheetIOS.showShareActionSheetWithOptions({
            url: url,
            message: message,
            subject: title,
          },
          (error) => {
            console.error(error);
          },
          (success, method) => {
            var text;
            if (success) {
              text = `Shared via ${method}`;
            } else {
              text = 'You didn\'t share';
            }
          });
    }
  },

  _getEllipsisActions: function() {
    var { activity } = this.props;

    return [{ name: "Share", action: () => this._showShareActionSheetForActivity(activity) }]
  },

  render: function() {
    var { activity, currentUser, app } = this.props;

    return (
        <View style={{ alignItems: 'center', padding: 16, paddingRight: 0, flex: 1, flexDirection: 'row', borderBottomWidth: .5, borderBottomColor: colors.grayDark }}>
          <View style={{ flex: 2 }}>
            <View>
              <ActivityIllustration
                action={activity.type.id}
                backgroundColor
              />
            </View>
          </View>
          <View style={{ flexDirection: 'column', flex: 6, paddingLeft: 12, paddingRight: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', letterSpacing: -0.32, color: 'white' }}>@{currentUser.screenName}</Text>
            <Text style={{ fontSize: 14, letterSpacing: -0.154, lineHeight: 20, color: 'rgba(255,255,255,0.64)' }}>{parseTemplate(activity.type.message, { activity }, { user: currentUser }, { app })}</Text>
          </View>
          <EllipsisActionSheet
            actions={this._getEllipsisActions()}
            tintColor={colors.gray}
          />
        </View>
    );
  }
});

const mapStateToProps = state => ({ app: state.app });

module.exports = connect(mapStateToProps)(Activity);
