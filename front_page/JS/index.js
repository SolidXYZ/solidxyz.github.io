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
                action(element);
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
            createButton('backgroundColor', element, elementData.attributes.buttonFuncs);
        },
        objectData: [
            {
                attributes: {
                    text: 'About me',
                    buttonFuncs: {
                        down: function() {
                            getElementFromID('scroller_top').scrollIntoView();
                        }
                    }
                },
            },
            {
                attributes: {
                    text: 'Websites',
                    buttonFuncs: {
                        down: function() {
                            getElementFromID('scroller_websites').scrollIntoView();
                        }
                    }
                },
            },
            /*{
                attributes: {
                    text: 'Info',
                    buttonFuncs: {
                        down: function() {
                            getElementFromID('scroller_info').scrollIntoView();
                        }
                    }
                },
            },*/
        ]
    },
    {
        type: 'list',
        parentType: 'id',
        parent: 'scroller_websites_websites',
        idType: 'global',
        id: 'scroller_websites_website',
        func: function(elementData, element) {
            var html = `
            <div class="scroller_websites_website_info_container">
                <div class="scroller_websites_website_info">
                    <div class="scroller_websites_website_title">
                        ${elementData.attributes.title}
                    </div>
                    <div class="scroller_websites_website_description">
                        ${elementData.attributes.description}
                    </div>
                </div>
            </div>
            `;
            element.innerHTML = html;
            createButton('backgroundColor', element, {
                down: function() {
                    location.href = `pages/${elementData.attributes.website}/index.html`
                }
            });
        },
        objectData: [
            {
                attributes: {
                    title: 'PickupBox',
                    description: 'Not a knockoff. School project',
                    website: 'html_dropboxknockoff'
                },
            },
            {
                attributes: {
                    title: 'Superfood',
                    description: 'Superfood. School project',
                    website: 'html_superfood'
                },
            },
            {
                attributes: {
                    title: '3D Cube',
                    description: 'Controllable 3D cube using the transform HTML property. Personal project',
                    website: 'html_3dcube'
                },
            },
            {
                attributes: {
                    title: 'Confetti',
                    description: 'Very cool confetti. Personal project',
                    website: 'html_confetti'
                },
            },
            {
                attributes: {
                    title: '3D renderer (cubes only for now)',
                    description: 'Very cool 3D renderer. Personal project',
                    website: 'html_3drenderer'
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
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'RUN'
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
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'RUN'
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
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'RUN'
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
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'RUN'
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
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                        {
                            attributes: {
                                text: 'RUN RUN RUN RUN RUN'
                            },
                        },
                    ]
                },
                attributes: {
                    text: 'RUN'
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
    makeElementsResponsive(getElementsFromClass('scroller_websites_website_info'), function(_, element) {
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
        var parentElement = getElementFromID('scroller_websites_websites')
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

    makeElementsResponsive(getElementsFromClass('scroller_websites_website'), function (_, element) {
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