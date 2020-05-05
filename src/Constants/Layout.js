import { computePercentageRemainder } from "../Utilities/Tools";
import { Dimensions } from 'react-native';

const screen = Dimensions.get('screen');

const authScreensElementsWidth = '88%';

const screenWidth = screen.width;
const screenHeight = screen.height;

const screenAspectRatio = screenHeight / screenWidth;

const errorMessageFontSize = 14;
const errorMessageBottomMargin = 7;
const errorMessageHeight = errorMessageFontSize + errorMessageBottomMargin;

const rootScreensAbsoluteHeaderHeight = screenHeight * 0.125;

let appointmentCardFontSize = 14;

const primaryBtnHeight = 50;

const Layout = {
  screenWidth,
  screenHeight,
  screenAspectRatio,
  authScreensElementsHeight: 47,
  authScreensElementsWidth,
  authScreensElementsMarginHorizontal: computePercentageRemainder(authScreensElementsWidth) / 2 + '%',
  authScreensElementsAbsoluteMarginVertical: Math.max(screenHeight * 0.018, (errorMessageHeight / 2) + 2),
  authScreensDreamLogoContainerAbsoluteHeight: screenHeight > 850 ? screenHeight * 0.3 : screenHeight * 0.2,
  errorMessageFontSize,
  errorMessageHeight,
  consultantCardsHeight: screenHeight > 850 ? 310 : 295,
  primaryBtnHeight,
  rootScreensAbsoluteHeaderHeight,
  profileFieldsActionBtnsHeight: 28,
  tabBarMaxHeight: 90,
  appointmentCardBorderRadius: 20,
  appointmentCardFontSize,
  tabBarScreensBottomBtnHeight: primaryBtnHeight + 20,
  primaryTextFieldHeight: screenHeight > 850 ? 50 : 45,
  largeCallBtnSize: screenWidth * 0.22,
  smallCallBtnSize: screenWidth * 0.16,
}

export default Layout;