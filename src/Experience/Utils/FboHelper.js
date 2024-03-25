import * as THREE from 'three'
import Experience from '../Experience.js'

import blitVert from '../Shaders/FboHelper/blitVert.glsl'
import blitFrag from '../Shaders/FboHelper/blitFrag.glsl'
import uvBlitVert from '../Shaders/FboHelper/uvBlitVert.glsl'
import clearFrag from '../Shaders/FboHelper/clearFrag.glsl'
import debugVert from '../Shaders/FboHelper/debugVert.glsl'

export default class FboHelper {
    isWebGL2;
    renderer;
    quadGeom;
    triGeom;
    floatType;
    precisionPrefix;
    precisionPrefix2;
    vertexShader;
    _scene;
    _camera;
    _tri;
    copyMaterial;
    uvCopyMaterial;
    clearMaterial;

    experience = new Experience()
    debug = this.experience.debug
    scene = this.experience.scene
    time = this.experience.time
    camera = this.experience.camera
    renderer = this.experience.renderer.instance
    resources = this.experience.resources
    properties = this.experience.world.properties

    constructor() {

        // Singleton
        if ( FboHelper._instance ) {
            return FboHelper._instance
        }
        FboHelper._instance = this

        this.init( this.properties.renderer, this.properties.RENDER_TARGET_FLOAT_TYPE )
    }

    init( renderer, floatType ) {
        this.renderer = renderer
        this.floatType = floatType
        this.isWebGL2 = this.renderer.capabilities.isWebGL2
        this._scene = new THREE.Scene
        this._camera = new THREE.Camera
        this._camera.position.z = 1
        this.triGeom = new THREE.BufferGeometry
        this.triGeom.setAttribute( "position", new THREE.BufferAttribute( new Float32Array( [ -1, -1, 0, 4, -1, 0, -1, 4, 0 ] ), 3 ) )
        this.quadGeom = new THREE.PlaneGeometry( 2, 2 )
        this._tri = new THREE.Mesh( this.triGeom )
        this._tri.frustumCulled = false
        this._scene.add( this._tri )
        this.precisionPrefix = `precision ${ this.renderer.capabilities.precision } float;
        `
        this.precisionPrefix2 = `#version 300 es
			precision ${ this.renderer.capabilities.precision } float;
			precision ${ this.renderer.capabilities.precision } int;
			#define IS_WEBGL2 true
		`

        if( this.isWebGL2 ) {
            this.vertexPrefix = `${ this.precisionPrefix2 }
				precision mediump sampler2DArray;
				#define attribute in
				#define varying out
				#define texture2D texture
        `
            this.fragmentPrefix = `${ this.precisionPrefix2 }
				#define varying in
				out highp vec4 pc_fragColor;
				#define gl_FragColor pc_fragColor
				#define gl_FragDepthEXT gl_FragDepth
				#define texture2D texture
				#define textureCube texture
				#define texture2DProj textureProj
				#define texture2DLodEXT textureLod
				#define texture2DProjLodEXT textureProjLod
				#define textureCubeLodEXT textureLod
				#define texture2DGradEXT textureGrad
				#define texture2DProjGradEXT textureProjGrad
				#define textureCubeGradEXT textureGrad
			`
        } else {
            this.vertexPrefix = this.precisionPrefix
            this.fragmentPrefix = this.precisionPrefix
        }

        this.renderer.getContext().getExtension( "OES_standard_derivatives" )
        this.vertexShader = this.precisionPrefix + blitVert

        this.copyMaterial = new THREE.RawShaderMaterial( {
            uniforms: { u_texture: { value: null } },
            vertexShader: this.vertexShader,
            fragmentShader: this.precisionPrefix + blitFrag,
            depthTest: false,
            depthWrite: false,
            blending: THREE.NoBlending
        } )

        this.uvCopyMaterial = new THREE.RawShaderMaterial( {
            uniforms: { u_texture: { value: null } },
            vertexShader: this.precisionPrefix + uvBlitVert,
            fragmentShader: this.precisionPrefix + blitFrag,
            depthTest: false,
            depthWrite: false,
            blending: THREE.NoBlending
        } )

        this.clearMaterial = new THREE.RawShaderMaterial( {
            uniforms: { u_color: { value: new THREE.Vector4( 1, 1, 1, 1 ) } },
            vertexShader: this.vertexShader,
            fragmentShader: this.precisionPrefix + clearFrag,
            depthTest: false,
            depthWrite: false,
            blending: THREE.NoBlending
        } );

    }

