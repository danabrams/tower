import {IInvocation} from "./Types";
import * as React from "react";
import Invocation from "./Invocation";
import {BrickComponent} from "./BrickComponent";
import classnames from "classnames";
import "./InvocationBrickComponent.css";

interface IProps {
    contents: IInvocation;
    editorMode: string;
    onCanClick: any;
    onCanInserted: any;
    canCursorId: string;
    library: any;
    modules: any;
}

function renderName(props: IProps) {
    return Invocation.getName(
        props.contents,
        props.library,
        props.modules
    );
}

function renderArgs(props: IProps) {
    if (!props.contents.args) {
        return null;
    }
    return props.contents.args.map((item: IInvocation, i: number) => {
        return <span key={i} className="InvocationBrickComponent-arg">
            <BrickComponent
                canCursorId={props.canCursorId}
                contents={item}
                editorMode={props.editorMode}
                onCanClick={props.onCanClick}
                onCanInserted={props.onCanInserted}
                library={props.library}
                modules={props.modules}
            />
        </span>;
    });
}

function selectable(selected: boolean, className: string) {
    return classnames(className, {"is-selected": selected});
}

export const InvocationBrickComponent: React.SFC<IProps> = (props) => {
    const s = selectable.bind(null, props.contents.uniqueId === props.canCursorId);

    return <div className={s("InvocationBrickComponent")}>
        <div className="InvocationBrickComponent-argList">
            {renderArgs(props)}
        </div>
        <div className={s("InvocationBrickComponent-top")}/>
        <div className={s("InvocationBrickComponent-side")}>
            <div className={s("InvocationBrickComponent-topFront")}/>
            <div className={s("InvocationBrickComponent-name")}>
                {renderName(props)}
            </div>
        </div>
    </div>;
}