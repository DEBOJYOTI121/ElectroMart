import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";


const firebaseConfig = {

  apiKey: "AIzaSyAirn4OMsK9hCXNOG6l6Dmm0VgKJHyMwAA",

  authDomain: "electro-mart-bba4b.firebaseapp.com",

  projectId: "electro-mart-bba4b",

  storageBucket: "electro-mart-bba4b.firebasestorage.app",

  messagingSenderId: "112027346707",

  appId: "1:112027346707:web:31e1f08edbd8cb12e95ce6",

  measurementId: "G-VXQVBDQQ4X"

};


const app = initializeApp(firebaseConfig);


/* AUTH */
export const auth = getAuth(app);


/* GOOGLE */
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});


export default app;