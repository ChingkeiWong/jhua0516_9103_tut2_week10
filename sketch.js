// Declare global variables
let song;     // To store the audio object
let fft;      // FFT 
let waveform; // To store waveform data
let stars = []; // Array to store star objects

// Preload the audio file
function preload() {
  song = loadSound("audio/samplevisualisation.mp3");
}

function setup() {
  // Create the canvas
  createCanvas(1000, 700, WEBGL);
  colorMode(HSB); // Use color mode HSB
  fft = new p5.FFT(); // Create an FFT object
  waveform = fft.waveform(); // Get audio waveform data
  console.log(waveform);

  // Check if the user has interacted with the screen
  if (getAudioContext().state !== 'running') {
    background(0);
    fill(255);
    text('Tap here to start sound playback', 10, 20, width - 20);
  }
}

function draw() {
  // Don't draw if the audio context is not running
  if (getAudioContext().state !== 'running') {
    return;
  }

  background(0);
  waveform = fft.waveform(); // Get audio waveform data
  rotateX(PI / 3);

  let r = width * 0.3;

  for (let a = 0; a < TWO_PI; a += PI / 25) {
    let index = int(map(a, 0, TWO_PI, 0, 1024));
    let curH = abs(300 * waveform[index]);
    let x = r * cos(a);
    let y = r * sin(a);

    push();
    translate(x, y, curH / 2);
    rotateX(PI / 2);
    let c1 = color(170, 245, 255); // Light blue
    let c2 = color(255, 185, 185); // Light red
    let rate = map(a, 0, TWO_PI, 0, 0.5);
    let col = lerpColor(c1, c2, rate); // Color gradient
    stroke(col);
    cylinder(10, 5 + curH);
    pop();

    for (let k = 0; k < 10; k++) {
      if (random(0.01, 1) < waveform[index]) {
        stars.push(new Star(x, y, 5 + curH, col)); // Create star objects and add to the array
      }
    }
  }

  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].move(); // Move stars
    stars[i].show(); // Display stars
    if (stars[i].z > 500) {
      stars.splice(i, 1); // Remove stars from the array if they go out of range
    }
  }
}

// Constructor function for star objects
function Star(x, y, z, col) {
  this.x = x + random(-2, 2); // X coordinate
  this.y = y + random(-2, 2); // Y coordinate
  this.z = z; // Z coordinate
  this.col = col; // Color
  this.life = 500; // Lifetime
  this.speedX = random(-0.3, 0.3); // X-axis speed
  this.speedY = random(-0.3, 0.3); // Y-axis speed
  this.speedZ = 0.05 + (z - 5) / 15; // Z-axis speed

  // Move the star
  this.move = function() {
    this.z += this.speedZ;
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
  };

  // Display the star
  this.show = function() {
    push();
    let a = map(this.life, 0, 500, 0, 1);
    stroke(hue(this.col), saturation(this.col), brightness(this.col));
    strokeWeight(1);
    point(this.x, this.y, this.z);
    pop();
  };
}

// Toggle music play state and background color when the mouse is pressed
function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
    background(255, 0, 0); // Red background
  } else {
    song.play();
    background(0, 255, 0); // Green background
  }
}
