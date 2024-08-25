import React, { useState, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../redux/authSlice";

// Styled components
const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
  justify-content: space-between;
`;

const StreakContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const FireIcon = styled.Image`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

const DaysContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 90%;
  margin-bottom: 20px;
  padding: 10px 0;
  border: 1px solid #e1e1e1;
  border-radius: 25px;
`;

const DayCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 2px solid ${(props) => (props.completed ? "#4caf50" : "#e1e1e1")};
  background-color: ${(props) => (props.completed ? "#4caf50" : "#ffffff")};
  justify-content: center;
  align-items: center;
`;

const DayText = styled.Text`
  font-size: 12px;
  color: ${(props) => (props.completed ? "#ffffff" : "#333333")};
  margin-top: 5px;
`;

const StreakMessage = styled.Text`
  font-size: 22px;
  color: #000000;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StreakDescription = styled.Text`
  font-size: 14px;
  color: #666666;
  text-align: center;
  margin-bottom: 20px;
`;

const ShareButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid #007aff;
`;

const ShareText = styled.Text`
  font-size: 16px;
  color: #007aff;
`;

const ContinueButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 15px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  margin-bottom: 10px;
`;

const ContinueButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

const Streak = () => {
  const [streakCount, setStreakCount] = useState(0);
  const { currentUser } = useSelector(userSelector);

  useEffect(() => {
    // Fetch user data from Redux store
    if (currentUser?.streakCount) {
      setStreakCount(currentUser.streakCount);
    }
  }, [currentUser]);

  const daysOfWeek = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

  return (
    <SafeArea>
      <StreakContainer>
        <FireIcon
          source={require("../../assets/icons/fire.png")}
          resizeMode="contain"
        />
        <DaysContainer>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={{ alignItems: "center" }}>
              <DayCircle completed={index < streakCount}>
                {index < streakCount && (
                  <Image
                    source={require("../../assets/icons/check.png")}
                    style={{ width: 20, height: 20 }}
                  />
                )}
              </DayCircle>
              <DayText completed={index < streakCount}>{day}</DayText>
            </View>
          ))}
        </DaysContainer>
        <StreakMessage>You've started a streak!</StreakMessage>
        <StreakDescription>
          Study every day to build your streak and create a powerful learning
          habit.
        </StreakDescription>
        <ShareButton>
          <ShareText>Share</ShareText>
        </ShareButton>
      </StreakContainer>
      <ContinueButton>
        <ContinueButtonText>Continue</ContinueButtonText>
      </ContinueButton>
    </SafeArea>
  );
};

export default Streak;
