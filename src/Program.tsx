import autobind from "autobind-decorator";
import * as React from "react";
import {BrickComponent} from "./BrickComponent";
import "./Program.css";
import {ILibrary, IModules, EditorMode} from "./Types";

interface IProps {
    contents: any;
    editorMode: EditorMode;
    onCanInserted: any;
    onBrickNameChange: any;
    canCursorId: string;
    library: ILibrary;
    modules: IModules;
}

const style = {
    display: "flex",
    marginTop: "50px"
};

class Program extends React.Component<IProps, {}> {
    public render() {
        return <div>
            <div style={style}>
                <BrickComponent
                    contents={this.props.contents.rootInvocation}
                    editorMode={this.props.editorMode}
                    onCanInserted={this.props.onCanInserted}
                    canCursorId={this.props.canCursorId}
                    library={this.props.library}
                    modules={this.props.modules}
                />
            </div>
        </div>;
    }

    @autobind
    public onBrickNameChange(e: any) {
        this.props.onBrickNameChange(e.target.value);
    }
}

export default Program;
