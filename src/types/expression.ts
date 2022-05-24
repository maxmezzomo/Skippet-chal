import { Operator, Arg, Constant } from ".";

//~source of truth
//todo: check if need readonly
export type NodeTypes = {
  readonly operator: Operator;
  readonly arg: Arg;
  readonly constant: Constant;
};

export type NodeType = keyof NodeTypes;

export type ExpressionNode<T extends NodeType = NodeType> = {
  readonly nodeType: T;
  readonly id: string;
  readonly parentId: string | null;
  readonly refId: string | null; //ref of object linked to node
  readonly children: ExpressionNode[];
};

export type GetFunctions = {
  [k in keyof NodeTypes]: (node: ExpressionNode<k>) => NodeTypes[k] | undefined;
};
