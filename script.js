// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById("user-image");
const context = canvas.getContext("2d");

let image_input = document.getElementById("image-input");
let textTop = document.getElementById("text-top");
let textBottom = document.getElementById("text-bottom");

let generate = document.querySelector("[type='submit']");
let clear = document.querySelector("[type='reset']");
let readText = document.querySelector("[type='button']");

let form = document.getElementById("generate-meme");

let voice_selection = document.getElementById("voice-selection");
voice_selection.disabled = false;
let volume_group = document.getElementById("volume-group");
let range = document.querySelector("[type='range']");
let volIcon = document.querySelector(".img");





// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
context.clearRect(0,0,canvas.width, canvas.height);

generate.disabled = false;
clear.disabled = true;
readText.disabled = true;

context.fillStyle = 'black';
context.fillRect(0,0, canvas.width, canvas.height);


let dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
context.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);

});

image_input.addEventListener('change',() => {
  let input = image_input.files[0];
  img.src = URL.createObjectURL(input);
  img.alt = input.name;


});



form.addEventListener('submit',(event) => {
  event.preventDefault();
  context.font = "25px Arial";
  context.fillStyle = 'white';
  context.textAlign = 'center';

  context.strokeText(textTop.value, canvas.width/2,30);
  context.strokeText(textBottom.value, canvas.width/2, 60);

  generate.disabled = true;
  clear.disabled = false;
  readText.disabled = false;

});

clear.addEventListener('click',() =>{
  context.clearRect(0,0,canvas.width, canvas.height);
  textTop.value = "";
  textBottom.value = "";

  generate.disabled = false;
  clear.disabled = true;
  readText.disabled = true;

});

let synth = window.speechSynthesis;
var voices = [];
let vol = synth.volume;
vol = 2;



  voices = synth.getVoices();

  for(let i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }



readText.addEventListener('click',() => {
  let readTop = new SpeechSynthesisUtterance(textTop);
  let readBottom = new SpeechSynthesisUtterance(textBottom);
  let selection = voice_selection.selectedOptions[0].getAttribute('data-name');
  for (let i = 0; i < voices.length; i++){
    if (voices[i].name == selection){
      readTop.voice = voices[i];
      readBottom.voice = voices[i];
    }
  }
  synth.speak(readTop);
  synth.speak(readBottom);



});

volume_group.addEventListener('input',() => {
  if (range.value <= 1){
    vol = 0;
    volIcon.src = "icons/volume-level-0.svg";

  } else if (range.value <= 33) {
    vol = 2;
    volIcon.src = "icons/volume-level-1.svg";
  } else if (range.value <= 66){
    vol = 4;
    volIcon.src = "icons/volume-level-2.svg";
  } else{
    vol = 6;
    volIcon.src = "icons/volume-level-3.svg";
  }

});





/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

