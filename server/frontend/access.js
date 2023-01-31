var parsedUrl = new URL(window.location.href);


const Access = async(x) =>{
    const searchParams = new URL (parsedUrl).searchParams;
    const entries = new URLSearchParams(searchParams).entries();
    const array = Array.from(entries);
    let obj = {
        logId: array[0][1],
        input: x
    }
    // send the logid to the server to see if user successfully logged in and has correct access code
    const response = await fetch ("http://" + parsedUrl.host + "/checking",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
    const data = response.text();
    console.log(data)
    if(response.status == 401)
    {
        alert("Wrong Access Token. Try again.")
        return "Invalid token"
    }
    if(response.status == 402)
    {
        alert("Invaild Login redirecting to login page")
        return data
    }
    
    return data
}

const beforeAccess = async () =>{
    let inputs = document.getElementById("input").value
    const data = await Access(inputs);
    console.log(data)
    if(data != "Invalid token"){
        window.location.replace("http://" + parsedUrl.host+ data)}
}