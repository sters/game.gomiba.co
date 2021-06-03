// @ts-check

import { RequestAnimationFramePromise } from "./RequestAnimationFramePromise.js";

export class WaitingForPromise {
    /**
     * @static
     * @param {Function} check
     * @returns {Promise}
     * @memberof WaitingForPromise
     */
    static async fn(check) {
        const start = (check) => {
            return RequestAnimationFramePromise.do((resolve, reject) => {
                resolve(check());
            }).then((f) => {
                if (!f) {
                    return start(check);
                }
            });
        };
        return start(check);
    }
}
