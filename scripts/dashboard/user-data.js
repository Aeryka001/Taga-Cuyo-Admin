import { collection, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { db } from './firebase-config.js'; // Import db from firebase-config.js
// Function to create and append a user list item to the user list
// Function to create and append a user list item to the user list
function createUserListItem(userData, userList) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>Email:</strong> ${userData.email} <br>
        <strong>Name:</strong> ${userData.firstName} ${userData.lastName} <br>
        <strong>Gender:</strong> ${userData.gender || 'N/A'} <br>
    `;

    // Append the list item to the user list
    userList.appendChild(listItem);
}

async function fetchUserData() {
    // Create a reference to the "users" collection
    const usersRef = collection(db, 'users');
    
    // Fetch all users
    const totalUsersSnapshot = await getDocs(usersRef);
    const totalUsers = totalUsersSnapshot.size;

    let onlineUsersCount = 0;
    let userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear the list before populating

    totalUsersSnapshot.forEach((doc) => {
        const userData = doc.data();

        if (userData.status === "Online") {
            onlineUsersCount++;
        }
    });

    document.getElementById('total-users').innerText = totalUsers;
    document.getElementById('online-users').innerText = onlineUsersCount;

    fetchRecentUsers();
}

// Function to fetch and display recent users
async function fetchRecentUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    // Create a query to fetch the 10 most recent users
    const recentUsersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(10)
    );

    const recentUsersSnapshot = await getDocs(recentUsersQuery);

    recentUsersSnapshot.forEach((doc) => {
        const userData = doc.data();
        createUserListItem(userData, userList);
    });
}

document.addEventListener('DOMContentLoaded', fetchUserData);
