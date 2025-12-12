document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('snakeToggle');
  const modal = document.getElementById('snakeModal');
  const closeBtn = document.getElementById('snakeClose');
  const canvas = document.getElementById('snakeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CELL = 12;
  const COLS = Math.floor(canvas.width / CELL);
  const ROWS = Math.floor(canvas.height / CELL);

  const MAX_LEVEL = 5;
  const levelSpeeds = [0, 120, 100, 80, 65, 50];

  let snake = [{ x: Math.floor(COLS/2), y: Math.floor(ROWS/2) }];
  let dir = { x: 1, y: 0 };
  let food = null;
  let running = false;
  let paused = false;
  let intervalId = null;
  let speed = levelSpeeds[1];
  let level = 1;
  let score = 0;
  let obstacles = [];

  function placeFood() {
    let x, y;
    do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
    } while (snake.some(s => s.x === x && s.y === y) || obstacles.some(o => o.x === x && o.y === y));
    food = { x, y };
  }

  function draw() {
    // background
    ctx.fillStyle = '#07111a';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // level label + score
    ctx.fillStyle = 'rgba(0,217,255,0.12)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Fase ${level} / ${MAX_LEVEL}`, 8, 14);
    ctx.fillText(`Pontos: ${score}`, 8, 28);

    // food
    if (food) {
      ctx.fillStyle = 'rgba(255,90,130,0.95)';
      ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL-4, CELL-4);
    }

    // obstacles
    if (obstacles && obstacles.length) {
      ctx.fillStyle = 'rgba(80,80,80,0.9)';
      obstacles.forEach(o => {
        ctx.fillStyle = 'rgba(60,60,80,0.95)';
        ctx.fillRect(o.x * CELL + 1, o.y * CELL + 1, CELL-2, CELL-2);
      });
    }

    // snake
    for (let i=0;i<snake.length;i++){
      const s = snake[i];
      ctx.fillStyle = (i===0) ? 'rgba(0,217,255,0.95)' : 'rgba(169,0,255,0.9)';
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL-2, CELL-2);
    }
  }

  function step() {
    if (!running || paused) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    // wall wrap
    head.x = (head.x + COLS) % COLS;
    head.y = (head.y + ROWS) % ROWS;

    // collision with self
    const willEat = food && head.x === food.x && head.y === food.y;
    const tail = snake[snake.length - 1];
    const collisionWithBody = snake.some(s => s.x === head.x && s.y === head.y);
    // allow moving into the current tail position if the snake will not grow (i.e., not eating)
    if (collisionWithBody && !( !willEat && tail && tail.x === head.x && tail.y === head.y )) {
      stop();
      alert('Fim de jogo! Você bateu na sua cauda.');
      return;
    }

    // collision with obstacles
    if (obstacles.some(o => o.x === head.x && o.y === head.y)) {
      stop();
      alert('Fim de jogo! Você bateu em um obstáculo.');
      return;
    }

    snake.unshift(head);

    // eat food
    if (food && head.x === food.x && head.y === food.y) {
      placeFood();
      score += 10;
      // advance level by score thresholds: 1000, 2000, 3000...
      if (score >= level * 1000) {
        if (level < MAX_LEVEL) {
          level++;
          setupLevel(level);
          return; // let new level render
        } else {
          stop();
          alert('Parabéns! Você completou todas as fases!');
          return;
        }
      }
    } else {
      snake.pop();
    }

    draw();
  }

  function start() {
    if (!running) {
      running = true;
      paused = false;
      level = 1;
      score = 0;
      setupLevel(level);
      snake = [{ x: Math.floor(COLS/2), y: Math.floor(ROWS/2) }];
      dir = { x: 1, y: 0 };
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(step, speed);
    } else if (paused) {
      paused = false;
    }
  }

  function setupLevel(lv) {
    // set speed and required foods
    speed = levelSpeeds[lv] || levelSpeeds[1];
    // eatenThisLevel no longer used; progression is score-based
    // define obstacles per level (first level empty)
    obstacles = [];
    if (lv === 2) {
      // a few scattered blocks
      obstacles = [
        {x:5,y:5},{x:6,y:5},{x:7,y:5},
        {x:12,y:8},{x:13,y:8}
      ];
    } else if (lv === 3) {
      // horizontal wall across middle
      for (let x=3;x<COLS-3;x++) obstacles.push({ x: x, y: Math.floor(ROWS/2) });
    } else if (lv === 4) {
      // box maze
      for (let x=4;x<COLS-4;x++) { obstacles.push({ x: x, y: 4 }); obstacles.push({ x: x, y: ROWS-5 }); }
      for (let y=6;y<ROWS-6;y++) { obstacles.push({ x: 6, y: y }); obstacles.push({ x: COLS-7, y: y }); }
    } else if (lv === 5) {
      // denser obstacles in pattern
      for (let x=2;x<COLS-2;x+=4) for (let y=2;y<ROWS-2;y+=4) obstacles.push({x,y});
    }
    // make sure obstacles are within grid and unique
    obstacles = obstacles.filter(o => o.x>=0 && o.x<COLS && o.y>=0 && o.y<ROWS);
    const unique = {};
    obstacles = obstacles.filter(o => { const key = o.x+','+o.y; if (unique[key]) return false; unique[key]=true; return true; });

    // reposition snake and food
    snake = [{ x: Math.floor(COLS/2), y: Math.floor(ROWS/2) }];
    dir = { x:1, y:0 };
    placeFood();
    // reset interval with new speed
    if (intervalId) { clearInterval(intervalId); intervalId = setInterval(step, speed); }
  }

  function pause() {
    if (!running) return;
    paused = !paused;
  }

  function stop() {
    running = false;
    paused = false;
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }

  // keyboard
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (['ArrowUp','w','W'].includes(key) && dir.y === 0) { dir = { x:0, y:-1 }; }
    if (['ArrowDown','s','S'].includes(key) && dir.y === 0) { dir = { x:0, y:1 }; }
    if (['ArrowLeft','a','A'].includes(key) && dir.x === 0) { dir = { x:-1, y:0 }; }
    if (['ArrowRight','d','D'].includes(key) && dir.x === 0) { dir = { x:1, y:0 }; }
  });

  // UI hooks
  toggle.addEventListener('click', () => {
    modal.classList.toggle('active');
    modal.setAttribute('aria-hidden', modal.classList.contains('active') ? 'false' : 'true');
  });
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    stop();
  });

  // expose
  window.startSnake = start;
  window.pauseSnake = pause;

  // initial draw
  ctx.fillStyle = '#07111a';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'rgba(0,217,255,0.6)';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Mini Snake — Clique em Iniciar', canvas.width/2, canvas.height/2);
});
