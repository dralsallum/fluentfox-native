import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import * as Speech from "expo-speech";
import { xpSelector } from "../redux/lessonsSlice";
import {
  unlockNextLesson,
  updateUnlockedSets,
  updateXP,
} from "../redux/lessonsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { userSelector } from "../redux/authSlice";
import { publicRequest } from "../../requestMethods"; // Adjust as needed

/* -------------------------------------------------------------------------- */
/*                            STYLED COMPONENTS                               */
/* -------------------------------------------------------------------------- */

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #0a0e10;
`;

const HeaderText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const ProgressBarContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom-width: 1px;
  border-bottom-color: #2c2c2e;
`;

const CloseButton = styled(Text)`
  font-size: 24px;
  color: #8e8e93;
`;

const ProgressBar = styled(View)`
  flex: 1;
  height: 16px;
  background-color: #2c2c2e;
  border-radius: 10px;
  margin: 0 15px;
  overflow: hidden;
`;

const ProgressFill = styled(Animated.View)`
  height: 100%;
  background-color: #58cc02;
  border-radius: 10px;
`;

const HeartContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const HeartText = styled(Text)`
  color: #ff4b4b;
  font-size: 24px;
  margin-right: 5px;
`;

const ContentArea = styled(ScrollView)`
  flex: 1;
  padding: 15px;
  padding-bottom: 120px;
  background-color: #0a0e10;
`;

const TitleContainer = styled(View)`
  align-items: center;
  margin-bottom: 25px;
`;

const TitleWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const TitleText = styled(Text)`
  color: white;
  font-size: 22px;
  font-weight: bold;
  margin-left: 8px;
`;

const MessageRow = styled(View)`
  width: 100%;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: flex-start;
`;

const MessageBubble = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: #1e2124;
  border-radius: 16px;
  padding: 12px 16px;
  margin-left: 2px;
  border: 1px solid #2c2c2e;
`;

const MessageText = styled(Text)`
  color: white;
  font-size: 16px;
  line-height: 22px;
  flex: 1;
`;

const NarratorText = styled(Text)`
  color: white;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 8px;
  opacity: 0.9;
`;

const QuestionTitle = styled(Text)`
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-vertical: 15px;
`;

const QuestionContainer = styled(View)`
  margin-bottom: 20px;
`;

const AnswerOption = styled(TouchableOpacity)`
  background-color: ${(props) => {
    if (!props.showOutcome) {
      return props.selected ? "#3579e0" : "#1e2124";
    }
    if (props.showOutcome && props.outcome === "correct") return "#58cc02";
    if (props.showOutcome && props.outcome === "incorrect") return "#ff4b4b";
    return "#1e2124";
  }};
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 10px;
  align-items: center;
  border: 1px solid #2c2c2e;
`;

const AnswerText = styled(Text)`
  color: white;
  font-size: 16px;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
`;

const ButtonContainer = styled(View)`
  padding: 15px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #0a0e10;
  border-top-width: 1px;
  border-top-color: #2c2c2e;
`;

const ActionButton = styled(TouchableOpacity)`
  background-color: ${(props) => (props.active ? "#58cc02" : "#1e2124")};
  padding: 15px;
  border-radius: 12px;
  align-items: center;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const ResultModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ResultModalContent = styled(View)`
  width: 90%;
  padding: 20px;
  height: 80%;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  justify-content: space-around;
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

const ScCon = styled(View)`
  flex-direction: row-reverse;
  padding: 10px;
  border: 2px solid #dae2eb;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
`;

const ScoreCon = styled(View)`
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;

const ScoreText = styled(Text)`
  color: #4a5766;
`;

const PerTex = styled(Text)`
  color: #4a5766;
`;

const ResCon = styled(View)``;

const ConButton = styled(TouchableOpacity)`
  background-color: #4c47e8;
  padding: 10px 20px;
  border-radius: 18px;
  width: 300px;
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
  width: 300px;
  align-items: center;
  margin-top: 15px;
  border: 2px solid #ced5dd;
`;

const RestartButtonText = styled(Text)`
  color: #000;
  font-size: 18px;
  text-align: center;
`;

const ResultText = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
`;

const TryModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const TryModalContent = styled(View)`
  width: 90%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  border-width: 2px;
  border-color: #4caf50;
`;

const TryText = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
`;

const TryButton = styled(TouchableOpacity)`
  background-color: #4caf50;
  padding: 10px 20px;
  border-radius: 10px;
`;

