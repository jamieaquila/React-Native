import { app, api } from '../config'

export function getAlbums() {
  return {
    type: 'GET_ALBUMS',
    request: {
      url: api.baseURL + '/Albums?sort=releaseDate+DESC&where=' + encodeURIComponent('{"app":"' + app.id + '"}')
    }
  }
}


export function storeTracks(data) {
  return {
    type: 'GET_ALBUMS_SUCCESS',
    data: data
  }
}