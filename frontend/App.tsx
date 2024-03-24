/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  const [inputText, setInputText] = useState('')

  const [specifiedTopic, setSpecifiedTopic] = useState('')

  const [questionList, setQuestionList] = useState('')

  const apiUrl = 'http://localhost:8000/ask/';

  const apiBodyData = {
    "data" : {
      "number_of_questions": "3",
      "input_type": "multiple choice",
      "difficulty_level": "difficult",
      "input": inputText,
      "specified_topic": specifiedTopic
    }
  };

  const handleSubmitPress = async () => {
    fetch(apiUrl, {
      method: 'POST', // Use the POST method
      headers: {
        'Content-Type': 'application/json', // Indicate we're sending JSON data
      },
      body: JSON.stringify(apiBodyData), // Convert the JavaScript object to a JSON string
    }).then(async response => {
        // Check if the response is successful (status code 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonResponse = await response.json(); // Parse JSON body of the response
        setQuestionList(jsonResponse)
        return jsonResponse
      })
      .then(data => {
        // `data` is the parsed JavaScript object returned by the API
        console.log(data);
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  const areQuestionsGenerated = () => {
    return questionList !== ''
  }

  const resetPage = () => {
    setQuestionList('')
    setInputText('')
    setSpecifiedTopic('')
  }


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? '#000' : '#fff',
          }}>
          <Button
              title="Reset" // Use the `title` prop for the button label
              onPress={resetPage}
          />
          {!areQuestionsGenerated() ?
          <View> 
            <Text style={styles.highlight}>Enter content to list questions:</Text>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText} // Update the state variable whenever the text changes
              placeholder="Enter content here."
            />
            <TextInput
              style={styles.input}
              value={specifiedTopic}
              onChangeText={setSpecifiedTopic} // Update the state variable whenever the text changes
              placeholder="Enter a specific topic you'd like to focus on."
            />
            <Button
              title="Click me" // Use the `title` prop for the button label
              onPress={handleSubmitPress}
            />
          </View>: 
          <Text>{JSON.stringify(questionList)}</Text>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
});

export default App;
