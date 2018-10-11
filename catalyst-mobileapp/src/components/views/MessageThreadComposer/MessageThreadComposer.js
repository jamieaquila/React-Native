import React from 'react';
import { Animated, View, Text, Image, TextInput, TouchableOpacity, Dimensions, DeviceEventEmitter, StyleSheet, InteractionManager, ScrollView, Easing } from 'react-native';


import { connect } from 'react-redux';

import { pop as modalPop } from '../../../actions/ModalActions';
import { setMessage, clear, create, created } from '../../../actions/MessageThreadComposerActions';

import { colors } from '../../../config';

import { Pop } from '../../atoms';

var {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window')

var AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

class MessageThreadComposer extends React.Component {

  componentWillMount() {
    this.keyboardWillShowListener = DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    this.keyboardWillHideListener = DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
  }

  state = { 
    visibleHeight: new Animated.Value(deviceHeight),
    text: '',
    height: 32,
  }

  onClosePress() {
    const { dispatch } = this.props;

    dispatch(modalPop());
    this.refs.message.blur();
    InteractionManager.runAfterInteractions(() => dispatch(clear()));
  }

  onSubmitPress() {
    const { dispatch, messageThreadComposer } = this.props;

    if (messageThreadComposer.canSubmit) dispatch(create());
  }

  keyboardWillShow (e) {
    let newSize = Dimensions.get('window').height - e.endCoordinates.height

    Animated.timing(this.state.visibleHeight, {
      toValue: newSize,
      duration: e.duration,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
  }

  keyboardWillHide (e) {
    Animated.timing(this.state.visibleHeight, {
      toValue: deviceHeight,
      duration: e.duration,
      easing: Easing.bezier(.465,.95,.85,.935)
    }).start();
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    if (nextProps.messageThreadComposer.hasCreated) {
      this.refs.message.blur(); 
      dispatch(modalPop());
      dispatch(created());
      InteractionManager.runAfterInteractions(() => dispatch(clear()));
    }
  }

  _animateInputHeight(text) {
    var numberOfLines = Math.floor(text.length / 36) + 1

    Animated.spring(this._inputHeight, {
      toValue: numberOfLines * 32
    }).start()
  }

  render() {
    const { dispatch, app, messageThreadComposer } = this.props;

    return(
      <Animated.View style={{height: this.state.visibleHeight}}>
        <ScrollView
          scrollsToTop={false}
          style={{ flex: 1}}
        >
          <View style={{ flex: 1, height: 64, flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 8, paddingRight: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' }}>
            <View style={{ flex: 1 }}/>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '900', letterSpacing: 0.1, color: colors.grayDark }}>New message</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Image style={{width: 40, height: 40, backgroundColor: colors.grayLight, borderRadius: 20}} source={{uri: app.settings.avatarURL}}/>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16,  }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 8, fontSize: 15, color: colors.gray }}>To:</Text>
              <View style={{backgroundColor: app.styles.primaryColor, padding: 8, borderRadius: 20}}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>All Fans</Text>
              </View>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {/*<Image style={{ tintColor: app.stylesgrayLight }} source={require('./chevron.png')}/>*/}
            </View>
          </View>
        </ScrollView>
        <View style={styles.textInputAndSubmitButtonOutterContainer}>
          <View style={styles.textInputAndSubmitButtonInnerContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                ref="message"
                multiline={true}
                onChange={(event) => {
                  this.setState({
                    text: event.nativeEvent.text,
                    height: event.nativeEvent.contentSize.height,
                  });
                }}
                placeholder={"Type a new message…️"}
                placeholderTextColor={colors.grayLight}
                selectionColor={app.styles.primaryColor}
                style={[styles.textInput, 
                  {
                    height: Math.max(32, this.state.height < 120 ? this.state.height : 120),
                    color: colors.grayDark,
                    backgroundColor: colors.grayLighter,
                  } 
                ]}
                onChangeText={text => dispatch(setMessage(text))}
                value={messageThreadComposer.item.message}
              />
            </View>
            <View style={{ flex: 2 }}>
              <TouchableOpacity 
                onPress={() => this.onSubmitPress()}
                activeOpacity={messageThreadComposer.canSubmit ? 0.4 : 1}
                style={[styles.submitButton, { borderColor: colors.grayLighter }, messageThreadComposer.canSubmit && { backgroundColor: app.styles.primaryColor, borderColor: app.styles.primaryColor }]}
              >
                <Text style={[styles.submitText, { color: colors.grayLighter }, messageThreadComposer.canSubmit && styles.submitTextReady]}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', top: 8, }}>
          <Pop 
            onPress={() => this.onClosePress()}
            iconType='x'
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 0 }}/>
        </View>
      </Animated.View>
    );
  }
}

var styles = StyleSheet.create({
  iconsTouchableContainer: {
    padding: 16,
    width: 56,
  },
  submitButton: {
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 40, 
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'transparent'
  },
  submitText: {
    fontSize: 16, 
    fontWeight: '700'
  },
  submitTextReady: {
    color: 'white'
  },
  textInputAndSubmitButtonOutterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8
  },
  textInputAndSubmitButtonInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInputContainer: {
    flex: 8,
    marginRight: 8
  },
  textInput: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -1,
    borderRadius: 4,
    paddingTop: 2,
    paddingLeft: 8
  }
});

var mapStateToProps = state => ({ app: state.app, messageThreadComposer: state.messageThreadComposer });

export default connect(mapStateToProps)(MessageThreadComposer);
