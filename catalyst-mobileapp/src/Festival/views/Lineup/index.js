import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { NavigationBar } from '../../../components/molecules';
import PhotoView from 'react-native-photo-view';

import DayTab from './components/DayTab'

const SET_IMAGES = [
  require('../../images/sets/fri_set.jpg'),
  require('../../images/sets/sat_set.jpg'),
  require('../../images/sets/sun_set.jpg')
]

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Lineup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  _tabSelected = (index) => {
    this.setState({activeTab: index})
  }

  render() {
    const { activeTab } = this.state;
    const { navigator, app } = this.props;

    const { lineup } = app.settings.rollingLoudInfo;
    const lineupLabels = lineup.map(i => i.label);

    return (
      <View style={{flex: 1}}>
        <NavigationBar
          navigator={navigator}
          title="Lineup"
        />
        <View style={styles.content}>
          <View style={styles.tabs}>
            { lineupLabels.map((item, index) => (
              <DayTab
                key={index}
                text={item}
                style={styles.tabItem}
                active={activeTab === index}
                onPress={() => this._tabSelected(index)}
              />
            ))}
          </View>
          <PhotoView
            resizeMode="contain"
            source={{ uri: lineup[activeTab].imageURL }}
            androidScaleType="fitCenter"
            style={styles.setImage}
            maximumZoomScale={3}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  tabs: {
    height: 34,
    flexDirection: 'row',
    margin: 15
  },
  tabItem: {
    flex: 3
  },
  lineupItem: {
    marginBottom: 15
  },
  setImage: {
    borderWidth: 0,
    alignSelf: 'stretch',
    flex: 1
  }
})

const mapStateToProps = state => ({
  app: state.app
});

export default connect(mapStateToProps)(Lineup);