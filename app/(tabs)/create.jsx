import React, { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import styled from "styled-components/native";
import {
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Alert,
} from "react-native";
import data from "../utils/data.json";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 3.5;

const Create = () => {
  const [activeTab, setActiveTab] = useState("Vocabulary");
  const [selectedLevel, setSelectedLevel] = useState(data.vocabularyLevels[0]);

  const currentUser = useSelector((state) => state.user.currentUser);
  const isPaid = currentUser?.isPaid; // Access the isPaid status

  const adUnitId = "ca-app-pub-7167740558520278/7250402342";
  const interstitial = useRef(
    InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })
  ).current;

  const [nextNavigation, setNextNavigation] = useState(null);

  useEffect(() => {
    interstitial.load();

    const adEventListener = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        interstitial.load(); // Load a new ad when the previous one is closed

        if (nextNavigation) {
          const { navigateTo, set, text } = nextNavigation;
          if (set) {
            router.push({
              pathname: navigateTo,
              params: { set },
            });
          } else {
            console.warn(`Set parameter is missing for word: ${text}`);
          }
          setNextNavigation(null); // Reset the next navigation
        }
      }
    );

    return () => {
      adEventListener(); // Clean up the listener
    };
  }, [nextNavigation]);

  const handleAdShowAndNavigate = (navigateTo, set, text) => {
    if (!isPaid) {
      // User is not paid, show interstitial ad
      if (interstitial.loaded) {
        setNextNavigation({ navigateTo, set, text });
        interstitial.show();
      } else {
        Alert.alert("Ad not ready yet", "Please try again in a few seconds.");
      }
    } else {
      // If the user is paid, proceed directly to the exercise
      if (set) {
        router.push({
          pathname: navigateTo,
          params: { set },
        });
      } else {
        console.warn(`Set parameter is missing for word: ${text}`);
      }
    }
  };

  const handleCardPress = (level) => {
    setSelectedLevel(level);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SegmentControl>
        <SegmentButton
          active={activeTab === "Vocabulary"}
          onPress={() => {
            setActiveTab("Vocabulary");
            setSelectedLevel(data.vocabularyLevels[0]);
          }}
        >
          <SegmentText active={activeTab === "Vocabulary"}>
            المفردات
          </SegmentText>
        </SegmentButton>
        <SegmentButton
          active={activeTab === "Grammar"}
          onPress={() => {
            setActiveTab("Grammar");
            setSelectedLevel(data.grammarLevels[0]);
          }}
        >
          <SegmentText active={activeTab === "Grammar"}>القواعد</SegmentText>
        </SegmentButton>
      </SegmentControl>

      {activeTab === "Vocabulary" ? (
        <VocabularyContent
          selectedLevel={selectedLevel}
          onCardPress={handleCardPress}
          handleAdShowAndNavigate={handleAdShowAndNavigate}
        />
      ) : (
        <GrammarContent
          selectedLevel={selectedLevel}
          onCardPress={handleCardPress}
          handleAdShowAndNavigate={handleAdShowAndNavigate}
        />
      )}
    </SafeAreaView>
  );
};

const VocabularyContent = ({
  selectedLevel,
  onCardPress,
  handleAdShowAndNavigate,
}) => (
  <StyledScrollView>
    <HorizontalCardList
      data={data.vocabularyLevels}
      selectedLevel={selectedLevel}
      onCardPress={onCardPress}
    />
    <SavedWords>
      <SavedWordsHeader>{`قسم ${selectedLevel.key}`}</SavedWordsHeader>
      {selectedLevel.words.map((word, wordIndex) => (
        <WordItem
          key={wordIndex}
          text={word.text}
          subText={word.subText}
          imagePath={word.imagePath}
          navigateTo={word.navigateTo}
          set={word.set}
          handleAdShowAndNavigate={handleAdShowAndNavigate}
        />
      ))}
    </SavedWords>
  </StyledScrollView>
);

