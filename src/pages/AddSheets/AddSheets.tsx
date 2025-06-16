import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import LoadCircle from '../../components/LoadCircle';
import { Sheet } from '../../components/Sheet/Sheet';
import { getSheets } from '../../utils/api';
import { useEffect, useState } from 'preact/hooks';
import Button from '../../components/Button';
import { $currentSheets, updateSheets } from '../../utils/state';
import type { SheetType } from '../../utils/interfaces';
import { useStore } from '@nanostores/preact';
import { pages } from '../../utils/pages';

export function AddSheets() {
  const currentSheets = useStore($currentSheets);
  const [selected, setSelected] = useState<Array<string>>([]);
  const [_location, navigate] = useLocation();

  const availableSheetsQuery = useQuery({
    queryKey: ['availableSheets'],
    queryFn: getSheets,
  });

  const addSheets = () => {
    const sheetsToAdd = availableSheetsQuery.data
      .filter((sheet: SheetType) => {
        return selected.includes(sheet.id);
      })
      .map((sheet: SheetType) => {
        sheet.currentRow = 1;
        sheet.columns = [];
        return sheet;
      });

    // we're going to remove sheets as well?
    updateSheets(sheetsToAdd);
    navigate(pages.home);
  };

  const addToSelected = (item: string) => {
    if (selected.includes(item)) {
      setSelected((prev) => prev.filter((i) => i !== item));
    } else {
      setSelected((prev) => [...prev, item]);
    }
  };

  if (availableSheetsQuery.isLoading) {
    return (
      <div>
        <h2>Available Sheets</h2>
        <LoadCircle />
      </div>
    );
  }

  if (availableSheetsQuery.isError) {
    <div>
      <h2>Available Sheets</h2>
      <p>Unable to load available sheets</p>
    </div>;
  }

  useEffect(() => {
    const ids = currentSheets.map((sheet) => sheet.id);
    setSelected(ids);
  }, [currentSheets]);

  return (
    <div className="w-full">
      <h2>Available Sheets</h2>
      <div className={`w-full overflow-x-auto flex gap-3 my-2 p-2`}>
        {availableSheetsQuery.data?.map((sheet: SheetType, index: number) => (
          <Sheet
            selected={selected.includes(sheet.id)}
            onClick={addToSelected}
            key={index}
            name={sheet.name}
            id={sheet.id}
          />
        ))}
      </div>
      <Button onClick={addSheets}>Import Selected</Button>
      <Link to="/">Back Home</Link>
    </div>
  );
}
