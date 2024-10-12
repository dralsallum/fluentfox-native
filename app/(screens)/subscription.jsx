import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  View,
  I18nManager,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import * as RNIap from "react-native-iap";
import { createUserRequest } from "../../requestMethods";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import Navbar from "../components/navigation/navbar";
import useDeviceType from "../../hooks/useDeviceType";

const itemSkus = [
  "com.dralsallum.fluentfox.monthly",
  "com.dralsallum.fluentfox.quarterly",
  "com.dralsallum.fluentfox.yearly",
];

// Feature texts
const features = [
  "تابع تقدمك وتحسن مهاراتك بطرق منظمة وفعّالة.",
  "فتح جميع دروس والاختبارات المتقدمة والمميزة",
  "دعم سريع لاستفساراتك بغضون ٢٤ ساعة بحد اعلى",
];

const PlanButton = ({ option, selected, onPress, isTablet }) => (
  <PlanButtonContainer
    onPress={onPress}
    selected={selected}
    isTablet={isTablet}
  >
    {option.discount && (
      <SaveTag isTablet={isTablet}>{option.discount}</SaveTag>
    )}
    <PlanInfo>
      <PlanText isTablet={isTablet}>مدة الاشتراك {option.duration}</PlanText>
      <OriginalView>
        <PlanPrice isTablet={isTablet}>{option.price}</PlanPrice>
        <OldPrice isTablet={isTablet}>{option.original}</OldPrice>
      </OriginalView>
    </PlanInfo>
    {selected && (
      <CheckMarkContainer isTablet={isTablet}>
        <FontAwesome name="check" size={isTablet ? 24 : 18} color="white" />
      </CheckMarkContainer>
    )}
  </PlanButtonContainer>
);

