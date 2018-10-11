import React from 'react';
import { StyleSheet, Dimensions, WebView, Animated, View, ScrollView, TouchableOpacity, Image, Text, Linking } from 'react-native';

import { NavigationBar } from '../../molecules';

import { getTwitterRequestToken, storeTwitterRequestTokenScreenName } from '../../../actions/TwitterRequestTokenActions';
import { connect } from 'react-redux';

class ConnectTwitter extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pulse: new Animated.Value(1), 
			email: null
		};
	}

	componentDidMount() {
		this.props.dispatch(getTwitterRequestToken());
		this.pulsate();
	}

	pulsate() {
		Animated.sequence([
			Animated.timing(this.state.pulse, {
				toValue: 1,
				duration: 1000
			}),
			Animated.timing(this.state.pulse, {
				toValue: 1.1,
				duration: 1000
			})
			])
		.start(() => this.pulsate());
	}

  	handlePress() {
		var { requestToken } = this.props.twitterRequestToken;
		var url = (requestToken) ? 'https://api.twitter.com/oauth/authorize?oauth_token=' + requestToken : null;

		Linking.openURL(url);
		this.props.dispatch(getTwitterRequestToken());
  	}

	render () {
		return (
			<View style={{flex:1}}>
				<View style={styles.instructionsContainer}>
					<Animated.Image 
						style={
							[
								styles.instructionsBackgroundImage, 
								{transform: [ {scale: this.state.pulse} ] }
							]
						}
				        source={require('./bird.png')}
			        />

					<Text style={styles.instructionsText}>Whoa there cowboy, you need to connect Twitter before you can start liking posts.</Text>

					<TouchableOpacity style={styles.connectButton} onPress={() => this.handlePress()}>
						<Text style={styles.connectButtonText}>Connect Twitter</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={styles.close}
					onPress={() => this.props.onModalClosePress()}
				>
					<Image source={require('./close.png')}/>
				</TouchableOpacity>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	close: {
		left: 0,
		top: 0,
		position: 'absolute',
		flexDirection: 'row',
		padding: 14,
		paddingTop: 35,
		backgroundColor: 'transparent',
	},
	instructionsContainer: {
		backgroundColor: '#2C95E6',
		flex: 1,
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
		top: Dimensions.get('window').height / 2 - 250,
		left: Dimensions.get('window').width / 2 - 375,
	},
	connectButton: {
		position: 'absolute',
		top: Dimensions.get('window').height - 96,
		left: 40,
		flexDirection: 'row',
		alignItems: 'center',
		width: Dimensions.get('window').width - 80,
		height: 56,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: 'white',
		borderWidth: 2,
		borderColor: 'rgba(255,255,255,0.25)',
		borderRadius: 28
	},
	connectButtonText: {
		flex: 1,
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
		color: '#2C95E6',
		backgroundColor: 'transparent'
	},
	connectButtonSocialLogo: {
		width: 24,
		height: 24
	}
});

const mapStateToProps = state => ({ twitterRequestToken: state.twitterRequestToken });

export default connect(mapStateToProps)(ConnectTwitter);