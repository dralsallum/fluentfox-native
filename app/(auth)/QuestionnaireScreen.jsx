import React, { useState } from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Define your questions here
const questions = [
  {
    text: "Why are you learning English?",
    options: ["Family", "Work", "Travel"],
  },
  {
    text: "Where are you learning English?",
    options: ["School", "Online", "Self-study"],
  },
  {
    text: "How are you learning English?",
    options: ["Classes", "Apps", "Books"],
  },
];

const QuestionnaireScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigation = useNavigation(); // Use the useNavigation hook

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigation.navigate("sign-in"); // Navigate to the "Auth" screen when questions are finished
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>{questions[currentQuestion].text}</Text>
        {questions[currentQuestion].options.map((option, index) => (
          <Button key={index} title={option} onPress={handleNextQuestion} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default QuestionnaireScreen;
