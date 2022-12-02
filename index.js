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
        this.vel = this.vel.multNum(1 - (5 * lastUpdate));
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

var lastUpdates = [];
var lastTick = Date.now();
var lastUpdate;
function updateFPS() {
    var curTick = Date.now();
    lastUpdate = (curTick - lastTick) * 0.001;
    lastUpdates[lastUpdates.length] = lastUpdate;
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





/*--------------------------------------------------*/





var unitConvs = {
    kg: 0.001,
    hg: 0.01,
    g: 1,
    mg: 1000,
}

var navBarButtonsData = {
    enabled: false,
    shadowelement: false,
};

var mouseData;

function getElementStyle(element) {
    return document.defaultView.getComputedStyle(element);
}

function getElementStyleProp(element, prop) {
    return getElementStyle(element).getPropertyValue(prop);
}

function getDeviceType() {
    var ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return [false, "tablet"];
    } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return [false, "mobile"];
    } else {
        return [true, "desktop"];
    }
}

function mouseMove(event) {
    mouseData = event;
}

function lerp(A, B, T) {
    return A + (B - A) * T;
}

function toGrams(amount, unit) {
    return amount * unitConvs[unit];
}

function setButtonAvailable(state) {
    'use strict';
    var icon;
    if (state === true) {
        icon = 'pointer';
    } else if (state === false) {
        icon = 'default';
    }
    document.body.style.cursor = icon;
}

function createButton(responseType, element, funcs) {
    'use strict';
    var origColStr;
    var baseCol = {};
    var cols = {};
    function doAction(name) {
        if (funcs != null) {
            var action = funcs[name]
            if (action != null) {
                action();
            }
        }
    }
    function buttonEvent() {
        if (responseType === 'backgroundColor') {
            var [name, updateCol] = arguments
            function updateCols() {
                var checkColStr = getElementStyleProp(element, 'background-color');
                if (checkColStr != null) {
                    origColStr = checkColStr;
                    var colStr = checkColStr;
                    colStr = colStr.replaceAll(', ', '');
                    colStr = colStr.substring(4, colStr.length);
                    colStr = colStr.substring(0, colStr.length - 1);
                    var lastInd = 0;
                    function getV() {
                        var newInd = lastInd + 3;
                        var result = Number(colStr.substring(lastInd, newInd));
                        lastInd = newInd;
                        return result;
                    }
                    baseCol.r = getV();
                    baseCol.g = getV();
                    baseCol.b = getV();
                } else {
                    origColStr = 'rgb(255, 255, 255)';
                    baseCol.r = 255;
                    baseCol.g = 255;
                    baseCol.b = 255;
                }
                cols.orig = origColStr;
                cols.hover = `rgb(${baseCol.r * 0.9}, ${baseCol.g * 0.9}, ${baseCol.b * 0.9})`;
                cols.click = `rgb(${baseCol.r * 0.8}, ${baseCol.g * 0.8}, ${baseCol.b * 0.8})`;
            }
            if (updateCol === true) {
                updateCols();
            }
            element.style.backgroundColor = cols[name];
        } else if (responseType === 'textDecoration') {
            var [name] = arguments;
            var textDecLine;
            var textDecStyle;
            var textDecThickness;
            var textDecColor;
            if (name === 'orig') {
                textDecLine = 'none';
                textDecStyle = 'solid';
                textDecThickness = '0px';
                textDecColor = 'rgb(255, 255, 255)';
            } else if (name === 'hover') {
                textDecLine = 'underline';
                textDecStyle = 'solid';
                textDecThickness = '1px';
                textDecColor = 'rgb(255, 255, 255)';
            } else if (name === 'click') {
                textDecLine = 'underline';
                textDecStyle = 'solid';
                textDecThickness = '1px';
                textDecColor = 'rgb(255, 255, 255)';
            }
            element.style.textDecorationLine = textDecLine;
            element.style.textDecorationStyle = textDecStyle;
            element.style.textDecorationThickness = textDecThickness;
        }
    }
    element.onmouseenter = function () {
        setButtonAvailable(true);
        buttonEvent('hover', true);
        doAction('enter');
    };
    element.onmouseleave = function () {
        setButtonAvailable(false);
        buttonEvent('orig', false);
        doAction('leave');
    };
    element.onmousedown = function () {
        buttonEvent('click', false);
        doAction('down');
        var newConfettiEmitter = new ConfettiEmitter();
        newConfettiEmitter.rot = new Vector3();
        newConfettiEmitter.pos = new Vector2();
        newConfettiEmitter.dir = 90;
        newConfettiEmitter.spread = 45;
        newConfettiEmitter.lifeTime = {
            min: 1,
            max: 2
        };
        newConfettiEmitter.vel = {
            min: 2500,
            max: 5000
        };
        newConfettiEmitter.rotVel = {
            min: -15,
            max: 15
        };
        newConfettiEmitter.parentElement = element;
        newConfettiEmitter.emit(50);
        newConfettiEmitter.remove();
    };
    element.onmouseup = function () {
        buttonEvent('hover', false);
        doAction('up');
    };
}

