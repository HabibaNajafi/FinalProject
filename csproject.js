const cards = document.querySelectorAll(".testimonial-card");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let start = 0;

function showCards() {
    cards.forEach(card => {
        card.style.display = "none";
    });

    for (let i = start; i < start + 3 && i < cards.length; i++) {
        cards[i].style.display = "block";
    }
}

nextBtn.addEventListener("click", () => {
    if (start < cards.length - 3) {
        start++; // move only one card forward
        showCards();
    }
});

prevBtn.addEventListener("click", () => {
    if (start > 0) {
        start--; // move only one card backward
        showCards();
    }
});

showCards();
const modal = document.getElementById("bookingModal");
const openBtn = document.getElementById("plan");
const closeBtn = document.getElementById("closeModal");

openBtn.addEventListener("click", function(e){
    e.preventDefault();
    modal.style.display = "block";
});

closeBtn.addEventListener("click", function(){
    modal.style.display = "none";
});

window.addEventListener("click", function(e){
    if(e.target === modal){
        modal.style.display = "none";
    }
});

const planBtn = document.getElementById("plan");

console.log(planBtn);

planBtn.addEventListener("click", function(e){
    e.preventDefault();
    alert("Working");
});