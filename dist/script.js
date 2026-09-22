const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('#menu');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu?.classList.toggle('open',!open)});
menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
const siteHeader=document.querySelector('.site-header');
const syncHeader=()=>siteHeader?.classList.toggle('scrolled',window.scrollY>24);
syncHeader();window.addEventListener('scroll',syncHeader,{passive:true});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu?.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}});
document.addEventListener('click',event=>{if(menu?.classList.contains('open')&&!menu.contains(event.target)&&!toggle?.contains(event.target)){menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}});

const target=new Date('2027-09-18T08:00:00-03:00').getTime();
function updateCountdown(){const distance=Math.max(0,target-Date.now());document.querySelector('[data-days]').textContent=String(Math.floor(distance/86400000));document.querySelector('[data-hours]').textContent=String(Math.floor(distance%86400000/3600000)).padStart(2,'0');document.querySelector('[data-minutes]').textContent=String(Math.floor(distance%3600000/60000)).padStart(2,'0')}
updateCountdown();setInterval(updateCountdown,60000);

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

let audioContext=null;
let soundscapeTimer=null;
let ambience=null;
const soundButton=document.querySelector('.sound-toggle');
const soundLabel=document.querySelector('[data-sound-label]');
function boneClick(ctx,when,volume=.08){const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(1150+Math.random()*500,when);osc.frequency.exponentialRampToValueAtTime(120,when+.085);gain.gain.setValueAtTime(volume,when);gain.gain.exponentialRampToValueAtTime(.0001,when+.09);osc.connect(gain).connect(ctx.destination);osc.start(when);osc.stop(when+.1)}
function startSoundscape(){audioContext=new(window.AudioContext||window.webkitAudioContext)();const ctx=audioContext;const master=ctx.createGain();master.gain.value=.13;master.connect(ctx.destination);const low=ctx.createOscillator();const lowGain=ctx.createGain();low.type='sine';low.frequency.value=46;lowGain.gain.value=.32;low.connect(lowGain).connect(master);low.start();const high=ctx.createOscillator();const highGain=ctx.createGain();high.type='sine';high.frequency.value=92;highGain.gain.value=.08;high.connect(highGain).connect(master);high.start();ambience={low,high,master};const sequence=()=>{const now=ctx.currentTime+.05;[0,.12,.31,.55,1.1,1.52,2.05].forEach((delay,index)=>boneClick(ctx,now+delay,.035+(index%3)*.012))};sequence();soundscapeTimer=setInterval(sequence,7000)}
function stopSoundscape(){clearInterval(soundscapeTimer);soundscapeTimer=null;if(ambience){ambience.master.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.25);setTimeout(()=>audioContext?.close(),300)}audioContext=null;ambience=null}
soundButton?.addEventListener('click',()=>{const active=soundButton.getAttribute('aria-pressed')==='true';if(active){stopSoundscape();soundButton.setAttribute('aria-pressed','false');soundLabel.textContent='Ativar som'}else{startSoundscape();soundButton.setAttribute('aria-pressed','true');soundLabel.textContent='Desativar som'}});

const heroVideo=document.querySelector('.hero-film');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(heroVideo){
  const showPoster=()=>heroVideo.classList.remove('is-playing');
  const startHero=()=>{
    if(reducedMotion.matches){heroVideo.pause();showPoster();return;}
    heroVideo.muted=true;
    heroVideo.play().catch(showPoster);
  };
  heroVideo.addEventListener('playing',()=>{
    const reveal=()=>{if(!heroVideo.paused && heroVideo.readyState>=2)heroVideo.classList.add('is-playing');};
    if('requestVideoFrameCallback' in heroVideo)heroVideo.requestVideoFrameCallback(reveal);
    else reveal();
  });
  heroVideo.addEventListener('waiting',showPoster);
  heroVideo.addEventListener('stalled',showPoster);
  heroVideo.addEventListener('pause',showPoster);
  heroVideo.addEventListener('error',showPoster);
  reducedMotion.addEventListener('change',startHero);
  startHero();
}
