var parsedUrl = new URL(window.location.href);



function login() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    fetch("http://" + parsedUrl + "/login", {
        method: "GET",
        mode: "no-cors", 
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