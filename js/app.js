/* =========================================
   GAMING WORLD - MAIN JS + FIREBASE AUTH
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       عناصر الموقع الأساسية
    ========================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navbar = document.querySelector(".navbar");
    const scrollTopBtn = document.getElementById("scrollTop");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    /* فتح وإغلاق القائمة */
    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            navLinks.classList.toggle("active");
        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                navLinks.classList.remove("active");
            });

        });

        document.addEventListener("click", function (event) {

            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                navLinks.classList.remove("active");
            }

        });

    }

    /* تغيير شكل النافبار عند النزول */
    if (navbar) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 30) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        });

    }

    /* زر الرجوع للأعلى */
    if (scrollTopBtn) {

        window.addEventListener("scroll", function () {
            scrollTopBtn.classList.toggle(
                "show",
                window.scrollY > 400
            );
        });

        scrollTopBtn.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

    /* البحث */
    function searchGames() {

        if (!searchInput) return;

        const searchValue =
            searchInput.value.trim().toLowerCase();

        if (searchValue.includes("pubg")) {

            window.location.href = "pubg.html";

        } else if (
            searchValue.includes("call of duty") ||
            searchValue.includes("cod")
        ) {

            window.location.href = "callofduty.html";

        } else if (searchValue.includes("minecraft")) {

            window.location.href = "minecraft.html";

        } else if (
            searchValue.includes("gta")
        ) {

            window.location.href = "games.html";

        } else if (
            searchValue.includes("fifa") ||
            searchValue.includes("fc 26")
        ) {

            window.location.href = "games.html";

        } else if (
            searchValue.includes("fortnite")
        ) {

            window.location.href = "games.html";

        } else if (searchValue !== "") {

            window.location.href = "games.html";

        }

    }

    if (searchBtn && searchInput) {

        searchBtn.addEventListener(
            "click",
            searchGames
        );

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {
                    searchGames();
                }

            }
        );

    }

    /* تشغيل Firebase في جميع الصفحات */
    startFirebaseAuthentication();

});


/* =========================================
   FIREBASE AUTHENTICATION
========================================= */

