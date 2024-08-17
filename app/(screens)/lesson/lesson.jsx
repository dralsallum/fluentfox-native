import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { Image, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { unlockNextLesson } from "../../redux/lessonsSlice";
import { useDispatch } from "react-redux";
import * as Speech from "expo-speech";
import {
  SafeArea,
  CenteredContainer,
  Header,
  BackButton,
  ProgressBarContainer,
  ProgressBar,
  TryModalContainer,
  TryModalContent,
  TryButtonText,
  TryButton,
  TryText,
  Footer,
  CheckButton,
  QuestionText,
  HeartContainer,
  HeartText,
  HeartImage,
  DialogueView,
  CharacterImage,
  SpeechBubble,
  LineContainer,
  LineOne,
  LineTwo,
  SpeechText,
  OptionsContainer,
  OptionButton,
  OptionText,
  BottomModalContainer,
  ModalText,
  NextButton,
  NextButtonText,
  ResultModalContainer,
  ResultModalContent,
  ResultText,
  RestartButton,
  RestartButtonText,
  ButtonText,
  ExCon,
  ImageOptionsContainer,
  TextView,
  TextAnswerInput,
  WriCon,
  ImageOptionContainer,
  ImageOptionButton,
  ImageOption,
  ExText,
} from "./lesson.element";

const WriteAnswerQuestion = ({
  currentQuestion,
  userAnswer,
  setUserAnswer,
}) => {
  useEffect(() => {
    if (/^[a-zA-Z\s]+$/.test(currentQuestion.sentence)) {
      Speech.speak(currentQuestion.sentence);
    }
  }, [currentQuestion.sentence]);

  return (
    <WriCon>
      <DialogueView>
        <SpeechBubble>
          <SpeechText>{currentQuestion.sentence}</SpeechText>
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
      <TextView>
        <TextAnswerInput
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder="باللغة الإنجليزية"
          placeholderTextColor="#a9a9a9"
        />
      </TextView>
    </WriCon>
  );
};

const RegularQuestion = ({
  currentQuestion,
  selectedOptions,
  handleOptionSelect,
  handleOptionDeselect,
  isArabic,
}) => {
  useEffect(() => {
    if (/^[a-zA-Z\s]+$/.test(currentQuestion.sentence)) {
      Speech.speak(currentQuestion.sentence);
    }
  }, [currentQuestion.sentence]);

  return (
    <>
      <DialogueView>
        <SpeechBubble>
          <SpeechText>{currentQuestion.sentence}</SpeechText>
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
              {currentQuestion.answerOptions[optionIndex].answerText}
            </OptionText>
          ))}
        </LineTwo>
        <LineTwo />
      </LineContainer>
      <OptionsContainer>
        {currentQuestion.answerOptions.map((option, index) => (
          <OptionButton key={index} onPress={() => handleOptionSelect(index)}>
            <OptionText>{option.answerText}</OptionText>
          </OptionButton>
        ))}
      </OptionsContainer>
    </>
  );
};

const ImageQuizQuestion = ({
  currentQuestion,
  selectedOptionIndex,
  handleOptionSelect,
  showResult,
  isAnswerCorrect,
}) => {
  useEffect(() => {
    if (/^[a-zA-Z\s]+$/.test(currentQuestion.sentence)) {
      Speech.speak(currentQuestion.sentence);
    }
  }, [currentQuestion.sentence]);

  return (
    <>
      <ExCon>
        <Image
          source={require("../../../assets/icons/speaker.png")}
          style={{ width: 24, height: 24, marginLeft: 5 }}
          resizeMode="contain"
        />
        <ExText>{currentQuestion.sentence}</ExText>
      </ExCon>
      <ImageOptionsContainer>
        {currentQuestion.answerOptions.map((option, index) => {
          const isSelected = selectedOptionIndex === index;
          const isCorrect = currentQuestion.correctOption === index;

          return (
            <ImageOptionButton
              key={index}
              onPress={() => handleOptionSelect(index)}
              selected={isSelected}
              showResult={showResult}
              isCorrect={isCorrect}
              isSelected={isSelected}
            >
              <ImageOptionContainer>
                <ImageOption
                  source={{ uri: option.imageUrl }}
                  resizeMode="contain"
                />
                <ExText>{option.answerText}</ExText>
              </ImageOptionContainer>
            </ImageOptionButton>
          );
        })}
      </ImageOptionsContainer>
    </>
  );
};

