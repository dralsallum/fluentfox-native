import React, { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import styled from "styled-components/native";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";

const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #f8f9fa;
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

const Listen = () => {
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isContainerHidden, setIsContainerHidden] = useState(false);
  const [storyData, setStoryData] = useState({ story: [], audioUrl: "" });

  const router = useRouter();
  const route = useRoute();
  const scrollViewRef = useRef(null);
  const [selectedSet, setSelectedSet] = useState(route.params?.set || "set1");

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
        setStoryData(data);
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
          const newPosition = status.positionMillis + change;
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
            <TimeText>Read</TimeText>
            <TopImg
              source={require("../../assets/icons/talking.png")}
              resizeMode="contain"
            />
          </TalCon>
          <LisCon>
            <TimeText>Listen</TimeText>
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
    </ScreenContainer>
  );
};

export default Listen;
