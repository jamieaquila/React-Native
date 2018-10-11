import React from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { isIphoneX } from 'react-native-iphone-x-helper'
import KeepAwake from 'react-native-keep-awake';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment';
import { app, api } from '../config';
import ioS from '../helpers/socket-client'; 

// actions
import { pushSuccess, popSuccess } from '../actions/ModalActions';


// first party components
import App from './App'
import { NotificationBanner } from './atoms'

import { MessageThread, FeedItemDetail } from './views';
import { clearLightshow} from '../actions/DeeplinkActions';
import { announce } from '../actions/MessageActions';
import LightshowBar from './molecules/LightshowBar'
import { 
	setLightshowUser,
	getLightshowDetail,
	initializeData
} from '../actions/LightshowTriggerAction'

import { stopLightshowWithoutCallApi, initStartLightshow, startedLightshowUser, endedLightshowUser } from '../actions/MessageActions'

const { width, height } = Dimensions.get('window');

class ModalNavigator extends React.Component {

	constructor(props) {
		super(props);
		this.state ={
			lightshowBarVisible: false,
			lightshowDetailId: '',
			currentBgColor: '',
			// lightshowBarVisible: true,
			// lightshowDetailId: 134
		}
		this.calculateStatus = false
		this.announce = false
		this.stop = true
	  }

	renderScene(route, navigator) {
		var Component = route.component;

		return <Component navigator={navigator} route={route} {...route.passProps} />;
	}

	componentDidMount() {
		const { dispatch, auth } = this.props;		
		
		this.refs.navigator.navigationContext.addListener('willfocus', event => {
			const { dispatch } = this.props;

			if (event._currentTarget._currentRoute.root) {
				dispatch(popSuccess());
			} else {
				dispatch(pushSuccess());
			}
		});

		setTimeout(() => {
			this.registerUserListeners()
		}, 500)
		
	}

	componentWillUnmount(){
		KeepAwake.deactivate();
	}

	componentDidUpdate(prevProps) {
		if (this.props.modal.targetRoute) {
			this.refs.navigator.push(this.props.modal.targetRoute);
		}
	}	

	componentWillReceiveProps(nextProps) {
		if(nextProps.auth.userId && nextProps.auth.needsAuth === false && !this.announce) {
			nextProps.dispatch(announce());
			this.announce = true;
		}

		if(nextProps.lightshowTrigger.lightshowDetail){
			if(!this.calculateStatus){
				this.calculateStatus = true
				this.calculateColors(nextProps.lightshowTrigger.lightshowDetail.colors, nextProps.lightshowTrigger.lightshowDetail.lightshowtrigger[0].startDateTime)
				let body = {
					user: nextProps.auth.userId,
					lightshowdetails: nextProps.lightshowTrigger.lightshowDetail
				}
				nextProps.dispatch(setLightshowUser(body))
			}
		}else{
			this.calculateStatus = false
			this.stop = true
		}

		if (nextProps.modal.shouldPop) this.refs.navigator.pop();

		if(nextProps.deeplink.deeplinkType === "lightshow") {
			console.log("ModalNavigator", "lightshowViewStart");
		 	this.onPressLightshowViewStart();
		 	nextProps.dispatch(clearLightshow());

		}
	}

	registerUserListeners(){
		const { dispatch, auth } = this.props;		
		ioS.socket.on('adminstartlightshow', function(msg){                
                
        }.bind(this));
    
        ioS.socket.on('adminstoplightshow', function(msg) {
			// console.log('receive stopLightshow admin', msg);
            dispatch(stopLightshowWithoutCallApi(msg.lightshowdetails))
		}.bind(this));	
		
		ioS.socket.on('startLightshow', function(msg){
			// console.log('receive startLightshow user', msg);
			if(auth.role != 'admin'){	
				dispatch(startedLightshowUser())		
				this.setState({
					lightshowBarVisible: true,
					lightshowDetailId: msg.lightshowdetails
				})				
			}
		}.bind(this));
	
		ioS.socket.on('stopLightshow', function(msg) {			
			if(auth.role != 'admin'){
				// this.stop = true
				// this.calculateStatus = false
				dispatch(endedLightshowUser())
				dispatch(initializeData())
				this.setState({
					lightshowBarVisible: false,
					lightshowDetailId: ''
				})
			}			
		}.bind(this));	

		ioS.socket.on('connect', function(){
			if(auth && (auth.role == 'admin' || auth.role == 'user'))
		      dispatch(announce());
		  }.bind(this));
	}


