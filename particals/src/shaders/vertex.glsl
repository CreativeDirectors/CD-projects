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
    float progress = 1.0 - clamp(elapsedTime / 1.5, 0.0, 1.0);

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
    stable.z += abs(800. * sin(0.01 * time * aPress) * aDirection * area) ;

    vec3 final = mix(stable,pos,progress);

    vec4 mvPosition = modelViewMatrix * vec4(final,1.);

    gl_PointSize =   10000. * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vCoordinates = aCoordinates.xy;
    vPos = pos;
}