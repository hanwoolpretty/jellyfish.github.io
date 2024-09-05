let gameState = {
    days: 0,
    size: 50
};

const jellyfish = document.getElementById('jellyfish');
const feedButton = document.getElementById('feed-button');
const daysSpan = document.getElementById('days');
const container = document.getElementById('game-container');
const food = document.getElementById('food');

function loadGameState() {
    const savedState = localStorage.getItem('jellyfishGameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
        updateDisplay();
    }
}

function saveGameState() {
    localStorage.setItem('jellyfishGameState', JSON.stringify(gameState));
}

function updateDisplay() {
    jellyfish.style.width = `${gameState.size}px`;
    jellyfish.style.height = `${gameState.size}px`;
    daysSpan.textContent = gameState.days;
    
    moveJellyfish();
}

function moveJellyfish() {
    const maxX = container.clientWidth - gameState.size;
    const maxY = container.clientHeight - gameState.size;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    jellyfish.style.left = `${newX}px`;
    jellyfish.style.top = `${newY}px`;
}

function feedJellyfish() {
    gameState.size += 0.1;

    dropFood();
    setTimeout(() => {
        moveJellyfishToFood();
        setTimeout(() => {
            food.style.display = 'none';
            createHeart(jellyfish);
            saveGameState();
            updateDisplay();
        }, 3000);
    }, 3000);
}

function dropFood() {
    const maxX = container.clientWidth - 10;
    const foodX = (container.clientWidth - 10) / 2;
    
    food.style.left = `${foodX}px`;
    food.style.top = '0px';
    food.style.display = 'block';
    
    food.animate([
        { top: '0px' },
        { top: `${container.clientHeight / 2 - 5}px` }
    ], {
        duration: 1000,
        fill: 'forwards'
    });
}

function moveJellyfishToFood() {
    const foodX = parseFloat(food.style.left);
    const foodY = parseFloat(food.style.top) + (container.clientHeight / 2 - 5);

    jellyfish.style.transition = 'all 2s ease';
    jellyfish.style.left = `${foodX}px`;
    jellyfish.style.top = `${foodY}px`;
    
    jellyfish.addEventListener('transitionend', () => {
        jellyfish.style.transition = '';
    }, { once: true });
}

function createHeart(element) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart';
    heart.style.left = `${parseFloat(element.style.left) + gameState.size / 2}px`;
    heart.style.top = `${parseFloat(element.style.top)}px`;
    container.appendChild(heart);
    setTimeout(() => container.removeChild(heart), 2000);
}

function dailyReset() {
    gameState.days++;
    saveGameState();
}

loadGameState();
feedButton.addEventListener('click', feedJellyfish);
jellyfish.addEventListener('click', () => createHeart(jellyfish));

setInterval(dailyReset, 24 * 60 * 60 * 1000);
setInterval(moveJellyfish, 10000);

updateDisplay();
