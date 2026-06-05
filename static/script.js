/* ════════════════════════════════
   BILGUNZORIG — SCRIPT.JS
   ════════════════════════════════ */

// ── AUDIO ENGINE ─────────────────────────────────────────
const SFX = (() => {
  let ctx = null;
  const get = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); return ctx; };
  const tone = (freq, type='square', dur=0.08, vol=0.08) => {
    try {
      const ac=get(), o=ac.createOscillator(), g=ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.type=type; o.frequency.setValueAtTime(freq,ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq*0.5,ac.currentTime+dur);
      g.gain.setValueAtTime(vol,ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+dur);
      o.start(); o.stop(ac.currentTime+dur);
    } catch(e){}
  };
  return {
    blip:    ()=> tone(880,'square',0.04,0.05),
    click:   ()=> { tone(440,'square',0.1,0.1); tone(660,'square',0.06,0.07); },
    boot:    (f)=> tone(f,'square',0.04,0.07),
    win:     ()=> [440,554,659,880,1100].forEach((f,i)=>setTimeout(()=>tone(f,'triangle',0.25,0.12),i*70)),
    eat:     ()=> tone(660,'sine',0.05,0.15),
    die:     ()=> [330,220,110].forEach((f,i)=>setTimeout(()=>tone(f,'sawtooth',0.12,0.15),i*80)),
    match:   ()=> { tone(660,'sine',0.08,0.12); tone(880,'sine',0.08,0.1); },
    flip:    ()=> tone(440,'sine',0.04,0.08),
    react:   ()=> tone(1200,'sine',0.05,0.15),
  };
})();

// ── CUSTOM CURSOR ─────────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });
(function animCursor(){
  rx+=(mx-rx)*0.15; ry+=(my-ry)*0.15;
  dot.style.left  = mx+'px'; dot.style.top  = my+'px';
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animCursor);
})();

