// @ts-check

export class RequestAnimationFramePromise {
    /**
     * @param {{(resolve:Function, reject:Function)}} cb
     * @returns {Promise}
     */
    static do(cb) {
        return new Promise((resolve, reject) => {
            requestAnimationFrame(cb.bind(null, resolve, reject));
        });
    }
}
