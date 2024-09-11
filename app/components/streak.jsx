import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateStreakCount, userSelector } from "../redux/authSlice";
import styled from "styled-components/native";
import LottieView from "lottie-react-native";
import { View, Image, Text } from "react-native";

// Styled Components
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

const DayCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 2px solid ${({ completed }) => (completed ? "#4caf50" : "#e1e1e1")};
  background-color: ${({ completed }) => (completed ? "#4caf50" : "#ffffff")};
  justify-content: center;
  align-items: center;
`;

const DayText = styled.Text`
  font-size: 12px;
  color: ${({ completed }) => (completed ? "#000" : "#333333")};
  margin-top: 5px;
`;

const StreakMessage = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const Streak = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(userSelector);
  const streakCount = currentUser?.streak?.count || 0;

  useEffect(() => {
    if (currentUser) {
      dispatch(updateStreakCount({ userId: currentUser._id }));
    }
  }, [currentUser, dispatch]);

  const daysOfWeek = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

  return (
    <SafeArea>
      <StreakContainer>
        <LottieView
          source={require("../utils/fireAnimation - 1724581924405.json")}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "90%",
            marginVertical: 20,
          }}
        >
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
        </View>
        <StreakMessage>You've started a streak!</StreakMessage>
      </StreakContainer>
    </SafeArea>
  );
};

export default Streak;
