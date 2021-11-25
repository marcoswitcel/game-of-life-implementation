//@ts-check

/**
 * @typedef {number} iRGBAColor
 */

/**
 * @param {number} r Entre 0 e 255 (integer)
 * @param {number} g Entre 0 e 255 (integer)
 * @param {number} b Entre 0 e 255 (integer)
 * @param {number?} a Entre 0 e 1 (flot)
 * 
 * @return {RGBA}
 */
export function rgba(r, g, b, a = 1) {
    return new RGBA(r, g, b, a);
}

export class RGBA {
    /**
     * @param {number} r Entre 0 e 255 (integer)
     * @param {number} g Entre 0 e 255 (integer)
     * @param {number} b Entre 0 e 255 (integer)
     * @param {number?} a Entre 0 e 1 (flot)
     */
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * 
     * @param {string} colorString formato válido `#FF0000`
     * @returns {RGBA}
     */
    static fromString(colorString) {
        if (!colorString.startsWith('#')) {
            throw new TypeError('A String provida precisa ser do formator correto "#FFFFFF"');
        }

        const r = parseInt(colorString.substring(1,3), 16);
        const g = parseInt(colorString.substring(3,5), 16);
        const b = parseInt(colorString.substring(5,7), 16);

        return new RGBA(r,g,b);
    }

    toHexString() {
        const r = ('0'+this.r.toString(16)).slice(-2);
        const g = ('0'+this.g.toString(16)).slice(-2);
        const b = ('0'+this.b.toString(16)).slice(-2);
        return '#' + r + g + b;
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    get irgba() {
        const a = (255 * this.a) | 0;
        return irgba(this.r, this.g, this.b, a);
    }
}

/**
 * @param {Number} r 
 * @param {Number} g 
 * @param {Number} b 
 * @param {Number} a 
 * 
 * @returns {iRGBAColor}
 */
export function irgba(r, g, b, a) {

    return (((a << 8) + b << 8) + g << 8) + r ;
}