const GrammarContent = ({
  selectedLevel,
  onCardPress,
  handleAdShowAndNavigate,
}) => (
  <StyledScrollView>
    <HorizontalCardList
      data={data.grammarLevels}
      selectedLevel={selectedLevel}
      onCardPress={onCardPress}
    />
    <SavedWords>
      <SavedWordsHeader>{`قسم ${selectedLevel.key}`}</SavedWordsHeader>
      {selectedLevel.words.map((word, wordIndex) => (
        <WordItem
          key={wordIndex}
          text={word.text}
          subText={word.subText}
          imagePath={word.imagePath}
          navigateTo={word.navigateTo}
          set={word.set}
          handleAdShowAndNavigate={handleAdShowAndNavigate}
        />
      ))}
    </SavedWords>
  </StyledScrollView>
);

const WordItem = ({
  text,
  subText,
  imagePath,
  navigateTo,
  set,
  handleAdShowAndNavigate,
}) => {
  const handleCategoryPress = () => {
    handleAdShowAndNavigate(navigateTo, set, text);
  };

  return (
    <TouchableOpacity onPress={handleCategoryPress}>
      <WordContainer>
        <WordImage source={{ uri: imagePath }} />
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={{ fontSize: 18, textAlign: "right" }}>{text}</Text>
          <Text style={{ fontSize: 14, color: "#999", textAlign: "right" }}>
            {subText}
          </Text>
        </View>
        <Image
          source={require("../../assets/icons/signal.png")}
          style={{ width: 24, height: 24 }}
        />
        <Image
          source={require("../../assets/icons/knowledge.png")}
          style={{ width: 24, height: 24, marginRight: 10 }}
        />
      </WordContainer>
    </TouchableOpacity>
  );
};

const HorizontalCardList = ({ data, selectedLevel, onCardPress }) => {
  const animations = useRef(data.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    const selectedIndex = data.findIndex(
      (item) => item.key === selectedLevel.key
    );

    if (selectedIndex !== -1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[selectedIndex], {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(animations[selectedIndex], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    return () => {
      animations.forEach((anim) => anim.stopAnimation());
    };
  }, [selectedLevel, animations, data]);

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.key}
      renderItem={({ item, index }) => {
        const isSelected = item.key === selectedLevel.key;
        const scale = animations[index];

        return (
          <TouchableOpacity onPress={() => onCardPress(item)}>
            <AnimatedCardContainer
              style={{
                transform: [{ scale: isSelected ? scale : 1 }],
              }}
            >
              <Card color={item.color}>
                <CardText>{item.value}</CardText>
                <CardLabel>{item.key}</CardLabel>
              </Card>
            </AnimatedCardContainer>
          </TouchableOpacity>
        );
      }}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 10}
      decelerationRate="fast"
      pagingEnabled
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );
};

const StyledScrollView = styled.ScrollView`
  flex: 1;
  background-color: #fff;
`;

const SegmentControl = styled.View`
  flex-direction: row;
  background-color: #e2e7ec;
  border-radius: 20px;
  margin: 10px 20px;
`;

const SegmentButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px 20px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.active ? "#106dee" : "transparent")};
  border-radius: 20px;
`;

const SegmentText = styled.Text`
  color: ${(props) => (props.active ? "#ffffff" : "#888888")};
  font-weight: bold;
`;

const AnimatedCardContainer = styled(Animated.View)`
  width: ${CARD_WIDTH}px;
  padding: 5px;
`;

const Card = styled.View`
  background-color: ${(props) => props.color};
  height: 100px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const CardText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
`;

const CardLabel = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const WordContainer = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  padding: 20px 10px;
  border-bottom-color: #dae1ea;
  border-bottom-width: 1px;
`;

const WordImage = styled.Image`
  border-radius: 8px;
  width: 40px;
  height: 40px;
  margin-left: 10px;
`;

const SavedWords = styled.View`
  padding: 10px;
`;

const SavedWordsHeader = styled.Text`
  font-size: 20px;
  margin-bottom: 10px;
  text-align: right;
  color: #106dee;
  font-weight: 500;
`;

export default Create;
