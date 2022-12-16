var parsedUrl = new URL(window.location.href);

const username = document.getElementById("username");

const password = document.getElementById("password");

function login() {
    fetch("http://" + parsedUrl + "/login", {
        method: "GET",
        mode: "no-cors", 
        //redirect: "http://" + parsedUrl.host + "/query"
    })
    .then((resp) => resp.text())
    .then((data) => {
        
        console.log(data[1]);
    })
    .catch((err) => {
        console.log(err);
    })
}