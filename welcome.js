document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("name-btn");
    const button = document.getElementById("submit");
    const usernameDisplay = document.querySelector('.username');

    // === LOGIN PAGE LOGIC ===
    if (input && button) {
        button.addEventListener("click", () => {
            const name = input.value.trim();
            if (name !== "") {
                alert(`Welcome, ${name}!`);
                localStorage.setItem("name", name);
                window.location.href = "index.html"; // change if needed
            } else {
                alert("Please enter your name.");
            }
        });
    }

    // === HOME PAGE LOGIC ===
    if (usernameDisplay) {
        const username = localStorage.getItem('name');
        usernameDisplay.textContent = `${username}`;
        
    }

    const co2PerSecond = 1320; // average tons per second globally
    const counter = document.getElementById("co2-counter");
    let total = 0;

    setInterval(() => {
        total += co2PerSecond;
        counter.textContent = total.toLocaleString() + " tons";
    }, 1000);
});
