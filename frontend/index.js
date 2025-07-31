import { AppRegistry } from 'react-native';
import App from './App'; // make sure App.js exists
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
