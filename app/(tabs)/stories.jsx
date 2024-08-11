import React, { useState } from "react";
import styled from "styled-components/native";
import { SafeAreaView, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import categories from "../utils/categories.json"; // Import your JSON file

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const SegmentControl = styled.View`
  flex-direction: row-reverse;
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

const ReCon = styled.View`
  flex-direction: column;
  justify-items: center;
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

const IconImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 10px;
`;

const Stories = () => {
  const [activeTab, setActiveTab] = useState("stories");

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
            <TopText>١ نقطة</TopText>
          </TopCon>
          <MidCon>
            <EleCon>
              <ChatIcon source={require("../../assets/icons/chat.png")} />
              <MidText>استمع إلى قصة</MidText>
            </EleCon>
            <MidText>١ نقطة</MidText>
          </MidCon>
          <BotCon>
            <EleCon>
              <ChatIcon source={require("../../assets/icons/loud.png")} />
              <BotText>استخدم اختبار</BotText>
            </EleCon>
            <BotText>١ نقطة</BotText>
          </BotCon>
        </BoxCon>
        <ScrollView>
          {categories.map((category, index) => (
            <CategoryItemContainer
              key={index}
              borderColor={category.borderColor}
              onPress={() => console.log(`${category.name} pressed`)}
            >
              <IconImage source={{ uri: category.icon }} />
              <CategoryTextContainer>
                <CategoryText>{category.title}</CategoryText>
                <CatText>{category.subTitle}</CatText>
              </CategoryTextContainer>

              {category.locked ? (
                <FontAwesome
                  name="lock"
                  size={24}
                  color={category.borderColor}
                />
              ) : (
                <FontAwesome
                  name="unlock"
                  size={24}
                  color={category.borderColor}
                />
              )}
            </CategoryItemContainer>
          ))}
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

export default Stories;
