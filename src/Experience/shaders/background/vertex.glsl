varying vec3 vPosition;

uniform float time;

#pragma glslify: rotate2d = require('../partials/rotate2d.glsl')

void main() {
  vec3 newPos = position;
  newPos.xy = rotate2d(time * 0.125) * newPos.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  vPosition = position;
}