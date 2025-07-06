// Ads.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Video } from "expo-av";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { updateAds as updateAdsRedux, selectAds } from "../redux/adsSlice";
import { createUserRequest } from "../../requestMethods"; // Adjust the path based on your project structure
import CustomLoadingIndicator from "../components/LoadingIndicator"; // Import the custom loading component

const Ads = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { lessonUrl, set } = useLocalSearchParams();

  // Reference to the Video component
  const videoRef = useRef(null);

  // Access the current user's ID from Redux
  const userId = useSelector((state) => state.user.currentUser?._id);

  // Ads count from Redux
  const ads = useSelector(selectAds);

  // Component state
  const [countdown, setCountdown] = useState(15);
  const [showSubscription, setShowSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for entire ad process
  const [isVideoReady, setIsVideoReady] = useState(false); // Video loaded state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Video playing state
  const [countdownStarted, setCountdownStarted] = useState(false); // Track if countdown has started
  const [videoUrl, setVideoUrl] = useState(null); // Video URL
  const [adDestination, setAdDestination] = useState(null); // Ad Destination
  const [subscriptionImage, setSubscriptionImage] = useState(null); // Subscription Image URL
  const [subscribeText, setSubscribeText] = useState("اشترك الآن"); // Default text
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Image Loading State
  const [imageLoadError, setImageLoadError] = useState(false); // Image Load Error State

  // Create an instance of userRequest
  const userRequest = createUserRequest();

  // Fetch ad data when component mounts
  useEffect(() => {
    fetchAdData();
  }, []);

  // Function to fetch ad data
  const fetchAdData = async () => {
    setIsLoading(true);
    try {
      const response = await userRequest.get("/ads/random");
      const { videoUrl, destination, subscriptionImage, subscribeText } =
        response.data;

      setVideoUrl(videoUrl);
      setAdDestination(destination);
      setSubscriptionImage(subscriptionImage);
      setSubscribeText(subscribeText || "اشترك الآن"); // Set dynamic subscribe text with fallback

      // Start preloading the subscription image in parallel
      if (subscriptionImage) {
        Image.prefetch(subscriptionImage)
          .then(() => {
            setIsImageLoaded(true);
          })
          .catch((error) => {
            console.error("Error preloading subscription image:", error);
            setImageLoadError(true);
          });
      }
    } catch (error) {
      console.error("Error fetching ad data:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء جلب الإعلان.");
      // Consider adding a retry mechanism or fallback behavior
    }
  };

  // Handle countdown timer - only start when video is playing
  useEffect(() => {
    let timer;

    // Only start countdown if video is playing and countdown hasn't already started
    if (isVideoPlaying && !countdownStarted) {
      setCountdownStarted(true);
    }

    // Run the countdown only when it has started
    if (countdownStarted && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowSubscription(true);
      // Pause the video when countdown reaches zero
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    }

    return () => clearTimeout(timer);
  }, [countdown, isVideoPlaying, countdownStarted]);

  // Handlers for Video events
  const handleVideoLoadStart = () => {
    setIsVideoReady(false);
  };

  const handleVideoLoaded = () => {
    setIsVideoReady(true);
    setIsLoading(false);
  };

  const handleVideoPlaybackStatusUpdate = (status) => {
    if (status.isPlaying && !isVideoPlaying) {
      setIsVideoPlaying(true);
    }
  };

  const handleVideoError = (error) => {
    console.error("Video Error:", error);
    Alert.alert("خطأ", "حدث خطأ أثناء تحميل الفيديو.");
    setIsLoading(false);
    // Optionally, retry loading the video or provide a fallback
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

  // Handler for Close Ad Button
  const handleCloseAd = async () => {
    // Decrement ads count
    await decrementAdsCount();

    // Navigate to the lesson
    router.push({ pathname: lessonUrl, params: { set } });
  };

  // Function to handle Subscribe action
  const handleSubscribe = () => {
    if (!adDestination) {
      Alert.alert("خطأ", "وجهة الإعلان غير متوفرة.");
      return;
    }

    if (
      adDestination.startsWith("http://") ||
      adDestination.startsWith("https://")
    ) {
      // External URL - Open using Linking
      Linking.openURL(adDestination).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    } else {
      // Internal route - Navigate using router.push
      router.push(adDestination);
    }
  };

  return (
    <Container>
      {/* Video Player */}
      {videoUrl && !showSubscription ? (
        <StyledVideo
          ref={videoRef}
          source={{ uri: videoUrl }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          onLoadStart={handleVideoLoadStart}
          onLoad={handleVideoLoaded}
          onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
          onError={handleVideoError}
        />
      ) : null}

      {/* Loading Indicator - Replace with CustomLoadingIndicator */}
      {(isLoading || (!isVideoReady && videoUrl && !showSubscription)) && (
        <LoadingWrapper>
          <CustomLoadingIndicator />
        </LoadingWrapper>
      )}

      {/* Countdown Timer - Only show when video is playing and not in subscription mode */}
      {isVideoPlaying && !showSubscription && countdownStarted && (
        <CountdownContainer>
          <CountdownText>{countdown}</CountdownText>
        </CountdownContainer>
      )}

      {/* Subscription View */}
      {showSubscription && (
        <>
          {subscriptionImage && isImageLoaded && !imageLoadError ? (
            <SubscriptionImageBackground
              source={{ uri: subscriptionImage }}
              resizeMode="cover"
            >
              {/* Subscribe Button */}
              <SubscribeButton
                onPress={handleSubscribe}
                accessibilityLabel="Subscribe Now"
              >
                <SubscribeButtonText>{subscribeText}</SubscribeButtonText>
              </SubscribeButton>

              {/* Close Button */}
              <CloseButton
                onPress={handleCloseAd}
                accessibilityLabel="Close Ad"
              >
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </SubscriptionImageBackground>
          ) : imageLoadError ? (
            // Fallback if subscriptionImage failed to load
            <FallbackSubscription>
              {/* Subscribe Button using Link for Internal Routes */}
              {!adDestination ||
              adDestination.startsWith("http://") ||
              adDestination.startsWith("https://") ? (
                <SubscribeButton
                  onPress={handleSubscribe}
                  accessibilityLabel="Subscribe Now"
                >
                  <SubscribeButtonText>{subscribeText}</SubscribeButtonText>
                </SubscribeButton>
              ) : (
                <Link href={adDestination} passHref>
                  <StyledLink>
                    <SubscribeButtonText>{subscribeText}</SubscribeButtonText>
                  </StyledLink>
                </Link>
              )}

              {/* Close Button */}
              <CloseButton
                onPress={handleCloseAd}
                accessibilityLabel="Close Ad"
              >
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </FallbackSubscription>
          ) : (
            // Show loading indicator if image is not yet loaded
            <LoadingWrapper>
              <CustomLoadingIndicator />
            </LoadingWrapper>
          )}
        </>
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

// Wrapper for the CustomLoadingIndicator
const LoadingWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  z-index: 2;
`;

const CountdownContainer = styled.View`
  position: absolute;
  top: 40px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
  border-radius: 20px;
  z-index: 1;
`;

const CountdownText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const SubscriptionImageBackground = styled.ImageBackground`
  position: absolute;
  top: 0;
  left: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  justify-content: center;
  align-items: center;
`;

const FallbackSubscription = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
`;

const SubscribeButton = styled.TouchableOpacity`
  background-color: #ff6347;
  padding: 15px 35px;
  border-radius: 25px;
  /* Positioning the button at the center */
  position: absolute;
  bottom: 100px; /* Adjust as needed */
`;

const SubscribeButtonText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 40px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 20px;
`;

const CloseButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
`;

const StyledLink = styled.TouchableOpacity`
  background-color: #ff6347;
  padding: 15px 30px;
  border-radius: 25px;
  /* Positioning the button at the center */
  position: absolute;
  bottom: 100px;
  justify-content: center;
  align-items: center;
`;
