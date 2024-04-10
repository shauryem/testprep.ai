import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import { RootStackParamList } from './AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }: HomeScreenProps) => {

  const apiUrl = 'http://localhost:8000/ask/';

  const apiBodyData = {
    "data" : {
      "difficulty_level": "difficult",
      "state": "California",
      "num_questions": '3'
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
        console.log(jsonResponse)
        
        return jsonResponse
      })
      .then(data => {
        // `data` is the parsed JavaScript object returned by the API
        navigation.navigate('Assessment', { questionList: data });
        console.log(data);
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
            <Button
              title="Generate test" // Use the `title` prop for the button label
              onPress={handleSubmitPress}
            />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;