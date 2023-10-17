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

  let verticalGapPipes = 120;
  let xBirdPosition = 10;
  let yBirdPosition = 150;
  let birdGravitation = 1.5;
  let score = 0;

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

  // Проверяем, есть ли уже лучшие результаты в localStorage
  if (localStorage.getItem("bestScores")) {
    bestScores = JSON.parse(localStorage.getItem("bestScores"));
  }

  showBestScores();

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
    cancelAnimationFrame(draw);
    location.reload();
  });

  function moveUp() {
    yBirdPosition -= 25;
    fly.play();
  }

  function moveDown() {
    yBirdPosition += 25;
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

  function draw() {
    ctx.drawImage(bg, 0, 0, cvs.width, cvs.height);

    yBirdPosition += birdGravitation;

    for (let i = 0; i < pipesArray.length; i++) {
      ctx.drawImage(pipeUp, pipesArray[i].x, pipesArray[i].y);
      ctx.drawImage(
        pipeBottom,
        pipesArray[i].x,
        pipesArray[i].y + pipeUp.height + verticalGapPipes
      );

      pipesArray[i].x--;

      if (pipesArray[i].x == 125) {
        pipesArray.push({
          x: cvs.width,
          y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
        });
      }

      if (
        (xBirdPosition + bird.width >= pipesArray[i].x &&
          xBirdPosition <= pipesArray[i].x + pipeUp.width &&
          (yBirdPosition <= pipesArray[i].y + pipeUp.height ||
            yBirdPosition + bird.height >=
              pipesArray[i].y + pipeUp.height + verticalGapPipes)) ||
        yBirdPosition + bird.height >= cvs.height - fg.height ||
        yBirdPosition < 0
      ) {
        showVinnerMessage();
        saveBestScores();
        return;
      }

      if (pipesArray[i].x == 5) {
        score++;
        score_audio.play();
      }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height + 8, cvs.width, fg.height);
    ctx.drawImage(bird, xBirdPosition, yBirdPosition);

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Счет: " + score, 10, cvs.height);

    requestAnimationFrame(draw);
  }

  function showBestScores() {
    // Получаем элемент, в котором будем отображать лучшие результаты
    const bestScoresElement = document.getElementById("best-scores");

    // Очищаем элемент
    bestScoresElement.innerHTML = "";

    // Отображаем лучшие результаты
    for (let i = 0; i < bestScores.length; i++) {
      const scoreElement = document.createElement("li");
      scoreElement.classList.add("top-results__list-item");
      scoreElement.textContent =
        "Результ топ" + (i + 1) + " игрока: " + bestScores[i];
      bestScoresElement.appendChild(scoreElement);
    }
  }

  function saveBestScores() {
    bestScores.push(score);
    bestScores.sort((a, b) => b - a); // Сортировка по убыванию
    bestScores = bestScores.slice(0, 10); // Ограничиваем до 10 лучших результатов
    localStorage.setItem("bestScores", JSON.stringify(bestScores));
  }

  function showVinnerMessage() {
    const text = `Ваш результат: ${score}`;

    // Вычисляем ширину самой широкой строки текста
    let maxWidth = 0;

    const lineMetrics = ctx.measureText(text);
    maxWidth = Math.max(maxWidth, lineMetrics.width);

    // Размеры прямоугольника
    const rectWidth = cvs.width; // Ширина прямоугольника с отступами
    const rectHeight = cvs.height; // Высота прямоугольника с отступами

    // Центрируем прямоугольник
    const rectX = (cvs.width - rectWidth) / 2; // Центрирование по горизонтали

    // Отображаем прямоугольник
    ctx.fillStyle = "#ffc10e";
    ctx.fillRect(0, 0, rectWidth, rectHeight);

    /* стили результирующего текста */
    ctx.fillStyle = "#000";
    ctx.font = "16px Verdana";
    ctx.textAlign = "center"; // Выравнивание по центру
    ctx.textBaseline = "middle"; // Выравнивание по центру

    // Рассчитываем координаты для центрирования текста по вертикали
    let currentY = cvs.height / 2; // Отступ сверху
    const textX = rectX + rectWidth / 2;
    ctx.fillText(text, textX, currentY);
  }

  pipeBottom.onload = draw;
});
