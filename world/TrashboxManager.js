//@ts-check
import { DoTrashEvent } from "../event/DoTrashEvent.js";
import { VomitEvent } from "../event/VomitEvent.js";
import { Trashbox } from "../object/machine/Trashbox.js";
import { TrashboxVomitter } from "../object/machine/TrashboxVomitter.js";
import { Trash } from "../object/Trash.js";
import { getImagePath } from "../util/util.js";
import { WorldManager } from "./WorldManager.js";

/**
 * @export
 * @class TrashboxManager
 */
export class TrashboxManager {
    /**
     * @param {WorldManager} worldManager
     */
    constructor(worldManager) {
        /** @type {Array<*>} */
        this.trashes = [];

        this.worldManager = worldManager;
        this.vomitter = new TrashboxVomitter(worldManager, this);
        this.trashboxBodies = new Trashbox(this.worldManager);

        const leftBounds = this.trashboxBodies.bodies.left.bounds;
        const rightBounds = this.trashboxBodies.bodies.right.bounds;
        this.centerPosition = {
            x: leftBounds.min.x + (rightBounds.max.x - leftBounds.min.x) / 2,
            y: leftBounds.min.y + (leftBounds.max.y - leftBounds.min.y) / 2,
        }

        this.trashboxFrontImage = new Image();
        this.trashboxFrontImage.src = getImagePath('img/gomibako_front.png');
    }

    /**
     * @returns
     * @memberof TrashboxManager
     */
    initialize() {
        return; // TODO: trash initialize
        for (var i = 0; i < 20; i++) {
            this.createNewTrash(
                50 + (i % 5) * 30,
                (this.worldManager.height / 2) + (i / 5) * 30
            );
        }
    }

    /**
     * @param {CanvasRenderingContext2D} context
     */
    afterRender(context) {
        // draw vomitter guideline
        // this.vomitter.afterRender();
        // const hue = 180 +
        //     (this.vomitter.power - this.vomitter.powerMin) *
        //     (45 / (this.vomitter.powerMax - this.vomitter.powerMin)) *
        //     4;
        // const powerDirection = this.vomitter.calculateAngleToPosition();
        // context.strokeStyle = `hsl(${hue}, 50%, 50%)`;
        // context.beginPath();
        // context.setLineDash([3, 3]);
        // context.moveTo(this.centerPosition.x, this.centerPosition.y);
        // context.lineTo(
        //     this.centerPosition.x + powerDirection.x * this.vomitter.power * 4,
        //     this.centerPosition.y + powerDirection.y * this.vomitter.power * 4,
        // );
        // context.stroke();

        // front image
        context.drawImage(
            this.trashboxFrontImage,
            this.centerPosition.x - this.trashboxFrontImage.width / 2,
            this.centerPosition.y - this.trashboxFrontImage.height / 2
        );
    }

    /**
     * @param {number|null} x
     * @param {number|null} y
     * @memberof TrashboxManager
     * @returns {Trash}
     */
    createNewTrash(x, y) {
        const t = new Trash(
            this.worldManager,
            x || this.centerPosition.x,
            y || this.centerPosition.y,
        );
        this.trashes.push(t);
        return t;
    }

    /**
     * @param {{x:number, y:number}} min
     * @param {{x:number, y:number}} max
     * @returns
     * @memberof TrashboxManager
     */
    doTrash(min, max) {
        if (min.x == null || min.y == null || max.x == null || max.y == null) {
            return;
        }

        // 枠の位置判定と残す要素の分別
        let removeTarget = [];

        const x1 = min.x;
        const y1 = min.y;
        const x2 = max.x;
        const y2 = max.y;

        this.trashes = this.trashes.filter((trash) => {
            if (
                x1 < trash.body.position.x && trash.body.position.x < x2 &&
                y1 < trash.body.position.y && trash.body.position.y < y2
            ) {
                removeTarget.push(trash);
                return false;
            }

            return true;
        });
        if (removeTarget.length === 0) {
            return;
        }

        // 消去
        this.worldManager.removeObject(removeTarget);
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionVomit() {
        this.vomitter.vomit();
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionResetVomitDirection() {
        this.vomitter.reset();
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionVomitDirectionLeft() {
        this.vomitter.angle -= 5;
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionVomitDirectionRight() {
        this.vomitter.angle += 5;
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionVomitPowerUp() {
        this.vomitter.power += 1;
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionVomitPowerDown() {
        this.vomitter.power -= 1;
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionDiscard() {
        this.doTrash(
            this.trashboxBodies.bodies.left.bounds.min,
            this.trashboxBodies.bodies.right.bounds.max
        );
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionKonami() {
        const maxPower = 0.1;
        console.warn("this.trashes is not works");
        this.trashes.forEach((trash) => {
            trash.body.force.x += (maxPower * 2) * Math.random() - maxPower;
            trash.body.force.y += maxPower * Math.random();
        });
    }

    /**
     * @memberof TrashboxManager
     * @event
     */
    onGuiActionDeviceOrientation(event) {
        const beta = event.detail.beta;
        const gamma = event.detail.gamma;
        const alpha = event.detail.alpha;

        let x = Math.round(gamma);
        let y = Math.round(beta);

        this.worldManager.setGravitiy({
            x: x * 0.02,
            y: y * 0.02,
        });
    }

    /**
     * @memberof TrashboxManager
     * @param {VomitEvent} event
     * @event
     */
    onVomitGlobal(event) {
        if (event.detail.x == null || event.detail.y == null) {
            return;
        }
        this.createNewTrash(event.detail.x, event.detail.y);
    }

    /**
     * @memberof TrashboxManager
     * @param {DoTrashEvent} event
     * @event
     */
    onDoTrashGlobal(event) {
        if (event.detail.min == null || event.detail.max == null) {
            return;
        }
        this.doTrash(event.detail.min, event.detail.max);
    }
}
