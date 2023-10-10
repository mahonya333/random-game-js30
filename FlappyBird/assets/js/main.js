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
  });