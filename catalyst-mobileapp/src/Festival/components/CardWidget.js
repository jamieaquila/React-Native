import React from 'react';
import {
  StyleSheet,
  View, Text, Image,
  TouchableOpacity
} from 'react-native'

const CardWidget = ({style, title, onPress, image}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={image}
        />
      </View>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

CardWidget.defaultProps = {
  style: {}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 150,
    height: 100,
    borderRadius: 6,
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.1,
    marginTop: 10
  },
  imageContainer: {
    backgroundColor: '#F4F4F4',
    borderRadius: 30,
    padding: 10,
    width: 60,
    height: 60,
    alignSelf: 'center'
  },
  image: {
    width: 40,
    height: 40,
  }
})

export default CardWidget;