function random(orig, target) {
    return lerp(orig, target, Math.random());
}
function randomInt(orig, target) {
    return Math.round(lerp(orig, target, Math.random()));
}
function randomExt() {
    return Math.random() - 0.5
}
function getNumInRange(dict) {
    return random(dict.min, dict.max);
}
function getStep(curAmount, count, remove) {
    var amount = curAmount - (count * remove);
    return [count, amount];
}
function getMaxStep(amount, remove) {
    var count = Math.floor(amount / remove);
    return getStep(amount, count, remove);
}
function lerp(A, B, T) {
    return A + (B - A) * T;
}
function customRoundNum(num, mult) {
    return Math.floor(num * mult) / mult;
}
function degToRad(deg) {
    return deg * (Math.PI / 180);
}
function radToDeg(rad) {
    return rad / (Math.PI / 180);
}
function fixRot(rot, max) {
    var newRot = rot;
    if (newRot >= max) {
        newRot -= max
    } else if (-newRot <= -max) {
        newRot += max
    }
    return newRot;
}
function mergeRads(origDir, dir) {
    return fixRot(origDir + dir, Math.PI);
}
function mergeDegs(origDir, dir) {
    return fixRot(origDir + dir, 360);
}
class Vector2 {
    constructor(x, y) {
        this.vecData = {
            x: x || 0,
            y: y || 0,
        }
    }
    get x() {
        return this.vecData.x;
    }
    get y() {
        return this.vecData.y;
    }
    get magnitude() {
        var tot = 0;
        for (var [_, val] of Object.entries(this.vecData)) {
            tot += Math.abs(val) ** 2;
        }
        return tot ** 0.5;
    }
    copyVec() {
        return new Vector2(this.vecData.x, this.vecData.y);
    }
    get unit() {
        var vec = this.copyVec()
        return vec.divNum(vec.magnitude);
    }
    multVec(tvec) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(this.vecData)) {
            vec.vecData[ind] *= tvec[ind];
        }
        return vec;
    }
    divVec(tvec) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] /= tvec[ind];
        }
        return vec;
    }
    addVec(tvec) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] += tvec[ind];
        }
        return vec;
    }
    subVec(tvec) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] -= tvec[ind];
        }
        return vec;
    }
    multNum(num) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] *= num;
        }
        return vec;
    }
    divNum(num) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] /= num;
        }
        return vec;
    }
    addNum(num) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] += num;
        }
        return vec;
    }
    subNum(num) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] -= num;
        }
        return vec;
    }
    toNorm() {
        var vec = this.copyVec();
        vec.vecData.x = Math.cos(vec.vecData.x);
        vec.vecData.y = -Math.sin(vec.vecData.y);
        return vec;
    }
}
class Vector3 {
    constructor(x, y, z) {
        this.vecData = {
            x: x || 0,
            y: y || 0,
            z: z || 0,
        }
    }
    get z() {
        return this.vecData.z;
    }
    get x() {
        return this.vecData.x;
    }
    get y() {
        return this.vecData.y;
    }
    get magnitude() {
        var tot = 0;
        for (var [_, val] of Object.entries(this.vecData)) {
            tot += Math.abs(val) ** 2;
        }
        return tot ** 0.5;
    }
    copyVec() {
        return new Vector3(this.vecData.x, this.vecData.y, this.vecData.z);
    }
    get unit() {
        var vec = this.copyVec()
        return vec.divNum(vec.magnitude);
    }
    multVec(tvec) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(this.vecData)) {
            vec.vecData[ind] *= tvec[ind];
        }
        return vec;
    }
    divVec(tvec) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] /= tvec[ind];
        }
        return vec;
    }
    addVec(tvec) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] += tvec[ind];
        }
        return vec;
    }
    subVec(tvec) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] -= tvec[ind];
        }
        return vec;
    }
    multNum(num) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] *= num;
        }
        return vec;
    }
    divNum(num) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] /= num;
        }
        return vec;
    }
    addNum(num) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] += num;
        }
        return vec;
    }
    subNum(num) {
        var vec = this.copyVec();
        for (var [ind, _] of Object.entries(vec.vecData)) {
            vec.vecData[ind] -= num;
        }
        return vec;
    }
    toNorm() {
        var vec = this.copyVec();
        vec.vecData.x = Math.cos(vec.vecData.x);
        vec.vecData.y = Math.sin(vec.vecData.y);
        vec.vecData.z = Math.sin(vec.vecData.z);
        return vec;
    }
}
function rotToVec(rot) {
    return new Vector2(Math.cos(rot), -Math.sin(rot));
}
function addRotVec(origVec, targetVec) {
    var vec = origVec.addVec(targetVec)
    function fixDim(dim) {
        vec[dim] = fixRot(vec[dim], 360);
    }
    fixDim('x');
    fixDim('y');
    fixDim('z');
    return vec;
}
class Confetti {
    constructor() {
        
    }
    load() {
        this.startTime = Date.now();
        this.element = document.createElement('div');
        this.element.className = 'confetti';
        var cols = [
            'rgb(255, 220, 0)',
            'rgb(224, 45, 0)',
            'rgb(0, 122, 204)',
            'rgb(64, 228, 255)',
            'rgb(153, 0, 43)',
            'rgb(255, 129, 0)',
            'rgb(0, 0, 100)',
        ];
        this.element.style.width = '10px';
        this.element.style.height = '10px';
        this.element.style.backgroundColor = cols[randomInt(0, cols.length - 1)];
        this.parentElement.appendChild(this.element);
        confetties[confetties.length] = this;
    }
    remove() {
        this.element.remove();
        confetties.splice(confetties.indexOf(this), 1)
    }
    updatePhysics() {
        this.vel = this.vel.multNum(Math.max(1 - (5 * lastUpdate), 0));
        this.vel.vecData.y += 2000 * lastUpdate;
        this.pos = this.pos.addVec(this.vel.multNum(lastUpdate));
        this.rot = addRotVec(this.rot, this.rotVel);
    }
    updateVisual() {
        this.element.style.transform = `translate(-50%, -50%) translate(${this.pos.x}px, ${this.pos.y}px) rotateY(${this.rot.y}deg) rotateX(${this.rot.x}deg) rotateZ(${this.rot.z}deg)`;
    }
    updateFade() {
        var offTime = (Date.now() - this.startTime) * 0.001;
        var startLerp = this.lifeTime - 1;
        if (offTime >= this.lifeTime) {
            this.remove()
        } else if (offTime >= startLerp) {
            var perc = lerp(this.origSize, 0, (offTime - startLerp) / (this.lifeTime - startLerp));
            var newSize = perc + 'px';
            this.element.style.width = newSize;
            this.element.style.height = newSize;
        }
    }
    update() {
        this.updatePhysics();
        this.updateVisual();
        this.updateFade();
    }
}

