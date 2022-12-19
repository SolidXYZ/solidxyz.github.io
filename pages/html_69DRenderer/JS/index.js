let funnycrossoriginfixerlol = '';

let Resources = {
    textures: {
        "pepe": ["images/pepe.png", [512, 512]],
        "dulri": ["images/dulri.png", [256, 256]],
        "container": ["images/container2.png", [500, 500]],
        // "skybox": ["images/skybox.png", [1024, 768]],
        // "skybox": ["images/skybox2.png", [1024, 768]],
        "skybox": ["images/skybox3.png", [2048, 1536]],
        "brickwall": ["images/brickwall.png", [1024, 1024]],
        "brickwall_normal": ["images/brickwall_normal.png", [1024, 1024]],
        "brick": ["images/bricks3.png", [1024, 1024]],
        "brick_normal": ["images/bricks3_normal.png", [1024, 1024]],
        "stone1": ["images/stone1_diffuse.png", [1024, 1024]],
        "stone1_normal": ["images/stone1_normal.png", [1024, 1024]],
        "stone2": ["images/stone2_diffuse.jpg", [1024, 1024]],
        "stone2_normal": ["images/stone2_normal.jpg", [1024, 1024]],
        "diablo_diffuse": ["images/diablo_diffuse.png", [1024, 1024]],
        "diablo_normal": ["images/diablo_normal.png", [1024, 1024]],
        "barrel_diffuse": ["images/barrel_diffuse.png", [1024, 1024]],
        "barrel_normal": ["images/barrel_normal.png", [1024, 1024]],
    },
    models: {
        "cube": "models/cube.obj",
        "smooth_sphere": "models/sphere.obj",
        "flat_sphere": "models/sphere2.obj",
        "monkey": "models/monkey2.obj",
        "man": "models/man.obj",
        "diablo": "models/diablo.obj",
        "barrel": "models/barrel.obj",
    },
}
for (var [i, v] of Object.entries(Resources.textures)) {
    v[0] = funnycrossoriginfixerlol + v[0];
}
for (var [i, v] of Object.entries(Resources.models)) {
    Resources.models[i] = funnycrossoriginfixerlol + v;
}
console.log(Resources)

//--------------------------------------------------------------------------------------------------

let Constants = {}

Constants.WIDTH = 800;
Constants.HEIGHT = Constants.WIDTH / 4 * 3;
Constants.SCALE_INDEX = 2;
Constants.SCALES = [1, 2, 4, 5, 8, 10, 20];
Constants.SCALE = Constants.SCALES[Constants.SCALE_INDEX];
Constants.FOV = Constants.HEIGHT / Constants.SCALE;
Constants.resourceReady = Object.keys(Resources.textures).length + Object.keys(Resources.models).length;
Constants.loadedResources = 0;
Constants.globalAlpha = 255;
Constants.pause = false;

//--------------------------------------------------------------------------------------------------

class Bitmap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pixels = new Uint32Array(width * height);
    }

    render(bitmap, ox, oy) {
        for (let y = 0; y < bitmap.height; y++) {
            let yy = oy + y;
            if (yy < 0 || yy >= this.height) continue;

            for (let x = 0; x < bitmap.width; x++) {
                let xx = ox + x;
                if (xx < 0 || xx >= this.width) continue;

                const color = bitmap.pixels[x + y * bitmap.width];

                this.pixels[xx + yy * this.width] = color;
            }
        }
    }

    clear(color) {
        for (let i = 0; i < this.pixels.length; i++)
            this.pixels[i] = color;
    }
}

//--------------------------------------------------------------------------------------------------

class Camera {
    constructor() {
        this.pos = new Vector3(0.0, 0.0, 0.0);
        this.rot = new Vector3(0.0, 0.0, 0.0);
        this.cameraTransform = new Matrix4();
    }
}

//--------------------------------------------------------------------------------------------------

class Engine {
    constructor() {
        this.times = [];
        this.fps;

        this.started = false;

        this.cvs;
        this.tmpCvs;
        this.gfx;
        this.tmpGfx;

        this.resBtns = [];
        this.pspBtns = [];

        this.frameCounterElement;

        this.time = 0;

        this.renderer;
        this.game;

        this.postprocessEnabled = [false, false, false, false, false];
    }

    start() {
        this.init();
        this.run();
    }

    init() {
        let body = document.querySelector("body");
        body.addEventListener("contextmenu", e => e.stopPropagation(), false);
        body.ondragstart = () => { return false };
        body.onselectstart = () => { return false };

        window.addEventListener('keydown', function (e) {
            if (e.key == " " && e.target == document.body) {
                e.preventDefault();
            }
        });

        this.cvs = document.getElementById("canvas");
        this.gfx = this.cvs.getContext("2d", {willReadFrequently: true});

        this.gfx.font = "60px verdana";
        this.gfx.fillText("Loading...", 10, 60);

        this.tmpCvs = document.createElement("canvas");
        this.tmpGfx = this.tmpCvs.getContext("2d");

        this.resBtns.push(document.getElementById("res1"));
        this.resBtns.push(document.getElementById("res2"));
        this.resBtns.push(document.getElementById("res4"));
        this.resBtns.push(document.getElementById("res5"));
        this.resBtns.push(document.getElementById("res8"));
        this.resBtns.push(document.getElementById("res10"));
        this.resBtns.push(document.getElementById("res20"));

        function reloadView(index) {
            if (index == Constants.SCALES[index]) return;

            const newWidth = Constants.WIDTH * Constants.SCALE / Constants.SCALES[index];
            const newHeight = Constants.HEIGHT * Constants.SCALE / Constants.SCALES[index];
            this.renderer = new Renderer(newWidth, newHeight, this.camera);
            this.game.r = this.renderer;

            Constants.WIDTH = newWidth;
            Constants.HEIGHT = newHeight;
            Constants.SCALE = Constants.SCALES[index];
            Constants.FOV = Constants.HEIGHT;

            this.tmpCvs.width = Constants.WIDTH;
            this.tmpCvs.height = Constants.HEIGHT;

            for (const btn of this.resBtns) btn.style.backgroundColor = "white";
            this.resBtns[index].style.backgroundColor = "black";
        }

        for (let i = 0; i < this.resBtns.length; i++) {
            const btn = this.resBtns[i];
            btn.onclick = () => reloadView.bind(this)(i);
        }

        this.resBtns[Constants.SCALE_INDEX].style.backgroundColor = "black";

        this.pspBtns.push(document.getElementById("psp1"));
        this.pspBtns.push(document.getElementById("psp2"));
        this.pspBtns.push(document.getElementById("psp3"));
        this.pspBtns.push(document.getElementById("psp4"));
        this.pspBtns.push(document.getElementById("psp5"));

        function setPostProcess(index) {
            this.postprocessEnabled[index] = !this.postprocessEnabled[index];
            this.pspBtns[index].style.backgroundColor = this.postprocessEnabled[index] ? "black" : "white";
        }

        for (let i = 0; i < this.pspBtns.length; i++) {
            const btn = this.pspBtns[i];
            btn.onclick = () => setPostProcess.bind(this)(i);
            if (this.postprocessEnabled[i]) btn.style.backgroundColor = "black";
        }

        for (const key in Resources.textures) {
            if (Object.hasOwnProperty.call(Resources.textures, key)) {
                const imageURL = Resources.textures[key][0];
                const imageWidth = Resources.textures[key][1][0];
                const imageHeight = Resources.textures[key][1][1];

                let image = new Image();
                image.src = imageURL;
                image.crossOrigin = "Anonymous";
                image.onload = () => {
                    this.tmpCvs.setAttribute("width", imageWidth + "px");
                    this.tmpCvs.setAttribute("height", imageHeight + "px");

                    // Loading textures
                    this.tmpGfx.drawImage(image, 0, 0, imageWidth, imageHeight);

                    if (key == "skybox") {
                        const size = Util.int(imageWidth / 4);

                        let top = this.tmpGfx.getImageData(size, 0, size, size);
                        let bottom = this.tmpGfx.getImageData(size, size * 2, size, size);
                        let front = this.tmpGfx.getImageData(size, size, size, size);
                        let back = this.tmpGfx.getImageData(size * 3, size, size, size);
                        let right = this.tmpGfx.getImageData(size * 2, size, size, size);
                        let left = this.tmpGfx.getImageData(0, size, size, size);

                        Resources.textures["skybox_top"] = Util.convertImageDataToBitmap(top, size, size);
                        Resources.textures["skybox_bottom"] = Util.convertImageDataToBitmap(bottom, size, size);
                        Resources.textures["skybox_front"] = Util.convertImageDataToBitmap(front, size, size);
                        Resources.textures["skybox_back"] = Util.convertImageDataToBitmap(back, size, size);
                        Resources.textures["skybox_right"] = Util.convertImageDataToBitmap(right, size, size);
                        Resources.textures["skybox_left"] = Util.convertImageDataToBitmap(left, size, size);
                        Constants.loadedResources++;
                        return;
                    }

                    image = this.tmpGfx.getImageData(0, 0, imageWidth, imageHeight);
                    image = Util.convertImageDataToBitmap(image, imageWidth, imageHeight);

                    Resources.textures[key] = image;
                    Constants.loadedResources++;
                }
            }
        }

        this.frameCounterElement = document.getElementById("frame_counter");

        Constants.WIDTH = Constants.WIDTH / Constants.SCALE;
        Constants.HEIGHT = Constants.HEIGHT / Constants.SCALE;

        this.camera = new Camera();
        this.renderer = new Renderer(Constants.WIDTH, Constants.HEIGHT, this.camera);
        this.game = new Game(this.renderer, this.camera);

        let sample = new Bitmap(64, 64);
        for (let i = 0; i < 64 * 64; i++) {
            const x = i % 64;
            const y = Util.int(i / 64);
            sample.pixels[i] = (((x << 6) % 0xff) << 8) | (y << 6) % 0xff;
        }
        Resources.textures["sample0"] = sample;

        sample = new Bitmap(64, 64);
        sample.clear(0xff00ff);
        Resources.textures["sample1"] = sample;

        sample = new Bitmap(64, 64);
        sample.clear(0xdfdfdf);
        Resources.textures["white"] = sample;

        sample = new Bitmap(64, 64);
        sample.clear(0x8080ff);
        Resources.textures["default_normal"] = sample;

        Input.init(this);
    }