async function startFirebaseAuthentication() {

    const messageBox =
        document.getElementById("message");

    function showMessage(
        text,
        type = "error"
    ) {

        if (!messageBox) return;

        messageBox.textContent = text;
        messageBox.className =
            "message show " + type;

    }

    function clearMessage() {

        if (!messageBox) return;

        messageBox.textContent = "";
        messageBox.className = "message";

    }

    try {

        /* تحميل Firebase */
        const firebaseAppModule = await import(
            "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js"
        );

        const firebaseAuthModule = await import(
            "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js"
        );

        const {
            initializeApp,
            getApps,
            getApp
        } = firebaseAppModule;

        const {
            getAuth,
            GoogleAuthProvider,
            signInWithPopup,
            signInWithEmailAndPassword,
            createUserWithEmailAndPassword,
            signOut,
            onAuthStateChanged,
            setPersistence,
            browserLocalPersistence
        } = firebaseAuthModule;


        /* =========================================
           إعدادات مشروع Firebase الجديد
        ========================================= */

        const firebaseConfig = {

            apiKey:
                "AIzaSyAZdjlVCLFUgiKD6Zd4dzTsu6MlxlVpmG4",

            authDomain:
                "gaming-world-login.firebaseapp.com",

            projectId:
                "gaming-world-login",

            storageBucket:
                "gaming-world-login.firebasestorage.app",

            messagingSenderId:
                "400492645961",

            appId:
                "1:400492645961:web:d5422a33239fff016eb998"

        };


        /* منع تشغيل Firebase مرتين */
        const firebaseApp =
            getApps().length > 0
                ? getApp()
                : initializeApp(firebaseConfig);

        const auth = getAuth(firebaseApp);

        await setPersistence(
            auth,
            browserLocalPersistence
        );


        /* =========================================
           زر Login الموجود في النافبار
        ========================================= */

        const navbarAuthBtn =
            document.getElementById("navbarAuthBtn") ||
            document.querySelector(".login-btn") ||
            document.querySelector('a[href="login.html"]');


        /* =========================================
           عناصر صفحة Login
        ========================================= */

        const authPanel =
            document.getElementById("authPanel");

        const userPanel =
            document.getElementById("userPanel");

        const authForm =
            document.getElementById("authForm");

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const googleBtn =
            document.getElementById("googleBtn");

        const submitBtn =
            document.getElementById("submitBtn");

        const switchModeBtn =
            document.getElementById("switchModeBtn");

        const switchQuestion =
            document.getElementById("switchQuestion");

        const formTitle =
            document.getElementById("formTitle");

        const formSubtitle =
            document.getElementById("formSubtitle");

        const logoutBtn =
            document.getElementById("logoutBtn");

        const userName =
            document.getElementById("userName");

        const userEmail =
            document.getElementById("userEmail");

        const userPhoto =
            document.getElementById("userPhoto");


        const isLoginPage = Boolean(
            authForm &&
            emailInput &&
            passwordInput &&
            googleBtn &&
            submitBtn
        );


        /* =========================================
           مزود Google
        ========================================= */

        const googleProvider =
            new GoogleAuthProvider();

        googleProvider.setCustomParameters({
            prompt: "select_account"
        });


        /* =========================================
           رسائل الأخطاء
        ========================================= */

        function getFriendlyError(error) {

            console.error(error);

            const errors = {

                "auth/email-already-in-use":
                    "هذا البريد مسجل مسبقًا.",

                "auth/invalid-email":
                    "اكتب بريدًا إلكترونيًا صحيحًا.",

                "auth/weak-password":
                    "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",

                "auth/invalid-credential":
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة.",

                "auth/user-not-found":
                    "لا يوجد حساب بهذا البريد.",

                "auth/wrong-password":
                    "كلمة المرور غير صحيحة.",

                "auth/popup-closed-by-user":
                    "تم إغلاق نافذة تسجيل الدخول بجوجل.",

                "auth/popup-blocked":
                    "المتصفح منع نافذة تسجيل الدخول. اسمح بالنوافذ المنبثقة.",

                "auth/unauthorized-domain":
                    "دومين الموقع غير مضاف داخل Authorized domains.",

                "auth/network-request-failed":
                    "تأكد من اتصال الإنترنت وحاول مرة أخرى.",

                "auth/too-many-requests":
                    "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",

                "auth/operation-not-allowed":
                    "طريقة تسجيل الدخول غير مفعلة داخل Firebase.",

                "auth/api-key-not-valid":
                    "مفتاح Firebase غير صحيح."

            };

            return (
                errors[error.code] ||
                error.message ||
                "حدث خطأ. حاول مرة أخرى."
            );

        }


        /* =========================================
           أكواد صفحة تسجيل الدخول فقط
        ========================================= */

        if (isLoginPage) {

            let registerMode = false;

            function setLoading(loading) {

                googleBtn.disabled = loading;
                submitBtn.disabled = loading;

                if (switchModeBtn) {
                    switchModeBtn.disabled = loading;
                }

                if (loading) {

                    submitBtn.textContent =
                        "Please wait...";

                } else {

                    submitBtn.textContent =
                        registerMode
                            ? "Create Account"
                            : "Login";

                }

            }


            function updateFormMode() {

                clearMessage();

                if (registerMode) {

                    if (formTitle) {
                        formTitle.textContent =
                            "Create Account";
                    }

                    if (formSubtitle) {
                        formSubtitle.textContent =
                            "Create your Gaming World account";
                    }

                    submitBtn.textContent =
                        "Create Account";

                    if (switchQuestion) {
                        switchQuestion.textContent =
                            "Already have an account?";
                    }

                    if (switchModeBtn) {
                        switchModeBtn.textContent =
                            "Login";
                    }

                    passwordInput.autocomplete =
                        "new-password";

                } else {

                    if (formTitle) {
                        formTitle.textContent =
                            "Welcome Back";
                    }

                    if (formSubtitle) {
                        formSubtitle.textContent =
                            "Sign in to continue to your account";
                    }

                    submitBtn.textContent =
                        "Login";

                    if (switchQuestion) {
                        switchQuestion.textContent =
                            "Don't have an account?";
                    }

                    if (switchModeBtn) {
                        switchModeBtn.textContent =
                            "Register";
                    }

                    passwordInput.autocomplete =
                        "current-password";

                }

            }


            /* تبديل Login وRegister */
            if (switchModeBtn) {

                switchModeBtn.addEventListener(
                    "click",
                    function () {

                        registerMode =
                            !registerMode;

                        updateFormMode();

                    }
                );

            }


            /* Login أو Register بالإيميل */
            authForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();

                    clearMessage();
                    setLoading(true);

                    const email =
                        emailInput.value
                            .trim();

                    const password =
                        passwordInput.value;

                    try {

                        if (registerMode) {

                            await createUserWithEmailAndPassword(
                                auth,
                                email,
                                password
                            );

                            showMessage(
                                "تم إنشاء الحساب بنجاح.",
                                "success"
                            );

                        } else {

                            await signInWithEmailAndPassword(
                                auth,
                                email,
                                password
                            );

                            showMessage(
                                "تم تسجيل الدخول بنجاح.",
                                "success"
                            );

                        }

                    } catch (error) {

                        showMessage(
                            getFriendlyError(error)
                        );

                    } finally {

                        setLoading(false);

                    }

                }
            );


            /* Login بجوجل */
            googleBtn.addEventListener(
                "click",
                async function () {

                    clearMessage();
                    setLoading(true);

                    try {

                        await signInWithPopup(
                            auth,
                            googleProvider
                        );

                    } catch (error) {

                        showMessage(
                            getFriendlyError(error)
                        );

                    } finally {

                        setLoading(false);

                    }

                }
            );


            /* Logout */
            if (logoutBtn) {

                logoutBtn.addEventListener(
                    "click",
                    async function () {

                        try {

                            await signOut(auth);

                        } catch (error) {

                            showMessage(
                                getFriendlyError(error)
                            );

                        }

                    }
                );

            }

        }


        /* =========================================
           مراقبة المستخدم في كل الصفحات
        ========================================= */

        onAuthStateChanged(
            auth,
            function (user) {

                /* تحديث زر النافبار */
                if (navbarAuthBtn) {

                    if (user) {

                        let displayName =
                            user.displayName;

                        if (!displayName) {

                            displayName =
                                user.email
                                    ? user.email.split("@")[0]
                                    : "My Account";

                        }

                        navbarAuthBtn.textContent =
                            displayName
                                .split(" ")[0];

                        navbarAuthBtn.href = "profile.html";

                        navbarAuthBtn.classList.add(
                            "user-logged-in"
                        );

                        navbarAuthBtn.title =
                            "Open your account";

                    } else {

                        navbarAuthBtn.textContent =
                            "Login";

                    navbarAuthBtn.href = "login.html";

                        navbarAuthBtn.classList.remove(
                            "user-logged-in"
                        );

                        navbarAuthBtn.title =
                            "Login";

                    }

                }


                /* تحديث صفحة Login */
                if (!isLoginPage) return;

                if (user) {

                    if (authPanel) {
                        authPanel.classList.add(
                            "hidden"
                        );
                    }

                    if (userPanel) {
                        userPanel.classList.add(
                            "show"
                        );
                    }

                    if (userName) {

                        userName.textContent =
                            user.displayName ||
                            (
                                user.email
                                    ? user.email.split("@")[0]
                                    : "Gaming World User"
                            );

                    }

                    if (userEmail) {

                        userEmail.textContent =
                            user.email || "";

                    }

                    if (userPhoto) {

                        userPhoto.src =
                            user.photoURL ||
                            "favicon.png";

                        userPhoto.onerror =
                            function () {
                                this.src =
                                    "favicon.png";
                            };

                    }

                } else {

                    if (userPanel) {
                        userPanel.classList.remove(
                            "show"
                        );
                    }

                    if (authPanel) {
                        authPanel.classList.remove(
                            "hidden"
                        );
                    }

                    authForm.reset();

                }

            }
        );

    } catch (error) {

        console.error(
            "Firebase loading error:",
            error
        );

        showMessage(
            "تعذر تحميل Firebase. تأكد من الإنترنت ومن رفع app.js بشكل صحيح."
        );

    }

}
