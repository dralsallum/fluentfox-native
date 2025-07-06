import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
import styled from "styled-components/native";
import playIcon from "../../../assets/icons/speaker.png";
import shuffleIcon from "../../../assets/icons/shuffle.png";
import americaIcon from "../../../assets/icons/america.png";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import useDeviceType from "../../../hooks/useDeviceType";
import * as Speech from "expo-speech";
import { Audio } from "expo-av"; // for correct/wrong SFX

// ----- Redux -----
import { useDispatch, useSelector } from "react-redux";
import {
  unlockNextLesson,
  updateUnlockedSets,
  updateXP,
  xpSelector,
} from "../../redux/lessonsSlice";

/* ===========================
    Styled Components
=========================== */
const SafeArea = styled.SafeAreaView``;

export const AllWr = styled.View`
  width: 95%;
  margin-left: auto;
  margin-right: auto;
`;

export const VocWra = styled.View`
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

export const VocHead = styled.Text`
  text-align: right;
  font-size: 18px;
  line-height: 25px;
  margin: 10px 0;
  color: #545454;
`;
export const VocHeadSpan = styled.Text`
  color: #0a9be3;
`;

export const VocMain = styled.View`
  background-color: #f1faff;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
  height: 80%;
  shadow-color: rgba(0, 0, 0, 0.15);
  shadow-offset: 0px 0px;
  shadow-opacity: 1;
  shadow-radius: 4px;
  elevation: 4;
  z-index: 1;
`;

export const VocOn = styled.View`
  top: 11px;
  right: 20px;
  position: absolute;
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
`;

export const VocOnBut = styled.TouchableOpacity`
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 3px;
  margin: 0;
  padding: 0;
`;

const IconImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const HiddenWr = styled.View`
  display: ${(props) => (props.isHidden ? "none" : "flex")};
  z-index: 10;
  top: 35px;
  right: 10px;
  position: absolute;
  height: 75px;
  flex-shrink: 0;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  elevation: 3;
  color: #0275b8;
`;

export const HidSub = styled.View`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

export const HidOn = styled.View`
  flex-direction: row;
  gap: 16px;
`;

export const HidOnSp = styled.Text`
  color: #0275b8;
  font-size: 14px;
`;

export const HidOnIm = styled.Image`
  width: 24px;
  height: 24px;
`;

export const VocTh = styled.Text`
  align-items: center;
  margin-bottom: 20px;
  flex-direction: column;
  gap: 0.5em;
`;

const DropdownHeader = styled.TouchableOpacity`
  width: 100%;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  elevation: 5;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DropdownText = styled.Text`
  font-size: 16px;
  color: #545454;
`;

const DropdownIcon = styled.Text`
  font-size: 16px;
`;

const OptionsContainer = styled.View`
  position: absolute;
  top: 55px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  elevation: 5;
  z-index: 999;
  padding: 10px;
`;

const OptionItem = styled.TouchableOpacity`
  padding: 10px;
`;

const OptionText = styled.Text`
  font-size: 16px;
  color: #545454;
`;

const SelectContainer = styled.View`
  width: 80%;
  align-items: center;
  position: relative;
  z-index: 2;
`;

export const VocFo = styled.View`
  margin-top: 2rem;
  flex: 1;
  width: 100%;
  flex-direction: column;
  align-items: center;
  user-select: none;
  position: relative;
`;

export const VocFoTop = styled.View`
  flex: 1;
  width: 100%;
  position: relative;
  margin-bottom: 30px;
`;

export const VocFoMid = styled.View`
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const VocMidBut = styled.TouchableOpacity`
  width: 15px;
  height: 11px;
  background-color: transparent;
  border-radius: 3px;
  margin: 0;
`;

export const VocFoBot = styled.View`
  flex-direction: row;
  font-size: 16px;
  line-height: 16px;
  align-items: center;
`;

export const VocFoSpan = styled.Text`
  margin: 0 10px;
  min-width: 3.25em;
  text-align: center;
`;

