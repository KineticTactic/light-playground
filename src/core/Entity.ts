import Color, { RGBA } from "../lib/Color";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import Surface from "../primitives/Surface";
import { Attribute, AttributeType } from "../ui/Attribute";
import AABB from "../util/Bounds";
import EntityData from "./EntityData";
import Renderer from "../graphics/Renderer";

export default abstract class Entity {
    pos: Vector;
    rot: number;
    bounds: AABB;
    name: string;
    color: Color = RGBA(255, 255, 255, 255);
    displayBounds: boolean = false;

    attributes: Attribute[];

    surfaces: Surface[] = [];
    lightRays: LightRay[] = [];

    static entityData: EntityData;

    constructor(pos: Vector, rot: number, name: string) {
        this.pos = pos;
        this.rot = rot;
        this.name = name;

        this.bounds = new AABB(Vector.zero(), Vector.zero());

        // Attributes
        this.attributes = [
            { name: "color", type: AttributeType.Color, value: this.color },
            { name: "position", type: AttributeType.Vector, value: this.pos.copy() },
            { name: "rotation", type: AttributeType.Number, value: this.rot },
        ];
    }

    setPosition(p: Vector) {
        const deltaPos = Vector.sub(p, this.pos);
        this.pos = p.copy();
        this.updateTransforms(deltaPos, 0);
        this.updateBounds();
    }

    setRotation(r: number) {
        const deltaRot = r - this.rot;
        this.rot = r;
        this.updateTransforms(Vector.zero(), deltaRot);
        this.updateBounds();
    }

    translate(delta: Vector): void {
        this.pos.add(delta);
        // console.log(delta);

        this.updateTransforms(delta, 0);
        this.updateBounds();
    }

    rotate(theta: number): void {
        this.rot += theta;
        this.updateTransforms(Vector.zero(), theta);
        this.updateBounds();
    }

    updateTransforms(_deltaPos: Vector, _deltaRot: number): void {}
    updateBounds(): void {}

    // abstract addToWorld(_world: World): void;

    updateAttribute(attribute: string, value: string | Vector | number | boolean | Color): void {
        console.log("updating attribute", attribute, value);

        switch (attribute) {
            case "position":
                this.setPosition(value as Vector);
                break;
            case "rotation":
                this.setRotation(value as number);
                break;
            case "color":
                const c = value as Color;
                this.color = RGBA(c.r, c.g, c.b, Math.ceil(c.a * 255));
                break;
        }
    }

    render(renderer: Renderer, isSelected: boolean): void {
        if (this.displayBounds) this.bounds.render(renderer, RGBA(132, 36, 185, 200), 2);
        if (isSelected) this.bounds.render(renderer, RGBA(132, 36, 185), 2);
    }
}
