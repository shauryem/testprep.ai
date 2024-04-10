import { View, StyleSheet } from 'react-native';
import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}
  
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
    <View style={styles.appBackground}>
        {children}
    </View>
    );

const styles = StyleSheet.create({
    appBackground: {
        flex: 1,
        backgroundColor: '#F0ECE1', // Replace with your desired background color
    },
});