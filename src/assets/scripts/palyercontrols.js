function playPause() { 
    var video = document.getElementById("player");
    if (video.paused) 
        video.play(); 
    else 
        video.pause(); 
}
function reload() { 
    var video = document.getElementById("player");
    video.load(); 
}
function makeLarge() { 
    var video = document.getElementById("player");
    video.width = 1000; 
}
function makeSmall() { 
    var video = document.getElementById("player");
    video.width = 250; 
} 
function makeNormal() { 
    var video = document.getElementById("player");
    video.width = 500; 
} 