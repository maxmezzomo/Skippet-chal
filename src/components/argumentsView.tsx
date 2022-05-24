import { HTMLProps, useState } from "react";
import { Arg, ArgsApi } from "../types";
import { Argument } from "./";

type Props = { args: Arg[]; actions: ArgsApi } & HTMLProps<HTMLDivElement>;

const ArgumentsView = ({ args, actions, style, ...props }: Props) => {
  const [newArgs, setNewArgs] = useState<string[]>([]);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", ...style }}
      {...props}
    >
      <button
        onClick={() => {
          const arg = actions.add();
          setNewArgs([arg.id]);
        }}
      >
        Add Argument
      </button>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {args
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((arg) => (
            <li key={arg.id} style={{ margin: 5 }}>
              <Argument
                {...arg}
                actions={actions}
                isNew={newArgs.includes(arg.id)}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ArgumentsView;
