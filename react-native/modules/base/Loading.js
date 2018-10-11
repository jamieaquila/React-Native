import PropTypes from 'prop-types'
import React     from 'react'
import { StyleSheet, View }  from 'react-native'
import Spinner   from 'react-native-loading-spinner-overlay'

function Loading({ color, visible }) {
  return (
    <View style={styles.container}>
      <Spinner
        animation="fade"
        overlayColor={color}
        textContent={"Loading..."}
        textStyle={{color: '#FFF'}}
        visible={visible}
      />
    </View>
  )
}

Loading.propTypes = {
  color:   PropTypes.string,
  visible: PropTypes.bool,
}
Loading.defaultProps = {
  visible: true
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
})
