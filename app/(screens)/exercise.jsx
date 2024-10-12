import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from "react-native";
import styled from "styled-components/native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

// Styled Components
const QuizBody = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ccecff;
  padding: 20px;
`;

const QuestionSection = styled.View`
  width: 100%;
  height: 500px;
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
  text-align: center;
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

const AudioContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const ProgressBarContainer = styled.View`
  flex: 1;
  height: 10px;
  background-color: #d3d3d3;
  border-radius: 5px;
  margin-left: 10px;
  justify-content: center;
`;

const ProgressBar = styled.View`
  height: 100%;
  background-color: #000000;
  border-radius: 5px;
  width: ${(props) => props.width}%;
`;

const TimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
`;

const TimeText = styled.Text`
  font-size: 12px;
  color: #555;
`;

// New Styled Components for Replacing Inline Styles
const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 30px;
  right: 25px;
`;

const ProgressWrapper = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 10px;
  border-radius: 8px;
`;

const ModalText = styled.Text`
  font-size: 24px;
  margin-bottom: 20px;
`;

const PlayPauseImage = styled.Image`
  width: 40px;
  height: 40px;
`;

const ProgressBarContainerBlack = styled(ProgressBarContainer)`
  background-color: black;
`;

const ResultText = styled.Text`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Exercise = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // in milliseconds
  const [duration, setDuration] = useState(0); // in milliseconds
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

  useEffect(() => {
    return () => {
      if (playbackInstance) {
        playbackInstance.unloadAsync();
      }
    };
  }, [playbackInstance]);

  const loadAudio = async (url) => {
    // Unload previous sound if any
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      setPlaybackInstance(null);
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );
    setPlaybackInstance(sound);
    const status = await sound.getStatusAsync();
    setDuration(status.durationMillis || 0);
    setPosition(status.positionMillis || 0);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        playbackInstance.setPositionAsync(0);
      }
    }
  };

  const handlePlayPause = async () => {
    if (playbackInstance) {
      if (isPlaying) {
        await playbackInstance.pauseAsync();
      } else {
        await playbackInstance.playAsync();
      }
    }
  };

  const handleProgressBarPress = async (event) => {
    if (playbackInstance && duration) {
      const { locationX, nativeEvent } = event;
      const totalWidth = nativeEvent.layout.width;
      const ratio = locationX / totalWidth;
      const newPosition = ratio * duration;
      await playbackInstance.setPositionAsync(newPosition);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
        // Reset audio states
        if (playbackInstance) {
          playbackInstance.unloadAsync();
          setPlaybackInstance(null);
          setIsPlaying(false);
          setPosition(0);
          setDuration(0);
        }
      } else {
        setShowModal(true); // Show the modal at the end of the quiz
      }
      setSelectedAnswer(null);
    }, 400);
  };

  const handleBackToStories = () => {
    setShowModal(false); // Hide the modal
    router.push("stories");
  };

  const currentQuestionData = questions[currentQuestion];

  useEffect(() => {
    if (currentQuestionData?.audioUrl) {
      loadAudio(currentQuestionData.audioUrl);
    }
  }, [currentQuestionData]);

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

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
          <CloseButton onPress={handleBackToStories}>
            <CrossIcon
              source={require("../../assets/icons/grayCross.png")}
              resizeMode="contain"
            />
          </CloseButton>
          <QuestionSection>
            <QuestionCount>
              Question {currentQuestion + 1}/{questions.length}
            </QuestionCount>
            <QuestionText>{currentQuestionData?.questionText}</QuestionText>

            {/* Audio Player */}
            {currentQuestionData?.audioUrl && (
              <AudioContainer>
                <TouchableOpacity onPress={handlePlayPause}>
                  <PlayPauseImage
                    source={
                      isPlaying
                        ? require("../../assets/icons/pause.png")
                        : require("../../assets/icons/play.png")
                    }
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <ProgressWrapper>
                  <Pressable onPress={handleProgressBarPress}>
                    <ProgressBarContainerBlack>
                      <ProgressBar width={progressPercentage} />
                    </ProgressBarContainerBlack>
                  </Pressable>
                  <TimeContainer>
                    <TimeText>{formatTime(position)}</TimeText>
                    <TimeText>{formatTime(duration)}</TimeText>
                  </TimeContainer>
                </ProgressWrapper>
              </AudioContainer>
            )}

            <AnswerSection>
              {currentQuestionData?.answerOptions.map((answerOption, index) => (
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
              ))}
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
            <ResultText>
              You got {correctAnswers} out of {questions.length} correct!
            </ResultText>
            <ModalButton onPress={handleBackToStories}>
              <AnswerText style={{ color: "#fff", fontSize: 18 }}>
                Back to Stories
              </AnswerText>
            </ModalButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </ScreenContainer>
  );
};

export default Exercise;