// ── BACKGROUND CANVAS ─────────────────────────────────────
(function initBg(){
  const c = document.getElementById('bgCanvas');
  const cx = c.getContext('2d');
  let W,H,t=0;
  const stars=Array.from({length:100},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.4+0.3,phase:Math.random()*Math.PI*2}));

  const resize=()=>{ W=c.width=innerWidth; H=c.height=innerHeight; };
  resize(); window.addEventListener('resize',resize);

  function draw(){
    cx.clearRect(0,0,W,H); t+=0.006;
    const hz=H*0.52;

    // Perspective grid
    for(let i=0;i<12;i++){
      const p=i/11, y=hz+Math.pow(p,1.4)*(H-hz);
      cx.beginPath(); cx.moveTo(0,y); cx.lineTo(W,y);
      cx.strokeStyle=`rgba(191,0,255,${p*0.45})`; cx.lineWidth=0.5; cx.stroke();
    }
    const cols=16;
    for(let i=0;i<=cols;i++){
      const xb=(i/cols)*W, alpha=0.25-Math.abs(i/cols-0.5)*0.3;
      cx.beginPath(); cx.moveTo(W/2,hz); cx.lineTo(xb,H);
      cx.strokeStyle=`rgba(0,240,255,${alpha})`; cx.lineWidth=0.5; cx.stroke();
    }

    // Scan pulse
    const sy=hz+((t*35)%(H-hz));
    const sg=cx.createLinearGradient(0,sy-18,0,sy+18);
    sg.addColorStop(0,'transparent'); sg.addColorStop(0.5,'rgba(255,45,120,0.10)'); sg.addColorStop(1,'transparent');
    cx.fillStyle=sg; cx.fillRect(0,sy-18,W,36);

    // Stars
    stars.forEach(s=>{
      const b=(Math.sin(t*2+s.phase)+1)/2;
      cx.beginPath(); cx.arc(s.x*W,s.y*hz*0.9,s.r*b,0,Math.PI*2);
      cx.fillStyle=`rgba(232,213,255,${b*0.6})`; cx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── BOOT SEQUENCE ─────────────────────────────────────────
const ASCII_ART = `
 ██████╗ ██╗██╗      ██████╗ ██╗   ██╗███╗  ██╗███████╗ ██████╗ ██████╗ ██╗ ██████╗
 ██╔══██╗██║██║     ██╔════╝ ██║   ██║████╗ ██║╚════██║██╔═══██╗██╔══██╗██║██╔════╝
 ██████╔╝██║██║     ██║  ███╗██║   ██║██╔██╗██║    ██╔╝██║   ██║██████╔╝██║██║  ███╗
 ██╔══██╗██║██║     ██║   ██║██║   ██║██║╚████║   ██╔╝ ██║   ██║██╔══██╗██║██║   ██║
 ██████╔╝██║███████╗╚██████╔╝╚██████╔╝██║ ╚███║   ██║  ╚██████╔╝██║  ██║██║╚██████╔╝
 ╚═════╝ ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚══╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝
`;

const BOOT_LOG = [
  '> BILGUNZORIG OS v∞.0 — MONGOLIAN EDITION',
  '> Initializing neon reactor..............  [OK]',
  '> Loading BILGUNZORIG personality matrix.  [OK]',
  '> Mounting Mongolian legend module.......  [OK]',
  '> Calibrating glitch engine v9.0.........  [OK]',
  '> Connecting to THE GRID.................  [OK]',
  '> Launching arcade subsystem.............  [OK]',
  '> SYSTEM READY — WELCOME, TRAVELER.',
];

async function runBoot() {
  const ascii = document.getElementById('bootAscii');
  const log   = document.getElementById('bootLog');
  const bar   = document.getElementById('bootBar');
  const boot  = document.getElementById('boot-screen');
  const site  = document.getElementById('site');
  let skip = false;
  const doSkip = ()=>{ skip=true; launch(); };
  document.addEventListener('keydown', doSkip, {once:true});
  document.addEventListener('click',   doSkip, {once:true});

  // ASCII art character by character
  let atxt='';
  for(let ch of ASCII_ART){
    if(skip) return;
    atxt+=ch; ascii.textContent=atxt;
    if(ch!==' '&&ch!=='\n') SFX.boot(100+Math.random()*200);
    await wait(ch==='\n'?20:8);
  }

  // Boot log
  let ltxt='', total=BOOT_LOG.join('').length, done=0;
  for(let line of BOOT_LOG){
    if(skip) return;
    for(let ch of line){
      if(skip) return;
      ltxt+=ch; log.textContent=ltxt; done++;
      bar.style.width=(done/total*100)+'%';
      if(Math.random()>0.7) SFX.boot(200+Math.random()*400);
      await wait(22);
    }
    ltxt+='\n'; log.textContent=ltxt;
    await wait(90);
  }

  bar.style.width='100%';
  SFX.win();
  await wait(700);
  launch();

  function launch(){
    boot.classList.add('out');
    site.classList.remove('hidden');
    setTimeout(()=>boot.style.display='none', 900);
    initAfterBoot();
  }
}

const wait = ms => new Promise(r=>setTimeout(r,ms));

// ── POST-BOOT INIT ────────────────────────────────────────
function initAfterBoot(){
  initTypewriter();
  initScrollReveal();
  initSoundHovers();
  initLetterClick();
  initSkillBars();
  initNav();
}

// ── TYPEWRITER ────────────────────────────────────────────
function initTypewriter(){
  const el = document.getElementById('taglineText');
  const phrases = [
    'MONGOLIAN DIGITAL WARRIOR',
    'BUILDER OF EPIC THINGS',
    'NEON GRID TRAVELER',
    'CONQUEROR OF THE INTERNET',
    'YOUR FAVORITE DEVELOPER',
  ];
  let pi=0,ci=0,del=false;
  const tick = ()=>{
    const p=phrases[pi];
    if(del){ el.textContent=p.slice(0,ci--); if(ci<0){del=false;pi=(pi+1)%phrases.length;ci=0;setTimeout(tick,350);return;} setTimeout(tick,35); }
    else { el.textContent=p.slice(0,++ci); if(ci===p.length){del=true;setTimeout(tick,2000);return;} setTimeout(tick,65); }
  };
  tick();
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal(){
  document.querySelectorAll('.sec-title,.sec-label,.astat,.skill-bar-item,.about-card-big,.contact-layout,.service-card').forEach(el=>el.classList.add('reveal'));
  const io = new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('on'),i*60);
        io.unobserve(e.target);
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

// ── SKILL BARS ────────────────────────────────────────────
function initSkillBars(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.skill-fill').forEach(f=>f.classList.add('animated'));
        io.unobserve(e.target);
      }
    });
  },{threshold:0.2});
  document.querySelectorAll('.skills-grid').forEach(el=>io.observe(el));
}

