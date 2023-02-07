var parsedUrl = new URL(window.location.href);



const getComments = async() => {

    const response = await fetch ("http://" + parsedUrl.host + "/getComments",{
        method: "GET",
    });

    if(response.status == 401){
        alert("Database error")
        return
    }

    
    const data = response.json()

    return data

}

const beforeGetComments = async() => {
    const info = await getComments();
    var cm = document.getElementById("insertCommentsHere")
    cm.innerHTML = "";
    for(var i = 0; i < info.v1.length; i++){
        let child = document.createTextNode(info.v1[i].Comm)
        cm.appendChild(child)
        cm.appendChild(document.createElement("br"))
    }
    //document.getElementById("displaycomments").innerHTML = info.v1[0].Comm
}

setInterval(beforeGetComments, 100);
function leave(){
    window.location.replace("http://" + parsedUrl.host)
}