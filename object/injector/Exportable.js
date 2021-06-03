//@ts-check

import { Body } from "../../util/MatterExporter.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Object } from "../Object.js";

/**
 * Exportable provides export state for any object
 */
export class Exportable {
    /**
     * Creates an instance of Exportable.
     * @param {WorldManager} worldManager
     * @param {Object} obj
     * @memberof Exportable
     */
    constructor(worldManager, obj) {
        this.worldManager = worldManager;
        this.object = obj;
    }

    /**
     * Export state
     * @return {*}
     * @memberof Exportable
     */
    onExport() {
        return {
            position: this.object.body.position,
            angle: this.object.body.angle,
        };
    }

    /**
     * @param {*} data
     * @return {boolean}
     * @memberof Exportable
     */
    onImport(data) {
        try {
            Body.setPosition(this.object.body, data.position);
            Body.setAngle(this.object.body, this.object.body.angle + data.angle);
            return true;
        } catch (e) {
            console.log("failed to import", e, data);
            return false;
        }
    }
}
