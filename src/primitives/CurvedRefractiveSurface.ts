import { Vector } from "polyly";

import { calculateRefractiveIndexForWavelength, refract } from "../lib/math";
import CurvedSurface from "./CurvedSurface";

export default class CurvedRefractiveSurface extends CurvedSurface {
    refractiveIndex: number;
    criticalAngle: number;
    normal: number;

    constructor(center: Vector, radius: number, facing: Vector, span: number, ri: number, normal = 1) {
        super(center, radius, facing, span);

        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
        this.normal = normal;
    }

    override handle(intersection: Vector, dir: Vector, wavelength: number) {
        // Calculate normal vector by (intersection point - center)
        let normal = Vector.sub(intersection, this.center).normalize().mult(this.normal);

        const ri = calculateRefractiveIndexForWavelength(wavelength, 570, this.refractiveIndex);

        const response = refract(dir, normal, ri, this.criticalAngle);
        response.newRayOrigin = intersection;
        return response;
    }

    setRefractiveIndex(ri: number) {
        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }
}
