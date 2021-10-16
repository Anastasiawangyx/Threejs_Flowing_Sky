const vertexShader = {
    sky_mode_vertex_shader : `
  varying vec3 vWorldPosition; 
  void main() { 
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 ); 
    vWorldPosition = worldPosition.xyz; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); 
  }
  `,
  flowing_sky_vertex_shader:`
  void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `
  }
  
  
  export {vertexShader}