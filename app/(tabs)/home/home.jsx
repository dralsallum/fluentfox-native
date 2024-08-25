import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUnlockedSets } from "../../redux/lessonsSlice";
import { TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import chapterItems from "../../utils/chapterItems";
import CustomLoadingIndicator from "../../components/LoadingIndicator";
import {
  QueChaIteEle,
  QueChaItePar,
  CrossIcon,
  QueChaPicCon,
  QueChaPicChiCon,
  QueChaPicSvg,
  QueChaPicDef,
  QueChaPicLin,
  QueChaPicSto,
  QueChaPicCir,
  QueChaPicSec,
  QueChaPic,
  QueChaPicMai,
  QueChaIteSpa,
  QueChaIteParText,
  QueChaIteSubPar,
  QueChaPoiCon,
  QueChaPoi,
  QueBan,
  QueCon,
  QueMa,
  QueSubCon,
  QueSubIco,
  QueSubIcoCon,
  QueSubTit,
  QueSubTitCon,
  QueTi,
  QueTiCon,
  QueTiKeyCon,
  QueTimKey,
  QueTiBoCon,
  QueTimline,
  QueWra,
  SafeArea,
  QueTiBo,
  QuenBanMa,
  QueBanSub,
  QueBanLa,
  QueTeCon,
  QuenTeConSub,
  QueTeConSec,
  QueTeConThi,
  LinkCon,
  QueTeHe,
  QueLe,
  QueLeCo,
  SuperCon,
  QueChaOneCon,
  QueChaOneHeaCon,
  QueChaOneHea,
  QueChaOnePar,
  QueChaProCon,
  QueChaPro,
  QueChaProSpa,
  QueChaProTe,
  StyledModal,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  LevelItem,
  LevelIcon,
  LevelText,
  LoadingAll,
  StyledSecModal,
  ModalSecContainer,
  CrownIcon,
  ModalText,
  PrimaryButton,
  PrimaryButtonText,
  SecondaryButton,
  SecondaryButtonText,
  ModalSecHeader,
} from "./home.element";
import Navbar from "../../components/navigation/navbar";
import styled from "styled-components/native";

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
  const handlePress = () => {
    if (isUnlocked && set) {
      router.push({ pathname: url, params: { set } });
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
  const userId = useSelector((state) => state.user.currentUser?._id);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleToggleSecondModal = () => {
    setSecondModalVisible(!secondModalVisible);
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
                    <QueSubTit>
                      <QueLe>المستوى:</QueLe>
                      <QueLeCo> {selectedLevel} </QueLeCo>
                    </QueSubTit>
                    <QueSubIcoCon>
                      <QueSubIco
                        source={require("../../../assets/icons/arrowDown.png")}
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
                    <QueTiKeyCon>
                      <QueTimKey>
                        <QueBan>
                          <QuenBanMa>
                            <SuperCon
                              source={require("../../../assets/images/superhero.png")}
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
                  source={require("../../../assets/icons/cross.png")}
                />
              </TouchableOpacity>
              <ModalTitle>إكمال الإنجليزية</ModalTitle>
            </ModalHeader>
            <LevelItem onPress={() => handleSelectLevel("مبتدى أ١")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>مبتدى أ ١ - الوحدة 1 - 5</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("ابتدائي أ٢")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>ابتدائي أ2 - الفصول 3 و 4</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("متوسط ب١")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>متوسط ب1 - الفصول 5 و 6</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("فوق المتوسط ب٢")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>فوق المتوسط ب2 - الفصول 7 و 8</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("متقدم ج١")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
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
              <CrownIcon source={require("../../../assets/images/crown.png")} />
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
