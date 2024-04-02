/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { AppNavigator } from './AppNavigator';

function App(): React.JSX.Element {
  const currentRoute = 'Home';

  return <AppNavigator route={currentRoute} />;
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    // TextInput styles
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%', // Example width
  },
  container: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: 'skyblue',
  },
  optionText: {
    fontSize: 15,
  },
});

export default App;