    copy( texture, renderTarget ) {
        if( this.copyMaterial ) {
            this.copyMaterial.uniforms.u_texture.value = texture
            this.render( this.copyMaterial, renderTarget )
        }
    }

    uvCopy( texture, renderTarget ) {
        if( this.uvCopyMaterial ) {
            this.uvCopyMaterial.uniforms.u_texture.value = texture
            this.render( this.uvCopyMaterial, renderTarget )
        }
    }

    render( material, renderTarget ) {
        if( this._tri && this.renderer && this._scene && this._camera ) {
            this._tri.material = material;

            this.renderer.setRenderTarget( renderTarget || null );

            this.renderer.render( this._scene, this._camera );
            this.renderer.setRenderTarget( null );
        }
    }

    renderGeometry( geometry, material, renderTarget ) {
        if( this._tri && this.triGeom ) {
            this._tri.geometry = geometry;
            this.render( material, renderTarget );
            this._tri.geometry = this.triGeom;
        }
    }

    renderMesh( mesh, renderTarget, camera = this._camera ) {
        if( this._tri && this.renderer && this._scene && camera ) {
            this._tri.visible = false;
            this._scene.add( mesh );

            this.renderer.setRenderTarget( renderTarget || null );
            this.renderer.render( this._scene, camera );
            this.renderer.setRenderTarget( null );

            this._scene.remove( mesh );
            this._tri.visible = true;
        }
    }

    parseDefines( values ) {
        let defines = "";
        for ( const i in values ) {
            const n = values[ i ];
            n === !0 ? defines += `#define ${ i }
` : defines += `#define ${ i } ${ n }
`
        }
        return defines
    }

    clearColor( r, g, b, a, renderTarget ) {
        if( this.clearMaterial ) {
            this.clearMaterial.uniforms.u_color.value.set( r, g, b, a )
            this.render( this.clearMaterial, renderTarget )
        }
    }

    getColorState() {
        if( !this.renderer ) return {
            autoClear: true,
            autoClearColor: true,
            autoClearStencil: true,
            autoClearDepth: true,
            clearColor: 0,
            clearAlpha: 1
        };

        const color = new THREE.Color;
        this.renderer.getClearColor( color )

        return {
            autoClear: this.renderer.autoClear,
            autoClearColor: this.renderer.autoClearColor,
            autoClearStencil: this.renderer.autoClearStencil,
            autoClearDepth: this.renderer.autoClearDepth,
            clearColor: color.getHex(),
            clearAlpha: this.renderer.getClearAlpha()
        }
    }

    setColorState( colorState ) {
        if( this.renderer ) {
            this.renderer.setClearColor( colorState.clearColor, colorState.clearAlpha )
            this.renderer.autoClear = colorState.autoClear
            this.renderer.autoClearColor = colorState.autoClearColor
            this.renderer.autoClearStencil = colorState.autoClearStencil
            this.renderer.autoClearDepth = colorState.autoClearDepth
        }
    }

