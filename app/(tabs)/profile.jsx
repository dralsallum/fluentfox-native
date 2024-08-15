import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { userSelector } from "../redux/authSlice";

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #4b90f2;
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
`;

const Header = styled.View`
  background-color: #4b90f2;
  padding: 20px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const ProfileImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-top: 20px;
  border: 5px solid white;
`;

const UserName = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

const UserDetailText = styled.Text`
  color: white;
  font-size: 16px;
  margin-top: 5px;
`;

const SectionContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
  background-color: #fff;
  margin-top: 10px;
`;

const LearningProgress = styled.View`
  width: 45%;
  height: 180px;
  background-color: white;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
`;

const FlagContainer = styled.View`
  flex-direction: column;
  align-items: flex-start;
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Flag = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 3px solid #cccdce;
  margin-bottom: 5px;
`;

const ProgressText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 5px;
`;

const StatsText = styled.Text`
  color: #4caf50;
  font-size: 16px;
  margin-left: 5px;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

const TabBar = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 10px;
  background-color: #f6fafe;
`;

const Tab = styled.TouchableOpacity`
  align-items: center;
  padding: 10px;
  border-bottom-width: ${(props) => (props.isActive ? "2px" : "0px")};
  border-bottom-color: #1d73ed;
`;

const TabText = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.isActive ? "#1d73ed" : "#000")};
  font-weight: bold;
`;

const LearningProgressComponent = ({ subject, stats }) => (
  <LearningProgress>
    <FlagContainer>
      <Flag source={require("../../assets/icons/america.png")} />
      <ProgressText>{subject}</ProgressText>
    </FlagContainer>
    <IconContainer>
      <IconRow>
        <Icon source={require("../../assets/icons/badge.png")} />
        <StatsText>{stats.badge}</StatsText>
      </IconRow>
      <IconRow>
        <Icon source={require("../../assets/icons/stock.png")} />
        <StatsText>{stats.stock}</StatsText>
      </IconRow>
    </IconContainer>
  </LearningProgress>
);

const ProgressSection = ({ data }) => (
  <SectionContainer>
    {data.map((item, index) => (
      <LearningProgressComponent
        key={index}
        subject={item.subject}
        stats={item.stats}
      />
    ))}
  </SectionContainer>
);

const ExerciseSection = () => (
  <SectionContainer>
    {/* Render exercise-specific content here */}
    <LearningProgressComponent
      subject="Exercise 1"
      stats={{ badge: 5, stock: 10 }}
    />
    <LearningProgressComponent
      subject="Exercise 2"
      stats={{ badge: 3, stock: 8 }}
    />
  </SectionContainer>
);

const CorrectionSection = () => (
  <SectionContainer>
    {/* Render correction-specific content here */}
    <LearningProgressComponent
      subject="Correction 1"
      stats={{ badge: 7, stock: 4 }}
    />
    <LearningProgressComponent
      subject="Correction 2"
      stats={{ badge: 2, stock: 9 }}
    />
  </SectionContainer>
);

const Profile = () => {
  const [activeTab, setActiveTab] = useState("PROGRESS");
  const { currentUser } = useSelector(userSelector);

  const learningData = [
    { subject: "English", stats: { badge: 3, stock: 3 } },
    { subject: "Math", stats: { badge: 2, stock: 2 } },
    // Add more subjects as needed
  ];

  const renderSection = () => {
    switch (activeTab) {
      case "PROGRESS":
        return <ProgressSection data={learningData} />;
      case "EXERCISES":
        return <ExerciseSection />;
      case "CORRECTIONS":
        return <CorrectionSection />;
      default:
        return null;
    }
  };

  return (
    <SafeArea>
      <Container>
        <Header>
          <ProfileImage source={require("../../assets/images/profile.png")} />
          <UserName>{currentUser ? currentUser.username : "Guest"}</UserName>
          <UserDetailText>1-day streak</UserDetailText>
          <UserDetailText>Saudi Arabia</UserDetailText>
          <UserDetailText>Speaks English at beginner level.</UserDetailText>
        </Header>
        <TabBar>
          {["PROGRESS", "EXERCISES", "CORRECTIONS"].map((tab) => (
            <Tab
              key={tab}
              onPress={() => setActiveTab(tab)}
              isActive={activeTab === tab}
            >
              <TabText isActive={activeTab === tab}>{tab}</TabText>
            </Tab>
          ))}
        </TabBar>
        {renderSection()}
      </Container>
    </SafeArea>
  );
};

export default Profile;
