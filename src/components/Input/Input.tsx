export interface InputProps extends React.InputHTMLAttributes {
  value: string | number;
  handleChange?: (val: string) => void;
}
export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={'rounded-md border-blue-600 border-2 p-2'}
      value={props.value}
      onChange={(event) => {
        if (props.disabled || !props.handleChange) return;
        props.handleChange(event.currentTarget.value);
      }}
    />
  );
}
