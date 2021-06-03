//@ts-check
import { Machine } from "../object/machine/Machine.js";

/**
 * @export
 * @class MachineManager
 */
export class MachineManager {
    /**
     *Creates an instance of MachineManager.
     * @memberof MachineManager
     */
    constructor() {
        /** @type {Array<Machine>} */
        this.items = [];
    }

    /**
     * @memberof MachineManager
     */
    beforeUpdate() {
        this.items.forEach((item) => {
            item.beforeUpdate();
        });
    }

    /**
     * @memberof MachineManager
     */
    afterRender() {
        this.items.forEach((item) => {
            item.afterRender();
        });
    }

    /**
     * @param {Machine} obj
     * @memberof MachineManager
     */
    addMachine(obj) {
        this.items.push(obj);
    }

    /**
     * @param {Machine} obj
     * @memberof MachineManager
     */
    removeMachine(obj) {
        for (const k in this.items) {
            if (this.items[k] === obj) {
                delete this.items[k];
                this.items = this.items.filter(x => x != null);
                return;
            }
        }
    }
}
