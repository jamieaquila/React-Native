import React from 'react';
import { Linking } from 'react-native';

import Device from './Device'

import { connect } from 'react-redux';

import { replace } from '../actions/RouteActions'

import { parseURLScheme } from '../helpers'

import Platform from 'Platform';

class Router extends React.Component {

	componentWillMount() {
		if (Platform.OS === 'android') {
			Linking.getInitialURL().then(url => this._handleOpenURL({url: url})).catch(() => {})
	  	}
		else {
			Linking.addEventListener('url', this._handleOpenURL.bind(this));
		}
	}

	componentWillUnmount() {
		
		if (Platform.OS !== 'android') {
			Linking.removeEventListener('url', this._handleOpenURL.bind(this));
		}
	}

	_handleOpenURL(event) {
		const { dispatch } = this.props;		
		var routePath = parseURLScheme(event.url).path;
		if (routePath) dispatch(replace(routePath));
	}

	render() {
		return <Device />;
	}

}

export default connect()(Router);
