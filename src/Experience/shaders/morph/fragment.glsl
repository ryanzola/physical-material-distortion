varying vec2 vUv;
varying vec3 vNormal;
varying float vNoise;

void main() {
  gl_FragColor = vec4(vNormal, 1.0);
  // gl_FragColor = vec4(vNoise, 0.0, 0.0, 1.0);
}