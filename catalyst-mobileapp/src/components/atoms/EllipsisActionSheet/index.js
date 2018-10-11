import React from 'react';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';

var EllipsisActionSheet = React.createClass({

  contextTypes: {
    actionSheet: React.PropTypes.func
  },

  propTypes: {
    actions: React.PropTypes.array.isRequired,
    tintColor: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      tintColor: 'white'
    }
  },

  _showActionSheet: function() {
    const { actions, title } = this.props;

    var buttons = actions.map(action => action.name)
    buttons.push("Cancel");

    this.context.actionSheet().showActionSheetWithOptions({
      title: title,
      options: buttons,
      cancelButtonIndex: buttons.length - 1
    },
    clickedIndex => { 
      if (clickedIndex === buttons.length - 1) return
      actions[clickedIndex].action();
    });
  },

  render() {
    return(
      <TouchableOpacity
        onPress={() => this._showActionSheet()}
        style={styles.touchAreaStyle}
      >
        <View style={[ styles.dot, { backgroundColor: this.props.tintColor } ]} />
        <View style={[ styles.dot, { backgroundColor: this.props.tintColor } ]} />
        <View style={[ styles.dot, { backgroundColor: this.props.tintColor } ]} />
      </TouchableOpacity>
    );
  }

});

var styles = StyleSheet.create({
  touchAreaStyle: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    margin: 1,
    borderRadius: 2,
  }
});

module.exports = EllipsisActionSheet;
