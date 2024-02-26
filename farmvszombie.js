import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    BoxGeometry,
    Mesh,
    MeshNormalMaterial,
    AmbientLight,
    Clock,
    Sphere,
    SphereGeometry,
    MeshPhongMaterial,
    PointLight,
    Object3D,
    AxesHelper,
    GridHelper,
    TextureLoader,
    MeshToonMaterial,
    NoBlending,
    HemisphereLight,
    TetrahedronGeometry,
    DirectionalLight,
    Color,
    PMREMGenerator,
    AnimationMixer,
    LoopOnce,
    Raycaster,
    Vector3
} from './node_modules/three';
//import { GUI } from './node_modules/three/addons/libs/lil-gui.module.min.js';
// import {
//     OrbitControls
// } from 'three/addons/controls/OrbitControls.js';
import {
    GLTFLoader
} from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
// import * as dat from 'dat.gui';
// import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ZZFX, zzfx } from './node_modules/zzfx/ZzFX.js';
const loader = new TextureLoader();
const skyboxTexture = loader.load('assets/textures/skybox.jpg');
const grassTexture = loader.load('assets/textures/grass.jpg');
const hayTexture = loader.load('assets/textures/hay.jpg');
const barnTexture = loader.load('assets/textures/barn.jpg');
const modelLoader = new GLTFLoader();

/*let chickenModel;

modelLoader.load('assets/models/chicken.glb', (gltf) => {
    chickenModel = gltf.scene;
    scene.add(chickenModel);
});*/
const renderer = new WebGLRenderer();
const scene = new Scene();
const aspect = window.innerWidth / window.innerHeight;
const mouse = { x: 0, y: 0 };
const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 50, -50);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

const projectiles = [];
const enemies = [];
const animaux = [];
//const gui = new GUI();
let blé = 0;
let selectedEntity = 0;
const blécounter = document.getElementById('score');
const icon1Button = document.getElementById('icon1');
const icon2Button = document.getElementById('icon2');
const icon3Button = document.getElementById('icon3');
// {
//     const color = 0xffffff;
//     const intensity = 1.5;
//     const light = new AmbientLight(color, intensity);
//     scene.add(light);
// }
const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 1.5);
hemiLight.color.setHSL(1, 1, 1);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const dirLight = new DirectionalLight(0xfdfbd3, 0.5);
dirLight.color.setHSL(0.1, 1, 0.95);
dirLight.position.set(- 1, 1.75, 1);
dirLight.position.multiplyScalar(30);
scene.add(dirLight);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const plateau = new BoxGeometry(100, 1, 100);
const plateauMaterial = new MeshPhongMaterial({ color: 0xf0c322, map: hayTexture });
const plateauMesh = new Mesh(plateau, plateauMaterial);
scene.add(plateauMesh);
const squareSize = 10;
const numRows = 5;
const numCols = 8;

const squareGap = 2; // Ecart entre chaque carré

for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        const squareGeometry = new BoxGeometry(squareSize, 1, squareSize);
        const squareMaterial = new MeshToonMaterial({ color: 0xaaaaaa, map: grassTexture });
        const squareMesh = new Mesh(squareGeometry, squareMaterial);
        squareMesh.position.set(
            (col - numCols / 2) * (squareSize + squareGap) + 6,
            0.2,
            (row - numRows / 2) * (squareSize + squareGap)
        );
        squareMesh.name = `square-${row}-${col}`;
        // const axesHelper = new AxesHelper(10);
        // squareMesh.add(axesHelper);
        plateauMesh.add(squareMesh);
    }
}

const skybox = new BoxGeometry(1000, 1000, 1000);
const skyboxMaterial = new MeshPhongMaterial({ color: 0xaaaaaa, shininess: 0, side: 2, map: skyboxTexture, blending: NoBlending });
const skyboxMesh = new Mesh(skybox, skyboxMaterial);
scene.add(skyboxMesh);

const grange = new BoxGeometry(20, 50, 100);
const grangeMaterial = new MeshPhongMaterial({ color: 0xaaaaaa, shininess: 0, side: 2, map: barnTexture, blending: NoBlending });
const grangeMesh = new Mesh(grange, grangeMaterial);
grangeMesh.position.set(60, 10, 0);
scene.add(grangeMesh);


icon1Button.addEventListener('click', () => {

    console.log('Icon 1 clicked');
    selectedEntity = 1;
    icon2Button.classList.remove('icon-clicked');
    icon3Button.classList.remove('icon-clicked');
    icon1Button.classList.add('icon-clicked');
});
icon2Button.addEventListener('click', () => {
    console.log('Icon 2 clicked');
    selectedEntity = 2;
    icon1Button.classList.remove('icon-clicked');
    icon3Button.classList.remove('icon-clicked');
    icon2Button.classList.add('icon-clicked');
});
icon3Button.addEventListener('click', () => {
    console.log('Icon 3 clicked');
    selectedEntity = 3;
    icon1Button.classList.remove('icon-clicked');
    icon2Button.classList.remove('icon-clicked');
    icon3Button.classList.add('icon-clicked');
});

