import React from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';


import { connect } from 'react-redux';

class LoadingAnimation extends React.Component {
  _bars = [...Array(7)].map(() => new Animated.Value(0.2));
  
  componentDidMount() {
    this.animateAll();
  }

  getAllAnimations() {
    return [...Array(7)].map((val, i) => this._barAnimation(i));
  }

  animateAll() {
    var animations = this.getAllAnimations();
    Animated.parallel(animations).start(() => this.animateAll());
  }

  _barAnimation(i) {
    return Animated.sequence([
      Animated.timing(this._bars[i], {toValue: 1, duration: 300, delay: (i == 0) ? 0 : (i == 1) ? 100 : (i == 2) ? 200 : (i == 3) ? 300 : (i == 4) ? 200 : (i == 5) ? 100 : (i == 6) ? 0 : 0, easing: Easing.inOut(Easing.ease)}),
      Animated.timing(this._bars[i], {toValue: 0.2, duration: 300, easing: Easing.inOut(Easing.ease)}),
    ]);
  }

  render() {
    const { app } = this.props;

    return (
      <View style={[styles.barsContainer, this.props.style]}>
        {
          [...Array(7)].map((val, i) => {
            return <Animated.View style={{ transform: [{ scaleY: this._bars[i] }], flex: 1, height: 40, margin: 1, backgroundColor: app.styles.primaryColor }} />;
          })
        }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  barsContainer: {
    width: 40,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

var mapStateToProps = state => ({ app: state.app })

export default connect(mapStateToProps)(LoadingAnimation);