    run() {
        const now = performance.now();

        while (this.times.length > 0 && this.times[0] <= now - 1000)
            this.times.shift();

        let delta = 1.0;
        if (this.times.length > 0)
            delta = (now - this.times[this.times.length - 1]) / 1000.0;

        this.times.push(now);
        this.fps = this.times.length;
        this.frameCounterElement.innerHTML = this.fps + "fps";

        if (!this.started && Constants.loadedResources == Constants.resourceReady) {
            this.started = true;
            this.cvs.setAttribute("width", Constants.WIDTH * Constants.SCALE + "px");
            this.cvs.setAttribute("height", Constants.HEIGHT * Constants.SCALE + "px");
            this.tmpCvs.setAttribute("width", Constants.WIDTH * Constants.SCALE + "px");
            this.tmpCvs.setAttribute("height", Constants.HEIGHT * Constants.SCALE + "px");
            this.gfx.font = "48px verdana";
        }

        if (!this.started) {
            this.gfx.clearRect(0, 0, this.cvs.width, this.cvs.height);
            this.gfx.fillText("Loading..." + Util.int(Constants.loadedResources / Constants.resourceReady * 100) + "%", 10, 60);
        }

        if (this.started && !Constants.pause) {
            this.update(delta);
            this.render();
            this.time += delta;
        }
        else if (Constants.pause) {
            this.gfx.fillText("PAUSE", 4, 40);
        }

        requestAnimationFrame(this.run.bind(this));
    }

    update(delta) {
        this.game.update(delta);
        Input.update();
    }

    render() {
        this.renderer.clear(0xA7CFF7);
        this.game.render();
        postProcess(this.renderer, this.postprocessEnabled);

        if (true) {
            this.tmpGfx.putImageData(Util.convertBitmapToImageData(this.renderer), 0, 0);
            this.gfx.save();
            this.gfx.imageSmoothingEnabled = false;
            this.gfx.scale(Constants.SCALE, Constants.SCALE);
            this.gfx.drawImage(this.tmpCvs, 0, 0);
            this.gfx.restore();
        } else {
            this.gfx.putImageData(Util.convertBitmapToImageData(this.renderer, Constants.SCALE), 0, 0)
        }
    }
}

//--------------------------------------------------------------------------------------------------

class Face {
    constructor(v0, v1, v2) {
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
    }

    calcNormal() {
        const edge1 = this.v1.pos.sub(this.v0.pos);
        const edge2 = this.v2.pos.sub(this.v0.pos);

        const normal = edge1.cross(edge2).normalized();

        this.v0.normal = normal;
        this.v1.normal = normal;
        this.v2.normal = normal;
    }

    calcTangentAndBiTangent() {
        const edge1 = this.v1.pos.sub(this.v0.pos);
        const edge2 = this.v2.pos.sub(this.v0.pos);
        const deltaUV1 = this.v1.texCoord.sub(this.v0.texCoord);
        const deltaUV2 = this.v2.texCoord.sub(this.v0.texCoord);

        const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);

        let tangent = new Vector3(
            f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x),
            f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y),
            f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z)
        );

        tangent.normalize();

        this.v0.tangent = tangent;
        this.v1.tangent = tangent;
        this.v2.tangent = tangent;

        this.v0.biTangent = this.v0.normal.normalized().cross(this.v0.tangent).normalized();
        this.v1.biTangent = this.v1.normal.normalized().cross(this.v1.tangent).normalized();
        this.v2.biTangent = this.v2.normal.normalized().cross(this.v2.tangent).normalized();
    }
}

//--------------------------------------------------------------------------------------------------

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        const len = this.getLength();

        this.x /= len;
        this.y /= len;
    }

    normalized() {
        let res = new Vector2();
        const len = this.getLength();

        res.x = this.x / len;
        res.y = this.y / len;

        return res;
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.y * v.x - this.x * v.y;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    div(v) {
        return new Vector2(this.x / v, this.y / v);
    }

    mul(v) {
        return new Vector2(this.x * v, this.y * v);
    }

    equals(v) {
        return this.x == v.x && this.y == v.y;
    }
}

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    normalize() {
        const len = this.getLength();

        this.x /= len;
        this.y /= len;
        this.z /= len;
    }

    normalized() {
        let res = new Vector3();
        const len = this.getLength();

        res.x = this.x / len;
        res.y = this.y / len;
        res.z = this.z / len;

        return res;
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }

    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    div(v) {
        return new Vector3(this.x / v, this.y / v, this.z / v);
    }

    divXYZ(x, y, z) {
        return new Vector3(this.x / x, this.y / y, this.z / z);
    }

    mul(v) {
        return new Vector3(this.x * v, this.y * v, this.z * v);
    }

    mulXYZ(x, y, z) {
        return new Vector3(this.x * x, this.y * y, this.z * z);
    }

    equals(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }
}

class Matrix4 {
    constructor() {
        this.m00 = 1; this.m01 = 0; this.m02 = 0; this.m03 = 0;
        this.m10 = 0; this.m11 = 1; this.m12 = 0; this.m13 = 0;
        this.m20 = 0; this.m21 = 0; this.m22 = 1; this.m23 = 0;
        this.m30 = 0; this.m31 = 0; this.m32 = 0; this.m33 = 1;
    }

    fromAxis(vx, vy, vz) {
        let res = new Matrix4();

        res.m00 = vx.x; res.m01 = vy.x; res.m02 = vz.x;
        res.m10 = vx.y; res.m11 = vy.y; res.m12 = vz.y;
        res.m20 = vx.z; res.m21 = vy.z; res.m22 = vz.z;

        return res;
    }

