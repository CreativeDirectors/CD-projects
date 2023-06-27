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