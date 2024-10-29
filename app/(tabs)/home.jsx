import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUnlockedSets } from "../redux/lessonsSlice";
import { TouchableOpacity, View, Alert } from "react-native";
import { router } from "expo-router";
import chapterItems from "../utils/chapterItems";
import CustomLoadingIndicator from "../components/LoadingIndicator";
import Navbar from "../components/navigation/navbar";
const screenWidth = Dimensions.get("window").width;
import styled from "styled-components/native";
import { ScrollView, Dimensions, Linking, Platform } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Animated } from "react-native";

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

const QueWra = styled(ScrollView)`
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
  top: -15px;
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
`;

const PrimaryButton = styled(ActionButton)`
  background-color: #4c47e9;
`;

const PrimaryButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const SecondaryButton = styled(ActionButton)`
  background-color: transparent;
  border: 1px solid #4c47e9;
`;

const SecondaryButtonText = styled.Text`
  color: #4c47e9;
  font-size: 16px;
`;

const ModalSecContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalSecHeader = styled.View`
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
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
}) => {
  const isPaid = useSelector((state) => state.user.currentUser?.isPaid); // Access the isPaid status

  const handlePress = () => {
    if (isUnlocked && set) {
      if (!isPaid && set !== "set1") {
        // User is not paid and the set is not 'set1', redirect to payment
        router.push("subscription"); // Replace 'paymentPage' with your payment page route
      } else {
        // Navigate directly to the URL
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
                <QueChaPic
                  source={{
                    uri: imgSrc,
                  }}
                  contentFit="contain"
                  cachePolicy="memory"
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

const Chapter = ({ chapterNumber, chapterItems }) => {
  const unlockedSets = useSelector((state) => state.lessons.unlockedSets); // Use Redux state
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
        />
      ))}
    </QueChaOneCon>
  );
};

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("مبتدى أ١"); // Default level
  const unlockedSets = useSelector((state) => state.lessons.unlockedSets);
  const userXp = useSelector((state) => state.user.currentUser?.xp ?? 0);
  const userId = useSelector((state) => state.user.currentUser?._id);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const scaling = Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(scaling).start();
  }, [scaleValue]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUnlockedSets(userId))
        .then(() => setLoading(false))
        .catch((err) => {
          setError("Failed to load data. Please try again.");
          setLoading(false);
        });
    }
  }, [dispatch, userId]);

  const openStoreReviewPage = () => {
    const appStoreId = "6673901781";
    const playStoreId = "your-play-store-id";

    if (Platform.OS === "ios") {
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/id${appStoreId}?action=write-review`
      );
    } else {
      Linking.openURL(`market://details?id=${playStoreId}`);
    }
  };

  useEffect(() => {
    if (userXp === 5) {
      openStoreReviewPage();
    }
  }, [userXp]);

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleToggleSecondModal = () => {
    setSecondModalVisible(!secondModalVisible);
    router.push("subscription");
  };
  const handlePayment = () => {
    router.push("subscription");
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setModalVisible(false);
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
                        unlockedSets={unlockedSets}
                      />
                    );
                  })}
                </QueTiBoCon>
              </QueTimline>
            </QueSubCon>
          </QueCon>
        </QueWra>
      </QueMa>

      {/* Modal Popup */}
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
      <StyledSecModal
        animationType="slide"
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={handleToggleSecondModal}
      >
        <ModalSecContainer>
          <ModalContent>
            <ModalSecHeader>
              <CrownIcon source={require("../../assets/images/crown.png")} />
              <ModalTitle>طور لغتك الإنجليزية</ModalTitle>
            </ModalSecHeader>
            <ModalText>
              تعلم ما تحتاجه من خلال الوصول إلى الدورات المميزة المركزة فقط.
            </ModalText>
            <PrimaryButton onPress={handleToggleSecondModal}>
              <PrimaryButtonText>احصل على خصم ٦٠%</PrimaryButtonText>
            </PrimaryButton>
            <SecondaryButton onPress={handleToggleSecondModal}>
              <SecondaryButtonText>ليس الآن</SecondaryButtonText>
            </SecondaryButton>
          </ModalContent>
        </ModalSecContainer>
      </StyledSecModal>
    </SafeArea>
  );
};

export default Home;
