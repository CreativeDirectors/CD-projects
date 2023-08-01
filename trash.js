
function(e, t) {
    e.exports = `
    #define GLSLIFY 1
    uniform float u_time;
    uniform float u_delta;
    
    attribute float a_speed;
    attribute float a_offset;
    attribute float a_alpha;
    
    varying vec3 vPos;
    varying float vAlpha;
    
    mat3 quatToMatrix(vec4 q) {
          mat3 mat;
        
          float sqw = q.w * q.w;
          float sqx = q.x * q.x;
          float sqy = q.y * q.y;
          float sqz = q.z * q.z;
        
          // invs (inverse square length) is only required if quaternion is not already normalised
      float invs = 1.0 / (sqx + sqy + sqz + sqw);
      mat[0][0] = ( sqx - sqy - sqz + sqw) * invs; // since sqw + sqx + sqy + sqz =1/invs*invs
      mat[1][1] = (-sqx + sqy - sqz + sqw) * invs;
      mat[2][2] = (-sqx - sqy + sqz + sqw) * invs;
    
      float tmp1 = q.x * q.y;
      float tmp2 = q.z * q.w;
      mat[1][0] = 2.0 * (tmp1 + tmp2) * invs;
      mat[0][1] = 2.0 * (tmp1 - tmp2) * invs;
    
      tmp1 = q.x * q.z;
      tmp2 = q.y * q.w;
      mat[2][0] = 2.0 * (tmp1 - tmp2) * invs;
      mat[0][2] = 2.0 * (tmp1 + tmp2) * invs;
      tmp1 = q.y * q.z;
      tmp2 = q.x * q.w;
      mat[2][1] = 2.0 * (tmp1 + tmp2) * invs;
      mat[1][2] = 2.0 * (tmp1 - tmp2) * invs;
    
      return mat;
}
    
    void main() {
        
      vec3 pos = position;
      pos.z = mod( position.z + ( u_time * 1. * a_speed * 100. + u_delta + a_offset ) + 1000., 2000. ) - 1000.;
    
      vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    
      gl_PointSize = ( 4000.0 / length( mvPosition.xyz ) );
      gl_Position = projectionMatrix * mvPosition;
    
      vPos = pos;
      vAlpha = a_alpha;
}
    `
}
, function(e, t) {
    e.exports = `
    #define GLSLIFY 1
    uniform sampler2D t_mask;
    uniform float u_time;
    
    varying vec3 vPos;
    varying float vAlpha;
    
    float map(float value, float inMin, float inMax, float outMin, float outMax) {
          return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);

}

void main() {
        
          vec4 mask_texture = texture2D(t_mask, gl_PointCoord);
        
          vec3 color = vec3(1.);
        
          float distanceAlpha = abs(min(1., max(0., map(abs(vPos.z), 0., 900., 0., 1.))) - 1.);
          float alpha = distanceAlpha * mask_texture.r * vAlpha;

    gl_FragColor = vec4(color, alpha);
}
`
}
, function(e, t) {
    e.exports = `#define GLSLIFY 1
    uniform sampler2D t_diffuse;
    
    varying vec2 vUv;

    void main(void ) {
        
          vec2 uv = vUv;
        
          vec4 texture = texture2D(t_diffuse, uv);

          // vec3 color = texture.rgb * 0.998 - 0.0052;
      vec3 color = texture.rgb * 0.999 - 0.00197;
    
      float alpha = 1.;

        gl_FragColor = vec4(color, alpha);
    }
    `
}
function(e, t) {
    e.exports = `#define GLSLIFY 1
    uniform sampler2D t_diffuse;
    
    varying vec2 vUv;

    void main(void ) {
        
          vec2 uv = vUv;
        
          vec4 texture = texture2D(t_diffuse, uv);

          // vec3 color = texture.rgb * 0.998 - 0.0052;
      vec3 color = texture.rgb * 0.999 - 0.00195;
    
      float alpha = 1.;

        gl_FragColor = vec4(color, alpha);
    }
    `
}



