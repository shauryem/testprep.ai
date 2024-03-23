import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// Register the app
AppRegistry.registerComponent(appName, function () { return App; });
// AppRegistry.runApplication is what triggers the web application to start
AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
});
