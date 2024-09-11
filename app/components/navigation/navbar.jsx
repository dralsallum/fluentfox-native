import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { TouchableOpacity, Modal, View, ScrollView, Text } from "react-native";
import { signOut, userSelector } from "../../redux/authSlice";
import { xpSelector, fetchUnlockedSets } from "../../redux/lessonsSlice";
import axios from "axios";
import { Image as ExpoImage } from "expo-image";

const SafeArea = styled.SafeAreaView`
  background-color: #ffffff;
  direction: rtl;
  height: 47px;
`;

const NavbarContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 10px 10px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
  z-index: 1000;
`;

const NavItem = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
`;

const NavIcon = styled(ExpoImage)`
  width: 24px;
  height: 24px;
`;

const NavBadge = styled.Text`
  font-size: 12px;
  color: ${({ active }) => (active ? "#007AFF" : "#8e8e93")};
  margin-left: 4px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  height: 60%;
  background-color: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  elevation: 8;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const CrossIcon = styled(ExpoImage)`
  width: 26px;
  height: 26px;
`;

const ProfileInfo = styled.View`
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled(ExpoImage)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-left: 20px;
`;

const ProfileTextContainer = styled.View`
  flex: 1;
  text-align: left;
`;

const ProfileText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  text-align: left;
`;

const StreakContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px; /* Adjusted for spacing */
`;

const StreakIcon = styled(ExpoImage)`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const StreakText = styled.Text`
  font-size: 16px;
  color: #333;
  text-align: left;
`;

const ProfileButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: #007aff;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;

const ProfileButtonsContainer = styled.View`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  padding: 0 20px;
`;

const ItemBox = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  elevation: 8;
  margin: 10px;
`;

const ItemImage = styled(ExpoImage)`
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 10px;
`;

const ItemTextContainer = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: right;
`;

const ItemSubText = styled.Text`
  font-size: 14px;
  color: #777;
  text-align: right;
`;

const NAV_ITEMS = [
  {
    id: "Notifications",
    icon: require("../../../assets/icons/notification.png"),
    label: "الإشعارات",
    showBadge: false,
  },
  {
    id: "Streak",
    icon: require("../../../assets/icons/fire.png"),
    label: "الحماس",
    showBadge: true,
  },
  {
    id: "XP",
    icon: require("../../../assets/icons/stars.png"),
    label: "النقاط",
    showBadge: true,
  },
  {
    id: "Me",
    icon: require("../../../assets/images/person.png"),
    label: "الملف الشخصي",
    showBadge: false,
  },
];

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const xp = useSelector(xpSelector);
  const { currentUser } = useSelector(userSelector);
  const streakCount = currentUser?.streak?.count ?? 0;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://quizeng-022517ad949b.herokuapp.com/api/notifications"
      );
      return res.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    getNotifications();
  }, []);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUnlockedSets(currentUser._id));
    }
  }, [currentUser, dispatch]);

  const handleOpenModal = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "Notifications") {
      setNotificationsModalVisible(true);
    } else if (tabId === "Me") {
      setProfileModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setNotificationsModalVisible(false);
    setProfileModalVisible(false);
    setActiveTab(null);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    handleCloseModal();
  };

  return (
    <SafeArea>
      <NavbarContainer>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.id} onPress={() => handleOpenModal(item.id)}>
            <NavIcon source={item.icon} cachePolicy="memory" />
            {item.showBadge && (
              <NavBadge active={activeTab === item.id}>
                {item.id === "XP" ? xp : item.id === "Streak" ? streakCount : 0}
              </NavBadge>
            )}
          </NavItem>
        ))}
      </NavbarContainer>

      {/* Notifications Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={notificationsModalVisible}
        onRequestClose={handleCloseModal}
      >
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>الإشعارات</ModalTitle>
              <TouchableOpacity
                onPress={() => handleCloseModal("Notifications")}
              >
                <CrossIcon
                  source={require("../../../assets/icons/grayCross.png")}
                />
              </TouchableOpacity>
            </ModalHeader>
            <ScrollView>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <View key={notification._id}>
                    <ItemBox>
                      <ItemImage
                        source={{ uri: notification.image }}
                        placeholder={require("../../../assets/images/thumbnail.png")}
                      />
                      <ItemTextContainer>
                        <ItemTitle>{notification.title}</ItemTitle>
                        <ItemSubText>{notification.message}</ItemSubText>
                      </ItemTextContainer>
                    </ItemBox>
                  </View>
                ))
              ) : (
                <Text>لا توجد إشعارات</Text>
              )}
            </ScrollView>
          </ModalContent>
        </ModalContainer>
      </Modal>

      {/* Profile Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={profileModalVisible}
        onRequestClose={handleCloseModal}
      >
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>الملف الشخصي</ModalTitle>
              <TouchableOpacity onPress={() => handleCloseModal("Me")}>
                <CrossIcon
                  source={require("../../../assets/icons/grayCross.png")}
                />
              </TouchableOpacity>
            </ModalHeader>

            <ProfileInfo>
              <ProfileTextContainer>
                <ProfileText>اسم المستخدم: {currentUser?.username}</ProfileText>
                <ProfileText>
                  البريد الإلكتروني: {currentUser?.email}
                </ProfileText>
                <StreakContainer>
                  <StreakIcon
                    source={require("../../../assets/icons/fire.png")}
                  />
                  <StreakText>عدد أيام الحماس: {streakCount}</StreakText>
                </StreakContainer>
              </ProfileTextContainer>
              <ProfileImage
                source={require("../../../assets/images/profile.png")}
                placeholder={require("../../../assets/images/thumbnail.png")}
              />
            </ProfileInfo>

            <ProfileButtonsContainer>
              <ProfileButton onPress={() => console.log("Settings Pressed")}>
                <ProfileButtonText>الإعدادات</ProfileButtonText>
              </ProfileButton>
              <ProfileButton onPress={handleSignOut}>
                <ProfileButtonText>تسجيل الخروج</ProfileButtonText>
              </ProfileButton>
            </ProfileButtonsContainer>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </SafeArea>
  );
};

export default Navbar;
