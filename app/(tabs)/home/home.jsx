import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import chapterItems from "../../utils/chapterItems";
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
} from "./home.element";
import Navbar from "../../components/navigation/navbar";

const filterChaptersByLevel = (level) => {
  switch (level) {
    case "مبتدى أ ١":
      return chapterItems.filter(
        (item) => item.chapterId >= 1 && item.chapterId <= 5
      );
    case "Elementary A2":
      return chapterItems.filter(
        (item) => item.chapterId >= 6 && item.chapterId <= 10
      );
    case "Intermediate B1":
      return chapterItems.filter(
        (item) => item.chapterId >= 11 && item.chapterId <= 15
      );
    case "Upper Intermediate B2":
      return chapterItems.filter(
        (item) => item.chapterId >= 16 && item.chapterId <= 20
      );
    case "Advanced C1":
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
      <QueChaIteEle>
        <QueChaItePar isUnlocked={isUnlocked}>
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
              resizeMode="contain"
            />
          </QueChaPicSec>
          <QueChaPicMai />
        </QueChaItePar>
        <QueChaIteSpa>
          <QueChaIteParText>{mainText}</QueChaIteParText>
          <QueChaIteSubPar>{subText}</QueChaIteSubPar>
        </QueChaIteSpa>

        {lessonId !== 5 && (
          <QueChaPoiCon>
            <QueChaPoi />
          </QueChaPoiCon>
        )}
      </QueChaIteEle>
    </TouchableOpacity>
  );
};

const Chapter = ({ chapterNumber, chapterItems }) => {
  const unlockedSets = useSelector((state) => state.lessons.unlockedSets); // Use Redux state
  const totalLessons = chapterItems.length;
  const completedLessonsCount = unlockedSets[chapterNumber]?.length || 0;

  const progress = (completedLessonsCount / totalLessons) * 100;

  return (
    <QueChaOneCon>
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
        />
      ))}
    </QueChaOneCon>
  );
};

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("مبتدى أ ١"); // Default level

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
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
                        resizeMode="contain"
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
                              resizeMode="contain"
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
              <ModalTitle>Complete English</ModalTitle>
            </ModalHeader>
            <LevelItem onPress={() => handleSelectLevel("مبتدى أ ١")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>مبتدى أ ١ - الوحدة 1 - 5</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("Elementary A2")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>Elementary A2 - Chapters 3 & 4</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("Intermediate B1")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>Intermediate B1 - Chapters 5 & 6</LevelText>
            </LevelItem>
            <LevelItem
              onPress={() => handleSelectLevel("Upper Intermediate B2")}
            >
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>Upper Intermediate B2 - Chapters 7 & 8</LevelText>
            </LevelItem>
            <LevelItem onPress={() => handleSelectLevel("Advanced C1")}>
              <LevelIcon source={require("../../../assets/icons/chat.png")} />
              <LevelText>Advanced C1 - Chapters 9 & 10</LevelText>
            </LevelItem>
          </ModalContent>
        </ModalContainer>
      </StyledModal>
    </SafeArea>
  );
};

export default Home;
