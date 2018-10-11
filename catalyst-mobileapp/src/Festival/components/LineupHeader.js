import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

const LINEUP_IMAGE = 'https://scontent.cdninstagram.com/t51.2885-15/s750x750/sh0.08/e35/18094639_107196969847502_7086189532906782720_n.jpg';

const LineupHeader = ({onPress}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{uri: LINEUP_IMAGE}}
      />
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <Text style={styles.button}>View Lineup</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  image: {
    height: 200,
    width: null
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(157,33,147,0.3)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    borderRadius: 20,
    backgroundColor: '#FFF',
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30
  },
  button: {
    fontSize: 12,
    fontWeight: '800'
  }
})

export default LineupHeader;