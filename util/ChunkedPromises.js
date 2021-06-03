// @ts-check

export class ChunkedPromises {
    /**
     * @param {number} size
     */
    constructor(size) {
        /** @member {{()=>Promise}[]} promises */
        this.promises = [];
        this.concurrentSize = size;
    }

    /**
     * @param {{():Promise}} cb
     */
    register(cb) {
        if (cb instanceof Promise) {
            throw new TypeError("want to return promise function, not directly use promise");
        }
        this.promises.push(cb);
    }

    /**
     * do promise registered callbacks
     * @returns {Promise}
     */
    do() {
        let index = 0;
        let p = new Promise((r) => r());
        while (index < this.promises.length) {
            ((index) => {
                p = p.then(() => Promise.all(this.promises.slice(index, index + this.concurrentSize).map((x) => x())));
            })(index);
            index += this.concurrentSize;
        }
        return p.then(() => { this.promises = []; });
    }
}
