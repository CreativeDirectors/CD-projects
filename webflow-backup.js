class sketch {

    constructor() {

        this.app = document.getElementById("particals-text");


        this.zoom = 4500


        if (this.app && window.getComputedStyle(this.app).display !== 'none') {
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

            // this.renderer.setSize(this.app.offsetWidth, this.app.offsetHeight);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById("particals-text").appendChild(this.renderer.domElement);

            this.camera = new THREE.PerspectiveCamera(45, this.app.offsetWidth / this.app.offsetHeight, 0.01, 14000);
            this.camera.position.z = this.zoom;
            this.camera.position.setY(-200);


            this.scene = new THREE.Scene();

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2()
            this.startTime = Date.now();
            this.point = new THREE.Vector2()

            this.textures = [
                new THREE.TextureLoader().load('https://uploads-ssl.webflow.com/6344812c6651849a7870e714/649af57f473eadd518b6f44d_CD_Shining_Logo5.png'),
                new THREE.TextureLoader().load('https://uploads-ssl.webflow.com/6344812c6651849a7870e714/649af58205d52a9777f49b74_particle_mask.jpg')

            ]
            // this.planetwo = new THREE.Mesh(
            //   new THREE.PlaneGeometry(4000, 1000),
            //   new THREE.MeshBasicMaterial()
            // )

            this.time = 0

            // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

            this.addMesh()
            this.resCheck()
            this.mouseEffects()
            this.render()
        }
    }

    mouseEffects() {

        this.test = new THREE.Mesh(
            new THREE.PlaneGeometry(20000, 20000),
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
        console.log(document.getElementById("particals-text"));
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
            this.resCheck()
            this.camera.updateProjectionMatrix();
        }, false);

    }


    addMesh() {
        this.material = new THREE.ShaderMaterial({
            fragmentShader: `
            varying vec2 vCoordinates;
            varying vec3 vPos;
  
            uniform sampler2D img;
            uniform sampler2D particle_mask;
  
            void main()
            {
               float multi = 2.;
               vec4 maskTexture = texture2D(particle_mask,gl_PointCoord);
               vec2 myUV = vec2(vCoordinates.x/((512. /2. * 3. ) * multi) ,vCoordinates.y/(512. * multi));
               vec4 image = texture2D(img,myUV);
  
            float alpha = 1. - clamp(0.,1.,abs(vPos.z/900.));
  
               gl_FragColor = image;
               // gl_FragColor = maskTexture; 
  
            gl_FragColor.a *= (1.-maskTexture.r);
  
            }
        `,
            vertexShader: `
            varying vec2 vUv;
            varying vec2 vCoordinates;
            varying vec3 vPos;
  
  
            attribute vec3 aCoordinates;
            attribute float aSpeed;
            attribute float aOffset;
            attribute float aDirection;
            attribute float aPress;
  
  
            uniform float move;
            uniform float time;
            uniform float elapsedTime;
            uniform vec2 mouse;
            uniform float transition;
  
  
            void main()
            {
                vUv = uv;
                float progress = 1.0 - clamp(elapsedTime / 3. , 0.0, 1.0);
  
                vec3 pos = position;
                //NOT STABLE
  
                pos.x += 0. + progress* 20. * ( 450. - sin( aSpeed + aOffset)* 900.  ); 
                pos.y += 0. + progress *20. * (450. - sin(aSpeed )* 900.);
                pos.z = 0. +  progress * (position.z +  aSpeed + aOffset )* (aCoordinates.x - 1024.);
  
                vec3 stable = position;
  
                //calculate the area of influence 
                float dist = distance(stable.xy,mouse);
                float area = 1. - smoothstep(0.,400.,dist);
  
                stable.x += (5. * sin(0.01*time * aPress) * aDirection * area);
                stable.y += 5. * sin(0.01*time * aPress) * aDirection * area;
                stable.z += abs(2000. * sin(0.01 * time * aPress) * aDirection * area) ;
  
                vec3 final = mix(stable,pos,progress);
  
                vec4 mvPosition = modelViewMatrix * vec4(final,1.);
  
                gl_PointSize =   15000. * (1. / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
  
                vCoordinates = aCoordinates.xy;
                vPos = pos;
            }
        `,
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
        this.material.uniforms.move.value = this.move
        this.material.uniforms.mouse.value = this.point

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this))

    }

    resCheck() {

        if (window.innerWidth <= 478) {
            this.camera.position.setZ(7500)
            console.log("MOBILE * ");
        }
        else
            if (window.innerWidth > 478 && window.innerWidth <= 767) {
                this.camera.position.setZ(7500)
                console.log("TABLET * *");

            }
            else
                if (window.innerWidth > 767 && window.innerWidth <= 991) {
                    this.camera.position.setZ(7500)
                    console.log("HD * * * ");

                }
                else
                    if (window.innerWidth > 991 && window.innerWidth <= 1920) {
                        this.camera.position.setZ(7500)
                        console.log("FHD * * * * ");

                    }
                    else
                        if (window.innerWidth > 1920) {
                            this.camera.position.setZ(6500) //6000 looks good
                            console.log("XXL  * * * * *");

                        }
    }

}

new sketch()