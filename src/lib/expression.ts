import { ExpressionNode, GetFunctions, NodeType, NodeTypes } from "../types";
import uid from "./uid";

const makeGet = <O extends unknown>(
  mapFunctions: {
    [k in NodeType]: (
      obj: NodeTypes[k],
      node: ExpressionNode<k>,
      get: GetFunctions
    ) => O;
  },
  onUndefined: () => O = () => undefined
) => {
  return <T extends NodeType>(node: ExpressionNode<T>, get: GetFunctions) => {
    const obj = get[node.nodeType](node);
    if (!obj) {
      return onUndefined();
    }
    return mapFunctions[node.nodeType](obj, node, get);
  };
};

export const getNewNode = (parentId: string): ExpressionNode => ({
  id: uid(),
  children: [],
  nodeType: "arg",
  parentId: parentId,
  refId: undefined,
});

export const evaluate: (node: ExpressionNode, get: GetFunctions) => boolean =
  makeGet({
    arg: (arg) => arg.value,
    constant: (constant) => constant.value,
    operator: (operator, node, get) => {
      if (node.children.length !== 2) {
        return;
      }
      return operator.func(
        evaluate(node.children[0], get),
        evaluate(node.children[1], get)
      );
    },
  });

export const getToken = makeGet({
  arg: (arg) => arg.name,
  constant: (constant) => constant.name,
  operator: (operator) => operator.token,
});

export const getExpression: (
  node: ExpressionNode,
  get: GetFunctions
) => string = makeGet<string>(
  {
    arg: (_, node, get) => getToken(node, get),
    constant: (_, node, get) => getToken(node, get),
    operator: (_, node, get) =>
      `(${node.children
        .map((n) => getExpression(n, get))
        .join(getToken(node, get))})`,
  },
  () => "undefined"
);
