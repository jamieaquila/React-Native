import React        from 'react'
import { View }     from 'react-native'
import { Redirect } from 'react-router-native'

import MainMapContainer  from '/modules/map/MainMapContainer'

export default function Home({user}) {
  if(!!user && !!user.venueId) return <Redirect to={`/venue/${user.venueId}`} />
  return (
    <MainMapContainer user={user} />
  )
}
