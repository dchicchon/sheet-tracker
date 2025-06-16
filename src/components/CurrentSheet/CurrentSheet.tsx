import { useStore } from '@nanostores/preact';
import { $selectedSheet, addRow, setRowNum } from '../../utils/state';
import type { ColumnType } from '../../utils/interfaces';
import { Column } from '../Column/Column';
import Button from '../Button';
import { useLocation } from 'wouter';
import { pages } from '../../utils/pages';
import Input from '../Input';

export function CurrentSheet() {
  const [_location, navigate] = useLocation();
  const selectedSheet = useStore($selectedSheet);

  const addColumn = () => {
    navigate(pages.inspectColumn);
  };

  const handleCurrentRowChange = (val: string) => {
    console.log('handleRowChange');
    const newNum = parseInt(val);
    setRowNum(newNum);
  };

  const targetColumns = async () => {
    if (selectedSheet === undefined) return;
    const columns = selectedSheet.columns.filter((column) => column.target);
    const columnResults: { [key: string]: string } = {};
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (targetColumns) => {
        function createOverlay() {
          const overlay = document.createElement('div');
          overlay.style.position = 'absolute';
          overlay.className = 'tracker-hover-overlay';
          overlay.style.pointerEvents = 'none';
          overlay.style.border = '2px dashed blue';
          overlay.style.zIndex = '9999';
          overlay.style.transition = 'all 0.05s ease';
          document.body.appendChild(overlay);
          return overlay;
        }
        const feedData: Array<{ data: string | undefined; columnId: string }> = [];
        targetColumns.forEach((column) => {
          if (!column.target) return;
          const foundElm = document.querySelector(column.target);
          if (foundElm === null) {
            // should we return that we were not able to find the elm?
            console.log('unable to find element');
          } else {
            const overlay = createOverlay();
            const rect = foundElm.getBoundingClientRect();
            overlay.style.top = `${rect.top + window.scrollY}px`;
            overlay.style.left = `${rect.left + window.scrollX}px`;
            overlay.style.width = `${rect.width}px`;
            overlay.style.height = `${rect.height}px`;
            feedData.push({
              data: foundElm.textContent?.trim(),
              columnId: column.id,
            });
          }
        });
        return feedData;
      },
      args: [columns],
    });
    const [frameResult] = injectionResults;
    frameResult.result!.forEach(
      (item: { columnId: string; data: string | undefined }) => {
        if (item.data !== undefined) {
          columnResults[item.columnId] = item.data;
        } else {
          columnResults[item.columnId] = '~';
        }
      }
    );
    const rowValues = selectedSheet.columns.map((column) => {
      if (column.type === 'date') {
        const today = new Date();
        return today.toLocaleDateString();
      } else if (column.type === 'rowNumber') {
        return selectedSheet.currentRow.toString();
      }

      if (columnResults[column.id]) {
        return columnResults[column.id];
      }
      return '';
    });
    await addRow(rowValues);
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const overlays = document.querySelectorAll('.tracker-hover-overlay');
        overlays.forEach((overlay) => overlay.remove());
      },
    });
  };

  if (selectedSheet === undefined) {
    return (
      <div>
        <h2>No Sheet Selected</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-2">
      <h2 className="text-xl">{selectedSheet.name}</h2>
      <Input
        type="number"
        min={2}
        value={selectedSheet.currentRow}
        handleChange={handleCurrentRowChange}
      />

      <div className="flex gap-2 overflow-x-auto">
        {selectedSheet.columns?.map((column: ColumnType) => (
          <Column
            key={column.id}
            id={column.id}
            name={column.name}
            value={column.value}
            type={column.type}
          />
        ))}
      </div>

      <Button onClick={addColumn}>Add Column</Button>
      <Button onClick={targetColumns}>Target Columns</Button>
      {/* <Button onClick={activateTracker}>Activate Tracker</Button> */}
      {/* <Button onClick={setTrigger}>Set Trigger</Button> */}
      {/* <Button onClick={testWrite}>Test Write</Button> */}
    </div>
  );
}
