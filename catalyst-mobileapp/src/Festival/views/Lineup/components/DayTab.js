import React, { Component } from 'react';
import {
  StyleSheet,
  View, Text,
  TouchableHighlight
} from 'react-native'

const DayTab = ({text, active, style, onPress}) => {
  const tabStyles = [styles.container, style];
  if(active) tabStyles.push(styles.active)

  return (
    <TouchableHighlight style={tabStyles} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 20,
    padding: 8
  },
  active: {
    borderColor: '#fff',
  },
  text: {
    color: '#FFF',
    textAlign: 'center'
  }
})

export default DayTab;