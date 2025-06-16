import type { TargetedEvent } from 'preact/compat';

export interface SelectProps extends React.SelectHTMLAttributes {
  value: number | string;
  onChange: (event: TargetedEvent<HTMLSelectElement>) => void;
  options: Array<string>;
}

export function Select(props: SelectProps) {
  return (
    <select
      className="p-2 rounded-md border-blue-600 border-2"
      {...props}
      onChange={props.onChange}
    >
      {props.options.map((option, index) => (
        <option value={option} key={index}>
          {option}
        </option>
      ))}
    </select>
  );
}
