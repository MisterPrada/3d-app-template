import * as THREE from 'three'
import Experience from '../Experience.js'
import Debug from '../Utils/Debug.js'
import Properties from "../Properties.js";

export default class ExampleClass {
    experience = new Experience()
    debug = new Debug()
    properties = new Properties()
    scene = experience.scene
    time = experience.time
    camera = experience.camera.instance
    renderer = experience.renderer.instance
    resources = experience.resources
    cursor = experience.cursor
    timeline = experience.timeline;
    container = new THREE.Group();

    constructor() {
        this.setModel()
        this.setDebug()
    }

    setModel() {

        // add example cube
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( this.geometry, this.material );
        this.container.add( this.cube );
        this.scene.add( this.container );
    }

    resize() {

    }

    setDebug() {
        if ( !this.debug.active ) return

        this.debug.createDebugTexture( this.resources.items.displacementTexture )
    }

    update( deltaTime ) {

    }

}
