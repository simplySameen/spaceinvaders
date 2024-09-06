const spaceship = document.getElementById('spaceship');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const healthBlocks = document.querySelectorAll('.healthBlock'); // New line
let spaceshipPosition = 180;
let score = 0;
let timeLeft = 180;
let health = 5; // Tracks remaining health blocks
let gameInterval;
let invaderInterval;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && spaceshipPosition > 0) {
    spaceshipPosition -= 10;
  } else if (e.key === 'ArrowRight' && spaceshipPosition < 360) {
    spaceshipPosition += 10;
  }
  spaceship.style.left = spaceshipPosition + 'px';
});

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    shootLaser();
  }
});

function shootLaser() {
  const laser = document.createElement('div');
  laser.className = 'laser';
  laser.style.left = spaceshipPosition + 18 + 'px';
  laser.style.bottom = '30px';
  document.getElementById('gameArea').appendChild(laser);

  let laserInterval = setInterval(() => {
    laser.style.bottom = parseInt(laser.style.bottom) + 5 + 'px';
    if (parseInt(laser.style.bottom) > 600) {
      clearInterval(laserInterval);
      laser.remove();
    }

    checkCollision(laser, laserInterval);
  }, 20);
}

function createInvader() {
  const invader = document.createElement('div');
  invader.className = 'invader';
  invader.style.left = Math.floor(Math.random() * 370) + 'px';
  invader.style.top = '0px';
  document.getElementById('gameArea').appendChild(invader);

  let invaderInterval = setInterval(() => {
    invader.style.top = parseInt(invader.style.top) + 2 + 'px';
    if (parseInt(invader.style.top) > 600) {
      clearInterval(invaderInterval);
      invader.remove();
      decreaseHealth(); // Decrease health if invader reaches the bottom
    }
  }, 20);

  invader.setAttribute('data-interval', invaderInterval);
}

function checkCollision(laser, laserInterval) {
  const invaders = document.querySelectorAll('.invader');
  invaders.forEach((invader) => {
    const laserRect = laser.getBoundingClientRect();
    const invaderRect = invader.getBoundingClientRect();

    if (
      laserRect.left < invaderRect.left + invaderRect.width &&
      laserRect.left + laserRect.width > invaderRect.left &&
      laserRect.top < invaderRect.top + invaderRect.height &&
      laserRect.height + laserRect.top > invaderRect.top
    ) {
      invader.remove();
      laser.remove();
      clearInterval(laserInterval);
      clearInterval(invader.getAttribute('data-interval'));
      score += 10;
      document.getElementById('score').textContent = `Score: ${score}`;
    }
  });
}

function decreaseHealth() {
  if (health > 0) {
    healthBlocks[health - 1].classList.add('lostHealth'); // Change the color of the health block
    health--;
    if (health <= 0) {
      endGame();
    }
  }
}

function startGame() {
  timeLeft = 30;
  score = 0;
  health = 5; // Reset health
  healthBlocks.forEach((block) => block.classList.remove('lostHealth')); // Reset the health bar
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('timer').textContent = `Time: ${timeLeft}`;
  gameOverScreen.style.display = 'none';
  spaceship.style.left = '180px';

  gameInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  invaderInterval = setInterval(createInvader, 2000); // Spawn invaders every 2 seconds
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(invaderInterval);
  document.querySelectorAll('.invader').forEach((invader) => invader.remove());
  document.querySelectorAll('.laser').forEach((laser) => laser.remove());
  finalScoreDisplay.textContent = `Your Score: ${score}`;
  gameOverScreen.style.display = 'block';
}

restartButton.addEventListener('click', startGame);

startGame();
