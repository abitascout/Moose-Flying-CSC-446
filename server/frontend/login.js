var parsedUrl = new URL(window.location.href);

function Blog(){
    window.location.replace("http://" + parsedUrl.host+ "/Blog.html")
}