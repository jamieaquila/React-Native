import React from 'react';
import { StyleSheet, View, WebView, TouchableOpacity, Text, Dimensions, Image, Animated } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { NavigationBar } from '../../molecules';

import { connect } from 'react-redux';

// import { FBSDKLoginManager } from 'react-native-fbsdklogin';

class ConnectFacebook extends React.Component {

	constructor(props) {
		super();
		this.state = {
			pulse: new Animated.Value(1), 
		};
	}

  componentDidMount() {
  	Animated.sequence([
  		Animated.timing(this.state.pulse, {
  			toValue: 1,
  			duration: 1000
  		}),
  		Animated.timing(this.state.pulse, {
  			toValue: 1.1,
  			duration: 1000
  		})
  		]).start(() => {
  			this.componentDidMount();
  		});
  	}

	handleClose() {
		this.props.appNavigator.pop();
	}

	handlePress() {
		FBSDKLoginManager.logInWithReadPermissions([], (error, result) => {
			if (error) {
				alert('Error logging in.');
			} else {
				if (result.isCancelled) {
					alert('Login cancelled.');
				} else {
					alert('Logged in.');
				}
			}
		});
	}

	render () {
		return (
			<View style={styles.instructionsContainer}>
				<Animated.Image 
					style={[styles.instructionsBackgroundImage,
						{ transform: [ { scale: this.state.pulse } ] }
					]}
					source={require('./thumb.png')}
				/>
				<Text style={styles.instructionsText}>Whoa there cowboy, you need to connect your Facebook account before you can start liking posts</Text>
				<TouchableOpacity style={styles.connectButton} onPress={() => this.handlePress()}>
					<Image style={styles.connectButtonSocialLogo} source={require('./facebook.png')}/>
					<Text style={styles.connectButtonText}>Connect Dat Facebook</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	instructionsContainer: {
		backgroundColor: '#5A86E6',
		flex: 1,
		alignItems: 'center',
		// flexDirection: 'row',
		justifyContent:'center'
	},
	instructionsText: {
		paddingLeft: 32,
		paddingRight: 32,
		fontSize: 21,
		textAlign: 'center',
		color: 'white',
		backgroundColor: 'transparent'
	},
	instructionsBackgroundImage: {
		position: 'absolute',
		height: 400,
		top: Dimensions.get('window').height / 2 - 250
	},
	connectButton: {
		position: 'absolute',
		top: Dimensions.get('window').height - 96,
		left: 12,
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'space-between',
		height: 56,
		paddingLeft: 16,
		paddingRight: 16,
		width: Dimensions.get('window').width - 24,
		textAlign: 'center',
		backgroundColor: '#3B5997',
		borderRadius: 3
	},
	connectButtonText: {
		// position: 'absolute',
		marginLeft: -24,
		// right: 0,
		flex: 9,
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
		color: 'white',
		backgroundColor: 'transparent'
	},
	connectButtonSocialLogo: {
		width: 24,
		height: 24
	}
});

export default connect()(ConnectFacebook);