const TryButtonText = styled(Text)`
  color: #fff;
  font-size: 18px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  color: #ff9040;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-size: 16px;
  color: #ff5252;
  text-align: center;
  margin-bottom: 20px;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: #ff9040;
  padding: 12px 24px;
  border-radius: 8px;
`;

const RetryButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const PHASES = {
  LOADING: "loading",
  ERROR: "error",
  INTRO: "intro",
  CONVERSATION: "conversation",
  QUESTION: "question",
  FINISHED: "finished",
};

const ConversationLesson = () => {
  const [currentPhase, setCurrentPhase] = useState(PHASES.LOADING);
  const [conversationData, setConversationData] = useState(null);

  // Messages
  const [allMessages, setAllMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const [typingProgress, setTypingProgress] = useState("");

  // Segments & question logic
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerOutcome, setAnswerOutcome] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [hearts, setHearts] = useState(5);

  // UI
  const [progressValue] = useState(new Animated.Value(0));
  const [buttonText, setButtonText] = useState("CHECK");
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [showTry, setShowTry] = useState(false);
  const [error, setError] = useState(null);

  // Scoring
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // TTS voices
  const [avatarOneVoice, setAvatarOneVoice] = useState(null);
  const [avatarTwoVoice, setAvatarTwoVoice] = useState(null);
  const [narratorVoice, setNarratorVoice] = useState(null);

  // Hooks
  const router = useRouter();
  const route = useRoute();
  const dispatch = useDispatch();
  const xp = useSelector(xpSelector);
  const { currentUser } = useSelector(userSelector);

  const scrollViewRef = useRef(null);
  const setParam = route.params?.set || "set1";

  /* ------------------------------------------------------------------------ */
  /*                          VOICE & SPEECH HELPERS                          */
  /* ------------------------------------------------------------------------ */

  const getVoiceForSpeaker = (speaker) => {
    if (speaker === "avatarOne" && avatarOneVoice) return avatarOneVoice;
    if (speaker === "avatarTwo" && avatarTwoVoice) return avatarTwoVoice;
    if (speaker === "narrator" && narratorVoice) return narratorVoice;
    return undefined; // fallback to any default
  };

  const getPitchForSpeaker = (speaker) => {
    // Slight changes for more variety
    if (speaker === "avatarTwo") return 1.05;
    if (speaker === "narrator") return 1.0;
    return 1.03;
  };

  const speakText = (text, speaker) =>
    new Promise((resolve, reject) => {
      Speech.speak(text, {
        rate: 0.92,
        pitch: getPitchForSpeaker(speaker),
        voice: getVoiceForSpeaker(speaker),
        onDone: resolve,
        onStopped: resolve,
        onError: reject,
      });
    });

  /* ------------------------------------------------------------------------ */
  /*                           TYPING & PLAYBACK                              */
  /* ------------------------------------------------------------------------ */

  const playMessage = async (message) => {
    setIsTyping(true);
    setTypingMessage(message);
    setTypingProgress("");

    let charIndex = 0;
    const typingSpeed = 12; // more snappy typing effect
    const { text } = message;

    // Type out characters
    while (charIndex <= text.length) {
      setTypingProgress(text.substring(0, charIndex));
      charIndex++;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, typingSpeed));
    }

    // Done typing => finalize message
    setAllMessages((prev) => [
      ...prev,
      { ...message, id: `${message.speaker}-${Date.now()}` },
    ]);
    setIsTyping(false);
    setTypingMessage(null);

    // Auto-scroll
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 0);

    // Then speak
    try {
      await speakText(text, message.speaker);
    } catch {
      // ignore TTS errors
    }
  };

  const playScript = async (messages) => {
    for (let i = 0; i < messages.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playMessage(messages[i]);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                             PHASE HANDLERS                               */
  /* ------------------------------------------------------------------------ */

  const playIntro = async () => {
    setAllMessages([]);
    if (conversationData?.intro) {
      await playScript(conversationData.intro);
    }
    // Move into first conversation segment
    startConversation();
  };

  const startConversation = () => {
    setAllMessages([]);
    setCurrentSegmentIndex(0);
    setCurrentPhase(PHASES.CONVERSATION);
    playSegmentConversation(0);
  };

  const playSegmentConversation = async (index) => {
    const { messages } = conversationData.segments[index];
    setAllMessages([]);
    await playScript(messages);
    setCurrentPhase(PHASES.QUESTION);
  };

  const playOutro = async () => {
    setAllMessages([]);
    if (conversationData?.outro) {
      await playScript(conversationData.outro);
    }
    setCurrentPhase(PHASES.FINISHED);
  };

  /* ------------------------------------------------------------------------ */
  /*                          ANSWER & NAVIGATION                             */
  /* ------------------------------------------------------------------------ */

  const handleCrossPress = () => {
    Speech.stop();
    router.push("home");
  };

  const handleAnswerSelect = async (option) => {
    setSelectedAnswer(option);
    const { question } = conversationData.segments[currentSegmentIndex];
    const isCorrect = option === question.correctAnswer;
    setAnswerOutcome(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
    }

    // Let them hear the chosen option
    await speakText(option, question.character);
    setButtonText("CHECK");
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      50
    );
  };

  const handleButtonPress = async () => {
    if (!conversationData) return;
    const { question } = conversationData.segments[currentSegmentIndex];

    // If they haven't checked yet, show them outcome
    if (buttonText === "CHECK") {
      setShowOutcome(true);
      if (answerOutcome === "incorrect") {
        await speakText("Incorrect", question.character);
      } else {
        await speakText("Correct", question.character);
      }
      setButtonText("CONTINUE");
      return;
    }

    // If continuing...
    // Insert the user-chosen final statement: "I chose ____"
    const filledText = question.text.replace("_____", selectedAnswer);
    setAllMessages((prev) => [
      ...prev,
      {
        id: `answer-${Date.now()}`,
        speaker: question.character,
        text: filledText,
      },
    ]);

    // Reset
    setSelectedAnswer(null);
    setAnswerOutcome(null);
    setShowOutcome(false);
    setButtonText("CHECK");

    // If no hearts left, stop
    if (hearts <= 0) return;

    // Move to next segment OR finish
    if (currentSegmentIndex < conversationData.segments.length - 1) {
      const nextSegment = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextSegment);
      setCurrentPhase(PHASES.CONVERSATION);
      await playSegmentConversation(nextSegment);
    } else {
      // All segments done
      setResultModalVisible(true);
      await playOutro();
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
    setResultModalVisible(false);
    setAllMessages([]);
    setHearts(5);
    setCorrectAnswersCount(0);
    setSelectedAnswer(null);
    setAnswerOutcome(null);
    setShowOutcome(false);
    setButtonText("CHECK");
    setCurrentSegmentIndex(0);
    setCurrentPhase(PHASES.INTRO);
    playIntro();
  };

  /* ------------------------------------------------------------------------ */
  /*                          RENDERING HELPERS                               */
  /* ------------------------------------------------------------------------ */

  const getAvatarSource = (message) => {
    if (!conversationData) return null;
    if (message.speaker === "avatarOne")
      return { uri: conversationData.avatarOne };
    if (message.speaker === "avatarTwo")
      return { uri: conversationData.avatarTwo };
    return { uri: conversationData.avatarOne }; // fallback
  };

  const renderMessageRows = () =>
    allMessages.map((msg) => {
      if (msg.speaker === "narrator") {
        return (
          <MessageRow key={msg.id}>
            <TouchableOpacity onPress={() => speakText(msg.text, "narrator")}>
              <Image
                source={require("../../assets/icons/speaker.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </TouchableOpacity>
            <NarratorText>{msg.text}</NarratorText>
          </MessageRow>
        );
      }
      return (
        <MessageRow key={msg.id}>
          <Image
            source={getAvatarSource(msg)}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
            resizeMode="cover"
          />
          <MessageBubble>
            <TouchableOpacity onPress={() => speakText(msg.text, msg.speaker)}>
              <Image
                source={require("../../assets/icons/speaker.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </TouchableOpacity>
            <MessageText>{msg.text}</MessageText>
          </MessageBubble>
        </MessageRow>
      );
    });

  const renderTyping = () => {
    if (!isTyping || !typingMessage) return null;
    if (typingMessage.speaker === "narrator") {
      return (
        <MessageRow key="typing-narrator">
          <TouchableOpacity
            onPress={() => speakText(typingProgress, "narrator")}
          >
            <Image
              source={require("../../assets/icons/speaker.png")}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
          </TouchableOpacity>
          <NarratorText>{typingProgress}</NarratorText>
        </MessageRow>
      );
    }
    return (
      <MessageRow key="typing">
        <Image
          source={getAvatarSource(typingMessage)}
          style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
          resizeMode="cover"
        />
        <MessageBubble>
          <TouchableOpacity
            onPress={() => speakText(typingProgress, typingMessage.speaker)}
          >
            <Image
              source={require("../../assets/icons/speaker.png")}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
          </TouchableOpacity>
          <MessageText>{typingProgress}</MessageText>
        </MessageBubble>
      </MessageRow>
    );
  };

  /* ------------------------------------------------------------------------ */
  /*                            DATA & EFFECT HOOKS                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await publicRequest.get(`/conversations/${setParam}`);
        const data = response.data;

        // Preload images
        const prefetches = [];
        if (data.conversationAvatar)
          prefetches.push(Image.prefetch(data.conversationAvatar));
        if (data.avatarOne) prefetches.push(Image.prefetch(data.avatarOne));
        if (data.avatarTwo) prefetches.push(Image.prefetch(data.avatarTwo));
        await Promise.all(prefetches);

        setConversationData(data);
        setCurrentPhase(PHASES.INTRO);
      } catch (err) {
        setError(`Failed to load conversation data: ${err.message}`);
        setCurrentPhase(PHASES.ERROR);
      }
    };

    const assignVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        // Attempt to find decent (female/male) voices
        const femaleCandidate = voices.find(
          (v) =>
            (v.name.includes("Samantha") ||
              v.name.includes("Google UK English Female") ||
              v.name.includes("Tessa")) &&
            v.language.startsWith("en")
        );
        const maleCandidate = voices.find(
          (v) =>
            (v.name.includes("Daniel") ||
              v.name.includes("Alex") ||
              v.name.includes("Google UK English Male")) &&
            v.language.startsWith("en")
        );
        const narratorCandidate = voices.find(
          (v) =>
            (v.name.includes("Moira") ||
              v.name.includes("Karen") ||
              v.name.includes("Google US English")) &&
            v.language.startsWith("en")
        );

        if (femaleCandidate) setAvatarOneVoice(femaleCandidate.identifier);
        if (maleCandidate) setAvatarTwoVoice(maleCandidate.identifier);
        if (narratorCandidate) setNarratorVoice(narratorCandidate.identifier);
      } catch (error) {
        // fallback to default
        console.log("Error assigning TTS voices:", error);
      }
    };

    loadData();
    assignVoices();
  }, [setParam]);

  useEffect(() => {
    // Start the intro script once data is ready
    if (currentPhase === PHASES.INTRO && conversationData) {
      playIntro();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase, conversationData]);

  useEffect(() => {
    // If hearts run out, open "Try again" modal
    if (hearts <= 0) setShowTry(true);
  }, [hearts]);

  useEffect(() => {
    // Animate progress bar
    if (!conversationData) return;
    const totalSegments = conversationData.segments.length;
    const progressPercent = (currentSegmentIndex / totalSegments) * 100;
    Animated.timing(progressValue, {
      toValue: progressPercent,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentSegmentIndex, conversationData, progressValue]);

  useEffect(() => {
    // Auto-scroll after new messages
    const timer = setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      50
    );
    return () => clearTimeout(timer);
  }, [allMessages, isTyping, typingProgress, currentPhase]);

  /* ------------------------------------------------------------------------ */
  /*                                 RENDER                                   */
  /* ------------------------------------------------------------------------ */

  // LOADING
  if (currentPhase === PHASES.LOADING) {
    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor="#0a0e10" />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#ff9040" />
          <LoadingText>Loading conversation...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  // ERROR
  if (currentPhase === PHASES.ERROR) {
    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor="#0a0e10" />
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton onPress={() => router.push("home")}>
            <RetryButtonText>Return Home</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e10" />

      {/* Top bar with progress + hearts */}
      <ProgressBarContainer>
        <TouchableOpacity onPress={handleCrossPress}>
          <CloseButton>✕</CloseButton>
        </TouchableOpacity>
        <ProgressBar>
          <ProgressFill
            style={{
              width: progressValue.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </ProgressBar>
        <HeartContainer>
          <HeartText>❤</HeartText>
          <HeaderText>{hearts}</HeaderText>
        </HeartContainer>
      </ProgressBarContainer>

      <ContentArea
        ref={scrollViewRef}
        showsVerticalScrollIndicator
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {/* Intro Title & Avatar */}
        {currentPhase === PHASES.INTRO && conversationData && (
          <TitleContainer>
            <Image
              source={{ uri: conversationData.conversationAvatar }}
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />
            <TitleWrapper>
              <TouchableOpacity
                onPress={() => speakText(conversationData.title, "narrator")}
              >
                <Image
                  source={require("../../assets/icons/speaker.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TitleText>{conversationData.title}</TitleText>
            </TitleWrapper>
          </TitleContainer>
        )}

        {/* Already-played messages */}
        {renderMessageRows()}

        {/* Currently typing message */}
        {renderTyping()}

        {/* Question Phase */}
        {currentPhase === PHASES.QUESTION && conversationData && (
          <QuestionContainer>
            <QuestionTitle>
              {conversationData.segments[currentSegmentIndex].question.prompt}
            </QuestionTitle>

            {/* The question bubble */}
            <MessageRow>
              <Image
                source={{
                  uri:
                    conversationData.segments[currentSegmentIndex].question
                      .character === "avatarOne"
                      ? conversationData.avatarOne
                      : conversationData.avatarTwo,
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  marginRight: 8,
                }}
                resizeMode="cover"
              />
              <MessageBubble>
                <TouchableOpacity
                  onPress={() =>
                    speakText(
                      conversationData.segments[currentSegmentIndex].question
                        .text,
                      conversationData.segments[currentSegmentIndex].question
                        .character
                    )
                  }
                >
                  <Image
                    source={require("../../assets/icons/speaker.png")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                </TouchableOpacity>
                <MessageText>
                  {conversationData.segments[currentSegmentIndex].question.text}
                </MessageText>
              </MessageBubble>
            </MessageRow>

            {/* Answer Options */}
            <View style={{ marginTop: 20 }}>
              {conversationData.segments[
                currentSegmentIndex
              ].question.options.map((option, idx) => {
                const correctAnswer =
                  conversationData.segments[currentSegmentIndex].question
                    .correctAnswer;
                return (
                  <AnswerOption
                    key={idx}
                    selected={selectedAnswer === option}
                    showOutcome={showOutcome}
                    outcome={option === correctAnswer ? "correct" : "incorrect"}
                    onPress={() => handleAnswerSelect(option)}
                  >
                    <AnswerText selected={selectedAnswer === option}>
                      {option}
                    </AnswerText>
                  </AnswerOption>
                );
              })}
            </View>
          </QuestionContainer>
        )}

        {/* FINISHED PHASE placeholder spacing */}
        {currentPhase === PHASES.FINISHED && <View style={{ height: 20 }} />}
      </ContentArea>

      {/* "CHECK" / "CONTINUE" button (only in QUESTION phase with a selection) */}
      {currentPhase === PHASES.QUESTION && selectedAnswer && (
        <ButtonContainer>
          <ActionButton active onPress={handleButtonPress}>
            <ButtonText>{buttonText}</ButtonText>
          </ActionButton>
        </ButtonContainer>
      )}

      {/* Results Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={resultModalVisible}
        onRequestClose={() => setResultModalVisible(false)}
      >
        <ResultModalContainer>
          <ResultModalContent>
            <Image
              source={require("../../assets/images/wins.png")}
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
                    source={require("../../assets/icons/stars.png")}
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
                    source={require("../../assets/icons/stock.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                  <PerTex>
                    {Math.round(
                      (correctAnswersCount / conversationData.segments.length) *
                        100
                    )}
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
                <RestartButtonText>اعادة الدرس</RestartButtonText>
              </RestartButton>
            </ResCon>
          </ResultModalContent>
        </ResultModalContainer>
      </Modal>

      {/* "Try Again" Modal (when hearts run out) */}
      <Modal
        animationType="fade"
        transparent
        visible={showTry}
        onRequestClose={() => setShowTry(false)}
      >
        <TryModalContainer>
          <TryModalContent>
            <TryText>لقد اخفقت حاول مره ثانيه</TryText>
            <Image
              source={require("../../assets/icons/try.png")}
              style={{ width: 100, height: 100, marginBottom: 20 }}
              resizeMode="contain"
            />
            <TryButton onPress={handleTryAgain}>
              <TryButtonText>اعادة الاختبار</TryButtonText>
            </TryButton>
          </TryModalContent>
        </TryModalContainer>
      </Modal>
    </Container>
  );
};

export default ConversationLesson;
