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
    console.log(array);
    /* fetch ("http://" + parsedUrl.host + "/query"),{
        method: "POST",

    } */
}

function valid(){
    validating();
}