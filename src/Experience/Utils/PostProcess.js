import * as THREE from 'three'
import Experience from '../Experience.js'
import Debug from '../Utils/Debug.js'
import Properties from "../Properties.js";
import Sizes from "./Sizes.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";

export default class PostProcess {
    experience = new Experience()
    debug = new Debug()
    sizes = new Sizes()
    properties = new Properties()
    rendererClass = this.experience.renderer
    scene = experience.scene
    time = experience.time
    camera = experience.camera.instance
    resources = experience.resources
    cursor = experience.cursor
    timeline = experience.timeline;
    container = new THREE.Group();

    constructor( renderer ) {
        this.renderer = renderer
        this.setComposer()
        this.setDebug()
    }

    setComposer() {
        this.postProcess = {}

        /**
         * Passes
         */
        // Render pass
        this.postProcess.renderPass = new RenderPass( this.scene, this.camera )

        // Bloom pass
        this.postProcess.unrealBloomPass = new UnrealBloomPass(
            new THREE.Vector2( this.sizes.width, this.sizes.height ),
            0.6,
            1.0,
            0.362
        )
        this.postProcess.unrealBloomPass.enabled = true

        this.postProcess.unrealBloomPass.tintColor = {}
        this.postProcess.unrealBloomPass.tintColor.value = '#000000'
        this.postProcess.unrealBloomPass.tintColor.instance = new THREE.Color( this.postProcess.unrealBloomPass.tintColor.value )

        this.postProcess.unrealBloomPass.compositeMaterial.uniforms.uTintColor = { value: this.postProcess.unrealBloomPass.tintColor.instance }
        this.postProcess.unrealBloomPass.compositeMaterial.uniforms.uTintStrength = { value: 0.15 }
//         this.postProcess.unrealBloomPass.compositeMaterial.fragmentShader = `
// varying vec2 vUv;
// uniform sampler2D blurTexture1;
// uniform sampler2D blurTexture2;
// uniform sampler2D blurTexture3;
// uniform sampler2D blurTexture4;
// uniform sampler2D blurTexture5;
// uniform sampler2D dirtTexture;
// uniform float bloomStrength;
// uniform float bloomRadius;
// uniform float bloomFactors[NUM_MIPS];
// uniform vec3 bloomTintColors[NUM_MIPS];
// uniform vec3 uTintColor;
// uniform float uTintStrength;
//
// float lerpBloomFactor(const in float factor) {
//     float mirrorFactor = 1.2 - factor;
//     return mix(factor, mirrorFactor, bloomRadius);
// }
//
// void main() {
//     vec4 color = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
//         lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
//         lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
//         lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
//         lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
//
//     color.rgb = mix(color.rgb, uTintColor, uTintStrength);
//     gl_FragColor = color;
// }
//         `
        /**
         * Effect composer
         */

        this.renderTarget = new THREE.WebGLRenderTarget(
            this.sizes.width,
            this.sizes.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                colorSpace: THREE.LinearSRGBColorSpace,
                samples: this.renderer.getPixelRatio() === 1 ? 2 : 0
            }
        )

        this.postProcess.composer = new EffectComposer( this.renderer, this.renderTarget )
        this.postProcess.composer.setSize( this.sizes.width, this.sizes.height )
        this.postProcess.composer.setPixelRatio( this.sizes.pixelRatio )

        this.postProcess.composer.addPass( this.postProcess.renderPass )
        this.postProcess.composer.addPass( this.postProcess.unrealBloomPass )
    }

    resize() {
        this.postProcess.composer.setSize( this.sizes.width, this.sizes.height )
        this.postProcess.composer.setPixelRatio( this.sizes.pixelRatio )
    }

    setDebug() {
        if ( !this.debug.active ) return

        if ( this.debug.panel ) {
            this.debugFolder = this.debug.panel.addFolder( {
                title: 'renderer',
                expanded: false
            } )

            const debugFolder = this.debugFolder
                .addFolder( {
                    title: 'UnrealBloomPass'
                } )

            debugFolder
                .addBinding(
                    this.postProcess.unrealBloomPass,
                    'enabled',
                    {}
                )

            debugFolder
                .addBinding(
                    this.postProcess.unrealBloomPass,
                    'strength',
                    { min: 0, max: 5, step: 0.001 }
                )

            debugFolder
                .addBinding(
                    this.postProcess.unrealBloomPass,
                    'radius',
                    { min: 0, max: 1, step: 0.001 }
                )

            debugFolder
                .addBinding(
                    this.postProcess.unrealBloomPass,
                    'threshold',
                    { min: 0, max: 1, step: 0.001 }
                )

            debugFolder
                .addBinding(
                    this.postProcess.unrealBloomPass.tintColor,
                    'value',
                    { view: 'uTintColor', label: 'color' }
                )
                .on( 'change', () => {
                    this.postProcess.unrealBloomPass.tintColor.instance.set( this.postProcess.unrealBloomPass.tintColor.value )
                } )

            debugFolder
                .addBinding(
                    this.postProcess.unrealBloomPass.compositeMaterial.uniforms.uTintStrength,
                    'value',
                    { label: 'uTintStrength', min: 0, max: 1, step: 0.001 }
                )
        }
    }

    productionRender() {
        if ( this.properties.postprocessing ) {
            this.postProcess.composer.render()
        } else {
            this.renderer.render( this.scene, this.camera )
        }
    }

    debugRender() {
        if ( this.properties.postprocessing ) {
            this.renderer.autoClear = false
            this.postProcess.composer.render()
            this.renderer.clearDepth()
        } else {
            this.renderer.autoClear = false
            this.renderer.clearColor( this.rendererClass.clearColor )
            this.renderer.render( this.scene, this.camera )
            this.renderer.clearDepth()
        }
    }

    update( deltaTime ) {
        if ( this.debug.active ) {
            this.debugRender()
        } else {
            this.productionRender()
        }

    }

}
