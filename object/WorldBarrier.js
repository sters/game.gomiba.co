//@ts-check
import { Bodies, Body } from "../util/MatterExporter.js";
import { WorldManager } from "../world/WorldManager.js";
import { Object } from "./Object.js";

/**
 * @export
 * @class WorldBarrier
 */
export class WorldBarrier extends Object {
    /**
     * @param {WorldManager} worldManager
     */
    constructor(worldManager) {
        super(worldManager);

        const thickness = 50;
        const options = {
            isStatic: true,
            render: {
                visible: false,
            },
        };

        this.worldManager = worldManager;

        this.bodies = {};

        this.bodies.top = Bodies.rectangle(
            this.worldManager.width / 2,
            0,
            this.worldManager.width + thickness / 2,
            thickness / 2,
            options
        )

        this.bodies.bottom = Bodies.rectangle(
            this.worldManager.width / 2,
            this.worldManager.height + thickness / 3,
            this.worldManager.width + thickness / 2,
            thickness,
            options
        );

        this.bodies.right = Bodies.rectangle(
            this.worldManager.width,
            this.worldManager.height / 2,
            thickness / 2,
            this.worldManager.height + thickness / 2,
            options
        );

        this.bodies.left = Bodies.rectangle(
            0,
            this.worldManager.height / 2,
            thickness / 2,
            this.worldManager.height + thickness / 2,
            options
        );

        this.registerBody(
            Body.create({
                parts: [
                    this.bodies.top,
                    this.bodies.right,
                    this.bodies.bottom,
                    this.bodies.left,
                ],
                label: "World Barrier",
                isStatic: true,
                // isStatic: false,
                // mass: 100000000,
                // friction: 1,
                // restitution: 0.2,
            })
        );
        this.worldManager.addObject(this);

        this.defaultPosition = {
            x: this.body.position.x,
            y: this.body.position.y
        };
    };

    beforeUpdate() {
        // TODO: which as better...? static or non-static...?
        super.beforeUpdate();

        return;
        this.body.velocity = { x: 0, y: 0 };
        this.body.speed = 0;
        this.body.motion = 0;
        Body.setPosition(this.body, this.defaultPosition);

        const gravity = this.worldManager.world.gravity;
        Body.applyForce(this.body, this.body.position, {
            x: -gravity.x * gravity.scale * this.body.mass,
            y: -gravity.y * gravity.scale * this.body.mass
        });
    }
}