class ConfettiEmitter {
    constructor() {
        this.enabled = false;
    }
    load() {
        confettiEmitters[confettiEmitters.length] = this
    }
    remove() {
        confettiEmitters.splice(confettiEmitters.indexOf(this), 1)
    }
    emit(amount) {
        for (var i = 0; i < amount; i++) {
            var newConfetti = new Confetti();
            newConfetti.pos = this.pos;
            newConfetti.rot = new Vector3(random(0, 360), random(0, 360), random(0, 360));
            newConfetti.origSize = 10;
            newConfetti.lifeTime = getNumInRange(this.lifeTime);
            newConfetti.rotVel = new Vector3(random(this.rotVel.min, this.rotVel.max), random(this.rotVel.min, this.rotVel.max), random(this.rotVel.min, this.rotVel.max));
            var spreadExt = randomExt();
            newConfetti.vel = rotToVec(mergeRads(degToRad(this.dir), spreadExt * degToRad(this.spread))).multNum(getNumInRange(this.vel));
            newConfetti.parentElement = this.parentElement
            newConfetti.load();
        }
    }
    update() {
        var curTime = Date.now();
        var [amount, timeOff] = getMaxStep((curTime - this.lastUpdate) * 0.001, 1 / this.rate);
        if (amount > 0) {
            this.lastUpdate = Date.now() - timeOff;
            this.emit(amount);
        }
    }
    enable(bool) {
        if (this.enabled !== bool) {
            this.enabled = bool;
            if (this.enabled === true) {
                this.lastUpdate = Date.now();
            } else if (this.enabled === false) {
                this.lastUpdate = null;
            }
        }
    }
}

