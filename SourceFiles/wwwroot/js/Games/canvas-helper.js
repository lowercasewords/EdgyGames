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
export class ImageCanvasObj extends CanvasObj{
    constructor(x, y, size, image) {
        super(x, y, size);
        this.image = image;
    }
    setImage = (image) => {
        this.image = image;
    }
    drawImage = () => {

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
        this.lineWidth = 5;
        this.fill = (context, color = this.fillColor) => {
            context.fillStyle = color;
            context.fillRect(this.x, this.y, this.size, this.size);
        };
        /**
         * Outlines the 
         * @param {String} color 
         */
        this.outline = (context, color = this.outlineColor) => {
            context.lineWidth = this.lineWidth;
            context.strokeStyle = color;
            context.strokeRect(this.x, this.y, this.size, this.size);
        };
    }
}

// export window.onresize('resize') 