import { MicroTaskQueue } from "../util/MicroTaskQueue.js";
import { hyphenToUpperCamelize } from "../util/util.js";

//@ts-check
export class EventDispatcher {
    constructor() {
        this.eventListeners = [];
        this.debug = false;
        this.eventTaskQueue = new MicroTaskQueue();
        this.eventTaskQueue.start();
    }

    /**
     * @static
     * @memberof EventDispatcher
     */
    static isInitialized = false;

    /**
     * @static
     * @returns
     * @memberof EventDispatcher
     */
    static initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;

        const ByPassParentEvent = (event) => {
            // ignore when parent window is not found
            if (window.parent == null || window.parent == window) {
                return;
            }

            const eventObject = {};
            for (let x in event) {
                if (typeof (event[x]) != 'function' && typeof (event[x]) != 'object') {
                    eventObject[x] = event[x];
                }
            }

            const messageObject = {
                name: event.type,
                arguments: eventObject,
            };

            window.parent.postMessage(messageObject, location.origin);
        };

        const bypassEventList = [
            'keydown',
            'keyup',
            'keypress',
        ];
        bypassEventList.forEach((name) => {
            window.addEventListener(name, ByPassParentEvent);
        });
    }

    /**
     * @param {Object} object
     * @memberof EventDispatcher
     */
    addEventListener(object) {
        this.eventListeners.push(object);
    }

    /**
     * @param {Object} object
     * @memberof EventDispatcher
     */
    removeEventListener(object) {
        for (const k in this.eventListeners) {
            if (this.eventListeners[k] === object) {
                delete this.eventListeners[k];
                this.eventListeners = this.eventListeners.filter(x => x != null);
                return;
            }
        }
    }

    /**
     * @param {Event|*} event
     * @memberof EventDispatcher
     */
    dispatchEvent(event) {
        const handlerName = 'on' + hyphenToUpperCamelize(event.type || event.name);
        const globalHandlerName = handlerName + "Global";

        // async handling all listeners for avoid heavy event
        this.eventListeners.forEach((eventListener) => {
            this.eventTaskQueue.add(() => {
                this._dispatchSpecificBodyEvent(event, handlerName, eventListener);
                this._dispatchGlobalEvent(event, globalHandlerName, eventListener);
            })
        });
    }

    /**
     * @param {*} eventListener
     * @param {Event} event
     * @memberof WorldManager
     */
    dispatchSpecificBodyEvent(eventListener, event) {
        const handlerName = 'on' + hyphenToUpperCamelize(event.type || event.name);
        this.eventTaskQueue.add(() => {
            this._dispatchSpecificBodyEvent(event, handlerName, eventListener);
        });
    }

    _dispatchSpecificBodyEvent(event, handlerName, eventListener) {
        if (!(eventListener instanceof Object)) {
            return;
        }

        // if object, trigger event with only the same body.
        // hado-ken style condition so use closure for easy reading.
        if (typeof (eventListener[handlerName]) !== "function") {
            return;
        }
        if (typeof (eventListener["getBody"]) !== "function") {
            return;
        }

        // some event has event.source.body or event.body, it confused...
        const b = eventListener.getBody();

        let isFire = false;
        if (event.body != null) {
            if (event.body.id === b.id) {
                isFire = true;
            }
        } else if (event.source != null) {
            if (event.source.body != null) {
                if (event.source.body.id === b.id) {
                    isFire = true;
                }
            }
        }

        if (!isFire) {
            if (this.debug) {
                console.log("pass", handlerName, "\n", eventListener, "\n", event);
            }
            return;
        }

        // FIRE
        if (this.debug) {
            console.log("FIRE", handlerName, "\n", eventListener, "\n", event);
        }
        eventListener[handlerName](event);
    }

    _dispatchGlobalEvent(event, handlerName, eventListener) {
        if (typeof (eventListener[handlerName]) !== "function") {
            return;
        }

        // FIRE
        eventListener[handlerName](event);
    }
}
