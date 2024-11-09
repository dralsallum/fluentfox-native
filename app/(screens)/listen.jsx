// components/Listen.js
import React, { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import styled from "styled-components/native";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { updateScore, fetchScore } from "../redux/scoreSlice";
import { userSelector } from "../redux/authSlice";

const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #f8f9fa;
  margin-top: 20px;
`;

const ContentContainer = styled(ScrollView)`
  flex-grow: 1;
  padding: 10px 20px;
`;

const Container = styled.View`
  padding: 20px;
  background-color: #f8f9fa;
  align-items: center;
  justify-content: center;
  border-top-width: 1px;
  border-color: #e1e4e8;
  shadow-color: #000;
  shadow-offset: 0px -5px;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
  elevation: 5;
  position: absolute;
  bottom: ${({ isHidden }) => (isHidden ? "-100%" : "0")};
  width: 100%;
  transition: bottom 0.3s ease-in-out;
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  padding: 10px;
`;

const AllCon = styled.View`
  padding: 10px;
  background-color: #f8f9fa;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  gap: 5px;
`;

const ReCon = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  padding: 10px;
`;

const Button = styled.TouchableOpacity`
  align-items: center;
`;

const ButtonLabel = styled.Text`
  font-size: 12px;
`;

const TimeText = styled.Text`
  font-size: 14px;
  color: #666;
`;

const TalImg = styled.Image`
  width: 35px;
  height: 35px;
  margin-left: 5px;
`;

const TopImg = styled.Image`
  width: 25px;
  height: 25px;
  margin-left: 5px;
`;

const CloseImg = styled.Image`
  width: 28px;
  height: 28px;
  margin-right: 10px;
`;

const TalCon = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LisCon = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FloatingButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 40px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
  elevation: 5;
`;

const ProgressBarContainer = styled.View`
  width: 90%;
  height: 12px;
  background-color: #e0e0e8;
  border-radius: 10px;
  margin: 10px;
  overflow: hidden;
`;

const Progress = styled.View`
  height: 100%;
  background-color: #3b5998;
  border-radius: 10px;
  width: ${({ progress }) => `${progress * 100}%`};
`;

const StoryText = styled.Text`
  font-size: 16px;
  color: #333;
  line-height: 24px;
  text-align: justify;
`;

// Styled components for the Exam Modal
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ExamContent = styled.View`
  width: 90%;
  max-height: 80%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
`;

const QuestionText = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
`;

const OptionButton = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${({ isSelected }) => (isSelected ? "#d1e7dd" : "#e0e0e8")};
  border-radius: 5px;
  margin-bottom: 10px;
`;

const OptionText = styled.Text`
  font-size: 16px;
`;

const NextButton = styled.TouchableOpacity`
  padding: 10px 20px;
  background-color: #3b5998;
  border-radius: 5px;
  align-items: center;
  margin-top: 20px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const NextButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const ScoreText = styled.Text`
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const TakeHomeButton = styled.TouchableOpacity`
  padding: 10px 20px;
  background-color: #3b5998;
  border-radius: 5px;
  align-items: center;
`;

const TakeHomeButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const Listen = () => {
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isContainerHidden, setIsContainerHidden] = useState(false);
  const [storyData, setStoryData] = useState({
    story: [],
    audioUrl: "",
    exam: [],
  }); // Include exam data

  const router = useRouter();
  const route = useRoute();
  const scrollViewRef = useRef(null);
  const [selectedSet, setSelectedSet] = useState(route.params?.set || "set1");

  // State for Exam Modal
  const [isExamVisible, setIsExamVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [localScore, setLocalScore] = useState(0);
  const dispatch = useDispatch();
  const { currentUser } = useSelector(userSelector);

  useEffect(() => {
    const fetchStoryData = async () => {
      if (!selectedSet) return;
      try {
        const response = await fetch(
          `https://quizeng-022517ad949b.herokuapp.com/api/stories/${selectedSet}`
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}\nResponse: ${text}`
          );
        }

        const data = await response.json();
        setStoryData(data); // data includes story, audioUrl, and exam
      } catch (error) {
        console.error("Error fetching story data:", error);
      }
    };

    fetchStoryData();
  }, [selectedSet]);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playSound = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: storyData.audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(updateProgressFromStatus);
    } else {
      await sound.replayAsync();
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setProgress(0);
    }
  };

  const updateProgressFromStatus = (playbackStatus) => {
    if (playbackStatus.isLoaded) {
      const progress =
        playbackStatus.positionMillis / playbackStatus.durationMillis;
      setProgress(progress);
      setIsPlaying(playbackStatus.isPlaying);
    }
  };

  const handlePressPlayPause = () => {
    if (sound) {
      sound.getStatusAsync().then((status) => {
        if (status.isPlaying) {
          pauseSound();
        } else if (status.isLoaded) {
          playSound();
        } else {
          playSound();
        }
      });
    } else {
      playSound();
    }
  };

  const changeAudioPosition = (change) => {
    if (sound) {
      sound.getStatusAsync().then((status) => {
        if (status.isLoaded) {
          let newPosition = status.positionMillis + change;
          if (newPosition < 0) newPosition = 0;
          if (newPosition > status.durationMillis)
            newPosition = status.durationMillis;
          sound.setPositionAsync(newPosition);
          const newProgress = newPosition / status.durationMillis;
          setProgress(newProgress);
        }
      });
    }
  };

  const handleBackToStories = async () => {
    await stopSound();
    router.push("stories");
  };

  const toggleContainerVisibility = () => {
    setIsContainerHidden((prev) => !prev);
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isBottom && !isContainerHidden) {
      setIsContainerHidden(true);
    }
  };

  // Exam Handlers
  const toggleExamModal = () => {
    setIsExamVisible((prev) => !prev);
    // Reset exam state when opening the modal
    if (!isExamVisible) {
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setLocalScore(0);
    }
  };

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    // Check if the selected answer is correct
    const selectedAnswer = userAnswers[currentQuestionIndex];
    if (selectedAnswer === storyData.exam[currentQuestionIndex].correctAnswer) {
      setLocalScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < storyData.exam.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Exam finished, proceed to show the score without updating Redux
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move past the last question to show the score
    }
  };

  // Modified handleTakeHome Function (Removed Alert and Increment by One Only)
  const handleTakeHome = async () => {
    try {
      if (currentUser && currentUser._id) {
        // Dispatch updateScore to increment by 1
        await dispatch(
          updateScore({ userId: currentUser._id, incrementBy: 1 })
        ).unwrap();

        // Optionally, refetch the score to ensure the latest value
        dispatch(fetchScore(currentUser._id));
      }
      // Navigate back to home
      toggleExamModal();
      await stopSound();
      router.push("stories"); // Navigate back to "stories" home screen
    } catch (error) {
      console.error("Failed to update score:", error);
      // Optionally, handle the error in the UI without using an alert
    }
  };

  return (
    <ScreenContainer>
      <Header>
        <TouchableOpacity onPress={handleBackToStories}>
          <CloseImg
            source={require("../../assets/icons/grayCross.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Header>

      <ContentContainer
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {storyData.story.map((paragraph, index) => (
          <StoryText key={index}>
            {paragraph}
            {"\n\n"}
          </StoryText>
        ))}
      </ContentContainer>
      <Container isHidden={isContainerHidden}>
        <ReCon>
          <TalCon onPress={toggleContainerVisibility}>
            <TimeText>اقرا</TimeText>
            <TopImg
              source={require("../../assets/icons/talking.png")}
              resizeMode="contain"
            />
          </TalCon>
          {/* Added Exam Button */}
          <TalCon onPress={toggleExamModal}>
            <TimeText>اختبار</TimeText>
            <TopImg
              source={require("../../assets/icons/badge.png")} // Ensure you have an exam icon in your assets
              resizeMode="contain"
            />
          </TalCon>
          <LisCon>
            <TimeText>استمع</TimeText>
            <TopImg
              source={require("../../assets/icons/listening.png")}
              resizeMode="contain"
            />
          </LisCon>
        </ReCon>
        <ProgressBarContainer>
          <Progress progress={progress} />
        </ProgressBarContainer>
        <AllCon>
          <Button onPress={() => changeAudioPosition(-10000)}>
            <TalImg
              source={require("../../assets/icons/backward.png")}
              resizeMode="contain"
            />
            <ButtonLabel>Backward</ButtonLabel>
          </Button>
          <Button onPress={handlePressPlayPause}>
            <TalImg
              source={
                isPlaying
                  ? require("../../assets/icons/pause.png")
                  : require("../../assets/icons/play.png")
              }
              resizeMode="contain"
            />
            <ButtonLabel>{isPlaying ? "Pause" : "Play"}</ButtonLabel>
          </Button>
          <Button onPress={() => changeAudioPosition(10000)}>
            <TalImg
              source={require("../../assets/icons/backward.png")}
              resizeMode="contain"
              style={{ transform: [{ scaleX: -1 }] }}
            />
            <ButtonLabel>Forward</ButtonLabel>
          </Button>
        </AllCon>
      </Container>
      {isContainerHidden && (
        <FloatingButton onPress={toggleContainerVisibility}>
          <TopImg
            source={require("../../assets/icons/listening.png")}
            resizeMode="contain"
          />
        </FloatingButton>
      )}

      {/* Exam Modal */}
      <Modal
        visible={isExamVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleExamModal}
      >
        <ModalContainer>
          <ExamContent>
            {currentQuestionIndex < storyData.exam.length ? (
              <>
                <QuestionText>
                  {storyData.exam[currentQuestionIndex].question}
                </QuestionText>
                {storyData.exam[currentQuestionIndex].options.map(
                  (option, idx) => (
                    <OptionButton
                      key={idx}
                      onPress={() => handleOptionSelect(option)}
                      isSelected={userAnswers[currentQuestionIndex] === option}
                    >
                      <OptionText>{option}</OptionText>
                    </OptionButton>
                  )
                )}
                <NextButton
                  onPress={handleNextQuestion}
                  disabled={!userAnswers[currentQuestionIndex]}
                >
                  <NextButtonText>
                    {currentQuestionIndex === storyData.exam.length - 1
                      ? "Submit"
                      : "Next"}
                  </NextButtonText>
                </NextButton>
              </>
            ) : (
              <>
                <ScoreText>
                  Your Exam Score: {localScore}/{storyData.exam.length}
                </ScoreText>
                <TakeHomeButton onPress={handleTakeHome}>
                  <TakeHomeButtonText>Take Me Home</TakeHomeButtonText>
                </TakeHomeButton>
              </>
            )}
          </ExamContent>
        </ModalContainer>
      </Modal>
    </ScreenContainer>
  );
};

export default Listen;
