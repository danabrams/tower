import * as React from "react";
import {ISocket, ILibrary, IModules, EditorMode} from "./Types";
import classnames from "classnames";
import "./SocketComponent.css";

interface IProps {
    contents: ISocket;
    editorMode: EditorMode;
    onCanInserted: any;
    canCursorId: string;
    library: ILibrary;
    modules: IModules;
}

export const SocketComponent: React.SFC<IProps> = (props) => {
    const selected = props.contents.uniqueId === props.canCursorId;
    return <div className={classnames("SocketComponent", {"is-selected": selected})}/>
}