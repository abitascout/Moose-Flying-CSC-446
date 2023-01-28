var parsedUrl = new URL(window.location.href);


const Access = async(x) =>{
    const searchParams = new URL (parsedUrl).searchParams;
    const entries = new URLSearchParams(searchParams).entries();
    const array = Array.from(entries);
    let obj = {
        logId: array[0][1],
        input: x
    }

    const response = await fetch ("http://" + parsedUrl.host + "/checking",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
    const data = response.text();
    if(response.status == 401)
    {
        alert("Wrong Access Token. Try again.")
        return
    }
    if(response.status == 402)
    {
        alert(data)
        return
    }
    
    return data
}

const beforeAccess = async () =>{
    let inputs = document.getElementById("input").value
    const data = await Access(inputs);
    if(data != "undefined"){
        console.log(data)}
}