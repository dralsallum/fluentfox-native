import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUnlockedSets } from "../redux/lessonsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAds, selectAds } from "../redux/adsSlice"; // Removed updateAdsThunk
import {
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Animated,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import chapterItems from "../utils/chapterItems";
import CustomLoadingIndicator from "../components/LoadingIndicator";
import Navbar from "../components/navigation/navbar";
import styled from "styled-components/native";
import { Image as ExpoImage } from "expo-image";
import placeholderImage from "../../assets/images/placeholder.webp";
import AdsImage from "../../assets/icons/ads.png";
import PremiumImage from "../../assets/icons/premium.png"; // Ensure you have these icons

const screenWidth = Dimensions.get("window").width;

const LoadingAll = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
  direction: rtl;
`;

const QueMa = styled.View`
  flex: 1;
  background-color: #ffffff;
  width: 100%;
`;

const QueWra = styled.ScrollView`
  flex: 1;
`;

const QueCon = styled.View`
  margin-bottom: 24px;
`;

const QueSubCon = styled.View`
  background-color: white;
  padding: 10px 20px;
  width: 100%;
  border-radius: 10px;
`;

const QueTiCon = styled.View`
  width: 100%;
  margin-bottom: 10px;
`;

const QueTi = styled.Text`
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: bold;
  text-align: left;
  color: #0139a4;
`;

const QueSubTitCon = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const QueLe = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #0139a4;
`;

const QueLeCo = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #555;
`;

const QueSubTit = styled(Animated.Text)`
  font-size: 18px;
  font-weight: bold;
  color: #555;
`;

const QueSubIcoCon = styled.View`
  width: 18px;
  height: 18px;
  margin-left: 4px;
`;

const QueSubIco = styled(ExpoImage)`
  width: 100%;
  height: 100%;
`;

const QueTimline = styled.View`
  width: 100%;
`;

const QueTiBoCon = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const QueTiBo = styled.View`
  width: 100%;
  min-height: 97px;
  border-radius: 10px;
`;

const QueTiKeyCon = styled.TouchableOpacity`
  width: 100%;
`;

const QueTimKey = styled.View`
  width: 100%;
`;

const QueBan = styled.View`
  background-color: rgb(67, 45, 176);
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 10px;
`;

const QuenBanMa = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const QueBanSub = styled.View``;

const QueBanLa = styled.View`
  width: 100%;
`;

const QueTeCon = styled.View`
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
`;

const QuenTeConSub = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

const QueTeConSec = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const QueTeConThi = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

const LinkCon = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const SuperCon = styled(ExpoImage)`
  width: 80px;
  height: 80px;
  position: absolute;
  right: -4px;
  top: -10px;
`;

const QueTeHe = styled.Text`
  font-size: 20px;
  font-weight: bold;
  line-height: 26px;
  text-align: left;
  color: #fff;
`;

const QueChaOneCon = styled.View`
  background-color: #ffffff;
  margin: 20px 0;
  border-width: 2px;
  border-color: lightgray;
  border-radius: 18px;
  padding: 8px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

const QueChaOneHeaCon = styled.View`
  padding: 0px;
  margin-bottom: 0px;
  font-weight: bold;
`;

const QueChaOneHea = styled.Text`
  font-size: 24px;
  font-weight: 400;
  text-align: left;
`;

const QueChaOnePar = styled.Text`
  margin-top: 0px;
  margin-right: 5px;
  padding-top: 0px;
  margin-bottom: 24px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgb(30, 45, 64);
  text-align: left;
`;

const QueChaProCon = styled.View`
  width: 100%;
  height: 12px;
  background-color: #d8e1ea;
  border-radius: 10px;
  position: relative;
`;

const QueChaPro = styled.View`
  height: 100%;
  width: 100%;
  background-color: #4c47e9;
  border-radius: 10px;
`;

const QueChaProSpa = styled.View`
  width: 36px;
  height: 20px;
  border-radius: 8px;
  background-color: #4c47e9;
  position: absolute;
  right: ${({ progress }) =>
    progress === 100 ? 0 : `${Math.min(100 - progress, 90)}%`};
  left: auto;
  top: -4px;
  justify-content: center;
  align-items: center;
`;

const QueChaProTe = styled.Text`
  color: white;
  font-size: 10px;
`;

const QueChaProText = styled.Text`
  color: white;
  font-size: 10px;
`;

const QueChaIteEle = styled.View`
  position: relative;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: transparent;
  padding: 10px 0;
  border-radius: 16px;
  flex-direction: row;
  margin: 10px 0;
`;

const QueChaItePar = styled.View`
  z-index: 2;
  align-items: center;
  justify-content: center;
  width: 85px;
  height: 85px;
  background-color: ${({ completed }) => (completed ? "#4c47e8" : "#ffffff")};
  border-radius: 45px;
`;

const QueChaPicCon = styled.View`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const QueChaPicChiCon = styled.View`
  width: 100%;
  height: 100%;
  position: relative;
`;

const QueChaPicSvg = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  transform: rotate(90deg);
`;

const QueChaPicDef = styled.View``;

const QueChaPicLin = styled.View``;

const QueChaPicSto = styled.View``;

const QueChaPicCir = styled.View``;

const QueChaPicSec = styled.View`
  margin: auto;
  position: absolute;
  border-radius: 50px;
  overflow: hidden;
  width: 84px;
  height: 84px;
  padding: 3px;
  background-color: transparent;
`;

const QueChaPic = styled(ExpoImage)`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  /* Ensure the image is contained */
  resize-mode: contain;
`;

const QueChaPicMai = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const QueChaIteSpa = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const QueChaIteParText = styled.Text`
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: rgb(30, 45, 64);
  text-align: left;
`;

const QueChaIteSubPar = styled.Text`
  margin: 0;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: rgb(30, 45, 64);
  text-align: left;
`;

const QueChaPoiCon = styled.View`
  z-index: -10000;
  position: absolute;
  height: 100%;
  left: 40px;
  bottom: -40px;
  border-radius: 8px;
  width: 4px;
  background-color: rgb(218, 225, 234);
`;

const QueChaPoi = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #4c47e9;
`;

const FinChaProCon = styled.View`
  position: relative;
  border-radius: 16px;
  width: 100%;
  background-color: rgb(218, 225, 234);
  margin-top: 10px;
  height: 12px;
`;

const FinChaPro = styled.View`
  position: absolute;
  height: 100%;
  background-color: #4c47e9;
  border-radius: 16px;
  left: 0;
`;

const FinChaProSpa = styled.View`
  font-size: 10px;
  align-items: center;
  justify-content: center;
  height: 20px;
  border-radius: 20px;
  background-color: #4c47e9;
  color: #ffffff;
  padding: 0 8px;
  min-width: 30px;
  position: absolute;
  right: 0;
  transform: translateX(50%);
  bottom: 6px;
`;

const StyledModal = styled.Modal``;

const ModalContainer = styled.View`
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

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const FlagIcon = styled(ExpoImage)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const LevelItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const LevelIcon = styled(ExpoImage)`
  width: 40px;
  height: 40px;
  margin-right: 15px;
`;

const LevelText = styled.Text`
  font-size: 16px;
`;

const CloseButton = styled.TouchableOpacity`
  align-items: center;
  margin-top: 20px;
`;

const CloseButtonText = styled.Text`
  font-size: 16px;
  color: blue;
`;

const CrossIcon = styled(ExpoImage)`
  width: 25px;
  height: 25px;
  margin-right: 15px;
`;

const StyledSecModal = styled.Modal``;

const ModalText = styled.Text`
  font-size: 16px;
  color: #4c4f69;
  text-align: center;
  margin-bottom: 20px;
`;

const CrownIcon = styled(ExpoImage)`
  width: 50px;
  height: 50px;
`;

const ActionButton = styled.TouchableOpacity`
  width: 100%;
  padding: 15px;
  border-radius: 25px;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: row; /* Added to align icon and text horizontally */
  justify-content: center; /* Center the content */
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

const ModalSecContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalTitleCentered = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  flex: 1;
  color: #4c47e9;
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

const UpgradeText = styled.Text`
  font-size: 16px;
  color: #4c4f69;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

const filterChaptersByLevel = (level) => {
  switch (level) {
    case "مبتدى أ١":
      return chapterItems.filter(
        (item) => item.chapterId >= 1 && item.chapterId <= 5
      );
    case "ابتدائي أ٢":
      return chapterItems.filter(
        (item) => item.chapterId >= 6 && item.chapterId <= 10
      );
    case "متوسط ب١":
      return chapterItems.filter(
        (item) => item.chapterId >= 11 && item.chapterId <= 15
      );
    case "فوق المتوسط ب٢":
      return chapterItems.filter(
        (item) => item.chapterId >= 16 && item.chapterId <= 20
      );
    case "متقدم ج١":
      return chapterItems.filter(
        (item) => item.chapterId >= 21 && item.chapterId <= 25
      );
    default:
      return [];
  }
};

const ChapterItem = ({
  imgSrc,
  mainText,
  subText,
  url,
  lessonId,
  set,
  isUnlocked,
  setSecondModalVisible,
  setSelectedLessonUrl,
  setSelectedLessonSet,
}) => {
  const isPaid = useSelector((state) => state.user.currentUser?.isPaid);

  const handlePress = () => {
    if (isUnlocked && set) {
      if (!isPaid) {
        setSelectedLessonUrl(url);
        setSelectedLessonSet(set);
        setSecondModalVisible(true);
      } else {
        router.push({ pathname: url, params: { set } });
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ opacity: isUnlocked ? 1 : 0.5 }}
      disabled={!isUnlocked}
    >
      <View style={{ position: "relative" }}>
        <View>
          <QueChaIteEle>
            <QueChaItePar>
              <QueChaPicCon>
                <QueChaPicChiCon>
                  <QueChaPicSvg>
                    <QueChaPicDef>
                      <QueChaPicLin>
                        <QueChaPicSto />
                      </QueChaPicLin>
                    </QueChaPicDef>
                    <QueChaPicCir />
                    <QueChaPicCir />
                  </QueChaPicSvg>
                </QueChaPicChiCon>
              </QueChaPicCon>

              <QueChaPicSec>
                {/* Use placeholder image if imgSrc is not provided */}
                <QueChaPic
                  source={imgSrc ? { uri: imgSrc } : placeholderImage}
                  contentFit="contain"
                  cachePolicy="memory"
                  placeholder={placeholderImage}
                  placeholderContentFit="contain"
                />
              </QueChaPicSec>

              <QueChaPicMai />
            </QueChaItePar>

            <QueChaIteSpa>
              <QueChaIteParText>{mainText}</QueChaIteParText>
              <QueChaIteSubPar>{subText}</QueChaIteSubPar>
            </QueChaIteSpa>
          </QueChaIteEle>
        </View>

        {lessonId !== 5 && (
          <QueChaPoiCon>
            <QueChaPoi />
          </QueChaPoiCon>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Chapter Component (as defined earlier)
const Chapter = ({
  chapterNumber,
  chapterItems,
  setSecondModalVisible,
  setSelectedLessonUrl,
  setSelectedLessonSet,
}) => {
  const unlockedSets = useSelector((state) => state.lessons.unlockedSets);
  const totalLessons = chapterItems.length;
  const completedLessonsCount = unlockedSets[chapterNumber]?.length || 0;
  const lastUnlockedLessonId = unlockedSets[chapterNumber]?.slice(-1)[0];

  const progress = (completedLessonsCount / totalLessons) * 100;
  const isCompleted = completedLessonsCount === totalLessons;
  const nextChapterNumber = chapterNumber + 1;
  const isNextChapterFirstLessonUnlocked =
    unlockedSets[nextChapterNumber]?.includes(1);

  return (
    <QueChaOneCon
      style={{
        borderColor: isNextChapterFirstLessonUnlocked ? "#4c47e9" : "lightgray",
      }}
      completed={isCompleted}
    >
      <QueChaOneHeaCon>
        <QueChaOneHea>الوحدة {chapterNumber}</QueChaOneHea>
        <QueChaOnePar>
          الدروس المكتملة {completedLessonsCount}/{totalLessons}
        </QueChaOnePar>
        <QueChaProCon>
          <QueChaPro style={{ width: `${progress}%` }} />
          <QueChaProSpa progress={progress}>
            <QueChaProTe>{`${progress}%`}</QueChaProTe>
          </QueChaProSpa>
        </QueChaProCon>
      </QueChaOneHeaCon>
      {chapterItems.map((item, index) => (
        <ChapterItem
          key={index}
          imgSrc={item.imgSrc}
          mainText={item.mainText}
          subText={item.subText}
          url={item.url}
          lessonId={item.lessonId}
          set={item.set}
          isUnlocked={unlockedSets[chapterNumber]?.includes(item.lessonId)}
          isLastUnlocked={item.lessonId === lastUnlockedLessonId}
          setSecondModalVisible={setSecondModalVisible}
          setSelectedLessonUrl={setSelectedLessonUrl}
          setSelectedLessonSet={setSelectedLessonSet}
        />
      ))}
    </QueChaOneCon>
  );
};

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("مبتدى أ١");
  const unlockedSets = useSelector((state) => state.lessons.unlockedSets);
  const userId = useSelector((state) => state.user.currentUser?._id);
  const isPaid = useSelector((state) => state.user.currentUser?.isPaid);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userXp = useSelector((state) => state.lessons.xp ?? 0);
  const [selectedLessonUrl, setSelectedLessonUrl] = useState(null);
  const [selectedLessonSet, setSelectedLessonSet] = useState(null);
  const ads = useSelector(selectAds);
  const maxAds = 3;
  const filledAds = Math.min(ads, maxAds);
  const [hasRatedApp, setHasRatedApp] = useState(false);

  useEffect(() => {
    const loadHasRatedApp = async () => {
      try {
        const value = await AsyncStorage.getItem("hasRatedApp");
        if (value !== null) {
          setHasRatedApp(value === "true");
        }
      } catch (e) {
        // Handle error if needed
      }
    };
    loadHasRatedApp();
  }, []);

  const scaleValue = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const scaling = Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(scaling).start();
  }, [scaleValue]);

  const openStoreReviewPage = async () => {
    const appStoreId = "6673901781";
    const playStoreId = "your-play-store-id";
    if (Platform.OS === "ios") {
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/id${appStoreId}?action=write-review`
      );
    } else {
      Linking.openURL(`market://details?id=${playStoreId}`);
    }

    // Set hasRatedApp to true and save it
    setHasRatedApp(true);
    try {
      await AsyncStorage.setItem("hasRatedApp", "true");
    } catch (e) {
      // Handle error if needed
    }
  };

  useEffect(() => {
    if ([3, 8, 13].includes(userXp) && !hasRatedApp) {
      openStoreReviewPage();
    }
  }, [userXp, hasRatedApp]);

  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        try {
          // Dispatch fetchUnlockedSets and wait for it to complete
          await dispatch(fetchUnlockedSets(userId)).unwrap();
        } catch (err) {
          setError("Failed to load lessons data. Please try again.");
        }

        try {
          // Dispatch fetchAds and wait for it to complete
          await dispatch(fetchAds(userId)).unwrap();
        } catch (err) {
          setError("Failed to load ads data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [dispatch, userId]);

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const handleCloseSecondModal = () => {
    setSecondModalVisible(false);
  };

  const handleToggleSecondModal = () => {
    setSecondModalVisible(false);
    router.push("subscription");
  };
  const handlePayment = () => {
    router.push("subscription");
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setModalVisible(false);
  };

  const handleWatchAds = async () => {
    if (ads > 0) {
      setSecondModalVisible(false);
      // Navigate to the Ads screen where the ad is watched
      router.push({
        pathname: "/ads",
        params: { lessonUrl: selectedLessonUrl, set: selectedLessonSet },
      });

      // No need to dispatch here unless you want to optimistically update
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

  const filteredChapters = filterChaptersByLevel(selectedLevel);
  const groupedChapters = filteredChapters.reduce((acc, item) => {
    if (!acc[item.chapterId]) {
      acc[item.chapterId] = [];
    }
    acc[item.chapterId].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <LoadingAll>
        <CustomLoadingIndicator />
      </LoadingAll>
    );
  }

  return (
    <SafeArea>
      <Navbar />
      <QueMa>
        <QueWra>
          <QueCon>
            <QueSubCon>
              <QueTiCon>
                <QueTi>تعلم الانجليزي</QueTi>
                <TouchableOpacity onPress={handleToggleModal}>
                  <QueSubTitCon>
                    <QueSubTit
                      style={{
                        transform: [{ scale: scaleValue }],
                      }}
                    >
                      <QueLe>المستوى:</QueLe>
                      <QueLeCo> {selectedLevel} </QueLeCo>
                    </QueSubTit>
                    <QueSubIcoCon>
                      <QueSubIco
                        source={require("../../assets/icons/arrowDown.png")}
                        contentFit="contain"
                        cachePolicy="memory"
                      />
                    </QueSubIcoCon>
                  </QueSubTitCon>
                </TouchableOpacity>
              </QueTiCon>

              <QueTimline>
                <QueTiBoCon>
                  <QueTiBo>
                    <QueTiKeyCon onPress={handlePayment}>
                      <QueTimKey>
                        <QueBan>
                          <QuenBanMa>
                            <SuperCon
                              source={require("../../assets/images/superhero.png")}
                              contentFit="contain"
                              cachePolicy="memory"
                            />
                            <QueBanSub>
                              <QueBanLa />
                            </QueBanSub>
                            <QueTeCon>
                              <QuenTeConSub />
                              <QueTeConSec>
                                <QueTeConThi>
                                  <LinkCon>
                                    <QueTeHe>
                                      زِّد مهارات اللغة بخصم 60% على الاشتراك
                                      المميزة
                                    </QueTeHe>
                                  </LinkCon>
                                </QueTeConThi>
                              </QueTeConSec>
                            </QueTeCon>
                          </QuenBanMa>
                        </QueBan>
                      </QueTimKey>
                    </QueTiKeyCon>
                  </QueTiBo>
                  {Object.keys(groupedChapters).map((chapterId) => {
                    const currentChapterItems = groupedChapters[chapterId];
                    return (
                      <Chapter
                        key={chapterId}
                        chapterNumber={parseInt(chapterId, 10)}
                        chapterItems={currentChapterItems}
                        setSecondModalVisible={setSecondModalVisible}
                        setSelectedLessonUrl={setSelectedLessonUrl}
                        setSelectedLessonSet={setSelectedLessonSet}
                      />
                    );
                  })}
                </QueTiBoCon>
              </QueTimline>
            </QueSubCon>
          </QueCon>
        </QueWra>
      </QueMa>

      {/* Level Selection Modal */}
      <StyledModal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleToggleModal}
      >
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <TouchableOpacity onPress={handleToggleModal}>
                <CrossIcon
                  source={require("../../assets/icons/grayCross.png")}
                />
              </TouchableOpacity>
              <ModalTitle>إكمال الإنجليزية</ModalTitle>
            </ModalHeader>
            <LevelItem onPress={() => handleSelectLevel("مبتدى أ١")}>
              <LevelIcon source={require("../../assets/icons/chat.png")} />
              <LevelText>مبتدى أ ١ - الوحدة 1 - 5</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("ابتدائي أ٢")}>
              <LevelIcon source={require("../../assets/icons/chat.png")} />
              <LevelText>ابتدائي أ2 - الفصول 3 و 4</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("متوسط ب١")}>
              <LevelIcon source={require("../../assets/icons/chat.png")} />
              <LevelText>متوسط ب1 - الفصول 5 و 6</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("فوق المتوسط ب٢")}>
              <LevelIcon source={require("../../assets/icons/chat.png")} />
              <LevelText>فوق المتوسط ب2 - الفصول 7 و 8</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("متقدم ج١")}>
              <LevelIcon source={require("../../assets/icons/chat.png")} />
              <LevelText>متقدم ج1 - الفصول 9 و 10</LevelText>
            </LevelItem>
          </ModalContent>
        </ModalContainer>
      </StyledModal>

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
              {/* Optional: Add a placeholder to balance the layout */}
              <View style={{ width: 40 }} />
            </ModalSecHeader>
            <NumberDisplay>{ads}</NumberDisplay>
            <ProgressContainer>
              {[...Array(maxAds)].map((_, index) => (
                <ProgressBox
                  key={index}
                  filled={index < filledAds} // Fill based on ads count
                />
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
    </SafeArea>
  );
};

export default Home;
