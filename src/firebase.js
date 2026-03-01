
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore,doc,setDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDqiQQjR1GEa7MU3jYGF4szPEwXLT9Mfc",
  authDomain: "trackex-6ef33.firebaseapp.com",
  projectId: "trackex-6ef33",
  storageBucket: "trackex-6ef33.appspot.com",
  messagingSenderId: "778344223930",
  appId: "1:778344223930:web:a598bbd73cf3a7f0639e83",
  measurementId: "G-ZD6B9R42H6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
const provider=new GoogleAuthProvider();


export{db,auth,provider,setDoc,doc};
