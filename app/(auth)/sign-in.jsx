import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { login, userSelector } from "../redux/authSlice";
import withAuthRedirect from "../redux/withAuthRedirect";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

// Styled Components for better UI
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f8;
  padding: 20px;
`;

const Form = styled.View`
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 15px;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 4.65px;
  elevation: 5;
`;

const Header = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #4c47e8;
  margin-bottom: 25px;
  text-align: center;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 0 15px;
  background-color: #f9f9f9;
`;

const Input = styled.TextInput`
  flex: 1;
  height: 45px;
  margin-left: 10px;
  font-size: 16px;
  color: #333;
`;

const Button = styled.TouchableOpacity`
  background-color: #4c47e8;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin-top: 20px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 4.65px;
  elevation: 3;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const SecondaryButton = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

const SecondaryButtonText = styled.Text`
  color: #6b7c93;
  font-size: 16px;
  font-weight: bold;
`;

const ForgotPasswordButton = styled.TouchableOpacity`
  margin-top: 10px;
  align-items: center;
`;

const ForgotPasswordText = styled.Text`
  color: #4c47e8;
  font-size: 15px;
  font-weight: bold;
  text-decoration: underline;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
  text-align: center;
`;

const TermsContainer = styled.View`
  margin-top: 30px;
  padding: 0 20px;
`;

const TermsText = styled.Text`
  text-align: center;
  color: #6b7c93;
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 10px;
`;

const TermsLink = styled.Text`
  color: #4c47e8;
  font-weight: bold;
  text-decoration: underline;
`;

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isError, isFetching, errorMessage } = useSelector(userSelector);
  const router = useRouter();

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      dispatch(login({ username, password }));
    }
  };

  const handleOnboardingNavigation = () => {
    router.push("onboarding");
  };

  const handleForgotPassword = () => {
    router.push("response");
  };

  const handlePrivacy = async () => {
    const url =
      "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open URI: ${url}`);
      // Optionally, you can alert the user or handle the error as needed
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
            <Header>تسجيل الدخول</Header>
            {isError && <ErrorText>{errorMessage}</ErrorText>}
            <InputContainer>
              <Ionicons name="person-outline" size={20} color="#888" />
              <Input
                placeholder="اسم المستخدم"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
              />
            </InputContainer>
            <InputContainer>
              <Ionicons name="lock-closed-outline" size={20} color="#888" />
              <Input
                secureTextEntry
                placeholder="كلمة المرور"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
              />
            </InputContainer>

            {/* Login Button */}
            <Button onPress={handleLogin} disabled={isFetching}>
              {isFetching ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ButtonText>تسجيل الدخول</ButtonText>
              )}
            </Button>

            {/* Forgot Password Button */}
            <ForgotPasswordButton onPress={handleForgotPassword}>
              <ForgotPasswordText>نسيت كلمة المرور؟</ForgotPasswordText>
            </ForgotPasswordButton>
            <TouchableOpacity
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://www.fluentfox.net/privacy-policy"
                )
              }
            >
              <TermsText>
                <TermsLink>
                  يُرجى الاطلاع على اشعارات الخصوصية الخاص بنا
                </TermsLink>
              </TermsText>
            </TouchableOpacity>

            {/* Secondary Button for navigating to Onboarding */}
            <SecondaryButton onPress={handleOnboardingNavigation}>
              <SecondaryButtonText>
                ليس لديك حساب؟ أنشئ حساب جديد
              </SecondaryButtonText>
            </SecondaryButton>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withAuthRedirect(SignIn);
