var parsedUrl = new URL(window.location.href);



function login() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    fetch("http://" + parsedUrl + "/login", {
        method: "POST",
        mode: "no-cors", 
        params: username, password
    })
    .then((resp) => resp.text())
    .then((data) => {
        
        console.log(data);
        document.getElementById("response").innerHTML = data;
        if(data == "Valid")
        {
            window.location = "http://" + parsedUrl + "/main.html"
        }
    })
    .catch((err) => {
        console.log(err);
    })
}