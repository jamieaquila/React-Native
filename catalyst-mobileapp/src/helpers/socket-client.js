import SailsIOClient from 'react-native-sails.io-client';
import SocketIOClient from 'socket.io-client';

import { app, api } from '../config'

const ioS = SailsIOClient(SocketIOClient);
ioS.sails.url = api.baseURL;  
//ioS.sails.url = "http://192.168.1.112:10010";  
ioS.sails.autoConnect = true;
ioS.socket.reconnection = true;
// console.log("SocketBaseURL:", api.baseURL);

export default ioS;