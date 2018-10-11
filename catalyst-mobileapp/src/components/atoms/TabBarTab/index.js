import React from 'react';
import { TouchableWithoutFeedback, View, Image, StyleSheet, Animated } from 'react-native';


import colors from '../../../config/colors';

class TabBarTab extends React.Component {
	constructor(props) {
		super(props);

		this.state = { bounce: new Animated.Value(1) }
	}

	_scaleSmall() {
		Animated.spring( this.state.bounce, {
			toValue: .8,
			friction: 4
		}).start();
	}

	_scaleNormal() {
		Animated.spring( this.state.bounce, {
			toValue: 1,
			friction: 4
		}).start();
	}

	render() {
		var { onPress, isActive, style, activeStyle, image } = this.props;

		return (
			<TouchableWithoutFeedback
				onPress={onPress}
				onPressIn={() => this._scaleSmall()}
				onPressOut={() => this._scaleNormal()}>
				<View style={styles.tabItemContainer}>
					<View style={(isActive) ? activeStyle : style} >
						<Animated.Image
							style={
								{
									tintColor: (isActive) ? 'white' : colors.gray,
									transform: [{ scale: this.state.bounce }] 
								}
							}
							source={image}
							defaultSource={image}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

TabBarTab.propTypes = {
	onPress: 		React.PropTypes.func.isRequired,
	style: 			React.PropTypes.any.isRequired,
	activeStyle: 	React.PropTypes.any.isRequired,
	image: 			React.PropTypes.number.isRequired,
	isActive: 		React.PropTypes.bool
}

TabBarTab.defaultProps = {
	style: {
		paddingTop: 10,
		paddingBottom: 10,
	},
	activeStyle: {
		paddingTop: 10,
		paddingBottom: 10
	}
}

var styles = StyleSheet.create({
	tabItemContainer: {
		flex: 1,
		alignItems: 'center'
	}
});

export default TabBarTab