    mulMatrix(right) {
        let res = new Matrix4();

        res.m00 = this.m00 * right.m00 + this.m01 * right.m10 + this.m02 * right.m20 + this.m03 * right.m30;
        res.m01 = this.m00 * right.m01 + this.m01 * right.m11 + this.m02 * right.m21 + this.m03 * right.m31;
        res.m02 = this.m00 * right.m02 + this.m01 * right.m12 + this.m02 * right.m22 + this.m03 * right.m32;
        res.m03 = this.m00 * right.m03 + this.m01 * right.m13 + this.m02 * right.m23 + this.m03 * right.m33;

        res.m10 = this.m10 * right.m00 + this.m11 * right.m10 + this.m12 * right.m20 + this.m13 * right.m30;
        res.m11 = this.m10 * right.m01 + this.m11 * right.m11 + this.m12 * right.m21 + this.m13 * right.m31;
        res.m12 = this.m10 * right.m02 + this.m11 * right.m12 + this.m12 * right.m22 + this.m13 * right.m32;
        res.m13 = this.m10 * right.m03 + this.m11 * right.m13 + this.m12 * right.m23 + this.m13 * right.m33;

        res.m20 = this.m20 * right.m00 + this.m21 * right.m10 + this.m22 * right.m20 + this.m23 * right.m30;
        res.m21 = this.m20 * right.m01 + this.m21 * right.m11 + this.m22 * right.m21 + this.m23 * right.m31;
        res.m22 = this.m20 * right.m02 + this.m21 * right.m12 + this.m22 * right.m22 + this.m23 * right.m32;
        res.m23 = this.m20 * right.m03 + this.m21 * right.m13 + this.m22 * right.m23 + this.m23 * right.m33;

        res.m30 = this.m30 * right.m00 + this.m31 * right.m10 + this.m32 * right.m20 + this.m33 * right.m30;
        res.m31 = this.m30 * right.m01 + this.m31 * right.m11 + this.m32 * right.m21 + this.m33 * right.m31;
        res.m32 = this.m30 * right.m02 + this.m31 * right.m12 + this.m32 * right.m22 + this.m33 * right.m32;
        res.m33 = this.m30 * right.m03 + this.m31 * right.m13 + this.m32 * right.m23 + this.m33 * right.m33;

        return res;
    }

    mulVector(right, w) {
        let res = new Vector3(0, 0, 0);

        if (w == undefined) w = 1;

        res.x = this.m00 * right.x + this.m01 * right.y + this.m02 * right.z + this.m03 * w;
        res.y = this.m10 * right.x + this.m11 * right.y + this.m12 * right.z + this.m13 * w;
        res.z = this.m20 * right.x + this.m21 * right.y + this.m22 * right.z + this.m23 * w;

        return res;
    }

    scale(x, y, z) {
        if (y == undefined && z == undefined) {
            y = x;
            z = x;
        }

        let scale = new Matrix4();
        scale.m00 = x;
        scale.m11 = y;
        scale.m22 = z;

        return this.mulMatrix(scale);
    }

    rotate(x, y, z) {
        const sinX = Math.sin(x);
        const cosX = Math.cos(x);
        const sinY = Math.sin(y);
        const cosY = Math.cos(y);
        const sinZ = Math.sin(z);
        const cosZ = Math.cos(z);

        let res = new Matrix4();

        res.m00 = cosY * cosZ; res.m01 = -cosY * sinZ; res.m02 = sinY; res.m03 = 0;
        res.m10 = sinX * sinY * cosZ + cosX * sinZ; res.m11 = -sinX * sinY * sinZ + cosX * cosZ; res.m12 = -sinX * cosY; res.m13 = 0;
        res.m20 = -cosX * sinY * cosZ + sinX * sinZ; res.m21 = cosX * sinY * sinZ + sinX * cosZ; res.m22 = cosX * cosY; res.m23 = 0;
        res.m30 = 0; res.m31 = 0; res.m32 = 0; res.m33 = 1;

        return this.mulMatrix(res);
    }

    translate(x, y, z) {
        let res = new Matrix4();

        res.m03 = x;
        res.m13 = y;
        res.m23 = z;

        return this.mulMatrix(res);
    }
}

//--------------------------------------------------------------------------------------------------

class Game {
    constructor(renderer, camera) {
        this.r = renderer;
        this.camera = camera;
        this.time = 0;

        this.renderSkybox = true;
    }

    update(delta) {
        // Handle camera movement
        let speed = 5.0;
        let rotSpeed = 60.0;

        if (Input.isKeyDown("Shift")) speed *= 1.5;

        let ax = 0.0;
        let az = 0.0;

        if (Input.isKeyDown("a")) ax--;
        if (Input.isKeyDown("d")) ax++;
        if (Input.isKeyDown("w")) az--;
        if (Input.isKeyDown("s")) az++;

        if (new Vector2(ax, az).getLength() > 1) {
            ax /= 1.414;
            az /= 1.414;
        }

        this.camera.pos.x += (Math.cos(this.camera.rot.y * Math.PI / 180.0) * ax + Math.sin(this.camera.rot.y * Math.PI / 180.0) * az) * speed * delta;
        this.camera.pos.z += (-Math.sin(this.camera.rot.y * Math.PI / 180.0) * ax + Math.cos(this.camera.rot.y * Math.PI / 180.0) * az) * speed * delta;

        if (Input.isKeyDown(" ")) this.camera.pos.y += speed * delta;
        if (Input.isKeyDown("c")) this.camera.pos.y -= speed * delta;

        if (Input.isMouseDown()) {
            this.camera.rot.y -= Input.mouseAcceleration.x * 0.1 * rotSpeed * delta;
            this.camera.rot.x -= -Input.mouseAcceleration.y * 0.1 * rotSpeed * delta;
        }

        const radRot = this.camera.rot.mul(-Math.PI / 180.0);
        this.camera.cameraTransform = new Matrix4().rotate(radRot.x, radRot.y, radRot.z);
        this.camera.cameraTransform = this.camera.cameraTransform.translate(-this.camera.pos.x, -this.camera.pos.y, -this.camera.pos.z);

        // Control directional light
        if (Input.isKeyDown("q")) this.r.sun.rotation.y += delta;
        if (Input.isKeyDown("e")) this.r.sun.rotation.y -= delta;
        if (Input.isKeyDown("r")) this.r.sun.rotation.z += delta;
        if (Input.isKeyDown("f")) this.r.sun.rotation.z -= delta;

        // Control sun intensity
        if (Input.isKeyDown("i")) this.r.sun.intensity *= 1.1;
        if (Input.isKeyDown("o")) this.r.sun.intensity *= 1 / 1.1;

        let matrix = new Matrix4().rotate(this.r.sun.rotation.x, this.r.sun.rotation.y, this.r.sun.rotation.z);
        let sunDir = matrix.mulVector(this.r.sun.posRelativeToZero, 0).normalized().mul(-1);
        this.r.sun.dirVS = this.camera.cameraTransform.mulVector(sunDir, 0);

        this.time += delta;

        // Toggling render flags
        if (Input.isKeyPressed("n")) this.r.toggleRenderFlag(RENDER_FACE_NORMAL);
        if (Input.isKeyPressed("t")) this.r.toggleRenderFlag(RENDER_TANGENT_SPACE);
        if (Input.isKeyPressed("l")) this.r.toggleRenderFlag(CALC_LIGHT);
        if (Input.isKeyPressed("m")) this.r.toggleRenderFlag(DISABLE_NORMAL_MAPPING);
        if (Input.isKeyPressed("b")) this.renderSkybox = !this.renderSkybox;
    }

