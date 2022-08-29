import { ctx } from "./Sudoku/GameField/main.js";

 /**
 * Defines a 2D Canvas Object with default position
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 * @param {Number} width width of the object
 * @param {Number} height height of the height
 */
export class CanvasObj {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        /**
         * Checks if your point is within this object
         * @param {*} pointX
         * @param {*} pointY
         * @returns whether or not specified coordinate hit the shape
         */
        this.inShape = (pointX, pointY) => {
            return pointX >= x && pointX <= x + width &&
                pointY >= y && pointY <= y + height;
        };
    }
}


 /**
 * Extends a Canvas Class, additionally having 
 * render properties with custom default style
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 * @param {Number} width width of the object
 * @param {Number} height height of the object
 */
export class StyleCanvasObj extends CanvasObj{
    constructor(x, y, width, height) {
        super(x, y, width, height);
    };
    /**
     * Fills up the current canvas object with custom style
     * @param {CanvasRenderingContext2D} context the 2d context to paint with
     * @param {String} style the style of the fill
     */
    fill = (context, style = undefined) => {
        if(style == undefined) {
            context.clearRect(this.x, this.y, this.width, this.height);
            return;
        }
        this.saveStyle(context);
        context.fillStyle = style;
        context.fillRect(this.x, this.y, this.width, this.height);
        this.releaseStyle(context);
    };
    /**
     * Outlines the current canvas object with custom style
     * @param {CanvasRenderingContext2D}
     * @param {String} style 
     */
    outline = (context, style = undefined) => {
        if(style == undefined) {
            context.clearRect(this.x, this.y, this.width, this.height);
            return;
        }
        this.saveStyle(context);
        context.strokeStyle = style;
        context.strokeRect(this.x, this.y, this.width, this.height);
        this.releaseStyle(context);
    }
    saveStyle = (context) => this.savedStyle = context.fillStyle;
    releaseStyle = (context) => context.fillStyle = this.savedStyle;
}

/**
 * Rescales the canvas according to the window
 * @param {Object} canvas the canvas to manipulate
 */
export function rescaleCanvas(canvas) {
    const scaleX = canvas.clientWidth / canvas.clientWidth;
    const scaleY = canvas.clientHeight / canvas.height;
    console.log(`scaling x: ${scaleX} | y: ${scaleY}`);
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    ctx.scale(scaleX, scaleY);
}