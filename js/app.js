/* =========================================
   GAMING WORLD - MAIN JS + FIREBASE LOGIN
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       أكواد الموقع الأساسية
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
            scrollTopBtn.classList.toggle("show", window.scrollY > 400);
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

        const searchValue = searchInput.value.trim().toLowerCase();

        if (searchValue.includes("pubg")) {

            window.location.href = "pubg.html";

        } else if (
            searchValue.includes("call of duty") ||
            searchValue.includes("cod")
        ) {

            window.location.href = "callofduty.html";

        } else if (searchValue.includes("minecraft")) {

            window.location.href = "minecraft.html";

        } else if (searchValue !== "") {

            window.location.href = "games.html";

        }

    }

    if (searchBtn && searchInput) {

        searchBtn.addEventListener("click", searchGames);

        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                searchGames();
            }

        });

    }

    /* تشغيل Firebase فقط داخل صفحة تسجيل الدخول */
    if (document.getElementById("authForm")) {
        startFirebaseAuthentication();
    }

});


/* =========================================
   FIREBASE AUTHENTICATION
========================================= */

async function startFirebaseAuthentication() {

    const messageBox = document.getElementById("message");

    function showMessage(text, type = "error") {

        if (!messageBox) return;

        messageBox.textContent = text;
        messageBox.className = "message show " + type;

    }

    function clearMessage() {

        if (!messageBox) return;

        messageBox.textContent = "";
        messageBox.className = "message";

    }

    try {

        const firebaseAppModule = await import(
            "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js"
        );

        const firebaseAuthModule = await import(
            "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js"
        );

        const {
            initializeApp
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


        /* إعدادات Firebase */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyCYHAl_dOrtYyueGNonoRcy9oCE4Fch1dE",

  authDomain: "gaming-world-org.firebaseapp.com",

  projectId: "gaming-world-org",

  storageBucket: "gaming-world-org.firebasestorage.app",

  messagingSenderId: "932070061125",

  appId: "1:932070061125:web:47df23dc594be00bd09f2c",

  measurementId: "G-MB0PQCM0DR"

};


        /* تشغيل Firebase */
        const firebaseApp = initializeApp(firebaseConfig);

        const auth = getAuth(firebaseApp);

        await setPersistence(auth, browserLocalPersistence);


        /* تسجيل الدخول بجوجل */
        const googleProvider = new GoogleAuthProvider();

        googleProvider.setCustomParameters({
            prompt: "select_account"
        });


        /* عناصر صفحة تسجيل الدخول */
        const authPanel = document.getElementById("authPanel");
        const userPanel = document.getElementById("userPanel");

        const authForm = document.getElementById("authForm");

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const googleBtn = document.getElementById("googleBtn");
        const submitBtn = document.getElementById("submitBtn");

        const switchModeBtn = document.getElementById("switchModeBtn");
        const switchQuestion = document.getElementById("switchQuestion");

        const formTitle = document.getElementById("formTitle");
        const formSubtitle = document.getElementById("formSubtitle");

        const logoutBtn = document.getElementById("logoutBtn");

        const userName = document.getElementById("userName");
        const userEmail = document.getElementById("userEmail");
        const userPhoto = document.getElementById("userPhoto");


        if (
            !authForm ||
            !emailInput ||
            !passwordInput ||
            !googleBtn ||
            !submitBtn
        ) {

            console.error("بعض عناصر صفحة تسجيل الدخول غير موجودة.");
            return;

        }


        let registerMode = false;


        /* رسائل الأخطاء */
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
                    "المتصفح منع النافذة المنبثقة. اسمح بالنوافذ المنبثقة.",

                "auth/unauthorized-domain":
                    "دومين الموقع غير مضاف داخل Authorized domains.",

                "auth/network-request-failed":
                    "تأكد من اتصال الإنترنت وحاول مرة أخرى.",

                "auth/too-many-requests":
                    "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى."

            };

            return errors[error.code] ||
                "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.";

        }


        /* تعطيل الأزرار أثناء التحميل */
        function setLoading(loading) {

            googleBtn.disabled = loading;
            submitBtn.disabled = loading;

            if (switchModeBtn) {
                switchModeBtn.disabled = loading;
            }

            if (loading) {

                submitBtn.textContent = "Please wait...";

            } else {

                submitBtn.textContent =
                    registerMode ? "Create Account" : "Login";

            }

        }


        /* التبديل بين تسجيل الدخول وإنشاء الحساب */
        function updateFormMode() {

            clearMessage();

            if (registerMode) {

                if (formTitle) {
                    formTitle.textContent = "Create Account";
                }

                if (formSubtitle) {
                    formSubtitle.textContent =
                        "Create your Gaming World account";
                }

                submitBtn.textContent = "Create Account";

                if (switchQuestion) {
                    switchQuestion.textContent =
                        "Already have an account?";
                }

                if (switchModeBtn) {
                    switchModeBtn.textContent = "Login";
                }

                passwordInput.autocomplete = "new-password";

            } else {

                if (formTitle) {
                    formTitle.textContent = "Welcome Back";
                }

                if (formSubtitle) {
                    formSubtitle.textContent =
                        "Sign in to continue to your account";
                }

                submitBtn.textContent = "Login";

                if (switchQuestion) {
                    switchQuestion.textContent =
                        "Don't have an account?";
                }

                if (switchModeBtn) {
                    switchModeBtn.textContent = "Register";
                }

                passwordInput.autocomplete = "current-password";

            }

        }


        if (switchModeBtn) {

            switchModeBtn.addEventListener("click", function () {

                registerMode = !registerMode;

                updateFormMode();

            });

        }


        /* تسجيل الدخول أو إنشاء الحساب بالإيميل */
        authForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            clearMessage();
            setLoading(true);

            const email = emailInput.value.trim();
            const password = passwordInput.value;

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

                showMessage(getFriendlyError(error));

            } finally {

                setLoading(false);

            }

        });


        /* تسجيل الدخول باستخدام Google */
        googleBtn.addEventListener("click", async function () {

            clearMessage();
            setLoading(true);

            try {

                await signInWithPopup(
                    auth,
                    googleProvider
                );

            } catch (error) {

                showMessage(getFriendlyError(error));

            } finally {

                setLoading(false);

            }

        });


        /* تسجيل الخروج */
        if (logoutBtn) {

            logoutBtn.addEventListener("click", async function () {

                try {

                    await signOut(auth);

                } catch (error) {

                    showMessage(getFriendlyError(error));

                }

            });

        }


        /* مراقبة حالة تسجيل الدخول */
        onAuthStateChanged(auth, function (user) {

            if (user) {

                if (authPanel) {
                    authPanel.classList.add("hidden");
                }

                if (userPanel) {
                    userPanel.classList.add("show");
                }

                if (userName) {

                    userName.textContent =
                        user.displayName ||
                        "Gaming World User";

                }

                if (userEmail) {

                    userEmail.textContent =
                        user.email || "";

                }

                if (userPhoto) {

                    userPhoto.src =
                        user.photoURL ||
                        "favicon.png";

                }

            } else {

                if (userPanel) {
                    userPanel.classList.remove("show");
                }

                if (authPanel) {
                    authPanel.classList.remove("hidden");
                }

                authForm.reset();

            }

        });

    } catch (error) {

        console.error("Firebase loading error:", error);

        showMessage(
            "تعذر تحميل Firebase. تأكد من رفع app.js بشكل صحيح ثم حدّث الصفحة."
        );

    }

}
