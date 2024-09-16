import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

const QuizBody = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ccecff;
  padding: 20px;
`;

const QuestionSection = styled.View`
  width: 100%;
  height: 450px;
  max-width: 600px;
  padding: 20px;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 5;
  position: relative;
`;

const QuestionCount = styled.Text`
  font-size: 24px;
  margin-bottom: 10px;
`;

const QuestionText = styled.Text`
  font-size: 20px;
  margin-bottom: 20px;
`;

const AnswerText = styled.Text`
  font-size: 18px;
  font-weight: 500;
`;

const AnswerSection = styled.View`
  width: 100%;
  margin-top: 20px;
`;

const QuizButton = styled.TouchableOpacity`
  background-color: ${(props) =>
    props.selected ? (props.isCorrect ? "green" : "red") : "#f1fafe"};
  padding: 12px;
  border-radius: 12px;
  margin: 10px;
  width: 90%;
  align-items: center;
`;

const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #ccecff;
`;

const CrossIcon = styled.Image`
  width: 30px;
  height: 30px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  align-items: center;
`;

const ResultImage = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Exercise = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sound, setSound] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const route = useRoute();
  const [selectedSet, setSelectedSet] = useState(route.params?.set || "set1");

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedSet) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `https://quizeng-022517ad949b.herokuapp.com/api/tests/${selectedSet}`
        );
        setQuestions(response.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions data:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSet]);

  const playSound = async (url) => {
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    setSound(sound);
    await sound.playAsync();
  };

  const handleAnswerButtonClick = (isCorrect, index) => {
    setSelectedAnswer({ index, isCorrect });
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowModal(true); // Show the modal at the end of the quiz
      }
      setSelectedAnswer(null);
    }, 400);
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleBackToStories = () => {
    setShowModal(false); // Hide the modal
    router.push("/stories");
  };

  return (
    <ScreenContainer>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color="#0a9be3" />
        </LoadingContainer>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <QuizBody>
          <TouchableOpacity
            style={{ position: "absolute", top: 30, right: 25 }}
            onPress={() => router.push("stories")}
          >
            <CrossIcon
              source={require("../../assets/icons/grayCross.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <QuestionSection>
            <QuestionCount>
              Question {currentQuestion + 1}/{questions.length}
            </QuestionCount>
            <QuestionText>
              {questions[currentQuestion]?.questionText}
              {questions[currentQuestion]?.audioUrl && (
                <TouchableOpacity
                  onPress={() => playSound(questions[currentQuestion].audioUrl)}
                >
                  <Text>Play Audio</Text>
                </TouchableOpacity>
              )}
            </QuestionText>
            <AnswerSection>
              {questions[currentQuestion]?.answerOptions.map(
                (answerOption, index) => (
                  <QuizButton
                    key={index}
                    onPress={() =>
                      handleAnswerButtonClick(answerOption.isCorrect, index)
                    }
                    selected={selectedAnswer && selectedAnswer.index === index}
                    isCorrect={selectedAnswer?.isCorrect}
                  >
                    <AnswerText>{answerOption.answerText}</AnswerText>
                  </QuizButton>
                )
              )}
            </AnswerSection>
          </QuestionSection>
        </QuizBody>
      )}

      <Modal visible={showModal} transparent={true} animationType="slide">
        <ModalContainer>
          <ModalContent>
            <ResultImage
              source={require("../../assets/images/congratulations.png")}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 24, marginBottom: 20 }}>
              You got {correctAnswers} out of {questions.length} correct!
            </Text>
            <TouchableOpacity
              onPress={handleBackToStories}
              style={{
                backgroundColor: "#4CAF50",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>
                Back to Stories
              </Text>
            </TouchableOpacity>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </ScreenContainer>
  );
};

export default Exercise;
