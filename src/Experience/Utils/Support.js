import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from "gsap";

export default class Support {
    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer.instance
        this.resources = this.experience.resources
        this.properties = this.experience.world.properties

        this.properties.isSupported = this.isSupported()
        this.renderer.context = this.properties.gl
    }

    isSupported() {
        this.properties.isSupportedDevice = true;

        this.properties.isSupportedBrowser = (
            this.properties.isChrome ||
            this.properties.isSafari ||
            this.properties.isEdge ||
            this.properties.isFirefox ||
            this.properties.isOpera
        ) && !this.properties.isIE;

        this.properties.isSupportedWebGL = this.checkSupportWebGL();

        if ( this.properties.isMobile ) {
            this.checkSupportMobileOrientation();
        }

        let isSupported = this.properties.isSupportedDevice &&
            this.properties.isSupportedBrowser &&
            this.properties.isSupportedWebGL;

        if ( isSupported === false ) {
            this.notSupported();
        }

        return isSupported;
    }


    notSupported() {
        if ( !this.properties._isSupportedDevice ) {
            this._addNotSupported( "device" );
            return
        }
        if ( !this.properties._isSupportedBrowser ) {
            this._addNotSupported( "browser" );
            return
        }
        if ( !this.properties._isSupportedWebGL ) {
            this._addNotSupported( "webgl" );
            return
        }
    }

    checkSupportWebGL() {
        if ( !( this.properties.canvas instanceof HTMLCanvasElement ) ) return false;

        if ( this.properties.USE_WEBGL2 && window.WebGL2RenderingContext ) {
            try {
                this.properties.gl = this.properties.canvas.getContext( "webgl2", this.properties.webglOpts );
                this.properties.RENDER_TARGET_FLOAT_TYPE = THREE.HalfFloatType;
                this.properties.DATA_FLOAT_TYPE = THREE.FloatType;
                return true;
            } catch ( error ) {
                console.error( error );
                return false;
            }
        }

        this.properties.USE_WEBGL2 = false;

        if ( window.WebGLRenderingContext ) {
            try {
                let glContext = this.properties.gl = this.properties.canvas.getContext( "webgl", this.properties.webglOpts ) ||
                    this.properties.canvas.getContext( "experimental-webgl", this.properties.webglOpts );

                if ( ( glContext.getExtension( "OES_texture_float" ) || glContext.getExtension( "OES_texture_half_float" ) ) &&
                    glContext.getParameter( glContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) ) {
                    this.properties.RENDER_TARGET_FLOAT_TYPE = this.properties.isIOS || glContext.getExtension( "OES_texture_half_float" ) ?
                        THREE.HalfFloatType : THREE.FloatType;
                    this.properties.DATA_FLOAT_TYPE = THREE.FloatType;
                } else {
                    this.properties.USE_FLOAT_PACKING = true;
                    this.properties.RENDER_TARGET_FLOAT_TYPE = this.properties.DATA_FLOAT_TYPE = THREE.UnsignedByteType;
                    return false;
                }
                return true;
            } catch ( error ) {
                console.error( error );
                return false;
            }
        }

        return false;
    }

    checkSupportMobileOrientation() {
        const orientationMediaQuery = window.matchMedia( "(orientation: portrait)" );

        const handleOrientationChange = ( mediaQueryListEvent ) => {
            const currentOrientation = mediaQueryListEvent.matches ? "portrait" : "landscape";

            if ( currentOrientation === "portrait" ) {
                this.properties.isSupportedMobileOrientation = true;
            } else if ( currentOrientation === "landscape" ) {
                this.properties.isSupportedMobileOrientation = false;
            }

            if ( this.properties.isSupported && !this.properties.isSupportedMobileOrientation ) {
                this.addNotSupportedIndicator( "orientation" );
            } else {
                this.removeNotSupportedIndicator( "orientation" );
            }
        };

        window.addEventListener( "load", () => {
            handleOrientationChange( orientationMediaQuery );
        } );

        orientationMediaQuery.addEventListener( "change", ( event ) => {
            handleOrientationChange( event );
        } );
    }

    _removeNotSupported( feature ) {
        if ( this.properties.isSupported ) {
            document.documentElement.classList.remove( "not-supported" );
        }

        if ( feature ) {
            document.documentElement.classList.remove( `not-supported--${ feature }` );
        }
    }

    _addNotSupported( feature ) {
        document.documentElement.classList.add( "not-supported" );

        if ( feature ) {
            document.documentElement.classList.add( `not-supported--${ feature }` );
        }
    }

}
