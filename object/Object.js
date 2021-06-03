//@ts-check
import { WorldManager } from "../world/WorldManager.js";
import { DoubleClickable } from "./injector/DoubleClickable.js";
import { Exportable } from "./injector/Exportable.js";
import { MouseMovable } from "./injector/MouseMovable.js";

/**
 * @export
 * @class Object
 */
export class Object {
    /**
     * Creates an instance of Object.
     * @param {WorldManager} worldManager
     * @memberof Object
     */
    constructor(worldManager) {
        this.worldManager = worldManager;
        this.doubleClickable = new DoubleClickable(this.worldManager, this);
        this.mouseMovable = new MouseMovable(this.worldManager, this);
        this.exportable = new Exportable(this.worldManager, this);

        /** @var {Body} matter body for this object */
        this.body = null;

        /** @var {Boolean} debug flag */
        this.debug = false;
    }

    /**
     * @param {*} b
     */
    registerBody(b) {
        this.body = b;
        this.mouseMovable.registerBody();
    }

    /**
     * @returns
     * @memberof Object
     */
    getBody() {
        return this.body;
    }

    /**
     * @memberof Object
     */
    beforeUpdate() {
        // if (...) {
        //     // disable gravity for non-static obj
        //     const b = this.getBody();
        //     if (b !== null && b !== undefined) {
        //         if (noGravity) {
        //             const gravity = this.worldManager.world.gravity;
        //             Body.applyForce(b, b.position, {
        //                 x: -gravity.x * gravity.scale * b.mass,
        //                 y: -gravity.y * gravity.scale * b.mass
        //             });
        //         }
        //         if (noRotate) {
        //             Body.setAngularVelocity(b, 0);
        //             Body.setAngle(b, this.mouseMovable.noRotateAngle);
        //         }
        //     }
        // }

        // do nothing for any object. only specified.
    }

    /**
     * @memberof Machine
     */
    afterRender() {
        // do nothing for any object. only specified.
    }

    /**
     * @param {*} e
     * @returns
     * @memberof Object
     */
    onMousedown(e) {
        this.doubleClickable.onMousedown();
        this.mouseMovable.onMousedown();

        if (this.debug) {
            console.log(e, this);
        }
    }

    /**
     * @param {*} e
     * @returns
     * @memberof Object
     */
    onStartdrag(e) {
        this.mouseMovable.onStartdrag();

        if (this.debug) {
            console.log(e, this);
        }
    }

    /**
     * @param {*} e
     * @returns
     * @memberof Object
     */
    onEnddrag(e) {
        this.mouseMovable.onEnddrag();

        if (this.debug) {
            console.log(e, this);
        }
    }

    /**
     * @returns {*}
     * @memberof Object
     */
    onExport() {
        return this.exportable.onExport();
    }

    /**
     * NOTE: if extend class don't have constructor(worldManager), need to extend this func.
     * @param {WorldManager} worldManager
     * @param {*} data
     * @return {Object}
     * @memberof Object
     */
    static onImport(worldManager, data) {
        const obj = new this(worldManager);
        if (obj.exportable.onImport(data) === false) {
            worldManager.removeObject(this);
            return null;
        }
        return obj;
    }
}
