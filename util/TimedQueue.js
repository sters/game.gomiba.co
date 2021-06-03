//@ts-check

export class TimedQueue {
    /**
     * Creates an instance of TimedQueue.
     * @param {number} expireMs
     * @memberof TimedQueue
     */
    constructor(expireMs) {
        this.expireMs = expireMs;
        /** @var {Function[]} queued functions */
        this.queue = [];
        /** @var {number|null} latestTimer id */
        this.latestTimer = null;
    }

    /**
     * @param {Function} item
     * @memberof TimedQueue
     */
    push(item) {
        this.queue.push(item);

        if (this.latestTimer !== null) {
            clearTimeout(this.latestTimer);
        }
        this.latestTimer = setTimeout(() => {
            this.queue.pop()();
            this.queue.splice(this.queue.length);
        }, this.expireMs);
    }
}
