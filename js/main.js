/*
 * SplashOne / Air Superiority arcade cabinet
 * Adapted from "Tetris Arcade Game - Atari 1988" by Josetxu
 * https://codepen.io/josetxu/pen/bGKqxyR
 *
 * Kept from the original: sound + music toggles, view/game mode, glass toggle,
 * joystick lock, centre-scene, keyboard-driven joystick/button animation,
 * camera (drag to rotate, wheel/pinch to zoom, double-click to auto-rotate).
 *
 * Removed: the Tetris game itself (canvas loop, playfield, pieces, score,
 * lines, rounds, stats, next piece, game-over screen). The monitor now shows
 * the supplied AIR SUPERIORITY artwork.
 *
 * Re-wired: the original sound effects now fire from cabinet interactions
 * (see "SPLASHONE: interactions" below).
 */

let sceneCamera = document.querySelector("section[data-camera]");
let scene = document.querySelector(".scene");

function elem(id) {
	return document.getElementById(id);
}

/*** AUDIO (original elements and files) ***/

var aCredit = elem("a-credit");
var aMusic = elem("a-music1");
var aLine = elem("a-line");
var aRound = elem("a-round");
var aGameOver = elem("a-gameover");

// Restart a sound effect from the beginning; ignore autoplay/network rejections.
function playSfx(audio) {
	try {
		audio.currentTime = 0;
	} catch (e) {}
	var p = audio.play();
	if (p && p.catch) p.catch(function () {});
}

function toggleSound() {
	elem("sound").classList.toggle("off");
	if (elem("sound").classList.contains("off"))
		aLine.volume = aRound.volume = aGameOver.volume = aCredit.volume = 0;
	else aLine.volume = aRound.volume = aGameOver.volume = aCredit.volume = 1;
}

function togglePlay() {
	elem("music").classList.toggle("off");
	if (aMusic.paused) {
		var p = aMusic.play();
		if (p && p.catch) p.catch(function () {});
	} else {
		aMusic.pause();
	}
}

/*** CABINET UI (original) ***/

function toggleView() {
	elem("content").classList.toggle("game-mode");
	elem("modes").classList.toggle("game");
	elem("center-scene").click();
}

function toggleGlass() {
	elem("glass").classList.toggle("hide");
	elem("front-glass").classList.toggle("hide");
}

function toggleJoystick() {
	elem("block-joystick").classList.toggle("blocking");
	elem("controller").classList.toggle("layers");
}

function centerScene() {
	scene.style.left = 0;
	scene.style.top = 0;
	sceneCamera.style = "--scale:85";
}

/*** SPLASHONE: interactions ***/

var credits = 0;
var playing = false;
var gameOverTimer = null;
var screenEl = elem("game-screen");

function controlsLocked() {
	return elem("block-joystick").classList.contains("blocking");
}

// Re-trigger a one-shot CSS animation class on the screen.
function pulseScreen(name) {
	screenEl.classList.remove("credit", "fire");
	void screenEl.offsetWidth;
	screenEl.classList.add(name);
}

// Coin slot: original credit sound. (The original reloaded the page to restart
// Tetris; here it just adds a credit and flashes the screen.)
function newCredit() {
	credits++;
	playSfx(aCredit);
	pulseScreen("credit");
}

elem("reload").addEventListener("click", function (e) {
	e.preventDefault();
	newCredit();
});

// Red button: with a credit banked the first press plays the original
// "round start" jingle; after that each press plays the original "line" effect.
// A started game ends after 20s without input and plays the original
// "game over" sound once.
function pressButton() {
	if (controlsLocked()) return;
	elem("btn").className = "pressed";
	if (!playing && credits > 0) {
		credits--;
		playing = true;
		playSfx(aRound);
		pulseScreen("credit");
	} else {
		playSfx(aLine);
		pulseScreen("fire");
	}
	if (playing) armGameOver();
}

function releaseButton() {
	elem("btn").className = "";
}

function armGameOver() {
	clearTimeout(gameOverTimer);
	gameOverTimer = setTimeout(function () {
		playing = false;
		if (!elem("sound").classList.contains("off")) playSfx(aGameOver);
	}, 20000);
}

function moveJoystick(dir) {
	if (controlsLocked()) return;
	elem("joystick").className = "m-" + dir;
	if (playing) armGameOver();
}

function releaseJoystick() {
	elem("joystick").className = "";
}

// Mouse / touch on the physical controls
var btnBase = document.querySelector(".btn-base");
btnBase.addEventListener("pointerdown", pressButton);
elem("joystick").addEventListener("pointerdown", function (e) {
	var r = this.getBoundingClientRect();
	moveJoystick(e.clientX < r.left + r.width / 2 ? "left" : "right");
});
window.addEventListener("pointerup", function () {
	releaseButton();
	releaseJoystick();
});

// Keyboard (same keys as the original)
document.addEventListener("keydown", function (e) {
	if (e.repeat) return;

	// left / right / down arrows move the joystick
	if (e.which === 37) moveJoystick("left");
	if (e.which === 39) moveJoystick("right");
	if (e.which === 40) moveJoystick("down");

	// up arrow or space presses the red button
	if (e.which === 38 || e.which === 32) pressButton();

	// C or 5 inserts a coin (5 is the classic arcade coin key)
	if (e.which === 67 || e.which === 53) newCredit();

	// Esc re-centres the cabinet
	if (e.which === 27) {
		scene.style.left = 0;
		scene.style.top = 0;
		sceneCamera.style = "--scale:80";
	}
});

document.addEventListener("keyup", function () {
	releaseJoystick();
	releaseButton();
});

/*** CAMERA SYSTEM (original) ***/

window.addEventListener("load", () => {
	new Camera()
		.setOptimalPerspective()
		.with({
			debug: false,
			zoom: {
				range: [60, 200]
			},
			rotate: {
				speed: 1.2
			}
		})
		.init();
});

/*** SET FOCUS (original) ***/
window.addEventListener("load", () => {
	window.focus();
});
window.addEventListener(
	"keydown",
	function (e) {
		if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
			e.preventDefault();
		}
	},
	false
);

// SPLASHONE: double-clicking a control should not start the camera's auto-rotate
[elem("reload"), btnBase, elem("joystick")].forEach(function (el) {
	el.addEventListener("dblclick", function (e) {
		e.stopPropagation();
	});
});
