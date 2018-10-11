	import { routes } from '../../../config'
import React from 'react';
import { View, Dimensions, StyleSheet, TouchableWithoutFeedback, Image, Animated, Platform, Easing, AsyncStorage } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import ExtraDimensions from 'react-native-extra-dimensions-android';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';

import { Composer } from '../../views';
import { MusicPlayer } from '../../molecules';
import { TabBarTab } from '../../atoms';
import { LogInOrSignUp } from '../../views'
import PhotoBooth from '../../../Festival/views/Photos'

import { replace, changeTab, clearNextRoute, clearNextRouteStackToReplace, pushRouteAtTabIndex , firstRouteAtTabIndex} from '../../../actions/RouteActions';
import { push as pushModal } from '../../../actions/ModalActions';
import Festival from '../../../Festival';
import Permissions from 'react-native-permissions';

import { isIphoneX } from 'react-native-iphone-x-helper'
var {
	width: deviceWidthIOS,
	height: deviceHeightIOS
} = Dimensions.get('window');

var deviceHeightAndroid = ExtraDimensions.get('REAL_WINDOW_HEIGHT');
var softMenuBarHeightAndroid = ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT');
var statusBarHeightAndroid = ExtraDimensions.get('STATUS_BAR_HEIGHT');

var initialCollapsedPos = (Platform.OS === 'ios') ? (isIphoneX() ? deviceHeightIOS - 70 : deviceHeightIOS - 50) : deviceHeightAndroid - softMenuBarHeightAndroid - statusBarHeightAndroid - 50;
var _collapsedPos = (Platform.OS === 'ios') ? (isIphoneX() ? deviceHeightIOS - 120 : deviceHeightIOS - 100) : deviceHeightAndroid - softMenuBarHeightAndroid - statusBarHeightAndroid - 100;
var _expandedPos = isIphoneX() ? -70 : -50;

