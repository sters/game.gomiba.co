//@ts-check
import { VomitEvent } from "../../event/VomitEvent.js";
import { WorldManager } from "../../world/WorldManager.js";
import { PumpMachine } from "./PumpMachine.js";

/**
 * @export
 * @class OutputPumpMachine
 * @extends {PumpMachine}
 */
export class OutputPumpMachine extends PumpMachine {
    /**
     *Creates an instance of OutputPumpMachine.
     * @param {WorldManager} worldManager
     * @param {number} x
     * @param {number} y
     * @param {number} tickMs
     * @memberof OutputPumpMachine
     */
    constructor(worldManager, x, y, tickMs) {
        super(worldManager, x, y, tickMs);

        this.debug = false;
        this.label = "Output Pump";
        this.createBody(x, y, {
            fillStyle: "#A00",
            strokeStyle: "",
        })
    }

    beforeUpdate() {
        super.beforeUpdate();
        if (this.body === null) {
            return;
        }

        if (!this.checkTicker()) {
            return;
        }

        // If add (this.rectSize / 2) to x, it's correctly.
        // but lacked value and make physics moving.
        this.worldManager.dispatchEvent(
            new VomitEvent(
                this.body.position.x + this.pumpSize.width,
                this.body.position.y,
            )
        );
    }
}
