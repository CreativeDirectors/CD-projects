import * as THREE from 'three';
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import particle_mask from "../public/particle_mask.jpg"
import img from "../public/CD_Shining_Logo5_withtrademark_01.png"

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class sketch {

  constructor() {


    this.app = document.getElementById("app")

    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // this.renderer.setSize(this.app.offsetWidth, this.app.offsetHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("app").appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, this.app.offsetWidth / this.app.offsetHeight, 0.01, 6000);
    this.camera.position.z = 5000;

    this.scene = new THREE.Scene();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2()
    this.startTime = Date.now();
    this.point = new THREE.Vector2()

    this.textures = [
      new THREE.TextureLoader().load(img),
      new THREE.TextureLoader().load(particle_mask)

    ]

    // this.planetwo = new THREE.Mesh(
    //   new THREE.PlaneGeometry(4000, 1000),
    //   new THREE.MeshBasicMaterial()
    // )

    this.time = 0

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addMesh()

    this.mouseEffects()
    this.render()
  }

  mouseEffects() {

    this.test = new THREE.Mesh(
      new THREE.PlaneGeometry(5000, 5000),
      new THREE.MeshBasicMaterial()
    )

    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.app.offsetWidth) * 2 - 1;
      this.mouse.y = - (event.clientY / this.app.offsetHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera)

      let intersects = this.raycaster.intersectObjects([this.test])
      this.point.x = intersects[0].point.x
      this.point.y = intersects[0].point.y

    }, false)
    console.log(document.getElementById("app"));
    window.addEventListener('resize', (event) => {
      // Get the new dimensions of the container
      let width = window.innerWidth;
      let height = window.innerHeight;
      // let width = this.app.offsetWidth;
      // let height = this.app.offsetHeight;

      // Update the renderer's size
      console.log(width, height);
      this.renderer.setSize(width, height);
      // Adjust the camera's aspect ratio
      this.camera.aspect = width / height;
      console.log((1 / width) * 1000);
      this.camera.updateProjectionMatrix();
    }, false);

  }


  addMesh() {
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        progress: { type: "f", value: 0 },
        img: { type: "t", value: this.textures[0] },
        particle_mask: { type: "t", value: this.textures[1] },
        move: { type: "f", value: 0 },
        mouse: { type: "v2", value: null },
        time: { type: "f", value: 0 },
        elapsedTime: { value: 0.0 }

      },
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false
    })
    let multiplier = 4
    let number = 768 * 512 * multiplier;

    function rand(a, b) {
      return a + (b - a) * Math.random()
    }

    // this.geometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    this.geometry = new THREE.BufferGeometry();

    this.positions = new THREE.BufferAttribute(new Float32Array(number * 3), 3)
    this.coordinates = new THREE.BufferAttribute(new Float32Array(number * 3), 3)
    this.speeds = new THREE.BufferAttribute(new Float32Array(number), 1)
    this.offset = new THREE.BufferAttribute(new Float32Array(number), 1)
    this.direction = new THREE.BufferAttribute(new Float32Array(number), 1)
    this.press = new THREE.BufferAttribute(new Float32Array(number), 1)

    // this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    let index = 0
    for (let i = 0; i < 768 * (multiplier / 2); i++) {  // X axis
      let posX = i - 384 * (multiplier / 2)
      for (let j = 0; j < 512 * (multiplier / 2); j++) {  // Y axis
        this.positions.setXYZ(index, posX * 2, (j - 256 * (multiplier / 2)) * 2, 0)
        this.coordinates.setXYZ(index, i, j, 0)
        this.offset.setX(index, rand(-1000, 1000))
        this.speeds.setX(index, rand(0.4, 1))
        this.direction.setX(index, Math.random() > 0.5 ? 1 : -1)
        this.press.setX(index, rand(0.8, 1))

        index++;
      }
    }

    this.geometry.setAttribute("position", this.positions)
    this.geometry.setAttribute("aCoordinates", this.coordinates)
    this.geometry.setAttribute("aSpeed", this.speeds)
    this.geometry.setAttribute("aOffset", this.offset)
    this.geometry.setAttribute("aDirection", this.direction)
    this.geometry.setAttribute("aPress", this.press)

    this.mesh = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.mesh);
    // this.planetwo.position.z = 100;
    // this.scene.add(this.planetwo)
  }


  render() {
    this.time++
    // console.log(this.time);
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;

    var elapsedSeconds = (Date.now() - this.startTime) / 1000;

    this.material.uniforms.elapsedTime.value = elapsedSeconds;
    this.material.uniforms.time.value = this.time
    this.material.uniforms.move.value = this.move
    this.material.uniforms.mouse.value = this.point

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this))

  }

}

new sketch()

