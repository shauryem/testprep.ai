import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
  Platform,
  TextInput,
} from 'react-native';
import { RootStackParamList } from './AppNavigator';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backendURL = process.env.BACKEND_BASE_URL
const googleClientID = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }: HomeScreenProps) => {

  WebBrowser.maybeCompleteAuthSession();

  const [userInfo, setUserInfo] = useState(null);

  //client IDs from .env
  const config = {
    webClientId: process.env.WEB_CLIENT_ID,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const getUserInfo = async (token) => {
    //absent token
    if (!token) return;
    //present token
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      //store user information  in Asyncstorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      console.log(user)
      setUserInfo(user);
    } catch (error) {
      console.error(
        "Failed to fetch user data:"
      );
    }
  };

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Function to retrieve CSRF token from cookie
  function getCSRFToken() {
    const cookieValue = document.cookie.match('(^|;)\\s*' + 'csrftoken' + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  }

  const handleLogin = async () => {
    try {
      const response = await fetch(`${backendURL}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        console.log('Login successful');
        // Handle successful login, e.g., redirect user to dashboard
      } else {
        console.error('Login failed');
        // Handle login error, e.g., display error message to user
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const signOutHandler = async () => {
    try {
      // Remove the user information from AsyncStorage
      await AsyncStorage.removeItem("user");
      // Reset the userInfo state to null
      setUserInfo(null);
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  }
  
  //add it to a useEffect with response as a dependency 
  useEffect(() => {
    signInWithGoogle();
  }, [response]);
  
  //log the userInfo to see user details
  console.log(JSON.stringify(userInfo))

  const apiUrl = `${backendURL}/ask/`;
  
  const apiBodyData = {
    "data" : {
      "difficulty_level": "difficult",
      "state": "California",
      "num_questions": '3'
    }
  };
  const exchangeGoogleTokenForDjangoAuthToken = async (googleToken) => {
    try {
      const response = await fetch(`${backendURL}/auth/convert-token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: googleToken,
          backend: 'google-oauth2',
          grant_type: 'convert_token',
          client_id: {googleClientID},
          client_secret: {googleClientSecret},
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert Google token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error in exchanging Google token:', error);
      throw error;
    }
  };

  // Modify the existing signInWithGoogle function
  const signInWithGoogle = async () => {
    try {
      // Attempt to retrieve user information from AsyncStorage
      const userJSON = await AsyncStorage.getItem("user");
      if (userJSON) {
        // If user information is found in AsyncStorage, parse it and set it in the state
        setUserInfo(JSON.parse(userJSON));
      } else if (response?.type === "success") {
        // If no user information is found and the response type is "success" (assuming response is defined),
        // exchange the Google OAuth2 token for a Django auth token and then call getUserInfo
        const djangoToken = await exchangeGoogleTokenForDjangoAuthToken(response.authentication.accessToken);
        getUserInfo(djangoToken);
      }
    } catch (error) {
      // Handle any errors that occur during AsyncStorage retrieval or other operations
      console.error("Error retrieving user data from AsyncStorage:", error);
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
            <TextInput
              placeholder="Email"
              value={loginData.email}
              onChangeText={(text) => setLoginData({ ...loginData, email: text })}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={loginData.password}
              onChangeText={(text) => setLoginData({ ...loginData, password: text })}
            />
            <Button title="Sign In" onPress={handleLogin} />
            <Button
              color={userInfo ? 'green' : 'blue'}
              disabled={!request}
              title="Login with Google"
              onPress={() => {
                promptAsync();
              }}
            />
            <Button
              title="Sign Out"
              onPress={signOutHandler}
            />
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