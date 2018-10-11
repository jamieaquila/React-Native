import {StyleSheet, Dimensions, Platform} from "react-native";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  container: {
    flex: 1
  },
  navBar: {
    flexDirection:'row',
    height: Platform.OS === 'ios' ? 64 : 44,
    width: width,
    backgroundColor: "#e10333",
  },
  back_view: {
    flexDirection: 'row',
    marginLeft: 8.5,
    marginTop: Platform.OS === 'ios' ? 22 : 2
  },
  back_text: {
    fontSize: 17,
    color: '#ffffff',
    textAlign: 'left',
    marginLeft: 6,
    marginTop: 8
  },
  tabBar: {
    backgroundColor: '#f1f1f1',
    height: 49,
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  }
}
