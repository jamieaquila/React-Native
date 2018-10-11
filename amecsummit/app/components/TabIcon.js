import React, {
  PropTypes,
} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { Images } from '../themes'

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
};


const TabIcon = (props) => (props.title == 'Agenda' ?
  (<View style={{flexDirection:'column', alignItems: 'center'}}>
    <Image source={props.selected ? Images.agenda_selected : Images.agenda} style={styles.selected_icon} />
    <Text style={{ color: props.selected ? '#e10333' : '#8a8a8a', fontSize: 10, paddingTop: 4}}>{props.title}</Text>
  </View>) : props.title == 'Summit' ?
  (<View style={{flexDirection:'column', alignItems: 'center'}}>
    <Image source={props.selected ? Images.summit_selected : Images.summit} style={styles.selected_icon} />
    <Text style={{ color: props.selected ? '#e10333' : '#8a8a8a', fontSize: 10, paddingTop: 4}}>{props.title}</Text>
  </View>) : props.title == 'Map' ?
  (<View style={{flexDirection:'column', alignItems: 'center'}}>
    <Image source={props.selected ? Images.map_selected : Images.map} style={styles.selected_icon} />
    <Text style={{ color: props.selected ? '#e10333' : '#8a8a8a', fontSize: 10, paddingTop: 4}}>{props.title}</Text>
  </View>) : (<View style={{flexDirection:'column', alignItems: 'center'}}>
    <Image source={props.selected ? Images.more_selected : Images.more} style={styles.selected_icon} />
    <Text style={{ color: props.selected ? '#e10333' : '#8a8a8a', fontSize: 10, paddingTop: 4}}>{props.title}</Text>
  </View>)
);

var styles = StyleSheet.create({
  selected_icon:{
    width: 25,
    height: 25
  }
});

TabIcon.propTypes = propTypes;

export default TabIcon;
