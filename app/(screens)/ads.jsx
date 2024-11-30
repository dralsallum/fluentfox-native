// Ads.jsx
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import { useRouter, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import TestSubImage from "../../assets/images/final.png"; // Adjust the path if necessary
import { useDispatch, useSelector } from "react-redux";
import { updateAds as updateAdsRedux, selectAds } from "../redux/adsSlice";
import { createUserRequest } from "../../requestMethods"; // Adjust the path based on your project structure

const Ads = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { lessonUrl, set } = useLocalSearchParams();

  // Access the current user's ID from Redux
  const userId = useSelector((state) => state.user.currentUser?._id);

  // Ads count from Redux
  const ads = useSelector(selectAds);

  // Component state
  const [countdown, setCountdown] = useState(15);
  const [showSubscription, setShowSubscription] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null); // New state for video URL

  // Create an instance of userRequest
  const userRequest = createUserRequest();

  useEffect(() => {
    // Fetch the random video URL when the component mounts
    const fetchVideoUrl = async () => {
      try {
        const response = await userRequest.get("/ads/random");
        setVideoUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching video URL:", error);
        Alert.alert("خطأ", "حدث خطأ أثناء جلب الفيديو.");
      }
    };

    fetchVideoUrl();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0 && videoUrl) {
      // Start the countdown only after the video URL is fetched
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowSubscription(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, videoUrl]);

  // Handlers for Video events
  const handleVideoLoadStart = () => {
    setIsVideoReady(false); // Video is loading
  };

  const handleVideoLoaded = () => {
    setIsVideoReady(true); // Video has loaded and is ready to play
  };

  const handleVideoError = (error) => {
    console.error("Video Error:", error);
    Alert.alert("خطأ", "حدث خطأ أثناء تحميل الفيديو.");
    // Optionally, navigate away or retry
  };

  // Function to decrement ads count
  const decrementAdsCount = async () => {
    try {
      // Make a PUT request to update ads count
      const response = await userRequest.put(`/users/ads/${userId}`, {
        incrementBy: -1,
      });

      // Dispatch Redux action to update ads count in the store
      dispatch(updateAdsRedux({ ads: response.data.ads }));
    } catch (error) {
      console.error("Error updating ads count:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث عدد الإعلانات. حاول مرة أخرى.");
    }
  };

  // Handler for Subscribe Button
  const handleSubscribe = async () => {
    // Navigate to the subscription screen
    router.push("/subscription");
  };

  // Handler for Close Ad Button
  const handleCloseAd = async () => {
    // Decrement ads count
    await decrementAdsCount();

    // Navigate to the lesson
    router.push({ pathname: lessonUrl, params: { set } });
  };

  return (
    <Container>
      {/* Video Player */}
      {videoUrl ? (
        <StyledVideo
          source={{
            uri: videoUrl,
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          onLoadStart={handleVideoLoadStart}
          onLoad={handleVideoLoaded}
          onError={handleVideoError}
        />
      ) : (
        // Show a loading indicator while fetching the video URL
        <LoadingOverlay>
          <ActivityIndicator size="large" color="#ffffff" />
        </LoadingOverlay>
      )}

      {/* Loading Indicator */}
      {!isVideoReady && videoUrl && (
        <LoadingOverlay>
          <ActivityIndicator size="large" color="#ffffff" />
        </LoadingOverlay>
      )}

      {/* Countdown Timer or Subscription View */}
      {!showSubscription ? (
        <CountdownContainer>
          <CountdownText>{countdown}</CountdownText>
        </CountdownContainer>
      ) : (
        <SubscriptionImageBackground
          source={TestSubImage} // Using the imported local image
          resizeMode="cover"
        >
          {/* Subscribe Button */}
          <SubscribeButton
            onPress={handleSubscribe}
            accessibilityLabel="Subscribe Now"
          >
            <SubscribeButtonText>اشترك الان</SubscribeButtonText>
          </SubscribeButton>

          {/* Close Button in the Same Position as Countdown */}
          <CloseButton onPress={handleCloseAd} accessibilityLabel="Close Ad">
            <CloseButtonText>✕</CloseButtonText>
          </CloseButton>
        </SubscriptionImageBackground>
      )}
    </Container>
  );
};

export default Ads;
// Styled Components

const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

const StyledVideo = styled(Video)`
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1; /* Ensure it's above the video */
`;

const CountdownContainer = styled.View`
  position: absolute;
  top: 40px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
  border-radius: 20px;
`;

const CountdownText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const SubscriptionImageBackground = styled(ImageBackground)`
  position: absolute;
  top: 0;
  left: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  justify-content: center;
  align-items: center;
`;

const SubscribeButton = styled.TouchableOpacity`
  background-color: #ff6347;
  padding: 15px 30px;
  border-radius: 25px;
  /* Positioning the button at the center */
  position: absolute;
  bottom: 100px; /* Adjust as needed */
`;

const SubscribeButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 40px;
  left: 20px; /* Same position as CountdownContainer */
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 20px;
`;

const CloseButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
`;
