import { Renderer, Vector, Color } from "polyly";

import { LightRayResponseInfo } from "../lib/math";
import AABB from "../util/AABB";

export default abstract class Surface {
    static surfaceRenderWidth = 2;

    abstract canIntersectTwice: boolean;

    abstract intersects(origin: Vector, dir: Vector): Vector | null;
    abstract handle(origin: Vector, dir: Vector, wavelength: number): LightRayResponseInfo;

    abstract calculateAABB(): AABB;

    abstract translate(_delta: Vector): void;
    abstract rotateAboutAxis(_theta: number, _axis: Vector): void;

    abstract render(renderer: Renderer, color?: Color): void;
}
