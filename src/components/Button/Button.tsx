import type { ButtonHTMLAttributes } from 'preact/compat';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={'bg-blue-800 rounded-md p-3 cursor-pointer hover:bg-blue-700'}
    >
      {props.children}
    </button>
  );
}
