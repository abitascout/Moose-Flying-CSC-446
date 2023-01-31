var parsedUrl = new URL(window.location.href);

const query = async(x) =>{
    const searchParams = new URL (parsedUrl).searchParams;
    const entries = new URLSearchParams(searchParams).entries();
    const array = Array.from(entries);
    let obj = {
        token: array[0][1],
        acc: array[1][1],
        user: array[2][1],
        params: x
    }
    const response = await fetch ("http://" + parsedUrl.host + "/query",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });

    if(response.status == 401)
    {
        alert("Token expired or Access Denied! Click Exit then Log back in")
        return
    }
    else if(response.status == 420)
    {
        alert("Access denied! Get Higher Clearance")
        return
    }
    else{
        console.log(response.status)
    }
    const data = response.text();
    
    
    return data
}
const beforequery = async (x) =>{
    document.getElementById("response").innerHTML = ""
    const data = await query(x);
    if(data != "undefined"){
        document.getElementById("response").innerHTML = data}
}

function leave(){
    window.location.replace("http://" + parsedUrl.host)
}