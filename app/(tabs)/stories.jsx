import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import {
  SafeAreaView,
  ScrollView,
  View,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import categories from "../utils/categories.json";
import { useSelector, useDispatch } from "react-redux";
import { selectScore } from "../redux/scoreSlice";
import { selectExercise } from "../redux/exerciseSlice";
import { fetchAds, selectAds } from "../redux/adsSlice";
import { Image as ExpoImage } from "expo-image";
import AdsImage from "../../assets/icons/ads.png";
import PremiumImage from "../../assets/icons/premium.png";

// Styled Components

const Container = styled.View`
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
  font-size: 16px;
`;

const CategoryItemContainer = styled.TouchableOpacity`
  background-color: #fff;
  margin: 5px 20px;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.borderColor};
  border-bottom-width: 4px;
  flex-direction: row-reverse;
  align-items: center;
  elevation: 10;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 1.5px;
  position: relative;
  opacity: ${(props) =>
    props.disabled ? 0.5 : 1}; /* Adjust opacity for locked lessons */
`;

const CheckmarkContainer = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
`;

const IconImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 10px;
`;

const CategoryTextContainer = styled.View`
  flex: 1;
  margin-right: 8px;
  justify-content: center;
`;

const CategoryText = styled.Text`
  color: #393d44;
  text-align: right;
  font-size: 16px;
  font-weight: 500;
`;

const CatText = styled.Text`
  color: #707a8e;
  margin-top: 5px;
  text-align: right;
`;

const BoxCon = styled.View`
  margin: 10px;
  padding: 0;
  border-radius: 10px;
  background-color: white;
  elevation: 10;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 1.5px;
`;

const TopCon = styled.View`
  flex-direction: row-reverse;
  padding: 15px;
  border-radius: 7px;
  background-color: #106dee;
  justify-content: space-between;
  align-items: center;
`;

const TopText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

const MidCon = styled.View`
  flex-direction: row-reverse;
  padding: 10px 15px;
  justify-content: space-between;
  align-items: center;
`;

const MidText = styled.Text`
  color: #666e7e;
  font-weight: 600;
`;

const BotCon = styled.View`
  flex-direction: row-reverse;
  padding: 10px 15px;
  justify-content: space-between;
  align-items: center;
`;

const EleCon = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  gap: 5px;
`;

const BotText = styled.Text`
  color: #666e7e;
  font-weight: 600;
`;

const ChatIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

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

// Stories Component

const Stories = () => {
  const [activeTab, setActiveTab] = useState("stories");
  const data =
    activeTab === "stories" ? categories.stories : categories.exercises;
  const score = useSelector(selectScore);
  const exercise = useSelector(selectExercise);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isPaid = currentUser?.isPaid;
  const userId = currentUser?._id;

  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const ads = useSelector(selectAds);
  const maxAds = 3;
  const filledAds = Math.min(ads, maxAds);

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

  const handleCategoryPress = (category, index) => {
    const completedCount = activeTab === "stories" ? score : exercise;
    const isUnlocked = index <= completedCount;

    if (!isUnlocked) {
      Alert.alert(
        "الدروس مغلقة",
        "يجب عليك إكمال الدرس السابق لفتح هذا الدرس.",
        [{ text: "حسنًا" }]
      );
      return;
    }

    if (!isPaid && category.set !== "set1") {
      setSelectedCategory(category);
      setSecondModalVisible(true);
    } else {
      router.push({
        pathname: category.navigateTo,
        params: { set: category.set },
      });
    }
  };

  const handleWatchAds = async () => {
    if (ads > 0) {
      setSecondModalVisible(false);
      router.push({
        pathname: "/ads",
        params: {
          lessonUrl: selectedCategory.navigateTo,
          set: selectedCategory.set,
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

  const final = score + exercise;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Container>
        <SegmentControl>
          <SegmentButton
            active={activeTab === "stories"}
            onPress={() => setActiveTab("stories")}
          >
            <SegmentText active={activeTab === "stories"}>قصص</SegmentText>
          </SegmentButton>
          <SegmentButton
            active={activeTab === "exams"}
            onPress={() => setActiveTab("exams")}
          >
            <SegmentText active={activeTab === "exams"}>اختبارات</SegmentText>
          </SegmentButton>
        </SegmentControl>
        <BoxCon>
          <TopCon>
            <TopText>نقاطي</TopText>
            <TopText>{final} نقطة</TopText>
          </TopCon>
          <MidCon>
            <EleCon>
              <ChatIcon source={require("../../assets/icons/chat.png")} />
              <MidText>استمع إلى قصة</MidText>
            </EleCon>
            <MidText>{score} نقطة</MidText>
          </MidCon>
          <BotCon>
            <EleCon>
              <ChatIcon source={require("../../assets/icons/loud.png")} />
              <BotText>استخدم اختبار</BotText>
            </EleCon>
            <BotText>{exercise} نقطة</BotText>
          </BotCon>
        </BoxCon>

        <ScrollView>
          {data.map((category, index) => {
            const completedCount = activeTab === "stories" ? score : exercise;
            const isCompleted = index < completedCount;
            const isUnlocked = index <= completedCount;

            return (
              <CategoryItemContainer
                key={index}
                borderColor={category.borderColor}
                isCompleted={isCompleted}
                onPress={() => handleCategoryPress(category, index)}
                disabled={!isUnlocked} // Disable press if locked
              >
                {isCompleted && (
                  <CheckmarkContainer>
                    <AntDesign name="checkcircle" size={24} color="#00FF00" />
                  </CheckmarkContainer>
                )}
                <IconImage source={{ uri: category.icon }} />
                <CategoryTextContainer>
                  <CategoryText>{category.title}</CategoryText>
                  <CatText>{category.subTitle}</CatText>
                </CategoryTextContainer>

                {isUnlocked ? (
                  <FontAwesome
                    name="unlock"
                    size={24}
                    color={category.borderColor}
                  />
                ) : (
                  <FontAwesome
                    name="lock"
                    size={24}
                    color={category.borderColor}
                  />
                )}
              </CategoryItemContainer>
            );
          })}
        </ScrollView>
      </Container>

      {/* Ads Modal */}
      <StyledSecModal
        animationType="slide"
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={() => setSecondModalVisible(false)}
      >
        <ModalSecContainer>
          <ModalContent>
            <ModalSecHeader>
              <CrossButtonAds onPress={() => setSecondModalVisible(false)}>
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

export default Stories;
