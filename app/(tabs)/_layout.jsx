import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import styled from "styled-components/native";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <ViewBox>
      <ImageBox
        source={icon}
        resizeMode="contain"
        style={{ tintColor: color }}
      />
      <TabText focused={focused} style={{ color }}>
        {name}
      </TabText>
    </ViewBox>
  );
};

const TabNavigator = () => {
  return (
    <>
      <Tabs
        screenOptions={{
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
        }}
      >
        <Tabs.Screen
          name="home/home"
          options={{
            title: "الرئيسية",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="الرئيسية"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="stories"
          options={{
            title: "قصص",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.stories}
                color={color}
                name="قصص"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "المفردات",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.words}
                color={color}
                name="المفردات"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "الملف الشخصي",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="الملف الشخصي"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabNavigator;

const ViewBox = styled.View`
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

const ImageBox = styled.Image`
  width: 24px;
  height: 24px;
`;

const TabText = styled.Text`
  font-size: 12px;
  font-weight: ${({ focused }) => (focused ? "600" : "400")};
  text-align: center;
  writing-direction: rtl;
`;
