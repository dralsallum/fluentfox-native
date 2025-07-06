import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
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
import { Audio } from "expo-av";
import CustomLoadingIndicator from "../../components/LoadingIndicator";
import { userSelector } from "../../redux/authSlice";
import LottieView from "lottie-react-native";

// ----------
//  STYLES
// ----------
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
} from "./lesson.element";

// ------------------------------
// Distinguish JSON vs. image
// ------------------------------
const isLottieFile = (url = "") => url.toLowerCase().endsWith(".json");
function onlyImages(url = "") {
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".webp")
  );
}

// ------------------------------
//  Grab "Samantha" voice if available
// ------------------------------
let samanthaVoice = null;
const getSamanthaVoice = async () => {
  if (samanthaVoice) return samanthaVoice;
  const voices = await Speech.getAvailableVoicesAsync();
  samanthaVoice = voices.find((voice) => voice.name.includes("Samantha"));
  return samanthaVoice;
};

/** Speak text without Lottie animation. */
const speakOnly = async (text) => {
  if (!text) return;
  Speech.stop(); // stop any ongoing TTS
  setTimeout(async () => {
    const voice = await getSamanthaVoice();
    Speech.speak(text, {
      rate: 0.9,
      pitch: 1.0,
      voice: voice?.identifier,
    });
  }, 200);
};

/**
 * A small helper: returns an object { speakWithAnimation }
 * that uses a local Lottie ref to "mouth move" from frame 0->99999
 */
const useSpeechAndLottie = (lottieRef) => {
  const speakWithAnimation = async (text) => {
    if (!text) return;
    // stop any current TTS first
    Speech.stop();

    // tiny delay so Lottie can mount
    setTimeout(async () => {
      if (lottieRef.current) {
        // reset + play
        lottieRef.current.play(0, 0);
        lottieRef.current.play(0, 99999);
      }

      const voice = await getSamanthaVoice();
      Speech.speak(text, {
        rate: 0.9,
        pitch: 1.0,
        voice: voice?.identifier,
        onDone: () => {
          if (lottieRef.current) {
            lottieRef.current.pause();
          }
        },
      });
    }, 300);
  };

  return { speakWithAnimation };
};

// ===============================
//  QUESTION TYPE COMPONENTS
// ===============================

