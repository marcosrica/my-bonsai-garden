# My Bonsai Garden
An android (and potentially IOS), local first (and only) application for keeping a history on your garden plants and bonsais.
You will be able to create trees, set a representative picture, and log their species. The app will keep track of the 
last time those trees were pruned and transplanted, and it will enable you to create a twitter-like feed of entries 
with text and / or images of how your trees were at certain points in time, ordered by a timestamp.

Created using vue + capacitor's tech stack, on a base of Typescript

## Structure
* All the icons used throught the app are stored in /public/icons as svg files
* The general color css variables are in /src/assets/base.css
* The /src/components folder holds the little components (lego pieces) used by several pages
* The /src/router/index.ts file is just the same old Vue router to enable multiple routes
* The /src/services folder contains all the pieces of code that interact directly with android (For handling the camera, the FS, the database...)
* Inside /src/views are the pages itself, the final product the user will see and interact
  - TreesView.vue is the landing page, that will show the user all the trees and let them make and restore a security copy as a .zip file
  - Bonsai.vue is the Tree info page, to edit one of your plants and see the feed
  - Reminders.vue handles the notifications aspect of the project within a clean and neat UI
  - AddEntry.vue is a special page loaded specifically to make the process of adding an entry to the feed of a tree easier
  - AddReminder.vue works just as AddEntry, but focusing on adding reminders (notifications)
 
## Running
For installation and running instructions, refer to the [Capacitor setup site](https://capacitorjs.com/solution/vue)
