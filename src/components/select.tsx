import { HTMLProps } from "react";

type Option = { id: string; name: string; group: string };

type Props<T extends Option = Option> = {
  options: readonly T[];
} & HTMLProps<HTMLSelectElement>;

const Select = <T extends Option = Option>({ options, ...props }: Props<T>) => {
  //group into object by group value
  const grouped = options.reduce<Record<string, Option[]>>((pre, curr) => {
    pre[curr.group] = [...(pre[curr.group] || []), curr];
    return pre;
  }, {});

  return (
    <select {...props}>
      {options.map((o) => o.id).includes(`${props.defaultValue}`) ? null : (
        <option hidden>Select Option</option>
      )}
      {Object.keys(grouped).map((group) => (
        <optgroup
          key={group}
          label={group}
          children={grouped[group].map((opt) => (
            <option key={`${group}_${opt.id}`} value={opt.id}>
              {opt.name}
            </option>
          ))}
        />
      ))}
    </select>
  );
};

export default Select;
