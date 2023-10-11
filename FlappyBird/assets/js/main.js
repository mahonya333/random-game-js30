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

  function draw() {
    ctx.drawImage(bg, 0, 0, cvs.width, cvs.height);

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
        saveBestScores();
        location.reload();
      }

      if (pipesArray[i].x == 5) {
        score++;
        score_audio.play();
      }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height + 8, cvs.width, fg.height);
    ctx.drawImage(bird, xBirdPosition, yBirdPosition);

    yBirdPosition += birdGravitation;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Счет: " + score, 10, cvs.height);

    // Проверяем, есть ли уже лучшие результаты в localStorage
    if (localStorage.getItem("bestScores")) {
      bestScores = JSON.parse(localStorage.getItem("bestScores"));
    }

    showBestScores();

    if (score >= 10) {
      showVinnerMessage();
      saveBestScores();
      return;
    }

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
    // Текст, который будет внутри прямоугольника
    const text = `Вы набрали максимальное количество очков \n
      Ваш результат: ${score}`;

    // Разбиваем текст на строки
    const lines = text.split("\n");

    // Вычисляем высоту каждой строки и общую высоту текста
    const lineHeight = 25; // Высота каждой строки (может быть изменена)
    const textHeight = lines.length * lineHeight;

    // Вычисляем ширину самой широкой строки текста
    let maxWidth = 0;

    for (const line of lines) {
      const lineMetrics = ctx.measureText(line);
      maxWidth = Math.max(maxWidth, lineMetrics.width);
    }

    // Размеры прямоугольника
    const rectWidth = maxWidth + 40; // Ширина прямоугольника с отступами
    const rectHeight = textHeight + 40; // Высота прямоугольника с отступами

    // Центрируем прямоугольник
    const rectX = (cvs.width - rectWidth) / 2; // Центрирование по горизонтали
    const rectY = (cvs.height - rectHeight) / 2; // Центрирование по вертикали

    // Отображаем прямоугольник
    ctx.fillStyle = "#ffc10e";
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    /* стили результирующего текста */
    ctx.fillStyle = "#000";
    ctx.font = "16px Verdana";
    ctx.textAlign = "center"; // Выравнивание по центру
    ctx.textBaseline = "middle"; // Выравнивание по центру

    // Рассчитываем координаты для центрирования текста по вертикали
    let currentY = rectY + 20; // Отступ сверху

    for (const line of lines) {
      const lineMetrics = ctx.measureText(line);
      const textX = rectX + rectWidth / 2;
      ctx.fillText(line, textX, currentY);
      currentY += lineHeight;
    }
  }

  pipeBottom.onload = draw;
});
