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
  Modal,
} from "react-native";
import data from "../utils/data.json";
import { useSelector, useDispatch } from "react-redux";
import { fetchAds, selectAds } from "../redux/adsSlice";
import { Image as ExpoImage } from "expo-image";
import AdsImage from "../../assets/icons/ads.png";
import PremiumImage from "../../assets/icons/premium.png";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 3.5;

const Create = () => {
  const [activeTab, setActiveTab] = useState("Vocabulary");
  const [selectedLevel, setSelectedLevel] = useState(data.vocabularyLevels[0]);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [selectedNavigateTo, setSelectedNavigateTo] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);

  const currentUser = useSelector((state) => state.user.currentUser);
  const isPaid = currentUser?.isPaid;
  const userId = currentUser?._id;

  const ads = useSelector(selectAds);
  const maxAds = 3;
  const filledAds = Math.min(ads, maxAds);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAds = async () => {
      if (userId) {
        try {
          await dispatch(fetchAds(userId)).unwrap();
        } catch (err) {
          console.error("Failed to load ads data. Please try again.");
        }
      }
    };

    loadAds();
  }, [dispatch, userId]);

  const handleNavigation = (navigateTo, set, text) => {
    const allowedSets = ["set1"];
    if (!isPaid && !allowedSets.includes(set)) {
      setSelectedNavigateTo(navigateTo);
      setSelectedSet(set);
      setSecondModalVisible(true);
    } else {
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

  const handleWatchAds = async () => {
    if (ads > 0) {
      setSecondModalVisible(false);
      router.push({
        pathname: "/ads",
        params: {
          lessonUrl: selectedNavigateTo,
          set: selectedSet,
        },
      });
    } else {
      Alert.alert(
        "تم الوصول إلى الحد اليومي",
        "يمكنك أخذ الدروس مرة أخرى خلال 24 ساعة أو الاشتراك.",
        [{ text: "حسنًا" }]
      );
    }
  };

  const handleSubscription = () => {
    setSecondModalVisible(false);
    router.push("subscription");
  };

  const handleCloseSecondModal = () => {
    setSecondModalVisible(false);
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
          handleNavigation={handleNavigation}
        />
      ) : (
        <GrammarContent
          selectedLevel={selectedLevel}
          onCardPress={handleCardPress}
          handleNavigation={handleNavigation}
        />
      )}

      {/* Ads Modal */}
      <StyledSecModal
        animationType="slide"
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={handleCloseSecondModal}
      >
        <ModalSecContainer>
          <ModalContent>
            <ModalSecHeader>
              <CrossButtonAds onPress={handleCloseSecondModal}>
                <CrossIcon
                  source={require("../../assets/icons/grayCross.png")}
                />
              </CrossButtonAds>
              <ModalTitleCentered>الحد اليومي</ModalTitleCentered>
              <View style={{ width: 40 }} />
            </ModalSecHeader>
            <NumberDisplay>{ads}</NumberDisplay>
            <ProgressContainer>
              {[...Array(maxAds)].map((_, index) => (
                <ProgressBox key={index} filled={index < filledAds} />
              ))}
            </ProgressContainer>
            <ModalText>لديك {ads} استخدامات متاحة يوميًا.</ModalText>
            <UpgradeText>اشترك لتحصل على استخدام غير محدود!</UpgradeText>
            <PrimaryButton onPress={handleWatchAds}>
              <PrimaryButtonText>مشاهدة اعلان </PrimaryButtonText>
              <ExpoImage
                source={AdsImage}
                style={{ width: 22, height: 22, marginLeft: 6 }}
              />
            </PrimaryButton>
            <SecondaryButton onPress={handleSubscription}>
              <SecondaryButtonText>اشترك</SecondaryButtonText>
              <ExpoImage
                source={PremiumImage}
                style={{ width: 22, height: 22, marginLeft: 6 }}
              />
            </SecondaryButton>
          </ModalContent>
        </ModalSecContainer>
      </StyledSecModal>
    </SafeAreaView>
  );
};

const VocabularyContent = ({
  selectedLevel,
  onCardPress,
  handleNavigation,
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
          handleNavigation={handleNavigation}
        />
      ))}
    </SavedWords>
  </StyledScrollView>
);

const GrammarContent = ({ selectedLevel, onCardPress, handleNavigation }) => (
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
          handleNavigation={handleNavigation}
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
  handleNavigation,
}) => {
  const handleCategoryPress = () => {
    handleNavigation(navigateTo, set, text);
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

/* Modal Styled Components */
const StyledSecModal = styled.Modal``;

const ModalSecContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const ModalSecHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 15px;
  margin-left: 30px;
  height: 50px;
`;

const CrossButtonAds = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  z-index: 1;
`;

const CrossIcon = styled(ExpoImage)`
  width: 25px;
  height: 25px;
  margin-right: 15px;
`;

const ModalTitleCentered = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  flex: 1;
  color: #4c47e9;
`;

const NumberDisplay = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: #4c47e9;
  text-align: center;
  margin-bottom: 10px;
`;

const ProgressContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
`;

const ProgressBox = styled.View`
  width: 40px;
  height: 10px;
  margin: 0 5px;
  background-color: ${({ filled }) => (filled ? "#4c47e9" : "#d3d3d3")};
  border-radius: 4px;
`;

const ModalText = styled.Text`
  font-size: 16px;
  color: #4c4f69;
  text-align: center;
  margin-bottom: 20px;
`;

const UpgradeText = styled.Text`
  font-size: 16px;
  color: #4c4f69;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ActionButton = styled.TouchableOpacity`
  width: 100%;
  padding: 15px;
  border-radius: 25px;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: center;
`;

const PrimaryButton = styled(ActionButton)`
  background-color: #4c47e9;
`;

const PrimaryButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const SecondaryButton = styled(ActionButton)`
  background-color: #f5c853;
`;

const SecondaryButtonText = styled.Text`
  color: #805c19;
  font-size: 18px;
  font-weight: bold;
`;

export default Create;
