export default class MathUtils {
    PI = Math.PI;
    PI2 = this.PI * 2;
    HALF_PI = this.PI * .5;
    DEG2RAD = this.PI / 180;
    RAD2DEG = 180 / this.PI;

    step( threshold, value ) {
        return value < threshold ? 0 : 1;
    }

    clamp( value, min, max ) {
        return value < min ? min : value > max ? max : value;
    }

    mix( start, end, factor ) {
        return start + ( end - start ) * factor;
    }

    cMix( start, end, factor ) {
        return start + ( end - start ) * this.clamp( factor, 0, 1 );
    }

    unMix( start, end, value ) {
        return ( value - start ) / ( end - start );
    }

    cUnMix( start, end, value ) {
        return this.clamp( ( value - start ) / ( end - start ), 0, 1 );
    }

    saturate( value ) {
        return this.clamp( value, 0, 1 );
    }

    fit( value, startRange1, endRange1, startRange2, endRange2, transformFunc = null ) {
        let normalizedValue = this.cUnMix( startRange1, endRange1, value );

        if ( transformFunc ) {
            normalizedValue = transformFunc( normalizedValue );
        }

        return startRange2 + normalizedValue * ( endRange2 - startRange2 );
    }

    unClampedFit( value, startRange1, endRange1, startRange2, endRange2, transformFunc = null ) {
        let normalizedValue = this.unMix( startRange1, endRange1, value );

        if ( transformFunc ) {
            normalizedValue = transformFunc( normalizedValue );
        }

        return startRange2 + normalizedValue * ( endRange2 - startRange2 );
    }

    loop( value, start, end ) {
        value -= start;
        let range = end - start;

        return ( value < 0 ? ( range - Math.abs( value ) % range ) % range : value % range ) + start;
    }

    normalize( value, min, range ) {
        return Math.max( 0, Math.min( 1, ( value - min ) / range ) );
    }

    smoothstep( min, max, value ) {
        value = this.cUnMix( min, max, value );

        return value * value * ( 3 - 2 * value );
    }

    fract( value ) {
        return value - Math.floor( value );
    }

    hash( value ) {
        return this.fract( Math.sin( value ) * 43758.5453123 );
    }

    hash2( x, y ) {
        return this.fract( Math.sin( x * 12.9898 + y * 4.1414 ) * 43758.5453 );
    }

    sign( value ) {
        return value ? ( value < 0 ? -1 : 1 ) : 0;
    }

    isPowerOfTwo( value ) {
        return ( value & -value ) === value;
    }

    powerTwoCeilingBase( value ) {
        return Math.ceil( Math.log( value ) / Math.log( 2 ) );
    }

    powerTwoCeiling( value ) {
        return this.isPowerOfTwo( value ) ? value : 1 << this.powerTwoCeilingBase( value );
    }

    powerTwoFloorBase( value ) {
        return Math.floor( Math.log( value ) / Math.log( 2 ) );
    }

    powerTwoFloor( value ) {
        return this.isPowerOfTwo( value ) ? value : 1 << this.powerTwoFloorBase( value );
    }

    lerp( start, end, factor ) {
        return start + factor * ( end - start );
    }

    latLngBearing( startLat, startLng, destLat, destLng ) {
        let dLng = destLng - startLng;

        let y = Math.sin( dLng ) * Math.cos( destLat );
        let x = Math.cos( startLat ) * Math.sin( destLat ) - Math.sin( startLat ) * Math.cos( destLat ) * Math.cos( dLng );

        return Math.atan2( y, x );
    }

    distanceTo( x, y ) {
        return Math.sqrt( x * x + y * y );
    }

    distanceSqrTo( x, y ) {
        return x * x + y * y;
    }

    distanceTo3( x, y, z ) {
        return Math.sqrt( x * x + y * y + z * z );
    }

    distanceSqrTo3( x, y, z ) {
        return x * x + y * y + z * z;
    }

    latLngDistance( lat1, lng1, lat2, lng2 ) {
        let dLat = Math.sin( ( lat2 - lat1 ) / 2 );
        let dLng = Math.sin( ( lng2 - lng1 ) / 2 );
        let a = dLat * dLat + Math.cos( lat1 ) * Math.cos( lat2 ) * dLng * dLng;
        return 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
    }

    cubicBezier( p0, p1, p2, p3, t ) {
        let a = ( p1 - p0 ) * 3;
        let b = ( p2 - p1 ) * 3 - a;
        let c = p3 - p0 - a - b;
        let tSquared = t * t;
        let tCubed = tSquared * t;
        return c * tCubed + b * tSquared + a * t + p0;
    }

    cubicBezierFn( p0, p1, p2, p3 ) {
        let a = ( p1 - p0 ) * 3;
        let b = ( p2 - p1 ) * 3 - a;
        let c = p3 - p0 - a - b;
        return t => {
            let tSquared = t * t;
            let tCubed = tSquared * t;
            return c * tCubed + b * tSquared + a * t + p0;
        };
    }

    normalizeAngle( angle ) {
        angle += Math.PI;
        angle = angle < 0 ? 2 * Math.PI - Math.abs( angle % ( 2 * Math.PI ) ) : angle % ( 2 * Math.PI );
        angle -= Math.PI;
        return angle;
    }

    closestAngleTo( currentAngle, targetAngle ) {
        return currentAngle + this.normalizeAngle( targetAngle - currentAngle );
    }

    randomRange( min, max ) {
        return min + Math.random() * ( max - min );
    }

    randomRangeInt( min, max ) {
        return Math.floor( this.randomRange( min, max + 1 ) );
    }

    padZero( number, length ) {
        return number.toString().length >= length ? number.toString() : ( '1'.repeat( length ) + Math.floor( number ) ).slice( -length );
    }

    getSeedRandomFn( seed ) {
        let seed1 = 1779033703, seed2 = 3144134277, seed3 = 1013904242, seed4 = 2773480762;
        for ( let i = 0, charCode; i < seed.length; i++ ) {
            charCode = seed.charCodeAt( i );
            seed1 = seed2 ^ Math.imul( seed1 ^ charCode, 597399067 );
            seed2 = seed3 ^ Math.imul( seed2 ^ charCode, 2869860233 );
            seed3 = seed4 ^ Math.imul( seed3 ^ charCode, 951274213 );
            seed4 = seed1 ^ Math.imul( seed4 ^ charCode, 2716044179 );
        }
        return () => {
            seed1 >>>= 0;
            seed2 >>>= 0;
            seed3 >>>= 0;
            seed4 >>>= 0;
            let t = ( seed1 + seed2 ) | 0;
            seed1 = seed2 ^ seed2 >>> 9;
            seed2 = seed3 + ( seed3 << 3 ) | 0;
            seed3 = ( seed3 << 21 | seed3 >>> 11 );
            seed4 = seed4 + 1 | 0;
            t = t + seed4 | 0;
            seed3 = seed3 + t | 0;
            return ( t >>> 0 ) / 4294967296;
        };
    }

}
