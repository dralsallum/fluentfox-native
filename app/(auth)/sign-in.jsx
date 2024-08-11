import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { login } from "../redux/authSlice";
import { useRouter } from "expo-router"; // Import useRouter for navigation

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

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.auth);
  const router = useRouter(); // Use router for navigation

  const handleLogin = () => {
    dispatch(login({ username, password }));
  };

  useEffect(() => {
    if (user) {
      router.push("/home/home");
    }
  }, [user]);

  return (
    <Container>
      <Form>
        <Header>تسجيل دخول</Header>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <SubHeader>اسم مستخدم</SubHeader>
        <Input
          placeholder="اسم المستخدم"
          value={username}
          onChangeText={setUsername}
        />
        <SubHeader>الرقم السري</SubHeader>
        <Input
          secureTextEntry
          placeholder="الباسورد"
          value={password}
          onChangeText={setPassword}
        />
        <Button onPress={handleLogin} disabled={loading}>
          <ButtonText>
            {loading ? "جاري التحميل..." : "تسجيل الدخول"}
          </ButtonText>
        </Button>
      </Form>
    </Container>
  );
};

export default SignIn;
