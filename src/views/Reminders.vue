<script setup lang="ts">
    import BasePage from '@/components/BasePage.vue';
    import BaseTextField from '@/components/BaseTextField.vue';
    import { getPendingNotifications } from '@/services/notifications';
    import type { PendingLocalNotificationSchema } from '@capacitor/local-notifications';
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    
    const router = useRouter();
    const addReminder = () => {
        router.push("/addReminder");
    }

    const reminders = ref<PendingLocalNotificationSchema[]>([]);
    const editingReminders = ref<boolean>(false);
    const editingReminderId = ref<number>(-1);

    const newReminderDate = ref<string>("");
    const newReminderTitle = ref<string>("");
    const newReminderBody = ref<string>("");
    
    const getReminders = async () => {
        const showNot = await getPendingNotifications();
        reminders.value = showNot;
        console.log(showNot);
    };

    const editReminderClicked = (reminderId: number, reminderTitle: string, reminderBody: string, reminderDate: Date | undefined) => {
        editingReminderId.value = reminderId;
        newReminderTitle.value = reminderTitle;
        newReminderBody.value = reminderBody;
        newReminderDate.value = parseDate(reminderDate);

        editingReminders.value = !editingReminders.value;
        console.log(editingReminderId);
    }
    
    const parseDate = (date: Date | undefined): string => {
        if (date) {
            const d = date instanceof Date ? date : new Date(date);
          
              // Guard against invalid dates
              if (isNaN(d.getTime())) return "ERROR";
          
              const day = d.getDate();
              const month = d.getMonth() + 1;
              const year = d.getFullYear();
          
              const finalDay = day < 10 ? `0${day}` : `${day}`;
              const finalMonth = month < 10 ? `0${month}` : `${month}`;
          
              return `${finalDay}/${finalMonth}/${year}`;
        }

        return "ERROR";
    }

    onMounted(async () => {
        await getReminders();
    });
</script>

<template>
    <BasePage location="reminder" :addClicked="addReminder">
        <div class="HomeOptions">
            <h1 class="Header"> Recordatorios </h1>
        </div>

        <div class="remindersContainer">
            <div class="reminder" v-for="notification in reminders">
                <div class="entryTitle">
                    <BaseTextField style="height: 40px;" v-if="editingReminders && (editingReminderId == notification.id)" v-model="newReminderDate" type="text" />
                    <div v-else class="datePanel">
                        <p class="marginless"> {{ parseDate(notification.schedule?.at) }} </p>
                    </div>
                    
                    <div :class="['moreInfoButton', editingReminders && (editingReminderId == notification.id) ? 'cancelEditButton' : '']" v-on:click="editReminderClicked(notification.id, notification.title, notification.body, notification.schedule?.at)">
                        <div :class="['moreInfoIcon', editingReminders && (editingReminderId == notification.id) ? 'cancelEditIcon' : '']" />
                    </div>
                </div>

                <BaseTextField style="height: 40px;" v-if="editingReminders && (editingReminderId == notification.id)" v-model="newReminderTitle" type="text" />
                <div v-else class="datePanel">
                    <p class="marginless"> {{notification.title}} </p>
                </div>
                
                <BaseTextField v-if="editingReminders && (editingReminderId == notification.id)" v-model="newReminderBody" type="textarea" :rows="4"/>
                <div v-if="(notification.body != '') && !(editingReminders && (editingReminderId == notification.id))" class="basicInfo" style="margin-bottom: 0px;">
                    <p class="marginless"> {{notification.body}} </p>
                </div>

                <div class="entryTitle" v-if="editingReminders && (editingReminderId == notification.id)" >
                    <div v-if="editingReminders && (editingReminderId == notification.id)" style="margin-right: 10px;" class="acceptButton"> <!--v-on:click="saveEntry"-->
                        <p class="marginless treeSpeciesText" style="font-style: normal;"> Guardar </p>
                    </div>

                    <div v-if="editingReminders && (editingReminderId == notification.id)"  class="deleteButton"> <!--v-on:click="saveEntry"-->
                        <p class="marginless treeSpeciesText" style="font-style: normal;"> Eliminar </p>
                    </div>
                </div>
            </div>
        </div>
    </BasePage>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Fontdiner+Swanky&family=IBM+Plex+Serif:ital,wght@0,500;0,700;1,500;1,700&family=Jim+Nightshade&display=swap');
    
    .marginless {
        margin: 0px;
    }
    
    .Header {
        font-family: "IBM Plex Serif", serif;
        font-weight: 700;
        font-size: 50px;
        text-align: center;
    }
    
    .HomeOptions {
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        margin-bottom: 20px;
        margin-top: 20px;
        
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    
    .treeSpeciesText {
        font-family: "IBM Plex Serif", serif;
        font-weight: 700;
    }
    
    .remindersContainer {
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .reminder {
        width: 95dvw;
        box-sizing: border-box;
        background-color: var(--soil-primary);
        
        padding: 10px;

        display: flex;
        flex-direction: column;
        gap: 10px;
        
        border-radius: 20px;
        margin-bottom: 40px;
    }

    .entryTitle {
        width: 100%;
        
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        
        position: relative;
    }
    
    .datePanel {
        box-sizing: border-box;
        background-color: var(--soil-clay);
        border-radius: 10px;
        
        font-family: "IBM Plex Serif", serif;
        font-weight: 500;
        padding: 10px;
        
        flex: 1;
    }

    .moreInfoButton {
        height: 100%;
        aspect-ratio: 1;
        
        margin-left: 10px;
        box-sizing: border-box;
        background-color: var(--soil-clay);
        border-radius: 10px;
        
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .moreInfoIcon {
        width: 70%;
        aspect-ratio: 1;
        
        background-color: black;
        mask-image: url('/icons/Edit.svg');
        mask-size: contain;
    }
    
    .cancelEditButton {
        background-color: var(--soil-error);
    }
    
    .cancelEditIcon {
        mask-image: url('/icons/Cross.svg');
    }

    .basicInfo {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 10px;
        position: relative;
        
        box-sizing: border-box;
        width: 100%;
        background-color: var(--soil-clay);
        border-radius: 10px;
        
        font-family: "IBM Plex Serif", serif;
        font-weight: 500;
        
        margin-bottom: 40px;
    }

    .acceptButton {
        padding: 10px;
        background-color: var(--soil-accent);
        flex: 1;
        
        border-radius: 10px;
        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        transition: 0.3s ease;
    }
    
    .acceptButton:hover {
        background-color: var(--soil-accent-hover);
    }

    .deleteButton {
        padding: 10px;
        background-color: var(--soil-error);
        flex: 1;
        
        border-radius: 10px;
        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        transition: 0.3s ease;
    }

    .deleteButton:hover {
        background-color: #ff0000;
    }
</style>