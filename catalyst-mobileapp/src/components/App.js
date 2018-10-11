import React from 'react';
import { View, Platform, NativeModules, NativeEventEmitter, AsyncStorage } from 'react-native';
import Orientation from 'react-native-orientation'
import { connect } from 'react-redux';
import { togglePlayback, nextTrack, previousTrack } from '../actions/MusicPlayerActions';
import { refreshAuthStrategy } from '../actions/AuthActions';

import MusicControl from 'react-native-music-control';

// config
import { app as appConfig, tabBar, colors } from '../config'

// actions
import { getApp } from '../actions/AppActions'

// first party components
import { StatusBar } from './atoms'
import { TabBar } from './molecules'

const { SpotifyManager } = NativeModules;


class App extends React.Component {

	constructor(props) {
		super(props);

		this.spotifyStatus = null;
	}

	componentDidMount() {
		const { dispatch } = this.props;

		dispatch(getApp(appConfig.id))
		Orientation.lockToPortrait();

		this._setupMusicPlayerControls();

		this.spotifyManagerEmitter = new NativeEventEmitter(SpotifyManager);
		this.spotifyFailedListener = this.spotifyManagerEmitter.addListener('LoginFailed', () => { this.spotifyStatus = 'failed' });
		this.spotifySuccessListener = this.spotifyManagerEmitter.addListener('LoginSuccessful', () => { this.spotifyStatus = 'success' });
		this.spotifyEOTListener = this.spotifyManagerEmitter.addListener('FinishedPlayingTrack', () => { this.props.dispatch(nextTrack(false)) });


	}


	componentWillUnmount() {
		this.spotifyFailedListener.remove();
		this.spotifySuccessListener.remove();
		this.spotifyEOTListener.remove();
	}

	componentWillReceiveProps(nextProps) {
		const { app, user } = this.props;

		// Just got app deatils
		if(app.id == null && nextProps.app.id != null) {
			if (nextProps.app.settings.spotify) {
				SpotifyManager.initialize(nextProps.app.settings.spotify.clientId);
			}
		}

		// Just got user details
		if(user.currentUser == null && nextProps.user.currentUser != null) {
			if(nextProps.user.currentUser.authStrategyTypes.spotify) {
				const strategy = nextProps.user.currentUser.authStrategies.filter(s => s.type === 'spotify')[0];
				this.props.dispatch(refreshAuthStrategy(strategy.id));
			}
		}

		// User just logged into spoitfy
		if(user.isLoading && !nextProps.user.isLoading && nextProps.user.currentUser) {
			if(this.spotifyStatus === null || this.spotifyStatus === 'failed') {

				// Token found
				if (nextProps.user.currentUser.authStrategyTypes.spotify) {
					const strategy = nextProps.user.currentUser.authStrategies.filter(s => s.type === 'spotify')[0];
					SpotifyManager.setAccessToken(strategy.accessToken);
				}
			}
		}
	}

	_setupMusicPlayerControls = () => {
		const { dispatch } = this.props;

		// Setup controls
		MusicControl.enableBackgroundMode(true);
		MusicControl.enableControl('play', true);
		MusicControl.enableControl('pause', true);
		MusicControl.enableControl('nextTrack', true);
		MusicControl.enableControl('previousTrack', true);

		// Control feedback
		MusicControl.on('play', () => dispatch(togglePlayback()));
		MusicControl.on('pause', () => dispatch(togglePlayback()));
		MusicControl.on('nextTrack', () => dispatch(nextTrack()));
		MusicControl.on('previousTrack', () => dispatch(previousTrack()));
	}

	render() {
		const { route, app, auth, soketMessage } = this.props;	
		const { currentRoute, nextRouteToPush, nextRouteStackToReplace, firstRouteToPush  } = route;


		return (
				<View style={{ flex: 1, backgroundColor: 'black' }}>
					<TabBar
						auth={auth}
						tabs={tabBar.tabs}
						currentRoute={currentRoute}
						nextRouteToPush={nextRouteToPush}
						nextRouteStackToReplace={nextRouteStackToReplace}
						firstRouteToPush = {firstRouteToPush}
					/>
					{
						auth.role === 'admin'?
							<StatusBar />
						: soketMessage.startLightshowUser == false ?
							<StatusBar />
						: 
							null						
					}
				</View>
		);
	}

}

const mapStateToProps = state => ({ route: state.route, auth: state.auth, app: state.app, user: state.user, soketMessage: state.socketMessage });

export default connect(mapStateToProps)(App);