    render() {
        // Line
        this.r.transform = new Matrix4();
        this.r.drawLine(new Vertex(new Vector3(-6, 0, -5), 0xff0000), new Vertex(new Vector3(-5, 1, -7), 0x00ff00));

        // Trianglesa
        this.r.renderFlag = this.r.defaultRenderFlag & ~CALC_LIGHT;
        this.r.transform = new Matrix4().translate(-3, 0, 0);
        this.r.setMaterial(undefined, undefined, undefined, undefined);
        this.r.drawTriangle(
            new Vertex(new Vector3(-1, 0, -5), 0xff0000),
            new Vertex(new Vector3(0, 1, -5), 0x00ff00),
            new Vertex(new Vector3(1, 0, -5), 0x0000ff)
        );
        this.r.renderFlag = this.r.defaultRenderFlag;

        let xPos = 0;
        let zPos = -5;
        let index = 0;
        let gap = 4;

        // Flat sphere
        this.r.transform = new Matrix4().translate(xPos + (index++ * gap), 0, zPos);
        this.r.transform = this.r.transform.scale(1);
        this.r.setMaterial(Resources.textures.white, undefined, 100);
        this.r.drawModel(Resources.models.flat_sphere);

        // Smooth sphere
        this.r.transform = new Matrix4().translate(xPos + (index++ * gap), 0, zPos);
        this.r.transform = this.r.transform.scale(1);
        this.r.setMaterial(Resources.textures.white, undefined, 100);
        this.r.drawModel(Resources.models.smooth_sphere);

        // Brick1
        this.r.transform = new Matrix4().translate(xPos + (index * gap), -4, zPos);
        this.r.transform = this.r.transform.scale(1);
        this.r.setMaterial(Resources.textures.brick, Resources.textures.brick_normal, 10);
        this.r.drawModel(Resources.models.cube);

        // Brick2
        this.r.transform = new Matrix4().translate(xPos + (index * gap), 0, zPos);
        this.r.transform = this.r.transform.scale(1);
        this.r.setMaterial(Resources.textures.stone2, Resources.textures.stone2_normal, 10);
        this.r.drawModel(Resources.models.cube);

        // Brick3
        this.r.transform = new Matrix4().translate(xPos + (index++ * gap), 4, zPos);
        this.r.transform = this.r.transform.scale(1);
        this.r.setMaterial(Resources.textures.brickwall, Resources.textures.brickwall_normal, 10);
        this.r.drawModel(Resources.models.cube);

        // Barrel
        this.r.transform = new Matrix4().translate(xPos + (index++ * gap), 0, zPos);
        this.r.transform = this.r.transform.scale(0.3);
        this.r.setMaterial(Resources.textures.barrel_diffuse, Resources.textures.barrel_normal, 10);
        this.r.drawModel(Resources.models.barrel);

        // Diablo
        xPos += 2;
        this.r.transform = new Matrix4().translate(xPos + (index++ * gap), 0, zPos);
        this.r.transform = this.r.transform.scale(4);
        this.r.setMaterial(Resources.textures.diablo_diffuse, Resources.textures.diablo_normal, 10);
        this.r.drawModel(Resources.models.diablo);
        xPos += 2;

        let r = this.time / 2.0;

        // Cube1
        this.r.transform = new Matrix4().translate(xPos + (index++ * gap), 0, zPos).rotate(0, r, r);
        this.r.transform = this.r.transform.scale(1);
        this.r.setMaterial(Resources.textures.pepe, undefined, 30);
        this.r.drawModel(Resources.models.cube);

        // Cube2
        this.r.transform = new Matrix4().translate(xPos + (index++ * gap), 0, zPos).rotate(r, r, 0);
        this.r.transform = this.r.transform.scale(1);
        this.r.setMaterial(Resources.textures.dulri, undefined, 30);
        this.r.drawModel(Resources.models.cube);

        // Blender monkey
        this.r.transform = new Matrix4().translate(xPos + (index++ * gap), 0, zPos).rotate(0, -r, r);
        this.r.transform = this.r.transform.scale(1);
        this.r.setMaterial(Resources.textures.white, undefined, 30);
        this.r.drawModel(Resources.models.monkey);

        // Skybox
        if (this.renderSkybox) this.drawSkyBox(this.time / 100.0);
    }

    drawSkyBox(rotation) {
        this.r.renderFlag = SET_Z_9999 | !CALC_LIGHT;

        let size = new Vector3(1000, 1000, 1000);
        let pos = this.camera.pos.sub(new Vector3(size.x / 2.0, size.y / 2.0, -size.z / 2.0));
        this.r.transform = new Matrix4().rotate(0, rotation, 0);

        const p000 = new Vector3(pos.x, pos.y, pos.z);
        const p100 = new Vector3(pos.x + size.x, pos.y, pos.z);
        const p110 = new Vector3(pos.x + size.x, pos.y + size.y, pos.z);
        const p010 = new Vector3(pos.x, pos.y + size.y, pos.z);

        const p001 = new Vector3(pos.x, pos.y, pos.z - size.z);
        const p101 = new Vector3(pos.x + size.x, pos.y, pos.z - size.z);
        const p111 = new Vector3(pos.x + size.x, pos.y + size.y, pos.z - size.z);
        const p011 = new Vector3(pos.x, pos.y + size.y, pos.z - size.z);

        const t00 = new Vector2(0, 1);
        const t10 = new Vector2(1, 1);
        const t11 = new Vector2(1, 0);
        const t01 = new Vector2(0, 0);

        this.r.setMaterial(Resources.textures.skybox_front);
        this.r.drawTriangle(new Vertex(p001, 0xffffff, t01), new Vertex(p011, 0xffffff, t00), new Vertex(p111, 0xffffff, t10));
        this.r.drawTriangle(new Vertex(p001, 0xffffff, t01), new Vertex(p111, 0xffffff, t10), new Vertex(p101, 0xffffff, t11));

        this.r.setMaterial(Resources.textures.skybox_right);
        this.r.drawTriangle(new Vertex(p101, 0xffffff, t01), new Vertex(p111, 0xffffff, t00), new Vertex(p110, 0xffffff, t10));
        this.r.drawTriangle(new Vertex(p101, 0xffffff, t01), new Vertex(p110, 0xffffff, t10), new Vertex(p100, 0xffffff, t11));

        this.r.setMaterial(Resources.textures.skybox_left);
        this.r.drawTriangle(new Vertex(p000, 0xffffff, t01), new Vertex(p010, 0xffffff, t00), new Vertex(p011, 0xffffff, t10));
        this.r.drawTriangle(new Vertex(p000, 0xffffff, t01), new Vertex(p011, 0xffffff, t10), new Vertex(p001, 0xffffff, t11));

        this.r.setMaterial(Resources.textures.skybox_back);
        this.r.drawTriangle(new Vertex(p100, 0xffffff, t01), new Vertex(p110, 0xffffff, t00), new Vertex(p010, 0xffffff, t10));
        this.r.drawTriangle(new Vertex(p100, 0xffffff, t01), new Vertex(p010, 0xffffff, t10), new Vertex(p000, 0xffffff, t11));

        this.r.setMaterial(Resources.textures.skybox_top);
        this.r.drawTriangle(new Vertex(p011, 0xffffff, t01), new Vertex(p010, 0xffffff, t00), new Vertex(p110, 0xffffff, t10));
        this.r.drawTriangle(new Vertex(p011, 0xffffff, t01), new Vertex(p110, 0xffffff, t10), new Vertex(p111, 0xffffff, t11));

        this.r.setMaterial(Resources.textures.skybox_bottom);
        this.r.drawTriangle(new Vertex(p000, 0xffffff, t01), new Vertex(p001, 0xffffff, t00), new Vertex(p101, 0xffffff, t10));
        this.r.drawTriangle(new Vertex(p000, 0xffffff, t01), new Vertex(p101, 0xffffff, t10), new Vertex(p100, 0xffffff, t11));

        this.r.renderFlag = this.r.defaultRenderFlag;
    }
}

//--------------------------------------------------------------------------------------------------

const last_keys = {};
const curr_keys = {};
const mouses = [];
const maxMouseButtons = 5;

let last_scroll = false;
let curr_scroll = false;

const mousePosition = new Vector2(0, 0);
const mouseLastPosition = new Vector2(0, 0);
const mouseScroll = new Vector2(0, 0);
const mouseAcceleration = new Vector2(0, 0);

let Input = {}

