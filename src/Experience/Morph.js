import {
  AmbientLight,
  DirectionalLight,
  DoubleSide, 
  Mesh, 
  MeshPhysicalMaterial, 
  ShaderChunk 
} from 'three'
import Experience from './Experience'

export default class Morph {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.shape = this.resources.items.shape2.scene.children[0]

    this.setMaterial()
    this.setGeometry()
    this.setMesh()
    this.setLights()
  }

  setGeometry() {
    this.geometry = this.shape.geometry
    this.geometry.computeVertexNormals()
  }

  setMaterial() {
    this.material = new MeshPhysicalMaterial({
      map: this.resources.items.gradient,
      roughness: 0.34,
      metalness: 0.05,
      reflectivity: 0,
      clearcoat: 0,
      side: DoubleSide
    })

    let header = `float PI = 3.1415926538;

    uniform float time;
    
    varying float vNoise;
    
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    
    float cnoise(vec3 P){
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
    
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
    
      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
    
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
    
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }
    
    float DistortedPosition(vec3 p) {
      float noise = cnoise(p * 1.0 + vec3(time));
      float noiseArea = sin(smoothstep(-1.0, 1.0, p.y) * PI);
      vNoise = noise * noiseArea;
      return noise * noiseArea;
    }
    
    vec3 Orthogonal(vec3 n) {
      return normalize(
        abs(n.x) > abs(n.z) 
          ? vec3(-n.y, n.x, 0.0)
          : vec3(0.0, -n.z, n.y)
      );
    }`

    let computeDistortion = `  float amp = 0.5;
    vec3 displacedPosition = position + amp * normal * DistortedPosition(position);
  
    vec3 eps = vec3(0.001, 0.0, 0.0);
    vec3 tangent = Orthogonal(normal);
    vec3 bitangent = normalize(cross(tangent, normal));
  
    vec3 neighbor1 = position + tangent * 0.0001;
    vec3 neighbor2 = position + bitangent * 0.0001;
  
    vec3 displacedNeighbor1 = neighbor1 + amp * normal * DistortedPosition(neighbor1);
    vec3 displacedNeighbor2 = neighbor2 + amp * normal * DistortedPosition(neighbor2);
  
    vec3 displacedTangent = displacedNeighbor1 - displacedPosition;
    vec3 displacedBitangent = displacedNeighbor2 - displacedPosition;
  
    vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
  `

    this.material.onBeforeCompile = shader => {
      this.material.userData.shader = shader
      this.uniforms = this.material.userData.shader.uniforms

      // add the uniforms
      shader.uniforms.time = {
        value: 0
      }

      // add the header
      shader.vertexShader = `
      ${header}
      ${shader.vertexShader}
      `

      // add the displacement compute
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `void main() {
        ${computeDistortion}
        `
      )

      // displace position
      shader.vertexShader = shader.vertexShader.replace(
        '#include <displacementmap_vertex>',
        'transformed = displacedPosition;'
      )

      // set the normals
      shader.vertexShader = shader.vertexShader.replace(
        `#include <defaultnormal_vertex>`,
        ShaderChunk.defaultnormal_vertex.replace(
          `vec3 transformedNormal = objectNormal;`,
          `vec3 transformedNormal = displacedNormal;`
        )
      )

      // fragment shader stuff
      shader.fragmentShader = `
      varying float vNoise;
      float PI = 3.1415926538;

      vec3 Color(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.30, 0.20, 0.20);

        return a + b * cos(2.0 * PI * (c * t + d));
      }

      ${shader.fragmentShader}
      `

      // #include <map_fragment>
      // color(t) = a + b ⋅ cos[ 2π(c⋅t+d)]
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <map_fragment>`,
        `diffuseColor.rgb = vec3(vNoise, 0.0, 0.0);`
      )
    }
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  setLights() {
    const light1 = new AmbientLight(0xffffff, 1)
    this.scene.add(light1)

    const light2 = new DirectionalLight(0xff9999, 0.8)
    light2.position.set(-0.5, 0, 0.866)
    this.scene.add(light2)

    const light3 = new DirectionalLight(0xffffff, 0.8)
    light3.position.set(0.5, 0, -0.866)
    this.scene.add(light3)

    const light4 = new DirectionalLight(0xffffff, 1)
    light4.position.set(2, -1, -2)
    this.scene.add(light4)
  }

  update() {
    this.mesh.rotation.y = Math.sin(this.time.elapsed * 0.0001)
    this.mesh.rotation.z = Math.cos(this.time.elapsed * 0.0003)

    if(this.uniforms)
      this.uniforms.time.value = this.time.elapsed * 0.0005
  }

  destroy() {

  }
}