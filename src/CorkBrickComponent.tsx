import * as React from "react";
import classnames from "classnames";
import {ICork, ILibrary, IModules, EditorMode} from "./Types";
import "./CorkBrickComponent.css";

interface IProps {
    contents: ICork;
    editorMode: EditorMode;
    onCanInserted: any;
    canCursorId: string;
    library: ILibrary;
    modules: IModules;
}

export const CorkBrickComponent: React.SFC<IProps> = (props) => {
    const selected = props.canCursorId === props.contents.uniqueId;
    return <div className={classnames("CorkBrickComponent", {"is-selected": selected})}>
        CORK
    </div>;

}