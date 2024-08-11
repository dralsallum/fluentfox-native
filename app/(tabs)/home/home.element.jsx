import styled from "styled-components/native";
import { ScrollView, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
  direction: rtl;
`;

export const QueMa = styled.View`
  flex: 1;
  background-color: #ffffff;
  width: 100%;
`;

export const QueWra = styled(ScrollView)`
  flex: 1;
`;

export const QueCon = styled.View`
  margin-bottom: 24px;
`;

export const QueSubCon = styled.View`
  background-color: white;
  padding: 20px;
  width: 100%;
  border-radius: 10px;
`;

export const QueTiCon = styled.View`
  width: 100%;
  margin-bottom: 10px;
`;

export const QueTi = styled.Text`
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: bold;
  text-align: left;
  color: #0139a4;
`;

export const QueSubTitCon = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;
export const QueLe = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #0139a4;
`;
export const QueLeCo = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #555;
`;

export const QueSubTit = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #555;
`;

export const QueSubIcoCon = styled.View`
  width: 18px;
  height: 18px;
`;

export const QueSubIco = styled.Image`
  width: 100%;
  height: 100%;
`;

export const QueTimline = styled.View`
  width: 100%;
`;

export const QueTiBoCon = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

export const QueTiBo = styled.View`
  width: 100%;
  min-height: 97px;
  border-radius: 10px;
`;

export const QueTiKeyCon = styled.View`
  width: 100%;
`;

export const QueTimKey = styled.View`
  width: 100%;
`;

export const QueBan = styled.View`
  background-color: rgb(67, 45, 176);
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 10px;
`;

export const QuenBanMa = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const QueBanSub = styled.View``;

export const QueBanLa = styled.View`
  width: 100%;
`;

export const QueTeCon = styled.View`
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
`;

export const QuenTeConSub = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

export const QueTeConSec = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const QueTeConThi = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

export const LinkCon = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;
export const SuperCon = styled.Image`
  width: 80px;
  height: 80px;
  position: absolute;
  right: -4;
  top: -10;
`;

export const QueTeHe = styled.Text`
  font-size: 20px;
  font-weight: bold;
  line-height: 26px;
  text-align: left;
  color: #fff;
`;

export const QueChaOneCon = styled.View`
  margin: 20px 0;
  border-width: 2px;
  border-color: ${(props) => (props.completed ? "#4c47e8" : "lightgray")};
  border-radius: 18px;
  padding: 8px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

export const QueChaOneHeaCon = styled.View`
  padding: 0px;
  margin-bottom: 0px;
  font-weight: bold;
`;

export const QueChaOneHea = styled.Text`
  font-size: 24px;
  font-weight: 400;
  text-align: left;
`;

export const QueChaOnePar = styled.Text`
  margin-top: 0px;
  margin-right: 5px;
  padding-top: 0px;
  margin-bottom: 24px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgb(30, 45, 64);
  text-align: left;
`;

export const QueChaProCon = styled.View`
  width: 100%;
  height: 12px;
  background-color: #d8e1ea;
  border-radius: 10px;
  position: relative;
`;

export const QueChaPro = styled.View`
  height: 100%;
  width: 100%;
  background-color: #4c47e9;
  border-radius: 10px;
`;

export const QueChaProSpa = styled.View`
  width: 36px;
  height: 20px;
  border-radius: 8px;
  background-color: #4c47e9;
  position: absolute;
  right: ${({ progress }) =>
    progress === 100 ? 0 : `${Math.min(100 - progress, 90)}%`};
  left: auto;
  top: -4px;
  justify-content: center;
  align-items: center;
`;

export const QueChaProTe = styled.Text`
  color: white;
  font-size: 10px;
`;

export const QueChaProText = styled.Text`
  color: white;
  font-size: 10px;
`;

export const QueChaIteEle = styled.View`
  position: relative;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: transparent;
  padding: 10px 0;
  border-radius: 16px;
  flex-direction: row;
  margin: 10px 0;
`;

export const QueChaItePar = styled.View`
  z-index: 2;
  align-items: center;
  justify-content: center;
  width: 85px;
  height: 85px;
  background-color: ${({ completed }) => (completed ? "#4c47e8" : "#ffffff")};
  border-radius: 45px;
`;

export const QueChaPicCon = styled.View`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const QueChaPicChiCon = styled.View`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const QueChaPicSvg = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  transform: rotate(90deg);
`;

export const QueChaPicDef = styled.View``;

export const QueChaPicLin = styled.View``;

export const QueChaPicSto = styled.View``;

export const QueChaPicCir = styled.View``;

export const QueChaPicSec = styled.View`
  margin: auto;
  position: absolute;
  border-radius: 50px;
  overflow: hidden;
  width: 84px;
  height: 84px;
  padding: 3px;
  background-color: ${({ completed }) =>
    completed ? "#4c47e8" : "transparent"};
`;

export const QueChaPic = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;

export const QueChaPicMai = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export const QueChaIteSpa = styled.View`
  flex: 1;
  margin-left: 10px;
`;

export const QueChaIteParText = styled.Text`
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: rgb(30, 45, 64);
  text-align: left;
`;

export const QueChaIteSubPar = styled.Text`
  margin: 0;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: rgb(30, 45, 64);
  text-align: left;
`;

export const QueChaPoiCon = styled.View`
  z-index: 1;
  position: absolute;
  height: 100%;
  left: 40px;
  bottom: -40px;
  border-radius: 8px;
  width: 4px;
  background-color: rgb(218, 225, 234);
`;

export const QueChaPoi = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #4c47e9;
`;

export const FinChaProCon = styled.View`
  position: relative;
  border-radius: 16px;
  width: 100%;
  background-color: rgb(218, 225, 234);
  margin-top: 10px;
  height: 12px;
`;

export const FinChaPro = styled.View`
  position: absolute;
  height: 100%;
  background-color: #4c47e9;
  border-radius: 16px;
  left: 0;
`;

export const FinChaProSpa = styled.View`
  font-size: 10px;
  align-items: center;
  justify-content: center;
  height: 20px;
  border-radius: 20px;
  background-color: #4c47e9;
  color: #ffffff;
  padding: 0 8px;
  min-width: 30px;
  position: absolute;
  right: 0;
  transform: translateX(50%);
  bottom: 6px;
`;
