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

    let obj = {
        token: array[0][1],
    }

    fetch ("http://" + parsedUrl.host + "/valid",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        

    }).then((resp) => { 
        if(resp.status == 401)
        {
            alert("Token expired please click exit and log in again")
            return
        }
    })
    .then(query())
    .catch((err) =>{
        
        console.log(err)
    })
    
}

function leave(){
    window.location.replace("http://" + parsedUrl.host)
}