import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { Image, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { unlockNextLesson } from "../../redux/lessonsSlice";
import { useDispatch } from "react-redux";

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const Header = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  margin: 20px;
`;

const BackButton = styled.TouchableOpacity``;

const ProgressBarContainer = styled.View`
  flex: 1;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 4px;
  flex-direction: row-reverse; /* Start the progress bar from the right */
`;

const ProgressBar = styled.View`
  height: 100%;
  background-color: #2497f2; /* Updated color */
  width: ${({ progress }) => `${progress}%`};
`;

const Footer = styled.View`
  position: absolute;
  bottom: 30px;
  width: 100%;
  padding: 10px 0;
  background-color: #fff;
`;

const CheckButton = styled.TouchableOpacity`
  align-self: center;
  justify-content: center;
  background-color: #2497f2; /* Updated color */
  width: 85%;
  padding: 10px 0px;
  border-radius: 20px;
  margin: 5px;
  border: 2px solid #c9c9c9;
`;

const QuestionText = styled.Text`
  font-size: 24px;
  font-weight: 500;
  text-align: right;
  margin: 20px;
`;

const DialogueView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const CharacterImage = styled.Image`
  width: 80px;
  height: 160px;
`;

const SpeechBubble = styled.View`
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
  max-width: 60%;
  gap: 5px;
`;

const LineContainer = styled.View`
  align-items: center;
`;

const LineOne = styled.View`
  width: 90%;
  height: 0px;
  background-color: transparent;
  border-bottom-width: 2px;
  border-bottom-color: #c9c9c9;
  margin-top: -10px;
`;

const LineTwo = styled.View`
  width: 90%;
  height: 60px;
  background-color: transparent;
  border-bottom-width: 2px;
  border-bottom-color: #c9c9c9;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  direction: ${({ isArabic }) => (isArabic ? "rtl" : "ltr")};
`;

const SpeechText = styled.Text`
  color: #000;
  font-size: 18px;
`;

const OptionsContainer = styled.View`
  margin-top: 50px;
  flex-direction: row;
  align-self: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const QuizButton = styled.TouchableOpacity`
  background-color: ${(props) =>
    props.selected ? (props.isCorrect ? "green" : "red") : "#f1fafe"};
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 10px;
  width: 90%;
  align-items: center;
`;

const OptionButton = styled.TouchableOpacity`
  align-self: center;
  justify-content: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin: 5px;
  border: 2px solid #c9c9c9;
`;

const OptionText = styled.Text`
  color: #494949;
  font-size: 22px;
  font-weight: 500;
  text-align: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
`;

const BottomModalContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20%;
  justify-content: center;
  align-items: center;
  background-color: ${({ isCorrect }) => (isCorrect ? "#d4edda" : "#f8d7da")};
  border-top-width: 2px;
  border-color: ${({ isCorrect }) => (isCorrect ? "#4caf50" : "#f44336")};
`;

const ModalText = styled.Text`
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
  color: ${({ isCorrect }) => (isCorrect ? "#155724" : "#721c24")};
`;

const NextButton = styled.TouchableOpacity`
  background-color: ${({ isCorrect }) => (isCorrect ? "#4caf50" : "#f44336")};
  padding: 10px 20px;
  border-radius: 10px;
  width: 100px;
  align-items: center;
`;

const NextButtonText = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
`;

const ResultModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ResultModalContent = styled.View`
  width: 80%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  border-width: 2px;
  border-color: #4caf50;
`;

const ResultText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 20px;
  text-align: center;
`;

const RestartButton = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 10px 20px;
  border-radius: 10px;
`;

const RestartButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
`;

const Lesson = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const route = useRoute();
  const [selectedSet, setSelectedSet] = useState(route.params?.set || "set1");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://quizeng-022517ad949b.herokuapp.com/api/main/${selectedSet}`
        );
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSet]);

  const handleBack = () => {
    router.back();
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions((prev) => [...prev, optionIndex]);
  };

  const handleOptionDeselect = (optionIndex) => {
    setSelectedOptions((prev) => prev.filter((_, idx) => idx !== optionIndex));
  };

  const handleCheckAnswer = () => {
    const { correctSequence } = questions[currentQuestionIndex];
    const isCorrect =
      selectedOptions.length === correctSequence.length &&
      selectedOptions.every((value, index) => value === correctSequence[index]);

    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    }

    setModalVisible(true);
  };

  const handleNextQuestion = () => {
    setModalVisible(false);

    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOptions([]);
    } else {
      setResultModalVisible(true);
    }
  };

  const handleFinished = () => {
    setResultModalVisible(false);
    dispatch(unlockNextLesson());
    router.push("home/home");
  };

  if (loading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color="#2497f2" />
      </CenteredContainer>
    );
  }

  const isArabic = questions[currentQuestionIndex].questionType === "type1";

  return (
    <SafeArea>
      <Header>
        <BackButton onPress={handleBack}>
          <Image
            source={require("../../../assets/icons/cross.png")}
            style={{ width: 28, height: 28 }}
          />
        </BackButton>
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
      </Header>
      <QuestionText>{questions[currentQuestionIndex].question}</QuestionText>
      <DialogueView>
        <SpeechBubble>
          <SpeechText>{questions[currentQuestionIndex].sentence}</SpeechText>
          <Image
            source={require("../../../assets/icons/speaker.png")}
            style={{ width: 24, height: 24, marginLeft: 5 }}
            resizeMode="contain"
          />
        </SpeechBubble>
        <CharacterImage
          source={require("../../../assets/images/mainGirl.png")}
          resizeMode="contain"
        />
      </DialogueView>

      <LineContainer>
        <LineOne />
        <LineTwo isArabic={isArabic}>
          {selectedOptions.map((optionIndex, index) => (
            <OptionText
              key={index}
              onPress={() => handleOptionDeselect(index)}
              selectable={false}
              style={{
                borderWidth: 2,
                borderColor: "#c9c9c9",
                borderRadius: 10,
                padding: 8,
                margin: 4,
                marginBottom: 8,
                marginRight: isArabic ? 0 : 4,
                marginLeft: isArabic ? 4 : 0,
              }}
            >
              {
                questions[currentQuestionIndex].answerOptions[optionIndex]
                  .answerText
              }
            </OptionText>
          ))}
        </LineTwo>
        <LineTwo />
      </LineContainer>
      <OptionsContainer>
        {questions[currentQuestionIndex].answerOptions.map((option, index) => (
          <OptionButton key={index} onPress={() => handleOptionSelect(index)}>
            <OptionText>{option.answerText}</OptionText>
          </OptionButton>
        ))}
      </OptionsContainer>

      <Footer>
        <CheckButton onPress={handleCheckAnswer}>
          <ButtonText>تحقق</ButtonText>
        </CheckButton>
      </Footer>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BottomModalContainer isCorrect={isAnswerCorrect}>
          <ModalText>
            {isAnswerCorrect
              ? "إجابة صحيحة! هذا هو الترتيب الصحيح."
              : "إجابة خاطئة! حاول مرة أخرى."}
          </ModalText>
          <NextButton isCorrect={isAnswerCorrect} onPress={handleNextQuestion}>
            <NextButtonText>التالي</NextButtonText>
          </NextButton>
        </BottomModalContainer>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={resultModalVisible}
        onRequestClose={() => setResultModalVisible(false)}
      >
        <ResultModalContainer>
          <ResultModalContent>
            <ResultText>
              {`لقد أجبت بشكل صحيح على ${correctAnswersCount} من أصل ${questions.length} سؤال.`}
            </ResultText>
            <Image
              source={require("../../../assets/images/congratulations.png")}
              style={{ width: 100, height: 100, marginBottom: 20 }}
              resizeMode="contain"
            />
            <RestartButton onPress={handleFinished}>
              <RestartButtonText>انتقل للدرس التالي</RestartButtonText>
            </RestartButton>
          </ResultModalContent>
        </ResultModalContainer>
      </Modal>
    </SafeArea>
  );
};

export default Lesson;
