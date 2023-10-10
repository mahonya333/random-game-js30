window.addEventListener("DOMContentLoaded", () => {
    const cvs = document.getElementById("canvas");
    let ctx = cvs.getContext("2d");
  
    const btnReloadGame = document.getElementById("reload-game");
    const bird = new Image();
    const bg = new Image();
    const fg = new Image();
    const pipeUp = new Image();
    const pipeBottom = new Image();
  
    const fly = new Audio();
    const score_audio = new Audio();
  
    let pipesArray = [];
  
    pipesArray[0] = {
      x: cvs.width,
      y: 0,
    };
  
    let bestScores = [];
  
    fly.src = "./assets/audio/fly.mp3";
    score_audio.src = "./assets/audio/score.mp3";
  
    bird.src = "./assets/img/bird.png";
    bg.src = "./assets/img/bg.png";
    fg.src = "./assets/img/fg.png";
    pipeUp.src = "./assets/img/pipeUp.png";
    pipeBottom.src = "./assets/img/pipeBottom.png";

      /* Слушатель отслеживает клики по клавишам */
  document.addEventListener("keydown", function (event) {
    let keyCode = event.keyCode;

    if (keyCode === 32 || keyCode === 87) {
      moveUp();
    }

    if (keyCode === 65) {
      moveLeft();
    }

    if (keyCode === 68) {
      moveRight();
    }

    if (keyCode === 83) {
      moveDown();
    }
  });

  btnReloadGame.addEventListener("click", function () {
    location.reload();
  });

  function moveUp() {
    yBirdPosition -= 25;
    fly.play();
  }

  function moveLeft() {
    xBirdPosition -= 25;
    fly.play();
  }

  function moveRight() {
    xBirdPosition += 25;
    fly.play();
  }

  function moveDown() {
    yBirdPosition += 25;
    fly.play();
    cancelAnimationFrame(draw);
  }
  });