import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React from "react";
import userProfileIcon from './assets/userProfileIcon.png';

export const renderUnAuthHeader = () => (
    <View style={{ height: 60, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>My Custom Header100</Text>
    </View>
  )

export const renderAuthHeader = () => (
    <View style={styles.headerContainer}>
        <View style={styles.headerLeftComponent}>
            <Image
            source={userProfileIcon}
            style={styles.logo}
            />
            <Text style={styles.title}>Anshreality</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
            <Image
                source={userProfileIcon}
                style={styles.logo}
            />
        </TouchableOpacity>
    </View>
)

const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#F5F5F5', // Match this to the background color in the image
      borderBottomColor: '#black', // Match this to the border color in the image
      borderBottomWidth: 2, // Adjust the border width as needed
      height: 70
    },
    headerLeftComponent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logo: {
      width: 50, // Adjust the size as needed
      height: 50, // Adjust the size as needed
      resizeMode: 'contain',
      marginLeft: 30,
      marginRight: 10
    },
    title: {
      fontWeight: 'bold',
      fontSize: 20, // Adjust the font size as needed
      color: '#000', // Adjust the color as needed
    },
    iconButton: {
      padding: 10,
      marginRight: 70
    },
    iconText: {
      fontSize: 24, // Adjust the icon size as needed
    },
  });