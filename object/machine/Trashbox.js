//@ts-check
import { Bodies, Body } from "../../util/MatterExporter.js";
import { deg2rad, getImagePath } from "../../util/util.js";
import { WorldManager } from "../../world/WorldManager.js";
import { Machine } from "./Machine.js";

export class Trashbox extends Machine {
    /**
     * @param {WorldManager} worldManager
     */
    constructor(worldManager) {
        super(worldManager);

        this.bodies = {
            right: Bodies.rectangle(37, 0, 5, 95, {
                angle: deg2rad(5),
                render: {
                    visible: false,
                },
            }),
            bottom: Bodies.rectangle(0, 45, 60, 5, {
                render: {
                    visible: false,
                },
            }),
            left: Bodies.rectangle(-37, 0, 5, 95, {
                angle: deg2rad(-5),
                render: {
                    visible: false,
                },
            }),
            bg: Bodies.rectangle(0, 0, 1, 1, {
                collisionFilter: {
                    mask: 0,
                },
                render: {
                    sprite: {
                        texture: getImagePath('img/gomibako_back.png'),
                        xScale: 1,
                        yScale: 1,
                    },
                },
            }),
        }

        this.registerBody(
            Body.create({
                parts: [
                    this.bodies.left,
                    this.bodies.right,
                    this.bodies.bottom,
                    this.bodies.bg,
                ],
                isStatic: true,
                label: "Trashbox",
                mass: Machine.defaultMass,
            })
        );
        Body.setPosition(this.body, {
            x: this.worldManager.width / 2,
            y: this.worldManager.height / 2,
        });
        this.worldManager.addObject(this);
    }
}
