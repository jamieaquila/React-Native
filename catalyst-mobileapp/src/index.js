if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer
console.ignoredYellowBox = [ 
	'Warning: ReactNative.createClass is deprecated.',
	'Warning: ReactNative.createElement is deprecated.',
	'Warning: You are manually calling a React.PropTypes validation'
];

import React from 'react';
import { Platform } from 'react-native';
import Provider from './components/Provider';
import CodePush from "react-native-code-push";
import ActionSheet from "@expo/react-native-action-sheet";

export default class extends React.Component {
	static childContextTypes = {
		actionSheet: React.PropTypes.func
	}

	getChildContext() {
		return { actionSheet: () => this._actionSheetRef};
	}

	componentDidMount() {
		if (Platform.OS === 'ios') CodePush.sync();
	}

//change
	render() {
		return (
			<ActionSheet ref={component => this._actionSheetRef = component}>
				<Provider />
			</ActionSheet>
		);
	}
}
