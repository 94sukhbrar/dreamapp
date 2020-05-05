import { StyleSheet } from 'react-native';
import Layout from '../Constants/Layout';
import Colors from '../Constants/Colors';

const AuthScreensStyles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  imageOverLayContainer: {
    width: Layout.screenWidth,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  logoContainer: {
    height: Layout.authScreensDreamLogoContainerAbsoluteHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: Layout.authScreensElementsAbsoluteMarginVertical,
    marginLeft: Layout.authScreensElementsMarginHorizontal,
  },
  userTypeContainer: {
    width: Layout.authScreensElementsWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  changeAuthMethodBtnContainer: {
    position: 'absolute',
    bottom: Layout.screenHeight > 850 ? '3%' : '1%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeAuthMethodBtnText: {
    color: Colors.tintColor,
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
  }
});

export default AuthScreensStyles;