Input.init = function(engine) {
    // Registers event listeners
    engine.cvs.addEventListener("mousedown", (e) => {
        if (e.button > maxMouseButtons) return;
        mouses[e.button].curr_down = true;
    }, false);
    window.addEventListener("mouseup", (e) => {
        if (e.button > maxMouseButtons) return;
        mouses[e.button].curr_down = false;
    }, false);
    window.addEventListener("keydown", (e) => {
        if (e.key == "Escape") Constants.pause = !Constants.pause;

        curr_keys[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
        curr_keys[e.key] = false;
    });
    window.addEventListener("mousemove", (e) => {
        let rect = engine.cvs.getBoundingClientRect();
        mousePosition.x = e.clientX - rect.left;
        mousePosition.y = Constants.HEIGHT - (e.clientY - rect.top);
    });
    engine.cvs.addEventListener("wheel", (e) => {
        mouseScroll.x = e.deltaX / 100;
        mouseScroll.y = e.deltaY / 100;
        curr_scroll = true;
    });
    for (let i = 0; i < maxMouseButtons; i++)
        mouses.push({ last_down: false, curr_down: false });
}

Input.update = function() {
    mouseAcceleration.x = mousePosition.x - mouseLastPosition.x;
    mouseAcceleration.y = mousePosition.y - mouseLastPosition.y;
    mouseLastPosition.x = mousePosition.x;
    mouseLastPosition.y = mousePosition.y;

    last_scroll = curr_scroll;
    curr_scroll = false;

    mouseScroll.x = 0;
    mouseScroll.y = 0;

    for (let i = 0; i < mouses.length; i++)
        mouses[i].last_down = mouses[i].curr_down;

    Object.assign(last_keys, curr_keys);
}

Input.isScrolling = function() {
    return curr_scroll;
}

Input.isScrollingStart = function() {
    return curr_scroll && !last_scroll;
}

Input.isScrollingEnd = function() {
    return !curr_scroll && last_scroll;
}

Input.isMousePressed = function(button = 0) {
    return mouses[button].curr_down && !mouses[button].last_down;
}

Input.isMouseReleased = function(button = 0) {
    return !mouses[button].curr_down && mouses[button].last_down;
}

Input.isMouseDown = function(button = 0) {
    return mouses[button].curr_down;
}

Input.isKeyPressed = function(key) {
    return curr_keys[key] && !last_keys[key];
}

Input.isKeyReleased = function(key) {
    return !curr_keys[key] && last_keys[key];
}

Input.isKeyDown = function(key) {
    return curr_keys[key];
}

//--------------------------------------------------------------------------------------------------

class DirectionalLight {
    constructor() {
        this.rotation = new Vector3(0, 0, 0);

        this.intensity = 1.1;
        this.posRelativeToZero = new Vector3(1, 1, 0.7).normalized();
        this.dirVS = new Vector3(); // Light direction in the view space
        this.color = 0xffffff;
    }
}

//--------------------------------------------------------------------------------------------------

class Model {
    constructor(vPositions, vTexCoords, vNormals, indices) {
        this.vPositions = vPositions;
        this.vTexCoords = vTexCoords;
        this.vNormals = vNormals;
        this.indices = indices;
        this.faces = [];

        for (let i = 0; i < this.indices.length; i++) {
            let vFace = this.indices[i];

            let face = [];
            for (let v = 0; v < 3; v++) {
                const pos = this.getPosition(vFace[v][0] - 1);
                const tex = this.getTexCoord(vFace[v][1] - 1);
                const nor = this.getNormal(vFace[v][2] - 1);
                face.push(new Vertex(pos, 0xffffff, tex, nor));
            }

            face = new Face(face[0], face[1], face[2]);
            face.calcTangentAndBiTangent();

            this.faces.push(face);
        }
    }

    getPosition(pos) {
        return new Vector3(this.vPositions[pos][0], this.vPositions[pos][1], this.vPositions[pos][2]);
    }

    getTexCoord(tex) {
        return new Vector2(this.vTexCoords[tex][0], this.vTexCoords[tex][1]);
    }

    getNormal(nor) {
        return new Vector3(this.vNormals[nor][0], this.vNormals[nor][1], this.vNormals[nor][2]);
    }
}

//--------------------------------------------------------------------------------------------------

const gaussianBlurKernel = [
    1.0 / 16.0, 2.0 / 16.0, 1.0 / 16.0,
    2.0 / 16.0, 4.0 / 16.0, 2.0 / 16.0,
    1.0 / 16.0, 2.0 / 16.0, 1.0 / 16.0,
];

const sharpenKernel = [
    0.0, -1.0, 0.0,
    -1.0, 5.0, -1.0,
    0.0, -1.0, 0.0,
];

const edgeKernel = [
    -1.0, -1.0, -1.0,
    -1.0, 8.0, -1.0,
    -1.0, -1.0, -1.0,
];

function postProcess(bitmap, postprocessEnabled) {
    // Sharpen
    if (postprocessEnabled[0]) {
        let result = new Uint32Array(bitmap.width * bitmap.height);

        for (let i = 0; i < bitmap.pixels.length; i++) {
            const x = i % bitmap.width;
            const y = Math.floor(i / bitmap.width);

            const kernelResult = kernel(bitmap, sharpenKernel, x, y);

            result[i] = kernelResult;
        }

        bitmap.pixels = result;
    }

    // Edge detection
    if (postprocessEnabled[1]) {
        let result = new Uint32Array(bitmap.width * bitmap.height);

        for (let i = 0; i < bitmap.pixels.length; i++) {
            const x = i % bitmap.width;
            const y = Math.floor(i / bitmap.width);

            const kernelResult = kernel(bitmap, edgeKernel, x, y);

            result[i] = kernelResult;
        }

        bitmap.pixels = result;
    }

    // Vignette & pixel noise
    if (postprocessEnabled[2] || postprocessEnabled[3]) {
        for (let i = 0; i < bitmap.pixels.length; i++) {
            const x = i % bitmap.width;
            const y = Math.floor(i / bitmap.width);

            const p = (x - bitmap.width / 2.0) / (bitmap.width / 5);
            const q = (y - bitmap.height / 2.0) / (bitmap.height / 5.0);

            let z = bitmap.zBuffer[i];
            if (z > 5000) z = 3;

            const vignette = 20 - ((z * 3 * (p * p * 1.1))) - ((z * 3 * (q * q * 1.4)));
            const noise = (x * 5 + (y * 2) & 3) * 16 >> 3 << 3;

            let shade = 0;
            if (postprocessEnabled[2]) shade += vignette;
            if (postprocessEnabled[3]) shade += noise;

            const color = bitmap.pixels[x + y * bitmap.width];

            bitmap.pixels[x + y * bitmap.width] = Util.addColor(color, shade);
        }
    }

    // Gaussian Blur
    if (postprocessEnabled[4]) {
        let result = new Uint32Array(bitmap.width * bitmap.height);

        for (let i = 0; i < bitmap.pixels.length; i++) {
            const x = i % bitmap.width;
            const y = Math.floor(i / bitmap.width);

            const kernelResult = kernel(bitmap, gaussianBlurKernel, x, y);

            result[i] = kernelResult;
        }

        bitmap.pixels = result;
    }
}

function kernel(texture, kernel, xp, yp) {
    const kernelSize = Math.sqrt(kernel.length);

    let res = new Vector3(0, 0, 0);

    for (let y = 0; y < kernelSize; y++) {
        for (let x = 0; x < kernelSize; x++) {
            let xx = xp - Math.floor(kernelSize / 2) + x;
            let yy = yp - Math.floor(kernelSize / 2) + y;

            if (xx < 0) xx = 0;
            if (xx >= texture.width) xx = texture.width - 1;
            if (yy < 0) yy = 0;
            if (yy >= texture.height) yy = texture.height - 1;

            const sample = Util.convertColorToVectorRange1(texture.pixels[xx + yy * texture.width]);

            const kernelValue = kernel[x + y * kernelSize];

            res = res.add(sample.mul(kernelValue));
        }
    }

    res = Util.clipColorVector(res.mul(255));
    res = Util.convertVectorToColorHex(res);

    return res;
}

//--------------------------------------------------------------------------------------------------

class Random {
    constructor(seed) {
        this._seed = seed % 2147483647;
        if (this._seed <= 0) this._seed += 2147483646;
    }
    /**
    * Returns a pseudo-random value between 1 and 2^32 - 2.
    */
    next() {
        return this._seed = this._seed * 16807 % 2147483647;
    }

    /**
     * Returns a pseudo-random floating point number in range [0, 1).
     */
    nextFloat() {
        // We know that result of next() will be 1 to 2147483646 (inclusive).
        return (this.next() - 1) / 2147483646;
    }
}

//--------------------------------------------------------------------------------------------------

const RENDER_CW = 0;
const RENDER_CCW = 1;
const SET_Z_9999 = 2;
const RENDER_FACE_NORMAL = 4;
const CALC_LIGHT = 8;
const RENDER_VERTEX_NORMAL = 16;
const RENDER_TANGENT_SPACE = 32;
const FLIP_NORMALMAP_Y = 64;
const DISABLE_NORMAL_MAPPING = 128;

const NORMAL_LENGTH = 0.1;

class Renderer extends Bitmap {
    constructor(width, height, camera) {
        super(width, height);
        this.camera = camera;

        this.zClipNear = 0.2;
        this.zBuffer = new Float32Array(width * height);

        // Shader variables
        {
            this.sun = new DirectionalLight();

            this.ambient = 0.25;
            this.specularIntensity = 1000;

            this.transform = new Matrix4();
            this.difuseMap = Resources.textures.sample0;
            this.normalMap = Resources.textures.default_normal;

            // Tangent matrix
            this.tbn = new Matrix4();
        }

        this.defaultRenderFlag = RENDER_CW | CALC_LIGHT;
        this.renderFlag = 0;
    }

    clear(clearColor) {
        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i] = clearColor;
            this.zBuffer[i] = 100000;
        }
    }

    drawPoint(v) {
        v = this.cameraTransform(v);

        if (v.pos.z < this.zClipNear) return;

        const sx = Util.int((v.pos.x / v.pos.z * Constants.FOV + Constants.WIDTH / 2.0));
        const sy = Util.int((v.pos.y / v.pos.z * Constants.FOV + Constants.HEIGHT / 2.0));

        this.renderPixel(new Vector3(sx, sy, v.pos.z), v.color);
    }

    drawLine(v0, v1) {
        v0 = this.cameraTransform(v0);
        v1 = this.cameraTransform(v1);

        // z-Near clipping
        if (v0.pos.z < this.zClipNear && v1.pos.z < this.zClipNear) return;

        if (v0.pos.z < this.zClipNear) {
            let per = (this.zClipNear - v0.pos.z) / (v1.pos.z - v0.pos.z);
            v0.pos = v0.pos.add(v1.pos.sub(v0.pos).mul(per));
            v0.color = Util.lerpVector2(v0.color, v1.color, per);
        }

        if (v1.pos.z < this.zClipNear) {
            let per = (this.zClipNear - v1.pos.z) / (v0.pos.z - v1.pos.z);
            v1.pos = v1.pos.add(v0.pos.sub(v1.pos).mul(per));
            v1.color = Util.lerpVector2(v1.color, v0.color, per);
        }

        // Transform a vertices in camera space to viewport space at one time (Avoid heavy matrix multiplication)
        // Projection transform + viewport transform
        let p0 = new Vector2(v0.pos.x / v0.pos.z * Constants.FOV + Constants.WIDTH / 2.0 - 0.5, v0.pos.y / v0.pos.z * Constants.FOV + Constants.HEIGHT / 2.0 - 0.5);
        let p1 = new Vector2(v1.pos.x / v1.pos.z * Constants.FOV + Constants.WIDTH / 2.0 - 0.5, v1.pos.y / v1.pos.z * Constants.FOV + Constants.HEIGHT / 2.0 - 0.5);

        // Render left to right
        if (p1.x < p0.x) {
            let tmp = p0;
            p0 = p1;
            p1 = tmp;

            tmp = v0;
            v0 = v1;
            v1 = tmp;
        }

        let x0 = Math.ceil(p0.x);
        let y0 = Math.ceil(p0.y);
        let x1 = Math.ceil(p1.x);
        let y1 = Math.ceil(p1.y);

        if (x0 < 0) x0 = 0;
        if (x1 > Constants.WIDTH) x1 = Constants.WIDTH;
        if (y0 < 0) y0 = 0;
        if (y1 > Constants.HEIGHT) y1 = Constants.HEIGHT;

        let dx = p1.x - p0.x;
        let dy = p1.y - p0.y;

        let m = Math.abs(dy / dx);

        if (m <= 1) {
            for (let x = x0; x < x1; x++) {
                let per = (x - p0.x) / (p1.x - p0.x);

                let y = p0.y + (p1.y - p0.y) * per;
                let z = 1 / ((1 - per) / v0.pos.z + per / v1.pos.z);

                let c = Util.lerp2AttributeVec3(v0.color, v1.color, (1 - per), per, v0.pos.z, v1.pos.z, z);

                this.renderPixel(new Vector3(Util.int(x), Util.int(y), z), c);
            }
        }
        else {
            if (p1.y < p0.y) {
                let tmp = p0;
                p0 = p1;
                p1 = tmp;

                tmp = v0;
                v0 = v1;
                v1 = tmp;
            }

            x0 = Math.ceil(p0.x);
            y0 = Math.ceil(p0.y);
            x1 = Math.ceil(p1.x);
            y1 = Math.ceil(p1.y);

            if (x0 < 0) x0 = 0;
            if (x1 > Constants.WIDTH) x1 = Constants.WIDTH;
            if (y0 < 0) y0 = 0;
            if (y1 > Constants.HEIGHT) y1 = Constants.HEIGHT;

            for (let y = y0; y < y1; y++) {
                let per = (y - p0.y) / (p1.y - p0.y);

                let x = p0.x + (p1.x - p0.x) * per;
                let z = 1 / ((1 - per) / v0.pos.z + per / v1.pos.z);

                let c = Util.lerp2AttributeVec3(v0.color, v1.color, (1 - per), per, v0.pos.z, v1.pos.z, z);
                this.renderPixel(new Vector3(Util.int(x), Util.int(y), z), c);
            }
        }
    }

    drawFace(f) {
        this.drawTriangle(f.v0, f.v1, f.v2);
    }

    // Expect the input vertices to be in the local space
    drawTriangle(v0, v1, v2) {
        // Render CCW
        if ((this.renderFlag & RENDER_CCW) == RENDER_CCW) {
            const tmp = v0;
            v0 = v1;
            v1 = tmp;
        }

        if (v0.normal == undefined || v1.normal == undefined || v2.normal == undefined) {
            const normal = v2.pos.sub(v0.pos).cross(v1.pos.sub(v0.pos)).normalized();
            v0.normal = normal;
            v1.normal = normal;
            v2.normal = normal;
        }

        v0 = this.modelTransform(v0);
        v1 = this.modelTransform(v1);
        v2 = this.modelTransform(v2);

        // Render Face normal
        if ((this.renderFlag & RENDER_FACE_NORMAL) == RENDER_FACE_NORMAL && (this.renderFlag & RENDER_TANGENT_SPACE) != RENDER_TANGENT_SPACE) {
            const center = v0.pos.add(v1.pos.add(v2.pos)).div(3.0);
            this.drawLine(new Vertex(center, 0xffffff), new Vertex(center.add(v0.normal.add(v1.normal).add(v2.normal).normalized().mul(NORMAL_LENGTH)), 0xff00ff));
        }

        // Render Vertex normal
        if ((this.renderFlag & RENDER_VERTEX_NORMAL) == RENDER_VERTEX_NORMAL) {
            const pos = v0.pos;
            this.drawLine(new Vertex(pos, 0xffffff), new Vertex(pos.add(v0.normal.mul(NORMAL_LENGTH)), 0x0000ff));
        }

        // Render Tangent space
        if ((this.renderFlag & RENDER_TANGENT_SPACE) == RENDER_TANGENT_SPACE && v0.tangent != undefined) {
            const pos = v0.pos.add(v1.pos).add(v2.pos).div(3);
            this.drawLine(new Vertex(pos, 0xffffff), new Vertex(pos.add(v0.tangent.mul(NORMAL_LENGTH)), 0xff0000));
            this.drawLine(new Vertex(pos, 0xffffff), new Vertex(pos.add(v0.biTangent.mul(NORMAL_LENGTH)), 0x00ff00));
            this.drawLine(new Vertex(pos, 0xffffff), new Vertex(pos.add(v0.normal.mul(NORMAL_LENGTH)), 0x0000ff));
        }

        v0 = this.cameraTransform(v0);
        v1 = this.cameraTransform(v1);
        v2 = this.cameraTransform(v2);

        // Vertex Shader + Geometry Shader Begin
        {
            if (this.normalMap != undefined) {
                this.tbn = this.tbn.fromAxis(v0.tangent, v0.biTangent, v0.normal.add(v1.normal).add(v2.normal).normalized());
            }
        }
        // Vertex Shader + Geometry Shader End

        // z-Near clipping for triangle (my own algorithm used)
        if (v0.pos.z < this.zClipNear && v1.pos.z < this.zClipNear && v2.pos.z < this.zClipNear) {
            return;
        }
        else if (v0.pos.z > this.zClipNear && v1.pos.z > this.zClipNear && v2.pos.z > this.zClipNear) {
            this.drawTriangleVS(v0, v1, v2);
            return;
        }

        const vps = [v0, v1, v2, v0];
        const drawVertices = [];

        for (let i = 0; i < 3; i++) {
            const cv = vps[i];
            const nv = vps[i + 1];

            const cvToNear = cv.pos.z - this.zClipNear;
            const nvToNear = nv.pos.z - this.zClipNear;

            if (cvToNear < 0 && nvToNear < 0) continue;

            // If the edge intersects with z-Near plane
            if (cvToNear * nvToNear < 0) {
                const per = (this.zClipNear - cv.pos.z) / (nv.pos.z - cv.pos.z);

                const clippedPos = cv.pos.add(nv.pos.sub(cv.pos).mul(per));
                const clippedCol = cv.color.add(nv.color.sub(cv.color).mul(per));
                const clippedTxC = cv.texCoord.add(nv.texCoord.sub(cv.texCoord).mul(per));

                if (cvToNear > 0) drawVertices.push(cv);
                drawVertices.push(new Vertex(clippedPos, clippedCol, clippedTxC, cv.normal));
            }
            else {
                drawVertices.push(cv);
            }
        }

        switch (drawVertices.length) {
            case 3:
                this.drawTriangleVS(drawVertices[0], drawVertices[1], drawVertices[2])
                break;
            case 4:
                this.drawTriangleVS(drawVertices[0], drawVertices[1], drawVertices[2])
                this.drawTriangleVS(drawVertices[0], drawVertices[2], drawVertices[3])
                break;
        }
    }

    // Expect the input vertices to be in the camera space(view space)
    drawTriangleVS(vp0, vp1, vp2) {
        const z0 = vp0.pos.z;
        const z1 = vp1.pos.z;
        const z2 = vp2.pos.z;

        // Transform a vertices in camera space to viewport space at one time (Avoid heavy matrix multiplication)
        // Projection transform + viewport transform
        const p0 = new Vector2(vp0.pos.x / vp0.pos.z * Constants.FOV + Constants.WIDTH / 2.0 - 0.5, vp0.pos.y / vp0.pos.z * Constants.FOV + Constants.HEIGHT / 2.0 - 0.5);
        const p1 = new Vector2(vp1.pos.x / vp1.pos.z * Constants.FOV + Constants.WIDTH / 2.0 - 0.5, vp1.pos.y / vp1.pos.z * Constants.FOV + Constants.HEIGHT / 2.0 - 0.5);
        const p2 = new Vector2(vp2.pos.x / vp2.pos.z * Constants.FOV + Constants.WIDTH / 2.0 - 0.5, vp2.pos.y / vp2.pos.z * Constants.FOV + Constants.HEIGHT / 2.0 - 0.5);

        let minX = Math.ceil(Math.min(p0.x, p1.x, p2.x));
        let maxX = Math.ceil(Math.max(p0.x, p1.x, p2.x));
        let minY = Math.ceil(Math.min(p0.y, p1.y, p2.y));
        let maxY = Math.ceil(Math.max(p0.y, p1.y, p2.y));

        if (minX < 0) minX = 0;
        if (minY < 0) minY = 0;
        if (maxX > Constants.WIDTH) maxX = Constants.WIDTH;
        if (maxY > Constants.HEIGHT) maxY = Constants.HEIGHT;

        const v10 = new Vector2(p1.x - p0.x, p1.y - p0.y);
        const v21 = new Vector2(p2.x - p1.x, p2.y - p1.y);
        const v02 = new Vector2(p0.x - p2.x, p0.y - p2.y);
        const v20 = new Vector2(p2.x - p0.x, p2.y - p0.y);

        const area = v10.cross(v20);

        // Culling back faces
        if (area < 0) return;

        let depthMin = (this.renderFlag & SET_Z_9999) == SET_Z_9999 ? 9999 : 0;
        let calcLight = (this.renderFlag & CALC_LIGHT) == CALC_LIGHT ? true : false;

        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                let p = new Vector2(x, y);

                let w0 = v21.cross(p.sub(p1));
                let w1 = v02.cross(p.sub(p2));
                let w2 = v10.cross(p.sub(p0));

                // Render Clock wise
                if (w0 < 0 || w1 < 0 || w2 < 0) continue;

                w0 /= area;
                w1 /= area;
                w2 /= area;

                // Z value of current fragment(pixel)
                const z = 1.0 / (w0 / z0 + w1 / z1 + w2 / z2);
                let color = 0;

                // Fragment(Pixel) Shader Begin
                {
                    const uv = Util.lerp3AttributeVec2(vp0.texCoord, vp1.texCoord, vp2.texCoord, w0, w1, w2, z0, z1, z2, z);
                    const pixelPos = vp0.pos.mul(w0).add(vp1.pos.mul(w1)).add(vp2.pos.mul(w2)).mulXYZ(1, 1, -1);
                    // let c = Util.lerp3AttributeVec3(v0.color, v1.color, v2.color, w0, w1, w2, z0, z1, z2, z);

                    let pixelNormal = undefined;
                    if (this.normalMap != undefined && (this.renderFlag & DISABLE_NORMAL_MAPPING) != DISABLE_NORMAL_MAPPING) {
                        let sampledNormal = Util.sample(this.normalMap, uv.x, uv.y);
                        sampledNormal = Util.convertColorToVectorRange2(sampledNormal).normalized();

                        if ((this.renderFlag & FLIP_NORMALMAP_Y) != FLIP_NORMALMAP_Y)
                            sampledNormal.y *= -1;

                        sampledNormal = this.tbn.mulVector(sampledNormal, 0);
                        pixelNormal = sampledNormal.normalized();
                    }
                    else {
                        pixelNormal = Util.lerp3AttributeVec3(vp0.normal, vp1.normal, vp2.normal, w0, w1, w2, z0, z1, z2, z);
                    }

                    if (this.difuseMap == undefined)
                        color = Util.lerp3AttributeVec3(vp0.color, vp1.color, vp2.color, w0, w1, w2, z0, z1, z2, z);
                    else
                        color = Util.sample(this.difuseMap, uv.x, uv.y);

                    if (calcLight) {
                        const toLight = this.sun.dirVS.mul(-1).normalized();

                        let diffuse = toLight.dot(pixelNormal) * this.sun.intensity;
                        diffuse = Util.clamp(diffuse, this.ambient, 1.0);

                        let specular = 0;

                        // Phong specular reflection
                        if (this.specularIntensity != undefined) {
                            const toView = pixelPos.mul(-1).normalized();

                            let reflection = pixelNormal.mul(2 * toLight.dot(pixelNormal)).sub(toLight).normalized();
                            specular = Math.pow(Math.max(0, toView.dot(reflection)), this.specularIntensity);
                        }

                        color = Util.mulColor(color, diffuse + specular);
                    }
                }
                // Fragment(Pixel) Shader End

                this.renderPixel(new Vector3(x, y, z + depthMin), color);
            }
        }
    }

    drawModel(model, flag) {
        if (flag == undefined)
            this.renderFlag |= RENDER_CCW;
        else
            this.renderFlag = flag;

        for (let i = 0; i < model.faces.length; i++)
            this.drawFace(model.faces[i]);

        this.renderFlag = this.defaultRenderFlag;
    }

    // Local space -> World space
    modelTransform(v) {
        const newPos = this.transform.mulVector(v.pos, 1);
        const newNor = v.normal != undefined ? this.transform.mulVector(v.normal, 0).normalized() : undefined;
        const newTan = v.tangent != undefined ? this.transform.mulVector(v.tangent, 0).normalized() : undefined;
        const newBiTan = v.biTangent != undefined ? this.transform.mulVector(v.biTangent, 0).normalized() : undefined;

        return new Vertex(newPos, v.color, v.texCoord, newNor, newTan, newBiTan);
    }

    // World space -> Cemera space(view space)
    cameraTransform(v) {
        const newPos = this.camera.cameraTransform.mulVector(new Vector3(v.pos.x, v.pos.y, v.pos.z));
        newPos.z *= -1;

        const newNor = v.normal != undefined ? this.camera.cameraTransform.mulVector(v.normal, 0).normalized() : undefined;
        const newTan = v.tangent != undefined ? this.camera.cameraTransform.mulVector(v.tangent, 0).normalized() : undefined;
        const newBiTan = v.biTangent != undefined ? this.camera.cameraTransform.mulVector(v.biTangent, 0).normalized() : undefined;

        return new Vertex(newPos, v.color, v.texCoord, newNor, newTan, newBiTan);
    }

    renderPixel(p, c) {
        if (typeof c != "number") c = Util.convertVectorToColorHex(c);

        if (p.z >= this.zBuffer[p.x + (Constants.HEIGHT - 1 - p.y) * Constants.WIDTH]) return;
        if (p.x < 0 || p.x >= this.width || p.y < 0 || p.y >= this.height) return;

        this.pixels[p.x + (Constants.HEIGHT - 1 - p.y) * this.width] = c;
        this.zBuffer[p.x + (Constants.HEIGHT - 1 - p.y) * this.width] = p.z;
    }

    setMaterial(diffuseMap, normalMap, specularIntensity, normalMapFlipY) {
        this.difuseMap = diffuseMap;
        this.normalMap = normalMap;
        this.specularIntensity = specularIntensity;

        if (normalMapFlipY) this.renderFlag |= FLIP_NORMALMAP_Y;
    }

    toggleRenderFlag(flag) {
        this.defaultRenderFlag = ((this.defaultRenderFlag & flag) == flag) ? this.defaultRenderFlag ^ flag : this.defaultRenderFlag | flag;
    }
}

