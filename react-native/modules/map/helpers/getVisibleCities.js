import citiesCache   from '/modules/cache/cities'
import overpass      from './overpass'

//citiesCache.clearAll()

export default async (bbox) => {
  // console.log("getCities", bbox)
  const bboxes = (
    Object.entries(await citiesCache.getAll()) || []
  ).filter(([key]) => key.indexOf('cities') === 0)
    .map(([key, value]) => value)
  const bboxesCache = bboxes.filter(({value: {bbox: {s, w, n, e}}}) => {
    const height = Math.abs(bbox.n - bbox.s)
    const width = Math.abs(bbox.e - bbox.w)
    const exceedingHeight = Math.min(height, Math.max(0, s - bbox.s) + Math.max(0, bbox.n - n))
    const exceedingWidth = Math.min(width, Math.max(0, w - bbox.w) + Math.max(0, bbox.e - e))
    const area = height * width
    const out = (
      exceedingWidth * height +
      exceedingHeight * width +
      exceedingWidth * exceedingHeight
    )
    // console.log(out / area, out, area)
    return out / area < 0.1
  })
  console.log("cities cache found", bboxesCache.length)
  while(bboxesCache.length) {
    const { value } = bboxesCache.pop()
    if(value.loading && value.timeout && value.timeout > Date.now()) return null
    const {s, w, n, e} = value.bbox
    if(value.cities && value.cities.length !== 0) {
      citiesCache.refreshLRU(cacheKey({s, w, n, e}))
      return value.cities
    }
    citiesCache.removeItem(cacheKey({s, w, n, e}))
  }
  const s = bbox.s - 0.01
  const w = bbox.w - 0.01
  const n = bbox.n + 0.01
  const e = bbox.e + 0.01
  const bboxCache = {bbox: {s, w, n, e}, loading: true, timeout: Date.now() + 60 * 1000}
  await citiesCache.setItem(cacheKey({s, w, n, e}), bboxCache)
  const TIMEOUT = 25
  const out = '[out:csv(::"type",::"id", name, "place", ::"lon", ::"lat")]'
  const center = [(n + s) / 2, (e + w) / 2]
  const isInFilter = [center, [s, w], [n, w], [s, e], [n, e]].map(([lon, lat]) => `is_in(${lon}, ${lat});`).join('')
  const queryStart = `${out}[timeout:${TIMEOUT}];(${isInFilter});area._["boundary"="administrative"]["admin_level"="8"]->.s;(`
  const queryMain = ['city', 'town', 'village'].map(t => `node["place"="${t}"](area.s)`)
  const queryEnd = ';);out geom;'
  const query = queryStart + queryMain.join(';') + queryEnd
  const result = await overpass(query)
  const data = await result.text()
  const lines = data.split('\n')
  bboxCache.cities = lines.slice(1).map(line => {
    const [type, id, name, place, lon, lat] = line.split('\t')
    return {type, id, name, place, lon, lat}
  }).filter(l => l && l.type)
  bboxCache.loading = false
  //citiesCache.bboxes.push(bboxCache)
  if(bboxCache.cities.length) {
    await citiesCache.setItem(cacheKey({s, w, n, e}), bboxCache)
  }
  return bboxCache.cities
}

const cacheKey = ({s, w, n, e}) => `cities-${s}-${w}-${n}-${e}`
