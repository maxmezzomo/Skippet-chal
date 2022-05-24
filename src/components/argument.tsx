import { HTMLAttributes, HTMLProps, useEffect, useState } from "react";
import { Arg, ArgsApi } from "../types/arg";

export type Props = Arg & { actions: Pick<ArgsApi, "remove" | "update"> } & {
  isNew?: boolean;
};

const ToggleButton = ({
  style,
  ...props
}: HTMLAttributes<HTMLButtonElement>) => {
  const [isHovered, setHovered] = useState(false);

  const colorStyle = {
    background: isHovered ? "#aaa" : "#ccc",
    color: isHovered ? "#111" : "#333",
    border: "none",
  };

  const hoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  return (
    <button {...hoverProps} {...props} style={{ ...colorStyle, ...style }}>
      toggle
    </button>
  );
};

const RemoveButton = ({
  style,
  ...props
}: HTMLAttributes<HTMLButtonElement>) => {
  const [isHovered, setHovered] = useState(false);

  const colorStyle = {
    background: isHovered ? "#ff0000" : "#ff8c00",
    color: isHovered ? "#111" : "#333",
    border: "none",
  };

  const hoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  return (
    <button {...hoverProps} {...props} style={{ ...colorStyle, ...style }}>
      delete
    </button>
  );
};

type NameInputProps = {
  initial: {
    value: string;
    isEditing: boolean;
  };
  onSave: (value: string) => void;
} & HTMLProps<HTMLDivElement>;

const NameInput = ({ initial, onSave, style, ...props }: NameInputProps) => {
  const [isEditing, setEditing] = useState(initial.isEditing);
  const [value, setValue] = useState(initial.value);

  useEffect(() => setEditing(initial.isEditing), [initial.isEditing]);

  const submit = (value: string) => onSave(value);

  const height = 24;

  return (
    <div style={{ display: "flex", ...style }} {...props}>
      {isEditing ? (
        <>
          <input
            style={{ width: "80%", boxSizing: "border-box", height }}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            autoFocus
          />
          <button
            onClick={() => {
              setEditing(false);
              submit(value);
            }}
          >
            ok
          </button>
        </>
      ) : (
        <div style={{ height }} onClick={() => setEditing(true)}>
          {value}
        </div>
      )}
    </div>
  );
};

const Argument = ({ id, name, value, actions, isNew = false }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        outline: "1px solid grey",
        height: "4em",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: "1",
        }}
      >
        <NameInput
          initial={{ value: name, isEditing: isNew }}
          onSave={(name) => actions.update(id, { name })}
          style={{ fontWeight: 700, fontStyle: "italic" }}
        />
        <div style={{ fontSize: 14, fontWeight: "lighter" }}>
          {`(${value})`}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "fit-content",
          minWidth: "30%",
        }}
      >
        <ToggleButton
          style={{ height: "66%" }}
          onClick={() => actions.update(id, { value: !value })}
        />
        <RemoveButton
          style={{ height: "34%" }}
          onClick={() => actions.remove(id)}
        />
      </div>
    </div>
  );
};

export default Argument;
