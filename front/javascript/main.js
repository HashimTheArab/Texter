
let username = "";
let ip = 'hashim.ml'; // make sure to change this to your ip or the ip of whatever you're hosting it on
let socket = new WebSocket(`ws://${ip}/ws`);

socket.onopen = function(){
  console.log("Socket Connected!");
};

socket.onmessage = function(ev) {
    document.getElementById('texts').innerHTML += (ev.data + "<br>");
};

function selectName(){
    const name = document.getElementById('chooseName');
    const button = document.getElementById('confirmName');
    if(name.value.trim().length < 1 || name.value.length > 30){
        //document.getElementById('shortWarning').innerHTML = "Your name must between 1-30 characters!";
        return;
    }
    button.style.display = "none";
    name.placeholder = "Send a Message!";
    document.getElementById('shownName').innerHTML = 'Your Name: ' + name.value;
    name.spellcheck = true;
    /*name.addEventListener("input", function(){
        if(username !== ""){
            socket.send(`${username} (Typing): ${name.value}`);
        }
    });*/
    name.addEventListener("keydown", function(event){
        if(event.code === "Enter" && username !== "" && name.value !== ""){
            socket.send(`${username}: ${name.value} - ${new Date().toLocaleString("en-US", { dataStyle: "full", timeStyle: "short"})}`);
            name.value = "";
        }
    });
    username = name.value;
    name.value = "";
    socket.send("<br><div style='color: lightseagreen; background-color: aquamarine'>" + username + " has connected!</div>");
    socket.send(`<div style='color: red; background-color: aquamarine'> ${username}'s screen resolution is ${screen.width}x${screen.height} (color depth: ${screen.pixelDepth} | pixel depth: ${screen.pixelDepth} | orientation: ${screen.orientation.type}) </div>`);
}

function sends(){
    socket.send(document.getElementById('chooseName').value);
}
