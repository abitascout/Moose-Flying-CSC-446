var parsedUrl = new URL(window.location.href);

var SHA256 = require("crypto-js/sha256");

function login() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const encryptedpassword = SHA256(password);
    fetch("http://" + parsedUrl + "/login", {
        method: "GET",
        mode: "no-cors", 
        params: username, encryptedpassword
    })
    .then((resp) => resp.text())
    .then((data) => {
        
        console.log(data);
        document.getElementById("response").innerHTML = data;
    })
    .catch((err) => {
        console.log(err);
    })
}