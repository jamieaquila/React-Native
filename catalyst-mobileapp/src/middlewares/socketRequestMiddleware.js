import { AsyncStorage } from 'react-native'
import ioS from '../helpers/socket-client';

export default function socketRequestMiddleware() {
  return next => action => {

    const { socketRequest, type, ...rest } = action;
    if (!socketRequest) return next(action);

    if(!socketRequest.method || socketRequest.method !== "GET") {
      socketRequest.method = 'POST';
    }

    const REQUEST = type;
    const SUCCESS = type + '_SUCCESS';
    const FAILURE = type + '_FAILURE';

    const UNAUTHORIZED = 'AUTH_UNAUTHORIZED';


    next({ ...rest, type: REQUEST, isLoading: true });
    let data = socketRequest.body.lightshowdetails
  
    AsyncStorage.getItem('auth').then(authString => {
      var auth = JSON.parse(authString);
      const headers = {
        'Authorization': (auth) ? auth.accessToken : ''
      };
      const options = {
        method : socketRequest.method,
        url: socketRequest.url,
        data: socketRequest.body,
        headers: headers
      };
      ioS.socket.request(options, 
        function serverResponded (body, JWR) {
          // body === JWR.body
          console.log('Sails responded with: ', body);
          console.log('with headers: ', JWR.headers);
          console.log('and with status code: ', JWR.statusCode);
          if(JWR.statusCode === 204) {
            console.log('204')
            next({ ...rest, type: SUCCESS, isLoading: false });
          }else if (JWR.statusCode === 200) {      
            // console.log('200')   
            body = data   
            // return next({ ...rest, data, type: SUCCESS, isLoading: false });
            next({ ...rest, body, type: SUCCESS, isLoading: false })
          }else if (JWR.statusCode === 401) {
              next({ ...rest, type: FAILURE, lastAction: action, isLoading: false });          
              next({ ...rest, type: UNAUTHORIZED, lastAction: action });
          } else {
              next({ ...rest, type: FAILURE, lastAction: action, isLoading: false });
          }
        });
    
    })
    .catch(err => {
       console.log(err)
    });

  };
}
