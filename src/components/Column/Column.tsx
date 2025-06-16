import { useLocation } from 'wouter';
import Button from '../Button';
import { setCurrentColumn } from '../../utils/state';
import { pages } from '../../utils/pages';
import type { ColumnType } from '../../utils/interfaces';

export interface ColumnProps {
  id: string;
  name: string;
  value: string;
  type: ColumnType['type'];
}

export function Column(props: ColumnProps) {
  const [_, navigate] = useLocation();

  const inspectColumn = () => {
    setCurrentColumn(props);
    navigate(pages.inspectColumn);
  };

  return <Button onClick={inspectColumn}>{props.name}</Button>;
}
