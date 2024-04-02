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
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

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
          <View> 
            <Button
              title="Generate test" // Use the `title` prop for the button label
              onPress={handleSubmitPress}
            />
          </View>
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

export default HomeScreen;