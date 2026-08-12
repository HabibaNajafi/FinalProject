```javascript
const modal = document.getElementById("bookingModal");
const closeModal = document.getElementById("closeModal");
const selectedHotel = document.getElementById("selectedHotel");
const bookingForm = document.getElementById("bookingForm");

const bookButtons = document.querySelectorAll(".pricebook button");

bookButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Find the hotel name
        const hotelCard = button.closest(".hotelcard");
        const hotelName = hotelCard.querySelector("h3").textContent;

        // Show hotel name in modal
        selectedHotel.textContent = "Booking: " + hotelName;

        // Open modal
        modal.style.display = "block";
    });

});

// Close modal
closeModal.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close modal when clicking outside the box
window.addEventListener("click", function(event) {

    if (event.target === modal) {
        modal.style.display = "none";
    }

});

// Submit booking
bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Your booking has been submitted successfully!");

    modal.style.display = "none";

    bookingForm.reset();
});
```
