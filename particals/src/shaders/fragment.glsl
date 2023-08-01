// varying vec2 vCoordinates;
// varying vec3 vPos;

// uniform sampler2D img;
// uniform sampler2D particle_mask;

// const float threshold = 0.1;  // Adjust this value to control the threshold for white detection

// void main()
// {
//    float multi = 1.;

//    float gridWHMulti = 1.;
//    float width  = 300. / gridWHMulti;
//    float height = 300. / gridWHMulti;

//    vec4 maskTexture = texture2D(particle_mask, gl_PointCoord);
//    vec2 myUV = vec2(vCoordinates.x / (width * multi), vCoordinates.y / (height * multi));
//    vec4 image = texture2D(img, myUV);

//    if (abs(image.r - 1.0) < threshold && abs(image.g - 1.0) < threshold && abs(image.b - 1.0) < threshold) {
//       discard; // Discard (don't render) the fragment
//    }
   
//    gl_FragColor = image;
//    gl_FragColor.a *= maskTexture.r;
// }


// varying vec2 vCoordinates;
// varying vec3 vPos;

// uniform sampler2D img;
// uniform sampler2D particle_mask;

// void main()
// {
//    float multi = 1.;

//    float gridWHMulti = 1.;
//    float width  = 300. / gridWHMulti;
//    float height = 300. / gridWHMulti;

//    vec4 maskTexture = texture2D(particle_mask, gl_PointCoord);
//    vec2 myUV = vec2(vCoordinates.x / (width * multi), vCoordinates.y / (height * multi));
//    vec4 image = texture2D(img, myUV);

//    if (image.a < 0.01) {
//       discard; // Discard (don't render) the fragment if alpha is close to zero
//    }

//    gl_FragColor = image;
//    gl_FragColor.a *= 1. -maskTexture.r;
// }

varying vec2 vCoordinates;
varying vec3 vPos;

uniform sampler2D img;
uniform sampler2D particle_mask;

void main()
{
   // float gridwhMulti = 2.;

   float multi =1.;

   float gridWHMulti = 2.;
   float width  = 300. / gridWHMulti;
   float height = 300. / gridWHMulti;


   vec4 maskTexture = texture2D(particle_mask,gl_PointCoord);
   vec2 myUV = vec2(vCoordinates.x/(width * multi) ,vCoordinates.y/(height * multi));
      // vec2 myUV = vec2(vCoordinates.x,vCoordinates.y);

   vec4 image = texture2D(img,myUV);

// float alpha = 1. - clamp(abs(vPos.z/900.),0.,1.);
   if (image.a < 0.01) {
      discard; // Discard (don't render) the fragment if alpha is close to zero
   }
   gl_FragColor = image;
   // gl_FragColor = maskTexture; 

   

gl_FragColor.a *= ( 1. - maskTexture.r);

}

 
// void main()
// {
// gl_FragColor = vec4(0.12f, 0.26f, 0.12f, 1.0f);
// }