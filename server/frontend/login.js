async function login() {
    await fetch("http://" + parsedUrl + "/index", {
        method: "GET",
        mode: "no-cors", 
        //redirect: "http://" + parsedUrl.host + "/query"
    })
    .then((resp) => resp.text())
    .then((data) => {
        
        document.getElementById("response").innerHTML = data;
    })
    .catch((err) => {
        console.log(err);
    })
}