import { View } from 'react-native';
import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}
  
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
        {children}
    </View>
    );