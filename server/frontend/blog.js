var parsedUrl = new URL(window.location.href);

function leave(){
    window.location.replace("http://" + parsedUrl.host)
}