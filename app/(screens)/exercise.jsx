import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import styled from "styled-components/native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateExercise, fetchExercise } from "../redux/exerciseSlice";
import { userSelector } from "../redux/authSlice";

// Color Palette
const COLORS = {
  background: "#ccecff",
  white: "#ffffff",
  primary: "#00796b",
  secondary: "#0a9be3",
  correct: "green",
  incorrect: "red",
  shadow: "#000",
  progressBackground: "#d3d3d3",
  progressBar: "#000000",
  modalOverlay: "rgba(0, 0, 0, 0.6)",
  textPrimary: "#004d40",
  textSecondary: "#555",
};

// Styled Components
const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLORS.background};
`;

const QuizBody = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 30px;
  right: 25px;
`;

const CrossIcon = styled.Image`
  width: 30px;
  height: 30px;
`;

const QuestionSection = styled.View`
  width: 100%;
  max-width: 600px;
  padding: 20px;
  align-items: center;
  background-color: ${COLORS.white};
  border-radius: 12px;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 5;
`;

const QuestionCount = styled.Text`
  font-size: 24px;
  margin-bottom: 10px;
  color: ${COLORS.textPrimary};
`;

const QuestionText = styled.Text`
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: ${COLORS.textPrimary};
`;

const AnswerSection = styled.View`
  width: 100%;
  margin-top: 20px;
`;

const QuizButton = styled.TouchableOpacity`
  background-color: ${(props) =>
    props.selected
      ? props.isCorrect
        ? COLORS.correct
        : COLORS.incorrect
      : "#f1fafe"};
  padding: 12px;
  border-radius: 12px;
  margin: 10px 0;
  width: 90%;
  align-items: center;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

const AnswerText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => (props.selected ? "#fff" : COLORS.textPrimary)};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.modalOverlay};
`;

const ModalContent = styled.View`
  width: 85%;
  padding: 25px;
  background-color: ${COLORS.white};
  border-radius: 20px;
  align-items: center;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 10;
`;

const ResultImage = styled.Image`
  width: 120px;
  height: 120px;
  margin-bottom: 25px;
`;

const ResultText = styled.Text`
  font-size: 24px;
  margin-bottom: 25px;
  text-align: center;
  color: ${COLORS.textPrimary};
`;

const ModalButton = styled.TouchableOpacity`
  background-color: ${COLORS.primary};
  padding: 12px 25px;
  border-radius: 12px;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5;
`;

const ModalButtonText = styled.Text`
  color: ${COLORS.white};
  font-size: 20px;
  font-weight: bold;
`;

const AudioContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const PlayPauseButton = styled.TouchableOpacity`
  padding: 10px;
`;

const PlayPauseImage = styled.Image`
  width: 40px;
  height: 40px;
`;

const ProgressWrapper = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const ProgressBarContainer = styled.Pressable`
  height: 10px;
  background-color: ${COLORS.progressBackground};
  border-radius: 5px;
  justify-content: center;
`;

const ProgressBar = styled.View`
  height: 100%;
  background-color: ${COLORS.progressBar};
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
  color: ${COLORS.textSecondary};
`;

// Main Component
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
  const dispatch = useDispatch();
  const { currentUser } = useSelector(userSelector);

  // Fetch Questions
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

  // Cleanup Audio on Unmount
  useEffect(() => {
    return () => {
      if (playbackInstance) {
        playbackInstance.unloadAsync();
      }
    };
  }, [playbackInstance]);

  // Load Audio when Current Question Changes
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionData = questions[currentQuestion];
      if (currentQuestionData?.audioUrl) {
        loadAudio(currentQuestionData.audioUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, questions]);

  // Load Audio Function
  const loadAudio = async (url) => {
    try {
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
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  // Playback Status Update Handler
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        playbackInstance.setPositionAsync(0);
      }
    } else if (status.error) {
      console.error(`Playback Error: ${status.error}`);
    }
  };

  // Play/Pause Handler
  const handlePlayPause = async () => {
    if (playbackInstance) {
      if (isPlaying) {
        await playbackInstance.pauseAsync();
      } else {
        await playbackInstance.playAsync();
      }
    }
  };

  // Progress Bar Press Handler
  const handleProgressBarPress = async (event) => {
    if (playbackInstance && duration) {
      const { locationX, nativeEvent } = event;
      const totalWidth = nativeEvent.layout.width;
      const ratio = locationX / totalWidth;
      const newPosition = ratio * duration;
      await playbackInstance.setPositionAsync(newPosition);
    }
  };

  // Format Time in mm:ss
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle Answer Selection
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

  // Handle Navigation Back to Stories
  const handleBackToStories = () => {
    setShowModal(false); // Hide the modal
    router.push("stories");
  };

  // Handle Take Home Action
  const handleTakeHome = async () => {
    try {
      if (currentUser && currentUser._id) {
        // Dispatch updateScore to increment by 1
        await dispatch(
          updateExercise({ userId: currentUser._id, incrementBy: 1 })
        ).unwrap();

        // Optionally, refetch the score to ensure the latest value
        dispatch(fetchExercise(currentUser._id));
      }
      // Navigate back to stories
      setShowModal(false);
      router.push("stories");
    } catch (error) {
      console.error("Failed to update score:", error);
      // Optionally, handle the error in the UI without using an alert
    }
  };

  // Current Question Data
  const currentQuestionData = questions[currentQuestion];

  // Calculate Progress Percentage
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <ScreenContainer>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </LoadingContainer>
      ) : error ? (
        <LoadingContainer>
          <Text style={{ color: COLORS.incorrect }}>{error}</Text>
        </LoadingContainer>
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
              Question {currentQuestion + 1} / {questions.length}
            </QuestionCount>
            <QuestionText>{currentQuestionData?.questionText}</QuestionText>

            {/* Audio Player */}
            {currentQuestionData?.audioUrl && (
              <AudioContainer>
                <PlayPauseButton onPress={handlePlayPause}>
                  <PlayPauseImage
                    source={
                      isPlaying
                        ? require("../../assets/icons/pause.png")
                        : require("../../assets/icons/play.png")
                    }
                    resizeMode="contain"
                  />
                </PlayPauseButton>
                <ProgressWrapper>
                  <ProgressBarContainer onPress={handleProgressBarPress}>
                    <ProgressBar width={progressPercentage} />
                  </ProgressBarContainer>
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
                  <AnswerText
                    selected={selectedAnswer && selectedAnswer.index === index}
                  >
                    {answerOption.answerText}
                  </AnswerText>
                </QuizButton>
              ))}
            </AnswerSection>
          </QuestionSection>
        </QuizBody>
      )}

      {/* Result Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <ModalContainer>
          <ModalContent>
            <ResultImage
              source={require("../../assets/images/congratulations.png")}
              resizeMode="contain"
            />
            <ResultText>
              Congratulations!{"\n"}You scored {correctAnswers} out of{" "}
              {questions.length}
            </ResultText>
            <ModalButton onPress={handleTakeHome}>
              <ModalButtonText>Back to Stories</ModalButtonText>
            </ModalButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </ScreenContainer>
  );
};

export default Exercise;
