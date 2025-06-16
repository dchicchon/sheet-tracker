import { atom } from 'nanostores';
import { persistentAtom as pAtom } from '@nanostores/persistent';
import type { ColumnType, SheetType, ValueRange } from './interfaces';
import { updateSheet as updateSheetAPI } from './api';

export const $hasAuth = atom<boolean>(false);
export const setAuth = (bool: boolean) => {
  $hasAuth.set(bool);
};

export const $currentColumn = atom<ColumnType | undefined>();
export const setCurrentColumn = (val: ColumnType | undefined) => {
  $currentColumn.set(val);
};

export const $currentSheets = pAtom<SheetType[]>('sheets', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const updateSheets = (sheets: Array<SheetType>) => {
  const selectedSheet = $selectedSheet.get();
  const currentSheets = $currentSheets.get();

  const currentSheetNames = currentSheets.map((sheet) => sheet.name);

  if (selectedSheet !== undefined) {
    const containsSelected = sheets.some((sheet) => {
      return sheet.id === selectedSheet.id;
    });
    if (!containsSelected) {
      $selectedSheet.set(undefined);
    }
  }

  sheets = sheets.map((sheet) => {
    if (currentSheetNames.includes(sheet.name)) {
      const oldSheet = currentSheets.find(
        (currentSheet) => currentSheet.name === sheet.name
      );
      if (oldSheet) {
        return oldSheet;
      }
    }
    return sheet;
  });

  $currentSheets.set(sheets);
};

export const $selectedSheet = pAtom<SheetType | undefined>('currentSheet', undefined, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const setSelectedSheet = (id: string) => {
  const currentSheets = $currentSheets.get();
  const currentSheet = currentSheets.find((sheet) => sheet.id === id);
  $selectedSheet.set(currentSheet);
};

export const addColumnToSheet = async (newColumn: ColumnType) => {
  const selectedSheet = $selectedSheet.get();
  if (selectedSheet === undefined) return;

  const foundDupe = selectedSheet.columns.some((column) => {
    return column.name === newColumn.name || column.value === newColumn.value;
  });

  if (foundDupe) {
    console.log('Unable to add duplicated value');
    return;
  }

  const updates: ValueRange = {
    range: newColumn.value,
    majorDimension: 'ROWS',
    values: [[newColumn.name]],
  };

  const data = await updateSheetAPI(selectedSheet.id, updates);
  console.log(data);

  // increase rowNumber to specified value
  if (selectedSheet.columns.length === 0) {
    // current row should be 1 above the specifed column value
    const [_, rowNum] = newColumn.value.split('');
    selectedSheet.currentRow = parseInt(rowNum) + 1;
  }

  selectedSheet.columns.push(newColumn);
  updateSelectedSheet(selectedSheet);
};

export const updateColumn = (updatedColumn: ColumnType) => {
  const selectedSheet = $selectedSheet.get();
  if (selectedSheet === undefined) return;
  selectedSheet.columns = selectedSheet.columns.map((column: ColumnType) => {
    // column name can change. consider setting an id instead?
    if (column.id === updatedColumn.id) {
      return updatedColumn;
    }
    return column;
  });
  updateSelectedSheet(selectedSheet);
};

export const removeColumnFromSheet = (columnToDelete: ColumnType) => {
  const selectedSheet = $selectedSheet.get();
  if (selectedSheet === undefined) return;
  selectedSheet.columns = selectedSheet.columns.filter((column) => {
    return column.name !== columnToDelete.name;
  });
  updateSelectedSheet(selectedSheet);
};

export const updateSelectedSheet = (selectedSheet: SheetType) => {
  // we should update by creating a new value?
  const deepCopy = JSON.parse(JSON.stringify(selectedSheet));
  const currentSheets = $currentSheets.get();
  const updatedSheets = currentSheets.map((sheet) => {
    if (sheet.name === selectedSheet.name) {
      return deepCopy;
    }
    return sheet;
  });

  console.log(deepCopy);
  $selectedSheet.set(deepCopy);
  $currentSheets.set(updatedSheets);
};

export const addRow = async (rowValues: string[]) => {
  const selectedSheet = $selectedSheet.get();
  if (selectedSheet === undefined) return;
  if (selectedSheet.columns.length < 1) return;
  const currentNumber = selectedSheet.currentRow;
  const columnRanges = selectedSheet.columns
    .map((column) => column.value.split('')[0])
    .sort();

  let updatedRange: string;
  if (columnRanges.length === 1) {
    updatedRange = `${columnRanges[0]}${currentNumber}`;
  } else {
    updatedRange = `${columnRanges[0]}${currentNumber}:${
      columnRanges[columnRanges.length - 1]
    }${currentNumber}`;
  }
  const updates: ValueRange = {
    range: updatedRange,
    majorDimension: 'ROWS',
    values: [rowValues],
  };

  const data = await updateSheetAPI(selectedSheet.id, updates);
  console.log(data);
  selectedSheet.currentRow++;
  updateSelectedSheet(selectedSheet);
};

export const setRowNum = (val: number) => {
  const selectedSheet = $selectedSheet.get();
  if (selectedSheet === undefined) return;
  selectedSheet.currentRow = val;
  updateSelectedSheet(selectedSheet);
};
