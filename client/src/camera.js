navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
window.URL = window.URL || window.webkitURL;

var video = document.getElementById('live');
var canvas = document.getElementById('photo').getContext('2d');
var feed;


function gotStream(stream) {
  feed = stream;
  photo.width = 0;
  photo.height = 0;
  video.src = window.URL.createObjectURL(feed);
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
  navigator.getUserMedia({video: true}, gotStream, capture);
};