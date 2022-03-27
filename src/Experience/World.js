import * as THREE from 'three'

import Experience from './Experience'
import Morph from './Morph'
import Background from './Background'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setMorph()
                this.setBackground()
            }
        })
    }

    setMorph() {
        this.morph = new Morph()
    }

    setBackground() {
        this.background = new Background()
    }

    resize()
    {
    }

    update()
    {
        if(this.morph)
            this.morph.update()

        if(this.background)
            this.background.update()
    }

    destroy()
    {
        if(this.morph)
            this.morph.destroy()
    }
}