var TabBar = React.createClass({
	mixins: [TimerMixin],
	_pos: new Animated.Value(initialCollapsedPos),

	getInitialState: function() {
	    return {
	      padding: 50,
	      windowWidth:deviceWidthIOS,
	      windowHeight:deviceHeightIOS
	    }
  	},
		cameraPermission : "",
		photoPermission : "",

  	onLayout(e) {
      const {width, height} = Dimensions.get('window');
      deviceHeightIOS = Dimensions.get('window').height;
      deviceWidthIOS = Dimensions.get('window').width;

      this.setState({ windowWidth:deviceWidthIOS,
      windowHeight:deviceHeightIOS});
  	},

	renderScene: function(route, navigator) {
		var Component = route.component;

		return <Component navigator={navigator} route={route} {...route.passProps} />;
	},

	componentWillReceiveProps: function(nextProps) {
		var { nextRouteToPush, nextRouteStackToReplace, firstRouteToPush } = nextProps;

		if (nextRouteToPush) {
			var targetNavigator = this.refs["navigator" + nextRouteToPush.tabIndex];
			var targetNavigatorRoutes = targetNavigator.getCurrentRoutes();

			targetNavigator.jumpTo(targetNavigatorRoutes[0]);
			this.setTimeout(() => targetNavigator.push(nextRouteToPush.route), 200);
			this.props.dispatch(clearNextRoute())

		} else if (nextRouteStackToReplace) {
			var targetNavigator = this.refs["navigator" + nextRouteStackToReplace.tabIndex];

			targetNavigator.immediatelyResetRouteStack(nextRouteStackToReplace.routeStack)
			this.props.dispatch(clearNextRouteStackToReplace());
		} else if (firstRouteToPush) {

			var targetNavigator = this.refs["navigator" + firstRouteToPush.tabIndex];
			var targetNavigatorRoutes = targetNavigator.getCurrentRoutes();
			targetNavigator.jumpTo(targetNavigatorRoutes[0]);
			this.props.dispatch(clearNextRoute())

		}


	},

	onComposerPermissionConfirmed: function() {
		 const { auth } = this.props;
		if(auth.role === 'admin'){
			this.props.dispatch(pushModal(
				{ component: Composer },
					() => ({...Navigator.SceneConfigs.FloatFromBottom, gestures: null })
				));
		}else{
				this.props.dispatch(pushModal(
					{ component: PhotoBooth },
						() => ({...Navigator.SceneConfigs.FloatFromBottom, gestures: null })
				));
		}
	},
	  _requestPhotoPermission: function() {

	    Permissions.request('photo').then(response => {
	      this.photoPermission = response;

            if(this.photoPermission === "authorized" && this.cameraPermission === "authorized") {
            	this.onComposerPermissionConfirmed();
		    }
	    })
	  },
	  _requestCameraPermission: function() {
	    Permissions.request('camera').then(response => {
	     this.cameraPermission = response;
	    })
	  },
	onComposerPress: function() {
		const { auth } = this.props;
		if(auth.accessToken){
			if (!(this.photoPermission === "authorized" && this.cameraPermission === "authorized") && Platform.OS === 'android') {
		        Permissions.checkMultiple(['camera', 'photo']).then(response => {
		          //response is an object mapping type to permission
							this.cameraPermission = response.camera;
							this.photoPermission = response.photo;

		          if(response.photo === "undetermined") {
		            this._requestPhotoPermission();
		          }
		          if(response.camera === "undetermined") {
		            this._requestCameraPermission();
		          }
		          if(response.photo === "authorized" && response.camera === "authorized") {
		          	this.onComposerPermissionConfirmed();
		          }
		        });
		    }else {
		    	this.onComposerPermissionConfirmed();
		    }


		}else{
			this.props.dispatch(pushModal(
				{ component: LogInOrSignUp },
				() => ({...Navigator.SceneConfigs.FloatFromBottom, gestures: null })
			));
		}

	},

	onTourPress: function(){
		const { auth, dispatch } = this.props;
		if(auth.accessToken){
			dispatch(changeTab(2))
		}else{
			this.props.dispatch(pushModal(
				{ component: LogInOrSignUp },
				() => ({...Navigator.SceneConfigs.FloatFromBottom, gestures: null })
			));
		}

	},

	showMusicPlayer: function() {
		var newCollapsedPos = (Platform.OS === 'ios') ? (isIphoneX() ? deviceHeightIOS - 120 : deviceHeightIOS - 100) : deviceHeightAndroid - softMenuBarHeightAndroid - statusBarHeightAndroid - 100;
		this.setTimeout(() => {
			Animated.timing(this._pos, {
				toValue: newCollapsedPos,
				duration: 250,
				easing: Easing.bezier(0.22, 0.61, 0.36, 1)
			}).start(() => this.setState({ padding: 100 }));
		}, 200);
	},

	festivalTabPressed: function() {
	    this.props.dispatch(changeTab(1));
	    this.props.dispatch(firstRouteAtTabIndex(1));
	},

	render: function() {
		const { tabs, currentRoute, auth, dispatch, lighshowTrigger } = this.props;
		// if(lighshowTrigger.trigger)
		// 	console.log(lighshowTrigger.trigger[0].forceStop)

		var tabBarPos = this._pos.interpolate({
			inputRange: [_expandedPos, _collapsedPos],
			outputRange: [ -51, 0],
			extrapolate: 'clamp'
		});

		return (
			<View style={{ flex: 1 }} onLayout={this.onLayout.bind(null, this)}>
				<View style={{ flex: 1, flexDirection: 'row', left: currentRoute.tabIndex * deviceWidthIOS * -1  }}>
					{
						tabs.map((tab, index) => {
							return (
								<View
									key={index}
									style={{ width: this.state.windowWidth }}
								>
									<Navigator
										ref={"navigator" + index}
										initialRouteStack={routes[tab.routePath].routeStack}
										renderScene={this.renderScene}
									/>
								</View>
							)
						})
					}
				</View>

				<View style={{ height: this.state.padding }} />

				<MusicPlayer
					onLayout={() => this.showMusicPlayer()}
					collapsedPos={_collapsedPos}
					expandedPos={_expandedPos}
					pos={this._pos}
				/>

				<Animated.View shouldRasterizeIOS={true} style={[ styles.tabBarContainer, { bottom: tabBarPos } ]}>
					<View style={styles.tabBarTopBorder} />
					<TabBarTab isActive={currentRoute.tabIndex === 0} image={require('./home.png')} onPress={() => dispatch(changeTab(0))} />
					<TabBarTab isActive={currentRoute.tabIndex === 1} image={require('./music.png')} onPress={() =>  dispatch(changeTab(1))}/>
					<TabBarTab image={require('./composer.png')} onPress={() => this.onComposerPress()}/>
					<TabBarTab isActive={currentRoute.tabIndex === 2} image={require('./activity.png')} onPress={() => this.onTourPress() }/>
					<TabBarTab isActive={currentRoute.tabIndex === 3} image={require('./profile.png')} onPress={() => dispatch(changeTab(3))}/>
				</Animated.View>

			</View>
		);
	}
});

const styles = StyleSheet.create({
	tabBarContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 50,
		backgroundColor: 'black',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	tabBarTopBorder: {
		position: 'absolute',
		top: -0.5,
		left: 0,
		right: 0,
		height: 0.5,
		backgroundColor: 'rgba(255,255,255,0.1)'
	}
});

const mapStateToProps = state => ({ auth: state.auth, lighshowTrigger: state.lightshowTrigger });

module.exports = connect(mapStateToProps)(TabBar);
