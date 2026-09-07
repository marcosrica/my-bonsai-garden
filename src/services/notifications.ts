import { LocalNotifications } from "@capacitor/local-notifications";

export async function startNotifications() {
  //Requesting the permission to send notifications
  await LocalNotifications.requestPermissions();
}

export async function scheduleNotification(title: string, body: string, date: Date) {
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