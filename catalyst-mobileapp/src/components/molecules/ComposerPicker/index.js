import React from 'react';
import { StyleSheet, Text, View, Image, PanResponder, Animated, Dimensions, TouchableOpacity, Easing } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { connect } from 'react-redux';

import { push as pushModal } from '../../../actions/ModalActions'

import { Composer } from '../../views';
import Camera from '../../views/Composer/Camera';

import colors from '../../../config/colors';

var {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

var bubbles = [{
      text: 'Text', 
      color: '#2E91F7',
      onPress: function () { 
        this.props.dispatch(pushModal(
          { component: Composer }, 
          () => ({...Navigator.SceneConfigs.FloatFromBottom, gestures: null })
        ));
      },
      image: require('./text-bubble-icon.png')
  },
  {
      text: 'Camera', 
      color: '#2E91F7',
      onPress: function () { 
        this.props.dispatch(pushModal(
          { component: Composer, passProps: { attachmentRoute: { component: Camera } }  }, 
          () => ({...Navigator.SceneConfigs.FloatFromBottom, gestures: null })
        ));
      }, 
      image: require('./photo-bubble-icon.png')
  },
  // {'text': 'Photo', 'color': '#2E91F7'},
  // {'text': 'Video', 'color': '#2E91F7'},
];

class ComposerPicker extends React.Component {

  _bottomVal = new Animated.Value(96);
  bubbleTopVals = bubbles.map(() => new Animated.Value(72));
  bubbleImageScaleVals = bubbles.map(() => new Animated.Value(1));
  bubbleScaleVals = bubbles.map(() => new Animated.Value(0));
  bubbleXVals = bubbles.map(() => new Animated.Value(0));
  _plusSymbolRotationVal = new Animated.Value(0);
  _overlayOpacityVal = new Animated.Value(0);
  state = { bubblesVisible: false }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (gestureState.dy == 0) this.setState({ bubblesVisible: !this.state.bubblesVisible });
        else this.setState({ bubblesVisible: true });
      },
      onPanResponderMove: (evt, gestureState) => {
        const x = evt.nativeEvent.pageX;
        const y = evt.nativeEvent.locationY;

        const distanceBetweenBubble = ((this.bubbleXVals[0]._value - this.bubbleXVals[1]._value) * -1) / 2;

        bubbles.forEach((bubble, index) => {
          var bubbleWidthPlusDistanceWidth = this.bubbleXVals[index]._value + distanceBetweenBubble;
          var prevBubblePlusDistanceOffset = this.bubbleXVals[index - 1] ? this.bubbleXVals[index-1]._value + distanceBetweenBubble : 0;

          if (x > prevBubblePlusDistanceOffset && x < bubbleWidthPlusDistanceWidth && y > -120 && y < 16) {
            this._onBubbleHoverOn(index);
          } else {
            this._onBubbleHoverOff(index);
          }
        });

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if(!this.state.bubblesVisible) return false;

        const x = evt.nativeEvent.pageX;
        const y = evt.nativeEvent.locationY;
        const distanceBetweenBubble = ((this.bubbleXVals[0]._value - this.bubbleXVals[1]._value) * -1) / 2;

        // reset scale for hovered item
        Animated.parallel(
          this.bubbleImageScaleVals.map(imageScaleVal => Animated.spring(imageScaleVal, { toValue: 1 }))
        ).start();

        var dY = gestureState.dy;
        if(dY !== 0) {
          this.setState({ bubblesVisible: false });
        }


        bubbles.forEach((bubble, index) => {
          var bubbleWidthPlusDistanceWidth = this.bubbleXVals[index]._value + distanceBetweenBubble;
          var prevBubblePlusDistanceOffset = this.bubbleXVals[index - 1] ? this.bubbleXVals[index-1]._value + distanceBetweenBubble : 0;

          if (x > prevBubblePlusDistanceOffset && x < bubbleWidthPlusDistanceWidth && y > -120 && y < 0) {
            this._onBubblePress(index);
          }
        });

      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  _onBubbleHoverOn(bubbleIndex) {
    Animated.spring(this.bubbleImageScaleVals[bubbleIndex], {
      toValue: 1.395,
      tension: 80
    }).start();
  }

  _onBubbleHoverOff(bubbleIndex) {
    Animated.spring(this.bubbleImageScaleVals[bubbleIndex], {
      toValue: 1
    }).start();
  }

  _setDragZones(event, index) {
    var x = event.nativeEvent.layout.x;
    var y = event.nativeEvent.layout.y;

    this.bubbleXVals[index].setValue(x + 24);

  }

  _showBubbles() {
    Animated.stagger(
      50, 
      this.bubbleTopVals.map(topVal => Animated.spring(topVal, { toValue: -88, tension: 80 }))
    ).start();

    Animated.parallel(
      this.bubbleScaleVals.map(scaleVal => Animated.spring(scaleVal, { toValue: 1 }))
    ).start();

    Animated.timing(this._plusSymbolRotationVal, {
      toValue: 1,
      duration: 300,
      easing: Easing.bezier(.77,0,.175,1)
    }).start();

    Animated.timing(this._overlayOpacityVal, {
      toValue: 1,
      duration: 150,
      easing: Easing.linear
    }).start();
  }

  _hideBubbles() {
    Animated.stagger(
      50, 
      this.bubbleTopVals.map(topVal => Animated.spring(topVal, { toValue: 0, tension: 80 }))
    ).start();

    Animated.parallel(
      this.bubbleScaleVals.map(scaleVal => Animated.spring(scaleVal, { toValue: 0, fiction: 9 }))
    ).start();

    Animated.timing(this._plusSymbolRotationVal, {
      toValue: 0,
      duration: 300,
      easing: Easing.bezier(.77,0,.175,1)
    }).start();

    Animated.timing(this._overlayOpacityVal, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear
    }).start();
  }

  _onBubblePress(bubbleIndex) {
    bubbles[bubbleIndex].onPress.call(this)
    this.setState({ bubblesVisible: false });
  }

  componentDidUpdate() {
    this.state.bubblesVisible ? this._showBubbles() : this._hideBubbles();
  }

  render() {
    return (
      <View>
        <Animated.View onTouchStart={() => this.setState({bubblesVisible: false})} pointerEvents={this.state.bubblesVisible ? 'auto' : 'none'} style={[styles.overlay, {opacity: this._overlayOpacityVal} ]}/>
        <Animated.View style={[styles.container, {bottom: this._bottomVal} ]}>
          <View pointerEvents='box-none' style={styles.bubblesContainer}>
            {
              bubbles.map((bubble, index) => {
                return (
                  <Animated.View
                    onLayout={event => this._setDragZones(event, index)}
                    key={index}
                    style={
                      {
                        alignItems: 'center',
                        top: this.bubbleTopVals[index],
                        left: ( ( ( (bubbles.length * 56) - (deviceWidth - 112)) / (bubbles.length - 1)) * index) * -1,
                        transform: [
                          {scale: this.bubbleScaleVals[index]},
                        ],
                      }
                    }>
                    <TouchableOpacity onPress={() => this._onBubblePress(index)}>
                      <Animated.View
                        style={[styles.bubble, 
                          {
                            transform: [
                              {scale: this.bubbleImageScaleVals[index] },
                            ],
                          } 
                        ]}>
                        <Image
                          style={styles.bubbleImage}
                          source={bubbles[index].image}
                        />
                      </Animated.View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })
            }
          </View>
          
          
          <View {...this._panResponder.panHandlers} style={styles.triggerTouchableArea}>
            <View style={styles.triggerBorder}>
              <Animated.View
                pointerEvents='none'
                style={{
                  transform: [
                    { rotate: this._plusSymbolRotationVal.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) }
                  ]
                }}
              >
                <View style={styles.trigger}>
                  <View style={[ styles.rectangle, { top: 8, transform: [{ rotate: '90deg' }] } ]} />
                  <View style={styles.rectangle} />
                </View>
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 112,
    width: 0,
    height: 0,
  },
  triggerTouchableArea: {
    alignItems: 'center',
    left: (deviceWidth / 2) - 28,
    width: 56,
    height: 48,
  },
  triggerBorder: {
    padding: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 100
  },
  trigger: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
  },
  bubblesContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    paddingLeft: 56,
    paddingRight: 56,
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 28,
  },
  bubbleImage: {
    tintColor: colors.grayDark,
    transform: [
      {scale: 0.5}
    ],
  },
  overlay: {
    position: 'absolute',
    top: -deviceHeight + 70,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  rectangle: {
    top: -8,
    width: 4,
    height: 16,
    backgroundColor: 'white'
  }
});

const mapStateToProps = state => ({ musicPlayer: state.musicPlayer })
export default connect(mapStateToProps)(ComposerPicker);
