import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Navbar from "../components/navigation/navbar";
import * as RNIap from "react-native-iap";

const itemSkus = [
  "com.dralsallum.fluentfox.premium.monthly",
  "com.dralsallum.fluentfox.premium.quarterly",
  "com.dralsallum.fluentfox.premium.yearly",
];

const pricingOptions = [
  {
    id: 1,
    duration: "1 أشهر",
    price: "SAR 29.00",
    monthlyPrice: "SAR 29.00 / شهرياً",
    discount: "خصم 0%",
    discountColor: "#fff",
  },
  {
    id: 2,
    duration: "3 أشهر",
    price: "SAR 87.00",
    monthlyPrice: "SAR 17.99 / شهرياً",
    discount: "خصم 40%",
    discountColor: "rgb(14, 190, 117)",
  },
  {
    id: 3,
    duration: "12 أشهر",
    price: "SAR 348.00",
    monthlyPrice: "SAR 11.99 / شهرياً",
    discount: "خصم 60%",
    discountColor: "rgb(14, 190, 117)",
  },
];

const features = [
  {
    text: "الدورات المتخصصة",
    description: "افتح الدورات المتخصصة لتحسين مهاراتك الأساسية.",
    image: require("../../assets/images/superhero.png"),
  },
  {
    text: "التكرار المتباعد",
    description: "مارس الكلمات الصحيحة في الوقت المناسب وثبتها في الذاكرة.",
    image: require("../../assets/images/profile.png"),
  },
  {
    text: "مراجعة القواعد",
    description: "عزز ثقتك في المحادثة مع تدريبات نحوية شخصية.",
    image: require("../../assets/images/congratulations.png"),
  },
  {
    text: "تغذية راجعة ذات أولوية",
    description: "مارس اللغة الإنجليزية مع المتحدثين الأصليين.",
    image: require("../../assets/images/clap.png"),
  },
  {
    text: "تخطي الدروس",
    description: "احصل على الدروس بأي ترتيب لتجد الموضوعات الأكثر ملائمة لك.",
    image: require("../../assets/images/goal.png"),
  },
  {
    text: "بدون إعلانات",
    description: "تجنب الانقطاعات.",
    image: require("../../assets/images/empty.png"),
  },
];

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  margin-top: 20px;
`;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const TopTe = styled.Text`
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: 600;
  text-align: right;
`;

const TopSubTe = styled.Text`
  font-size: 16px;
  color: rgb(75, 87, 102);
  text-align: right;
`;

const OreConAll = styled.View`
  flex-direction: row-reverse;
  justify-content: space-around;
  align-items: center;
`;

const OreCon = styled(TouchableOpacity)`
  position: relative;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  margin: 5px;
`;

const OreConTop = styled.View`
  align-items: center;
  width: 100px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-color: ${({ selected }) =>
    selected ? "rgb(84, 56, 220)" : "rgb(218, 225, 234)"};
  padding: 8px;
  background-color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const OreConMid = styled.View`
  align-items: center;
  width: 100px;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 1px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-color: rgb(218, 225, 234);
  background-color: #fff;
  padding: 5px;
`;

const OreConBot = styled.View`
  align-items: center;
  width: 100px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-color: black;
  padding: 8px;
`;

const OreConSub = styled.View`
  background-color: rgb(14, 190, 117);
  border-radius: 12px;
  padding: 3px 8px;
`;

const OreConLast = styled.View`
  align-items: center;
  width: 100px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-color: black;
  border-right-color: black;
  border-bottom-color: black;
  background-color: #fff;
  padding: 6px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const MonCon = styled.View`
  width: 100px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-left-color: black;
  border-right-color: black;
  background-color: #fff;
  padding: 4px 8px;
`;

const MonTex = styled.Text`
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  color: rgb(30, 45, 64);
`;
const TextView = styled.View`
  gap: 4px;
`;

const Tex = styled.Text`
  font-size: ${({ size }) => size || "12px"};
  font-weight: 700;
  color: ${({ color }) => color || "#000"};
  text-align: right;
  margin-top: ${({ marginTop }) => marginTop || "0px"};
