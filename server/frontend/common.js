var parsedUrl = new URL(window.location.href);

function query() {
    fetch("http://" + parsedUrl.host + "/query", {
        method: "GET",
        mode: "no-cors",
    })
    .then((resp) => resp.text())
    .then((data) => {
        document.getElementById("response").innerHTML = data;
    })
    .catch((err) => {
        console.log(err);
    })
}

function validating(){
    const searchParams = new URL (parsedUrl).searchParams;
    const entries = new URLSearchParams(searchParams).entries();
    const array = Array.from(entries);
    console.log(array[0][1])
    let obj = {
        token: array[0][1],
        acc: array[1][1]
    }

    fetch ("http://" + parsedUrl.host + "/valid",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        

    }).then((resp) => { 
        if(!resp.ok){
        // send to logign
        alert("Token expired please log in again")
        }
        console.log(resp)
    })
    .then(query())
    .catch((err) =>{
        console.log(err)
    })
    
}

function valid(){
    validating();
}