export const VocFoSpan1 = styled.Text`
  font-size: 16px;
  line-height: 16px;
`;

const CroBut = styled.TouchableOpacity`
  margin: 15px;
  margin-left: auto;
  margin-bottom: 10px;
`;

const CrossIcon = styled.Image`
  width: 26px;
  height: 26px;
`;

const VocFoBut = styled.TouchableOpacity`
  background-color: #0a9be3;
  border-radius: 3px;
  padding: 9px 10px;
  min-width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`;

const VocFoNe = styled.TouchableOpacity`
  border-radius: 3px;
  background-color: #0b9be3;
  padding: 9px 10px;
  min-width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  font-family: "Open Sans";
`;

const VocFoPronounceButton = styled.TouchableOpacity`
  background-color: #0a9be3;
  border-radius: 3px;
  padding: 9px 10px;
  min-width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FlipCardContainer = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
`;

const CardContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 185px;
  margin-top: ${(props) => (props.isTablet ? "100px" : "40px")};
  margin-left: ${(props) => (props.isTablet ? "300px" : "11px")};
  z-index: 1;
`;

const CardOn = styled.View`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const CardOnDiv = styled.View`
  flex: 1;
  justify-content: center;
  border: 2px solid #6cb4e9;
  border-radius: 8px;
  position: relative;
  text-align: center;
  align-items: center;
  width: 100%;
`;

const CardOnWord = styled.Text`
  color: #545454;
  font-family: "Open Sans";
  font-size: 26px;
  font-weight: 700;
  position: absolute;
  bottom: 80px;
`;

const CardOnSp = styled.View`
  flex-direction: column;
`;

const CardOnAm = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 80px;
`;

const CardOnIc = styled.View`
  width: 16px;
  height: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CardOnAt = styled.TouchableOpacity`
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const CardOnLe = styled.View`
  flex-direction: row;
`;

const CardOnWr = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const CardOnSpan = styled.Text`
  color: #768994;
  font-size: 13px;
  font-weight: 400;
  line-height: 32px;
`;

const CardTwo = styled.View`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 10px;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
`;

const CardTwoSub = styled.View`
  flex: 1;
  justify-content: center;
  border: 2px solid #6cb4e9;
  border-radius: 8px;
  position: relative;
  text-align: center;
  width: 100%;
`;

const CardTwoLi = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const CardTwoIm = styled.Image`
  width: 80px;
  height: 55px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const CardTwoTe = styled.View`
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const CardTwoSp = styled.Text`
  text-align: center;
  font-size: 14px;
  margin-bottom: 1px;
`;

const CardTwoSpa = styled.Text`
  color: #000;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
  padding-right: 0.25em;
`;

/* ====== Quiz / TryAgain / Results modals ====== */
const TryModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;
const TryModalContent = styled.View`
  width: 80%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;
const TryText = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
`;
const TryButton = styled.TouchableOpacity`
  background-color: #0a9be3;
  padding: 10px 20px;
  border-radius: 5px;
`;
const TryButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const QuizModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;
const QuizModalContent = styled.View`
  width: 90%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;

const HeartsContainer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

const QuestionCountText = styled.Text`
  font-size: 15px;
  margin-bottom: 15px;
  color: #333;
`;

const QuizQuestionText = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
`;
const QuizOption = styled.TouchableOpacity`
  margin: 5px 0;
  border-radius: 5px;
  padding: 10px 15px;
  width: 80%;
`;
const QuizOptionText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
`;

// We'll add a new button row for "Check / Next"
const QuizBottomRow = styled.View`
  margin-top: 20px;
  width: 80%;
  flex-direction: row;
  justify-content: center;
`;

const CheckButton = styled.TouchableOpacity`
  background-color: #0a9be3;
  border-radius: 5px;
  padding: 12px 20px;
`;

const CheckButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const AnimatedResultModalContainer = Animated.createAnimatedComponent(View);

