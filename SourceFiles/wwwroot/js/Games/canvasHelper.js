 /**
 * Defines a 2D Canvas Object with default position
 * @param {Number} size size (width and height)
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 */
export class CanvasObj {
    constructor(x, y, size) {
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.size = parseInt(size);

        /**
         * Checks if your point is within this object
         * @param {*} pointX
         * @param {*} pointY
         * @returns whether or not specified coordinate hit the shape
         */
        this.inShape = (pointX, pointY) => {
            return pointX >= x && pointX <= x + size &&
                pointY >= y && pointY <= y + size;
        };
    }
}
 /**
 * Extends a Canvas Class, additionally having 
 * render properties with custom default style
 * @param {Number} size size (width and height)
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 * @param {String} outlineStyle default outline style
 * @param {String} fillStyle default fill style
 */
export class StyleCanvasObj extends CanvasObj{
    constructor(x, y, size) {
        super(x, y, size);
    };
    /**
     * Fills up the current canvas object with custom style
     * @param {CanvasRenderingContext2D} context the 2d context to paint with
     * @param {String} style the style of the fill
     */
    fill = (context, style = undefined) => {
        if(style == undefined) {
            context.clearRect(this.x, this.y, this.size, this.size);
            return;
        }
        this.saveStyle(context);
        context.fillStyle = style;
        context.fillRect(this.x, this.y, this.size, this.size);
        this.releaseStyle(context);
    };
    /**
     * Outlines the current canvas object with custom style
     * @param {CanvasRenderingContext2D}
     * @param {String} style 
     */
    outline = (context, style = undefined) => {
        if(style == undefined) {
            context.clearRect(this.x, this.y, this.size, this.size);
            return;
        }
        this.saveStyle(context);
        context.strokeStyle = style;
        context.strokeRect(this.x, this.y, this.size, this.size);
        this.releaseStyle(context);
    }
    saveStyle = (context) => this.savedStyle = context.fillStyle;
    releaseStyle = (context) => context.fillStyle = this.savedStyle;
}

/**
 * Resizes the canvas according to the window
 * @oaram {Object} canvas the canvas to manipulate
 * @param {funciton} rescale callback to rescale the canvas gameInfo
 */
export function rescaleObj(canvas) {
    // ctx.scale()
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;
    console.log(`canvas height: ${canvas.height}\ncanvas width: ${canvas.width}`);
}