function(e, t) {
    e.exports = `#define GLSLIFY 1
    varying vec2 vUv;

    // uniform float uTime;
    // uniform sampler2D tDisplacement;

    void main() {

        // vec4 displacementTexture = texture2D(tDisplacement, uv + uTime * .1);

        // vec3 pos = position;
        // pos.z += displacementTexture.r * 100.;

        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `
}
function(e, t) {
    e.exports = `
#define GLSLIFY 1
    float random(in vec2 st) {
        return fract(sin(dot(st.xy,
            vec2(12.9898, 78.233))) *
            43758.5453123);
    }

    // Based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise(in vec2 st) {
            vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
    
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
    }

    #define OCTAVES 4
    float fbm(in vec2 st) {
            // Initial values
        float value = 0.0;
        float amplitude = .5;
        float frequency = 0.;
        //
        // Loop of octaves
        for (int i = 0; i < OCTAVES; i++) {
            value += amplitude * noise(st);
            st *= 2.;
            amplitude *= .5;
        }
        return value;
    }

    #define CUSTOM_OCTAVES 2
    float customFBM(in vec2 st) {
            // Initial values
        float value = 0.0;
        float amplitude = .5;
        float frequency = 0.;
        //
        // Loop of octaves
        for (int i = 0; i < CUSTOM_OCTAVES; i++) {
            value += amplitude * noise(st);
            st *= 2.;
            amplitude *= .5;
        }
        return value;
    }
    
    uniform float uTime;
    uniform float uActive;
    uniform float uShapeActive;
    uniform sampler2D tMask;
    uniform sampler2D tMaskOpacity;
    uniform sampler2D tDisplacement;
    varying vec2 vUv;

    void main() {
        
      vec4 displacementTexture = texture2D(tDisplacement, vUv + uTime * 0.1);
      vec4 cloudMaskTexture = texture2D(tDisplacement, vUv + uTime * 0.02);
      vec4 maskTexture = texture2D(tMask, vec2(vUv.x + displacementTexture.r * .05, vUv.y + displacementTexture.r * .05));
      vec4 maskOpacityTexture = texture2D(tMaskOpacity, vec2(vUv.x + displacementTexture.r * .05, vUv.y + displacementTexture.r * .05));
    
      vec3 firstColor = vec3(0., 146. / 255., 142. / 255.);
      // vec3 secondColor = vec3(0., 33. / 255. , 67. / 255. );
      vec3 secondColor = vec3(22. / 255., 11. / 255., (91. + sin(uTime) * 20.) / 255.);

      // vec3 thirdColor = vec3(248. / 255., 208. / 255. , 175. / 255. );
      // vec3 fourthColor = vec3(201. / 255., 132. / 255. , 110. / 255. );
      // vec3 fifthColor = vec3(60. / 255., 65. / 255. , 96. / 255. );

      // vec3 thirdColor = vec3(0., 146. / 255. , 142. / 255. );
      // vec3 fourthColor = vec3(0., 33. / 255. , 67. / 255. );
      // vec3 fifthColor = vec3(0., 89.5 / 255. , 99.5 / 255. );
    
      vec3 thirdColor = vec3(0. / 255., 146. / 255., 142. / 255.);
      vec3 fourthColor = vec3(0. / 255., 0. / 255., 37. / 255.);
      vec3 fifthColor = vec3(35. / 255., 89.5 / 255., 99.5 / 255.);


      // float noise1 = fbm(vUv * 10. + uTime);
      // float noise2 = fbm(-vUv * 10.);
      // float noise3 = fbm( vUv * vec2(noise1, noise2 ));
      // // vec3 color = vec3(noise);
    
      vec2 secondQ = vec2(0.);
        secondQ.x = customFBM(vUv / 0.05 + 0.0 * uTime * 20.);
      // secondQ.y = fbm( vUv / 0.05 + vec2(1.0));
    
      vec2 secondR = vec2(0.);
        secondR.x = customFBM(vUv + 1.0 * secondQ + vec2(1.7, 5.2) + 1. * uTime);
      // secondR.y = fbm( vUv + 1.0*secondQ + vec2(8.3,2.8)+ 0.26*uTime);

      // float secondF = fbm(vUv+secondR);

      // float secondMixValue = clamp((secondF*secondF)*2.5,0.0,2.0);
      // float secondMixValue = clamp((secondR.x*secondR.x)*2.5,0.0,2.0);
      float secondMixValue = clamp((secondR.x * secondR.x) * 3.5, 0.0, 2.0);
    
      vec3 secondFinalColor = mix(thirdColor, fourthColor, secondMixValue);
        secondFinalColor = mix(fifthColor, secondFinalColor, cloudMaskTexture.r * maskTexture.a);
        secondFinalColor *= maskTexture.a;
    
    
      vec2 q = vec2(0.);
        q.x = fbm(vUv + 0.0 * uTime);
        q.y = fbm(vUv + vec2(1.0));
    
      vec2 r = vec2(0.);
        r.x = fbm(vUv + 1.0 * q + vec2(1.7, 9.2) + 0.1 * uTime);
        r.y = fbm(vUv + 1.0 * q + vec2(8.3, 2.8) + 0.052 * uTime);
    
      float f = fbm(vUv + r);
      float mixValue = clamp((f * f) * 2.2, 0.0, 2.0);
    
      vec3 firstFinalColor = mix(firstColor, mix(secondColor, vec3(0.), clamp(length(r.x), 0.0, 1.0)), mixValue);
        // firstFinalColor -= max( secondFinalColor.b, max(secondFinalColor.r, secondFinalColor.g) ) * smoothstep(0.99, 1., maskOpacityTexture.a) * uShapeActive;
        firstFinalColor = max(vec3(0.), firstFinalColor);
    
      vec3 color = mix(firstFinalColor, secondFinalColor, smoothstep(0.43, 1., maskOpacityTexture.a * uActive));

      // color = mix(color, vec3(0.), clamp(length(q),0.0,1.0));
      // float alpha = 1.;
      float alpha = 1. - max(color.g, max(color.r, color.g));
        alpha -= smoothstep(max(0., 0.5 - abs(uActive - 1.)), .9 + abs(uActive - 1.), vUv.x) * uActive;
        alpha -= abs(uActive - 1.) * 0.4;
        // float alpha = 1. * smoothstep( 0., .1, max(max( secondFinalColor.r, secondFinalColor.g), secondFinalColor.b ) );

        // gl_FragColor = displacementTexture;
        gl_FragColor = vec4(color, alpha);
        // gl_FragColor = vec4(maskTexture.r);
    }
    `
}
function(e, t) {
    e.exports =
        `
    #define GLSLIFY 1
    uniform float uTime;
    uniform float uActive;
    uniform float uOctaves;
    uniform float uShapeActive;
    uniform sampler2D tMask;
    uniform sampler2D tMaskOpacity;
    uniform sampler2D tDisplacement;
    varying vec2 vUv;
    
    float random(in vec2 st) {
        return fract(sin(dot(st.xy,
            vec2(12.9898, 78.233))) *
            43758.5453123);
    }

    // Based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise(in vec2 st) {
            vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
    
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
    }

    #define OCTAVES 2
    float fbm(in vec2 st) {
            // Initial values
        float value = 0.0;
        float amplitude = .5;
        float frequency = 0.;
        //
        // Loop of octaves
        for (int i = 0; i < OCTAVES; i++) {
            value += amplitude * noise(st);
            st *= 2.;
            amplitude *= .5;
        }
        return value;
    }

    void main() {
        
      vec4 displacementTexture = texture2D(tDisplacement, vUv + uTime * 0.1);
      vec4 cloudMaskTexture = texture2D(tDisplacement, vUv + uTime * 0.02);
      vec4 maskTexture = texture2D(tMask, vec2(vUv.x + displacementTexture.r * .05, vUv.y + displacementTexture.r * .05));
      vec4 maskOpacityTexture = texture2D(tMaskOpacity, vec2(vUv.x + displacementTexture.r * .05, vUv.y + displacementTexture.r * .05));
    
      vec3 firstColor = vec3(0., 146. / 255., 142. / 255.);
      vec3 secondColor = vec3(0., 33. / 255., 67. / 255.);

      // vec3 thirdColor = vec3(248. / 255., 208. / 255. , 175. / 255. );
      // vec3 fourthColor = vec3(201. / 255., 132. / 255. , 110. / 255. );
      // vec3 fifthColor = vec3(60. / 255., 65. / 255. , 96. / 255. );

      // vec3 thirdColor = vec3(0., 146. / 255. , 142. / 255. );
      // vec3 fourthColor = vec3(0., 33. / 255. , 67. / 255. );
      // vec3 fifthColor = vec3(0., 89.5 / 255. , 99.5 / 255. );
    
      vec3 thirdColor = vec3(0. / 255., 146. / 255., 142. / 255.);
      vec3 fourthColor = vec3(0. / 255., 0. / 255., 37. / 255.);
      vec3 fifthColor = vec3(35. / 255., 89.5 / 255., 99.5 / 255.);


      // float noise1 = fbm(vUv * 10. + uTime);
      // float noise2 = fbm(-vUv * 10.);
      // float noise3 = fbm( vUv * vec2(noise1, noise2 ));
      // // vec3 color = vec3(noise);
    
      vec2 secondQ = vec2(0.);
        secondQ.x = fbm(vUv / 0.05 + 0.0 * uTime * 100.);
      // secondQ.y = fbm( vUv / 0.05 + vec2(1.0));
    
      vec2 secondR = vec2(0.);
        secondR.x = fbm(vUv + 1.0 * secondQ + vec2(1.7, 5.2) + 0.5 * uTime);
      // secondR.y = fbm( vUv + 1.0*secondQ + vec2(8.3,2.8)+ 0.26*uTime);

      // float secondF = fbm(vUv+secondR);

      // float secondMixValue = clamp((secondF*secondF)*2.5,0.0,2.0);
      // float secondMixValue = clamp((secondR.x*secondR.x)*2.5,0.0,2.0);
      float secondMixValue = clamp((secondR.x * secondR.x) * 3.5, 0.0, 2.0);
    
      vec3 secondFinalColor = mix(thirdColor, fourthColor, secondMixValue);
        secondFinalColor = mix(fifthColor, secondFinalColor, cloudMaskTexture.r * maskTexture.a);
        secondFinalColor *= maskTexture.a;
    
    
      vec2 q = vec2(0.);
        q.x = fbm(vUv + 0.0 * uTime);
        q.y = fbm(vUv + vec2(1.0));
    
      vec2 r = vec2(0.);
        r.x = fbm(vUv + 1.0 * q + vec2(1.7, 9.2) + 0.05 * uTime);
        r.y = fbm(vUv + 1.0 * q + vec2(8.3, 2.8) + 0.026 * uTime);
    
      float f = fbm(vUv + r);
      float mixValue = clamp((f * f) * 2.2, 0.0, 2.0);
    
      vec3 firstFinalColor = mix(firstColor, mix(secondColor, vec3(0.), clamp(length(r.x), 0.0, 1.0)), mixValue);
        // firstFinalColor -= max( secondFinalColor.b, max(secondFinalColor.r, secondFinalColor.g) ) * smoothstep(0.99, 1., maskOpacityTexture.a) * uShapeActive;
        firstFinalColor = max(vec3(0.), firstFinalColor);
    
      vec3 color = mix(firstFinalColor, secondFinalColor, smoothstep(0.43, 1., maskOpacityTexture.a * uActive));

      // color = mix(color, vec3(0.), clamp(length(q),0.0,1.0));
      // float alpha = 1.;
      float alpha = 1. - max(color.g, max(color.r, color.g));
        alpha -= smoothstep(max(0., 0.5 - abs(uActive - 1.)), .9 + abs(uActive - 1.), vUv.x);
        alpha -= abs(uActive - 1.) * 0.4;
        // float alpha = 1. * smoothstep( 0., .1, max(max( secondFinalColor.r, secondFinalColor.g), secondFinalColor.b ) );

        // gl_FragColor = displacementTexture;
        gl_FragColor = vec4(color, alpha);
        // gl_FragColor = vec4(maskTexture.r);
    }
    `
}




