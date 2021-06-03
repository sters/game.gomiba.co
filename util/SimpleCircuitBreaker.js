//@ts-check

export class SimpleCircuitBreaker {
    /**
     * Creates an instance of SimpleCircuitBreaker.
     * @param {number} limit
     * @param {number} measureMs
     * @memberof SimpleCircuitBreaker
     */
    constructor(limit, measureMs) {
        this.limit = limit;
        this.measureMs = measureMs;
        this.lastTimeMs = performance.now();
        this.counter = {};
    }

    /**
     * @param {String} key
     * @memberof SimpleCircuitBreaker
     */
    checkOrIncrement(key) {
        const n = performance.now();
        if ((this.lastTimeMs + this.measureMs) < n || this.counter[key] === undefined) {
            this.counter[key] = 0;
            this.lastTimeMs = n;
        }

        if (this.counter[key] >= this.limit) {
            return true;
        }
        this.counter[key]++;
        return false;
    }
}
