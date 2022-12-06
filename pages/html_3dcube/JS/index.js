var fpsCounterElement = document.getElementById('fps_counter');
var lastUpdates = [];
var lastTick = Date.now();
var lastUpdate;
function updateFPS() {
    var curTick = Date.now();
    lastUpdate = (curTick - lastTick) * 0.001;
    lastUpdates[lastUpdates.length] = lastUpdate;
    var totDel = 0;
    for (var [_, del] of Object.entries(lastUpdates)) {
        totDel += del;
    }
    var avgDel = totDel / lastUpdates.length;
    var baseFPS = 1 / avgDel;
    var mult = 10;
    var FPS = Math.floor(baseFPS * mult) / mult;
    fpsCounterElement.innerHTML = 'FPS: ' + FPS;
    if (lastUpdates.length === 31) {
        lastUpdates.splice(0, 1);
    }
    lastTick = curTick;
}
var transData = {
    pos: {
        x: 0,

        y: 0,

        z: 0
    },

    rot: {
        x: 0,

        y: 0,

        z: 0,
    }
}
var input = {
    w: false,

    s: false,

    a: false,

    d: false,
}
function addrot(dim, add) {
    var newRot = transData.rot[dim] + add;
    if (newRot > 360) {
        newRot -= 360
    }
    transData.rot[dim] = newRot;
}
function updateInput() {
    var amount = 45 * lastUpdate;
    if (input.w === true) {
        addrot('x', amount)
    }
    if (input.s === true) {
        addrot('x', -amount)
    }
    if (input.a === true) {
        addrot('y', amount)
    }
    if (input.d === true) {
        addrot('y', -amount)
    }
}
var cubeElement = document.getElementById('cube')
function updateCube() {
    cubeElement.style.transform = `translateZ(-100px) rotateY(${transData.rot.y}deg) rotateX(${transData.rot.x}deg) rotateZ(${transData.rot.z}deg)`;
}
function update() {
    updateFPS();
    updateInput();
    updateCube();
    window.requestAnimationFrame(update);
}
update();
document.addEventListener('keyup', function(event) {
    input[event.key] = false;
});
document.addEventListener('keydown', function(event) {
    input[event.key] = true;
});