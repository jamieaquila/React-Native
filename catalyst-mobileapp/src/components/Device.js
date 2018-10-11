import React from 'react';
import { View, Dimensions } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { connect } from 'react-redux';

import OnboardingNavigator from './OnboardingNavigator'

import { create } from '../actions/DeviceActions'

class Device extends React.Component {

	componentWillMount() {
		const { dispatch } = this.props;

		dispatch(create());
	}

	render() {
		const { item } = this.props.device;

		return <OnboardingNavigator />;
	}

}

const mapStateToProps = state => ({ device: state.device });

export default connect(mapStateToProps)(Device);
