var time = new Date();
var deltaTime = 0;
var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempohastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;

// Aquí va la seccion de revisar si el estado de JS es en carga o se tiene que avanzar en el tiempo con init
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(Init, 1);
} else {
  document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
  time = new Date();
  Start();
  Loop();
}

function Loop() {
  deltaTime = (new Date() - time) / 1000;
  time = new Date();
  Update();
  requestAnimationFrame(Loop);
}

function Start() {
  gameOver = document.querySelector(".game-over");
  suelo = document.querySelector(".suelo");
  contenedor = document.querySelector(".contenedor");
  textoScore = document.querySelector(".score");
  dino = document.querySelector(".dino");
  document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
  if(parado) return;

  
  moverSuelo();
  moverDinosaurio();
  decidirCrearObstaculos();
  moverObstaculos();
  detectarColision();

  velY -= gravedad * deltaTime;
}

function HandleKeyDown(event) {
  if (event.keyCode == 32) {
    Saltar();
  }
}

function Saltar() {
  if (dinoPosY === sueloY) {
    saltando = true;
    velY = impulso;
    dino.classList.remove("dino-corriendo");
  }
}

function estrellarse(){
  dino.classList.remove("dino-corriendo")
  dino.classList.add("dino-estrellado")
  parado = true
}

function moverDinosaurio() {
  dinoPosY += velY * deltaTime;
  if (dinoPosY < sueloY) {
    tocarSuelo();
  }
  dino.style.bottom = dinoPosY + "px";
}

function moverSuelo() {
  sueloX += calcularDesplazamiento();
  suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function tocarSuelo() {
  dinoPosY = sueloY;
  velY = 0;
  if (saltando) {
    dino.classList.add("dino-corriendo");
  }
  saltando = false;
}

function decidirCrearObstaculos() {
  tiempohastaObstaculo -= deltaTime;
  if (tiempohastaObstaculo <= 0) {
    crearObstaculo();
  }
}

function moverObstaculos() {
  for (let index = obstaculos.length - 1; index >= 0; index--) {
    if (obstaculos[index].posX < -obstaculos[index].clientWidth) {
      obstaculos[index].parentNode.removeChild(obstaculos[index]);
      obstaculos.splice(index, 1);
      ganarPuntos();
    } else {
      obstaculos[index].posX -= calcularDesplazamiento();
      obstaculos[index].style.left = obstaculos[index].posX + "px";
    }
  }
}

function ganarPuntos() {
  score++;
  textoScore.innerText = score
  if(score == 5){
    gameVel=1.5
    contenedor.classList.add("mediodia")
  }else if(score == 10){
    gameVel = 2
    contenedor.classList.remove("mediodia")
    contenedor.classList.add("tarde")
  }else if(score == 20){
    gameVel = 3
    contenedor.classList.remove("tarde")
    contenedor.classList.add("noche")
  }
  suelo.style.animationDuration = (3/gameVel)+"s"
}

function detectarColision() {
  for (let index = 0; index < obstaculos.length; index++) {
    if (obstaculos[index].posX > dinoPosX + dino.clientWidth) {
      //EVASION
      break;
    } else {
      if (isCollision(dino, obstaculos[index], 10, 30, 15, 20)) {
        GameOver();
      }
    }
  }
}

function crearObstaculo() {
  var obstaculo = document.createElement("div");
  contenedor.appendChild(obstaculo);
  obstaculo.classList.add("cactus");
  if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
  obstaculo.posX = contenedor.clientWidth;
  obstaculo.style.left = contenedor.clientWidth + "px";

  obstaculos.push(obstaculo);
  tiempohastaObstaculo =
    tiempoObstaculoMin +
    (Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin)) / gameVel;
}

function calcularDesplazamiento() {
  return velEscenario * deltaTime * gameVel;
}

function isCollision(a,b,paddingTop,paddingRight,paddingBottom,paddingLeft) {
  var aRect = a.getBoundingClientRect()
  var bRect = b.getBoundingClientRect()

  return !(
    ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
      (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
      ((aRect.left + aRect.width - paddingRight) < bRect.left)||
      (aRect.left + paddingLeft > (bRect.left+bRect.width))
    
  )
}

function GameOver() {
  estrellarse()
  gameOver.style.display = "block"
}