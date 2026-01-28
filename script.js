// Write JavaScript here
// script.js

(function () {
  const button = document.getElementById('rsvp-button');
  const form = document.getElementById('rsvp-form');
  const submitButton = document.getElementById('rsvp-submit');
  const nameInput = document.getElementById('rsvp-name');
  const starterSelect = document.getElementById('starter-choice');
  const mainSelect = document.getElementById('main-choice');
  const dessertSelect = document.getElementById('dessert-choice');
  const dietaryInput = document.getElementById('rsvp-dietary');

  if (!button || !form || !submitButton || !nameInput || !starterSelect || !mainSelect || !dessertSelect) return;

  const comingInputs = form.querySelectorAll('input[name="coming"]');

  function updateSubmitVisibility() {
    const comingSelected = form.querySelector('input[name="coming"]:checked');
    const nameFilled = nameInput.value.trim().length > 0;

    if (comingSelected && nameFilled) {
      submitButton.removeAttribute('hidden');
    } else {
      submitButton.setAttribute('hidden', '');
    }
  }

  comingInputs.forEach(function (input) {
    input.addEventListener('change', updateSubmitVisibility);
  });
  nameInput.addEventListener('input', updateSubmitVisibility);

  button.addEventListener('click', function () {
    const isHidden = form.hasAttribute('hidden');
    if (isHidden) {
      form.removeAttribute('hidden');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      form.setAttribute('hidden', '');
    }
  });

  // --- THE FIX IS HERE ---
  submitButton.addEventListener('click', function () {
    const comingSelected = form.querySelector('input[name="coming"]:checked');
    const name = nameInput.value.trim();
    const starter = starterSelect.value;
    const main = mainSelect.value;
    const dessert = dessertSelect.value;
    const dietary = dietaryInput ? dietaryInput.value.trim() : '';

    if (!comingSelected || !name) {
      return;
    }

    // Disable the button so they don't click it twice
    submitButton.disabled = true;
    submitButton.innerText = "Sending...";

    const payload = {
      coming: comingSelected.value,
      name: name,
      starter: starter,
      main: main,
      dessert: dessert,
      dietary: dietary
    };

    // The fetch MUST be inside the click event listener
    fetch('https://script.google.com/macros/s/AKfycbymxvN_ygtbWr82L88wxM6anJVWCGTxqMynezcbvvKT7lZJpnLSlxvMnvr1okqsKZlS/exec', {
      method: 'POST',
      mode: 'no-cors', // Essential for Google Apps Script from a static site
      headers: {
        'Content-Type': 'text/plain' // Avoids CORS preflight
      },
      body: JSON.stringify(payload)
    })
    .then(function() {
      // With 'no-cors', we assume success if the catch block isn't hit
      alert('Thank you for your RSVP, ' + name + '!');
      form.setAttribute('hidden', '');
      button.innerText = "RSVP Sent!";
      button.disabled = true;
    })
    .catch(function (error) {
      console.error('[RSVP] Error:', error);
      alert('There was a problem sending your RSVP. Please try again.');
      submitButton.disabled = false;
      submitButton.innerText = "Submit";
    });
  });
})();

const canvas = document.getElementById('blossomCanvas');
const ctx = canvas.getContext('2d');
const treeElement = document.getElementById('cherry-tree');

let petals = [];

// Match canvas size to window size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Petal {
    constructor(startX, startY) {
        this.x = startX + (Math.random() * 100 - 50); // Spawn near tree center
        this.y = startY ;
        this.size = Math.random() * 8 + 3;
        this.speedY = Math.random() * 1.0 + 1;
        this.speedX = Math.random() * 3 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 1.5;
        this.opacity = 0.6;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.5; // Sway motion
        this.rotation += this.rotationSpeed;
        
        // Start fading out as they hit the bottom
        if (this.y > canvas.height * 0.8) {
            this.opacity -= 0.01;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.beginPath();
        // A simple petal shape
        ctx.ellipse(0, 0, this.size, this.size / 1.5, 0, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 192, 203, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
    }
}

// Event: Create petals on scroll
window.addEventListener('scroll', () => {
    const rect = treeElement.getBoundingClientRect();
    const treeCenterX = rect.left + rect.width / 2;
    const treeCenterY = rect.top + rect.height / 2;

    // Create 5 petals for every scroll "tick"
    for (let i = 0; i < 5; i++) {
        petals.push(new Petal(treeCenterX, treeCenterY));
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = petals.length - 1; i >= 0; i--) {
        petals[i].update();
        petals[i].draw();

        // Clean up memory
        if (petals[i].opacity <= 0 || petals[i].y > canvas.height) {
            petals.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);
}

animate();