let gameState = {
    days: 0,
    size: 16.67 // 50px / 300px * 100
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
    jellyfish.style.width = `${gameState.size}%`;
    jellyfish.style.height = `${gameState.size * 0.75}%`; // 유지 3:4 비율
    daysSpan.textContent = gameState.days;
    
    moveJellyfish();
}

function moveJellyfish() {
    const maxX = 100 - gameState.size;
    const maxY = 100 - (gameState.size * 0.75);
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    jellyfish.style.left = `${newX}%`;
    jellyfish.style.top = `${newY}%`;
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
    const foodX = 50 - (3.33 / 2); // 중앙에 위치 (3.33%는 먹이의 너비)
    
    food.style.left = `${foodX}%`;
    food.style.top = '0%';
    food.style.display = 'block';
    
    food.animate([
        { top: '0%' },
        { top: '50%' } // 수족관 중앙으로 떨어지게 설정
    ], {
        duration: 1000,
        fill: 'forwards'
    });
}

function moveJellyfishToFood() {
    const foodX = parseFloat(food.style.left);
    const foodY = 50; // 수족관 중앙

    jellyfish.style.transition = 'all 2s ease';
    jellyfish.style.left = `${foodX}%`;
    jellyfish.style.top = `${foodY}%`;
    
    jellyfish.addEventListener('transitionend', () => {
        jellyfish.style.transition = ''; // Reset transition
    }, { once: true });
}

function createHeart(element) {
    createFloatingSymbol(element, '❤️');
}

function createStar(element) {
    createFloatingSymbol(element, '⭐');
}

function createFloatingSymbol(element, symbol) {
    const floatingSymbol = document.createElement('div');
    floatingSymbol.innerHTML = symbol;
    floatingSymbol.className = 'floating-symbol';
    floatingSymbol.style.left = `${parseFloat(element.style.left) + gameState.size / 2}%`;
    floatingSymbol.style.top = `${parseFloat(element.style.top)}%`;
    container.appendChild(floatingSymbol);
    setTimeout(() => container.removeChild(floatingSymbol), 2000);
}

function dailyReset() {
    gameState.days++;
    saveGameState();
}

loadGameState();
feedButton.addEventListener('click', feedJellyfish);
jellyfish.addEventListener('click', () => {
    if (Math.random() < 0.01) { // 1% 확률로 별 생성
        createStar(jellyfish);
    } else { // 99% 확률로 하트 생성
        createHeart(jellyfish);
    }
});

setInterval(dailyReset, 24 * 60 * 60 * 1000);
setInterval(moveJellyfish, 10000);
updateDisplay();

// 반응형 크기 조정을 위한 이벤트 리스너
window.addEventListener('resize', updateDisplay);