const ResultModalContent = styled(View)`
  width: 90%;
  padding: 20px;
  height: 80%;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  justify-content: space-around;
`;

const ResultText = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
`;

const MidCon = styled(View)`
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const ReCon = styled(View)`
  flex-direction: row-reverse;
  padding: 10px;
  border: 2px solid #dae2eb;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
`;

const StCon = styled(View)`
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;

const StText = styled(Text)`
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

const ReTex = styled(Text)`
  color: #4a5766;
`;

const ScoreCon = styled.View`
  margin-bottom: 5px;
`;
const ScoreText = styled.Text`
  font-size: 16px;
`;
const PerTex = styled.Text`
  font-size: 14px;
  margin-left: 5px;
`;

const ScCon = styled(View)`
  flex-direction: row-reverse;
  padding: 10px;
  border: 2px solid #dae2eb;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
`;

const ResCon = styled.View`
  flex-direction: column;
  width: 100%;
  gap: 10px;
  align-items: center;
`;
const ConButton = styled(TouchableOpacity)`
  background-color: #4c47e8;
  padding: 10px 20px;
  border-radius: 18px;
  width: 280px;
  align-items: center;
`;

const ConButtonText = styled(Text)`
  color: #fff;
  font-size: 18px;
  text-align: center;
`;

const RestartButton = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 18px;
  width: 280px;
  align-items: center;
  border: 2px solid #ced5dd;
`;

const RestartButtonText = styled(Text)`
  color: #000;
  font-size: 18px;
  text-align: center;
`;
/* ====== Button row for Listen + Quiz side by side ====== */
const VocFoButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

// We'll animate scale for the Quiz button
const QuizButton = Animated.createAnimatedComponent(styled.TouchableOpacity`
  border-radius: 3px;
  padding: 9px 10px;
  min-width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
