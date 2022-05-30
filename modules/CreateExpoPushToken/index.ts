import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

	// userのデバイスが実機であるかを確認するとともに、通知の許可の可否を確認している。そして通知の許可がある場合、tokenを取得する。
export const createExpoPushToken = async () => {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('pushトークンの取得に失敗しました');
      return;
    }
    // tokenを取得している
    token = (await (Notifications.getExpoPushTokenAsync())).data
  } else {
    alert('push通知のテストについては実機の端末を使ってください。');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return {
    token
  }
}
