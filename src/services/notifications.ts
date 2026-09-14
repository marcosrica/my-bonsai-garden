import { LocalNotifications, type PendingLocalNotificationSchema, type PendingResult } from "@capacitor/local-notifications";

export async function startNotifications() {
  //Requesting the permission to send notifications
  await LocalNotifications.requestPermissions();
}

export async function scheduleNotification(title: string, body: string, date: Date, id?:number) {
  let useId: number;
  console.log("ID to add notification with is: " + id);
  if (id) {
    useId = id;
  }
  else {
    console.log("Getting new Id for notification");
    const lastNot = await getLastNotification();
    console.log("Last notification was: ", lastNot);
    if (lastNot?.id != undefined) {
      useId = lastNot.id + 1;
    }
    else {
      useId = 0;
    }
  }

  console.log("Final ID for notification is: " + useId);
  
  await LocalNotifications.schedule({
    notifications: [
      {
        id: useId,
        title: title,
        body: body,
        schedule: { at: date }
      },
    ],
  });
}

async function getLastNotification(): Promise <PendingLocalNotificationSchema | undefined> {
  const pendingReminders = await getPendingNotifications();

  return pendingReminders[pendingReminders.length - 1];
}

export async function getPendingNotifications(): Promise<PendingLocalNotificationSchema[]> {
  const pending:PendingResult = await LocalNotifications.getPending();
  return pending.notifications;
}

export async function editNotification(id: number, newTitle: string, newBody: string, newDate: Date) {
  //First cancel the existing notification
  await LocalNotifications.cancel({ notifications: [{ id: id }] });

  //Setting up the new notification
  await scheduleNotification(newTitle, newBody, newDate, id = id);
} 