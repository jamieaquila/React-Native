import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { ConnectTwitter, ConnectFacebook } from '../molecules';

class ConnectSocialNetwork extends React.Component {

	renderScene(route, navigator) {
		var Component = route.component;

		return <Component navigator={navigator} route={route} {...route.passProps} />;
	}

	render() {
		return (
			<View style={{flex:1}}>
				<Navigator 
					renderScene={this.renderScene}
					initialRoute={{ 
						component: ConnectTwitter,
						passProps: {
							onModalClosePress: this.props.onModalClosePress
						}
					}}
				/>
			</View>
		);
	}
}

ConnectSocialNetwork.propTypes = {
	onModalClosePress: React.PropTypes.func.isRequired
}

export default ConnectSocialNetwork;