function updateblé(float) {
    blé += float;
    blécounter.innerHTML = blé;
}
let tmp = new Vector3();
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new Raycaster();

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(plateauMesh.children, true);
    const square = intersects[0].object;
    console.log(square.name, square.position);
    switch (selectedEntity) {
        case 1:
            if (blé >= 50) {
                square.getWorldPosition(tmp);
                spawnFarmer(tmp);
                updateblé(-50);
            }
            break;
        case 2:
            if (blé >= 25) {
                square.getWorldPosition(tmp);
                spawnPig(tmp);
                updateblé(-20);
            }
            break;
        case 3:
            if (blé >= 100) {
                square.getWorldPosition(tmp);
                spawnChicken(tmp);
                updateblé(-100);
            }
            break;
        default:
            break;

    }

});

class Farmer {
    constructor(position) {
        this.mesh = new Mesh();
        this.mixer = new AnimationMixer(this.mesh);
        this.gltf = null;
        this.action = null;
        modelLoader.load('assets/models/Farmer.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(10, 10, 10);
            this.mesh.rotation.y = Math.PI;
            //this.mesh.position.set(position);
            this.mesh.position.copy(position);
            scene.add(this.mesh);
            this.gltf = gltf;
            this.mixer = new AnimationMixer(this.mesh);
            this.action = this.mixer.clipAction(gltf.animations[23]);
            this.action.setLoop(LoopOnce);
            //this.action.clampWhenFinished = true;
            console.log(this.gltf.animations);
        })
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.hitpoints = 1;
        this.prodTimer = 0;
    }
    tick(deltaTime) {
        this.mixer.update(deltaTime);
        this.prodTimer += deltaTime;
        if (this.prodTimer % 5 < 1 / 60) {
            if (this.gltf && this.action) {
                this.action.play();
                updateblé(50);
            }
        }
        if (this.hitpoints <= 0) {
            scene.remove(this.mesh);
            animaux.splice(animaux.indexOf(this), 1);
        }

    }
}

function spawnFarmer(position) {
    const farmer = new Farmer(position);
    //farmer.mesh.position.set(position);
    animaux.push(farmer);

}

class Pig {
    constructor(position) {
        this.mesh = new Mesh();
        // var geom = new SphereGeometry(5, 30, 30);
        // var mat = new MeshPhongMaterial({ color: 0xff0000, shininess: 0, specular: 0xffffff, flatShading: true })
        // this.mesh = new Mesh(geom, mat);
        modelLoader.load('assets/models/Pig.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.position.copy(position);
            this.mesh.scale.set(2, 2, 1.5);
            this.mesh.rotation.y = Math.PI;
            scene.add(this.mesh);
        })
        this.mesh.castShadow = true;
        this.hitpoints = 5;
        scene.add(this.mesh);
    }
    tick(deltaTime) {
        if (this.hitpoints <= 0) {
            scene.remove(this.mesh);
            animaux.splice(animaux.indexOf(this), 1);
        }
    }

}
function spawnPig(position) {
    const pig = new Pig(position);
    //pig.mesh.position.set(40, 2, -5);
    animaux.push(pig);
}
class Chicken {
    constructor(position) {
        this.mesh = new Mesh();
        modelLoader.load('assets/models/chicken.glb', (gltf) => {
            this.mesh = gltf.scene;
            //this.mesh.position.set(40, 2, 15);
            this.mesh.position.copy(position);
            this.mesh.scale.set(0.6, 0.6, 0.6);
            this.mesh.rotation.y = Math.PI;
            scene.add(this.mesh);
        })
        //var geom = new SphereGeometry(5, 30, 30);
        //var mat = new MeshPhongMaterial({ color: 0xffffff, shininess: 0, specular: 0xffffff, flatShading: true })
        //this.mesh = new Mesh(geom, mat);
        this.mesh.castShadow = true;
        this.angle = 0;
        this.dist = 0;
        this.hitpoints = 1;
        this.shootTimer = 0;
    }

    tick(deltaTime) {
        this.shootTimer += deltaTime;
        if (this.shootTimer % 1 < 0.02) {
            this.mesh.rotation.z += 0.2;
            this.mesh.rotation.z -= 0.2;
            shootEgg(this.mesh.position);
        }
    }

}

function spawnChicken(position) {
    const chicken = new Chicken(position);
    //chicken.mesh.position.set(40, 2, 20);
    animaux.push(chicken);
}

