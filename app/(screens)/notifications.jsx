import React, { useState } from "react";
import styled from "styled-components/native";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

const DialogBox = styled.View`
  width: 90%;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 10px 20px;
  border-radius: 6px;
  margin-vertical: 10px;
  width: 80%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const NotificationPermissionScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const handlePress = (allow) => {
    // Process the permission request result here
    alert(`Permission ${allow ? "granted" : "denied"}`);
    setModalVisible(false);
  };

  return (
    <Container>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Container>
          <DialogBox>
            <Title>"Busuu" would like to send you notifications</Title>
            <Subtitle>
              Notifications may include alerts, sounds, and icon badges.
            </Subtitle>
            <Button onPress={() => handlePress(true)}>
              <ButtonText>Allow</ButtonText>
            </Button>
            <Button onPress={() => handlePress(false)}>
              <ButtonText>Don't Allow</ButtonText>
            </Button>
          </DialogBox>
        </Container>
      </Modal>
    </Container>
  );
};

export default NotificationPermissionScreen;
