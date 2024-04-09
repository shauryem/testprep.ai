import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Home';
import AssessmentScreen from './Assessment';
import { Test } from './types';
import { Text, View } from 'react-native';
import { renderAuthHeader } from './Headers';

type RouteName = 'Home' | 'Assessment';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    Home: undefined; // Indicates that Home doesn't expect any parameters.
    Assessment: { questionList: Test }; 
};

interface AppNavigatorProps {
    route: RouteName;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ route }) => {

  if (!route) {
    throw new Error(`No component found for route: ${route}`);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName={route}>
        <Stack.Screen 
          name={"Home"} 
          component={HomeScreen}
          />
        <Stack.Screen
          name="Assessment" 
          component={AssessmentScreen}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
};