`;

const BotTex = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: rgb(30, 45, 64);
  text-align: center;
`;

const ButtonContainer = styled.View`
  width: 90%;
  padding: 10px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${({ bgColor }) => bgColor || "rgb(84, 56, 220)"};
  padding: 15px;
  border-radius: 25px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${({ color }) => color || "#fff"};
  font-size: 14px;
  text-align: center;
  font-weight: 600;
`;

const FeatureContainer = styled.View`
  width: 100%;
  padding: 20px;
  background-color: #fff;
`;

const FeatureItem = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 20px;
`;

const FeatureText = styled.Text`
  font-size: 15px;
  color: #000;
  flex: 1;
  text-align: right;
`;
const FeatureDes = styled.Text`
  font-size: 11px;
  color: #7f7f7f;
  flex: 1;
  text-align: right;
`;

const FeatureImage = styled.Image`
  width: 35px;
  height: 35px;
  margin-left: 10px;
  border-radius: 50%;
`;

const PricingCard = ({
  duration,
  price,
  monthlyPrice,
  discount,
  selected,
  onSelect,
}) => (
  <OreCon onPress={onSelect}>
    <OreConTop selected={selected}>
      <Tex size="16px">{duration}</Tex>
    </OreConTop>
    <OreConMid>
      <Tex color="rgb(14, 190, 117)">{price}</Tex>
    </OreConMid>
    <MonCon>
      <MonTex>{monthlyPrice}</MonTex>
    </MonCon>
    <OreConBot>
      <OreConSub>
        <Tex color="#fff">{discount}</Tex>
      </OreConSub>
    </OreConBot>
    <OreConLast />
  </OreCon>
);

const Payment = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function initIAP() {
      try {
        await RNIap.initConnection(); // Initialize IAP
        const products = await RNIap.getProducts(itemSkus); // Fetch available products
        setProducts(products);
      } catch (error) {
        console.warn(error);
      }
    }

    initIAP();

    return () => {
      RNIap.endConnection(); // Close IAP connection when component unmounts
    };
  }, []);

  // Purchase handling
  const handlePurchase = async () => {
    const product = products.find(
      (p) => p.productId === itemSkus[selectedOption - 1]
    );
    if (product) {
      try {
        await RNIap.requestPurchase(product.productId); // Initiate purchase
        Alert.alert("Success", `Purchase successful for ${product.title}`);
      } catch (err) {
        Alert.alert("Purchase Error", err.message);
      }
    }
  };

  const getButtonText = () => {
    const selected = pricingOptions.find(
      (option) => option.id === selectedOption
    );
    return `فتح العضوية المميزة لمدة ${selected.duration}`;
  };

  return (
    <SafeArea>
      <Navbar />
      <ScrollView>
        <Container>
          <TopTe>ابدأ اليوم بدون مخاطر</TopTe>
          <TopSubTe>طور لغتك بطريقة علمية ومدروسة</TopSubTe>
          <OreConAll>
            {pricingOptions.map((option) => (
              <PricingCard
                key={option.id}
                {...option}
                selected={selectedOption === option.id}
                onSelect={() => setSelectedOption(option.id)}
              />
            ))}
          </OreConAll>
          <ButtonContainer>
            <Button bgColor="rgb(14, 190, 117)" onPress={handlePurchase}>
              <ButtonText>{getButtonText()}</ButtonText>
            </Button>
            <Button bgColor="rgb(240, 240, 240)" onPress={() => router.back()}>
              <ButtonText color="rgb(30, 45, 64)">
                لا شكراً ارغب التجربة مجاناً
              </ButtonText>
            </Button>
          </ButtonContainer>
          <BotTex>فتح ميزات العضوية المميزة</BotTex>
          <FeatureContainer>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <FeatureImage source={feature.image} />
                <TextView>
                  <FeatureText>{feature.text}</FeatureText>
                  <FeatureDes> {feature.description}</FeatureDes>
                </TextView>
              </FeatureItem>
            ))}
          </FeatureContainer>
        </Container>
      </ScrollView>
    </SafeArea>
  );
};

export default Payment;
