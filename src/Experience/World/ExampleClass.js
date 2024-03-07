import * as THREE from 'three'
import Experience from '../Experience.js'

export default class ExampleClass {
    experience = new Experience()
    debug = experience.debug
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

    }

    update( deltaTime ) {

    }

}
