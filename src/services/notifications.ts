import { LocalNotifications } from "@capacitor/local-notifications";

async function startNotifications() {
  //Requesting the permission to send notifications
  await LocalNotifications.requestPermissions();
}

async function scheduleNotification(title: string, body: string, date: Date) {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: title,
        body: body,
        id: 1,
        schedule: { at: date }
      },
    ],
  });
}