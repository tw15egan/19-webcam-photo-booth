const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
// const camera = document.querySelector('.takePhoto');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch((err) => {
      console.error('OH NO!', err); // eslint-disable-line no-console
    });
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100;
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }

  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0];
    pixels.data[i + 100] = pixels.data[i + 1];
    pixels.data[i - 150] = pixels.data[i + 2];
  }

  return pixels;
}

function paintCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // Get pixels
    let pixels = ctx.getImageData(0, 0, width, height);
    // Mess with pixels
    pixels = rgbSplit(pixels);
    ctx.globalAlpha = 0.1;
    // Put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // Play the sound
  snap.currentTime = 0;
  snap.play();

  // Take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'photobooth');
  link.innerHTML = `<img src="${data}" alt="photobooth" />`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();

canvas.addEventListener('click', takePhoto);
video.addEventListener('canplay', paintCanvas);

