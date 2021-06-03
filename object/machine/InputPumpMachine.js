//@ts-check
import { DoTrashEvent } from "../../event/DoTrashEvent.js";
import { WorldManager } from "../../world/WorldManager.js";
import { PumpMachine } from "./PumpMachine.js";

/**
 * @export
 * @class InputPumpMachine
 * @extends {PumpMachine}
 */
export class InputPumpMachine extends PumpMachine {
    /**
     *Creates an instance of InputPumpMachine.
     * @param {WorldManager} worldManager
     * @param {number} x
     * @param {number} y
     * @param {number} tickMs
     * @memberof InputPumpMachine
     */
    constructor(worldManager, x, y, tickMs) {
        super(worldManager, x, y, tickMs);

        this.label = "Input Pump";
        this.createBody(x, y, {
            fillStyle: "#00A",
            strokeStyle: "",
        });
    }

    /**
     * @memberof InputPumpMachine
     */
    beforeUpdate() {
        super.beforeUpdate();
        if (this.body === null) {
            return;
        }

        if (!this.checkTicker()) {
            return;
        }

        const w = this.body.bounds.max.x - this.body.bounds.min.x;
        const h = this.body.bounds.max.y - this.body.bounds.min.y;
        this.worldManager.dispatchEvent(
            new DoTrashEvent(
                {
                    x: this.body.bounds.min.x,
                    y: this.body.bounds.min.y - h / 2,
                },
                {
                    x: this.body.bounds.max.x + w,
                    y: this.body.bounds.max.y + h / 2,
                }
            )
        );
    }
}
