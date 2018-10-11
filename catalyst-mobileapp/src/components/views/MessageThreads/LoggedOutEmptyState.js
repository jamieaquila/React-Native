import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import { colors } from '../../../config';

var {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

class LoggedOutEmptyState extends Component {

    render() {
    	const { app } = this.props;

		return (
			<View style={styles.emptyStateContainer}>
				<Image style={styles.emptyStateImage} source={require('./message.png')} />
				<Text style={styles.emptyStateText}>Login to see exclusive messages from {app.name}.</Text>
			</View>
		);
    }

}

var styles = StyleSheet.create({
  listView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  listViewInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,.04)',
    borderRadius: 32,
  },
  socialMediaBadgeContainer: {
    position: 'absolute',
    top: 28,
    left:  36,
    backgroundColor: 'transparent'
  },
  userName: {
    marginBottom: 2,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.24,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  timeStamp: {
    fontSize: 12,
  },
  listViewBorderBottom: {
    height: 1,
    marginLeft: 80,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight - 114,
    backgroundColor: 'transparent',
  },
  emptyStateImage: {
    tintColor: 'rgba(255,255,255,0.8)',
    marginBottom: 24
  },
  emptyStateText: {
    marginLeft: 40,
    marginRight: 40,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    letterSpacing: -0.32,
    lineHeight: 22,
    textAlign: 'center',
  }
});


const mapStateToProps = state => ({
    app: state.app,
})

export default connect(mapStateToProps)(LoggedOutEmptyState);

