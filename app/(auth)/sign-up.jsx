import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";

// Styled Components for React Native
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

const Form = styled.View`
  width: 90%;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid lightgray;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const SubHeader = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Input = styled.TextInput`
  height: 40px;
  margin-bottom: 10px;
  border: 1px solid gray;
  padding-horizontal: 10px;
  border-radius: 2px;
`;

const Button = styled.TouchableOpacity`
  background-color: #2946b6;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
`;

const SignUp = () => {
  const [inputs, setInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Simulate an API call
      console.log("Submitting:", inputs);
      setTimeout(() => {
        setIsLoading(false);
        alert("Logged In");
      }, 2000);
    } catch (error) {
      setErrorMessage("An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Form>
        <Header>تسجيل دخول</Header>
        {errorMessage ? (
          <Text style={{ color: "red" }}>{errorMessage}</Text>
        ) : null}
        <SubHeader>اسم مستخدم</SubHeader>
        <Input
          placeholder="اسم المستخدم"
          onChangeText={(text) => handleChange("username", text)}
        />
        <SubHeader>ايميل</SubHeader>
        <Input
          placeholder="الايميل"
          onChangeText={(text) => handleChange("email", text)}
        />
        <SubHeader>الرقم السري</SubHeader>
        <Input
          secureTextEntry
          placeholder="الباسورد"
          onChangeText={(text) => handleChange("password", text)}
        />
        <Button onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ButtonText>انشاء حساب جديد</ButtonText>
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default SignUp;