class Enemy {
    constructor() {
        this.mesh = new Mesh();
        this.mixer = new AnimationMixer(this.mesh);
        this.gltf = null;
        this.action = null;
        this.ismoving = true;
        this.cooldown = 0;
        modelLoader.load('assets/models/Fox.glb', (gltf) => {
            this.mesh = gltf.scene;
            //this.mesh.position.set(-80, 0, 20);
            this.mesh.scale.set(5, 5, 5);
            this.mesh.rotation.y = Math.PI * 0.5;
            const rdm = Math.floor(Math.random() * 5);
            switch (rdm) {
                case 0:
                    this.mesh.position.set(-80, 0, 18);
                    break;
                case 1:
                    this.mesh.position.set(-80, 2, 6);
                    break;
                case 2:
                    this.mesh.position.set(-80, 2, -6);
                    break;
                case 3:
                    this.mesh.position.set(-80, 2, -18);
                    break;
                case 4:
                    this.mesh.position.set(-80, 2, -30);
                    break;
                default:
                    break;
            }
            scene.add(this.mesh);
            this.gltf = gltf;
            this.mixer = new AnimationMixer(this.mesh);
            this.action = this.mixer.clipAction(gltf.animations[8]);
            this.action.play();
        })

        this.mesh.shininess = 0;
        this.mesh.castShadow = true;
        this.angle = 0;
        this.dist = 0;
        this.hitpoints = 3;
        scene.add(this.mesh);
    }

    tick(deltaTime) {
        this.mixer.update(deltaTime);
        if (this.ismoving) {
            this.mesh.position.x += 0.4;
        }

        for (const projectile of projectiles) {
            if (collide(projectile, this.mesh, 10)) {
                this.hitpoints -= 1;
                scene.remove(projectile);
                projectiles.splice(projectiles.indexOf(projectile), 1);
            }

        }

        for (const animal of animaux) {
            if (this.cooldown <= 0) {
                if (collide(animal.mesh, this.mesh, 10)) {
                    this.mixer.clipAction(this.gltf.animations[0]).play();
                    zzfx(...[2.32, , 356, .03, .03, .07, 1, 1.16, , 6.8, , , .04, 1.1, 2, .3, .11, .61, .05, .1]); // Hit 159
                    animal.hitpoints -= 1;
                    this.ismoving = false;
                    this.cooldown = 100;
                    console.log(this.cooldown)
                } else {
                    this.ismoving = true;
                }
            } else {
                this.cooldown -= 1;
            }
        }
        //this.cooldown -= 1;
        if (this.hitpoints <= 0) {
            this.mixer.clipAction(this.gltf.animations[1]).play();
            scene.remove(this.mesh);
            enemies.splice(enemies.indexOf(this), 1);
        }
    }
}
function spawnEnemy() {
    const enemy = new Enemy();
    enemy.mesh.position.set(-80, 2, 20);
    enemies.push(enemy);
}
spawnChicken(new Vector3(40, 2, -30));
spawnFarmer(new Vector3(40, 2, 5));
spawnPig();
/*
const chickenModel = new SphereGeometry(5, 30, 30);
const skyboxMaterial2 = new MeshToonMaterial({ color: 0xffffff });
const chickenMesh = new Mesh(chickenModel, skyboxMaterial2);
console.log(chickenModel);
chickenMesh.position.set(40, 2, 20);
scene.add(chickenMesh);
*/
// const egg = new SphereGeometry(2, 30, 30);
const eggMaterial = new MeshToonMaterial({ color: 0xbd9366 });
// const eggMesh = new Mesh(egg, eggMaterial);
// eggMesh.position.set(40, 2, 20);
//scene.add(eggMesh);

function shootEgg(position) {
    zzfx(...[, , 262, , , .03, 4, .27, -46.1, .1, , , .02, .4, 1, , , .7, .04]); // Random 42 - Mutation 9
    modelLoader.load('assets/models/egg2.glb', (gltf) => {
        const eggModel = gltf.scene;
        eggModel.position.copy(position);
        eggModel.rotation.z = Math.random() * Math.PI * 2;
        eggModel.getObjectByName('group35554845').material = eggMaterial;
        scene.add(eggModel);
        projectiles.push(eggModel);
    })
    //const particle = new Mesh(egg, eggMaterial);
    //particle.position.copy(position);
    //projectiles.push(particle);
    //scene.add(particle);
}

function collide(mesh1, mesh2, tolerance) {
    const diffPos = mesh1.position.clone().sub(mesh2.position.clone())
    const d = diffPos.length()
    return d < tolerance
}

const clock = new Clock();

const animation = () => {

    renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 

    const delta = clock.getDelta();
    //console.log(delta);
    const elapsed = clock.getElapsedTime();
    if (elapsed % 3 < 0.02) {
        spawnEnemy();
    }
    projectiles.forEach((obj) => {
        obj.position.x -= 0.5;
        obj.rotation.z += 0.1;
        if (obj.position.x < -50) {
            scene.remove(obj);
            projectiles.splice(projectiles.indexOf(obj), 1);
        }
    });
    enemies.forEach((obj) => {
        obj.tick(delta);
    });
    animaux.forEach((obj) => {
        obj.tick(delta);
    });
    //eggMesh.position.x -= 0.5;
    renderer.render(scene, camera);
};

animation();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