function bottomSectionItemFunc(elementData, element) {
    var text = elementData.attributes.text;
    var html = `
    <div class="scroller_bottom_section_item_text">
        ${text}
    </div>
    `;
    element.innerHTML = html;
    createButton('textDecoration', element.querySelector('.scroller_bottom_section_item_text'));
}

function bottomSectionFunc(elementData, element) {
    var text = elementData.attributes.text;
    var html = `
    <div class="scroller_bottom_section_text_container">
        <div class="scroller_bottom_section_text">
            ${text}
        </div>
    </div>
    <div class="scroller_bottom_section_items_container">

    </div>
    `;
    element.innerHTML = html;
    var parent = element.querySelector('.scroller_bottom_section_items_container');
    var template = elementData.objectData;
    for (var [_, newElementData] of Object.entries(template.objectData)) {
        makeHTMLElement(template, newElementData, parent);
    }
}

/* HTMLTemplates er en liste med data og informasjon om elementer dettet scriptet skal lage */

var HTMLTemplates = [
    {
        type: 'list',
        parentType: 'id',
        parent: 'nav_bar_buttons',
        idType: 'global',
        id: 'nav_bar_button',
        func: function(elementData, element) {
            var text = elementData.attributes.text;
            var html = `
            <div class="nav_bar_button_text">
                ${text}
            </div>
            `;
            element.innerHTML = html;
            createButton('backgroundColor', element);
        },
        objectData: [
            {
                attributes: {
                    text: 'Get the app'
                },
            },
            {
                attributes: {
                    text: 'Products'
                },
            },
            {
                attributes: {
                    text: 'Why us'
                },
            },
            {
                attributes: {
                    text: 'About us'
                },
            },
            {
                attributes: {
                    text: 'Jobs'
                },
            },
            {
                attributes: {
                    text: 'Stores'
                },
            },
            {
                attributes: {
                    text: 'Contact'
                },
            },
        ]
    },
    {
        type: 'list',
        parentType: 'id',
        parent: 'scroller_products_products',
        idType: 'global',
        id: 'scroller_products_product',
        func: function(elementData, element) {
            var html = `
            <div class="scroller_products_product_image_container">
                <img class="scroller_products_product_image" alt="pablo" src='${elementData.attributes.image}'>
            </div>
            <div class="scroller_products_product_info_container">
                <div class="scroller_products_product_info">
                    <div class="scroller_products_product_name">
                        ${elementData.attributes.text}
                    </div>
                    <div class="scroller_products_product_price">
                        ${'420.69$'}
                    </div>
                </div>
            </div>
            `;
            element.innerHTML = html;
            var img = element.querySelector('img');
            img.onload = function () {
                var width = img.naturalWidth;
                var height = img.naturalHeight;
                if (width > height) {
                    img.style.height = '100%';
                } else if (width < height) {
                    img.style.width = '100%';
                } else if (width === height) {
                    img.style.width = '100%';
                }
            };
            var active = false;
            var hoverDiv;
            createButton('backgroundColor', element, {
                enter: function() {
                    active = true;
                    hoverDiv = document.createElement('div');
                    hoverDiv.className = 'scroller_product_hover'
                    hoverDiv.innerHTML = `
                    <div class="product_hover_title">
                        Ingredients
                    </div>
                    <div class="product_hover_ingredients">

                    </div>
                    <div class="product_hover_total">
                    </div>
                    `;
                    var productParent = hoverDiv.querySelector('.product_hover_ingredients')
                    function makeProduct(parentElement, name, amount, unit, nameClass, amountClass, unitClass) {
                        var ingredientElement = document.createElement('div');
                        ingredientElement.className = 'product_hover_ingredient';
                        ingredientElement.innerHTML = `
                        <div class="${nameClass}">
                            ${name}
                        </div>
                        <div class="${amountClass}">
                            ${amount}
                        </div>
                        <div class="${unitClass}">
                            ${unit}
                        </div>
                        `;
                        parentElement.appendChild(ingredientElement);
                    }
                    var totalAmount = 0;
                    for (var [_, ingredient] of Object.entries(elementData.attributes.ingredients)) {
                        totalAmount += toGrams(ingredient.amount, ingredient.unit)
                        makeProduct(productParent, ingredient.name, ingredient.amount, ingredient.unit, 'product_hover_ingredient_name', 'product_hover_ingredient_amount', 'product_hover_ingredient_unit')
                    }
                    makeProduct(hoverDiv.querySelector('.product_hover_total'), 'Total', totalAmount, 'g', 'product_total_name', 'product_total_amount', 'product_total_unit')
                    getElementFromID('screen_ui_visual').appendChild(hoverDiv);
                    var posLerpPerc = 0.2;
                    var rotLerpPerc = 0.2;
                    var rotAmount = 1;
                    var lastX = mouseData.clientX;
                    var lastY = mouseData.clientY;
                    var lastRotX = 0;
                    var lastRotY = 0;
                    function updateHover() {
                        var newX = mouseData.clientX;
                        var newY = mouseData.clientY;
                        var rotX = (newY - lastY) * rotAmount;
                        var rotY = -(newX - lastX) * rotAmount;
                        lastX = lerp(lastX, newX, posLerpPerc);
                        lastY = lerp(lastY, newY, posLerpPerc);
                        lastRotX = lerp(lastRotX, rotX, rotLerpPerc);
                        lastRotY = lerp(lastRotY, rotY, rotLerpPerc);
                        var cenX = hoverDiv.offsetWidth * 0.5;
                        var cenY = hoverDiv.offsetHeight * 0.5;
                        hoverDiv.style.transform = `translate(${lastX}px, ${lastY}px) translate(${-cenX}px, ${-cenY}px) rotateY(${lastRotY}deg) rotateX(${lastRotX}deg) translate(${cenX}px, ${cenY}px)`;
                        if (active === true) {
                            window.requestAnimationFrame(updateHover);
                        }
                    }
                    updateHover();
                },
                leave: function() {
                    active = false;
                    hoverDiv.remove()
                },
            });
            //parentElement.width = getTextMetrics(text, 'sans-serif').width
        },
        objectData: [
            {
                attributes: {
                    text: 'Jello Shot',
                    image: 'https://img.delo-vcusa.ru/2020/06/kompot-iz-revenya-s-karkade-i-imbiryom.jpg',
                    ingredients: [
                        {
                            name: 'Fat',
                            amount: 35,
                            unit: 'g'
                        },
                        {
                            name: 'Carbs',
                            amount: 50,
                            unit: 'g'
                        },
                        {
                            name: 'Protein',
                            amount: 15,
                            unit: 'g'
                        },
                        {
                            name: 'Omega-3',
                            amount: 1.4,
                            unit: 'g'
                        },
                        {
                            name: 'Salt',
                            amount: 2,
                            unit: 'g'
                        },
                    ]
                },
            },
            {
                attributes: {
                    text: 'Placeholder',
                    image: '../Images/logo.png',
                    ingredients: [
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                    ]
                },
            },
            {
                attributes: {
                    text: 'Placeholder',
                    image: '../Images/logo.png',
                    ingredients: [
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                    ]
                },
            },
            {
                attributes: {
                    text: 'Placeholder',
                    image: '../Images/logo.png',
                    ingredients: [
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                        {
                            name: 'Ingredient',
                            amount: 0,
                            unit: 'Unit'
                        },
                    ]
                },
            },
        ]
    },
    {
        type: 'list',
        parentType: 'id',
        parent: 'scroller_bottom_sections',
        idType: 'global',
        id: 'scroller_bottom_section',
        func: bottomSectionFunc,
        objectData: [
            {
                objectData: {
                    type: 'list',
                    parentType: 'id',
                    parent: 'scroller_bottom_section',
                    idType: 'global',
                    id: 'scroller_bottom_section_item',
                    func: bottomSectionItemFunc,
                    objectData: [
                        {
                            attributes: {
                                text: 'Download the app'
                            },
                        },
                        {
                            attributes: {
                                text: 'Offers'
                            },
                        },
                        {
                            attributes: {
                                text: 'Promises'
                            },
                        },
                        {
                            attributes: {
                                text: 'Security'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'Planture'
                },
            },
            {
                objectData: {
                    type: 'list',
                    parentType: 'id',
                    parent: 'scroller_bottom_section',
                    idType: 'global',
                    id: 'scroller_bottom_section_item',
                    func: bottomSectionItemFunc,
                    objectData: [
                        {
                            attributes: {
                                text: 'Battle pass'
                            },
                        },
                        {
                            attributes: {
                                text: 'Product page'
                            },
                        },
                        {
                            attributes: {
                                text: 'Subscriptions'
                            },
                        },
                        {
                            attributes: {
                                text: 'Ingredients'
                            },
                        },
                        {
                            attributes: {
                                text: 'Product updates'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'Products'
                },
            },
            {
                objectData: {
                    type: 'list',
                    parentType: 'id',
                    parent: 'scroller_bottom_sections',
                    idType: 'global',
                    id: 'scroller_bottom_section_item',
                    func: bottomSectionItemFunc,
                    objectData: [
                        {
                            attributes: {
                                text: 'Help center'
                            },
                        },
                        {
                            attributes: {
                                text: 'Contact us'
                            },
                        },
                        {
                            attributes: {
                                text: 'Privacy and terms'
                            },
                        },
                        {
                            attributes: {
                                text: 'Guidelines for cookies'
                            },
                        },
                        {
                            attributes: {
                                text: 'Settings for cookies'
                            },
                        },
                        {
                            attributes: {
                                text: 'Site map'
                            },
                        },
                        {
                            attributes: {
                                text: 'Learning resources'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'Support'
                },
            },
            {
                objectData: {
                    type: 'list',
                    parentType: 'id',
                    parent: 'scroller_bottom_sections',
                    idType: 'global',
                    id: 'scroller_bottom_section_item',
                    func: bottomSectionItemFunc,
                    objectData: [
                        {
                            attributes: {
                                text: 'Blog'
                            },
                        },
                        {
                            attributes: {
                                text: 'Developers'
                            },
                        },
                        {
                            attributes: {
                                text: 'Forum'
                            },
                        },
                        {
                            attributes: {
                                text: 'Enlistments'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'Forum'
                },
            },
            {
                objectData: {
                    type: 'list',
                    parentType: 'id',
                    parent: 'scroller_bottom_sections',
                    idType: 'global',
                    id: 'scroller_bottom_section_item',
                    func: bottomSectionItemFunc,
                    objectData: [
                        {
                            attributes: {
                                text: 'About us'
                            },
                        },
                        {
                            attributes: {
                                text: 'Positions'
                            },
                        },
                        {
                            attributes: {
                                text: 'Investorrelations'
                            },
                        },
                        {
                            attributes: {
                                text: 'Partners'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'Company'
                },
            },
        ]
    },
];

var responsiveElements = []; /* En liste med elementer som er responsive */

function getNumStep(curAmount, count, remove) {
    var amount = curAmount - (count * remove);
    return [count, amount];
}

function getNumMaxStep(amount, remove) {
    var count = Math.floor(amount / remove);
    return getNumStep(amount, count, remove);
}

function getTextMetrics(text, font) { /* Få tekststørrelse fra tekst og font */
    var canvas = getTextMetrics.canvas || (getTextMetrics.canvas = document.createElement('canvas'));
    var context = canvas.getContext('2d');
    context.font = font;
    var metrics = context.measureText(text);
    return metrics;
}
function getElementFromID(name) {
    return document.getElementById(name);
}
function getElementsFromClass(name) {
    return document.getElementsByClassName(name);
}

/* Lag elementer */

function makeHTMLElement(template, elementData, parentElement) {
    var element = document.createElement('div');
    var attrName;
    var id;
    if (template.idType === 'global') {
        attrName = 'class';
        id = template.id;
    } else if (template.idType === 'local') {
        attrName = 'id';
        id = elementData.id;
    }
    element.setAttribute(attrName, id);
    template.func(elementData, element);
    parentElement.appendChild(element);
}

function makeHTMLElements(template) {
    var objectData = template.objectData;
    var parentType = template.parentType;
    var parentName = template.parent;
    var type = template.type;
    function newTemp(elementData) {
        if (parentType === 'id') {
            makeHTMLElement(template, elementData, getElementFromID(parentName));
        } else if (parentType === 'class') {
            for (const [_, parent] of Object.entries(getElementsFromClass())) {
                makeHTMLElement(template, elementData, parent);
            }
        }
    }
    if (type === 'element') {
        newTemp(objectData);
    } else if (type === 'list') {
        for (var [_, elementData] of Object.entries(objectData)) {
            newTemp(elementData);
        }
    }
}

/* Gjør elementer responsive */

function insertResponsiveFunc(val) {
    responsiveElements.splice(responsiveElements.length + 1, 0, val);
}

function addResponsiveFunc(func) {
    var dict = {type: 'function', func: func};
    insertResponsiveFunc(dict);
    return dict;
}

function makeElementResponsive(element, func) {
    var dict = {type: 'element', element: element, func: func};
    insertResponsiveFunc(dict);
    return dict;
}

function makeElementsResponsive(elementList, func) {
    for (const [_, element] of Object.entries(elementList)) {
        makeElementResponsive(element, func);
    }
}

for (const [_, template] of Object.entries(HTMLTemplates)) {
    makeHTMLElements(template);
}

/* Legg til funksjoner som gjør elementer responsive */

{ /* Nav bar */
    var border_thickness = 1;
    var nav_bar_container = getElementFromID('nav_bar_container');
    var nav_bar_logo_main = getElementFromID('nav_bar_logo_main');
    var nav_bar_text_main = getElementFromID('nav_bar_text_main');
    var nav_bar_button_container = getElementFromID('nav_bar_button_container');
    var nav_bar_menu = getElementFromID('nav_bar_menu');
    var nav_bar_buttons = getElementFromID('nav_bar_buttons');
    var nav_bar_logo_border = getElementFromID('nav_bar_logo_border');
    var nav_bar_white_border = getElementFromID('nav_bar_white_border');
    var lastButtonsStatus = true;
    var buttons_width = 0;
    for (var [_, element] of Object.entries(getElementsFromClass('nav_bar_button'))) {
        buttons_width += element.offsetWidth;
    }
    addResponsiveFunc(function() {
        var homeLogoWidth;
        var homeTextWidth;
        var homeWidth;
        var menuWidth;

        nav_bar_container.style.width = nav_bar_container.parentElement.offsetWidth + 'px';

        homeLogoWidth = nav_bar_logo_main.offsetHeight;
        nav_bar_logo_main.style.width = homeLogoWidth + 'px';

        homeTextWidth = nav_bar_text_main.offsetHeight * 2;
        nav_bar_text_main.style.width = homeTextWidth + 'px';

        homeWidth = homeLogoWidth + homeTextWidth;
        nav_bar_button_container.style.width = homeWidth + 'px';

        menuWidth = nav_bar_menu.offsetHeight;
        nav_bar_menu.style.width = menuWidth + 'px';

        var targetWidth = nav_bar.offsetWidth - (homeWidth + menuWidth);

        if (targetWidth >= buttons_width) {
            if (lastButtonsStatus === false) {
                lastButtonsStatus = true;
                nav_bar.insertBefore(nav_bar_buttons, nav_bar_menu);
                nav_bar_menu.style.marginLeft = null;
            }
        } else {
            if (lastButtonsStatus === true) {
                lastButtonsStatus = false;
                nav_bar_buttons.remove()
                nav_bar_menu.style.marginLeft = 'auto';
            }
        }

        nav_bar_buttons.style.width = targetWidth + 'px';

        nav_bar_logo_border.style.width = homeLogoWidth + 'px';
        nav_bar_logo_border.style.height = border_thickness + 'px';

        nav_bar_white_border.style.width = (nav_bar_white_border.parentElement.offsetWidth - homeLogoWidth) + 'px';
        nav_bar_white_border.style.height = border_thickness + 'px';
    });
}

{
    var elements = getElementsFromClass('nav_bar_button');
    var ext = Math.ceil(elements.length * 0.5);
    var element = elements[ext];
    addResponsiveFunc(function() {
        element.style.marginLeft = 'auto';
    });
}

{ /* Info øverst på forsiden */
    var image_container = getElementFromID('scroller_top_middle_image_container');
    var text_container = getElementFromID('scroller_top_middle_text_container');
    addResponsiveFunc(function() {
        var width;
        if (window.innerWidth >= "768") {
            width = image_container.parentElement.offsetHeight;
            image_container.style.width = width + 'px';
            text_container.style.width = (text_container.parentElement.offsetWidth - width) + 'px';
        } else {
            image_container.style.width = null;
            text_container.style.width = null;
        }
    });
}

{
    makeElementsResponsive(getElementsFromClass('scroller_products_product_info'), function(_, element) {
        var parentElement = element.parentElement
        var padd = parentElement.offsetHeight * 0.2;
        element.style.width = (parentElement.offsetWidth - padd) + 'px';
        element.style.height = (parentElement.offsetHeight - padd) + 'px';
    })
}

/*{ Egen responsiv algoritme just in case
    var tWidth = 200;
    var tHeight = 300;
    var margin = 30;
    var xSize;
    var ySize;

    addResponsiveFunc(function () {
        var parentElement = getElementFromID('scroller_products_products')
        var xAva = parentElement.offsetWidth;
        var rowres = getNumMaxStep(xAva, tWidth + margin);
        var rows = rowres[0];
        var rowsoff = rowres[1];
        var yAva = parentElement.offsetHeight;
        var colres = getNumMaxStep(yAva, tHeight + margin);
        var cols = colres[0];
        var colsoff = colres[1];
        
        if (rowsoff >= 0) {
            rows += 1;
        };
        if (colsoff >= 0) {
            cols += 1;
        };
        xSize = tWidth + 'px';
        ySize = tHeight + 'px';
    })

    makeElementsResponsive(getElementsFromClass('scroller_products_product'), function (_, element) {
        element.style.width = xSize;
        element.style.height = ySize;
    })
}*/

/*{
    makeElementResponsive(getElementFromID('scroller_bottom_sections'), function(_, element) {
        var parentElement = element.parentElement;
        var padd = parentElement.offsetWidth * 0.125;
        element.style.width = parentElement.offsetWidth - padd + 'px';
        element.style.height = parentElement.offsetHeight - padd + 'px';
    })
}*/
/*{
    addResponsiveFunc(function() {
        var elements = getElementsFromClass('scroller_bottom_section');
        var parentElement = elements[0].parentElement
        var minWidth = 500;
        var maxWidth = 800;
    })
    makeElementResponsive(getElementsFromClass('scroller_bottom_section'), function(_, element) {
        var parentElement = element.parentElement;
        element.style.width = parentElement.offsetWidth - padd + 'px';
        element.style.height = parentElement.offsetHeight - padd + 'px';
    })
}*/

createButton('backgroundColor', getElementFromID('nav_bar_button_container'));

createButton('backgroundColor', getElementFromID('nav_bar_menu'));

{
    var [hasScrollBar, deviceType] = getDeviceType();
    var width;
    if (hasScrollBar === true) {
        width = "calc(100vw - 17px)";
    } else {
        width = "100vw";
    }
    document.body.style.width = width;
}

/* Gå gjennom listen med elementer og gjør endre dem etter skjermstørrelsen */

function updateResponsiveElements() {
    for (var [_, dict] of Object.entries(responsiveElements)) {
        var type = dict.type;
        if (type === 'element') {
            dict.func(dict, dict.element);
        } else if (type === 'function') {
            dict.func(dict);
        }
    }
}

window.onmousemove = mouseMove;

window.addEventListener('resize', updateResponsiveElements);

updateResponsiveElements(); /* Elementene endrer seg bare når siden endrer størrelse, så den må gjøre det på starten */