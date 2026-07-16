import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAZdjlVCLFUgiKD6Zd4dzTsu6MlxlVpmG4",
    authDomain: "gaming-world-login.firebaseapp.com",
    projectId: "gaming-world-login",
    storageBucket: "gaming-world-login.firebasestorage.app",
    messagingSenderId: "400492645961",
    appId: "1:400492645961:web:d5422a33239fff016eb998"
};


const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);


const loadingBox =
    document.getElementById("profileLoading");

const profileContent =
    document.getElementById("profileContent");

const profileError =
    document.getElementById("profileError");

const profilePhoto =
    document.getElementById("profilePhoto");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileUid =
    document.getElementById("profileUid");

const accountName =
    document.getElementById("accountName");

const accountEmail =
    document.getElementById("accountEmail");

const accountProvider =
    document.getElementById("accountProvider");

const memberSince =
    document.getElementById("memberSince");

const lastLogin =
    document.getElementById("lastLogin");

const emailStatus =
    document.getElementById("emailStatus");

const logoutBtn =
    document.getElementById("logoutBtn");


function formatDate(dateString) {
    if (!dateString) {
        return "Unknown";
    }

    const date = new Date(dateString);

    return new Intl.DateTimeFormat(
        "en",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(date);
}


function getProviderName(user) {
    const provider =
        user.providerData?.[0]?.providerId;

    if (provider === "google.com") {
        return "Google";
    }

    if (provider === "password") {
        return "Email & Password";
    }

    return "Firebase";
}


onAuthStateChanged(auth, function (user) {

    loadingBox.classList.add("hidden");

    if (!user) {
        profileContent.classList.add("hidden");
        profileError.classList.remove("hidden");
        return;
    }

    profileError.classList.add("hidden");
    profileContent.classList.remove("hidden");

    const displayName =
        user.displayName ||
        (
            user.email
                ? user.email.split("@")[0]
                : "Gaming World User"
        );

    profilePhoto.src =
        user.photoURL || "favicon.png";

    profilePhoto.onerror = function () {
        this.src = "favicon.png";
    };

    profileName.textContent =
        displayName;

    profileEmail.textContent =
        user.email || "No email available";

    profileUid.textContent =
        user.uid;

    accountName.textContent =
        displayName;

    accountEmail.textContent =
        user.email || "No email available";

    accountProvider.textContent =
        getProviderName(user);

    memberSince.textContent =
        formatDate(
            user.metadata.creationTime
        );

    lastLogin.textContent =
        formatDate(
            user.metadata.lastSignInTime
        );

    emailStatus.textContent =
        user.emailVerified
            ? "Email verified"
            : "Email not verified";

});


logoutBtn.addEventListener(
    "click",
    async function () {

        logoutBtn.disabled = true;
        logoutBtn.textContent = "Logging out...";

        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error(error);

            logoutBtn.disabled = false;
            logoutBtn.textContent = "Logout";

            alert(
                "Could not log out. Try again."
            );
        }

    }
);
