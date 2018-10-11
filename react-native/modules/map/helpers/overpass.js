import Config from 'react-native-config'

const SERVERS = JSON.parse(Config.OVERPASS_SERVERS).map(url => ({url, previous: 0}))
const TIMEOUT = 150

let currentIdx = Math.floor(Math.random() * SERVERS.length)

export default async function overpass(query, retryAttemps=3) {

  currentIdx = (currentIdx + 1) % SERVERS.length
  const { url } = SERVERS[currentIdx]
  const waitTime = Math.max(0, SERVERS[currentIdx].previous + TIMEOUT * 1000 - Date.now())
  if(waitTime === 0) {
    SERVERS[currentIdx].previous = Date.now()
  }
  await (
    new Promise((resolve) => {
      console.log("timeout", currentIdx, waitTime)
      setTimeout(resolve, waitTime)
    })
  )
  const fullQuery = `${url}?data=${query}`
  console.log(fullQuery)
  try {
    const result = await fetch(fullQuery)
    console.log("reply", (Date.now() - SERVERS[currentIdx].previous) / 1000)
    console.log(result.status)
    if(result.status != 200) {
      console.log(result)
      throw new Error("Overpass request failure")
    }
    return result
  } catch(error) {
    console.warn(error)
    if(retryAttemps > 0) return overpass(query, --retryAttemps)
  }
}
