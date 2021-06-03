//@ts-check
import { Machine } from "../object/machine/Machine.js";
import { Object } from "../object/Object.js";
import { WorldBarrier } from "../object/WorldBarrier.js";
import { Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner, World } from "../util/MatterExporter.js";
import { TimedQueue } from "../util/TimedQueue.js";
import { EventDispatcher } from "./EventDispatcher.js";
import { MachineManager } from "./MachineManager.js";
import { TrashboxManager } from "./TrashboxManager.js";

/**
 * @export
 * @class WorldManager
 */
export class WorldManager {
    /**
     *Creates an instance of WorldManager.
     * @memberof WorldManager
     */
    constructor() {
        this.engine = null;
        this.world = null;
        this.render = null;
        this.runner = null;
        this.mouse = null;
        this.mouseConstraint = null;

        this.width = 0;
        this.height = 0;

        this.trashboxManager = null;
        this.machineManager = null;
        this.objects = {};
    }

    /**
     * @memberof WorldManager
     */
    initialize(canvasSelector) {
        // initialize event dispatcher
        EventDispatcher.initialize();
        this.eventDispatcher = new EventDispatcher();

        // setup Machine manager
        this.machineManager = new MachineManager();

        // set world size
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // create a Matter engine
        this.engine = Engine.create({
            // enableSleeping: true,
        });
        this.engine.timing.timeScale = 0.5;
        Engine.run(this.engine);

        // get world
        this.world = this.engine.world;
        this.world.bodies = [];

        // create renderer
        this.render = Render.create({
            element: document.querySelector(canvasSelector),
            engine: this.engine,
            options: {
                width: 800,
                height: 600,
                wireframes: false,
                background: '#fff'
            }
        });
        Render.run(this.render);

        // create runner
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        // create mouse and controlled constraint
        this.mouse = Mouse.create(this.render.canvas);
        this.mouseConstraint = MouseConstraint.create(
            this.engine, {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        }
        );
        this.addObject(this.mouseConstraint);

        // setup WorldBarrier
        new WorldBarrier(this);

        // setup trashbox manager
        this.trashboxManager = new TrashboxManager(this);
        this.trashboxManager.initialize();
        this.eventDispatcher.addEventListener(this.trashboxManager);

        // fix sizes
        const canvasElement = document.querySelector(canvasSelector).querySelector("canvas");
        canvasElement.setAttribute("width", this.width.toString());
        canvasElement.setAttribute("height", this.height.toString());

        // add something engine, render, mouse
        Events.on(this.engine, 'beforeUpdate', () => {
            this.beforeUpdate();
        });
        Events.on(this.render, 'afterRender', () => {
            this.afterRender();
        });
        ["startdrag", "enddrag", "mousedown", /*"mousemove", "mouseup"*/].forEach((name) => {
            // avoid matter-js's bug that is startdrag event is not correctly execute top object.
            const queue = new TimedQueue(10);
            Events.on(this.mouseConstraint, name, (event) => {
                queue.push(() => this.eventDispatcher.dispatchEvent(event));
            });
        })

        // receive window message
        window.addEventListener("message", (event) => {
            if (event.origin !== location.origin) {
                return;
            }

            // trigger event
            this.dispatchEvent(
                new CustomEvent(event.data.name, {
                    detail: event.data.arguments
                })
            );
        }, false);
    }

    /**
     * @param {*} obj
     * @memberof WorldManager
     */
    addObject(obj) {
        if (!(obj instanceof Object)) {
            World.add(this.world, obj);
            return;
        }

        const b = obj.getBody();
        this.objects[b.id] = obj;
        World.add(this.world, b);
        this.eventDispatcher.addEventListener(obj);
    }

    /**
     * @param {*} obj
     * @memberof WorldManager
     */
    removeObject(obj) {
        if (obj instanceof Array) {
            obj.forEach((o) => this.removeObject(o));
            return;
        }
        if (!(obj instanceof Object)) {
            World.remove(this.world, obj);
            return;
        }

        if (obj instanceof Machine) {
            this.getMachineManager().removeMachine(obj);
        }
        const b = obj.getBody();
        World.remove(this.world, b);
        this.eventDispatcher.removeEventListener(obj);
        delete this.objects[b.id];
    }

    /**
     * @param {{x:number, y:number}} g
     * @memberof WorldManager
     */
    setGravitiy(g) {
        this.world.gravity = {
            x: g.x,
            y: g.y,
        }
    }

    /**
     * @memberof WorldManager
     */
    beforeUpdate() {
        this.machineManager.beforeUpdate();

        for (let obj in this.objects) {
            if (this.objects[obj] instanceof Object) {
                this.objects[obj].beforeUpdate();
            }
        }
    }

    /**
     * @memberof WorldManager
     */
    afterRender() {
        Render.startViewTransform(this.render);
        this.machineManager.afterRender();
        this.trashboxManager.afterRender(this.render.context);
    }

    /**
     * @param {Event} event
     * @memberof WorldManager
     */
    dispatchEvent(event) {
        this.eventDispatcher.dispatchEvent(event);
    }

    /**
     * @param {*} eventListener
     * @param {Event} event
     * @memberof WorldManager
     */
    dispatchSpecificBodyEvent(eventListener, event) {
        this.eventDispatcher.dispatchSpecificBodyEvent(eventListener, event);
    }

    /**
     * @returns {MachineManager}
     * @memberof WorldManager
     */
    getMachineManager() {
        return this.machineManager;
    }

    /**
     * getAllBodies for Query.ray() or also
     * @returns {Body[]}
     * @memberof WorldManager
     */
    getAllBodies() {
        return Composite.allBodies(this.engine.world);
    }

    /**
     * @static
     * @memberof WorldManager
     */
    static instance = null;

    /**
     * @static
     * @returns {WorldManager}
     * @memberof WorldManager
     */
    static getInstance() {
        if (WorldManager.instance === null) {
            WorldManager.instance = new WorldManager;
        }

        return WorldManager.instance;
    }
}
