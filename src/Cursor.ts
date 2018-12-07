import History from "./History";
import App from "./App";
import { findById } from "./ProgramTraversal";
import { Invocation } from "./Invocation";


const log = console.log;

export default class Cursor {
    public history: History;
    private app: App;

    constructor(app: App) {
        this.app = app;
        this.history = new History();
    }

    public findCanAboveCursor() {
        const result = findById(
            this.app.currentTower(),
            this.app.state.canCursorId
        );
        if (!result) {
            log("No result found. Assuming bottom.");
            return this.app.currentTower().rootBrick.uniqueId;
        }
        const brick = result.brick;
        if (brick instanceof Invocation && brick.args.length > 0) {
            return brick.args[0].uniqueId;
        } else {
            return null;
        }
    }

    public findCanBelowCursor() {
        const result = findById(
            this.app.currentTower(),
            this.app.state.canCursorId
        );
        console.log("Trying to find below cursor", result);
        if (!result) {
            log("No result found. Assuming bottom.");
            return this.app.currentTower().rootBrick.uniqueId;
        }
        if (result.path.length === 0) {
            log("Bottom of tower. Cannot go down.");
            return null;
        }
        return result.path[result.path.length - 1].uniqueId;
    }

    public findCanToLeftOfCursor() {
        const result = findById(
            this.app.currentTower(),
            this.app.state.canCursorId
        );
        if (!result) {
            log("No result found. Assuming bottom.");
            return this.app.currentTower().rootBrick.uniqueId;
        }
        if (result.path.length === 0) {
            log("Bottom of tower. Cannot go down.");
            return null;
        }
        const parent = result.path[result.path.length - 1];
        const index = parent.args.indexOf(result.brick);
        if (index === 0) {
            // just move down.
            return parent.uniqueId;
        }
        return parent.args[index - 1].uniqueId;
    }

    public findCanToRightOfCursor() {
        const result = findById(
            this.app.currentTower(),
            this.app.state.canCursorId
        );
        if (!result) {
            log("No result found. Assuming bottom.");
            return this.app.currentTower().rootBrick.uniqueId;
        }
        if (result.path.length === 0) {
            log("Bottom of tower. Cannot go down.");
            return null;
        }
        const parent = result.path[result.path.length - 1];
        const index = parent.args.indexOf(result.brick);
        if (index + 1 === parent.args.length) {
            // just move down.
            return parent.uniqueId;
        }
        return parent.args[index + 1].uniqueId;
    }

    public moveCursorTo(uniqueId: string | null) {
        if (uniqueId === null) {
            return;
        }
        this.app.setState({
            canCursorId: uniqueId
        });
    }
}