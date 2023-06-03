import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import { Messaging, getMessaging, getToken, onMessage } from "@angular/fire/messaging";
import { environment } from '../environments/environment.development';
import { addDoc, collection, Firestore} from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    currentMessage = new BehaviorSubject<any>(null);
    messaging: Messaging;

    constructor(private angularFireMessaging: AngularFireMessaging, private firestore: Firestore) {
        console.log('messagins service correctly created')
    }

    requestPermission() {
        console.log('Requesting permission...');
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {

                console.log('Notification permission granted.');
                this.getFirebaseToken()
            }
        }).catch((err) => { console.log('error', err) })
    }

    getFirebaseToken() {
        const messaging = getMessaging();
        getToken(messaging, { vapidKey: environment.firebase_token }).then((currentToken: any) => {
            if (currentToken) {
                console.log('Current token', currentToken)
                // Subir el token a la bbdd
                this.addToken(currentToken);
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                // ...
            }
        }).catch((err: any) => {
            console.log('An error occurred while retrieving token. ', err);
            // ...
        });
        this.messaging= messaging;
    }

    async addToken(currenToken: object) {
        const coleccion = collection(this.firestore, 'FCMTokens');  
        const docRef = await addDoc(coleccion, {token: currenToken}); 
        return docRef;
    }

    receiveMessaging() {
        this.angularFireMessaging.messages.subscribe((payload) => {
            console.log('new message received', payload)
            this.currentMessage.next(payload)
        })
    }

}