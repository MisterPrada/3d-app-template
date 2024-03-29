const isSSR = typeof window > "u"

const detectUA = function () {
    function o( e ) {
        this.userAgent = e || ( !isSSR && window.navigator ? window.navigator.userAgent : "" ), this.isAndroidDevice = !/like android/i.test( this.userAgent ) && /android/i.test( this.userAgent ), this.iOSDevice = this.match( 1, /(iphone|ipod|ipad)/i ).toLowerCase(), !isSSR && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 2 && !window.MSStream && ( this.iOSDevice = "ipad" )
    }

    return o.prototype.match = function ( e, t ) {
        var i = this.userAgent.match( t );
        return i && i.length > 1 && i[ e ] || ""
    }, Object.defineProperty( o.prototype, "isMobile", {
        get: function () {
            return !this.isTablet && ( /[^-]mobi/i.test( this.userAgent ) || this.iOSDevice === "iphone" || this.iOSDevice === "ipod" || this.isAndroidDevice || /nexus\s*[0-6]\s*/i.test( this.userAgent ) )
        }, enumerable: !1, configurable: !0
    } ), Object.defineProperty( o.prototype, "isTablet", {
        get: function () {
            return /tablet/i.test( this.userAgent ) && !/tablet pc/i.test( this.userAgent ) || this.iOSDevice === "ipad" || this.isAndroidDevice && !/[^-]mobi/i.test( this.userAgent ) || !/nexus\s*[0-6]\s*/i.test( this.userAgent ) && /nexus\s*[0-9]+/i.test( this.userAgent )
        }, enumerable: !1, configurable: !0
    } ), Object.defineProperty( o.prototype, "isDesktop", {
        get: function () {
            return !this.isMobile && !this.isTablet
        }, enumerable: !1, configurable: !0
    } ), Object.defineProperty( o.prototype, "isMacOS", {
        get: function () {
            return /macintosh/i.test( this.userAgent ) && {
                version: this.match( 1, /mac os x (\d+(\.?_?\d+)+)/i ).replace( /[_\s]/g, "." ).split( "." ).map( function ( e ) {
                    return e
                } )[ 1 ]
            }
        }, enumerable: !1, configurable: !0
    } ), Object.defineProperty( o.prototype, "isWindows", {
        get: function () {
            return /windows /i.test( this.userAgent ) && { version: this.match( 1, /Windows ((NT|XP)( \d\d?.\d)?)/i ) }
        }, enumerable: !1, configurable: !0
    } ), Object.defineProperty( o.prototype, "isiOS", {
        get: function () {
            return !!this.iOSDevice && { version: this.match( 1, /os (\d+([_\s]\d+)*) like mac os x/i ).replace( /[_\s]/g, "." ) || this.match( 1, /version\/(\d+(\.\d+)?)/i ) }
        }, enumerable: !1, configurable: !0
    } ), Object.defineProperty( o.prototype, "isAndroid", {
        get: function () {
            return this.isAndroidDevice && { version: this.match( 1, /android[ \/-](\d+(\.\d+)*)/i ) }
        }, enumerable: !1, configurable: !0
    } ), Object.defineProperty( o.prototype, "browser", {
        get: function () {
            var e = this.match( 1, /version\/(\d+(\.\d+)?)/i );
            return /opera/i.test( this.userAgent ) ? {
                name: "Opera",
                version: e || this.match( 1, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i )
            } : /opr\/|opios/i.test( this.userAgent ) ? {
                name: "Opera",
                version: this.match( 1, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i ) || e
            } : /SamsungBrowser/i.test( this.userAgent ) ? {
                name: "Samsung Internet for Android",
                version: e || this.match( 1, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i )
            } : /yabrowser/i.test( this.userAgent ) ? {
                name: "Yandex Browser",
                version: e || this.match( 1, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i )
            } : /ucbrowser/i.test( this.userAgent ) ? {
                name: "UC Browser",
                version: this.match( 1, /(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i )
            } : /msie|trident/i.test( this.userAgent ) ? {
                name: "Internet Explorer",
                version: this.match( 1, /(?:msie |rv:)(\d+(\.\d+)?)/i )
            } : /(edge|edgios|edga|edg)/i.test( this.userAgent ) ? {
                name: "Microsoft Edge",
                version: this.match( 2, /(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i )
            } : /firefox|iceweasel|fxios/i.test( this.userAgent ) ? {
                name: "Firefox",
                version: this.match( 1, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i )
            } : /chromium/i.test( this.userAgent ) ? {
                name: "Chromium",
                version: this.match( 1, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i ) || e
            } : /chrome|crios|crmo/i.test( this.userAgent ) ? {
                name: "Chrome",
                version: this.match( 1, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i )
            } : /safari|applewebkit/i.test( this.userAgent ) ? {
                name: "Safari",
                version: e
            } : { name: this.match( 1, /^(.*)\/(.*) / ), version: this.match( 2, /^(.*)\/(.*) / ) }
        }, enumerable: !1, configurable: !0
    } ), o
}();

export default new detectUA()
