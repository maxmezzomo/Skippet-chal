import { ExpressionNode, GetFunctions } from "../types";
import { Option } from "../App";
import Select from "./select";
import { Fragment, HTMLProps } from "react";
import { evaluate, getNewNode, getToken } from "../lib/expression";

type Props = {
  node: ExpressionNode;
  getFunctions: GetFunctions;
  options: Option[];
  onUpdate: (id: string, body: Partial<ExpressionNode>) => void;
} & HTMLProps<HTMLDivElement>;

// const getRenderChildren = makeGet({})
//or better get render core/body/main

const NodeView = ({
  node,
  getFunctions,
  options,
  onUpdate,
  style,
  ...props
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        // margin: "1vw",
        // padding: ".5vw",
        margin: 20,
        padding: 10,
        border: "1px solid grey",
        // borderRadius: "50%", //uncomment for fancy stuff
        ...style,
      }}
      {...props}
    >
      <Select
        style={{ display: "flex", minWidth: "25%" }}
        defaultValue={node.refId}
        options={options}
        onChange={(e) => {
          const id = e.currentTarget.value;
          const option = options.find((opt) => opt.id === id);
          onUpdate(node.id, {
            nodeType: option.nodeType,
            refId: option.id,
            //ensure node will have two children
            children: [
              ...node.children,
              ...Array.from({ length: 2 - node.children.length }, () =>
                getNewNode(node.id)
              ),
            ],
          });
        }}
      />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          // flexWrap: "wrap",
          flex: "1",
        }}
      >
        {/*only show children for operators
         we avoid deleting them its likely okay for now,
        and useful for user when changing operation without losing children */}
        {node.nodeType === "operator" &&
          node.children
            .sort((n, m) => n.id.localeCompare(m.id))
            .map((n, index) => (
              <Fragment key={n.id}>
                <NodeView
                  node={n}
                  getFunctions={getFunctions}
                  options={options}
                  onUpdate={onUpdate}
                />
                {index === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "1em",
                    }}
                  >
                    {getToken(node, getFunctions)}
                  </div>
                ) : null}
              </Fragment>
            ))}
      </div>
      <div style={{ width: "100%", textAlign: "center" }}>{`${evaluate(
        node,
        getFunctions
      )}`}</div>
    </div>
  );
};

export default NodeView;