class extends n.Object3D {
    constructor(e) {
        super(),
            this._mouse = new n.Vector2,
            this._time = 0,
            this._selectOffsetValue = 0,
            this._lastTranslation = 0,
            this._currentIndex = 0,
            this._correction = 0,
            this._nbItems = 0,
            o.default.global.progress = 0,
            this._nextIndex = 1,
            this._type = e.type,
            this._getNbItems(),
            this._nb = 262144,
            this._setupGeometry(),
            this._setupMaterial(),
            this._setupMesh(),
            this._selectNeedsUpdate = !1,
            this._selectTimeout = null,
            this.visible = !1,
            Signals.onColorStocked.dispatch()
    }
    _getNbItems() {
        "project" === this._type ? this._nbItems = s.default.projects.length : this._nbItems = a.default.experiments.length
    }
    _setupGeometry() {
        this._geometry = new n.BufferGeometry;
        this._aPosition = new n.BufferAttribute(new Float32Array(3 * this._nb), 3),
            this._aHidePosition = new n.BufferAttribute(new Float32Array(3 * this._nb), 3),
            this._aCoordinates = new n.BufferAttribute(new Float32Array(2 * this._nb), 2),
            this._aSelect = new n.BufferAttribute(new Float32Array(1 * this._nb), 1),
            this._selectOffsetSpeeds = new Float32Array(this._nb),
            this._aDirection = new n.BufferAttribute(new Float32Array(this._nb), 1),
            this._aSpeed = new n.BufferAttribute(new Float32Array(this._nb), 1),
            this._aRadius = new n.BufferAttribute(new Float32Array(this._nb), 1),
            this._aOffset = new n.BufferAttribute(new Float32Array(this._nb), 1),
            this._aPress = new n.BufferAttribute(new Float32Array(this._nb), 1);
        let e = 0;
        for (let t = 0; t < 512; t += 1) {
            const i = t - 256;
            for (let n = 0; n < 512; n += 1) {
                const r = 512 - n - 256;
                this._aPosition.setXYZ(e, 1.3 * r, 1.3 * i, 0),
                    this._aHidePosition.setXYZ(e, (0,
                        c.randomFloat)(-2e3, 2e3), (0,
                            c.randomFloat)(-2e3, 2e3), (0,
                                c.randomFloat)(1150, 1200)),
                    this._aCoordinates.setXY(e, n, t),
                    this._aSelect.setX(e, 1),
                    this._selectOffsetSpeeds[e] = (0,
                        c.randomFloat)(.055, .1),
                    this._aDirection.setX(e, (0,
                        c.randomFloat)(0, 1) <= .5 ? -1 : 1),
                    this._aSpeed.setX(e, (0,
                        c.randomFloat)(.3, 1)),
                    this._aRadius.setX(e, (0,
                        c.randomFloat)(0, 50)),
                    this._aOffset.setX(e, (0,
                        c.randomFloat)(-1e3, 1e3)),
                    this._aPress.setX(e, (0,
                        c.randomFloat)(.6, 1)),
                    e++
            }
        }
        this._geometry.addAttribute("position", this._aPosition),
            this._geometry.addAttribute("a_hidePosition", this._aHidePosition),
            this._geometry.addAttribute("a_coordinates", this._aCoordinates),
            this._geometry.addAttribute("a_select", this._aSelect),
            this._geometry.addAttribute("a_direction", this._aDirection),
            this._geometry.addAttribute("a_speed", this._aSpeed),
            this._geometry.addAttribute("a_radius", this._aRadius),
            this._geometry.addAttribute("a_offset", this._aOffset),
            this._geometry.addAttribute("a_press", this._aPress)
    }
    _setupMaterial() {
        const e = o.default.resources.getTexture("particle_mask").media
            , t = "project" === this._type ? o.default.resources.getTexture("spritesheet-project").media : o.default.resources.getTexture("spritesheet-experiment").media;
        t.minFilter = n.LinearFilter,
            t.flipY = !1,
            this._material = new n.ShaderMaterial({
                transparent: !0,
                depthTest: !1,
                depthWrite: !1,
                uniforms: {
                    u_delta: {
                        type: "f",
                        value: 0
                    },
                    u_time: {
                        type: "f",
                        value: 0
                    },
                    u_mask: {
                        type: "f",
                        value: 0
                    },
                    u_progress: {
                        type: "f",
                        value: 0
                    },
                    uHide: {
                        type: "f",
                        value: 1
                    },
                    uPress: {
                        type: "f",
                        value: 0
                    },
                    uMouse: {
                        type: "v2",
                        value: new n.Vector2
                    },
                    uResolution: {
                        type: "v2",
                        value: new n.Vector2(window.innerWidth, window.innerHeight)
                    },
                    uPerspective: {
                        type: "v2",
                        value: new n.Vector2
                    },
                    t_mask: {
                        type: "t",
                        value: e
                    },
                    tDiffuse: {
                        type: "t",
                        value: t
                    }
                },
                vertexShader: "project" === this._type ? h.default : p.default,
                fragmentShader: "project" === this._type ? d.default : f.default
            })
    }
    _setupMesh() {
        this._mesh = new n.Points(this._geometry, this._material),
            this.add(this._mesh)
    }
    select() {
        this._selectOffsetValue = 1,
            this._selectNeedsUpdate = !0,
            TweenLite.killTweensOf(this._material.uniforms.u_mask),
            TweenLite.to(this._material.uniforms.u_mask, 1, {
                value: 0,
                ease: "Power4.easeOut"
            })
    }
    deselect() {
        this._selectOffsetValue = 0,
            this._selectNeedsUpdate = !0,
            TweenLite.killTweensOf(this._material.uniforms.u_mask),
            TweenLite.to(this._material.uniforms.u_mask, 1, {
                value: 1,
                ease: "Power4.easeOut"
            })
    }
    show({ delay: e = 0 } = {}) {
        this.visible = !0,
            TweenLite.killTweensOf(this._material.uniforms.uHide),
            TweenLite.to(this._material.uniforms.uHide, 3, {
                delay: e + .4,
                value: 0,
                ease: "Power4.easeOut"
            })
    }
    hide() {
        TweenLite.killTweensOf(this._material.uniforms.uHide),
            TweenLite.to(this._material.uniforms.uHide, 3, {
                value: 1,
                ease: "Power4.easeOut",
                onComplete: () => {
                    this.visible = !1
                }
            })
    }
    mousedown() {
        TweenLite.killTweensOf(this._material.uniforms.uPress),
            TweenLite.to(this._material.uniforms.uPress, 1, {
                value: 1,
                ease: "Elastic.easeOut"
            })
    }
    mouseup() {
        TweenLite.killTweensOf(this._material.uniforms.uPress),
            TweenLite.to(this._material.uniforms.uPress, 1, {
                value: 0,
                ease: "Elastic.easeOut"
            })
    }
    mousemove(e) {
        this._mouse = e,
            this._material.uniforms.uMouse.value.x = this._mouse.x,
            this._material.uniforms.uMouse.value.y = this._mouse.y
    }
    resize(e) {
        const t = (0,
            u.getPerspectiveSize)(e, Math.abs(e.position.z - this.position.z));
        this._material.uniforms.uResolution.value.x = window.innerWidth,
            this._material.uniforms.uResolution.value.y = window.innerHeight,
            this._material.uniforms.uPerspective.value.x = t.width,
            this._material.uniforms.uPerspective.value.y = t.height
    }
    update(e, t, i) {
        this._time = e,
            this._material.uniforms.u_delta.value = i,
            this._material.uniforms.u_time.value = e,
            this._updateSelectedState(),
            this._updateColor(i)
    }
    _updateSelectedState() {
        if (this._selectNeedsUpdate) {
            this._selectNeedsUpdate = !1;
            for (let e = 0; e < this._aSelect.count; e++)
                this._aSelect.array[e] += (this._selectOffsetValue - this._aSelect.array[e]) * this._selectOffsetSpeeds[e],
                    Math.abs(this._selectOffsetValue - this._aSelect.array[e]) > 1e-4 && (this._selectNeedsUpdate = !0);
            this._aSelect.needsUpdate = !0
        }
    }
    _updateColor(e) {
        o.default.global.progress = Math.abs(1e-4 * e % this._nbItems),
            this._material.uniforms.u_progress.value = o.default.global.progress
    }
}



