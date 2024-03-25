export default class Ease   {
    quadIn(e) {
        return e * e
    }

    quadOut(e) {
        return e * (2 - e)
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

    cubicInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2)
    }

    quartIn(e) {
        return e * e * e * e
    }

    quartOut(e) {
        return 1 - --e * e * e * e
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

    quintInOut(e) {
        return (e *= 2) < 1 ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2)
    }

    sineIn(e) {
        return 1 - Math.cos(e * Math.PI / 2)
    }

    sineOut(e) {
        return Math.sin(e * Math.PI / 2)
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

    expoInOut(e) {
        return e === 0 ? 0 : e === 1 ? 1 : (e *= 2) < 1 ? .5 * Math.pow(1024, e - 1) : .5 * (-Math.pow(2, -10 * (e - 1)) + 2)
    }

    circIn(e) {
        return 1 - Math.sqrt(1 - e * e)
    }

    circOut(e) {
        return Math.sqrt(1 - --e * e)
    }

    circInOut(e) {
        return (e *= 2) < 1 ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
    }

    elasticIn(e) {
        let t, i = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!i || i < 1 ? (i = 1, t = n / 4) : t = n * Math.asin(1 / i) / (2 * Math.PI), -(i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n)))
    }

    elasticOut(e) {
        let t, i = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!i || i < 1 ? (i = 1, t = n / 4) : t = n * Math.asin(1 / i) / (2 * Math.PI), i * Math.pow(2, -10 * e) * Math.sin((e - t) * 2 * Math.PI / n) + 1)
    }

    elasticInOut(e) {
        let t, i = .1, n = .4;
        return e === 0 ? 0 : e === 1 ? 1 : (!i || i < 1 ? (i = 1, t = n / 4) : t = n * Math.asin(1 / i) / (2 * Math.PI), (e *= 2) < 1 ? -.5 * i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n) : i * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / n) * .5 + 1)
    }

    backIn(e) {
        let t = 1.70158;
        return e * e * ((t + 1) * e - t)
    }

    backOut(e) {
        let t = 1.70158;
        return --e * e * ((t + 1) * e + t) + 1
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

    bounceInOut(e) {
        return e < .5 ? this.bounceIn(e * 2) * .5 : this.bounceOut(e * 2 - 1) * .5 + .5
    }

    cubicBezier(progress, startControlX, startControlY, endControlX, endControlY) {
        if (progress <= 0) return 0;
        if (progress >= 1) return 1;
        if (startControlX === startControlY && endControlX === endControlY) return progress;

        const derivative = (param, coeff1, coeff2, coeff3) => 1 / (3 * coeff1 * param * param + 2 * coeff2 * param + coeff3);
        const bezierValue = (param, coeff1, coeff2, coeff3, coeff4) => coeff1 * (param * param * param) + coeff2 * (param * param) + coeff3 * param + coeff4;
        const cubicBezierCalc = (param, coeff1, coeff2, coeff3, coeff4) => {
            let paramSquared = param * param;
            return coeff1 * (paramSquared * param) + coeff2 * paramSquared + coeff3 * param + coeff4;
        };

        let startX = 0, startY = 0, control1X = startControlX, control1Y = startControlY, control2X = endControlX, control2Y = endControlY;
        let endX = 1, endY = 1;
        let coeffAX = endX - 3 * control2X + 3 * control1X - startX, coeffBX = 3 * control2X - 6 * control1X + 3 * startX;
        let coeffCX = 3 * control1X - 3 * startX, coeffDX = startX;
        let coeffAY = endY - 3 * control2Y + 3 * control1Y - startY, coeffBY = 3 * control2Y - 6 * control1Y + 3 * startY;
        let coeffCY = 3 * control1Y - 3 * startY, coeffDY = startY;
        let currentProgress = progress, bezierResult, newDerivative, newProgress;

        for (let iteration = 0; iteration < 100; iteration++) {
            bezierResult = bezierValue(currentProgress, coeffAX, coeffBX, coeffCX, coeffDX);
            newDerivative = derivative(currentProgress, coeffAX, coeffBX, coeffCX);
            if (newDerivative === Infinity) newDerivative = progress;
            currentProgress -= (bezierResult - progress) * newDerivative;
            currentProgress = Math.min(Math.max(currentProgress, 0), 1);
        }

        return cubicBezierCalc(currentProgress, coeffAY, coeffBY, coeffCY, coeffDY);
    }

    // cubicBezier(e, t, i, n, r) {
    //     if (e <= 0) return 0;
    //     if (e >= 1) return 1;
    //     if (t === i && n === r) return e;
    //     const a = (O, B, G, J) => 1 / (3 * B * O * O + 2 * G * O + J),
    //         l = (O, B, G, J, Y) => B * (O * O * O) + G * (O * O) + J * O + Y, u = (O, B, G, J, Y) => {
    //             let W = O * O;
    //             return B * (W * O) + G * W + J * O + Y
    //         };
    //     let c = 0, f = 0, p = t, _ = i, v = n, S = r, g = 1, x = 1, M = g - 3 * v + 3 * p - c,
    //         A = 3 * v - 6 * p + 3 * c, b = 3 * p - 3 * c, w = c, C = x - 3 * S + 3 * _ - f, P = 3 * S - 6 * _ + 3 * f,
    //         E = 3 * _ - 3 * f, T = f, L = e, F, k, q;
    //     for (F = 0; F < 100; F++) k = l(L, M, A, b, w), q = a(L, M, A, b), q === 1 / 0 && (q = e), L -= (k - e) * q, L = Math.min(Math.max(L, 0), 1);
    //     return u(L, C, P, E, T)
    // }
}
