// @ts-check

import { Object } from "../object/Object.js";

/**
 * @export
 * @class HandlingChangedEvent
 * @extends {Event}
 */
export class HandlingChangedEvent extends Event {
    /**
     * Creates an instance of HandlingChangedEvent.
     * @param {Object} sourceObject
     * @param {Boolean} isHandling
     * @memberof HandlingChangedEvent
     */
    constructor(sourceObject, isHandling) {
        super("handlingChanged");
        this.body = sourceObject.body;
        this.detail = {
            isHandling: isHandling,
        };
    }
}
