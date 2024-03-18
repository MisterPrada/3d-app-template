import MinSignal from "min-signal";
import Ease from "./Utils/Ease.js";
import MathUtils from "./Utils/MathUtils.js";

const ease = new Ease;
const math = new MathUtils;

let LOADING_RECTS = [ 1, 1, 1, 3, 2, 4, 2, 1, 6, 2, 1, 2, 7, 1, 1, 1, 7, 4, 1, 1, 8, 2, 1, 2, 11, 2, 1, 3, 13, 2, 1, 3, 12, 1, 1, 1, 16, 1, 2, 1, 18, 2, 1, 2, 16, 4, 2, 1, 22, 1, 1, 4, 26, 1, 1, 4, 27, 1, 1, 1, 28, 2, 1, 3, 32, 1, 1, 1, 33, 3, 1, 1, 31, 1, 1, 3, 32, 4, 2, 1 ];
export default class Preloader {
    contentShowRatio = 0;
    contentHideRatio = 1;
    loadBarRatio = 0.0;
    lineTransformRatio = 0.0;
    showTextRatio = 0;
    waitTextRatio = 0;
    hideTextRatio = 1;
    pixelWidth = 42;
    needsShowText = !1;
    needsHideText = !1;
    loadingTextAnimation = 0;
    onShowTextCompleted = new MinSignal;
    onHideTextCompleted = new MinSignal;

    constructor() {
        this.init()
        this.resize( window.innerWidth, window.innerHeight)

    }

    init() {
        this.canvas = document.getElementById( "webgl-preloader" )
        this.ctx = this.canvas.getContext( "2d" )
    }

    resize( e, t ) {
        this.canvas.width = e * window.devicePixelRatio,
            this.canvas.height = t * window.devicePixelRatio,
            this.canvas.style.width = e + "px",
            this.canvas.style.height = t + "px",
            this.pixelWidth = ~~Math.min( 42, window.innerWidth / 30 )
    }

    isReadyToHide() {
    }

    get activeRatio() {
        return Math.min( 1 - this.contentShowRatio, this.contentHideRatio )
    }

    update( e ) {
        this.loadBarRatio = Math.min( 1,  this.loadBarRatio + 0.004 );

        if( this.loadBarRatio == 1 ) {
            this.lineTransformRatio = Math.min( 1, this.lineTransformRatio + 0.009 );
        }

        if( this.lineTransformRatio == 1 ) {
            this.contentShowRatio = Math.min( 1, this.contentShowRatio + 0.004 );
        }

        if ( this.activeRatio > 0 ) {
            let t = window.innerWidth
                , r = window.innerHeight
                , n = this.pixelWidth
                , o = this.loadBarRatio
                , l = this.lineTransformRatio
                , c = Math.sqrt( t * t + r * r ) / n
                , u = this.ctx;
            u.save(),
                u.scale( window.devicePixelRatio, window.devicePixelRatio ),
                u.fillStyle = "#000",
                u.fillRect( 0, 0, t, r );
            let f = ease.expoInOut( 1 - this.activeRatio )
                , p = ( 1 + f * c ) * n;
            if ( u.translate( t * .5, r * .5 ),
                u.rotate( f * ( this.contentShowRatio == 0 ? -1 : 1 ) ),
                u.translate( n * f * c, -n * .5 * f * c ),
                u.scale( p, p ),
            l == 0 ) {
                u.fillStyle = "#333"
                u.fillRect( -2.5, -.5, 5, 1 )
                u.fillStyle = "#fff"
                u.fillRect( -2.5, -.5, 5 * o, 1 )
            }

            else {
                u.fillStyle = "#fff",
                this.needsShowText && ( this.showTextRatio = this.showTextRatio + e * 1.25,
                this.showTextRatio >= 1 && ( this.showTextRatio = 1,
                    this.needsShowText = !1,
                    this.onShowTextCompleted.dispatch() ) ),
                this.showTextRatio == 1 && ( this.waitTextRatio = Math.min( 1, this.waitTextRatio + e * 3 ),
                this.waitTextRatio == 1 && this.needsHideText && taskManager.percent == 1 && ( this.hideTextRatio = this.hideTextRatio + e * 1.25,
                this.hideTextRatio >= 1 && ( this.hideTextRatio = 1,
                    this.needsHideText = !1,
                    this.onHideTextCompleted.dispatch() ) ) );
                let g = this.showTextRatio
                    , v = this.hideTextRatio
                    , _ = math.fit( Math.min( g, 1 - v ), 0, .5, 1, .2, ease.expoInOut )
                    , w = ( ease.expoInOut( g ) + ease.expoInOut( v ) ) * -15;
                if ( g > 0 && v < 1 ) {
                    u.scale( _, _ ),
                        u.translate( -l, 1.5 * l ),
                        u.translate( w, 0 ),
                        u.save(),
                        u.translate( -1.5, -4.5 ),
                        u.beginPath();
                    for ( let S = 0, b = LOADING_RECTS.length / 4, C = 0; S < b; S++,
                        C += 4 ) {
                        u.fillStyle = "#fff";
                        let R = LOADING_RECTS[ C + 0 ]
                            , T = LOADING_RECTS[ C + 1 ]
                            , M = LOADING_RECTS[ C + 2 ]
                            , P = LOADING_RECTS[ C + 3 ]
                            , I = S / ( b - 1 )
                            ,
                            V = math.fit( g, I * .5, .5 + I * .5, 0, 1, ease.expoIn ) * math.fit( v, I * .5, .5 + I * .5, 1, 0, ease.expoOut );
                        g < 1 ? S < 2 && ( V = 1 ) : S >= b - 2 && ( V = 1 ),
                            u.rect( R + ( 1 - V ) * M * .5, T + ( 1 - V ) * P * .5, M * V, P * V )
                    }
                    u.closePath(),
                        u.fill(),
                        u.restore()
                } else
                    u.translate( -l, 1.5 * l ),
                        u.save(),
                        u.translate( .5, -.5 ),
                        u.rotate( l * Math.PI * .5 ),
                        u.globalCompositeOperation = "xor",
                        u.fillRect( -3, 0, 3, 1 ),
                        u.globalCompositeOperation = "source-over",
                        u.globalAlpha = 1 - f,
                        u.fillRect( -3, 0, 3, 1 ),
                        u.restore(),
                        u.save(),
                        u.translate( .5, -.5 ),
                        u.globalCompositeOperation = "xor",
                        u.fillRect( 0, 0, 2, 1 ),
                        u.globalCompositeOperation = "source-over",
                        u.globalAlpha = 1 - f,
                        u.fillRect( 0, 0, 2, 1 ),
                        u.restore()
            }
            u.restore(),
                this.canvas.style.display = "block"
        } else
            this.canvas.style.display = "none"
    }
}
