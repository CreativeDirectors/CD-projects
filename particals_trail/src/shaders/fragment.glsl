varying vec2 vCoordinates;
varying vec3 vPos;

uniform sampler2D img;
uniform sampler2D particle_mask;

void main()
{
   // float gridwhMulti = 2.;

   float multi =1.;

   float gridWHMulti = 1.;
   float width  = 100. / gridWHMulti;
   float height = 100. / gridWHMulti;


   vec4 maskTexture = texture2D(particle_mask,gl_PointCoord);
   vec2 myUV = vec2(vCoordinates.x/(width * multi) ,vCoordinates.y/(height * multi));
      // vec2 myUV = vec2(vCoordinates.x,vCoordinates.y);

   vec4 image = texture2D(img,myUV);


// float alpha = 1. - clamp(abs(vPos.z/900.),0.,1.);

   // gl_FragColor = image;
   gl_FragColor = maskTexture; 

gl_FragColor.a *= ( maskTexture.r);

}