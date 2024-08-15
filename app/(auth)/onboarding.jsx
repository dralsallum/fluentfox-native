import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { register, clearState } from "../redux/authSlice";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.TouchableOpacity``;

const ProgressBarContainer = styled.View`
  flex: 1;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 4px;
`;

const ProgressBar = styled.View`
  height: 100%;
  background-color: #4caf50;
  width: ${({ progress }) => `${progress}%`};
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  text-align: center;
  color: #666;
  margin-bottom: 20px;
`;

const OptionsContainer = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 4;
`;

const Option = styled.TouchableOpacity`
  flex-direction: row-reverse;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? "#E3F2FD" : "#F9F9F9")};
  border: 1px solid ${({ selected }) => (selected ? "#2196F3" : "#ccc")};
`;

const OptionIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin-left: 20px;
`;

const OptionText = styled.Text`
  font-size: 18px;
  color: #333;
  flex: 1;
  text-align: right;
`;

const GoalImage = styled.Image`
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  resize-mode: contain;
`;

const ContinueButton = styled.TouchableOpacity`
  background-color: #2196f3;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
  opacity: ${({ enabled }) => (enabled ? 1 : 0.5)};
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
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

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
  text-align: center;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 20px;
`;

const NotificationContainer = styled.View`
  align-items: center;
  margin-top: 20px;
`;

const questions = [
  {
    question: "حدد هدفك اليومي للدراسة",
    subText:
      "اختر المدة الزمنية التي يمكنك تخصيصها يوميًا لتعلم اللغة الإنجليزية.",
    options: [
      { text: "5 دقائق/يوم", icon: require("../../assets/images/clap.png") },
      { text: "10 دقائق/يوم", icon: require("../../assets/images/clap.png") },
      { text: "15 دقيقة/يوم", icon: require("../../assets/images/clap.png") },
      { text: "20 دقيقة/يوم", icon: require("../../assets/images/clap.png") },
    ],
    image: require("../../assets/images/goal.png"),
  },
  {
    question: "لماذا تتعلم اللغة الإنجليزية؟",
    subText: "اختر السبب الذي يصف دافعك بشكل أفضل.",
    options: [
      {
        text: "العائلة والمجتمع",
        icon: require("../../assets/images/clap.png"),
      },
      {
        text: "تحدي نفسي",
        icon: require("../../assets/images/clap.png"),
      },
      { text: "الثقافة", icon: require("../../assets/images/clap.png") },
      { text: "السفر", icon: require("../../assets/images/clap.png") },
      { text: "العمل", icon: require("../../assets/images/clap.png") },
      { text: "المدرسة", icon: require("../../assets/images/clap.png") },
      { text: "أخرى", icon: require("../../assets/images/clap.png") },
    ],
  },
  {
    question: "مرحبًا، [اسم المستخدم]، كم تعرف من اللغة الإنجليزية؟",
    subText: "حدد مستوى إتقانك الحالي للغة الإنجليزية.",
    options: [
      { text: "أنا مبتدئ", icon: require("../../assets/images/clap.png") },
      {
        text: "أعرف بعض الإنجليزية",
        icon: require("../../assets/images/clap.png"),
      },
    ],
    image: require("../../assets/images/goal.png"),
  },
  {
    question: "إنشاء حساب جديد",
    subText: "قم بتعبئة التفاصيل الخاصة بك لإنشاء حساب.",
    options: [], // No options for signup form
    isSignUp: true, // Custom flag to detect signup step
  },
  {
    question: "ابقَ على المسار مع التذكيرات اليومية",
    subText: "التذكيرات تساعد في بناء عادات تعلم أفضل.",
    options: [], // No options, this is a notification prompt
    isNotificationPrompt: true, // Custom flag to detect notification prompt
  },
];