    createRawShaderMaterial( parameters ) {
        parameters = Object.assign( {
            depthTest: false,
            depthWrite: false,
            blending: THREE.NoBlending,
            vertexShader: blitVert,
            fragmentShader: blitFrag,
            derivatives: false
        }, parameters )

        if( parameters.vertexShaderPrefix ) {
            parameters.vertexShader = parameters.vertexShaderPrefix + parameters.vertexShader;
        } else if( parameters.derivatives ) {
            parameters.vertexShader = this.vertexPrefix + parameters.vertexShader;
        } else {
            parameters.vertexShader = this.precisionPrefix + parameters.vertexShader;
        }

        if( parameters.fragmentShaderPrefix ) {
            parameters.fragmentShader = parameters.fragmentShaderPrefix + parameters.fragmentShader;
        } else if( parameters.derivatives ) {
            parameters.fragmentShader = this.fragmentPrefix + parameters.fragmentShader;
        } else {
            parameters.fragmentShader = this.precisionPrefix + parameters.fragmentShader;
        }

        delete parameters.vertexShaderPrefix;
        delete parameters.fragmentShaderPrefix;
        delete parameters.derivatives;

        //let material = new THREE.RawShaderMaterial(parameters);
        //taskManager.add(material)
        return new THREE.RawShaderMaterial( parameters );
    }

    createDataTexture( data, width, height, floatType = false, nearestFilter = true ) {
        let texture = new THREE.DataTexture( data, width, height, THREE.RGBAFormat, floatType ? THREE.FloatType : THREE.UnsignedByteType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, nearestFilter ? THREE.NearestFilter : THREE.LinearFilter, nearestFilter ? THREE.NearestFilter : THREE.LinearFilter, 0 );

        texture.needsUpdate = true;

        return texture;
    }

    createRenderTarget( width, height, nearestFilter = false, floatType = false, r = 0 ) {
        return new THREE.WebGLRenderTarget( width, height, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: nearestFilter ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: nearestFilter ? THREE.NearestFilter : THREE.LinearFilter,
            type: floatType ? this.floatType : THREE.UnsignedByteType,
            anisotropy: 0,
            //encoding: THREE.LinearEncoding,
            colorSpace: THREE.LinearSRGBColorSpace,
            depthBuffer: false,
            stencilBuffer: false,
            samples: this.properties.isSupportMSAA ? r : 0
        } )
    }

    createMultisampleRenderTarget( width, height, nearestFilter = false, floatType = false, samples = 8 ) {
        return !this.properties.USE_MSAA || !( this.renderer && this.isWebGL2 ) || !this.properties.isSupportMSAA ? this.createRenderTarget( width, height, nearestFilter, floatType ) : new THREE.WebGLRenderTarget( width, height, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: nearestFilter ? THREE.NearestFilter : THREE.LinearFilter,
            minFilter: nearestFilter ? THREE.NearestFilter : THREE.LinearFilter,
            type: floatType ? this.floatType : THREE.UnsignedByteType,
            anisotropy: 0,
            //encoding: THREE.LinearEncoding,
            colorSpace: THREE.LinearSRGBColorSpace,
            depthBuffer: false,
            stencilBuffer: false,
            samples: samples
        } )
    }

    clearMultisampleRenderTargetState( renderTarget ) {
        if( renderTarget = renderTarget || this.renderer.getRenderTarget(), renderTarget && renderTarget.samples > 0 ) {
            const renderTargetProperties = this.renderer.properties.get( renderTarget );
            let rendererContext = this.renderer.getContext();

            rendererContext.bindFramebuffer( rendererContext.READ_FRAMEBUFFER, renderTargetProperties.__webglMultisampledFramebuffer )
            rendererContext.bindFramebuffer( rendererContext.DRAW_FRAMEBUFFER, renderTargetProperties.__webglFramebuffer );

            const width = renderTarget.width, height = renderTarget.height;
            let COLOR_BUFFER_BIT = rendererContext.COLOR_BUFFER_BIT;
            renderTarget.depthBuffer && ( COLOR_BUFFER_BIT |= rendererContext.DEPTH_BUFFER_BIT )
            renderTarget.stencilBuffer && ( COLOR_BUFFER_BIT |= rendererContext.STENCIL_BUFFER_BIT )
            rendererContext.blitFramebuffer( 0, 0, width, height, 0, 0, width, height, COLOR_BUFFER_BIT, rendererContext.NEAREST )
            rendererContext.bindFramebuffer( rendererContext.FRAMEBUFFER, renderTargetProperties.__webglMultisampledFramebuffer )
        }
    }
}
