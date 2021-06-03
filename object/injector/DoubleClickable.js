//@ts-check

import { DoubleClickEvent } from "../../event/DoubleClickEvent.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Object } from "../Object.js";

export class DoubleClickable {

    /**
     *Creates an instance of DoubleClickable.
     * @param {WorldManager} worldManager
     * @param {Object} obj
     * @memberof DoubleClickable
     */
    constructor(worldManager, obj) {
        /** @var {Boolean} enable double click event */
        this.enable = false;
        /** @var {number|null} keep latest mouse down time for detect double click */
        this.latestMouseDownMs = null;
        /** @var {number|null} detect double click wait */
        this.doubleClickMsBorder = 300;

        this.worldManager = worldManager;
        this.object = obj;
    }

    onMousedown() {
        if (!this.enable) {
            return;
        }

        const t = (new Date).getTime();
        if (t > (this.latestMouseDownMs + this.doubleClickMsBorder)) {
            this.latestMouseDownMs = t;
        } else {
            this.worldManager.dispatchSpecificBodyEvent(this.object, new DoubleClickEvent(this.object));
        }
    }
}
