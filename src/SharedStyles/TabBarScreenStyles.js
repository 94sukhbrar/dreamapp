import { StyleSheet } from 'react-native';
import Layout from '../Constants/Layout';
import Colors from '../Constants/Colors';

const TabBarScreenStyles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  bottomBtnContainer: {
    backgroundColor: Colors.backgroundColor,
    width: '100%',
    height: Layout.tabBarScreensBottomBtnHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBarScreenStyles;