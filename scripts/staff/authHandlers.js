// scripts/staff/authHandlers.js
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { displayUsers } from "./displayUsers.js";

// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user);
        console.log("UID:", user.uid);
        console.log("Email:", user.email);
    } else {
        console.log("No user is signed in.");
    }
    displayUsers();
});