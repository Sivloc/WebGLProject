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
    TextureLoader
} from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

const scene = new Scene();
const aspect = window.innerWidth / window.innerHeight;
//const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);


const loader = new TextureLoader();
const sunTex = loader.load('assets/textures/2k_sun.jpg');

/*{
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new PointLight(color, intensity);
    scene.add(light);
}*/


//const light = new AmbientLight(0xffffff, 1.0); // soft white light
//scene.add(light);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const gui = new GUI();
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional

const objects = [];

const radius = 1;
const widthSegments = 50;
const heightSegments = 50;
const sphereGeometry = new SphereGeometry(radius, widthSegments, heightSegments);
const solarSystem = new Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

const sunMaterial = new MeshPhongMaterial({ emissive: 0xe38f3b, map: sunTex });
sunMaterial.map = sunTex;
const sunMesh = new Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
solarSystem.add(sunMesh);
objects.push(sunMesh);

const earthOrbit = new Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const earthMaterial = new MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 });
const earthMesh = new Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

const moonOrbit = new Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

const moonMaterial = new MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
const moonMesh = new Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

// add an AxesHelper to each node
/*objects.forEach((node) => {
    const axes = new AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    node.add(axes);
});*/
class AxisGridHelper {
    constructor(node, units = 10) {
        const axes = new AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 2;  // after the grid
        node.add(axes);

        const grid = new GridHelper(units, units);
        grid.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        this.grid = grid;
        this.axes = axes;
        this.visible = false;
    }
    get visible() {
        return this._visible;
    }
    set visible(v) {
        this._visible = v;
        this.grid.visible = v;
        this.axes.visible = v;
    }
}
function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
}

makeAxisGrid(solarSystem, 'solarSystem', 25);
makeAxisGrid(sunMesh, 'sunMesh');
makeAxisGrid(earthOrbit, 'earthOrbit');
makeAxisGrid(earthMesh, 'earthMesh');
makeAxisGrid(moonOrbit, 'moonOrbit');
makeAxisGrid(moonMesh, 'moonMesh');
const clock = new Clock();

const animation = () => {

    renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // can be used in shaders: uniforms.u_time.value = elapsed;

    /*sunMesh.rotation.x = elapsed / 2;
    sunMesh.rotation.y = elapsed / 1;

    earthMesh.rotation.x = elapsed / 2;
    earthMesh.rotation.y = elapsed / 1;*/

    objects.forEach((obj) => {
        obj.rotation.y = elapsed / 2;
    });

    renderer.render(scene, camera);
};

animation();




