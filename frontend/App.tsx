/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AppNavigator } from './AppNavigator';
import { AppLayout } from './AppLayout';
import { View } from 'react-native';

function App(): React.JSX.Element {
  const currentRoute = 'Home';

  return (
    <AppLayout>
      <AppNavigator route={currentRoute} />
    </AppLayout>
  )
  
}

export default App;
