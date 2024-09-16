import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import styled from "styled-components/native";
import { icons } from "../../constants";

// Tab Icon Component for each tab
const TabIcon = ({ icon, color, name, focused }) => (
  <IconContainer>
    <StyledImage
      source={icon}
      resizeMode="contain"
      style={{ tintColor: color }}
    />
    <StyledText focused={focused} style={{ color }}>
      {name}
    </StyledText>
  </IconContainer>
);

// Main Tab Navigator
const TabNavigator = () => {
  const tabBarOptions = {
    tabBarShowLabel: false,
    tabBarActiveTintColor: "#4c47e9",
    tabBarInactiveTintColor: "#666e7e",
    tabBarStyle: {
      backgroundColor: "#ffffff",
      borderTopWidth: 1,
      borderTopColor: "#b2b2b2",
      height: 84,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 4,
    },
  };

  const screens = [
    {
      name: "home",
      title: "الرئيسية",
      icon: icons.home,
    },
    {
      name: "stories",
      title: "قصص",
      icon: icons.stories,
    },
    {
      name: "create",
      title: "المفردات",
      icon: icons.words,
    },
    {
      name: "profile",
      title: "الملف الشخصي",
      icon: icons.profile,
    },
  ];

  return (
    <Tabs screenOptions={tabBarOptions}>
      {screens.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icon}
                color={color}
                name={title}
                focused={focused}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabNavigator;

// Styled Components
const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

const StyledImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const StyledText = styled.Text`
  font-size: 12px;
  font-weight: ${({ focused }) => (focused ? "600" : "400")};
  text-align: center;
  writing-direction: rtl;
`;
