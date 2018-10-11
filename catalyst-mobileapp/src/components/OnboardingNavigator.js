import React from 'react';
import { View, AsyncStorage, Platform, InteractionManager } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import buildStyleInterpolator from 'buildStyleInterpolator';
import Permissions from 'react-native-permissions';
import AuthNavigator from './AuthNavigator';
import { Onboarding } from './views';

import { connect } from 'react-redux';
import { globalVars } from '../global'
import { getLightshowTrigger } from '../actions/LightshowTriggerAction'
import { updateLocation } from '../actions/MessageActions' 

const NO_TRANSITION = () => ({
	...Navigator.SceneConfigs.FloatFromLeft,
	gestures: null,
	defaultTransitionVelocity: 100,
	animationInterpolators: {
		into: buildStyleInterpolator({opacity: { from: 1, to: 1, min: 1, max: 1, type: 'linear', extrapolate: false, round: 100 }}),
		out: buildStyleInterpolator({opacity: { from: 1, to: 1, min: 1, max: 1, type: 'linear', extrapolate: false, round: 100 }}),
	},
});

const FLOAT_FROM_LEFT_NO_GESTURE = () => ({...Navigator.SceneConfigs.FloatFromLeft, gestures: null });

class OnboardingNavigator extends React.Component {

	state = {
		configureScene: NO_TRANSITION
	}

	_renderScene(route, navigator) {
		var Component = route.component;

		return <Component navigator={navigator} route={route} {...route.passProps} />;
	}

	componentDidMount() {
		AsyncStorage.getItem('deviceHasOnboarded')
		.then(hasOnboarded => {
			if (hasOnboarded) return false;

			this.setState({ configureScene: FLOAT_FROM_LEFT_NO_GESTURE });
			this.refs.navigator.push({ component: Onboarding });
			AsyncStorage.setItem('deviceHasOnboarded', 'yes');
		})
		.catch(err => {
			// console.log(err)
		});

		if(globalVars.watchID){
			navigator.geolocation.clearWatch(globalVars.watchID);
		}
		
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.accessToken) {	
			if(nextProps.auth.role !== 'admin'){
				if(Platform.OS == 'android'){
					this.checkLocationPermission(nextProps.dispatch)
				}else{
					this.watchPosition(nextProps.dispatch)
					
				}
			}
			this.refs.navigator.pop();
		}
	}

	checkLocationPermission(dispatch) {
		InteractionManager.runAfterInteractions(() => {  
		  Permissions.checkMultiple(['location']).then(response => {  
			if(response.location === "authorized") {
				this.watchPosition(dispatch)
			}
	
			if(response.location === "undetermined") {
			  this._requestLocationPermission(dispatch);
			}
		  })
		});
	}

	_requestLocationPermission(dispatch){
		Permissions.request('location').then(response => {
		  if(response.location === "authorized") {
			this.watchPosition(dispatch)
		  }
		})
	}

	watchPosition(dispatch){
		globalVars.watchID = navigator.geolocation.watchPosition(
		  (position) => {
				let body = {
					lat: position.coords.latitude,
					long: position.coords.longitude
				}
				// console.log(body)
				// dispatch(getLightshowTrigger(body)) 
				dispatch(updateLocation(body))
			
		  },
		  (error) => {
				console.log(error)
		  },
		  {enableHighAccuracy: Platform.OS == 'android' ? false : true, timeout: 20000, maximumAge: 1000}
		);
	}  

	render() {
		return (
			<View style={{flex:1, backgroundColor: 'black' }}>
				<Navigator
					ref="navigator"
					configureScene={this.state.configureScene}
					renderScene={this._renderScene}
					initialRoute={{ component: AuthNavigator }}
				/>
			</View>
		);
	}
}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps)(OnboardingNavigator);
