import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";

export const requestPermission = async () => {
  console.log("Requesting permission...");

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const fcmToken = await getToken(messaging, {
      vapidKey: "BGqjiTmQXZJG1RezaabLDAP-RW7Ncf3npYJ727jZ3ECd_CuUoxGmKIfUIKsTtQ4epupSFjWr9k5uE_yOW4jBXs8"
    });

    console.log("FCM Token:", fcmToken);
    return fcmToken;
  } else {
    console.log("Permission not granted!");
    return null;
  }
};

export const listenForForegroundNotifications = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Foreground Notification:", payload);
    callback(payload);
  });
};
