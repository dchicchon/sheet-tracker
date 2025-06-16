// can this inject state exist in our code
import type { SheetType } from './interfaces';

import { persistentAtom as pAtom } from '@nanostores/persistent';

// this is how we can read it
export const $currentSheets = pAtom<SheetType[]>('sheets', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const $selectedSheet = pAtom<SheetType | undefined>('currentSheet', undefined, {
  encode: JSON.stringify,
  decode: JSON.parse,
});
