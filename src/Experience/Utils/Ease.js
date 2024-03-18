export default class Ease {
    quadIn(e) {
        return e * e
    }
    quadOut(e) {
        return e * (2 - e)
    }
    quadOutIn(e) {
        return e < .5 ? this.quadOut(e + e) * .5 : this.quadIn(e + e - 1) * .5 + .5
    }
    quadInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e : -.5 * (--e * (e - 2) - 1)
    }
    cubicIn(e) {
        return e * e * e
    }
    cubicOut(e) {
        return --e * e * e + 1
    }
    cubicOutIn(e) {
        return e < .5 ? this.cubicOut(e + e) * .5 : this.cubicIn(e + e - 1) * .5 + .5
    }
    cubicInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2)
    }
    quartIn(e) {
        return e * e * e * e
    }
    quartOut(e) {
        return 1 - --e * e * e * e
    }
    quartOutIn(e) {
        return e < .5 ? this.quartOut(e + e) * .5 : this.quartIn(e + e - 1) * .5 + .5
    }
    quartInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e * e * e : -.5 * ((e -= 2) * e * e * e - 2)
    }
    quintIn(e) {
        return e * e * e * e * e
    }
    quintOut(e) {
        return --e * e * e * e * e + 1
    }
    quintOutIn(e) {
        return e < .5 ? this.quintOut(e + e) * .5 : this.quintIn(e + e - 1) * .5 + .5
    }
    quintInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2)
    }
    sineIn(e) {
        return 1 - Math.cos(e * Math.PI / 2)
    }
    sineOut(e) {
        return Math.sin(e * Math.PI / 2)
    }
    sineOutIn(e) {
        return e < .5 ? this.sineOut(e + e) * .5 : this.sineIn(e + e - 1) * .5 + .5
    }
    sineInOut(e) {
        return .5 * (1 - Math.cos(Math.PI * e))
    }
    expoIn(e) {
        return e === 0 ? 0 : Math.pow(1024, e - 1)
    }
    expoOut(e) {
        return e === 1 ? 1 : 1 - Math.pow(2, -10 * e)
    }
    expoOutIn(e) {
        return e < .5 ? this.expoOut(e + e) * .5 : this.expoIn(e + e - 1) * .5 + .5
    }
    expoInOut(e) {
        return e === 0 ? 0 : e === 1 ? 1 : (e *= 2) < 1 ? .5 * Math.pow(1024, e - 1) : .5 * (-Math.pow(2, -10 * (e - 1)) + 2)
    }
    circIn(e) {
        return 1 - Math.sqrt(1 - e * e)
    }
    circOut(e) {
        return Math.sqrt(1 - --e * e)
    }
    circOutIn(e) {
        return e < .5 ? this.circOut(e + e) * .5 : this.circIn(e + e - 1) * .5 + .5
    }
    circInOut(e) {
        return (e *= 2) < 1 ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
    }
    elasticIn(e) {
        let t, r = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1,
            t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI),
            -(r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n)))
    }
    elasticOut(e) {
        let t, r = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1,
            t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI),
        r * Math.pow(2, -10 * e) * Math.sin((e - t) * 2 * Math.PI / n) + 1)
    }
    elasticOutIn(e) {
        return e < .5 ? this.elasticOut(e + e) * .5 : this.elasticIn(e + e - 1) * .5 + .5
    }
    elasticInOut(e) {
        let t, r = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1,
            t = n / 4) : t = n * Math.asin(1 / r) / (2 * Math.PI),
            (e *= 2) < 1 ? -.5 * r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n) : r * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n) * .5 + 1)
    }
    backIn(e) {
        let t = 1.70158;
        return e * e * ((t + 1) * e - t)
    }
    backOut(e) {
        let t = 1.70158;
        return --e * e * ((t + 1) * e + t) + 1
    }
    backOutIn(e) {
        return e < .5 ? this.backOut(e + e) * .5 : this.backIn(e + e - 1) * .5 + .5
    }
    backInOut(e) {
        let t = 2.5949095;
        return (e *= 2) < 1 ? .5 * e * e * ((t + 1) * e - t) : .5 * ((e -= 2) * e * ((t + 1) * e + t) + 2)
    }
    bounceIn(e) {
        return 1 - this.bounceOut(1 - e)
    }
    bounceOut(e) {
        return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
    }
    bounceOutIn(e) {
        return e < .5 ? this.bounceOut(e + e) * .5 : this.bounceIn(e + e - 1) * .5 + .5
    }
    bounceInOut(e) {
        return e < .5 ? this.bounceIn(e * 2) * .5 : this.bounceOut(e * 2 - 1) * .5 + .5
    }
    lusion(e) {
        return this.cubicBezier(e, .35, 0, 0, 1)
    }
    cubicBezier(e, t, r, n, o) {
        if (e <= 0)
            return 0;
        if (e >= 1)
            return 1;
        if (t === r && n === o)
            return e;
        const l = (B,D,q,k)=>1 / (3 * D * B * B + 2 * q * B + k)
            , c = (B,D,q,k,J)=>D * (B * B * B) + q * (B * B) + k * B + J
            , u = (B,D,q,k,J)=>{
                let U = B * B;
                return D * (U * B) + q * U + k * B + J
            }
        ;
        let f = 0, p = 0, g = t, v = r, _ = n, w = o, S = 1, b = 1, C = S - 3 * _ + 3 * g - f, R = 3 * _ - 6 * g + 3 * f, T = 3 * g - 3 * f, M = f, P = b - 3 * w + 3 * v - p, I = 3 * w - 6 * v + 3 * p, V = 3 * v - 3 * p, A = p, O = e, W, Q, H;
        for (W = 0; W < 100; W++)
            Q = c(O, C, R, T, M),
                H = l(O, C, R, T),
            H === 1 / 0 && (H = e),
                O -= (Q - e) * H,
                O = Math.min(Math.max(O, 0), 1);
        return u(O, P, I, V, A)
    }
}
