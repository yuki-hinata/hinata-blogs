import * as ImagePicker from "expo-image-picker";
import { StorageReference, uploadBytes } from "firebase/storage";

export const imagePicker = async ( storageRef: StorageReference ) => {
  const picker = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0,
    allowsEditing: true,
  });
  
  if (!picker.cancelled) {
    const fetchUri = await fetch(picker.uri);
    const blob = await fetchUri.blob();
    await uploadBytes(storageRef, blob)
  }
}