// ── HOVER SOUNDS ──────────────────────────────────────────
function initSoundHovers(){
  document.querySelectorAll('.btn,.gtab,.nlink,.astat,.letter,.mem-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>SFX.blip());
    el.addEventListener('click',()=>SFX.click());
  });
}

// ── LETTER CLICK CHAOS ────────────────────────────────────
function initLetterClick(){
  document.querySelectorAll('.letter').forEach((el,i)=>{
    el.addEventListener('click',()=>{
      SFX.eat();
      el.style.color=['var(--blue)','var(--green)','var(--yellow)','var(--purple)'][i%4];
      el.style.transform='translateY(-20px) rotate('+(Math.random()*40-20)+'deg) scale(1.4)';
      setTimeout(()=>{ el.style.color=''; el.style.transform=''; },600);
    });
  });
}

// ── NAV SMOOTH SCROLL ─────────────────────────────────────
function initNav(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      SFX.click();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
    });
  });
}

// ── GAME TAB SWITCH ───────────────────────────────────────
function switchGame(name){
  document.querySelectorAll('.game-panel').forEach(p=>p.classList.add('hidden'));
  document.querySelectorAll('.gtab').forEach(t=>t.classList.remove('active'));
  document.getElementById('game-'+name).classList.remove('hidden');
  event.currentTarget.classList.add('active');
  SFX.click();
  if(name==='memory' && !memoryStarted) {} // wait for button
}

// ════════════════════════════════
//  GAME 1: CYBER SNAKE
// ════════════════════════════════
const CELL=20, COLS=20, ROWS=20;
let snakeInterval=null, snake=[], food={}, dir={x:1,y:0}, nextDir={x:1,y:0};
let snakeScore=0, snakeBest=0;

function startSnake(){
  document.getElementById('snakeOverlay').classList.add('hidden');
  snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  dir={x:1,y:0}; nextDir={x:1,y:0};
  snakeScore=0; updateSnakeUI();
  placeFood();
  clearInterval(snakeInterval);
  snakeInterval=setInterval(snakeTick,110);
}

function placeFood(){
  let ok=false;
  while(!ok){
    food={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};
    ok=!snake.some(s=>s.x===food.x&&s.y===food.y);
  }
}

function snakeTick(){
  dir={...nextDir};
  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  // Wall wrap
  head.x=(head.x+COLS)%COLS; head.y=(head.y+ROWS)%ROWS;
  // Self collision
  if(snake.some(s=>s.x===head.x&&s.y===head.y)){
    SFX.die();
    clearInterval(snakeInterval);
    showSnakeDead(); return;
  }
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){
    snakeScore+=10; SFX.eat();
    if(snakeScore>snakeBest) snakeBest=snakeScore;
    updateSnakeUI(); placeFood();
  } else {
    snake.pop();
  }
  drawSnake();
}

function drawSnake(){
  const cv=document.getElementById('snakeCanvas');
  const cx=cv.getContext('2d');
  cx.fillStyle='#02000a'; cx.fillRect(0,0,cv.width,cv.height);

  // Grid dots
  cx.fillStyle='rgba(191,0,255,0.07)';
  for(let x=0;x<COLS;x++) for(let y=0;y<ROWS;y++){
    cx.fillRect(x*CELL+CELL/2-1,y*CELL+CELL/2-1,2,2);
  }

  // Food — pulsing neon dot
  const pulse=0.7+0.3*Math.sin(Date.now()/200);
  cx.fillStyle=`rgba(255,230,0,${pulse})`;
  cx.shadowColor='#ffe600'; cx.shadowBlur=15*pulse;
  cx.beginPath(); cx.arc(food.x*CELL+CELL/2,food.y*CELL+CELL/2,CELL/2-2,0,Math.PI*2); cx.fill();
  cx.shadowBlur=0;

  // Snake
  snake.forEach((seg,i)=>{
    const ratio=i/snake.length;
    const r=Math.round(255*(1-ratio));
    const b=Math.round(255*ratio);
    cx.fillStyle=i===0?'#ff2d78':`rgb(${r},0,${b})`;
    cx.shadowColor=i===0?'#ff2d78':'#bf00ff'; cx.shadowBlur=i===0?12:4;
    cx.fillRect(seg.x*CELL+1,seg.y*CELL+1,CELL-2,CELL-2);
  });
  cx.shadowBlur=0;
}

