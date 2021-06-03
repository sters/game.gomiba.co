// @ts-check

/**
 * @export
 * @class DoTrashEvent
 * @extends {Event}
 */
export class DoTrashEvent extends Event {
    /**
     * Creates an instance of DoTrashEvent.
     * @param {{x:number, y:number}} min
     * @param {{x:number, y:number}} max
     * @memberof DoTrashEvent
     */
    constructor(min, max) {
        super("doTrash");

        this.detail = {
            min: min,
            max: max,
        };
    }
}
