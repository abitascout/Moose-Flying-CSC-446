var parsedUrl = new URL(window.location.href);

const query = async() =>{
    const searchParams = new URL (parsedUrl).searchParams;
    const entries = new URLSearchParams(searchParams).entries();
    const array = Array.from(entries);

    let obj = {
        token: array[0][1],
        acc: array[1][1], 
        user: array[2][1]
    }
    const response = await fetch ("http://" + parsedUrl.host + "/query",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });

    if(response.status == 401)
    {
        alert("Token expired please click exit and log in again")
        return
    }
    const data = response.text();
    
    
    return data
}
const beforequery = async () =>{
    document.getElementById("response").innerHTML = ""
    const data = await query();
    if(data != "undefined"){
        console.log(data)
        document.getElementById("response").innerHTML = data}
}

function leave(){
    window.location.replace("http://" + parsedUrl.host)
}