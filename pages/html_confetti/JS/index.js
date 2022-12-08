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
function getElementPos(element) {
    var bodyRect = document.body.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    function getDim(Dim) {
        return elementRect[Dim] - bodyRect[Dim];
    }
    return {
        x: getDim('left'),
        y: getDim('top'),
    };
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
        var size = window.innerHeight * this.origSize + 'px'
        this.element.style.width = size;
        this.element.style.height = size;
        this.element.style.position = 'absolute';
        this.element.style.transformStyle = 'preserve-3d'
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
        this.vel.vecData.y += 2 * lastUpdate;
        this.pos = this.pos.addVec(this.vel.multNum(window.innerHeight * lastUpdate));
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
            var newSize = window.innerHeight * perc + 'px';
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
            newConfetti.origSize = 0.011;
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
var lastTick = Date.now();
var lastUpdate;
function updateFPS() {
    var curTick = Date.now();
    lastUpdate = (curTick - lastTick) * 0.001;
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
        max: 6
    };
    if (shape === 'ball') {
        newConfettiEmitter.vel.min = 3;
    } else if (shape === 'cone') {
        newConfettiEmitter.vel.min = 1;
    }
    newConfettiEmitter.rotVel = {
        min: -10,
        max: 10
    };
    return newConfettiEmitter;
}
function addConfettiEmitter() {
    var parentElement = document.createElement('div');
    parentElement.style.position = 'relative';
    parentElement.style.overflow = 'visible';
    parentElement.style.zIndex = '1000';
    parentElement.style.width = '0px';
    parentElement.style.height = '0px';
    var element = document.createElement('div');
    element.className = 'confetti_main_container';
    element.style.width = '100%';
    element.style.height = '100%';
    parentElement.appendChild(element);
    var insertElement = document.body;
    insertElement.insertBefore(parentElement, insertElement.firstChild);
    function newCurEmitter() {
        var newConfettiEmitter = createNewConfettiEmitter();
        newConfettiEmitter.parentElement = element;
        return newConfettiEmitter;
    }
    {
        var newConfettiEmitter = newCurEmitter();
        newConfettiEmitter.pos = new Vector2(window.innerWidth * 0, window.innerHeight * 1);
        newConfettiEmitter.dir = 45;
        newConfettiEmitter.load();
        newConfettiEmitter.emit(emitAmount);
    }
    setTimeout(() => {
        var newConfettiEmitter = newCurEmitter();
        newConfettiEmitter.pos = new Vector2(window.innerWidth * 1, window.innerHeight * 1);
        newConfettiEmitter.dir = 135;
        newConfettiEmitter.load();
        newConfettiEmitter.emit(emitAmount);
    }, 1000);
}
setTimeout(addConfettiEmitter, 1000);
/*
var confettiSensors = [];
function updateConfettiSensors() {
    for ([_, func] of Object.entries(confettiSensors)) {
        func()
    }
}
function addConfettiSensor(element) {
    element.style.position = 'relative';
    element.style.overflow = 'visible';
    element.style.width = '0px';
    element.style.height = '0px';
    var parentElement = document.createElement('div');
    parentElement.className = 'confetti_main_container';
    parentElement.style.width = '100%';
    parentElement.style.height = '100%';
    element.appendChild(parentElement);
    var emitDelay = 2;
    var didEmit = false;
    var lastEmitTime = Date.now() - (emitDelay * 1000);
    var sensorDir = element.getAttribute('data-sensorDir');
    var confettiOffsetY = element.offsetHeight * 1;
    function newCurEmitter() {
        var newConfettiEmitter = createNewConfettiEmitter();
        newConfettiEmitter.parentElement = parentElement;
        return newConfettiEmitter;
    }
    function emit() {
        {
            var newConfettiEmitter = newCurEmitter();
            newConfettiEmitter.pos = new Vector2(element.offsetWidth * 0, confettiOffsetY);
            newConfettiEmitter.dir = 45;
            newConfettiEmitter.load();
            newConfettiEmitter.emit(emitAmount);
        }
        setTimeout(() => {
            var newConfettiEmitter = newCurEmitter();
            newConfettiEmitter.pos = new Vector2(element.offsetWidth * 1, confettiOffsetY);
            newConfettiEmitter.dir = 135;
            newConfettiEmitter.load();
            newConfettiEmitter.emit(emitAmount);
        }, 1000);
    }
    confettiSensors[confettiSensors.length] = function() {
        var curOff = window.scrollY;
        var allowOff = 2;
        var didEnter;
        var didLeave;
        if (sensorDir === 'top') {
            curOff -= getElementPos(element).y;
            curOff -= element.offsetHeight;
            curOff -= allowOff;
            didEnter = curOff <= 0;
            didLeave = curOff > 0;
        } else if (sensorDir === 'bottom') {
            curOff -= window.innerHeight;
            curOff += allowOff;
            didEnter = curOff >= 0;
            didLeave = curOff < 0;
        }
        console.log(curOff)
        if (didEnter === true && didEmit === false) {
            var checkTime = Date.now()
            if ((checkTime - lastEmitTime) * 0.001 > emitDelay) {
                didEmit = true;
                lastEmitTime = checkTime;
                emit();
            }
        } else if (didLeave === true && didEmit === true) {
            didEmit = false;
        }
    }
}
for (var [_, element] of Object.entries(document.getElementsByClassName('confetti_container'))) {
    addConfettiSensor(element);
}
document.body.onscroll = updateConfettiSensors;
updateConfettiSensors();
*/
/*
_______       _________       ________               
___    |____________  /____  ____  __ )__________  __
__  /| |_  __ \  __  /__  / / /_  __  |  __ \_  / / /
_  ___ |  / / / /_/ / _  /_/ /_  /_/ // /_/ /  /_/ / 
/_/  |_/_/ /_/\__,_/  _\__, / /_____/ \____/_\__, /  
                      /____/                /____/   
*/