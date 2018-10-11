import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

var BUTTONS = [
  'Send to a Friend',
  'Share to Facebook',
  'Share to Twitter',
  'Buy on iTunes',
  'Save Album Art',
  'Cancel',
];

var CANCEL_INDEX = 5;

class ActionSheetForTrack extends React.Component {
  constructor(props) {
    super(props);

    this.state = { clicked: 'none' }
  }

  contextTypes: {
    actionSheet: React.PropTypes.func
  }

  showActionSheet() {
    this.context.actionSheet().showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX
    },
    (buttonIndex) => {
      this.setState({ clicked: BUTTONS[buttonIndex] });
    });
  }

  render() {
    return(
      <TouchableOpacity
        onPress={() => this.showActionSheet()}
        style={styles.ellipsis}>
        <Image source={require('./ellipsis.png')}/>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  ellipsis: {
    flex: 1, 
    alignItems: 'flex-end',
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24
  }
});

export default ActionSheetForTrack;
