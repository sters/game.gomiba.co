// @ts-check

/**
 * @export
 * @class VomitEvent
 * @extends {Event}
 */
export class VomitEvent extends Event {
    /**
     * Creates an instance of VomitEvent.
     * @param {number} x
     * @param {number} y
     * @memberof VomitEvent
     */
    constructor(x, y) {
        super("vomit");

        this.detail = {
            x: x,
            y: y,
        };
    }
}
