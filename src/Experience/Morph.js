import * as THREE from 'three'
import Experience from './Experience'

import vertex from './shaders/morph/vertex.glsl'
import fragment from './shaders/morph/fragment.glsl'

export default class Morph {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.SphereBufferGeometry(1, 64, 64)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        time: { value: 0.0 }
      }
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  update() {
    this.material.uniforms.time.value = this.time.elapsed * 0.001
  }

  destroy() {

  }
}