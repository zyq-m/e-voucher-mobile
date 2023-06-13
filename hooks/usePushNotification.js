import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Note: allow popup notification when app open
    shouldSetBadge: true,
  }),
});

export function usePushNotification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        // console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { schedulePushNotification };
}

async function schedulePushNotification(notification) {
  try {
    if (Platform.OS === "web") {
      alert(`${notification.title} - ${notification.body}`);
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: null, // cause notification trigger immediately
    });
  } catch (error) {
    console.warn(error);
    return;
  }
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "web") {
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
