//@ts-check

/**
 * @export
 * @param {string} path
 * @returns {string}
 */
export function getImagePath(path) {
    let href = location.href.replace('game-inner.html', '');
    return href + path;
}

/**
 * @export
 * @param {number} angle
 * @returns {number}
 */
export function rad2deg(angle) {
    return angle * 57.29577951308232;
}

/**
 * @export
 * @param {number} angle
 * @returns {number}
 */
export function deg2rad(angle) {
    return angle * 0.017453292519943295;
}

/**
 * @export
 * @param {number} ms
 * @returns {number}
 */
export function fpsMs(ms) {
    return 60 * (ms / 1000);
}

const svgList = {};

/**
 * @export
 * @param {String} url
 * @returns {Promise<String>}
 */
export async function loadSVG(url) {
    if (svgList[url] instanceof String) {
        return svgList[url];
    }

    const res = await fetch(url);
    if (~~(res.status / 100) !== 2) {
        console.warn('error: ', res);
        return "";
    }

    const txt = res.text();
    svgList[url] = txt;
    return txt;
}

/**
 * @export
 * @param {string} html
 * @returns
 */
export function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}

/**
 * @export
 * @param {String} str
 * @returns {String}
 */
export function hyphenToUpperCamelize(str) {
    return str.replace(/-[a-z]/g, c => c[1].toUpperCase()).replace(/^[a-z]/g, c => c[0].toUpperCase());
}


export const copyObject = (a) => Object.assign({}, a);
export const mergeObject = (a, b) => Object.assign(copyObject(a), b);

/**
 * @param {String} name
 * @param {String} category
 * @param {String} label
 */
export function gaevent(name, category, label) {
    //@ts-ignore
    gtag('event', name, {
        'event_category': category,
        'event_label': label,
    });

    console.log([name, category, label]);
}
