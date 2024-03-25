import * as THREE from 'three'
import Experience from './Experience.js'

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.timeline = this.experience.timeline
        this.html = this.experience.html

        this.setInstance()
        this.setDebug()
    }

    setInstance() {
        this.clearColor = '#010101'

        this.instance = new THREE.WebGLRenderer( {
            canvas: this.canvas,
            powerPreference: "high-performance",
            antialias: false,
            alpha: false,
            // stencil: false,
            // depth: false,
            useLegacyLights: false,
            physicallyCorrectLights: true,
        } )

        this.instance.outputColorSpace = THREE.SRGBColorSpace
        this.instance.setSize( this.sizes.width, this.sizes.height )
        this.instance.setPixelRatio( Math.min( this.sizes.pixelRatio, 2 ) )

        this.instance.setClearColor( this.clearColor, 1 )
        this.instance.setSize( this.sizes.width, this.sizes.height )
    }

    setDebug() {

    }

    update() {
        if ( this.debug ) {
            this.debugRender()
        } else {
            this.productionRender()
        }
    }

    productionRender() {
        this.instance.render( this.scene, this.camera.instance )
    }

    debugRender() {
        this.instance.autoClear = false
        this.instance.clearColor( this.clearColor )
        this.instance.render( this.scene, this.camera.instance )
        this.instance.clearDepth()
    }

    resize() {
        // Instance
        this.instance.setSize( this.sizes.width, this.sizes.height )
        this.instance.setPixelRatio( this.sizes.pixelRatio )
    }

    destroy() {

    }
}
