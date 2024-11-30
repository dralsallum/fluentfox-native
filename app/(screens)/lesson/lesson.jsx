import React, { useState, useEffect, useRef } from "react";
import { Image, Modal, View, Animated, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { xpSelector } from "../../redux/lessonsSlice";
import {
  unlockNextLesson,
  updateUnlockedSets,
  updateXP,
} from "../../redux/lessonsSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Speech from "expo-speech";
import {
  SafeArea,
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
  ResCon,
  ConButton,
  ConButtonText,
  ReCon,
  ReTex,
  ScCon,
  StCon,
  StText,
  MidCon,
  ScoreCon,
  ScoreText,
  PerTex,
  MulTop,
  MulMidTex,
  MulMidAn,
  MulMid,
  MulImage,
  PlaceholderText,
  SelectedOptionText,
  MulCon,
  SelectedOptionWrapper,
  SelectedOptionButton,
  LoadingAll,
  RealAll,
  RealView,
  SelectedRealButton,
  RealText,
  OptionsReal,
  UnderText,
  LineReal,
  StreView,
  StreSub,
  StreRo,
  StreTex,
  CheIco,
  StreText,
  ExpText,
  DayCircle,
  DayText,
} from "./lesson.element";
import { Audio } from "expo-av";
import CustomLoadingIndicator from "../../components/LoadingIndicator";
import { userSelector } from "../../redux/authSlice";

let samanthaVoice = null;

const getSamanthaVoice = async () => {
  if (samanthaVoice) {
    return samanthaVoice;
  }
  const voices = await Speech.getAvailableVoicesAsync();
  samanthaVoice = voices.find((voice) => voice.name.includes("Samantha"));
  return samanthaVoice;
};

const speakSentence = async (sentence) => {
  const selectedVoice = await getSamanthaVoice();
  const speechOptions = {
    rate: 0.9,
    pitch: 1.0,
    voice: selectedVoice?.identifier,
  };
  Speech.speak(sentence, speechOptions);
};

const WriteAnswerQuestion = ({
  currentQuestion,
  userAnswer,
  setUserAnswer,
}) => {
  useEffect(() => {
    if (/^[a-zA-Z\s]+$/.test(currentQuestion.sentence)) {
      speakSentence(currentQuestion.sentence);
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

const MultipleQuestion = ({
  currentQuestion,
  selectedOptions,
  handleOptionSelect,
  handleOptionDeselect,
  selectedOption,
  setSelectedOption,
}) => {
  useEffect(() => {
    if (/^[a-zA-Z\s]+$/.test(currentQuestion.sentence)) {
      speakSentence(currentQuestion.sentence);
    }
  }, [currentQuestion.sentence]);

  return (
    <MulCon>
      <MulTop>
        <MulImage
          source={{ uri: currentQuestion.ImageAvatar }}
          resizeMode="contain"
        />
      </MulTop>

      <MulMid>
        <MulMidTex>{currentQuestion.sentence}</MulMidTex>
        <MulMidAn>
          <SelectedOptionWrapper>
            {selectedOptions.length > 0 ? (
              selectedOptions.map((optionIndex, index) => (
                <SelectedOptionButton
                  key={index}
                  onPress={() => handleOptionDeselect(index)}
                  isSelected={selectedOption === index}
                >
                  <SelectedOptionText>
                    {currentQuestion.answerOptions[optionIndex].answerText}
                  </SelectedOptionText>
                </SelectedOptionButton>
              ))
            ) : (
              <PlaceholderText>______</PlaceholderText>
            )}
          </SelectedOptionWrapper>
        </MulMidAn>
        <MulMidTex>{currentQuestion.multiple}</MulMidTex>
      </MulMid>

      <OptionsContainer>
        {currentQuestion.answerOptions.map((option, index) => (
          <OptionButton
            key={index}
            onPress={() => handleOptionSelect(index)}
            isSelected={selectedOption === index}
          >
            <OptionText>{option.answerText}</OptionText>
          </OptionButton>
        ))}
      </OptionsContainer>
    </MulCon>
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
      speakSentence(currentQuestion.sentence);
    }
  }, [currentQuestion.sentence]);

  const handleSpeakerPress = () => {
    speakSentence(currentQuestion.sentence);
  };

  const handleOptionPress = async (index) => {
    const selectedAnswerText = currentQuestion.answerOptions[index].answerText;

    if (/^[a-zA-Z\s]+$/.test(selectedAnswerText)) {
      await speakSentence(selectedAnswerText);
    }

    handleOptionSelect(index);
  };

  return (
    <>
      <DialogueView>
        <SpeechBubble>
          <SpeechText>{currentQuestion.sentence}</SpeechText>
          <TouchableOpacity onPress={handleSpeakerPress}>
            <Image
              source={require("../../../assets/icons/speaker.png")}
              style={{ width: 24, height: 24, marginLeft: 5 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </SpeechBubble>
        <CharacterImage
          source={{ uri: currentQuestion.ImageAvatar }}
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
                borderColor: "rgb(206, 206, 206)",
                borderRadius: 12,
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowOffset: { width: -2, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 0.5,
                elevation: 3,
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
          <OptionButton key={index} onPress={() => handleOptionPress(index)}>
            <OptionText>{option.answerText}</OptionText>
          </OptionButton>
        ))}
      </OptionsContainer>
    </>
  );
};

const RealQuestion = ({
  currentQuestion,
  selectedOptionIndex,
  handleOptionSelect,
  showResult,
}) => {
  useEffect(() => {
    if (currentQuestion.sentence) {
      speakSentence(currentQuestion.sentence);
    }
  }, [currentQuestion.sentence]);

  const handleSpeakerPress = () => {
    speakSentence(currentQuestion.sentence);
  };

  return (
    <RealAll>
      <RealView>
        <CharacterImage
          source={{ uri: currentQuestion.ImageAvatar }}
          resizeMode="contain"
        />
        <SpeechBubble>
          <SpeechText>{currentQuestion.sentence}</SpeechText>
          <TouchableOpacity onPress={handleSpeakerPress}>
            <Image
              source={require("../../../assets/icons/speaker.png")}
              style={{ width: 24, height: 24, marginLeft: 5 }}
              resizeMode="contain"
              onPress={handleSpeakerPress}
            />
          </TouchableOpacity>
        </SpeechBubble>
      </RealView>
      <LineReal />
      <UnderText>{currentQuestion.multiple}</UnderText>
      <OptionsReal>
        {currentQuestion.answerOptions.map((option, index) => {
          const isSelected = selectedOptionIndex === index;
          const isCorrect = currentQuestion.correctOption === index;

          return (
            <SelectedRealButton
              key={index}
              onPress={() => handleOptionSelect(index)}
              selected={isSelected}
              showResult={showResult}
              isCorrect={isCorrect}
              isSelected={isSelected}
            >
              <RealText>{option.answerText}</RealText>
            </SelectedRealButton>
          );
        })}
      </OptionsReal>
    </RealAll>
  );
};

const ImageQuizQuestion = ({
  currentQuestion,
  selectedOptionIndex,
  handleOptionSelect,
  showResult,
}) => {
  useEffect(() => {
    if (currentQuestion.sentence) {
      speakSentence(currentQuestion.sentence);
    }
  }, [currentQuestion.sentence]);

  const handleSpeakerPress = () => {
    speakSentence(currentQuestion.sentence);
  };

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
  const [explanation, setExplanation] = useState("");
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
  const [showStreak, setShowStreak] = useState(false);
  const [hearts, setHearts] = useState(5);
  const router = useRouter();
  const route = useRoute();
  const [selectedSet, setSelectedSet] = useState(route.params?.set || "set1");
  const dispatch = useDispatch();
  const xp = useSelector(xpSelector);
  const correctSound = useRef(null);
  const incorrectSound = useRef(null);
  const doneSound = useRef(null);
  const [streakCount, setStreakCount] = useState(0);
  const { currentUser } = useSelector(userSelector);

  useEffect(() => {
    if (currentUser?.streakCount) {
      setStreakCount(currentUser.streakCount);
    }
  }, [currentUser]);

  const daysOfWeek = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: correct } = await Audio.Sound.createAsync({
        uri: "https://alsallum.s3.eu-north-1.amazonaws.com/correct.mp3",
      });
      correctSound.current = correct;

      const { sound: incorrect } = await Audio.Sound.createAsync({
        uri: "https://alsallum.s3.eu-north-1.amazonaws.com/Wrong.mp3",
      });
      incorrectSound.current = incorrect;

      const { sound: done } = await Audio.Sound.createAsync({
        uri: "https://alsallum.s3.eu-north-1.amazonaws.com/done.mp3",
      });
      doneSound.current = done;
    };

    loadSounds();

    return () => {
      if (correctSound.current) correctSound.current.unloadAsync();
      if (incorrectSound.current) incorrectSound.current.unloadAsync();
      if (doneSound.current) doneSound.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (resultModalVisible && doneSound.current) {
      doneSound.current.replayAsync();
    }
  }, [resultModalVisible]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://quizeng-022517ad949b.herokuapp.com/api/main/${selectedSet}`
        );
        const fetchedQuestions = response.data.questions;

        // Collect all image URLs
        const imageUrls = [];
        fetchedQuestions.forEach((question) => {
          if (question.ImageAvatar) {
            imageUrls.push(question.ImageAvatar);
          }
          if (question.answerOptions) {
            question.answerOptions.forEach((option) => {
              if (option.imageUrl) {
                imageUrls.push(option.imageUrl);
              }
            });
          }
        });

        // Preload all images
        const imagePromises = imageUrls.map((url) => Image.prefetch(url));
        await Promise.all(imagePromises);

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSet]);

  const handleBack = () => {
    router.push("home");
  };

  const handleOptionSelect = (index) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (
      currentQuestion.questionType === "imageQuiz" ||
      currentQuestion.questionType === "RealQuestion"
    ) {
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

    if (
      currentQuestion.questionType === "imageQuiz" ||
      currentQuestion.questionType === "RealQuestion"
    ) {
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
      if (correctSound.current) correctSound.current.replayAsync();
    } else {
      setHearts((prevHearts) => Math.max(0, prevHearts - 1));
      if (incorrectSound.current) incorrectSound.current.replayAsync();

      setExplanation(
        currentQuestion.explanation || "إجابة خاطئة! حاول مرة أخرى."
      );
    }

    setShowResult(true);
    setModalVisible(true);
  };

  const handleNextQuestion = () => {
    setModalVisible(false);
    setShowResult(false);
    setUserAnswer("");
    setExplanation("");

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
    dispatch(unlockNextLesson());
    dispatch(updateUnlockedSets());
    dispatch(updateXP());
    setResultModalVisible(false);
    router.push("home");
  };

  const handleTryAgain = () => {
    setShowTry(false);
    setCurrentQuestionIndex(0);
    setHearts(5);
    setProgress(0);
    setCorrectAnswersCount(0);
    setSelectedOptionIndex(null);
    setSelectedOptions([]);
    setUserAnswer("");
    setResultModalVisible(false);
  };

  if (loading) {
    return (
      <LoadingAll>
        <CustomLoadingIndicator />
      </LoadingAll>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isArabic = currentQuestion.questionType === "type1";
  const correctPercentage = Math.round(
    (correctAnswersCount / questions.length) * 100
  );

  return (
    <SafeArea>
      <Header>
        <BackButton onPress={handleBack}>
          <Image
            source={require("../../../assets/icons/grayCross.png")}
            style={{ width: 28, height: 28 }}
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
      ) : currentQuestion.questionType === "MultipleQuestion" ? (
        <MultipleQuestion
          currentQuestion={currentQuestion}
          selectedOptions={selectedOptions}
          handleOptionSelect={handleOptionSelect}
          handleOptionDeselect={handleOptionDeselect}
        />
      ) : currentQuestion.questionType === "RealQuestion" ? (
        <RealQuestion
          currentQuestion={currentQuestion}
          selectedOptionIndex={selectedOptionIndex}
          handleOptionSelect={handleOptionSelect}
          showResult={showResult}
          isAnswerCorrect={isAnswerCorrect}
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
            {isAnswerCorrect ? "إجابة صحيحة!" : explanation}
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
            <Image
              source={require("../../../assets/images/wins.png")}
              style={{ width: 120, height: 120, marginBottom: 20 }}
              resizeMode="contain"
            />
            <ResultText>تهانينا! لقد أنهيت الدرس بنجاح!</ResultText>
            <MidCon>
              <ReCon>
                <StCon>
                  <StText>النجوم</StText>
                </StCon>
                <StCon>
                  <Image
                    source={require("../../../assets/icons/stars.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                  <ReTex>{xp} + 1</ReTex>
                </StCon>
              </ReCon>
              <ScCon>
                <ScoreCon>
                  <ScoreText>النتيجة</ScoreText>
                </ScoreCon>
                <StCon>
                  <Image
                    source={require("../../../assets/icons/stock.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                  <PerTex>{correctPercentage}%</PerTex>
                </StCon>
              </ScCon>
            </MidCon>
            <ResCon>
              <ConButton onPress={handleFinished}>
                <ConButtonText>انتقل للدرس التالي</ConButtonText>
              </ConButton>
              <RestartButton onPress={handleTryAgain}>
                <RestartButtonText>اعادة الدرس</RestartButtonText>
              </RestartButton>
            </ResCon>
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
