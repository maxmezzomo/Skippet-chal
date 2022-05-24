import { useState } from "react";
import { ExpressionNode } from "../types";

const useExpression = (initialNodes: ExpressionNode[]) => {
  const [nodes, setNodes] = useState<ExpressionNode[]>(initialNodes);

  const find = (
    id: string,
    node?: ExpressionNode
  ): ExpressionNode | undefined => {
    if (!node) return;
    if (node.id === id) return node;
    return [...node.children].reduce<ExpressionNode | undefined>(
      (pre, curr) => pre || find(id, curr),
      undefined
    );
  };

  const updateNode = (node: ExpressionNode, body: Partial<ExpressionNode>) => {
    const updatedNode = { ...node, ...body, id: node.id }; //same id
    if (!node.parentId) {
      setNodes([updatedNode]);
      return updatedNode;
    }
    const parent = find(node.parentId, nodes[0]);

    if (parent) {
      updateNode(parent, {
        children: [
          ...parent.children.filter((n) => n.id !== node.id),
          updatedNode,
        ],
      });
    }
  };

  return { root: nodes[0], find, updateNode } as const;
};

export default useExpression;
