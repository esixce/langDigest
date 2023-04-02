<script type="module" src="firebase-auth.js"></script>


// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRtbBqLGPwY3I2C7DvfkWs2g2CDY2-2JQ",
    authDomain: "textdigest.firebaseapp.com",
    projectId: "textdigest",
    storageBucket: "textdigest.appspot.com",
    messagingSenderId: "158138524867",
    appId: "1:158138524867:web:5b6d22c89ab2d7114b2e76",
    measurementId: "G-FZJ73BKRZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Retrieve data from the "users" node
const usersRef = ref(database, "users");
onValue(usersRef, (snapshot) => {
  // The "snapshot" object contains all the data in the "users" node
  console.log('HERE');
  console.log(snapshot.val());
}, {
  onlyOnce: true
});