`);

const Words = () => {
  const route = useRoute();
  const router = useRouter();
  const isTablet = useDeviceType();

  const dispatch = useDispatch();
  const xp = useSelector(xpSelector);

  /* ===========================
      Local States
  =========================== */
  // Dropdown
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Set 1 - Introduction");
  const [isHidden, setIsHidden] = useState(true);

  // Cards
  const [cardsData, setCardsData] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Speech

  const [voices, setVoices] = useState([]);
  const [bestWordVoice, setBestWordVoice] = useState(null); // slower, clearer
  const [bestSentenceVoice, setBestSentenceVoice] = useState(null); // natural pace

  // Animations for flipping & transitions
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const quizButtonScale = useRef(new Animated.Value(1)).current;

  // Which set is loaded
  const [selectedSet, setSelectedSet] = useState(
    route.params?.set || "medical1"
  );

  // Quiz states
  const [showTry, setShowTry] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [answerChecked, setAnswerChecked] = useState(false);

  // Score / result
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // SFX
  const correctSound = useRef(null);
  const incorrectSound = useRef(null);

  // For a nice fade-in on the Results Modal
  const [modalOpacity] = useState(new Animated.Value(0));

  // Extra feedback overlay for correct/wrong
  const [answerFeedback, setAnswerFeedback] = useState(null); // "correct" | "wrong" | null
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  // Motivational messages in Arabic
  const motivationalMessages = useMemo(
    () => ["عمل رائع!", "مذهل!", "ممتاز!", "تابع هكذا!", "أحسنت!"],
    []
  );

  /* ===========================
      useEffects
  =========================== */

  // Fetch data on mount / when set changes
  useEffect(() => {
    const fetchVocabularyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://quizeng-022517ad949b.herokuapp.com/api/vocabulary/${selectedSet}`
        );
        if (response.data && Array.isArray(response.data.words)) {
          setCardsData(response.data.words);
        } else {
          setCardsData([]);
        }
      } catch (error) {
        setCardsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVocabularyData();
  }, [selectedSet]);

  // Fetch voices
  useEffect(() => {
    const pickVoices = async () => {
      const v = await Speech.getAvailableVoicesAsync();
      setVoices(v);

      const byScore = (prefs) =>
        v.find((voice) => prefs.every((p) => voice.name?.includes(p)));

      setBestWordVoice(
        byScore(["Siri", "Female", "en-US"]) ||
          byScore(["en-us-x-sfg", "local"]) ||
          v.find(
            (voice) =>
              voice.quality === "Enhanced" && voice.language.startsWith("en")
          ) ||
          v.find((voice) => voice.language.startsWith("en"))
      );

      setBestSentenceVoice(
        byScore(["Siri", "Male", "en-US"]) ||
          byScore(["en-us-x-iol", "local"]) ||
          v.find(
            (voice) =>
              voice.quality === "Enhanced" &&
              voice.language.startsWith("en") &&
              voice !== bestWordVoice
          ) ||
          v.find((voice) => voice.language.startsWith("en"))
      );
    };
    pickVoices();
  }, []);

  // Load SFX
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
      } catch {}
    };
    loadSounds();
    return () => {
      if (correctSound.current) correctSound.current.unloadAsync();
      if (incorrectSound.current) incorrectSound.current.unloadAsync();
    };
  }, []);

  // Animate the quiz button when on the last card
  useEffect(() => {
    if (cardsData.length > 0 && currentCard === cardsData.length - 1) {
      // Start a continuous loop: scale up, then scale down
      Animated.loop(
        Animated.sequence([
          Animated.timing(quizButtonScale, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(quizButtonScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      quizButtonScale.stopAnimation();
      quizButtonScale.setValue(1);
    }
  }, [currentCard, cardsData.length, quizButtonScale]);

  // Animate result modal's appearance
  useEffect(() => {
    if (resultModalVisible) {
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      modalOpacity.setValue(0);
    }
  }, [resultModalVisible, modalOpacity]);

  /* ===========================
      Helpers
  =========================== */

  // Shuffling array
  const shuffleArray = useCallback((array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // Getting random translations for distractors
  const getRandomTranslations = useCallback(
    (correct, allCards, count) => {
      const translations = allCards
        .map((c) => c.translation)
        .filter((t) => t !== correct);
      return shuffleArray(translations).slice(0, count);
    },
    [shuffleArray]
  );

  // Show "correct"/"wrong" overlay with short fade-in/out
  const showFeedback = useCallback(
    (type) => {
      setAnswerFeedback(type);
      feedbackAnim.setValue(0);

      Animated.sequence([
        Animated.timing(feedbackAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackAnim, {
          toValue: 0,
          duration: 1500,
          delay: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setAnswerFeedback(null);
      });
    },
    [feedbackAnim]
  );

  /* ===========================
      Flip Card Logic
  =========================== */
  const flipCard = () => {
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  /* ===========================
      Dropdown
  =========================== */
  const options = [
    { label: "Set 1 - Introduction", value: "medical1" },
    { label: "Set 2 - Basics", value: "set1" },
    { label: "Set 3 - Advanced", value: "medical3" },
  ];

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const selectOption = (option) => {
    setSelectedOption(option.label);
    setSelectedSet(option.value);
    toggleDropdown();
    setCurrentCard(0);
    setIsFlipped(false);
    animatedValue.setValue(0);
  };

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  /* ===========================
      Card Rendering
  =========================== */
  const renderCard = ({ item }) => {
    if (!item) return null;
    return (
      <Animated.View
        style={[
          {
            transform: [{ translateX: translateX }],
            opacity,
          },
          styles.card,
        ]}
      >
        <CardContainer isTablet={isTablet}>
          <FlipCardContainer onPress={flipCard}>
            {/* Front side */}
            <Animated.View style={[frontAnimatedStyle, styles.flipCard]}>
              <CardOn>
                <CardOnDiv>
                  <CardOnWord>{item.word}</CardOnWord>
                  <CardOnSp>
                    <CardOnAm>
                      <CardOnIc>
                        <CardOnAt onPress={handlePronounce}>
                          <Image
                            source={playIcon}
                            style={{ width: 16, height: 16, marginRight: 30 }}
                          />
                        </CardOnAt>
                      </CardOnIc>
                      <CardOnLe>
                        <CardOnWr>
                          <Image
                            source={americaIcon}
                            style={{ width: 16, height: 16, marginRight: 4 }}
                          />
                          <CardOnSpan>English/US</CardOnSpan>
                        </CardOnWr>
                      </CardOnLe>
                    </CardOnAm>
                  </CardOnSp>
                </CardOnDiv>
              </CardOn>
            </Animated.View>

            {/* Back side */}
            <Animated.View
              style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}
            >
              <CardTwo>
                <CardTwoSub>
                  <CardTwoLi>
                    {item.img && (
                      <CardTwoIm
                        source={{ uri: item.img }}
                        resizeMode="contain"
                      />
                    )}
                    <CardTwoTe>
                      <CardTwoSpa>{item.translation}</CardTwoSpa>
                      <CardTwoSp>{item.answer}</CardTwoSp>
                      <CardTwoSp>{item.explain}</CardTwoSp>
                    </CardTwoTe>
                  </CardTwoLi>
                </CardTwoSub>
              </CardTwo>
            </Animated.View>
          </FlipCardContainer>
        </CardContainer>
      </Animated.View>
    );
  };

  /* ===========================
      Speech
  =========================== */
  const handlePronounce = () => {
    if (!cardsData.length) return;
    const current = cardsData[currentCard];
    if (!current) return;

    const isSentenceSide = isFlipped;
    const ttsOptions = {
      voice: (isSentenceSide ? bestSentenceVoice : bestWordVoice)?.identifier,
      language: "en-US",
      pitch: isSentenceSide ? 1.05 : 0.95,
      rate: isSentenceSide ? 0.95 : 0.78,
    };

    const text = isSentenceSide ? current.answer : current.word;

    Speech.stop();
    Speech.speak(text, ttsOptions);
  };

  const pronounceButtonText = isFlipped ? "استمع للجملة" : "استمع للكلمة";

  /* ===========================
      Card Navigation
  =========================== */
  const animateCardTransition = (direction) => {
    // direction = +1 or -1
    const offset = direction > 0 ? -300 : 300;
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: offset,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentCard((prev) => prev + direction);
      translateX.setValue(-offset);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      setIsFlipped(false);
      animatedValue.setValue(0);
    });
  };

  const goToNextCard = () => {
    if (currentCard < cardsData.length - 1) {
      animateCardTransition(1);
    }
  };

  const goToPreviousCard = () => {
    if (currentCard > 0) {
      animateCardTransition(-1);
    }
  };

  /* ===========================
      Quiz Logic
  =========================== */
  const startQuiz = () => {
    // Only allow quiz if on last card
    if (currentCard !== cardsData.length - 1) return;

    setQuizIndex(0);
    setWrongCount(0);
    setCorrectAnswersCount(0);
    setSelectedChoice(null);
    setAnswerChecked(false);

    const shuffled = shuffleArray([...cardsData]);
    const sampleCount = Math.min(15, shuffled.length);
    const quizSubset = shuffled.slice(0, sampleCount);

    const prepared = quizSubset.map((item) => ({
      question: item.word,
      correctAnswer: item.translation,
      choices: shuffleArray([
        item.translation,
        ...getRandomTranslations(item.translation, cardsData, 3),
      ]),
    }));

    setQuizQuestions(prepared);
    setQuizModalVisible(true);
  };

  const handleSelectChoice = (choice) => {
    if (!answerChecked) {
      setSelectedChoice(choice);
    }
  };

  // Animate progress bar fill
  const progressBarWidth = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (quizQuestions.length > 0) {
      Animated.timing(progressBarWidth, {
        toValue: ((quizIndex + 1) / quizQuestions.length) * 100,
        duration: 300,
        useNativeDriver: false, // width anim requires false
      }).start();
    }
  }, [quizIndex, quizQuestions.length, progressBarWidth]);

  // The big button flow: "Check" or "Next"
  const handleCheckOrNext = async () => {
    if (!answerChecked) {
      if (selectedChoice) {
        const currentQuestion = quizQuestions[quizIndex];
        const isCorrect = selectedChoice === currentQuestion.correctAnswer;

        if (isCorrect) {
          setCorrectAnswersCount((prev) => prev + 1);
          showFeedback("correct");
          if (correctSound.current) {
            await correctSound.current.replayAsync();
          }
        } else {
          setWrongCount((prev) => prev + 1);
          showFeedback("wrong");
          if (incorrectSound.current) {
            await incorrectSound.current.replayAsync();
          }
          // If user accumulates 5 wrong, show "try again"
          if (wrongCount + 1 >= 5) {
            setTimeout(() => {
              setQuizModalVisible(false);
              setShowTry(true);
            }, 700);
            return;
          }
        }
        setAnswerChecked(true);
      }
    } else {
      // Next question or finish
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex((prev) => prev + 1);
        setSelectedChoice(null);
        setAnswerChecked(false);
      } else {
        finishQuiz();
      }
    }
  };

  const finishQuiz = () => {
    setQuizModalVisible(false);
    setResultModalVisible(true);
  };

  const resetForReview = () => {
    // Close any quiz/try/result modal that might be open
    setQuizModalVisible(false);
    setShowTry(false);
    setResultModalVisible(false);

    // Put the flash‑card deck back to the start
    setCurrentCard(0);
    setWrongCount(0);
    setCorrectAnswersCount(0);
    setSelectedChoice(null);
    setAnswerChecked(false);

    // Make sure the first card is shown front‑side
    setIsFlipped(false);
    animatedValue.setValue(0);
  };

  const handleTryAgain = () => {
    resetForReview();
  };

  // The important part: dispatching Redux actions & awarding XP
  const handleFinished = () => {
    dispatch(unlockNextLesson());
    dispatch(updateUnlockedSets());
    dispatch(updateXP());
    setResultModalVisible(false);
    router.push("home");
  };

  // Random motivational message in Arabic (displayed if correct)
  const feedbackMessage = useMemo(() => {
    if (answerFeedback === "correct") {
      return motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ];
    }
    return answerFeedback === "wrong" ? "إجابة خاطئة!" : null;
  }, [answerFeedback, motivationalMessages]);

  /* ===========================
      Render
  =========================== */
  return (
    <SafeArea>
      {/* ====== QUICK Overlay for correct/wrong feedback with optional motivational msg ====== */}
      {answerFeedback && (
        <Animated.View
          style={[
            styles.feedbackOverlay,
            {
              opacity: feedbackAnim,
              transform: [
                {
                  scale: feedbackAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              {
                backgroundColor: answerFeedback === "correct" ? "green" : "red",
              },
            ]}
          >
            {answerFeedback === "correct" ? feedbackMessage : "إجابة خاطئة!"}
          </Text>
        </Animated.View>
      )}

      {/* ====== QUIZ MODAL ====== */}
      <Modal
        animationType="fade"
        transparent
        visible={quizModalVisible}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <QuizModalContainer>
          <QuizModalContent>
            {/* Progress bar with animation */}
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>

            <QuestionCountText>
              السؤال {quizIndex + 1} / {quizQuestions.length}
            </QuestionCountText>

            <HeartsContainer>
              {[...Array(5)].map((_, i) => (
                <Image
                  key={i}
                  source={
                    i < 5 - wrongCount
                      ? require("../../../assets/icons/heart.png")
                      : require("../../../assets/icons/heartEmpty.png")
                  }
                  style={{ width: 30, height: 30, margin: 2 }}
                />
              ))}
            </HeartsContainer>

            {/* The question */}
            {quizQuestions[quizIndex] && (
              <>
                <QuizQuestionText>
                  ما ترجمة الكلمة: {quizQuestions[quizIndex].question}؟
                </QuizQuestionText>

                {/* The 4 choices */}
                {quizQuestions[quizIndex].choices.map((choice, idx) => {
                  const isCorrectChoice =
                    choice === quizQuestions[quizIndex].correctAnswer;
                  const isSelected = choice === selectedChoice;

                  let backgroundColor = "#0a9be3";
                  let optionOpacity = 1;

                  if (!answerChecked) {
                    // Not checked => highlight selection
                    if (selectedChoice && choice !== selectedChoice) {
                      optionOpacity = 0.6;
                    }
                  } else {
                    // After checking => show correct (green) / wrong if selected
                    if (isCorrectChoice) backgroundColor = "green";
                    else if (isSelected) backgroundColor = "red";
                  }

                  return (
                    <QuizOption
                      key={idx}
                      onPress={() => handleSelectChoice(choice)}
                      style={{ backgroundColor, opacity: optionOpacity }}
                    >
                      <QuizOptionText>{choice}</QuizOptionText>
                    </QuizOption>
                  );
                })}
              </>
            )}

            {/* Bottom row with single button: "Check" or "Next" */}
            <QuizBottomRow>
              <CheckButton
                onPress={handleCheckOrNext}
                disabled={!selectedChoice && !answerChecked}
                style={{
                  backgroundColor:
                    !selectedChoice && !answerChecked ? "gray" : "#0a9be3",
                }}
              >
                <CheckButtonText>
                  {answerChecked ? "التالي" : "تحقق"}
                </CheckButtonText>
              </CheckButton>
            </QuizBottomRow>
          </QuizModalContent>
        </QuizModalContainer>
      </Modal>

      {/* ====== TRY AGAIN MODAL ====== */}
      <Modal
        animationType="fade"
        transparent
        visible={showTry}
        onRequestClose={() => setShowTry(false)}
      >
        <TryModalContainer>
          <TryModalContent>
            <TryText>لقد أخفقت في خمس كلمات! أعد المحاولة</TryText>
            <Image
              source={require("../../../assets/icons/try.png")}
              style={{ width: 100, height: 100, marginBottom: 20 }}
              resizeMode="contain"
            />
            <TryButton onPress={handleTryAgain}>
              <TryButtonText>إعادة الاختبار</TryButtonText>
            </TryButton>
          </TryModalContent>
        </TryModalContainer>
      </Modal>

      {/* ====== RESULT MODAL (with fade-in animation) ====== */}
      <Modal
        animationType="none"
        transparent
        visible={resultModalVisible}
        onRequestClose={() => setResultModalVisible(false)}
      >
        <AnimatedResultModalContainer
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: modalOpacity,
          }}
        >
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
                  <PerTex>
                    {quizQuestions.length > 0
                      ? Math.round(
                          (correctAnswersCount / quizQuestions.length) * 100
                        )
                      : 0}
                    %
                  </PerTex>
                </StCon>
              </ScCon>
            </MidCon>
            <ResCon>
              <ConButton onPress={handleFinished}>
                <ConButtonText>انتقل للدرس التالي</ConButtonText>
              </ConButton>
              <RestartButton onPress={handleTryAgain}>
                <RestartButtonText>إعادة الدرس</RestartButtonText>
              </RestartButton>
            </ResCon>
          </ResultModalContent>
        </AnimatedResultModalContainer>
      </Modal>

      {/* ====== MAIN CONTENT ====== */}
      <CroBut onPress={() => router.push("home")}>
        <CrossIcon
          source={require("../../../assets/icons/grayCross.png")}
          resizeMode="contain"
        />
      </CroBut>

      <AllWr>
        <VocWra>
          <VocHead>
            اضغط على البطاقة لرؤية المعنى -{" "}
            <VocHeadSpan>واختبر بعد اخر بطاقة لفتح الدرس التالي</VocHeadSpan>
          </VocHead>
          <VocMain>
            <VocOn>
              <VocOnBut onPress={toggleHidden}>
                <IconImage
                  source={{
                    uri: "https://cdn.vocab.com/images/icons/more-options-dot-74770n.svg",
                  }}
                />
              </VocOnBut>
            </VocOn>
            {!isHidden && (
              <HiddenWr>
                <HidSub>
                  <HidOn>
                    <HidOnSp>Definition first</HidOnSp>
                    <HidOnIm
                      source={{
                        uri: "https://cdn.vocab.com/images/icons/flip-order-7pxoyu.svg",
                      }}
                    />
                  </HidOn>
                </HidSub>
                <HidSub>
                  <HidOn>
                    <HidOnSp>Print Flashcards</HidOnSp>
                    <HidOnIm
                      source={{
                        uri: "https://cdn.vocab.com/images/icons/print-flashcards-rp5m7h.svg",
                      }}
                    />
                  </HidOn>
                </HidSub>
              </HiddenWr>
            )}
            <VocTh>Word Sets</VocTh>
            <SelectContainer>
              <DropdownHeader onPress={toggleDropdown}>
                <DropdownText>{selectedOption}</DropdownText>
                <DropdownIcon>&#9660;</DropdownIcon>
              </DropdownHeader>

              {visible && (
                <OptionsContainer>
                  {options.map((option, index) => (
                    <OptionItem
                      key={index}
                      onPress={() => selectOption(option)}
                    >
                      <OptionText>{option.label}</OptionText>
                    </OptionItem>
                  ))}
                </OptionsContainer>
              )}
            </SelectContainer>

            <VocFo>
              <VocFoTop>
                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color="#0a9be3"
                    style={styles.loader}
                  />
                ) : cardsData.length === 0 ? (
                  <Text>لا يوجد بيانات</Text>
                ) : (
                  cardsData[currentCard] &&
                  renderCard({ item: cardsData[currentCard] })
                )}
              </VocFoTop>

              <VocFoMid>
                <VocMidBut
                  onPress={() => {
                    // optional shuffle logic if you want
                  }}
                >
                  <Image
                    source={shuffleIcon}
                    style={{ width: 16, height: 16, marginRight: 30 }}
                  />
                </VocMidBut>
              </VocFoMid>

              <VocFoBot>
                <VocFoBut onPress={goToPreviousCard}>
                  <ButtonText>السابق</ButtonText>
                </VocFoBut>
                <VocFoSpan>
                  <VocFoSpan1>{currentCard + 1}</VocFoSpan1>
                  <VocFoSpan1>/</VocFoSpan1>
                  <VocFoSpan1>{cardsData.length}</VocFoSpan1>
                </VocFoSpan>
                <VocFoNe onPress={goToNextCard}>
                  <ButtonText>التالي</ButtonText>
                </VocFoNe>
              </VocFoBot>

              {/* Listen & Quiz Buttons side by side */}
              <VocFoButtonRow>
                <VocFoPronounceButton onPress={handlePronounce}>
                  <ButtonText>{pronounceButtonText}</ButtonText>
                </VocFoPronounceButton>

                <QuizButton
                  disabled={currentCard !== cardsData.length - 1}
                  onPress={startQuiz}
                  style={{
                    transform: [{ scale: quizButtonScale }],
                    backgroundColor:
                      currentCard !== cardsData.length - 1
                        ? "rgba(10, 155, 227, 0.4)"
                        : "#0a9be3",
                  }}
                >
                  <ButtonText>ابدأ الاختبار</ButtonText>
                </QuizButton>
              </VocFoButtonRow>
            </VocFo>
          </VocMain>
        </VocWra>
      </AllWr>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  flipCard: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  flipCardBack: {
    position: "absolute",
    top: 0,
  },
  card: {
    width: "100%",
    height: "100%",
  },

  // Feedback overlay
  feedbackOverlay: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    zIndex: 999,
    padding: 10,
    borderRadius: 5,
  },
  feedbackText: {
    color: "#fff",
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  // Quiz progress bar
  progressBarContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0a9be3",
  },
});

export default Words;
