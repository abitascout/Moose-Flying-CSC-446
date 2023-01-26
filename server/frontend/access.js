var parsedUrl = new URL(window.location.href);


const Access = async() =>{
    const searchParams = new URL (parsedUrl).searchParams;
    const entries = new URLSearchParams(searchParams).entries();
    const array = Array.from(entries);
    let obj = {
        logId: array[0][1]
    }

    const response = await fetch ("http://" + parsedUrl.host + "/checking",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });

    if(response.status == 401)
    {
        alert("Wrong Access Token. Try again.")
        return
    }
    const data = response.text();
    return data
}

const beforeAcces = async () =>{
    const data = await Access();
    if(data != "undefined"){
        console.log(data)}
}