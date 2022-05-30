import React, { useEffect, useRef, useState } from "react";
import * as Notifications from 'expo-notifications';
import "dayjs/locale/ja";

import { RootNavigator } from "../navigation/RootNavigator";
import { NativeBaseProvider } from "native-base";
import { createExpoPushToken } from "../modules/CreateExpoPushToken";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
	const [expoPushToken, setExpoPushToken] = useState<any>('');
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    createExpoPushToken().then(token => setExpoPushToken(token));

    // このリスナーは、アプリがフォアグラウンドの状態で通知を受けると、必ず呼び出される。
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // これはユーザーが通知をタップしたときに呼び出される。
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // 通知サブスクリプションを削除
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current as any);
      Notifications.removeNotificationSubscription(responseListener.current as any);
    };
  }, []);

	return (
		<NativeBaseProvider>
      <RootNavigator />
    </NativeBaseProvider>
	);
}
