//@ts-check
import { Bodies, Body, Vector, Vertices } from "../../util/MatterExporter.js";
import { getBodyFitSprite } from "../../util/MatterUtil.js";
import { mergeObject } from "../../util/util.js";
import { WaitingForPromise } from "../../util/WaitingForPromise.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Machine } from "./Machine.js";

/**
 * @export
 * @class PropellerMachine
 * @extends {Machine}
 */
export class PropellerMachine extends Machine {
    /**
     *Creates an instance of PropellerMachine.
     * @param {WorldManager} worldManager
     * @param {number} x
     * @param {number} y
     * @param {number} size
     * @param {number} speed
     * @memberof PropellerMachine
     */
    constructor(worldManager, x, y, size, speed) {
        super(worldManager);
        this.mouseMovable.enable = true;
        this.mouseMovable.staticMode = true;
        this.size = size || 128;
        this.speed = speed || 0.015;
        this.debug = false;

        (async () => {
            const baseSize = 128;
            const rate = this.size / baseSize;
            const centerX = 62;
            const centerY = 76;

            // NOTE: propeller.png 's simply shape
            // (63, 67) // center, unnecessary for shape
            // (62, 6) // up wing top right
            // (53, 6) // up wing top left
            // (53, 80) // left wing top left
            // (0, 110) // left wing bottom left
            // (5, 118) // left wing bottom right
            // (68, 82) // right wing top left
            // (121, 112) // right wing bottom right
            // (126, 104) // right wing top right
            // (62, 63) // up wing bottom right

            let b = Bodies.rectangle(0, 0, 1, 1); // fake body for use Vertoces.create()
            b = Bodies.fromVertices(
                0, 0,
                Vertices.create(
                    [
                        Vector.create(62 * rate, 6 * rate),
                        Vector.create(53 * rate, 6 * rate),
                        Vector.create(53 * rate, 80 * rate),
                        Vector.create(0 * rate, 110 * rate),
                        Vector.create(5 * rate, 118 * rate),
                        Vector.create(68 * rate, 82 * rate),
                        Vector.create(121 * rate, 112 * rate),
                        Vector.create(126 * rate, 104 * rate),
                        Vector.create(62 * rate, 67 * rate),
                    ],
                    b,
                ),
                {
                    render: {
                        fillStyle: "#00A",
                        //strokeStyle: "",
                        //visible: false,
                    },
                    label: "Propeller Machine",
                    mass: Machine.defaultMass,
                },
            );

            const spriteBody = Bodies.rectangle(
                (baseSize / 2 - centerX) * rate,
                (baseSize / 2 - centerY) * rate,
                1,
                1,
                {
                    render: {
                        sprite: await getBodyFitSprite(
                            "img/propeller.png", // it has gap to center, correct is 62x76.
                            this.size,
                            this.size,
                            { keepAspect: true }
                        ),
                    },
                }
            );

            // hack: hide render for vertices
            b.parts.forEach((b, i) => {
                if (i === 0 || this.debug) return;
                b.render.visible = false;
            });

            // add sprite to child
            Body.setParts(b, b.parts.concat([spriteBody]));

            // register to world
            this.registerBody(b);
            Body.setPosition(this.body, { x: x, y: y });
            this.worldManager.addObject(this);
        })();
    }

    /**
     * @memberof PropellerMachine
     */
    beforeUpdate() {
        super.beforeUpdate();
        if (this.body === null) {
            return;
        }

        if (this.mouseMovable.isHandling) {
            Body.setAngularVelocity(this.body, 0);
        } else {
            Body.setAngularVelocity(this.body, this.speed / 3);
            Body.rotate(this.body, this.speed / 3);
        }
    }

    /**
     * @return {*}
     * @memberof PropellerMachine
     */
    onExport() {
        return mergeObject(super.onExport(), {
            size: this.size,
            speed: this.speed,
        });
    }

    /**
     * @param {WorldManager} worldManager
     * @param {*} data
     * @return {Object}
     * @memberof Object
     */
    static onImport(worldManager, data) {
        const obj = new this(
            worldManager,
            data.position.x,
            data.position.y,
            data.size,
            data.speed
        );
        (async () => {
            await WaitingForPromise.fn(() => obj.body !== null );
            try {
                if (obj.exportable.onImport(data) === false) {
                    worldManager.removeObject(this);
                    return null;
                }
            } catch (e) {
                console.error("failed to import", data, e);
            }
        })();
        return obj;
    }
}
