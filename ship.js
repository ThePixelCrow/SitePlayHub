document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('shipToggle');
  const modal = document.getElementById('shipModal');
  const closeBtn = document.getElementById('shipClose');
  const canvas = document.getElementById('shipCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CELL = 16;
  const COLS = Math.floor(canvas.width / CELL);
  const ROWS = Math.floor(canvas.height / CELL);

  const MAX_LEVEL = 5;
  const levelSpeeds = [0, 120, 100, 80, 65, 50];

  let running = false;
  let paused = false;
  let intervalId = null;
  let level = 1;
  let score = 0;
  let speed = levelSpeeds[1];

  // player
  const player = { x: Math.floor(COLS/2), y: ROWS-2, w: 2, h: 1 };
  let bullets = [];

  // enemies
  let enemies = [];
  let enemyDir = 1;

  function setupLevel(lv) {
    level = lv;
    speed = levelSpeeds[lv] || levelSpeeds[1];
    enemies = [];
    const rows = Math.min(3 + lv, 6);
    const cols = Math.min(6 + lv, 12);
    for (let r=0;r<rows;r++){
      for (let c=0;c<cols;c++){
        enemies.push({ x: c*2, y: r+1, w:1, h:1, alive:true });
      }
    }
    bullets = [];
    player.x = Math.floor(COLS/2);
    player.y = ROWS-2;
    draw();
    if (intervalId) { clearInterval(intervalId); intervalId = setInterval(step, speed); }
  }

  function draw() {
    ctx.fillStyle = '#07111a';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // HUD
    ctx.fillStyle = 'rgba(0,217,255,0.12)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Fase ${level} / ${MAX_LEVEL}`, 8, 14);
    ctx.fillText(`Pontos: ${score}`, 8, 28);

    // draw player
    ctx.fillStyle = 'cyan';
    ctx.fillRect(player.x*CELL+2, player.y*CELL+2, player.w*CELL-4, player.h*CELL-4);

    // bullets
    ctx.fillStyle = 'yellow';
    bullets.forEach(b => ctx.fillRect(b.x*CELL+6, b.y*CELL+2, 4, 8));

    // enemies
    ctx.fillStyle = 'salmon';
    enemies.forEach(e => {
      if (!e.alive) return;
      ctx.fillRect(e.x*CELL+2, e.y*CELL+2, e.w*CELL-4, e.h*CELL-4);
    });
  }

  function step(){
    if (!running || paused) return;

    // move enemies horizontally, reverse at edges
    let hitEdge = false;
    enemies.forEach(e => {
      if (!e.alive) return;
      e.x += enemyDir * (level>1?1:1);
      if (e.x <= 0 || e.x >= COLS-1) hitEdge = true;
    });
    if (hitEdge) {
      enemyDir *= -1;
      enemies.forEach(e => { if (e.alive) e.y += 1; });
    }

    // move bullets
    bullets.forEach(b => b.y -= 0.5);
    bullets = bullets.filter(b => b.y > -1);

    // collisions bullets x enemies
    bullets.forEach(b => {
      enemies.forEach(e => {
        if (!e.alive) return;
        if (Math.abs(b.x - e.x) < 1 && Math.abs(b.y - e.y) < 0.9) {
          e.alive = false;
          b.hit = true;
          score += 10; // each enemy = 10 points
          // level up by score thresholds
          if (score >= level * 1000) {
            if (level < MAX_LEVEL) { setupLevel(level+1); }
            else { stop(); alert('Parabéns! Você completou todas as fases!'); }
          }
        }
      });
    });
    bullets = bullets.filter(b => !b.hit);

    // check enemy reach player
    const anyEnemyTouchingPlayer = enemies.some(e => e.alive && e.y >= player.y);
    if (anyEnemyTouchingPlayer) { stop(); alert('Fim de jogo! Inimigos alcançaram sua nave.'); return; }

    draw();
  }

  function start(){
    if (!running) {
      running = true;
      paused = false;
      score = 0;
      enemyDir = 1;
      setupLevel(1);
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(step, speed);
    } else if (paused) paused = false;
  }

  function pause(){ paused = !paused; }

  function stop(){ running=false; paused=false; if(intervalId){clearInterval(intervalId); intervalId=null;} }

  // controls
  let inputLeft = false, inputRight = false;
  document.addEventListener('keydown', (e)=>{
    if (!running) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') inputLeft = true;
    if (e.key === 'ArrowRight' || e.key === 'd') inputRight = true;
    if (e.code === 'Space') {
      bullets.push({ x: player.x + 0.5, y: player.y - 0.5 });
    }
  });
  document.addEventListener('keyup', (e)=>{
    if (e.key === 'ArrowLeft' || e.key === 'a') inputLeft = false;
    if (e.key === 'ArrowRight' || e.key === 'd') inputRight = false;
  });

  // simple continuous movement applied between ticks for smoother control
  setInterval(()=>{
    if (!running || paused) return;
    if (inputLeft) player.x = Math.max(0, player.x - 1);
    if (inputRight) player.x = Math.min(COLS - player.w, player.x + 1);
  }, 80);

  // UI hooks
  toggle.addEventListener('click', ()=>{ modal.classList.toggle('active'); modal.setAttribute('aria-hidden', modal.classList.contains('active')? 'false':'true'); });
  closeBtn.addEventListener('click', ()=>{ modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); stop(); });

  window.startShip = start;
  window.pauseShip = pause;

  // initial draw
  draw();
});
