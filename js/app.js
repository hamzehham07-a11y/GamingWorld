document.addEventListener("DOMContentLoaded", function () {

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

});
