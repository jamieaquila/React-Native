	import React from 'react';
import { View, Dimensions, Linking } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import Notifications  from './Notifications'
import { LogInOrSignUp } from './views'
import { connect } from 'react-redux';
import { parseURLScheme } from '../helpers'
import { Facebook, Instagram, Twitter, Youtube} from './views/ConnectSocialMedia';
import Platform from 'Platform';

import SafariView from 'react-native-safari-view';

import { auth, authFromStorage } from '../actions/AuthActions'

class Auth extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			modalOpened: false
		}
	}

	componentWillMount() {
		if (Platform.OS === 'android') {
			//Linking.getInitialURL().then(url => this._handleOpenURL({ url })).catch(() => {})
			Linking.addEventListener('url', this._handleOpenURL.bind(this));
		} else {
			Linking.addEventListener('url', this._handleOpenURL.bind(this));
		}
		this.props.dispatch(authFromStorage());
	}

	componentWillUnmount() {
		if (Platform.OS !== 'android') {
			Linking.removeEventListener('url', this._handleOpenURL.bind(this));
		}
	}

	_handleOpenURL(event) {
		console.log("handle open url");
		const { dispatch } = this.props;
		const url = parseURLScheme(event.url);
		var permissions = {}

		switch (url.path) {
			case '/SpotifyCredentials':
				credential = {
					strategy: 'spotify',
					accessToken: url.query.accessToken,
					refreshToken: url.query.refreshToken,
					expiresIn: url.query.expiresIn
				}
				dispatch(auth(credential));
				SafariView.isAvailable().then(SafariView.dismiss).catch(() => console.log("Android Platform"));
			break;
			case '/TwitterCredentials':
				credential = {
					strategy: 'twitter',
					accessToken: url.query.accessToken,
					accessTokenSecret: url.query.accessTokenSecret
				};
				dispatch(auth(credential));
				SafariView.isAvailable().then(SafariView.dismiss).catch(() => console.log("Android Platform"));
			break;
			case '/FacebookCredentials':
				credential = {
					strategy: 'facebook',
					accessToken: url.query.accessToken,
					expiresIn: url.query.expiresIn
				};
				dispatch(auth(credential));
				SafariView.isAvailable().then(SafariView.dismiss).catch(() => console.log("Android Platform"));
			break;
			case '/InstagramCredentials':
				credential = {
					strategy: 'instagram',
					accessToken: url.query.accessToken,
					expiresIn: url.query.expiresIn
				};
				dispatch(auth(credential));
				SafariView.isAvailable().then(SafariView.dismiss).catch(() => console.log("Android Platform"));
				break;
			case '/GoogleCredentials':	
				console.log(JSON.stringify(url.query));
				credential = {
					strategy: 'google',
					accessToken: url.query.accessToken,
					refreshToken: url.query.refreshToken,
					expiresIn: url.query.expiresIn
				};

				dispatch(auth(credential));
				SafariView.isAvailable().then(SafariView.dismiss).catch(() => console.log("Android Platform"));
				break;
			case '/YouTubeCredentials':
				credential = {
					strategy: 'youtube',
					accessToken: url.query.accessToken,
					refreshToken: url.query.refreshToken,
					expiresIn: url.query.expiresIn
				};
				dispatch(auth(credential));
				SafariView.isAvailable().then(SafariView.dismiss).catch(() => console.log("Android Platform"));
				break;
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.needsAuth && !this.state.modalOpened) {
			if (nextProps.auth.accessToken && nextProps.auth.platform) {
				switch (nextProps.auth.platform) {
					case 'facebook':
						this.refs.navigator.push({
							component: Facebook
						});
						this.setState({modalOpened: true});
						break;
					case 'instagram':
						this.refs.navigator.push({
							component: Instagram
						});
						this.setState({modalOpened: true});
						break;
					case 'twitter':
						this.refs.navigator.push({
							component: Twitter
						});
						this.setState({modalOpened: true});
						break;
					case 'youtube':
						this.refs.navigator.push({
							component: Youtube
						});
						this.setState({modalOpened: true});
						break;
					default:
						break;
				}
			} else {
				this.refs.navigator.push({
					component: LogInOrSignUp,
					passProps: {onModalClosePress: () => this.onModalClosePress()}
				});
				this.setState({modalOpened: true});
			}
		} else if (!nextProps.auth.needsAuth && this.state.modalOpened) {
			this.refs.navigator.jumpBack();
			this.setState({ modalOpened: false});
		}
	}

	componentDidMount() {
		this.refs.navigator.navigationContext.addListener('willfocus', (route) => {
			if (route._data.route.root) this.state.modalOpened = false;
		});
	}

	configureScene(route) {
		var sceneConfig = Navigator.SceneConfigs.FloatFromBottom
		sceneConfig.gestures.pop.edgeHitWidth = Dimensions.get('window').height * 0.8;

		return sceneConfig;
	}

	renderScene(route, navigator) {
		var Component = route.component;

		return <Component navigator={navigator} route={route} {...route.passProps} />;
	}

	onModalClosePress() {
		this.refs.navigator.pop();
	}

	render() {
		return (
			<View style={{flex:1, backgroundColor: 'black' }}>
				<Navigator
					ref="navigator"
					configureScene={this.configureScene}
					renderScene={this.renderScene}
					initialRoute={{
						component: Notifications,
						root: true
					}}
				/>
			</View>
		);
	}

}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps)(Auth);
