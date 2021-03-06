document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.querySelector("#score");
    const startButton = document.querySelector("#start-button");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const width = 10;
    let nextRandom = 0;
    let timerId
    let score = 0;

    //The Tetriminoes

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],[1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]

      const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

      let currentPosition = 4
      let currentRotation = 0
      

      //randomly Select a tetrimino

      let random = Math.floor(Math.random()*theTetrominoes.length);
      let current = theTetrominoes[random][currentRotation];

      console.log(random);

      //draw the first rotation

      function draw() {
          current.forEach(index => {
              squares[currentPosition + index].classList.add('tetromino');
          })
      };

      //undraw the Tetromino

      function undraw() {
          current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
          })
      }

      //assin functions to keyCodes

      function control(e) {
        if(e.keyCode === 37) {
          moveLeft();
        } else if (e.keyCode === 38) {
          rotate();
        } else if(e.keyCode === 39) {
          moveRight();
        } else if (e.keyCode === 40) {
          moveDown();
        }
      }

      document.addEventListener('keyup', control)

      //make the tetromino move down every second
      
      //timerId = setInterval(moveDown, 1000);

      //move down second

      function moveDown() {
        undraw();
        currentPosition += width
        draw();
        freeze();
      };

      //freeze function
      function freeze() {
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))

        //Start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw();
        displayShape();
        addScore();
        gameOver();

      }
    }

    //move tetrimino left, unless its on the edge
    function moveLeft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

      if(!isAtLeftEdge) currentPosition -= 1

      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }

      draw();
    }

    //move tetromino right 
    function moveRight() {
      undraw();
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

      if(!isAtRightEdge) currentPosition += 1

      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1
      }

      draw();
    }

    //rotate
    function rotate(){
      undraw();
      currentRotation ++
      if (currentRotation === current.length) {
        currentRotation = 0
      } 
      current = theTetrominoes[random][currentRotation];
      draw();
    }

    //show upcoming tetromino
    const displaySquares = document.querySelectorAll(".mini-grid div")
    const displayWidth = 4
    let displayIndex = 0

    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, 2], //ltetromino
      [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
      [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
      [0, 1, displayWidth, displayWidth+1], //oTetromino
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    // display the shape in mini grid

    function displayShape() {
      displaySquares.forEach(square => {
        square.classList.remove('tetromino')
      })

      upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
      })
    };

    //add functionality to the button
    startButton.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
        startButton.style.background = '';
        startButton.innerHTML = 'Start'  
      } else {
        draw();
        startButton.style.backgroundColor ="darkslategray"
        startButton.innerHTML = 'Pause'  
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
    }
    })

    

    function addScore(){
      for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        if(row.every(index => squares[index].classList.contains("taken"))) {
          score += 10;
          scoreDisplay.innerHTML = score;

          row.forEach(index => {
            squares[index].classList.remove('taken');
            squares[index].classList.remove('tetromino')
          })

          const squaresRemoved = squares.splice(i, width)

          squares = squaresRemoved.concat(squares);
          squares.forEach(cell => grid.appendChild(cell))
        }
      } 
    };

    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end';
        clearInterval(timerId);
      }
    }





})