// @ts-check

/**
 * MicroTaskQueue is asynchronous function executor with use requestAnimationFrame
 * It's simple task queue, Promise is not provided.
 *
 * @export
 * @class MicroTaskQueue
 */
export class MicroTaskQueue {
    /**
     * Creates an instance of MicroTaskQueue.
     * @memberof MicroTaskQueue
     */
    constructor() {
        this.queue = [];
        this.whenLastTask = performance.now();
        this.idleDetectionMs = 60 * 1000;
        this.idleTimeMs = 0.5 * 1000;
        this.stopped = false;
        this.oneFrameLimitMs = 10;
    }

    /**
     * add function to this task queue
     *
     * @param {Function} fn
     * @memberof MicroTaskQueue
     */
    add(fn) {
        if (typeof fn !== "function") {
            throw new TypeError("fn is not function");
        }

        this.queue.push(fn);
    }

    /**
     * delayedAdd function to this task queue such as setTimeout(this.add)
     *
     * @param {Function} fn
     * @param {number|null} tickMs
     * @memberof MicroTaskQueue
     */
    delayedAdd(fn, tickMs) {
        setTimeout(() => {
            this.add(fn);
        }, tickMs || 300);
    }

    /**
     * start executing for this task queue
     *
     * @returns
     * @memberof MicroTaskQueue
     */
    start() {
        if (this.stopped) return;

        const n = performance.now();
        if (this.queue.length === 0) {
            const t = n - this.whenLastTask;
            if (t < this.idleDetectionMs) {
                requestAnimationFrame(() => this.start());
            } else {
                setTimeout(() => this.start(), this.idleTimeMs);
            }
            return;
        }

        const taskStartTime = performance.now();
        do {
            const task = this.queue.shift();
            task();
            this.whenLastTask = performance.now();
        } while (this.queue.length !== 0 && this.whenLastTask - taskStartTime < this.oneFrameLimitMs);
        this.whenLastTask = performance.now();

        requestAnimationFrame(() => this.start());
    }

    /**
     * stop executing this task queue
     *
     * @memberof MicroTaskQueue
     */
    stop() {
        this.stopped = true;
    }
}
