//@ts-check
import { deg2rad } from "../../util/util.js";
import { TrashboxManager } from "../../world/TrashboxManager.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Machine } from "./Machine.js";

/**
 * @export
 * @class TrashboxVomitter
 */
export class TrashboxVomitter extends Machine {
    /**
     * @param {WorldManager} worldManager
     * @param {TrashboxManager} trashboxManager
     */
    constructor(worldManager, trashboxManager) {
        super(worldManager);

        this.trashboxManager = trashboxManager;

        this.angle = -90;
        this.power = 25;

        const angleRange = 60;
        const defaultAngle = -90;
        this.angleMax = defaultAngle + angleRange;
        this.angleMin = defaultAngle - angleRange;

        this.powerMax = 50;
        this.powerMin = 5;
    }

    /**
     * @memberof Vomitter
     */
    reset() {
        this.angle = -90;
        this.power = 25;
    }

    /**
     * @memberof Vomitter
     */
    afterRender() {
        super.afterRender();

        if (this.angle > this.angleMax) {
            this.angle = this.angleMax;
        }

        if (this.angle < this.angleMin) {
            this.angle = this.angleMin;
        }

        if (this.power > this.powerMax) {
            this.power = this.powerMax;
        }
        if (this.power < this.powerMin) {
            this.power = this.powerMin;
        }
    }

    /**
     * @returns
     * @memberof Vomitter
     */
    calculateAngleToPosition() {
        const radAngle = deg2rad(this.angle);
        return {
            x: Math.cos(radAngle),
            y: Math.sin(radAngle),
        };
    }

    /**
     * @memberof Vomitter
     */
    vomit() {
        const trash = this.trashboxManager.createNewTrash(null, null);
        const forceDirection = this.calculateAngleToPosition();
        trash.body.force.x += forceDirection.x * (this.power / 1000);
        trash.body.force.y += forceDirection.y * (this.power / 1000);
    }
}
