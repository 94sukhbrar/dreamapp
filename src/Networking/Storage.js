import storage from '@react-native-firebase/storage';

export const uploadPhotoAndRetrieveUrl = async(photoRef, photoBlob) => {
  await photoRef.put(photoBlob);

  const photoUrl = await photoRef.getDownloadURL();

  return photoUrl;
}