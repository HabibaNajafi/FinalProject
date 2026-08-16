const form = document.getElementById("form");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const inputs = form.querySelectorAll("input, textarea, select");

    let isEmpty = false;

    inputs.forEach(function(input) {
        if (input.value.trim() === "") {
            isEmpty = true;
        }
    });

    if (isEmpty) {
        alert("Please fill in all the fields before submitting.");
        return;
    }

    form.style.display = "none";

    form.insertAdjacentHTML(
        "afterend",
        `<h2 style="color: darkgreen; text-align: center;">
            Message Sent Successfully!
        </h2>`
    );
});