/** WRITE ANSWER */
const WriteAnswerQuestion = ({
  currentQuestion,
  userAnswer,
  setUserAnswer,
}) => {
  const lottieRef = useRef(null);
  const { speakWithAnimation } = useSpeechAndLottie(lottieRef);

  useEffect(() => {
    speakWithAnimation(currentQuestion.sentence);
  }, [currentQuestion.sentence]);

  const handleSpeakerPress = () => {
    speakWithAnimation(currentQuestion.sentence);
  };

  return (
    <WriCon>
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

        {currentQuestion.lottieData ? (
          <LottieView
            key={currentQuestion.ImageAvatar}
            ref={lottieRef}
            source={currentQuestion.lottieData}
            style={{ width: 150, height: 150 }}
            loop={false}
            autoPlay={false}
          />
        ) : (
          <CharacterImage
            source={{ uri: currentQuestion.ImageAvatar }}
            resizeMode="contain"
          />
        )}
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

/** MULTIPLE FILL-IN-BLANK */
const MultipleQuestion = ({
  currentQuestion,
  selectedOptions,
  handleOptionSelect,
  handleOptionDeselect,
}) => {
  const lottieRef = useRef(null);
  const { speakWithAnimation } = useSpeechAndLottie(lottieRef);

  useEffect(() => {
    speakWithAnimation(currentQuestion.sentence);
  }, [currentQuestion.sentence]);

  const handleOptionPress = (idx) => {
    speakOnly(currentQuestion.answerOptions[idx].answerText);
    handleOptionSelect(idx);
  };

  return (
    <MulCon>
      <MulTop>
        {currentQuestion.lottieData ? (
          <LottieView
            key={currentQuestion.ImageAvatar}
            ref={lottieRef}
            source={currentQuestion.lottieData}
            style={{ width: 200, height: 200 }}
            loop={false}
            autoPlay={false}
          />
        ) : (
          <MulImage
            source={{ uri: currentQuestion.ImageAvatar }}
            resizeMode="contain"
          />
        )}
      </MulTop>

      <MulMid>
        <MulMidTex>{currentQuestion.sentence}</MulMidTex>

        <TouchableOpacity
          onPress={() => speakWithAnimation(currentQuestion.sentence)}
        >
          <Image
            source={require("../../../assets/icons/speaker.png")}
            style={{ width: 24, height: 24, marginLeft: 5 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <MulMidAn>
          <SelectedOptionWrapper>
            {selectedOptions.length > 0 ? (
              selectedOptions.map((optionIndex, idx) => (
                <SelectedOptionButton
                  key={idx}
                  onPress={() => handleOptionDeselect(idx)}
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
        {currentQuestion.answerOptions.map((option, idx) => {
          // If the user already selected this option, dim it
          const alreadySelected = selectedOptions.includes(idx);

          return (
            <OptionButton
              key={idx}
              onPress={() => handleOptionPress(idx)}
              style={{ opacity: alreadySelected ? 0.5 : 1 }}
            >
              <OptionText>{option.answerText}</OptionText>
            </OptionButton>
          );
        })}
      </OptionsContainer>
    </MulCon>
  );
};

/** REGULAR QUESTION (type1/type2) => pick words in correct order */
const RegularQuestion = ({
  currentQuestion,
  selectedOptions,
  handleOptionSelect,
  handleOptionDeselect,
  isArabic,
}) => {
  const lottieRef = useRef(null);
  const { speakWithAnimation } = useSpeechAndLottie(lottieRef);

  useEffect(() => {
    speakWithAnimation(currentQuestion.sentence);
  }, [currentQuestion.sentence]);

  const handleSpeakerPress = () => {
    speakWithAnimation(currentQuestion.sentence);
  };

  const handleOptionPress = (index) => {
    speakOnly(currentQuestion.answerOptions[index].answerText);
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

        {currentQuestion.lottieData ? (
          <LottieView
            key={currentQuestion.ImageAvatar}
            ref={lottieRef}
            source={currentQuestion.lottieData}
            style={{ width: 150, height: 150 }}
            loop={false}
            autoPlay={false}
          />
        ) : (
          <CharacterImage
            source={{ uri: currentQuestion.ImageAvatar }}
            resizeMode="contain"
          />
        )}
      </DialogueView>

      <LineContainer>
        <LineOne />
        <LineTwo isArabic={isArabic}>
          {selectedOptions.map((optionIndex, idx) => (
            <OptionText
              key={idx}
              onPress={() => handleOptionDeselect(idx)}
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
        {currentQuestion.answerOptions.map((option, idx) => {
          // Dim if selected
          const isSelected = selectedOptions.includes(idx);
          return (
            <OptionButton
              key={idx}
              onPress={() => handleOptionPress(idx)}
              style={{ opacity: isSelected ? 0.5 : 1 }}
            >
              <OptionText>{option.answerText}</OptionText>
            </OptionButton>
          );
        })}
      </OptionsContainer>
    </>
  );
};

/** SINGLE-CHOICE TEXT (RealQuestion) */
const RealQuestion = ({
  currentQuestion,
  selectedOptionIndex,
  handleOptionSelect,
  showResult,
}) => {
  const lottieRef = useRef(null);
  const { speakWithAnimation } = useSpeechAndLottie(lottieRef);

  useEffect(() => {
    speakWithAnimation(currentQuestion.sentence);
  }, [currentQuestion.sentence]);

  const handleSpeakerPress = () => {
    speakWithAnimation(currentQuestion.sentence);
  };

  const handleOptionPress = (idx) => {
    speakOnly(currentQuestion.answerOptions[idx].answerText);
    handleOptionSelect(idx);
  };

  return (
    <RealAll>
      <RealView>
        {currentQuestion.lottieData ? (
          <LottieView
            key={currentQuestion.ImageAvatar}
            ref={lottieRef}
            source={currentQuestion.lottieData}
            style={{ width: 150, height: 150 }}
            loop={false}
            autoPlay={false}
          />
        ) : (
          <CharacterImage
            source={{ uri: currentQuestion.ImageAvatar }}
            resizeMode="contain"
          />
        )}

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
      </RealView>

      <LineReal />
      <UnderText>{currentQuestion.multiple}</UnderText>

      <OptionsReal>
        {currentQuestion.answerOptions.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = currentQuestion.correctOption === idx;

          return (
            <SelectedRealButton
              key={idx}
              onPress={() => handleOptionPress(idx)}
              selected={isSelected}
              showResult={showResult}
              isCorrect={isCorrect}
              style={{ opacity: isSelected ? 0.5 : 1 }}
            >
              <RealText>{option.answerText}</RealText>
            </SelectedRealButton>
          );
        })}
      </OptionsReal>
    </RealAll>
  );
};

/** IMAGE QUIZ QUESTION (single-choice with images) */
const ImageQuizQuestion = ({
  currentQuestion,
  selectedOptionIndex,
  handleOptionSelect,
  showResult,
}) => {
  const lottieRef = useRef(null); // If we had Lottie for images (rare), but kept for consistency
  const { speakWithAnimation } = useSpeechAndLottie(lottieRef);

  useEffect(() => {
    speakWithAnimation(currentQuestion.sentence);
  }, [currentQuestion.sentence]);

  const handleSpeakerPress = () => {
    speakWithAnimation(currentQuestion.sentence);
  };

  const handleOptionPress = (idx) => {
    speakOnly(currentQuestion.answerOptions[idx].answerText);
    handleOptionSelect(idx);
  };

  return (
    <>
      <ExCon>
        <TouchableOpacity onPress={handleSpeakerPress}>
          <Image
            source={require("../../../assets/icons/speaker.png")}
            style={{ width: 24, height: 24, marginLeft: 5 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ExText>{currentQuestion.sentence}</ExText>
      </ExCon>

      <ImageOptionsContainer>
        {currentQuestion.answerOptions.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = currentQuestion.correctOption === idx;

          return (
            <ImageOptionButton
              key={idx}
              onPress={() => handleOptionPress(idx)}
              selected={isSelected}
              showResult={showResult}
              isCorrect={isCorrect}
              style={{ opacity: isSelected ? 0.5 : 1 }}
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

// ===============================
//   Main Lesson Component
// ===============================
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
  const [hearts, setHearts] = useState(5);

  const router = useRouter();
  const route = useRoute();
  const [selectedSet, setSelectedSet] = useState(route.params?.set || "set1");

  const dispatch = useDispatch();
  const xp = useSelector(xpSelector);
  const { currentUser } = useSelector(userSelector);

  const [streakCount, setStreakCount] = useState(0);
  useEffect(() => {
    if (currentUser?.streakCount) {
      setStreakCount(currentUser.streakCount);
    }
  }, [currentUser]);

  // --------------------
  //  Preload sounds
  // --------------------
  const correctSound = useRef(null);
  const incorrectSound = useRef(null);
  const doneSound = useRef(null);

  useEffect(() => {
    const loadSounds = async () => {
      try {
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
      } catch (error) {
        console.error("Error loading sounds:", error);
      }
    };

    loadSounds();

    return () => {
      if (correctSound.current) correctSound.current.unloadAsync();
      if (incorrectSound.current) incorrectSound.current.unloadAsync();
      if (doneSound.current) doneSound.current.unloadAsync();
    };
  }, []);

  // Play "done" sound on final result
  useEffect(() => {
    if (resultModalVisible && doneSound.current) {
      doneSound.current.replayAsync();
    }
  }, [resultModalVisible]);

  // --------------------
  //  Fetch & Preload Questions
  // --------------------
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://quizeng-022517ad949b.herokuapp.com/api/main/${selectedSet}`
        );
        const fetchedQuestions = response.data?.questions || [];

        // Preload all images and Lottie JSON
        await preloadAllAssets(fetchedQuestions);

        // Once everything is preloaded, set them in state
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSet]);

  /**
   * Preload all images and Lottie JSON for the entire question list
   * so that the first question's animation works instantly.
   */
  const preloadAllAssets = async (questionsData) => {
    const tasks = [];

    for (const q of questionsData) {
      // 1) Avatar (could be image or lottie)
      if (isLottieFile(q.ImageAvatar)) {
        tasks.push(
          fetchLottie(q.ImageAvatar).then((jsonData) => {
            q.lottieData = jsonData;
          })
        );
      } else if (onlyImages(q.ImageAvatar)) {
        tasks.push(Image.prefetch(q.ImageAvatar));
      }

      // 2) answerOptions: could have images or none
      if (Array.isArray(q.answerOptions)) {
        for (const opt of q.answerOptions) {
          // If there's an imageUrl, prefetch
          if (opt.imageUrl && onlyImages(opt.imageUrl)) {
            tasks.push(Image.prefetch(opt.imageUrl));
          }
        }
      }
    }

    // Wait for all fetches/prefetches
    await Promise.all(tasks);
  };

  // Helper to fetch Lottie JSON
  const fetchLottie = async (url) => {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Failed to fetch Lottie JSON from ${url}`);
    }
    return resp.json();
  };

  // --------------------
  //  Progressive Prefetch (optional)
  // --------------------
  // You can optionally keep your progressive prefetch if desired,
  // but since we now load *all* assets before showing the lesson,
  // the progressive fetch is less critical.
  // For clarity, it's commented out.

  /*
  useEffect(() => {
    if (questions.length === 0) return;
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      const nextQuestion = questions[nextIndex];
      // ... Progressive prefetch for next question’s images or Lottie
    }
  }, [currentQuestionIndex, questions]);
  */

  // --------------------
  //  Handlers
  // --------------------
  const handleBack = () => {
    router.push("home");
  };

  const handleOptionSelect = (index) => {
    const currentQuestion = questions[currentQuestionIndex];

    // For single-choice (imageQuiz / RealQuestion):
    if (
      currentQuestion.questionType === "imageQuiz" ||
      currentQuestion.questionType === "RealQuestion"
    ) {
      setSelectedOptionIndex(index);
    } else {
      // For multi-choice or typed question:
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
      // Single choice
      isCorrect = selectedOptionIndex === currentQuestion.correctOption;
    } else if (currentQuestion.questionType === "writeAnswer") {
      // Write answer
      isCorrect =
        userAnswer.trim().toLowerCase() ===
        currentQuestion.expectedAnswer?.toLowerCase();
    } else {
      // "Regular" / "MultipleQuestion"
      const { correctSequence } = currentQuestion;
      isCorrect =
        selectedOptions.length === correctSequence.length &&
        selectedOptions.every((val, idx) => val === correctSequence[idx]);
    }

    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
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

    // No hearts => show "try again"
    if (hearts === 0) {
      setShowTry(true);
      return;
    }

    // Update progress
    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);

    // Move on or show final result
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setSelectedOptions([]);
    } else {
      setResultModalVisible(true);
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

  // --------------------
  //  Render
  // --------------------
  if (loading) {
    return (
      <LoadingAll>
        <CustomLoadingIndicator />
      </LoadingAll>
    );
  }

  if (!questions.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>لا يوجد أسئلة لهذا الدرس</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>السؤال غير متاح</Text>
      </View>
    );
  }

  const isArabic = currentQuestion.questionType === "type1";
  const correctPercentage = Math.round(
    (correctAnswersCount / questions.length) * 100
  );

  return (
    <SafeArea>
      {/* Header */}
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

      {/* Question text */}
      <QuestionText>{currentQuestion.question}</QuestionText>

      {/* Render question by type */}
      {(() => {
        switch (currentQuestion.questionType) {
          case "imageQuiz":
            return (
              <ImageQuizQuestion
                currentQuestion={currentQuestion}
                selectedOptionIndex={selectedOptionIndex}
                handleOptionSelect={handleOptionSelect}
                showResult={showResult}
              />
            );
          case "writeAnswer":
            return (
              <WriteAnswerQuestion
                currentQuestion={currentQuestion}
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
              />
            );
          case "MultipleQuestion":
            return (
              <MultipleQuestion
                currentQuestion={currentQuestion}
                selectedOptions={selectedOptions}
                handleOptionSelect={handleOptionSelect}
                handleOptionDeselect={handleOptionDeselect}
              />
            );
          case "RealQuestion":
            return (
              <RealQuestion
                currentQuestion={currentQuestion}
                selectedOptionIndex={selectedOptionIndex}
                handleOptionSelect={handleOptionSelect}
                showResult={showResult}
              />
            );
          default:
            // "type1" / "type2" => pick words in correct order
            return (
              <RegularQuestion
                currentQuestion={currentQuestion}
                selectedOptions={selectedOptions}
                handleOptionSelect={handleOptionSelect}
                handleOptionDeselect={handleOptionDeselect}
                isArabic={isArabic}
              />
            );
        }
      })()}

      {/* Footer */}
      <Footer>
        <CheckButton onPress={handleCheckAnswer}>
          <ButtonText>تحقق</ButtonText>
        </CheckButton>
      </Footer>

      {/* Correct / Incorrect Modal */}
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

      {/* Final Result Modal */}
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

      {/* Out of Hearts / Try Again */}
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
