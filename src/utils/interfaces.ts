export interface ColumnType {
  id: string;
  name: string;
  value: string;
  type: 'date' | 'target' | 'rowNumber';
  target?: string;
}

/**
 * index
 * className
 * tag
 *
 * [{
 *  index: 2
 * }]
 */

export interface SheetType {
  name: string;
  id: string;
  columns: ColumnType[];
  currentRow: number;
}

export interface ValueRange {
  range: string;
  majorDimension: 'ROWS' | 'COLUMNS';
  values: Array<Array<string | number>>;
}
