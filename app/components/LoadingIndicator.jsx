import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import styled from "styled-components/native";

const LoadingContainer = styled.View`
  width: 50%;
  height: 3px;
  background-color: #bfbfbf;
  overflow: hidden;
`;

const LoadingBar = styled(Animated.View)`
  height: 100%;
  background-color: #4c47e8;
`;

const CustomLoadingIndicator = () => {
  const widthAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start an infinite loop animation for the loading bar
    Animated.loop(
      Animated.timing(widthAnimation, {
        toValue: 1, // We animate from 0 to 1, then interpolate this to width percentages
        duration: 1500, // Duration for one loop of the animation
        easing: Easing.linear, // Corrected reference to Easing.linear
        useNativeDriver: false, // We animate layout properties, so this must be false
      })
    ).start();
  }, [widthAnimation]);

  const animatedStyle = {
    width: widthAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"], // Animating from 0% to 100% width
    }),
  };
  return (
    <LoadingContainer>
      <LoadingBar style={animatedStyle} />
    </LoadingContainer>
  );
};

export default CustomLoadingIndicator;
