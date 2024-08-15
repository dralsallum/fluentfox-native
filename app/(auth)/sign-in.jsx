import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { login, userSelector } from "../redux/authSlice";
import withAuthRedirect from "../redux/withAuthRedirect";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
`;

const Form = styled.View`
  width: 90%;
  padding: 20px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 5;
`;

const Header = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 0 10px;
  background-color: #f9f9f9;
`;

const Input = styled.TextInput`
  flex: 1;
  height: 40px;
  margin-left: 10px;
  font-size: 16px;
`;

const Button = styled.TouchableOpacity`
  background-color: #2946b6;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  height: 45px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 3;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
  text-align: center;
`;

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isError, isFetching, errorMessage } = useSelector(userSelector);

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      dispatch(login({ username, password }));
    } else {
      console.log("Username or password is missing.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <Form>
            <Header>تسجيل دخول</Header>
            {isError && <ErrorText>{errorMessage}</ErrorText>}
            <InputContainer>
              <Ionicons name="person-outline" size={20} color="#888" />
              <Input
                placeholder="إيميل"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
              />
            </InputContainer>
            <InputContainer>
              <Ionicons name="lock-closed-outline" size={20} color="#888" />
              <Input
                secureTextEntry
                placeholder="باسورد"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
              />
            </InputContainer>
            <Button onPress={handleLogin} disabled={isFetching}>
              {isFetching ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ButtonText>تسجيل الدخول</ButtonText>
              )}
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withAuthRedirect(SignIn);
