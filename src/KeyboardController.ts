import { Invocation } from "./Invocation";
import { findById, ITraversalResult } from "./ProgramTraversal";
import { Socket } from "./Socket";
import History from "./History";
import { Constant } from "./Constant";
import App from "./App";
import { copyTowerObject } from "./CopyTowerObject";
import { Brick } from "./Brick";
import Cursor from "./Cursor";

const log = console.log;

export default class KeyboardController {
  public history: History;
  private app: App;
  private cursor: Cursor;

  constructor(app: App) {
    this.app = app;
    this.history = new History();
    this.cursor = new Cursor(this.app);
  }

  public registerKeyEvents() {
    document.addEventListener("keydown", e => {
      this.onKeyDown(e);
      return true;
    });
  }

  public enterInsertMode() {
    this.app.setState({
      editorMode: "insert"
    });
  }

  public enterCursorMode() {
    this.app.setState({
      editorMode: "cursor"
    });
  }

  public deleteSelectedCan() {
    const result = findById(
      this.app.currentTower(),
      this.app.state.canCursorId
    );
    if (!result) {
      throw new Error("Couldn't find can to delete.");
    }
    this.replaceResult(result, new Socket());
    this.app.setState({
      editorMode: "cursor"
    });
    this.app.modulesChanged();
  }

  public replaceResult(result: ITraversalResult, value: Brick) {
    const parent = result.path[result.path.length - 1];
    if (parent) {
      const index = parent.args.indexOf(result.brick);
      parent.args[index] = value;
      this.app.setState({
        canCursorId: parent.args[index].uniqueId
      });
    } else {
      this.app.currentTower().rootBrick = value;
      this.app.setState({
        canCursorId: this.app.currentTower().rootBrick.uniqueId
      });
    }
  }

  public visitSelectedBrick() {
    const result = findById(
      this.app.currentTower(),
      this.app.state.canCursorId
    );
    if (result === false) {
      console.log("Could not find brick");
      return;
    }
    if (!(result.brick instanceof Invocation)) {
      return;
    }
    const brick = result.brick.libraryFunction(
      this.app.state.library,
      this.app.state.modules
    );
    if (!brick.brickKey || !brick.moduleKey) {
      return;
    }
    console.log("Got module", brick, "key", brick.moduleKey);
    this.app.setState({
      currentBrickId: brick.brickKey,
      currentModuleId: brick.moduleKey
    });
    this.history.remember(brick.moduleKey, brick.brickKey);
  }

  public goBack() {
    const current = this.history.goBack();
    console.log("going back", current);
    this.app.setState({
      currentBrickId: current.brickKey,
      currentModuleId: current.moduleKey
    });
  }

  public goForwards() {
    const current = this.history.goForwards();
    console.log("going forwards", current);
    this.app.setState({
      currentBrickId: current.brickKey,
      currentModuleId: current.moduleKey
    });
  }

  public editConstant() {
    this.app.setState({
      editorMode: "constant"
    });
    const result = findById(
      this.app.currentTower(),
      this.app.state.canCursorId
    );
    if (result === false) {
      return;
    }
    let constant;
    if (!(result.brick instanceof Constant)) {
      constant = new Constant({ value: "" });
      this.replaceResult(result, constant);
    }
  }

  public goToTestMode() {
    this.app.setState({
      editorMode: "test"
    });
  }

  public renameBrick() {
    this.app.setState({
      editorMode: "naming"
    });
  }

  public copyToSky() {
    const result = findById(
      this.app.currentTower(),
      this.app.state.canCursorId
    );
    if (result === false) {
      console.log("Could not find brick.");
      return;
    }
    this.app.state.sky.moveIn(copyTowerObject(result.brick));
    this.app.setState({});
  }

  public copyFromSky() {
    const result = findById(
      this.app.currentTower(),
      this.app.state.canCursorId
    );
    const skyItem = this.app.state.sky.peek();
    if (skyItem === null) {
      console.log("Nothing in the sky to copy.");
      return;
    }
    if (result === false) {
      return;
    }
    this.replaceResult(result, copyTowerObject(skyItem));
  }

  public clearSky() {
    this.app.state.sky.clear();
    this.app.setState({});
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.metaKey) {
      // Don't interfere with browser shortcuts
      return true;
    }
    if (e.code === "Escape") {
      this.enterCursorMode();
    }
    if (this.app.state.editorMode !== "cursor") {
      return true;
    }
    // if (e.target !== window.document.body) {
    //     return true;
    // }
    switch (e.code) {
      case "KeyU":
        this.app.undo();
        break;
      case "KeyY":
        this.app.redo();
        break;
      case "KeyI":
        this.enterInsertMode();
        break;
      case "KeyD":
        this.deleteSelectedCan();
        break;
      case "KeyM":
        this.visitSelectedBrick();
        break;
      case "KeyE":
        this.goBack();
        break;
      case "KeyR":
        this.goForwards();
        break;
      case "KeyT":
        this.goToTestMode();
        break;
      case "KeyN":
        this.renameBrick();
        break;
      case "KeyO":
        this.editConstant();
        break;
      case "KeyJ":
        this.cursor.moveCursorTo(this.cursor.findCanBelowCursor());
        break;
      case "KeyK":
        this.cursor.moveCursorTo(this.cursor.findCanAboveCursor());
        break;
      case "KeyH":
        this.cursor.moveCursorTo(this.cursor.findCanToLeftOfCursor());
        break;
      case "KeyL":
        this.cursor.moveCursorTo(this.cursor.findCanToRightOfCursor());
        break;
      case "KeyC":
        this.copyToSky();
        break;
      case "KeyV":
        this.copyFromSky();
        break;
      case "KeyF":
        this.clearSky();
        break;
      default:
        return true;
    }
    e.preventDefault();
    return false;
  }
}
