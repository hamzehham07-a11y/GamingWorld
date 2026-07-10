const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
});

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("show", window.scrollY > 400);
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function searchGames() {
    const searchValue = searchInput.value.trim().toLowerCase();

    const games = document.querySelectorAll(".game-card");

    let found = false;

    games.forEach((game) => {
        const gameName = game.querySelector("h3").textContent.toLowerCase();

        if (gameName.includes(searchValue)) {
            game.style.display = "block";
            found = true;
        } else {
            game.style.display = "none";
        }
    });

    if (searchValue === "") {
        games.forEach((game) => {
            game.style.display = "block";
        });
    }

    if (!found && searchValue !== "") {
        alert("Game not found");
    }
}

searchBtn.addEventListener("click", searchGames);

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchGames();
    }
});