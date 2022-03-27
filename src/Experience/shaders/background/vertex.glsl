varying vec3 vPosition;

uniform float time;

#pragma glslify: rotate2d = require('../partials/rotate2d.glsl')

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vPosition = position;
}