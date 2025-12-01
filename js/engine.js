// js/engine.js

document.addEventListener('DOMContentLoaded', () => {
    const clickerButton = document.getElementById('clicker');

    // Main Game Loop
    setInterval(() => {
        // Apply resource generation from upgrades
        for (const resource in GameState.resourcesPerSecond) {
            GameResources.increase(resource, GameState.resourcesPerSecond[resource]);
        }
        
        // Render all UI elements
        renderResources();
    }, 1000);

    clickerButton.addEventListener('click', (e) => {
        GameResources.increase('Cosmic Dough', GameState.clickPower);
        createFloatingNumber(e.clientX, e.clientY, GameState.clickPower);
    });

    function createFloatingNumber(x, y, amount) {
        const floatingNumber = document.createElement('div');
        floatingNumber.textContent = `+${Math.floor(amount)}`;
        floatingNumber.classList.add('floating-number');
        floatingNumber.style.left = `${x}px`;
        floatingNumber.style.top = `${y}px`;
        document.body.appendChild(floatingNumber);

        setTimeout(() => {
            floatingNumber.remove();
        }, 1000);
    }
    
    // Initial render
    renderResources();
    renderUpgrades();
    createStars();
});

function createStars() {
    const starContainer = document.getElementById('star-container');
    if (!starContainer) return;
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starContainer.appendChild(star);
    }
}