//--------------------------------------------------------------------------------------------------

let Util = {};

Util.convertImageDataToBitmap = function(imageData, width, height) {
    const res = new Bitmap(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const r = imageData.data[(x + y * width) * 4];
            const g = imageData.data[(x + y * width) * 4 + 1];
            const b = imageData.data[(x + y * width) * 4 + 2];

            res.pixels[x + y * width] = (r << 16) | (g << 8) | b;
        }
    }

    return res;
}

Util.convertBitmapToImageData = function(bitmap, scale = 1) {
    const res = new ImageData(bitmap.width * scale, bitmap.height * scale);

    for (let y = 0; y < bitmap.height; y++) {
        for (let x = 0; x < bitmap.width; x++) {
            const bitmapPixel = bitmap.pixels[x + y * bitmap.width]

            const r = (bitmapPixel >> 16) & 0xff;
            const g = (bitmapPixel >> 8) & 0xff;
            const b = bitmapPixel & 0xff;

            if (scale == 1) {
                const ptr = ((x * scale) + ((y * scale)) * res.width) * 4;

                res.data[ptr] = r;
                res.data[ptr + 1] = g;
                res.data[ptr + 2] = b;
                res.data[ptr + 3] = Constants.globalAlpha;
                continue;
            }

            for (let ys = 0; ys < scale; ys++) {
                for (let xs = 0; xs < scale; xs++) {
                    const ptr = ((x * scale) + xs + ((y * scale) + ys) * res.width) * 4;

                    res.data[ptr] = r;
                    res.data[ptr + 1] = g;
                    res.data[ptr + 2] = b;
                    res.data[ptr + 3] = Constants.globalAlpha;
                }
            }
        }
    }

    return res;
}

