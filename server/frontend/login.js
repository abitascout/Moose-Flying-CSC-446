async function login() {
    await fetch("http://" + parsedUrl + "/login", {
        method: "GET",
        mode: "no-cors", 
        //redirect: "http://" + parsedUrl.host + "/query"
    })
    .then((resp) => resp.text())
    .then((data) => {
        
        document.getElementById("response").innerHTML = data[1];
    })
    .catch((err) => {
        console.log(err);
    })
}