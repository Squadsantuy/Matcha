document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 8;
    const squares = [];
    let score = 0;

    const colors = [
        '#FF5252', // Merah
        '#FFEB3B', // Kuning
        '#2196F3', // Biru
        '#4CAF50', // Hijau
        '#9C27B0', // Ungu
        '#FF9800'  // Oranye
    ];

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            let randomColor = Math.floor(Math.random() * colors.length);
            square.style.backgroundColor = colors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('drop', dragDrop));
    squares.forEach(square => square.addEventListener('dragover', (e) => e.preventDefault()));

    function dragStart() {
        colorBeingDragged = this.style.backgroundColor;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundColor;
        squareIdBeingReplaced = parseInt(this.id);
        
        // Cek apakah perpindahan hanya 1 langkah (tetangga)
        const validMoves = [
            squareIdBeingDragged - 1, squareIdBeingDragged - width,
            squareIdBeingDragged + 1, squareIdBeingDragged + width
        ];

        if (validMoves.includes(squareIdBeingReplaced)) {
            this.style.backgroundColor = colorBeingDragged;
            squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
            checkAllMatches();
        }
    }

    function checkAllMatches() {
        // Cek Baris
        for (let i = 0; i < 64; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            if (i % 8 < 6) {
                if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                    score += 10;
                    scoreDisplay.innerHTML = score;
                    rowOfThree.forEach(index => squares[index].style.backgroundColor = '');
                }
            }
        }
        // Cek Kolom
        for (let i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            if (columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                score += 10;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach(index => squares[index].style.backgroundColor = '');
            }
        }
        moveDown();
    }

    function moveDown() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundColor === '') {
                squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
                squares[i].style.backgroundColor = '';
            }
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            if (firstRow.includes(i) && squares[i].style.backgroundColor === '') {
                let randomColor = Math.floor(Math.random() * colors.length);
                squares[i].style.backgroundColor = colors[randomColor];
            }
        }
    }

    document.getElementById('reset-btn').onclick = () => location.reload();

    window.setInterval(function() {
        checkAllMatches();
    }, 150);
});
