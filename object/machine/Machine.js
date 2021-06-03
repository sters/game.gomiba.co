//@ts-check
import { WorldManager } from "../../world/WorldManager.js";
import { Object } from "../Object.js";

/**
 * @export
 * @class Machine
 */
export class Machine extends Object {
    /**
     * @param {WorldManager} worldManager
     */
    constructor(worldManager) {
        super(worldManager);
        this.running = false;
    }

    static defaultMass = 2;
}
