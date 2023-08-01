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
    float progress = 1.0 - clamp(elapsedTime / 0.5, 0.0, 1.0);

    vec3 pos = position;
    //NOT STABLE

    pos.x +=  20. * ( 45. - sin( aSpeed *elapsedTime*0.5 + aOffset)* 90.  ); 
    pos.y += 20. * (45. - cos(aSpeed*elapsedTime *0.5) * 90.);
    pos.z = 20. * (  aSpeed * elapsedTime*0.5 + aOffset );
    

    // vec3 stable = position;

    // //calculate the area of influence 
    // float dist = distance(stable.xy,mouse);
    // float area = 1. - smoothstep(0.,100.,dist);
     
    // stable.x += 5. * sin(0.01*time * aPress) * aDirection * area;
    // stable.y += 5. * sin(0.01*time * aPress) * aDirection * area;
    // stable.z += abs(200. * sin(0.01 * time * aPress) * aDirection * area) ;

    
    // vec3 final = mix(stable,pos,progress);

    vec4 mvPosition = modelViewMatrix * vec4(pos,1.);

    gl_PointSize =   2500. / length( mvPosition.xyz );
    gl_Position = projectionMatrix * mvPosition;

    vCoordinates = aCoordinates.xy;
    // vPos = pos;
}