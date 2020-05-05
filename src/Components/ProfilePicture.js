import React from 'react';
import { 
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import SmallLoadingOverlay from './SmallLoadingOverlay';
import Icon from 'react-native-vector-icons/Ionicons';

const size = 85;
const cameraIconSize = 25;

const ProfilePicture = ({ uri, onPress, loading, style }) => (
  <>
    <TouchableOpacity style={[styles.container, style]} disabled={uri != ''} onPress={onPress}>
      <>
        {
          uri == ''
            ? <Icon name='md-person' size={size - 8} color={Colors.grayTextColor} />
            : <Image style={styles.image} source={{uri, cache: 'force-cache'}}/>
        }
        <SmallLoadingOverlay visible={loading} />
      </>
    </TouchableOpacity>

    <TouchableOpacity style={styles.cameraIconContainer} onPress={onPress}>
      <Icon name='ios-camera' size={20} color={Colors.tintColor} style={styles.cameraIcon}/>
    </TouchableOpacity>
  </>
);

const styles = StyleSheet.create({
  container:{
    width: size,
    height: size,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.tintColor,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    alignSelf: 'center',
    marginTop: -cameraIconSize/2,
    width: cameraIconSize,
    height: cameraIconSize,
    borderRadius: cameraIconSize / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

ProfilePicture.propTypes = {
  uri: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
}

export default ProfilePicture;