	// lightshow and lightshow bar
	changeColor(arr, idx){
		const { dispatch } = this.props;
		setTimeout(() => {
			idx++
			if(idx >= arr.length){
				// this.stop = true
				// this.calculateStatus = false
				dispatch(initializeData())
			}else{
				this.setState({
					currentBgColor: arr[idx].color
				}, () => {
					if(!this.stop)
						this.changeColor(arr, idx)
				})
			}			
		}, arr[idx].duration)
	}

	getSecFromString(duration){
		let timeArr = duration.split(":")
		let h = parseInt(timeArr[0])
		let m = parseInt(timeArr[1])
		let s = parseInt(timeArr[2])
		let ms = parseInt(timeArr[3])

		let milliSec = 0
		if(h > 0) milliSec = h * 3600000		
		if(m > 0) milliSec += m * 60000
		if(s > 0) milliSec += s * 1000
		if(ms > 0) milliSec += ms
		return milliSec
	}

	calculateColors(colors, startTimeStr){
		let arr = []
		for(var i = 0 ; i < colors.length ; i++){
			let col = colors[i].color 
			if(col == 'Random') col = '#'+(Math.random()*0xFFFFFF<<0).toString(16)
			col = !col.includes('#') ? ('#' + col) : col

			let du = this.getSecFromString(colors[i].duration)
			if(du == 0) continue
			let screen = {
				color: col,
				duration: this.getSecFromString(colors[i].duration)
			}
			arr.push(screen)
		}
		
		if(arr.length == 0) return;

		let curTime = new Date(new Date().toISOString()).getTime()
		let startTime = new Date(startTimeStr).getTime()
		let deltaTime = curTime - startTime
		let idx = 0
		let totalDuration = 0
		for(var i = 0 ; i < arr.length ; i++){
			if(totalDuration < deltaTime){
				totalDuration += arr[i].duration
			}else{
				idx = i - 1
				arr[i - 1].duration = totalDuration - deltaTime
				break;
			}
		}

		this.setState({
			currentBgColor: arr[idx].color
		}, () => {
			this.stop = false
			this.changeKeepAwake(true)
			this.changeColor(arr, idx)
		})	
	}	

	changeKeepAwake(status){
		if(status){
			KeepAwake.activate();
		}else{
			KeepAwake.deactivate()
		}
	}

	onPressLightshowViewStart(){
		const { dispatch } = this.props;
		dispatch(getLightshowDetail(this.state.lightshowDetailId))
	}

	onPressLightshowViewEnd(){
		const { dispatch } = this.props;
		
		// this.stop = true
		// this.calculateStatus = false
		dispatch(initializeData())
		this.changeKeepAwake(false)		
	}

	render() {
		const { modal, auth, dispatch  } = this.props;
		return (			
			<View style={[{flex: 1}, isIphoneX() && {paddingTop:20}]}>
				<Navigator 
					ref="navigator"
					configureScene={modal.configureScene}
					renderScene={this.renderScene}
					initialRoute={{
						component: App,
						root: true
					}}
				/>
				<NotificationBanner />
				{
					auth.accessToken && (auth.role !== 'admin') 
					&& this.state.lightshowBarVisible &&
					<LightshowBar onPress={() => { this.onPressLightshowViewStart() }} />					
				}
				{
					!this.stop &&
					<View style={{
						position:'absolute', 
						width: width, 
						height: height, 
						zIndex:10, 
						backgroundColor: this.state.currentBgColor
						}}
						>
						<TouchableOpacity style={{marginTop:40, marginLeft:15}} onPress={() => {
							this.onPressLightshowViewEnd()								
							}}>
							<Icon style={{color:'white'}} name="times-circle" size={25}/> 
						</TouchableOpacity>
					</View>
				}
			</View>
			
		)
	}

}

const mapStateToProps = state => ({ modal: state.modal, auth: state.auth, lightshowTrigger: state.lightshowTrigger, deeplink: state.deeplink, soketMessage: state.socketMessage });

export default connect(mapStateToProps)(ModalNavigator);