function showSnakeDead(){
  const ov=document.getElementById('snakeOverlay');
  ov.classList.remove('hidden');
  ov.innerHTML=`
    <div class="overlay-title">GAME OVER</div>
    <div class="overlay-sub">BILGUNZORIG scored <span class="hl">${snakeScore}</span> points!<br/>Best: ${snakeBest}</div>
    <button class="btn btn-neon" onclick="startSnake()">PLAY AGAIN</button>
  `;
}

function updateSnakeUI(){
  document.getElementById('snakeScore').textContent=snakeScore;
  document.getElementById('snakeBest').textContent=snakeBest;
}

document.addEventListener('keydown',e=>{
  const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},
             w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0},
             W:{x:0,y:-1},S:{x:0,y:1},A:{x:-1,y:0},D:{x:1,y:0}};
  const nd=map[e.key];
  if(nd && !(nd.x===-dir.x&&nd.y===-dir.y)) nextDir=nd;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
});

// Draw initial snake canvas
window.addEventListener('load',()=>{ const cv=document.getElementById('snakeCanvas'); const cx=cv.getContext('2d'); cx.fillStyle='#02000a'; cx.fillRect(0,0,cv.width,cv.height); });

// ════════════════════════════════
//  GAME 2: REACTION TEST
// ════════════════════════════════
let reactState='idle', reactTimer=null, reactStart=0, reactAttempts=0, reactBest=Infinity, reactHistory=[];

function handleReactionClick(){
  const arena=document.getElementById('reactionArena');
  const icon=document.getElementById('reactIcon');
  const msg=document.getElementById('reactMsg');
  const sub=document.getElementById('reactSub');
  const timeEl=document.getElementById('reactTime');

  if(reactState==='idle'){
    reactState='waiting';
    arena.className='reaction-arena waiting';
    icon.textContent='⏳'; msg.textContent='WAIT FOR GREEN...';
    sub.textContent="Don't click yet!"; timeEl.textContent='';
    const delay=1500+Math.random()*3000;
    reactTimer=setTimeout(()=>{
      reactState='go'; arena.className='reaction-arena go';
      icon.textContent='⚡'; msg.textContent='CLICK NOW!';
      sub.textContent=''; reactStart=Date.now(); SFX.react();
    },delay);
  } else if(reactState==='waiting'){
    clearTimeout(reactTimer);
    reactState='idle';
    arena.className='reaction-arena miss';
    icon.textContent='😅'; msg.textContent='TOO EARLY, BILGUNZORIG!';
    sub.textContent='Click to try again'; SFX.die();
    setTimeout(()=>{ arena.className='reaction-arena'; icon.textContent='👁'; msg.textContent='CLICK TO BEGIN'; sub.textContent="Test BILGUNZORIG's reaction speed"; },1200);
  } else if(reactState==='go'){
    const ms=Date.now()-reactStart;
    reactAttempts++;
    reactHistory.unshift(ms);
    if(reactHistory.length>6) reactHistory.pop();
    if(ms<reactBest) reactBest=ms;
    reactState='idle';
    arena.className='reaction-arena';
    icon.textContent=ms<250?'🔥':'⚡';
    msg.textContent=ms<200?'INSANE! BILGUNZORIG IS A MACHINE!':ms<300?'GREAT REFLEXES!':ms<500?'PRETTY GOOD!':'KEEP TRAINING!';
    timeEl.textContent=ms+'ms'; sub.textContent='Click to play again';
    document.getElementById('reactBest').textContent=(reactBest===Infinity?'—':reactBest+'ms');
    document.getElementById('reactAttempts').textContent=reactAttempts;
    SFX.win();

    // History chips
    const hist=document.getElementById('reactHistory');
    hist.innerHTML=reactHistory.map(t=>`<div class="rh-chip">${t}ms</div>`).join('');
  }
}

