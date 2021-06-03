//@ts-check
import { Bodies } from "../util/MatterExporter.js";
import { getImagePath } from "../util/util.js";
import { WorldManager } from "../world/WorldManager.js";
import { Object } from "./Object.js";

/**
 * @export
 * @class Trash
 */
export class Trash extends Object {
    /**
     * @param {WorldManager} worldManager
     * @param {number} x
     * @param {number} y
     */
    constructor(worldManager, x, y) {
        super(worldManager);

        // NOTE: This object must non-mouseMovable. only matter-js handler.

        this.registerBody(
            Bodies.circle(
                x,
                y,
                15,
                {
                    density: 0.0005,
                    frictionAir: 0.01,
                    restitution: 0.5,
                    friction: 0.1,
                    render: {
                        sprite: {
                            texture: getImagePath('img/gomi.png'),
                        },
                    },
                    label: "Trash",
                }
            )
        );
        this.worldManager.addObject(this);
    }

    /**
     * @param {WorldManager} worldManager
     * @param {*} data
     * @return {Object}
     * @memberof Object
     */
    static onImport(worldManager, data) {
        const obj = new this(worldManager, data.position.x, data.position.y);
        if (obj.exportable.onImport(data) === false) {
            worldManager.removeObject(this);
            return null;
        }
        return obj;
    }
}
