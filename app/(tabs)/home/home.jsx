import React from "react";
import { ScrollView } from "react-native";
import chapterItems from "../../utils/chapterItems";
import {
  QueChaIteEle,
  QueChaItePar,
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
} from "./home.element";

const groupByChapter = (items) => {
  return items.reduce((acc, item) => {
    if (!acc[item.chapterId]) {
      acc[item.chapterId] = [];
    }
    acc[item.chapterId].push(item);
    return acc;
  }, {});
};

const chapters = groupByChapter(chapterItems);

const ChapterItem = ({ imgSrc, mainText, subText, url, lessonId }) => (
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
);

const Chapter = ({ chapterNumber, chapterItems }) => {
  const completedLessonsCount = chapterItems.filter(
    (item) => item.completed
  ).length;
  const totalLessons = chapterItems.length;
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
          isAccessible={true}
        />
      ))}
    </QueChaOneCon>
  );
};

const Home = () => {
  return (
    <SafeArea>
      <QueMa>
        <QueWra>
          <QueCon>
            <QueSubCon>
              <QueTiCon>
                <QueTi>تعلم الانجليزي</QueTi>
                <QueSubTitCon>
                  <QueSubTit>
                    <QueLe>المستوى:</QueLe>
                    <QueLeCo> مبتدى 1 </QueLeCo>
                  </QueSubTit>
                  <QueSubIcoCon>
                    <QueSubIco
                      source={require("../../../assets/icons/arrowDown.png")}
                      resizeMode="contain"
                    />
                  </QueSubIcoCon>
                </QueSubTitCon>
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
                  {Object.keys(chapters).map((chapterId, index) => {
                    const currentChapterItems = chapters[chapterId];
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
    </SafeArea>
  );
};

export default Home;
