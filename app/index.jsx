import { Link, Redirect, router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonPress = () => {
    router.push("onboarding");
  };
  const handleButtonPress1 = () => {
    router.push("home/home");
  };

  return (
    <SafeArea>
      <Container>
        <StatusBar barStyle="light-content" />
        <Title>ابدا تعلم اللغة الانجليزية اليوم</Title>
        <Logo
          source={require("../assets/images/banner.png")}
          resizeMode="contain"
        />
        <Button onPress={handleButtonPress} isLoading={isLoading}>
          <ButtonText>ابدا رحلتك</ButtonText>
        </Button>
        <SubText onPress={() => console.log("Log in")}>
          <ButtonSign onPress={handleButtonPress1}>
            <TextSign>تملك حساب بالفعل؟ تسجيل الدخول</TextSign>
          </ButtonSign>
        </SubText>
      </Container>
    </SafeArea>
  );
};

export default Index;

// Styled Components
const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #0139a4;
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 300px;
  height: 300px;
`;

const Title = styled.Text`
  color: #ffffff;
  text-align: center;
  font-size: 24px;
  padding: 0 30px;
`;

const FloatingIcons = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.TouchableOpacity`
  background-color: #00c569;
  border-radius: 20px;
  padding: 15px 60px;
  margin: 20px 0;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
`;
const ButtonSign = styled.TouchableOpacity`
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
`;
const TextSign = styled.Text`
  color: #fff;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

const SubText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 20px;
`;
