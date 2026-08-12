const username = document.getElementById("username");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
 

function submitValues(event){
    event.preventDefault();
    if(username.value == "Habiba" && password.value == "12345"){
        window.location.href = "Home.html";

    }
    else{
        alert("please add correct email and password");

    }
}
submitBtn.addEventListener("click", submitValues);