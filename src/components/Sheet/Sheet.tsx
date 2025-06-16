export interface SheetProps {
  name: string;
  onClick: (val: string) => void;
  selected?: boolean;
  id: string;
}

export function Sheet(props: SheetProps) {
  const clickSheet = () => {
    props.onClick(props.id);
  };

  return (
    <button
      className={`${
        props.selected ? 'outline-white' : 'outline-indigo-600'
      } outline-3 rounded-md p-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700`}
      onClick={clickSheet}
    >
      <h2>{props.name}</h2>
    </button>
  );
}
