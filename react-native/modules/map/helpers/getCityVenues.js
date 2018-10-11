import venuesCache   from '/modules/cache/venues'
import Venues        from '/modules/venue/Venues'
import overpass      from './overpass'

export default async function getCityVenues(cityName) {
  console.log(cityName)
  const TIMEOUT = 150
  const TYPES = ['node', 'way', 'relation']
  const subTypes = {
    //amenity: ['arts_centre', 'cinema', 'nightclub', 'planetarium', 'theatre', 'school', 'library', 'college', 'university', 'coworking_space', 'internet_cafe', 'dojo', 'kitchen', 'post_office', 'public_bath', 'townhall', 'pub', 'food_court', 'bar', 'cafe', 'restaurant', 'fast_food'],
    //leasure: ['amusement_arcade', 'bowling_alley', 'dance', 'disc_golf_course', 'golf_course', 'fitness_centre', 'hackerspace', 'horse_riding', 'ice_rink', 'miniature_golf', 'sauna', 'sports_centre', 'stadium', 'swimming_pool', 'water_park'],
    amenity: ['theatre', 'school', 'college', 'university', 'coworking_space', 'internet_cafe', 'pub', 'food_court', 'bar', 'cafe', 'fast_food'],
    building: ['school', 'train_station', 'university'],
    //shop: [''],
    school: ['*'],
    tourist: ['hotel', 'motel', 'museum', 'zoo'],
    //tourist: ['alpine_hut', 'apartment', 'aquarium', 'camp_site', 'chalet', 'gallery', 'hotel', 'motel', 'museum', 'theme_park', 'wilderness_hut', 'zoo'],
  }
  const queryStart = `[out:json][timeout:${TIMEOUT}];area[name="${cityName}"]["boundary"="administrative"];area._(if:t["admin_level"] == _.max(t["admin_level"]))->.s;(`
  const queryMain = []
  TYPES.map(type => Object.entries(subTypes).map(([key, list]) => list.map(value => {
    const valuePart = value ? `="${value}"` : ''
    queryMain.push(`${type}["${key}"${valuePart}](area.s)`)
  })))
  const queryEnd = ';);out center;'
  const query = queryStart + queryMain.join(';') + queryEnd
  const cacheItemName = `${cityName}-${query.length}`
  //await venuesCache.removeItem(cacheItemName)
  let venues = await venuesCache.getItem(cacheItemName)
  if(!venues || (venues.loading && venues.timeout && Date.now() > venues.timeout)) {
    await venuesCache.setItem(cacheItemName, {loading: true, data: {}, timeout: Date.now() + (TIMEOUT + 5) * 1000})
    const data = await (await overpass(query)).json()
    console.log("recevieved from osm", data.elements.length, "elements")
    data.elements = data.elements.map((element) => ({
      ...element,
      lat: element.center ? element.center.lat : element.lat,
      lon: element.center ? element.center.lon : element.lon
    }))
    await venuesCache.setItem(cacheItemName, {loading: false, data})
  }
  venues = await venuesCache.getItem(cacheItemName)
  if(venues.loading) return
  mergeVenues.data = mergeVenues(venues.data, Venues.find())
  return venues.data
}

function mergeVenues(cacheVenues, dbVenues) {
  const { elements, ...otherFields } = cacheVenues
  console.log("cache venues", elements.length)
  elements.map(osmVenue => {
    osmVenue.tags.users = []
    const dbVenue = dbVenues.find((dbVenue) => isSameVenue(osmVenue, dbVenue))
    if(dbVenue) {
      osmVenue.tags.users = dbVenue.getUsers()
      osmVenue.tags.dbId = dbVenue._id
    }
    osmVenue.tags.playerCount = osmVenue.tags.users.length
    return osmVenue
  })
  dbVenues.forEach((dbVenue) => {
    if(!elements.find((osmVenue) => isSameVenue(osmVenue, dbVenue))) {
      const users = dbVenue.getUsers()
      elements.push({
        type: dbVenue.osmType,
        id:   dbVenue.osmId || 9999999 * 1000 + Math.round(Math.random() * 1000),
        lat:  dbVenue.location && dbVenue.location.coordinates[1],
        lon:  dbVenue.location && dbVenue.location.coordinates[0],
        tags: {
          dbId:        dbVenue._id,
          name:        dbVenue.name,
          playerCount: users.length,
          users,
        }
      })
    }
  })
  return {
    ...otherFields,
    ...elements
  }
}

function isSameVenue({ id, type }, { osmId, osmType }) {
  return !!osmId && !!osmType && osmId === id && type === osmType
}
