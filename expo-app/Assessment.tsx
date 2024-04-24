import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity
} from 'react-native';
import { UserAnswers } from './types';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AssessmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Assessment'>;
type AssessmentScreenRouteProp = RouteProp<RootStackParamList, 'Assessment'>;

type AssessmentScreenProps = {
  route: AssessmentScreenRouteProp;
  navigation: AssessmentScreenNavigationProp
};

const AssessmentScreen : React.FC<AssessmentScreenProps> = ({ route, navigation } : AssessmentScreenProps) => {

  const { questions } = route.params.questionList;
  const questionsCopy = [...questions];

  const [answers, setAnswers] = useState<UserAnswers>({});

  const goBack = () => {
    navigation.goBack();
  }

  const renderQuestionsList = () => {
    if (!questionsCopy) {
      return
    } else {
      // Parse the JSON string inside the `questions` key
      const handlePress = (questionIndex: number, option: string) => {
        setAnswers({
          ...answers,
          [questionIndex]: option,
        });
      };
      return (
        <ScrollView style={styles.container}>
          {questionsCopy.map((question: any, index: number) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.question}>{question.question}</Text>
              {question.options.map((option: string, optionIndex: number) => (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.option,
                    answers[index] === option && styles.selectedOption,
                  ]}
                  onPress={() => handlePress(index, option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
                ))}
        </ScrollView>
      );
    }
  };


  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Button
              title="Go back" // Use the `title` prop for the button label
              onPress={goBack}
          />
          {renderQuestionsList()}
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

export default AssessmentScreen;