// ════════════════════════════════
//  GAME 3: MEMORY GRID
// ════════════════════════════════
const EMOJIS=['🔥','⚡','%^&**&','💜','🌐','🎮','🚀','◈'];
let memCards=[], memFlipped=[], memMatched=0, memMoves=0, memLocked=false, memoryStarted=false;

function startMemory(){
  memoryStarted=true;
  memFlipped=[]; memMatched=0; memMoves=0; memLocked=false;
  document.getElementById('memPairs').textContent=0;
  document.getElementById('memMoves').textContent=0;
  document.getElementById('memoryOverlay').classList.add('hidden');
  document.getElementById('memWin').classList.add('hidden');

  const symbols=[...EMOJIS,...EMOJIS].sort(()=>Math.random()-0.5);
  const grid=document.getElementById('memoryGrid');
  grid.innerHTML='';
  memCards=[];

  symbols.forEach((sym,i)=>{
    const card=document.createElement('div');
    card.className='mem-card'; card.dataset.sym=sym; card.dataset.idx=i;
    card.innerHTML=`<div class="card-back">?</div><div class="card-front">${sym}</div>`;
    card.addEventListener('click',()=>memFlip(card));
    grid.appendChild(card);
    memCards.push(card);
  });
}

function memFlip(card){
  if(memLocked||card.classList.contains('flipped')||card.classList.contains('matched')) return;
  SFX.flip();
  card.classList.add('flipped');
  memFlipped.push(card);

  if(memFlipped.length===2){
    memMoves++;
    document.getElementById('memMoves').textContent=memMoves;
    memLocked=true;
    const [a,b]=memFlipped;
    if(a.dataset.sym===b.dataset.sym){
      SFX.match();
      a.classList.add('matched'); b.classList.add('matched');
      memMatched++; memFlipped=[]; memLocked=false;
      document.getElementById('memPairs').textContent=memMatched;
      if(memMatched===8){
        setTimeout(()=>{
          SFX.win();
          document.getElementById('winSub').textContent=`Completed in ${memMoves} moves. BILGUNZORIG's brain = MASSIVE.`;
          document.getElementById('memWin').classList.remove('hidden');
        },400);
      }
    } else {
      setTimeout(()=>{
        a.classList.remove('flipped'); b.classList.remove('flipped');
        memFlipped=[]; memLocked=false;
      },800);
    }
  }
}

// ── CONTACT FORM ─────────────────────────────────────────
function submitForm(e){
  e.preventDefault();
  SFX.win();
  const btn=e.target.querySelector('button');
  btn.textContent='✓ BILGUNZORIG RECEIVED YOUR MESSAGE!';
  btn.style.background='linear-gradient(135deg,#00ff88,#00b860)';
  setTimeout(()=>{
    btn.textContent='SEND TO BILGUNZORIG ⟶';
    btn.style.background=''; e.target.reset();
  },3000);
}

// ── EASTER EGG ────────────────────────────────────────────
function easterEgg(){
  SFX.win();
  const modal=document.getElementById('eggModal');
  modal.classList.remove('hidden');
  const rain=document.getElementById('eggRain');
  rain.innerHTML='';
  const names=['BILGUNZORIG','B','B-MAN','LEGEND','🔥','⚡','◈'];
  for(let i=0;i<20;i++){
    const span=document.createElement('span');
    span.textContent=names[i%names.length]+' ';
    span.style.cssText=`font-family:var(--display);font-size:${0.6+Math.random()*0.6}rem;color:hsl(${Math.random()*360},100%,70%);`;
    rain.appendChild(span);
  }
}
function closeEgg(){
  document.getElementById('eggModal').classList.add('hidden');
}

// ── BOOT ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', runBoot);

// expose for inline
window.startSnake=startSnake;
window.startMemory=startMemory;
window.switchGame=switchGame;
window.handleReactionClick=handleReactionClick;
window.submitForm=submitForm;
window.easterEgg=easterEgg;
window.closeEgg=closeEgg;
