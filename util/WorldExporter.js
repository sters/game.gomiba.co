//@ts-check

import { BlowerMachine } from "../object/machine/BlowerMachine.js";
import { InputPumpMachine } from "../object/machine/InputPumpMachine.js";
import { MouseMovableMachine } from "../object/machine/MouseMovableMachine.js";
import { OutputPumpMachine } from "../object/machine/OutputPumpMachine.js";
import { PropellerMachine } from "../object/machine/PropellerMachine.js";
import { Trashbox } from "../object/machine/Trashbox.js";
import { Trash } from "../object/Trash.js";
import { WorldBarrier } from "../object/WorldBarrier.js";
import { WorldManager } from "../world/WorldManager.js";
import { mergeObject } from "./util.js";

export class WorldExporter {
    defaultLimit = 50;
    limitedClasses = [
        {class:WorldBarrier, limit:0},
        {class:Trashbox, limit:0},
        {class:Trash, limit:100},
    ];
    translator = {
        "name": "na",
        "position": "po",
        "angle": "an",
        "staticMode": "st",
        "size": "si",
        "speed": "sp",
        "tickMs": "ti",
        "force": "fo",
        "MouseMovableMachine": "#mm",
        "PropellerMachine": "#pm",
        "OutputPumpMachine": "#opm",
        "InputPumpMachine": "#ipm",
        "BlowerMachine": "#bm",
        "Trash": "#t",
        "(\\d+\\.\\d{3})\\d+": "$1",
    }
    classMap = {
        "MouseMovableMachine": MouseMovableMachine,
        "PropellerMachine": PropellerMachine,
        "OutputPumpMachine": OutputPumpMachine,
        "InputPumpMachine": InputPumpMachine,
        "BlowerMachine": BlowerMachine,
        "Trash": Trash,
    }

    constructor() {}

    exportToJson() {
        const w = WorldManager.getInstance();
        const states = [];
        const limited = {};
        for (const key of Object.keys(w.objects)) {
            const obj = w.objects[key];

            let nextItem = false;
            for (const c of this.limitedClasses) {
                if (obj instanceof c.class) {
                    if (limited[c.class.toString()] === undefined) {
                        limited[c.class.toString()] = 0;
                    }
                    if (limited[c.class] >= c.limit || limited[c.class] >= this.defaultLimit) {
                        nextItem = true;
                        break;
                    }
                    limited[c.class.toString()]++
                }
            }
            if (nextItem) {
                continue;
            }

            states.push(
                mergeObject({
                    name: obj.constructor.name,
                }, w.objects[key].onExport())
            );
        }

        // translate
        let result = JSON.stringify(states);
        for (const t of Object.keys(this.translator)) {
            result = result.replace(new RegExp(t, "g"), this.translator[t]);
        }

        window.open().document.write(result);
    }

    /**
     * @param {string} rawdata
     * @memberof WorldExporter
     */
    importFromJson(rawdata) {
        // try parse
        if (rawdata === null) {
            return;
        }
        try {
            JSON.parse(rawdata);
        } catch {
            alert("failed to parse JSON data");
            return;
        }

        // translate
        for (const t of Object.keys(this.translator).reverse()) {
            if (t.indexOf("\\d") !== -1) {
                continue; // skip regexp pattern
            }
            rawdata = rawdata.replace(new RegExp(this.translator[t], "g"), t);
        }

        // parse
        const data = JSON.parse(rawdata);
        if (!this.checkJSONFormat(data)) {
            alert("failed to parse JSON data");
            return;

        }

        // remove objects
        const w = WorldManager.getInstance();
        const limited = {};
        for (const key of Object.keys(w.objects)) {
            const obj = w.objects[key];
            let nextItem = false;
            for (const c of this.limitedClasses) {
                if (obj instanceof c.class) {
                    if (limited[c.class.toString()] === undefined) {
                        limited[c.class.toString()] = 0;
                    }
                    if (limited[c.class] >= c.limit || limited[c.class] >= this.defaultLimit) {
                        nextItem = true;
                        break;
                    }
                    limited[c.class.toString()]++
                }
            }
            if (nextItem) {
                continue;
            }

            w.removeObject(obj); // TODO: use obj.remove();
        }

        // add objects
        for (const d of data) {
            const obj = this.classMap[d.name].onImport(WorldManager.getInstance(), d);
            if (obj === null) {
                console.log("failed to import", d);
                setTimeout(() => this.importFromJson("[]"), 500);
                return;
            }
        }
    }

    /**
     * @param {*} data
     * @return {*}
     * @memberof WorldExporter
     */
    checkJSONFormat(data) {
        if (!(data instanceof Array)) {
            return false;
        }

        for (const d of data) {
            if (d['name'] === undefined) {
                return false;
            }
            if (this.classMap[d.name] === undefined) {
                return false;
            }
            if (d['position'] === undefined) {
                return false;
            }
        }

        return true;
    }
}

// [{"na":"#mm","po":{"x":486.495,"y":264.064},"an":0,"st":true},{"na":"#mm","po":{"x":777.795,"y":18.128},"an":0,"st":true},{"na":"#pm","po":{"x":998.697,"y":83.740},"an":11.640,"si":128,"sp":0.015},{"na":"#pm","po":{"x":1119.472,"y":363.093},"an":-7.759,"si":150,"sp":-0.01},{"na":"#ipm","po":{"x":335.324,"y":169.651},"an":0,"ti":5000},{"na":"#opm","po":{"x":936.940,"y":226.416},"an":0,"ti":5000},{"na":"#bm","po":{"x":784.651,"y":398.045},"an":0,"ti":250,"fo":{"x":0.005,"y":0}},{"na":"#t","po":{"x":681.184,"y":398.984},"an":-8.631},{"na":"#t","po":{"x":949.568,"y":398.976},"an":3.937},{"na":"#t","po":{"x":1162.974,"y":398.715},"an":1.401},{"na":"#t","po":{"x":1046.244,"y":398.795},"an":6.376},{"na":"#t","po":{"x":980.181,"y":398.719},"an":-0.217},{"na":"#t","po":{"x":1014.734,"y":398.796},"an":1.270},{"na":"#t","po":{"x":974.014,"y":369.790},"an":0.178}]
