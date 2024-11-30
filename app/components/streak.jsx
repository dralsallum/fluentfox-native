// Streak.js (Frontend)
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../redux/authSlice";
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
  const { currentUser } = useSelector(userSelector);
  const streakCount = currentUser?.streak?.count || 0;
  const lastUpdated = currentUser?.streak?.lastUpdated
    ? new Date(currentUser.streak.lastUpdated)
    : null;

  const [rotatedDays, setRotatedDays] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);

  useEffect(() => {
    if (lastUpdated && streakCount > 0) {
      // Calculate the start date of the streak
      const startDate = new Date(lastUpdated);
      startDate.setDate(startDate.getDate() - (streakCount - 1));

      // Get the day of the week for the start date (0 = Sunday, 1 = Monday, ...)
      const startDayIndex = startDate.getDay();

      // Original days of the week starting from Sunday
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // Rotate the daysOfWeek array so that it starts from the startDayIndex
      const rotated = [
        ...daysOfWeek.slice(startDayIndex),
        ...daysOfWeek.slice(0, startDayIndex),
      ];

      // Only update state if rotatedDays is different to prevent unnecessary re-renders
      const isDifferent =
        rotated.length !== rotatedDays.length ||
        rotated.some((day, index) => day !== rotatedDays[index]);

      if (isDifferent) {
        setRotatedDays(rotated);
      }
    } else {
      // If no streak, show default order
      const defaultDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const isDifferent =
        defaultDays.length !== rotatedDays.length ||
        defaultDays.some((day, index) => day !== rotatedDays[index]);

      if (isDifferent) {
        setRotatedDays(defaultDays);
      }
    }
  }, [lastUpdated, streakCount, rotatedDays]);

  // Function to determine if a particular day in the rotated array is completed
  const isDayCompleted = (index) => {
    return index < streakCount;
  };

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
          {rotatedDays.map((day, index) => (
            <View key={index} style={{ alignItems: "center" }}>
              <DayCircle completed={isDayCompleted(index)}>
                {isDayCompleted(index) && (
                  <Image
                    source={require("../../assets/icons/check.png")}
                    style={{ width: 20, height: 20 }}
                  />
                )}
              </DayCircle>
              <DayText completed={isDayCompleted(index)}>{day}</DayText>
            </View>
          ))}
        </View>
        <StreakMessage>
          {streakCount > 0
            ? `You've started a streak of ${streakCount} day${
                streakCount > 1 ? "s" : ""
              }!`
            : "Start your streak by signing in daily!"}
        </StreakMessage>
      </StreakContainer>
    </SafeArea>
  );
};

export default Streak;
