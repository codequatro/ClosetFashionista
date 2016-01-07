navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
window.URL = window.URL || window.webkitURL;

var video = document.getElementById('live');
var canvas = document.getElementById('photo').getContext('2d');
var countown_sec = 3;
var feed;


function gotStream(stream) {
  feed = stream;
  photo.width = 0;
  photo.height = 0;
  video.src = window.URL.createObjectURL(feed);
}

function countdown(){
  document.getElementById("countdown").innerHTML = countown_sec;

  (function tick(){
    setTimeout(function(){
      document.getElementById("countdown").innerHTML = parseInt(document.getElementById("countdown").innerHTML)-1;
      if(document.getElementById("countdown").innerHTML !== "0") tick();
      else{
        document.getElementById("cam").remove();
        capture();
      }
    },1000)
  })()
}

function capture() {  
  var context = photo.getContext('2d');
  photo.width = 640;
  photo.height = 480;
  context.drawImage(video, 0, 0, 640, 480);

  var data = photo.toDataURL('image/jpeg');
  window.captured = data;
  video.remove();
  var image = new Image();
  image.src = data;
  canvas.drawImage(image,0,0);
  feed.getVideoTracks()[0].stop();
}


function init() {
  navigator.getUserMedia({video: true}, gotStream, function(){});
};