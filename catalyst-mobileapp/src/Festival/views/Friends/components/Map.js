import React, { Component, PropTypes  } from 'react';
import { StyleSheet, Image, View, Text, Platform } from 'react-native';
import MapView from 'react-native-maps';
import { app, api } from '../../../../config'
import MyLocationMarker from './MyLocationMarker';
import albumReducer from '../../../../reducers/albumReducer';
import moment from 'moment';

const styles = StyleSheet.create({
  map: {
    // top:64,
    flex:2
  },
  avatarImage: {       
    borderColor: '#fff',
    borderWidth: 2,
    width: 54,
    height: 54,
    borderRadius: 27,
    zIndex:100,
  },
}),
customStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
];

class FriendMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: this.props.region
        };
      }
    
    componentWillMount() {

    }
    
    componentDidMount() {     
    }
    
    onRegionChange = (region) => {
      // this.setState({ region });
      
    }

    onRegionChangeComplete = (region) => {
      this.props.regionChangeComplete({region})
    }
    
    randomColor = () =>{
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }  

    getDateString(date){
      let dateStr = moment(date).format("MM/DD/YY hh:MM a")
      let dateArr = dateStr.split(" ")
      return "last seen " + dateArr[0] + " at " + dateArr[1] + " " + dateArr[2]
      
    }
    
    renderCallOut(marker){
      return (
        <MapView.Callout tooltip>
          <View style={{backgroundColor:'#fff', width:202, padding:8, borderRadius:10, borderColor:'lightgray', borderWidth:2}}>
            <View style={{alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontWeight:'bold'}}>{marker.user.name}</Text>
            </View>
            <View style={{alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:12}} >{this.getDateString(marker.location.lastCheckIn)}</Text>
            </View>
          </View>
        </MapView.Callout>
      )
    }

    renderFriendMarkers(friends){
      let friendMarkers = friends.map((marker, i) => {
        return (
          <MapView.Marker
            key={i}
            coordinate={marker.location}  
            flat={true}                              
          >   
            <Image style={[styles.avatarImage, Platform.OS == 'android' && {borderRadius: 0}]} source={{uri: marker.user.profileImageUrl}} >
              <Text style={{width:0, height:0}}>{Math.random()}</Text>
            </Image>
            {
              this.renderCallOut(marker)
            }
          </MapView.Marker>
        )
      })
      return friendMarkers
    }

      render() {
        const { myLocation, friends } = this.props;     
        return (
          <MapView      
            ref={ref => { this.map = ref; }}
            region={this.props.region}
            onRegionChange={this.onRegionChange}
            onRegionChangeComplete={this.onRegionChangeComplete}
            style={styles.map}
            showsUserLocation={true}
            showsMyLocationButton={true}
            customMapStyle={customStyle}
          >
          {/* <MyLocationMarker 
            myLocation={myLocation}
          /> */}
          {
            friends.length > 0 &&
            this.renderFriendMarkers(friends)
          }
          </MapView>
        );
  }


}

const propTypes = {
  myLocation: PropTypes.func,
};

export default FriendMap;