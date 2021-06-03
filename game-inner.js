//@ts-check
import { BlowerMachine } from "./object/machine/BlowerMachine.js";
import { InputPumpMachine } from "./object/machine/InputPumpMachine.js";
import { MouseMovableMachine } from "./object/machine/MouseMovableMachine.js";
import { OutputPumpMachine } from "./object/machine/OutputPumpMachine.js";
import { PropellerMachine } from "./object/machine/PropellerMachine.js";
import { Trash } from "./object/Trash.js";
import { Vector } from "./util/MatterExporter.js";
import { gaevent } from "./util/util.js";
import { WorldExporter } from "./util/WorldExporter.js";
import { WorldManager } from "./world/WorldManager.js";

// fake loader
(() => {
    class a extends PropellerMachine {}
    class b extends OutputPumpMachine {}
    class c extends InputPumpMachine {}
    class d extends MouseMovableMachine { }
    class e extends BlowerMachine { }
    class f extends Trash { }
    Vector.create(1, 1); // fake for keep import syntax
})()

// export to window....hacky...
//@ts-ignore
window.WorldManager = WorldManager;

// World initialize
WorldManager.getInstance().initialize(".canvas-container");

// btn for debug
document.querySelectorAll('.add').forEach((dom) => dom.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) {
        return;
    }

    const name = e.target.getAttribute("data-name")
    const ex = new WorldExporter

    if (ex.classMap[name] === undefined) {
        return;
    }

    const w = WorldManager.getInstance();
    const genX = (window.innerWidth / 100) * (Math.random() * 90);
    const genY = (window.innerHeight / 100) * (Math.random() * 70) + 100;
    const obj = new ex.classMap[name](w, genX, genY);
    w.getMachineManager().addMachine(obj);

    gaevent('click', 'add-machine', name);
}));

document.querySelector('.export').addEventListener("click", () => {
    const exporter = new WorldExporter();
    exporter.exportToJson();

    gaevent('click', 'export', 'export');
});
document.querySelector('.import').addEventListener("click", () => {
    const exporter = new WorldExporter();
    exporter.importFromJson(prompt());

    gaevent('click', 'import', 'import');
});
