import { Link, Redirect, router } from "expo-router";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import LottieView from "lottie-react-native";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonPress = () => {
    router.push("onboarding");
  };
  const handleButtonPress1 = () => {
    router.push("sign-in");
  };

  return (
    <SafeArea>
      <Container>
        <StatusBar barStyle="light-content" />
        <LottieView
          source={require("./utils/foxAnimation - 1724582171334.json")}
          autoPlay
          loop
          style={{
            width: 250, // Adjust the size as needed
            height: 250,
          }}
        />
        <Subtitle>ابدأ رحلتك التعليمة. اليوم!</Subtitle>
        <ButtonContainer>
          <Button onPress={handleButtonPress} isLoading={isLoading}>
            <ButtonText>ابدأ الآن</ButtonText>
          </Button>
          <ButtonSign onPress={handleButtonPress1}>
            <TextSign>لديك حساب؟ تسجيل الدخول</TextSign>
          </ButtonSign>
        </ButtonContainer>
      </Container>
    </SafeArea>
  );
};

export default Index;

// Styled Components
const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #f7f7f7;
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: 50px;
`;

const Logo = styled.Image`
  width: 350px;
  height: 100px;
`;

const Subtitle = styled.Text`
  color: #4c47e8;
  font-size: 28px;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
  letter-spacing: 1.5px;
  line-height: 34px;
  padding: 0 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const ButtonContainer = styled.View`
  width: 100%;
  padding: 0 20px;
  position: absolute;
  bottom: 30px;
`;

const Button = styled.TouchableOpacity`
  background-color: #4c47e8;
  border-radius: 25px;
  padding: 15px 0;
  margin-bottom: 10px;
  width: 100%;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
`;

const ButtonSign = styled.TouchableOpacity`
  background-color: transparent;
  border-radius: 25px;
  padding: 15px 0;
  width: 100%;
  border: 1px solid #4c47e8;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const TextSign = styled.Text`
  color: #4c47e8;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;