const Subscription = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const dispatch = useDispatch();
  const [pricingOptions, setPricingOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user.currentUser?._id);
  const userIsPaid = useSelector((state) => state.user.currentUser?.isPaid);
  const isTablet = useDeviceType();

  useEffect(() => {
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
  }, []);

  useEffect(() => {
    if (userIsPaid) {
      Alert.alert("لديك بالفعل عضوية مميزة");
      router.back();
    }
  }, [userIsPaid]);

  useEffect(() => {
    async function initIAP() {
      try {
        const result = await RNIap.initConnection();
        if (result) {
          const fetchedProducts = await RNIap.getSubscriptions({
            skus: itemSkus,
          });

          const orderedProductIds = [
            "com.dralsallum.fluentfox.monthly",
            "com.dralsallum.fluentfox.quarterly",
            "com.dralsallum.fluentfox.yearly",
          ];

          const orderedProducts = orderedProductIds
            .map((id) =>
              fetchedProducts.find((product) => product.productId === id)
            )
            .filter((product) => product != null);

          const options = orderedProducts.map((product, index) => ({
            id: index + 1,
            duration: getDurationLabel(product),
            price: product.localizedPrice,
            discount: getDiscountLabel(product),
            original: getOriginalPrice(product),
            productId: product.productId,
          }));
          setPricingOptions(options);
        } else {
          console.warn("Failed to connect to the store.");
        }
      } catch (error) {
        console.warn("IAP Error:", error);
      }
    }
    initIAP();
    return () => {
      RNIap.endConnection();
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handlePurchase = async () => {
    setLoading(true);

    const selectedProduct = pricingOptions.find(
      (option) => option.id === selectedOption
    );

    if (!selectedProduct) {
      Alert.alert("خطأ", "لم يتم العثور على المنتج. الرجاء المحاولة مرة أخرى.");
      setLoading(false);
      return;
    }

    try {
      const purchase = await RNIap.requestSubscription({
        sku: selectedProduct.productId,
      });
      const receiptData = purchase.transactionReceipt;

      if (receiptData) {
        await verifyPurchase(receiptData);
        router.push("home");
      } else {
        Alert.alert(
          "خطأ في الشراء",
          "لم يتم العثور على بيانات الإيصال. الرجاء المحاولة مرة أخرى."
        );
      }
    } catch (err) {
      handlePurchaseError(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyPurchase = async (receiptData) => {
    try {
      const userRequest = createUserRequest();
      const response = await userRequest.post("/verifyPurchase", {
        userId,
        receiptData,
      });

      const data = response.data;
      if (data.success) {
        Alert.alert("نجاح", "تم التحقق من الشراء بنجاح!");

        const updatedUserResponse = await userRequest.get(
          `/users/find/${userId}`
        );

        dispatch(setUser(updatedUserResponse.data));
      } else {
        Alert.alert("فشل التحقق", data.message);
      }
    } catch (error) {
      console.error("Verification Error:", error);
      if (error.response) {
        Alert.alert("خطأ في التحقق", error.response.data.message);
      } else if (error.request) {
        console.error("Request error:", error.request);
        Alert.alert(
          "خطأ في التحقق",
          "لا يمكن الوصول إلى الخادم. الرجاء المحاولة مرة أخرى."
        );
      } else {
        console.error("Error message:", error.message);
        Alert.alert("خطأ في التحقق", error.message);
      }
    }
  };

  const handlePurchaseError = (err) => {
    if (err.code === "E_USER_CANCELLED") {
      Alert.alert("تم إلغاء الشراء", "لقد قمت بإلغاء الشراء.");
    } else {
      console.error("Purchase Error:", err);
      Alert.alert("خطأ في الشراء", "حدث خطأ. الرجاء المحاولة مرة أخرى.");
    }
  };

  const getDurationLabel = (product) => {
    switch (product.productId) {
      case "com.dralsallum.fluentfox.monthly":
        return "شهر واحد";
      case "com.dralsallum.fluentfox.quarterly":
        return "٣ أشهر";
      case "com.dralsallum.fluentfox.yearly":
        return "١٢ شهرًا";
      default:
        return "";
    }
  };

  const getDiscountLabel = (product) => {
    let discountPercentage = 0;
    switch (product.productId) {
      case "com.dralsallum.fluentfox.monthly":
        discountPercentage = 0;
        break;
      case "com.dralsallum.fluentfox.quarterly":
        discountPercentage = 33;
        break;
      case "com.dralsallum.fluentfox.yearly":
        discountPercentage = 63;
        break;
      default:
        discountPercentage = 0;
    }
    return discountPercentage ? `خصم ${discountPercentage}%` : "";
  };

  const getOriginalPrice = (product) => {
    let OriginalPrice = 0;
    switch (product.productId) {
      case "com.dralsallum.fluentfox.quarterly":
        OriginalPrice = 87;
        break;
      case "com.dralsallum.fluentfox.yearly":
        OriginalPrice = 348;
        break;
      default:
        OriginalPrice = 0;
    }
    return OriginalPrice ? `${OriginalPrice} ريال سعودي` : "";
  };

  const getButtonText = () => {
    const selected = pricingOptions.find(
      (option) => option.id === selectedOption
    );
    return selected
      ? `فتح العضوية المميزة لمدة ${selected.duration}`
      : "فتح العضوية المميزة";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Navbar />
      <Container isTablet={isTablet}>
        <HeaderContainer>
          <CloseButton onPress={handleBack}>
            <FontAwesome name="close" size={isTablet ? 32 : 24} color="black" />
          </CloseButton>
          <Title isTablet={isTablet}>فتح ميزات العضوية المميزة</Title>
          <FeatureList isTablet={isTablet}>
            {features.map((feature, index) => (
              <FeatureItem key={index} isTablet={isTablet}>
                <FeatureContent>
                  <FontAwesome
                    name="check"
                    size={isTablet ? 22 : 16}
                    color="green"
                    style={{ marginRight: 5 }}
                  />
                  <FeatureText isTablet={isTablet}>{feature}</FeatureText>
                </FeatureContent>
              </FeatureItem>
            ))}
          </FeatureList>
        </HeaderContainer>

        <PlanContainer isTablet={isTablet}>
          {pricingOptions.map((option) => (
            <PlanButton
              key={option.id}
              option={option}
              onPress={() => setSelectedOption(option.id)}
              selected={selectedOption === option.id}
              isTablet={isTablet}
            />
          ))}
        </PlanContainer>

        <Footer>
          <FooterText isTablet={isTablet}>
            ابدأ اليوم وطور من نفسك باسرع وقت.
          </FooterText>
          <SubscribeButton isTablet={isTablet} onPress={handlePurchase}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <SubscribeButtonText isTablet={isTablet}>
                {getButtonText()}
              </SubscribeButtonText>
            )}
          </SubscribeButton>
        </Footer>
      </Container>
    </SafeAreaView>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: ${(props) => (props.isTablet ? "40px" : "20px")};
  margin-top: ${(props) => (props.isTablet ? "40px" : "20px")};
`;

const HeaderContainer = styled.View`
  align-items: center;
  position: relative;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 10px;
`;

const Title = styled.Text`
  color: black;
  font-size: ${(props) => (props.isTablet ? "34px" : "24px")};
  font-weight: bold;
  margin-bottom: ${(props) => (props.isTablet ? "30px" : "20px")};
  text-align: center;
`;

const FeatureList = styled.View`
  margin-top: ${(props) => (props.isTablet ? "20px" : "10px")};
  width: 100%;
`;

const FeatureItem = styled.View`
  margin-bottom: ${(props) => (props.isTablet ? "15px" : "10px")};
  align-items: center;
`;

const FeatureContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FeatureText = styled.Text`
  color: black;
  font-size: ${(props) => (props.isTablet ? "22px" : "16px")};
  text-align: center;
`;

const PlanContainer = styled.View`
  margin-top: ${(props) => (props.isTablet ? "50px" : "30px")};
  flex: 1;
`;

const PlanButtonContainer = styled.TouchableOpacity`
  background-color: ${(props) => (props.selected ? "#e6e6e6" : "#f5f5f5")};
  padding: ${(props) => (props.isTablet ? "30px" : "20px")};
  border-radius: ${(props) => (props.isTablet ? "15px" : "10px")};
  margin-bottom: ${(props) => (props.isTablet ? "35px" : "25px")};
  flex-direction: row;
  align-items: center;
  border-width: ${(props) => (props.selected ? "2px" : "0px")};
  border-color: ${(props) => (props.selected ? "purple" : "transparent")};
  position: relative;
`;

const PlanInfo = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const PlanText = styled.Text`
  color: black;
  font-size: ${(props) => (props.isTablet ? "24px" : "18px")};
  font-weight: bold;
`;

const OriginalView = styled.View`
  flex-direction: row;
  margin-top: 5px;
`;

const PlanPrice = styled.Text`
  color: black;
  font-size: ${(props) => (props.isTablet ? "20px" : "16px")};
  margin-right: 10px;
`;

const OldPrice = styled.Text`
  font-size: ${(props) => (props.isTablet ? "20px" : "16px")};
  color: gray;
  text-decoration: line-through;
`;

const SaveTag = styled.Text`
  position: absolute;
  top: ${(props) => (props.isTablet ? "-20px" : "-15px")};
  left: 10px;
  background-color: orange;
  color: white;
  padding: 5px 10px;
  font-size: ${(props) => (props.isTablet ? "16px" : "12px")};
  border-radius: ${(props) => (props.isTablet ? "7px" : "5px")};
`;

const CheckMarkContainer = styled.View`
  background-color: purple;
  border-radius: ${(props) => (props.isTablet ? "20px" : "15px")};
  padding: 5px;
  margin-left: 10px;
`;

const Footer = styled.View`
  align-items: center;
`;

const FooterText = styled.Text`
  color: black;
  font-size: ${(props) => (props.isTablet ? "18px" : "14px")};
  margin-bottom: ${(props) => (props.isTablet ? "30px" : "20px")};
  text-align: center;
  width: ${(props) => (props.isTablet ? "80%" : "100%")};
`;

const SubscribeButton = styled.TouchableOpacity`
  background-color: purple;
  padding: ${(props) => (props.isTablet ? "20px 60px" : "15px 50px")};
  border-radius: ${(props) => (props.isTablet ? "40px" : "30px")};
`;

const SubscribeButtonText = styled.Text`
  color: white;
  font-size: ${(props) => (props.isTablet ? "20px" : "16px")};
  font-weight: bold;
`;

export default Subscription;
