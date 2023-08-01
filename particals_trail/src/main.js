import * as THREE from 'three';
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import particle_mask from "../public/particle_mask.jpg"
// import img from "../public/CD_Shining_Logo5-500x150.png"
import img from "../public/spritesheet-project-1.png"

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from "stats-js"

export default class sketch {

  constructor() {


    this.app = document.getElementById("app")
    this.zoom = 3000

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);



    if (this.app && window.getComputedStyle(this.app).display !== 'none') {
      this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
      // this.renderer.setClearColor(0x000000, 0);
      // this.renderer.setSize(this.app.offsetWidth, this.app.offsetHeight);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(1)
      this.app.appendChild(this.renderer.domElement);

      // BTN FOR TESTING
      var button = document.createElement('button');
      button.textContent = 'Click me';
      button.onclick = this.resCheck;
      button.classList.add('btn');

      // this.app.appendChild(button);

      this.camera = new THREE.PerspectiveCamera(45, this.app.offsetWidth / this.app.offsetHeight, 0.01, 100000);
      this.camera.position.z = this.zoom;
      // this.camera.position.setY(-200);

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

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      this.addMesh()
      // this.resCheck()
      this.mouseEffects()
      this.render()
    }
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
    window.addEventListener('resize', (event) => {
      // Get the new dimensions of the container
      let width = window.innerWidth;
      let height = window.innerHeight;
      // let width = this.app.offsetWidth;
      // let height = this.app.offsetHeight;

      // Update the renderer's size
      this.renderer.setSize(width, height);
      // Adjust the camera's aspect ratio
      this.camera.aspect = width / height;
      // this.resCheck()
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
        elapsedTime: { value: 0.0 },
      },
      side: THREE.DoubleSide,
      transparent: false, //  ######################    --   transparent ---
      depthTest: false,
      depthWrite: false
    })

    let gridWHMulti = 0.5
    let gridWidth = 100 / gridWHMulti
    let gridHeight = 100 / gridWHMulti


    let multiplier = 1
    let number = gridWidth * gridHeight * (multiplier);



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
    for (let i = 0; i < gridWidth * multiplier; i++) {  // X axis

      let posX = i - (gridWidth / 2) * multiplier

      for (let j = 0; j < gridHeight * multiplier; j++) {  // Y axis
        // console.log("i= ", i + 1, "j= ", j + 1);

        let posY = j - (gridHeight / 2) * multiplier

        this.positions.setXYZ(index, posX, posY, 0)
        this.coordinates.setXYZ(index, i, j, 0)
        this.offset.setX(index, rand(-100, 100))
        this.speeds.setX(index, rand(0.6, 1))
        this.direction.setX(index, Math.random() > 0.5 ? 1 : -1)
        this.press.setX(index, rand(0.8, 1))

        index++;
      }
    }
    console.log(index);

    this.geometry.setAttribute("position", this.positions)
    this.geometry.setAttribute("aCoordinates", this.coordinates)
    this.geometry.setAttribute("aSpeed", this.speeds)
    this.geometry.setAttribute("aOffset", this.offset)
    this.geometry.setAttribute("aDirection", this.direction)
    this.geometry.setAttribute("aPress", this.press)

    this.mesh = new THREE.Points(this.geometry, this.material);

    console.log(this.coordinates);

    this.scene.add(this.mesh);
    // Add the point light to the scene
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
    // this.material.uniforms.move.value = this.move
    this.material.uniforms.mouse.value = this.point

    this.renderer.render(this.scene, this.camera);

    this.stats.update();
    const render = this.render.bind(this);
    window.requestAnimationFrame(render)

  }

  resCheck() {

    var myDiv = document.getElementById('app');
    var computedStyle = window.getComputedStyle(myDiv);
    var fontSize = computedStyle.fontSize;
    var numericFontSize = parseInt(fontSize, 10);

    console.log(numericFontSize);

    if (window.innerWidth <= 478) {
      this.camera.position.setZ(8000)
      console.log("MOBILE * ");
    }
    else
      if (window.innerWidth > 478 && window.innerWidth <= 767) {
        this.camera.position.setZ(6000)
        console.log("TABLET * *");

      }
      else
        if (window.innerWidth > 767 && window.innerWidth <= 991) {
          this.camera.position.setZ(4000)
          console.log("HD * * * ");

        }
        else
          if (window.innerWidth > 991 && window.innerWidth <= 1920) {
            this.camera.position.setZ(3500)
            console.log("FHD * * * * ");

          }
          else
            if (window.innerWidth > 1920) {
              this.camera.position.setZ(3000)
              console.log("XXL  * * * * ");

            }
  }



}

new sketch()



