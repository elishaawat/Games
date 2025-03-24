document.addEventListener('DOMContentLoaded', () => {
    // Get references to important elements
    const gameContainer = document.querySelector('.game-container');
    const glitch = document.getElementById('glitch');
    const scoreValue = document.getElementById('score-value');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScore = document.getElementById('final-score');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const healthFill = document.querySelector('.health-fill');
    const cursor = document.getElementById('cursor');
    const cursorArea = document.querySelector('.cursor-area');  // Get the cursor area

    // Game state variables
    let score = 0; // Current score
    let health = 100; // Player health (system integrity)
    let gameActive = false; // Flag indicating if the game is running
    let glitchSpeed = 1; // Speed at which the glitch moves
    let colorShiftCount = 0; // Counter for color shifting
    let healthTimeoutId; // ID of the setTimeout for health decrease (for clearing it)

    // Function to start the game
    function startGame() {
        gameActive = true; // Set game state to active
        score = 0; // Reset score
        health = 100; // Reset health
        glitchSpeed = 1; // Reset glitch speed
        colorShiftCount = 0; // Reset color shift counter

        scoreValue.textContent = score; // Update score display
        healthFill.style.transform = `scaleX(${health / 100})`; // Update health bar width

        resetColors(); // Set initial colors

        startScreen.style.display = 'none'; // Hide start screen
        gameOverScreen.style.display = 'none'; // Hide game over screen

        clearTimeout(healthTimeoutId); // Clear any existing health timeouts

        moveGlitch(); // Start moving the glitch
        decreaseHealth(); // Start decreasing health
    }

    // Function to end the game
    function endGame() {
        gameActive = false; // Set game state to inactive
        finalScore.textContent = score; // Display final score
        gameOverScreen.style.display = 'flex'; // Show game over screen
        clearTimeout(healthTimeoutId); // Clear any existing health timeouts
    }

    // Function to move the glitch to a random location
    function moveGlitch() {
        if (!gameActive) return;

        const maxX = gameContainer.offsetWidth - glitch.offsetWidth;
        const maxY = gameContainer.offsetHeight - glitch.offsetHeight;

        let randomX = Math.random() * maxX;
        let randomY = Math.random() * maxY;

        randomX = Math.max(0, Math.min(randomX, maxX));
        randomY = Math.max(0, Math.min(randomY, maxY));

        glitch.style.transform = `translate(${randomX}px, ${randomY}px)`;

        const delay = Math.max(0.5, 2 / glitchSpeed);
        setTimeout(() => {
            // Apply a class to trigger the jump animation
            glitch.classList.add('jump');
            // Remove the class after the animation duration (adjust as needed)
            setTimeout(() => {
                glitch.classList.remove('jump');
            }, 500); //Animation duration is 0.5s
            moveGlitch(); // Move again
        }, delay * 1000);

        glitchSpeed += 0.05;
    }

    // Function to decrease health over time
    function decreaseHealth() {
        if (!gameActive) return; // Don't decrease health if the game is not active

        health -= 5; // Decrease health
        health = Math.max(0, health);  //Prevent going below zero

        healthFill.style.transform = `scaleX(${health / 100})`; // Update health bar

        if (health <= 0) {
            endGame(); // End the game if health is zero
        } else {
            healthTimeoutId = setTimeout(decreaseHealth, 500); // Decrease health again after 0.5 seconds, store the ID
        }
    }

    // Function to shift the color theme
    function shiftColors() {
        colorShiftCount++; // Increment the color shift counter

        //Remove prevoius class
        document.body.classList.remove('color-shift-1','color-shift-2','color-shift-3','color-shift-4');

        switch (colorShiftCount % 4) {
            case 1:
                document.body.classList.add('color-shift-1');
                break;
            case 2:
                document.body.classList.add('color-shift-2');
                break;
            case 3:
                document.body.classList.add('color-shift-3');
                break;
            case 0:
                document.body.classList.add('color-shift-4');
                break;
        }
    }

    // Function to reset colors to default
    function resetColors() {
      document.body.classList.remove('color-shift-1','color-shift-2','color-shift-3','color-shift-4');
       document.body.style.color = '#00ff00'

    }

    // Event Listeners
    startButton.addEventListener('click', startGame); // Start game when start button is clicked
    restartButton.addEventListener('click', startGame); // Restart game when restart button is clicked

    // Event listener for clicking the glitch
    glitch.addEventListener('click', () => {
        if (!gameActive) return; // Do nothing if the game is not active

        score++; // Increase score
        scoreValue.textContent = score; // Update score display

        if (score % 5 === 0) {
            shiftColors(); // Shift colors every 5 points
        }

        health = Math.min(100, health + 10); //Restore health, Don't go over 100
        healthFill.style.transform = `scaleX(${health / 100})`; // Update health bar

        moveGlitch(); // Move glitch when clicked
    });

    // Event listener for mouse movement (custom cursor)
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px'; // Update cursor X position
        cursor.style.top = e.clientY + 'px'; // Update cursor Y position
    });

    // Initialize the game by hiding game over screen
   gameOverScreen.style.display = 'none';
});