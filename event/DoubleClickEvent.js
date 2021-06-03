// @ts-check

import { Object } from "../object/Object.js";

/**
 * @export
 * @class DoubleClickEvent
 * @extends {Event}
 */
export class DoubleClickEvent extends Event {
    /**
     * Creates an instance of DoubleClickEvent.
     * @param {Object} obj
     * @memberof DoubleClickEvent
     */
    constructor(obj) {
        super("doubleClick");
        this.body = obj.body;
        this.detail = {
            object: obj,
        };
    }
}
