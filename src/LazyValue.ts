import Socket from "./Socket";
import TowerError from "./TowerError";

export default class LazyValue {
    public static wrap(value: any) {
        if (value.isLazyValue) {
            return value;
        } else {
            return new LazyValue(() => value);
        }
    }

    public isLazyValue = true;
    private value: any;
    private evaluated: boolean;
    private evaluationFunction: any;


    constructor(evaluationFunction: any) {
        this.value = null;
        this.evaluationFunction = evaluationFunction;
        if (this.evaluationFunction === undefined) {
            throw new Error("Got undefined evaluation function.");
        }
        this.evaluated = false;
    }

    public get() {
        if (!this.evaluated) {
            this.value = this.evaluationFunction();
            this.evaluated = true;
        }
        if (this.value instanceof Socket) {
            throw new TowerError("Empty socket.");
        }
        if (this.value instanceof TowerError) {
            throw this.value;
        }
        return this.value;
    }
}