const Onboarding = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const { isFetching, isError, errorMessage, isSuccess } = useSelector(
    (state) => state.user
  );

  const progress = (currentQuestionIndex / (questions.length - 1)) * 100;

  const handleSelectOption = (index) => {
    setSelectedOptionIndex(index);
  };

  const handleInputChange = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (questions[currentQuestionIndex].isSignUp) {
      if (!inputs.username || !inputs.email || !inputs.password) {
        alert("يرجى ملء جميع الحقول");
        return;
      }
      dispatch(register(inputs));
    } else if (questions[currentQuestionIndex].isNotificationPrompt) {
      await requestNotifications();
    } else if (selectedOptionIndex !== null) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptionIndex(null);
      } else {
        router.push("home/home");
      }
    } else {
      console.log("يرجى اختيار خيار");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOptionIndex(null);
    }
  };

  const requestNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      console.log("تم منح أذونات الإشعارات.");
    } else {
      console.log("تم رفض أذونات الإشعارات.");
    }
    router.push("home/home");
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("تم تسجيل المستخدم بنجاح");
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the notification prompt
      dispatch(clearState()); // Reset state after successful registration
    }
  }, [isSuccess]);

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Container>
            <Header>
              <ProgressBarContainer>
                <ProgressBar progress={progress} />
              </ProgressBarContainer>
              <BackButton onPress={handleBack}>
                <Image
                  source={require("../../assets/icons/back.png")}
                  style={{ width: 24, height: 24 }}
                />
              </BackButton>
            </Header>
            {questions[currentQuestionIndex].image && (
              <GoalImage source={questions[currentQuestionIndex].image} />
            )}
            <Title>{questions[currentQuestionIndex].question}</Title>
            <Subtitle>{questions[currentQuestionIndex].subText}</Subtitle>

            {!questions[currentQuestionIndex].isSignUp &&
            !questions[currentQuestionIndex].isNotificationPrompt ? (
              <OptionsContainer>
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <Option
                      key={index}
                      onPress={() => handleSelectOption(index)}
                      selected={selectedOptionIndex === index}
                    >
                      {option.icon && <OptionIcon source={option.icon} />}
                      <OptionText>{option.text}</OptionText>
                    </Option>
                  )
                )}
              </OptionsContainer>
            ) : questions[currentQuestionIndex].isSignUp ? (
              <Form>
                {isError && <ErrorText>{errorMessage}</ErrorText>}
                <InputContainer>
                  <Ionicons name="person-outline" size={20} color="#888" />
                  <Input
                    placeholder="اسم المستخدم"
                    placeholderTextColor="#888"
                    value={inputs.username}
                    onChangeText={(text) => handleInputChange("username", text)}
                  />
                </InputContainer>
                <InputContainer>
                  <Ionicons name="mail-outline" size={20} color="#888" />
                  <Input
                    placeholder="الايميل"
                    placeholderTextColor="#888"
                    value={inputs.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                  />
                </InputContainer>
                <InputContainer>
                  <Ionicons name="lock-closed-outline" size={20} color="#888" />
                  <Input
                    secureTextEntry
                    placeholder="باسورد"
                    placeholderTextColor="#888"
                    value={inputs.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                  />
                </InputContainer>
              </Form>
            ) : (
              <NotificationContainer>
                <Image
                  source={require("../../assets/icons/notification.png")} // Replace with your notification icon
                  style={{ width: 80, height: 80, marginBottom: 20 }}
                />
                <ContinueButton onPress={handleContinue}>
                  <ButtonText>تشغيل التذكيرات</ButtonText>
                </ContinueButton>
                <ContinueButton
                  onPress={() => router.push("home/home")}
                  style={{ backgroundColor: "#f0f0f0", marginTop: 10 }}
                >
                  <ButtonText style={{ color: "#000" }}>ربما لاحقًا</ButtonText>
                </ContinueButton>
              </NotificationContainer>
            )}

            {!questions[currentQuestionIndex].isNotificationPrompt && (
              <ContinueButton
                onPress={handleContinue}
                enabled={
                  questions[currentQuestionIndex].isSignUp
                    ? !isFetching
                    : selectedOptionIndex !== null
                }
              >
                <ButtonText>
                  {questions[currentQuestionIndex].isSignUp
                    ? isFetching
                      ? "إنشاء حساب..."
                      : "انشاء حساب جديد"
                    : "متابعة"}
                </ButtonText>
              </ContinueButton>
            )}
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
};

export default Onboarding;
