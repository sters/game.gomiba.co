//@ts-check
import { DoubleClickEvent } from "../../event/DoubleClickEvent.js";
import { HandlingChangedEvent } from "../../event/HandlingChangedEvent.js";
import { Bodies, Body } from "../../util/MatterExporter.js";
import { mergeObject } from "../../util/util.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Machine } from "./Machine.js";

/**
 * It's demo for mousemovable
 * @export
 * @class MouseMovableMachine
 * @extends {Machine}
 */
export class MouseMovableMachine extends Machine {
    /**
     *Creates an instance of MouseMovableMachine.
     * @param {WorldManager} worldManager
     * @param {number} x
     * @param {number} y
     * @memberof MouseMovableMachine
     */
    constructor(worldManager, x, y) {
        super(worldManager);
        this.mouseMovable.enable = true;
        this.mouseMovable.staticMode = true;
        this.doubleClickable.enable = true;
        this.debug = false;

        const thickness = 30;
        const renderOption = {
            fillStyle: "#AA0",
            strokeStyle: "",
        };

        this.fillDefault = "#AA0";
        this.fillHandling = "#666";

        this.registerBody(
            Bodies.rectangle(0, 0, thickness, thickness, {
                render: renderOption,
                mass: Machine.defaultMass,
                frictionAir: 0.015,
                label: "MouseMovableMachine",
                restitution: 0,
            })
        );
        Body.setPosition(this.body, { x: x, y: y });
        this.worldManager.addObject(this);
    }

    /**
     * @param {HandlingChangedEvent} e
     * @returns
     * @memberof MouseMovableMachine
     */
    onHandlingChanged(e) {
        this.body.render.fillStyle = e.detail.isHandling ? this.fillHandling : this.fillDefault;
    }

    /**
     * @param {DoubleClickEvent} e
     * @memberof MouseMovableMachine
     */
    onDoubleClick(e) {
        this.mouseMovable.staticMode = !this.mouseMovable.staticMode;
    }

    /**
     * @return {*}
     * @memberof MouseMovableMachine
     */
    onExport() {
        return mergeObject(super.onExport(), {
            staticMode: this.mouseMovable.staticMode,
        });
    }

    /**
     * @param {WorldManager} worldManager
     * @param {*} data
     * @return {Object}
     * @memberof Object
     */
    static onImport(worldManager, data) {
        try {
            const obj = new this(
                worldManager,
                data.position.x,
                data.position.y,
            );
            if (obj.exportable.onImport(data) === false) {
                worldManager.removeObject(this);
                return null;
            }
            obj.mouseMovable.staticMode = data.staticMode;
            return obj;
        } catch (e) {
            console.error("failed to import", data, e);
            return null;
        }
    }
}