var mainElement = document.getElementById('main');
var fpsCounterElement = document.getElementById('fps_counter');
var avgDelCounterElement = document.getElementById('avg_del');
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
    fpsCounterElement.innerHTML = 'FPS: ' + customRoundNum(1 / avgDel, 10);
    avgDelCounterElement.innerHTML = 'Avg. Delay: ' + customRoundNum(avgDel, 10000);
    if (lastUpdates.length === 31) {
        lastUpdates.splice(0, 1);
    }
    lastTick = curTick;
}
var confetties = [];
var confettiEmitters = [];
function updateConfettiEmitters() {
    for (var [_, confettiEmitter] of Object.entries(confettiEmitters)) {
        confettiEmitter.update();
    }
}
function updateConfetties() {
    for (var [_, confetti] of Object.entries(confetties)) {
        confetti.update();
    }
}
function update() {
    updateFPS();
    updateConfettiEmitters();
    updateConfetties();
    window.requestAnimationFrame(update);
}
update();
var confettiParentElement = document.getElementById('confetti_container');
var emitterType = 'finish';
var shape = 'ball';
var emitAmount;
if (shape === 'ball') {
    emitAmount = 50;
} else if (shape === 'cone') {
    emitAmount = 100;
}
function createNewConfettiEmitter() {
    var newConfettiEmitter = new ConfettiEmitter();
    newConfettiEmitter.rot = new Vector3();
    newConfettiEmitter.spread = 45;
    newConfettiEmitter.lifeTime = {
        min: 1,
        max: 2
    };
    newConfettiEmitter.vel = {
        max: 5000
    };
    if (shape === 'ball') {
        newConfettiEmitter.vel.min = 2500;
    } else if (shape === 'cone') {
        newConfettiEmitter.vel.min = 1000;
    }
    newConfettiEmitter.rotVel = {
        min: -10,
        max: 10
    };
    newConfettiEmitter.parentElement = confettiParentElement;
    return newConfettiEmitter;
}
if (true) {
    var scrollElement = document.body;
    var emitDelay = 2;
    var didEmit = false;
    var lastEmitTime = Date.now();
    function emit() {
        {
            var newConfettiEmitter = createNewConfettiEmitter();
            newConfettiEmitter.pos = new Vector2(window.innerWidth * 0, window.innerHeight * 1);
            newConfettiEmitter.dir = 45;
            newConfettiEmitter.load();
            newConfettiEmitter.emit(emitAmount);
        }
        setTimeout(() => {
            var newConfettiEmitter = createNewConfettiEmitter();
            newConfettiEmitter.pos = new Vector2(window.innerWidth * 1, window.innerHeight * 1);
            newConfettiEmitter.dir = 135;
            newConfettiEmitter.load();
            newConfettiEmitter.emit(emitAmount);
        }, 1000);
    }
    scrollElement.onscroll = function() {
        var curOff = scrollElement.offsetHeight - window.scrollY - window.innerHeight;
        if (curOff <= 0 && didEmit === false) {
            var checkTime = Date.now()
            if ((checkTime - lastEmitTime) * 0.001 > emitDelay) {
                didEmit = true;
                lastEmitTime = checkTime;
                emit();
            }
        } else if (curOff > 0 && didEmit === true) {
            didEmit = false;
        }
    }
} else {
    if (emitterType === 'test') {
        var newConfettiEmitter = createNewConfettiEmitter();
        newConfettiEmitter.pos = new Vector2(window.innerWidth * 0, window.innerHeight * 1);
        newConfettiEmitter.dir = 45;
        newConfettiEmitter.load();
        var type = "emitter";
        if (type === "emitter") {
            function wait() {
                newConfettiEmitter.emit(emitAmount);
                setTimeout(wait, 1000);
            }
            wait();
        } else if (type === "constant") {
            newConfettiEmitter.rate = 50;
            newConfettiEmitter.enable(true);
        }
    } else if (emitterType === 'finish loop') {
        function wait() {
            {
                var newConfettiEmitter = createNewConfettiEmitter();
                newConfettiEmitter.pos = new Vector2(window.innerWidth * 0, window.innerHeight * 1);
                newConfettiEmitter.dir = 45;
                newConfettiEmitter.load();
                newConfettiEmitter.emit(emitAmount);
            }
            setTimeout(() => {
                var newConfettiEmitter = createNewConfettiEmitter();
                newConfettiEmitter.pos = new Vector2(window.innerWidth * 1, window.innerHeight * 1);
                newConfettiEmitter.dir = 135;
                newConfettiEmitter.load();
                newConfettiEmitter.emit(emitAmount);
            }, 1000);
            setTimeout(wait, 2000);
        }
        wait();
    }
}