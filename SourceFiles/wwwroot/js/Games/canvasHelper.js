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
         * @param {Object} shape with
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
 * render properties with custom default color
 * @param {Number} size size (width and height)
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 * @param {String} outlineColor default outline color
 * @param {String} fillColor default fill color
 */
export class ColorCanvasObj extends CanvasObj{
    constructor(x, y, size, outlineColor, fillColor) {
        super(x, y, size);
        this.fillColor = fillColor;
        this.outlineColor = outlineColor;
        this.linesize = 5;
        /**
         * Fills up the current canvas object with color
         * @param {Object} context the context to paint with
         * @param {String} color the color of the fill
         */
        this.fill = (context, color = this.fillColor) => {
            context.fillStyle = color;
            context.fillRect(this.x, this.y, this.size, this.size);
        };
        /**
         * Outlines the 
         * @param {String} color 
         */
        this.outline = (context, color = this.outlineColor) => {
            context.linesize = this.linesize;
            context.strokeStyle = color;
            context.strokeRect(this.x, this.y, this.size, this.size);
        };
    }
}

/**
 * Resizes the canvas according to the window
 * @oaram {Object} canvas the canvas to manipulate
 * @param {funciton} rescale callback to rescale the canvas gameInfo
 */
export function resize(canvas, rescale) {
    canvas.height = canvas.offsetHeight;
    canvas.size = canvas.offsetsize;
    rescale();
    console.log(`canvas height: ${canvas.height}\ncanvas size: ${canvas.size}`);
}