Util.int = function(a) {
    return Math.ceil(a);
}

Util.saturate = function(v) {
    return clamp(v, 0, 1);
}

Util.clamp = function(v, min, max) {
    return Math.max(min, Math.min(max, v));
    // return (v < min) ? min : (max < v) ? max : v;
}

Util.lerp = function(a, b, per) {
    return a * (1.0 - per) + b * per;
}

Util.lerpVector2 = function(a, b, per) {
    return a.mul(1 - per).add(b.mul(per));
}

Util.lerpVector3 = function(a, b, c, w0, w1, w2) {
    const wa = a.mul(w0);
    const wb = b.mul(w1);
    const wc = c.mul(w2);

    return new Vector3(wa.x + wb.x + wc.x, wa.y + wb.y + wc.y, wa.z + wb.z + wc.z);
}

Util.lerp2AttributeVec3 = function(a, b, w0, w1, z0, z1, z) {
    const wa = a.mul(w0 / z0 * z);
    const wb = b.mul(w1 / z1 * z);

    return new Vector3(wa.x + wb.x, wa.y + wb.y, wa.z + wb.z);
}

Util.lerp3AttributeVec2 = function(a, b, c, w0, w1, w2, z0, z1, z2, z) {
    const wa = a.mul(w0 / z0 * z);
    const wb = b.mul(w1 / z1 * z);
    const wc = c.mul(w2 / z2 * z);

    return new Vector2(wa.x + wb.x + wc.x, wa.y + wb.y + wc.y);
}