uniform float Time;
 varying float rand;
void main(void) {
    //Compute 4 Positions for the current trail segment 
    //those 4 positions could also be supplied by vertex attributes 
    //or a big uniform array 
    vec4 position1 = vec4(0.0, 0.0, 0.0, 1.0); 
    float diff = Time * 300.0 + gl_Vertex.z * 10.0; 
    float posdiff = 1.0 / 100.0 * 10.0;
    position1.x = sin(diff) * 7.0 + sin(diff * 0.25) * 2.0;
    position1.y = cos(diff) * 7.0 + sin(diff * 0.5) * 3.0;
    position1.z = cos(diff) * 3.0 + cos(diff * 2.0) * 4.0; 
    vec4 position2 = vec4(0.0, 0.0, 0.0, 1.0);
    diff += posdiff;
    position2.x = sin(diff) * 7.0 + sin(diff * 0.25) * 2.0;
    position2.y = cos(diff) * 7.0 + sin(diff * 0.5) * 3.0;
    position2.z = cos(diff) * 3.0 + cos(diff * 2.0) * 4.0; 
    vec4 position3 = vec4(0.0, 0.0, 0.0, 1.0); diff += posdiff;
    position3.x = sin(diff) * 7.0 + sin(diff * 0.25) * 2.0;
    position3.y = cos(diff) * 7.0 + sin(diff * 0.5) * 3.0;
    position3.z = cos(diff) * 3.0 + cos(diff * 2.0) * 4.0; 
    vec4 position4 = vec4(0.0, 0.0, 0.0, 1.0); diff += posdiff;
    position4.x = sin(diff) * 7.0 + sin(diff * 0.25) * 2.0;
    position4.y = cos(diff) * 7.0 + sin(diff * 0.5) * 3.0;
    position4.z = cos(diff) * 3.0 + cos(diff * 2.0) * 4.0;
    position1 = gl_ModelViewMatrix * position1;
    position2 = gl_ModelViewMatrix * position2;
    position3 = gl_ModelViewMatrix * position3;
    position4 = gl_ModelViewMatrix * position4;
     //compute directions to unfold the particels 
     vec3 dir1 = normalize(normalize(cross(position1.xyz - position2.xyz, vec3(0.0, 0.0, 1.0))) + normalize(cross(position2.xyz - position3.xyz, vec3(0.0, 0.0, 1.0))));
    dir1.z = 0.0; 
     vec3 dir2 = normalize(normalize(cross(position2.xyz - position3.xyz, vec3(0.0, 0.0, 1.0))) + normalize(cross(position3.xyz - position4.xyz, vec3(0.0, 0.0, 1.0))));
    dir2.z = 0.0; 
     vec4 position = position2;
    //Compute Vertex Position 
    position.xyz = (position2.xyz + dir1 * gl_Vertex.x * gl_Vertex.z) * clamp(gl_Vertex.y, 0.0, 1.0)
    //y=1.0 -> front vertex + (position3.xyz + dir2 * gl_Vertex.x * gl_Vertex.z) * clamp(gl_Vertex.y * (-1.0),0.0,1.0); 
    //y=-1.0 -> rear vertex rand = gl_Vertex.x;
    //for gradient 
    gl_Position = gl_ProjectionMatrix * position;
} 
