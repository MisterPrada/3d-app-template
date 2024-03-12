import Experience from '../Experience.js'
import Environment from './Environment.js'
import ExampleClass from "./ExampleClass.js";
import DebugHelpers from "./DebugHelpers.js";

export default class World {
    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera;
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.html = this.experience.html
        this.sound = this.experience.sound
        this.debug = this.experience.debug.panel

        // Wait for resources
        this.resources.on( 'ready', () => {
            //this.startWithPreloader()
            this.start()
        } )
    }

    start() {
        // hard remove preloader
        this.html.playButton.classList.replace( "fade-in", "fade-out" );
        this.html.preloader.classList.add( "preloaded" );
        this.html.preloader.remove();
        this.html.playButton.remove();

        this.experience.time.start = Date.now()
        this.experience.time.elapsed = 0

        this.setupWorld()

        // Animation timeline
        this.animationPipeline();
    }

    setupWorld() {
        // Setup
        this.cube = new ExampleClass()
        this.environment = new Environment()

        // Add debug helpers
        this.debugHelpers = new DebugHelpers()

        // Animation timeline
        this.animationPipeline();
    }

    startWithPreloader() {
        this.html.playButton.classList.add( "fade-in" );
        this.html.playButton.addEventListener( 'click', () => {

            this.html.playButton.classList.replace( "fade-in", "fade-out" );
            //this.sound.createSounds();

            setTimeout( () => {
                this.experience.time.start = Date.now()
                this.experience.time.elapsed = 0

                // Setup
                this.setupWorld()

                // Remove preloader
                this.html.preloader.classList.add( "preloaded" );
                setTimeout( () => {
                    this.html.preloader.remove();
                    this.html.playButton.remove();
                }, 2500 );
            }, 100 );
        }, { once: true } );
    }

    animationPipeline() {
        // if ( this.text )
        //     this.text.animateTextShow()

        if ( this.camera )
            this.camera.animateCameraPosition()
    }

    resize() {

    }

    update( deltaTime ) {
        this.debugHelpers?.update( deltaTime )
    }
}
