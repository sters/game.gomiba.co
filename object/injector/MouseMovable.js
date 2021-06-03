//@ts-check

import { HandlingChangedEvent } from "../../event/HandlingChangedEvent.js";
import { Body } from "../../util/MatterExporter.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Object } from "../Object.js";

/**
 * MouseMovable provides object moving behavior for statically that means no effected from world.
 */
export class MouseMovable {
    /**
     *Creates an instance of MouseMovable.
     * @param {WorldManager} worldManager
     * @param {Object} obj
     * @memberof MouseMovable
     */
    constructor(worldManager, obj) {
        /** @var {Boolean} enable mouse movable */
        this.enable = false;
        /** @var {Boolean} fixed on screen */
        this.staticMode = false;
        /** @var {Boolean} mouse handling now (dragging) */
        this.isHandling = false;
        /** @var {number|null} keep latest this.object.body.collisionFilter */
        this.latestCollisionFilter = null;

        this.worldManager = worldManager;
        this.object = obj;
    }

    registerBody() {
        this.latestCollisionFilter = this.object.body.collisionFilter.mask;
        if (this.staticMode) {
            Body.setStatic(this.object.body, this.staticMode);
            Body.setVelocity(this.object.body, { x: 0, y: 0 });
            Body.setAngularVelocity(this.object.body, 0);
        }
    }

    onMousedown() {
        if (!this.enable) {
            return;
        }
        if (this.isHandling) {
            return;
        }
        this.isHandling = true;
        this.latestCollisionFilter = this.object.body.collisionFilter.mask;
        if (this.staticMode) {
            Body.setStatic(this.object.body, !this.isHandling);
            Body.setVelocity(this.object.body, { x: 0, y: 0 });
            Body.setAngularVelocity(this.object.body, 0);
        }
        this.object.body.collisionFilter.mask = 0;
        this.worldManager.dispatchSpecificBodyEvent(this.object, new HandlingChangedEvent(this.object, this.isHandling));
    }

    onStartdrag() {
        if (!this.enable) {
            return;
        }
        if (this.isHandling) {
            return;
        }
        this.onMousedown();
    }

    onEnddrag() {
        this.isHandling = false;
        if (this.staticMode) {
            Body.setStatic(this.object.body, !this.isHandling);
            Body.setVelocity(this.object.body, { x: 0, y: 0 });
            Body.setAngularVelocity(this.object.body, 0);
        }
        this.object.body.collisionFilter.mask = this.latestCollisionFilter;
        this.worldManager.dispatchSpecificBodyEvent(this.object, new HandlingChangedEvent(this.object, this.isHandling));
    }
}
