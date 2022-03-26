varying vec2 vUv;
varying vec3 vNormal;
uniform float time;

#pragma glslify: cnoise = require('../partials/noise.glsl')

float DistortedPosition(vec3 p) {
  float noise = cnoise(p * 4.0 + vec3(time));

  return noise;
}

vec3 Orthogonal(vec3 n) {
  return normalize(
    abs(n.x) > abs(n.z) 
      ? vec3(-n.y, n.x, 0.0)
      : vec3(0.0, -n.z, n.y)
  );
}

void main() {
  vec3 displacedPosition = position + 0.1 * normal * DistortedPosition(position);

  vec3 eps = vec3(0.001, 0.0, 0.0);
  vec3 tangent = Orthogonal(normal);
  vec3 bitangent = normalize(cross(tangent, normal));

  vec3 neighbor1 = position + tangent * 0.0001;
  vec3 neighbor2 = position + bitangent * 0.0001;

  vec3 displacedNeighbor1 = neighbor1 + 0.1 * normal * DistortedPosition(neighbor1);
  vec3 displacedNeighbor2 = neighbor2 + 0.1 * normal * DistortedPosition(neighbor2);

  vec3 displacedTangent = displacedNeighbor1 - displacedPosition;
  vec3 displacedBitangent = displacedNeighbor2 - displacedPosition;



  vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  vUv = uv;
  vNormal = displacedNormal;
}