Util.lerp3AttributeVec3 = function(a, b, c, w0, w1, w2, z0, z1, z2, z) {
    const wa = a.mul(w0 / z0 * z);
    const wb = b.mul(w1 / z1 * z);
    const wc = c.mul(w2 / z2 * z);

    return new Vector3(wa.x + wb.x + wc.x, wa.y + wb.y + wc.y, wa.z + wb.z + wc.z);
}

Util.convertColorToVectorRange1 = function(hex) {
    const r = ((hex >> 16) & 0xff) / 255.0;
    const g = ((hex >> 8) & 0xff) / 255.0;
    const b = (hex & 0xff) / 255.0;

    return new Vector3(r, g, b);
}

Util.convertColorToVectorRange2 = function(hex) {
    const r = ((hex >> 16) & 0xff) / 127.5 - 1.0;
    const g = ((hex >> 8) & 0xff) / 127.5 - 1.0;
    const b = (hex & 0xff) / 127.5 - 1.0;

    return new Vector3(r, g, b);
}

Util.convertColorToVectorRange255 = function(hex) {
    const r = ((hex >> 16) & 0xff);
    const g = ((hex >> 8) & 0xff);
    const b = (hex & 0xff);

    return new Vector3(r, g, b);
}

Util.convertVectorToColorHex = function(vec3) {
    return (vec3.x << 16) | (vec3.y << 8) | vec3.z;
}

Util.clipColorVector = function(vec3) {
    const nr = Util.clamp(vec3.x, 0, 255);
    const ng = Util.clamp(vec3.y, 0, 255);
    const nb = Util.clamp(vec3.z, 0, 255);

    return new Vector3(nr, ng, nb);
}

Util.mulColor = function(hex, per) {
    const r = Util.clamp(((hex >> 16) & 0xff) * per, 0, 255);
    const g = Util.clamp(((hex >> 8) & 0xff) * per, 0, 255);
    const b = Util.clamp((hex & 0xff) * per, 0, 255);

    return Util.int((r << 16)) | Util.int(g << 8) | Util.int(b);
}

Util.addColor = function(hex, val) {
    const r = Util.clamp(((hex >> 16) & 0xff) + val, 0, 255);
    const g = Util.clamp(((hex >> 8) & 0xff) + val, 0, 255);
    const b = Util.clamp((hex & 0xff) + val, 0, 255);

    return Util.int((r << 16)) | Util.int(g << 8) | Util.int(b);
}

Util.createTransformMatrix = function(pos, rot, scale) {
    return new Matrix4().translate(pos.x, pos.y, pos.z).rotate(rot.x, rot.y, rot.z).scale(scale.x, scale.y, scale.z);
}

Util.sample = function(texture, u, v) {
    let tx = Math.floor(texture.width * u);
    let ty = Math.floor(texture.height * (1 - v));

    if (tx < 0) tx = 0;
    if (tx >= texture.width) tx = texture.width - 1;
    if (ty < 0) ty = 0;
    if (ty >= texture.height) ty = texture.height - 1;

    return texture.pixels[tx + ty * texture.width];
}

//--------------------------------------------------------------------------------------------------

class Vertex {
    constructor(pos, color, texCoord, normal, tangent, biTangent) {
        this.pos = pos;

        if (typeof color == "number")
            this.color = new Vector3((color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff);
        else if (color == undefined)
            this.color = new Vector3(255, 0, 255);
        else
            this.color = color;

        if (texCoord == undefined)
            this.texCoord = new Vector2(0, 0);
        else
            this.texCoord = texCoord;

        this.normal = normal;
        this.tangent = tangent;
        this.biTangent = biTangent;
    }
}

//--------------------------------------------------------------------------------------------------

window.onload = () => {
    new Engine().start();
}

// Load models, parse OBJ
for (const key in Resources.models) {
    if (Object.hasOwnProperty.call(Resources.models, key)) {
        const modelURL = Resources.models[key];

        let xhr = new XMLHttpRequest();
        xhr.open("get", modelURL, true);
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Load OBJ file line by line
                const lines = xhr.response.split('\n');

                let positions = [];
                let texCoords = [];
                let normals = [];
                let indices = [];

                for (const line of lines) {
                    const tokens = line.split(" ");
                    switch (tokens[0]) {
                        case "v":
                            let v = [];
                            for (let i = 0; i < 3; i++)
                                v.push(parseFloat(tokens[i + 1]))
                            positions.push(v);
                            break;

                        case "vt":
                            let tc = [];
                            for (let i = 0; i < 2; i++)
                                tc.push(parseFloat(tokens[i + 1]))
                            texCoords.push(tc);
                            break;

                        case "vn":
                            let vn = [];
                            for (let i = 0; i < 3; i++)
                                vn.push(parseFloat(tokens[i + 1]))
                            normals.push(vn);
                            break;

                        case "f":
                            let f = [];
                            for (let i = 0; i < 3; i++) {
                                let v = [];
                                for (let j = 0; j < 3; j++)
                                    v.push(parseInt(tokens[i + 1].split("/")[j]))
                                f.push(v);
                            }
                            indices.push(f);
                            break;
                    }
                }

                // console.log(indices);
                Constants.loadedResources++;

                Resources.models[key] = new Model(positions, texCoords, normals, indices);
            }
        }
    }
}

//--------------------------------------------------------------------------------------------------