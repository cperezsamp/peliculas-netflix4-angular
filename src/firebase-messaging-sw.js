importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-messaging-compat.js');
/* import { initializeApp } from '@angular/fire/app';
import { getMessaging, getToken } from "@angular/fire/messaging";
 */
firebase.initializeApp({
    projectId: 'peliculas-netflix-faa3a',
    appId: '1:300907069864:web:a244e24e603e0459fc9d9d',
    storageBucket: 'peliculas-netflix-faa3a.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyAfgfPRYfKJaxz3dpTlnpKsZXLOlEoZzi8',
    authDomain: 'peliculas-netflix-faa3a.firebaseapp.com',
    messagingSenderId: '300907069864',
});
// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();
/* // Add the public key generated from the console here.
getToken(messaging, { vapidKey: "BCBFvjwHEBcozxyaESKCvtaOQ7ikKuuNYovKfq-NtY69lkaR49VgGsSTHvD_ZnVmTLrCy-bDZWFHpJrEvThltvM" }); */
