import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader';


const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.position.z = 50
scene.add(camera)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

scene.background = new THREE.Color(0xffffff);

// var light = new THREE.AmbientLight( 0xededed );
// light.intensity = 1.3;
// scene.add(light);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

// gltfLoader.load(
//     'Umbelra.glb',
//     (gltf) =>
//     {
//         gltf.scene.rotation.x = 0.7;
//         gltf.scene.rotation.y = 0.5;
//         gltf.scene.rotation.z = 5.4;
//         scene.add(gltf.scene)
//     }
// )

const textureLoader = new THREE.TextureLoader();
const mtlLoader = new MTLLoader();

mtlLoader.load('1.mtl', (mtl) => {
    mtl.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);

    textureLoader.load('1.jpg', (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );

        objLoader.load('1.obj', (obj) => {
            obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });

            scene.add(obj);
        });
    });
});


const cursor ={x:0, y:0}
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -( event.clientY / sizes.width - 0.5)
})


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)

window.addEventListener('resize', () => 
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()    

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})
const animate = () =>
{

    renderer.render(scene, camera)
    renderer.gammaOutput = true;
    controls.update()

    window.requestAnimationFrame(animate)
}

animate()