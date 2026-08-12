const form = document.getElementById("form");


form.addEventListener("submit", function(event) {
    event.preventDefault();

    form.style.display = "none";

    form.insertAdjacentHTML(
        "afterend",
        `<h2 style="color: darkblack; text-align: center;">
             Message Sent Successfully!
        </h2>`
    );
});