const Lesson = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [showTry, setShowTry] = useState(false);
  const [hearts, setHearts] = useState(5);
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

  const handleOptionSelect = (index) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.questionType === "imageQuiz") {
      setSelectedOptionIndex(index);
    } else {
      setSelectedOptions((prev) => [...prev, index]);
    }
  };

  const handleOptionDeselect = (index) => {
    setSelectedOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.questionType === "imageQuiz") {
      isCorrect = selectedOptionIndex === currentQuestion.correctOption;
    } else if (currentQuestion.questionType === "writeAnswer") {
      isCorrect =
        userAnswer.trim().toLowerCase() ===
        currentQuestion.expectedAnswer.toLowerCase();
    } else {
      const { correctSequence } = currentQuestion;
      isCorrect =
        selectedOptions.length === correctSequence.length &&
        selectedOptions.every(
          (value, index) => value === correctSequence[index]
        );
    }

    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    } else {
      setHearts((prevHearts) => Math.max(0, prevHearts - 1)); // Decrease hearts on incorrect answer
    }

    setShowResult(true); // Show the correct/incorrect feedback
    setModalVisible(true);
  };

  const handleNextQuestion = () => {
    setModalVisible(false);
    setShowResult(false); // Reset for the next question
    setUserAnswer(""); // Reset answer input for the next question

    if (hearts === 0) {
      setShowTry(true);
    } else {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedOptionIndex(null);
        setSelectedOptions([]);
      } else {
        setResultModalVisible(true);
      }
    }
  };

  const handleFinished = () => {
    setResultModalVisible(false);
    dispatch(unlockNextLesson());
    router.push("home/home");
  };

  const handleTryAgain = () => {
    setShowTry(false);
    setCurrentQuestionIndex(0);
    setHearts(5); // Reset hearts
    setProgress(0);
    setCorrectAnswersCount(0);
    setSelectedOptionIndex(null);
    setSelectedOptions([]);
    setUserAnswer("");
  };

  if (loading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color="#2497f2" />
      </CenteredContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isArabic = currentQuestion.questionType === "type1";

  return (
    <SafeArea>
      <Header>
        <BackButton onPress={handleBack}>
          <Image
            source={require("../../../assets/icons/cross.png")}
            style={{ width: 30, height: 30 }}
          />
        </BackButton>
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
        <HeartContainer>
          <HeartText>{hearts}</HeartText>
          <HeartImage
            source={require("../../../assets/icons/heart.png")}
            style={{ width: 24, height: 24 }}
          />
        </HeartContainer>
      </Header>
      <QuestionText>{currentQuestion.question}</QuestionText>

      {currentQuestion.questionType === "imageQuiz" ? (
        <ImageQuizQuestion
          currentQuestion={currentQuestion}
          selectedOptionIndex={selectedOptionIndex}
          handleOptionSelect={handleOptionSelect}
          showResult={showResult}
          isAnswerCorrect={isAnswerCorrect}
        />
      ) : currentQuestion.questionType === "writeAnswer" ? (
        <WriteAnswerQuestion
          currentQuestion={currentQuestion}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
        />
      ) : (
        <RegularQuestion
          currentQuestion={currentQuestion}
          selectedOptions={selectedOptions}
          handleOptionSelect={handleOptionSelect}
          handleOptionDeselect={handleOptionDeselect}
          isArabic={isArabic}
        />
      )}

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
            {isAnswerCorrect ? "إجابة صحيحة!" : "إجابة خاطئة! حاول مرة أخرى."}
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
              لقد أجبت بشكل صحيح على {correctAnswersCount} من أصل{" "}
              {questions.length} سؤال.
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={showTry}
        onRequestClose={() => setShowTry(false)}
      >
        <TryModalContainer>
          <TryModalContent>
            <TryText>لقد اخفقت حاول مره ثانيه</TryText>
            <Image
              source={require("../../../assets/icons/try.png")}
              style={{ width: 100, height: 100, marginBottom: 20 }}
              resizeMode="contain"
            />
            <TryButton onPress={handleTryAgain}>
              <TryButtonText>اعادة الاختبار</TryButtonText>
            </TryButton>
          </TryModalContent>
        </TryModalContainer>
      </Modal>
    </SafeArea>
  );
};

export default Lesson;
