import { useLocation } from 'wouter';
import Button from '../../components/Button';
import { useQuery } from '@tanstack/react-query';
import {
  $currentSheets,
  $selectedSheet,
  setCurrentColumn,
  setSelectedSheet,
} from '../../utils/state';
import type { SheetType } from '../../utils/interfaces';
import Sheet from '../../components/Sheet';
import CurrentSheet from '../../components/CurrentSheet';
import { useStore } from '@nanostores/preact';
import { pages } from '../../utils/pages';
import { useEffect } from 'preact/hooks';

export function Home() {
  const [_location, navigate] = useLocation();
  const selectedSheet = useStore($selectedSheet);

  const getSheets = () => {
    const sheets = $currentSheets.get();
    return sheets;
  };

  const sheets = useQuery({
    queryKey: ['sheets'],
    queryFn: getSheets,
  });

  const selectSheet = (id: string) => {
    setSelectedSheet(id);
  };

  useEffect(() => {
    setCurrentColumn(undefined);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl">Sheet Tracker</h2>

      <div>
        <Button
          onClick={() => {
            navigate(pages.importSheets);
          }}
        >
          Import Sheets
        </Button>
      </div>

      {/* use components? */}
      <div>
        <h2>Current Sheets</h2>
        <div className="flex gap-3 mt-2">
          {sheets.data?.map((sheet: SheetType, index: number) => (
            <Sheet
              key={index}
              selected={selectedSheet?.id === sheet.id}
              name={sheet.name}
              id={sheet.id}
              onClick={selectSheet}
            />
          ))}
        </div>
      </div>

      <CurrentSheet />
    </div>
  );
}
