//@ts-check
import { Bodies, Body, Query, Vector } from "../../util/MatterExporter.js";
import { getBodyFitSprite } from "../../util/MatterUtil.js";
import { fpsMs, mergeObject } from "../../util/util.js";
import { WaitingForPromise } from "../../util/WaitingForPromise.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Machine } from "./Machine.js";

/**
 * @export
 * @class BlowerMachine
 * @extends {Machine}
 */
export class BlowerMachine extends Machine {
    /**
     *Creates an instance of BlowerMachine.
     * @param {WorldManager} worldManager
     * @param {number} x
     * @param {number} y
     * @param {number} tickMs
     * @param {Vector} force
     * @memberof BlowerMachine
     */
    constructor(worldManager, x, y, tickMs, force) {
        super(worldManager);
        this.mouseMovable.enable = true;
        this.mouseMovable.staticMode = true;

        this.rectSize = 40;
        this.body = null;
        this.tickMs = tickMs || 250;
        this.ticker = 0;
        this.force = force || Vector.create(0.005, 0);
        this.label = "Blower";

        (async () => {
            this.registerBody(
                Bodies.rectangle(
                    x,
                    y,
                    this.rectSize,
                    this.rectSize,
                    {
                        render: {
                            sprite: await getBodyFitSprite(
                                "img/hot.png",
                                this.rectSize,
                                this.rectSize,
                                { keepAspect: true }
                            ),
                        },
                        label: this.label,
                        mass: Machine.defaultMass,
                    },
                )
            );
            this.worldManager.addObject(this);
        })();
    }

    /**
     * @memberof BlowerMachine
     */
    beforeUpdate() {
        super.beforeUpdate();
        if (this.body === null) {
            return;
        }

        if (!this.checkTicker()) {
            return;
        }

        const collisions = Query.ray(
            this.worldManager.getAllBodies(),
            Vector.create(
                this.body.position.x + this.rectSize,
                this.body.position.y + this.rectSize / 2,
            ),
            Vector.create(
                this.body.position.x + this.rectSize + 100,
                this.body.position.y + this.rectSize / 2,
            ),
            this.rectSize
        );
        collisions.forEach((c) => {
            Body.applyForce(
                c.parentA,
                c.parentA.position,
                this.force
            );
        });
    }

    /**
     * @returns {boolean}
     * @memberof BlowerMachine
     */
    checkTicker() {
        this.ticker++;
        if (this.ticker <= fpsMs(this.tickMs) || this.mouseMovable.isHandling) {
            return false;
        }
        this.ticker = 0;
        return true;
    }

    /**
     * @return {*}
     * @memberof BlowerMachine
     */
    onExport() {
        return mergeObject(super.onExport(), {
            tickMs: this.tickMs,
            force: this.force,
        });
    }

    /**
     * @param {WorldManager} worldManager
     * @param {*} data
     * @return {Object}
     * @memberof Object
     */
    static onImport(worldManager, data) {
        const obj = new this(
            worldManager,
            data.position.x,
            data.position.y,
            data.tickMs,
            data.force
        );
        (async () => {
            await WaitingForPromise.fn(() => obj.body !== null);
            try {
                if (obj.exportable.onImport(data) === false) {
                    worldManager.removeObject(this);
                    return null;
                }
            } catch (e) {
                console.error("failed to import", data, e);
            }
        })();
        return obj;
    }
}
