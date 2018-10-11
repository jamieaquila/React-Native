import osmtogeojson                  from 'osmtogeojson'
import PropTypes                     from 'prop-types'
import React, { Component }          from 'react'
import { View }                      from 'react-native'
import Meteor, {withTracker}         from 'react-native-meteor'
import { withRouter }                from 'react-router-native'

import getCityVenues    from './helpers/getCityVenues'
import getVisibleCities from './helpers/getVisibleCities'
import isInsideBbox     from './helpers/isInsideBbox'
import isLoading        from '/modules/base/isLoading'
import venuesCache      from '/modules/cache/venues'
import Challenges       from '/modules/challenge/Challenges'
import MainMap          from './MainMap'

@withRouter
@withTracker((props) => {
  const me  = Meteor.user()
  Meteor.subscribe('users.counters')
  Meteor.subscribe('challenges.started')
  const startedChallenge = Challenges.findOne()
  const challengeVenue = startedChallenge && startedChallenge.getVenue()
  return {
    ...props,
    me,
    challengeDestination: challengeVenue && challengeVenue.location,
    cities: Meteor.collection('cities').find(),
    countries: Meteor.collection('countries').find(),
    subscribeToCityVenues: (cityName) => {
      Meteor.subscribe('venues.visibles', cityName)
    }
  }
})
export default class MainMapContainer extends Component {
  static propTypes = {
    challengeDestination:  PropTypes.object,
    cities:                PropTypes.array,
    countries:             PropTypes.array,
    history:               PropTypes.object,
    location:              PropTypes.object,
    me:                    PropTypes.object,
    subscribeToCityVenues: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.state = {
      error:     null,
      venues:    null,
    }
  }
  render() {
    const { challengeDestination, cities, countries, location, me } = this.props
    const { venues } = this.state
    return (
      <View style={{marginVertical: '2%', flex: 1}}>
        <MainMap
          challengeDestination={challengeDestination}
          cities={cities}
          countries={countries}
          enterVenue={this.enterVenue}
          getVisibleVenues={this.getVisibleVenues}
          hideVenues={this.hideVenues}
          location={location}
          venues={venues}
        />
      </View>
    )
  }
  enterVenue = (venue) => () => {
    console.log("enterVenue", venue)
    const query = (
      venue.properties.dbId ?
        { venueId: venue.properties.dbId } :
        { venueOsmId: venue.properties.id }
    )
    Meteor.call('users.enterInsideVenue', query, (err, venueId) => {
      if(err) {
        console.log(err)
      } else {
        venuesCache.setItem(venueId, venue)
        this.props.history.push(`/venue/${venueId}`)
      }
    })
  }
  getVisibleVenues = async ({s, w, n, e}) => {
    await this.loadingWrapper(() => {
      return new Promise(async (resolve) => {
        const cities = await getVisibleCities({s, w, n, e})
        if(!cities) return
        let osmObj = {elements: []}
        let waitingNb = cities.length
        cities.map(async (city) => {
          this.props.subscribeToCityVenues(city.name)
          const cityVenues = await getCityVenues(city.name, s, w, n, e)
          if(!cityVenues) return
          console.log("cityVenues", city.name, cityVenues.elements.length)
          osmObj.elements.push(...cityVenues.elements.filter(({lat, lon}) => {
            return isInsideBbox({lat, lon}, {s, w, n, e})
          }))
          waitingNb--
          if(waitingNb < cities.length) resolve()
          const osmVenues = osmtogeojson(osmObj)
          this.setState({venues: osmVenues})
        })
      })
    })
  }
  loadingWrapper = async (func, timeout = 1500) => {
    this.loading = true
    const time = Date.now()
    setTimeout(() => {
      //console.log("so?", this.loading, Date.now() - time)
      if(this.loading) {
        isLoading.set('value', true)
      }
    }, timeout)
    const result = await func.call()
    this.loading = false
    //console.log("time", Date.now() - time)
    if(!this.loading) isLoading.set('value', false)
    return result
  }
  hideVenues = () => {
    this.setState({venues: null})
  }
}
