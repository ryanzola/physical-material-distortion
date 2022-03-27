import * as THREE from 'three'
import Experience from './Experience'

import vertex from './shaders/background/vertex.glsl'
import fragment from './shaders/background/fragment.glsl'

export default class Background {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time

    this.setMaterial()
    this.setGeometry()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.SphereBufferGeometry(6.6, 32, 32)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.BackSide,
      uniforms: {
        cube: { value: 0 },
        time: { value: 0 },
      }
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  update() {
    if(this.material)
    this.material.uniforms.time.value = this.time.elapsed * 0.0005
  }
  
}