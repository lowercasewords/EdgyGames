 /**
 * Defines a 2D Canvas Object with default position
 * @param {Number} width width (and height)
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 */
export class CanvasObj {
    constructor(x, y, width) {
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.width = parseInt(width);

        /**
         * Checks if your point is within this object
         * @param {Object} shape with
         * @param {*} pointX
         * @param {*} pointY
         * @returns whether or not specified coordinate hit the shape
         */
        this.inShape = (pointX, pointY) => {
            return pointX >= x && pointX <= x + width &&
                pointY >= y && pointY <= y + width;
        };
    }
}
 /**
 * Extends a Canvas Class, additionally having 
 * render properties with custom default color
 * @param {Number} width width (and height)
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 * @param {String} outlineColor default outline color
 * @param {String} fillColor default fill color
 */
export class ColorCanvasObj extends CanvasObj{
    constructor(x, y, width, outlineColor, fillColor) {
        super(x, y, width);
        this.fillColor = fillColor;
        this.outlineColor = outlineColor;
        this.lineWidth = 5;
        this.fill = (context, color = this.fillColor) => {
            context.fillStyle = color;
            context.fillRect(this.x, this.y, this.width, this.width);
        };
        /**
         * Outlines the 
         * @param {String} color 
         */
        this.outline = (context, color = this.outlineColor) => {
            context.lineWidth = this.lineWidth;
            context.strokeStyle = color;
            context.strokeRect(this.x, this.y, this.width, this.width);
        };
    }
}

/**
 * Resizes the canvas according
 * @param {funciton} rescale callback to rescale the canvas map
 */
export function resize(rescale) {
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;
    rescale();
    console.log("resize done");
}