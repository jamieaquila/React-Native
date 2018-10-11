	'use strict';

import { AppRegistry } from 'react-native';
import Catalyst from './src';
import { Client } from 'bugsnag-react-native';


const bugsnag = new Client();

AppRegistry.registerComponent('BuzznogCatalyst', () => Catalyst);
