const bucket = document.getElementById('bucket');
const gameContainer = document.getElementById('gameContainer');
const stopButton = document.getElementById('stopButton');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const hearts = document.querySelectorAll('.heart');
let gameInterval;
let ballInterval;
let timerInterval;
let score = 0;
let missedBalls = 0;
const maxMissedBalls = 3;
const gameTime = 60; // 60 seconds
let remainingTime = gameTime;

document.addEventListener('mousemove', (event) => {
    const containerRect = gameContainer.getBoundingClientRect();
    let bucketX = event.clientX - containerRect.left - bucket.offsetWidth / 2;
    bucketX = Math.max(0, Math.min(bucketX, containerRect.width - bucket.offsetWidth));
    bucket.style.left = `${bucketX}px`;
});

function createBall() {
    const ball = document.createElement('img'); // Create an <img> element instead of <div>
    ball.classList.add('ball');
    ball.src = 'drops.jpeg'; // Set the image source
    ball.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
    gameContainer.appendChild(ball);
    return ball;
}


function dropBall(ball) {
    const ballFallInterval = setInterval(() => {
        const ballRect = ball.getBoundingClientRect();
        const bucketRect = bucket.getBoundingClientRect();
        if (ballRect.bottom >= bucketRect.top && ballRect.right >= bucketRect.left && ballRect.left <= bucketRect.right) {
            clearInterval(ballFallInterval);
            gameContainer.removeChild(ball);
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        } else if (ballRect.top > gameContainer.clientHeight) {
            clearInterval(ballFallInterval);
            gameContainer.removeChild(ball);
            missedBalls++;
            hearts[missedBalls - 1].classList.add('empty');
            if (missedBalls >= maxMissedBalls) {
                stopGame();
            }
        } else {
            ball.style.top = `${ball.offsetTop + 5}px`;
        }

        // Change heart color to black when missed
        if (missedBalls > 0 && missedBalls <= hearts.length) {
            hearts[missedBalls - 1].src = 'black_heart.jpg'; // Change to your black heart image
        }
    }, 20);
}


function startGame() {
    score = 0;
    missedBalls = 0;
    remainingTime = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${remainingTime}`;

    // Reset hearts to red
    hearts.forEach(heart => {
        heart.classList.remove('empty');
        heart.src = 'heart.png'; // Ensure this path is correct for your red heart image
    });

    // Hide start button
    startButton.style.display = 'none';

    // Start game interval to create balls
    gameInterval = setInterval(() => {
        const ball = createBall();
        dropBall(ball);
    }, 1000);

    // Start timer interval
    timerInterval = setInterval(() => {
        remainingTime++;
        timerDisplay.textContent = `Time: ${remainingTime}`;
    }, 1000);
}

function stopGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    const balls = document.querySelectorAll('.ball');
    balls.forEach(ball => {
        gameContainer.removeChild(ball);
    });

    // Calculate energy conservation based on drops collected
    const energyConserved = Math.floor(score * 2.857); // Example calculation, adjust as needed

    // Calculate durations for appliances based on energy conserved
    const fanDuration = Math.floor(energyConserved / 4.615); // Fan: 16.25 minutes
    const tvDuration = Math.floor(energyConserved / 12.308); // TV: 3.25 minutes
    const bulbDuration = Math.floor(energyConserved / 2); // Bulb: 20 minutes
    const blenderDuration = Math.floor(energyConserved / 3); // Blender: 15 minutes

    // Create a popup element
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <h2>Game Over!</h2>
        <p>You collected ${score} drops!</p>
        <p>This turned into ${energyConserved} KJ of Energy, enough to power:</p>
        <div class="appliances">
            <div>
                <img src="fan.jpeg" alt="Fan" class="appliance-image">
                <p>A fan for ${fanDuration} minutes</p>
            </div>
            <div>
                <img src="T.jpeg" alt="TV" class="appliance-image">
                <p>A new TV for ${tvDuration} minutes</p>
            </div>
            <div>
                <img src="bulb.jpeg" alt="Bulb" class="appliance-image">
                <p>A bulb for ${bulbDuration} minutes</p>
            </div>
            <div>
                <img src="blender.jpeg" alt="Blender" class="appliance-image">
                <p>A blender for ${blenderDuration} minutes</p>
            </div>
        </div>
        <button id="restartButton">Restart</button>
    `;
    
    // Append popup to the body
    document.body.appendChild(popup);

    // Show start button
    startButton.style.display = 'block';

    // Optional: Add event listener for restart button
    const restartButton = popup.querySelector('#restartButton');
    restartButton.addEventListener('click', () => {
        document.body.removeChild(popup); // Remove popup
        startGame(); // Restart the game
    });
}




stopButton.addEventListener('click', stopGame);
startButton.addEventListener('click', startGame);

startGame();

const homeButton = document.getElementById('homeButton');

homeButton.addEventListener('click', () => {
    window.location.href = '../index.html'; // Redirect to home page
});
