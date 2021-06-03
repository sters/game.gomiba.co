//@ts-check
import { DoubleClickEvent } from "../../event/DoubleClickEvent.js";
import { Bodies } from "../../util/MatterExporter.js";
import { getBodyFitSprite } from "../../util/MatterUtil.js";
import { fpsMs, mergeObject } from "../../util/util.js";
import { WaitingForPromise } from "../../util/WaitingForPromise.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Machine } from "./Machine.js";

/**
 * @export
 * @class PumpMachine
 * @extends {Machine}
 */
export class PumpMachine extends Machine {
    /**
     *Creates an instance of PumpMachine.
     * @param {WorldManager} worldManager
     * @param {number} x
     * @param {number} y
     * @param {number} tickMs
     * @memberof PumpMachine
     */
    constructor(worldManager, x, y, tickMs) {
        super(worldManager);
        this.mouseMovable.enable = true;
        this.mouseMovable.staticMode = true;
        this.doubleClickable.enable = true;

        this.rectSize = 40;
        this.pumpSize = {
            width: 20,
            height: 15,
        };
        this.body = null;
        this.tickMs = tickMs || 5000;
        this.ticker = 0;
        this.tickStop = false;
        this.label = "Pump";
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Object} renderOption
     * @returns
     * @memberof PumpMachine
     */
    createBody(x, y, renderOption) {
        if (this.body != null) {
            return;
        }

        (async () => {
            this.registerBody(
                Bodies.rectangle(
                    x,
                    y,
                    this.rectSize,
                    this.rectSize,
                    {
                        render: mergeObject(renderOption, {
                            sprite: await getBodyFitSprite(
                                "img/pump.png",
                                this.rectSize,
                                this.rectSize,
                                { keepAspect: true }
                            ),
                        }),
                        label: this.label,
                        mass: Machine.defaultMass,
                    },
                )
            );
            this.worldManager.addObject(this);
        })();
    }

    /**
     * @returns {boolean}
     * @memberof PumpMachine
     */
    checkTicker() {
        this.ticker++;
        if (this.ticker <= fpsMs(this.tickMs) || this.mouseMovable.isHandling || this.tickStop) {
            return false;
        }
        this.ticker = 0;
        return true;
    }

    /**
     * @param {DoubleClickEvent} e
     * @memberof PumpMachine
     */
    onDoubleClick(e) {
        this.tickStop = !this.tickStop;
        if (this.tickStop) {
            this.body.render.opacity = 0.3;
        } else {
            this.body.render.opacity = 1;
        }
    }

    /**
     * @return {*}
     * @memberof PumpMachine
     */
    onExport() {
        return mergeObject(super.onExport(), {
            tickMs: this.tickMs,
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
            data.tickMs
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
