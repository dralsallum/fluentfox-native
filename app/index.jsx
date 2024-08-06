import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import styled from "styled-components/native";

const App = () => {
  return (
    <SafeArea>
      <Container>
        <StatusBar barStyle="light-content" />
        <Logo
          source={{
            uri: "https://img.icons8.com/clouds/100/graduation-cap.png",
          }}
          resizeMode="contain"
        />
        <Title>ابدا تعلم اللغة الانجليزية اليوم</Title>
        <FloatingIcons>
          <FloatingIcon
            source={{ uri: "https://img.icons8.com/clouds/100/000000/usa.png" }}
          />
          {/* Add more icons as needed */}
        </FloatingIcons>
        <Button onPress={() => console.log("Start Learning")}>
          <ButtonText>ابدا رحلتك</ButtonText>
        </Button>
        <SubText onPress={() => console.log("Log in")}>
          <Link href="/home">تملك حساب بالفعل؟ تسجيل الدخول</Link>
        </SubText>
      </Container>
    </SafeArea>
  );
};

export default App;

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
  height: 50px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  color: #ffffff;
  text-align: center;
  font-size: 24px;
  margin: 20px;
  padding: 0 30px;
`;

const FloatingIcons = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px;
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

const FloatingIcon = styled.Image`
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 25px;
`;
