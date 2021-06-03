//@ts-check
import { Bodies, Matter, Vertices } from "./MatterExporter.js";
import { RequestAnimationFramePromise } from "./RequestAnimationFramePromise.js";
import { getImagePath, htmlToElement } from "./util.js";

/**
 * @export
 * @param {number} x
 * @param {number} y
 * @param {string} svg
 * @param {*} options
 * @returns
 */
export function CreateBodyFromSVG(x, y, svg, options) {
    const e = htmlToElement(svg);
    const verts = [];
    e.querySelectorAll("path").forEach((p) => {
        const v = Matter.Svg.pathToVertices(p, 30);
        verts.push(Vertices.scale(v, 0.2, 0.2));
    });
    // TODO: not working...?
    const b = Bodies.fromVertices(x, y, verts, options, true, 0.01, 1);
    return b;
}


/**
 * @export
 * @param {string} path
 * @param {number} bodyWidth
 * @param {number} bodyHeight
 * @param {{keepAspect?:boolean}} options
 * @returns {Promise<{texture:string, xScale:number, yScale:number}>}
 */
export function getBodyFitSprite(path, bodyWidth, bodyHeight, options) {
    return RequestAnimationFramePromise.do((resolve, reject) => {
        const e = document.createElement("img");
        e.src = getImagePath(path);

        e.addEventListener("error", () => {
            reject();
            e.remove();
        });

        e.addEventListener("load", () => {
            const w = bodyWidth / e.width;
            let h = bodyHeight / e.height;
            if (options["keepAspect"]) {
                h = w * (e.width / e.height);
            }

            resolve({
                texture: e.src,
                xScale: w,
                yScale: h,
            });
            e.remove();
        });

        e.style.position = "absolute";
        e.style.left = "-99999px";
        document.body.appendChild(e);
    });
}
