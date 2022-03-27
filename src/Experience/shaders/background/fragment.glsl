varying vec3 vPosition;

uniform float time;

#pragma glslify: noise = require('../partials/noise.glsl')
#pragma glslify: line = require('../partials/line.glsl')
#pragma glslify: rotate2d = require('../partials/rotate2d.glsl')

void main() {
  float n = noise(vPosition + time) * 0.5;

  vec3 baseFirst = vec3(0.08, 0.17, 0.2);
  vec3 accent = vec3(0.0);
  vec3 baseSecond = vec3(0.2, 0.38, 0.42);

  vec2 baseUv = rotate2d(n) * vPosition.xy * 0.1;
  float basePattern = line(baseUv, 0.5);
  float secondPattern = line(baseUv, 0.1);

  vec3 baseColor = mix(baseSecond, baseFirst, basePattern);
  vec3 secondColor = mix(baseColor, accent, secondPattern);

  gl_FragColor = vec4(secondColor, 1.0);
}