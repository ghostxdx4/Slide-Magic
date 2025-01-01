const gridSize = 4;
let tiles = [];
let selectedImage = localStorage.getItem('selectedImage');

if (!selectedImage) {
    alert('No image selected! Redirecting to the main menu...');
    window.location.href = 'index.html';
}

function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        if (tile === 0) {
            tileElement.classList.add('empty');
        } else {
            tileElement.style.backgroundImage = `url(images/${selectedImage})`;

            const row = Math.floor((tile - 1) / gridSize);
            let col = (tile - 1) % gridSize;

            col = (col + 1) % gridSize;

            tileElement.style.backgroundPosition = `${-col * 80}px ${-row * 80}px`;
            tileElement.addEventListener('click', () => moveTile(index));
        }
        grid.appendChild(tileElement);
    });
}

function createPreview() {
    const previewGrid = document.getElementById('preview-grid');
    previewGrid.innerHTML = '';
    for (let i = 0; i < gridSize * gridSize; i++) {
        const tileElement = document.createElement('div');
        tileElement.className = 'preview-tile';
        tileElement.style.backgroundImage = `url(images/${selectedImage})`;
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        tileElement.style.backgroundPosition = `${-col * 20}px ${-row * 20}px`;
        tileElement.style.backgroundSize = '80px 80px';
        previewGrid.appendChild(tileElement);
    }
}

function shuffleTiles() {
    do {
        tiles = [...Array(gridSize * gridSize).keys()];
        tiles.sort(() => Math.random() - 0.5);
    } while (!isSolvable() || isSolved());
    createGrid();
}

function resetTiles() {
    tiles = [...Array(gridSize * gridSize).keys()];
    createGrid();
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf(0);
    const isValidMove =
        index === emptyIndex - 1 && emptyIndex % gridSize !== 0 ||
        index === emptyIndex + 1 && index % gridSize !== 0 ||
        index === emptyIndex - gridSize ||
        index === emptyIndex + gridSize;

    if (isValidMove) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        createGrid();
        if (isSolved()) alert('Congratulations! You solved the puzzle!');
    }
}

function isSolvable() {
    let inversions = 0;
    const flatTiles = tiles.filter(tile => tile !== 0);
    for (let i = 0; i < flatTiles.length; i++) {
        for (let j = i + 1; j < flatTiles.length; j++) {
            if (flatTiles[i] > flatTiles[j]) inversions++;
        }
    }
    return inversions % 2 === 0;
}

function isSolved() {
    return tiles.every((tile, index) => tile === index);
}

function quitGame() {
    window.location.href = 'index.html';
}

document.getElementById('shuffle-button').addEventListener('click', shuffleTiles);
document.getElementById('reset-button').addEventListener('click', resetTiles);
document.getElementById('quit-button').addEventListener('click', quitGame);

resetTiles();
createPreview();
