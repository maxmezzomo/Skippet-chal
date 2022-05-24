import { useMemo, useState } from "react";
import { ArgumentsView, NodeView } from "./components";
import { useExpression } from "./hooks";
import { evaluate, getExpression } from "./lib/expression";
import uid from "./lib/uid";
import {
  Constant,
  Operator,
  Arg,
  ExpressionNode,
  NodeType,
  GetFunctions,
  ArgsApi,
} from "./types";

const OPERATORS: Operator[] = [
  { name: "and", token: "&&", func: (a, b) => a && b },
  {
    name: "or",
    token: "||",
    func: (a, b) => a || b,
  },
  { name: "not", token: "!=", func: (a, b) => a !== b },
];

const CONSTANTS: Constant[] = [
  { name: "true", value: true },
  { name: "false", value: false },
];

type Props = {
  constants: Constant[];
  operators: Operator[];
};

export type Option = {
  readonly id: string;
  readonly name: string;
  readonly group: string;
  readonly nodeType: NodeType;
};

const testNodes: [ExpressionNode<NodeType>] = [
  {
    nodeType: "operator",
    id: "root",
    parentId: null,
    refId: "and",
    children: [
      {
        nodeType: "constant",
        id: "1",
        parentId: "root",
        refId: "true",
        children: [],
      },
      {
        nodeType: "operator",
        id: "2",
        parentId: "root",
        refId: "or",
        children: [
          {
            nodeType: "constant",
            id: "3",
            parentId: "2",
            refId: "false",
            children: [],
          },
          {
            nodeType: "constant",
            id: "4",
            parentId: "2",
            refId: "true",
            children: [],
          },
        ],
      },
    ],
  },
];

const initialNode: ExpressionNode = {
  nodeType: "constant",
  id: "root",
  parentId: null,
  refId: undefined,
  children: [],
};

const testArgs: Arg[] = [
  { name: "x", value: true },
  { name: "y", value: false },
].map((a, i) => ({ ...a, id: uid(), createdAt: Date.now() + i }));

const OperationBuilder = ({ constants, operators }: Props) => {
  const [args, setArgs] = useState<Arg[]>(testArgs);
  // const { root, find, updateNode } = useExpression([initialNode]);

  const { root, find, updateNode } = useExpression(testNodes);

  const argsApi: ArgsApi = useMemo(
    () => ({
      add: () => {
        const newArg: Arg = {
          name: `arg ${args.length + 1}`,
          id: uid(),
          createdAt: Date.now(),
          value: true,
        };
        setArgs((args) => [...args, newArg]);
        return newArg;
      },
      update: (id, attributes) => {
        const arg = args.find((arg) => arg.id === id);
        if (!arg) return;
        const updated = { ...arg, ...attributes };
        setArgs([...args.filter((arg) => arg.id !== id), updated]);
        return updated;
      },
      remove: (id) => {
        const arg = args.find((arg) => arg.id === id);
        setArgs(args.filter((arg) => id !== arg.id));
        return arg;
      },
    }),
    [args]
  );

  const options: Option[] = useMemo(
    () => [
      ...operators.map(
        ({ name }) =>
          ({
            id: name,
            name,
            group: "operators",
            nodeType: "operator",
          } as const)
      ),
      ...constants.map(
        ({ name }) =>
          ({
            id: name,
            name,
            group: "constants",
            nodeType: "constant",
          } as const)
      ),
      ...args.map(
        ({ name, id }) =>
          ({
            id,
            name,
            nodeType: "arg",
            group: "arguments",
          } as const)
      ),
    ],
    [args, constants, operators]
  );

  //we're just using name as id for constant and operator for simplicity's sake
  //relevant on getFunctions and options

  const getFunctions: GetFunctions = useMemo(
    () => ({
      arg: (node) => args.find((arg) => arg.id === node.refId),
      constant: (node) => constants.find((c) => c.name === node.refId),
      operator: (node) => operators.find((o) => o.name === node.refId),
    }),
    [args, constants, operators]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <ArgumentsView
        args={args}
        actions={argsApi}
        style={{ width: "20%", minWidth: "10em" }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <NodeView
          node={root}
          options={options}
          getFunctions={getFunctions}
          onUpdate={(id, body) => {
            updateNode(find(id, root), body);
          }}
          style={{ marginTop: 0 }}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          {getExpression(root, getFunctions)}
          {"="}
          <strong>{`${evaluate(root, getFunctions)}`}</strong>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <OperationBuilder constants={CONSTANTS} operators={OPERATORS} />
    </div>
  );
}
