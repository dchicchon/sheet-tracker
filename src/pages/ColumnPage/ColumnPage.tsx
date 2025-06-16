// do we need to pass in props?
import { Link, useLocation } from 'wouter';
import Button from '../../components/Button';
import { useState } from 'preact/hooks';
import {
  $currentColumn,
  addColumnToSheet,
  removeColumnFromSheet,
  updateColumn,
} from '../../utils/state';
import type { ColumnType } from '../../utils/interfaces';
import Input from '../../components/Input';
import { useStore } from '@nanostores/preact';
import { pages } from '../../utils/pages';
import { Select } from '../../components/Select/Select';
import type { TargetedEvent } from 'preact/compat';
import { nanoid } from 'nanoid';

export function ColumnPage() {
  const column = useStore($currentColumn);
  const [_location, navigate] = useLocation();
  const [columnName, setColumnName] = useState(column?.name || '');
  const [columnVal, setColumnVal] = useState(column?.value || '');
  const [columnType, setColumnType] = useState(column?.type || 'target');
  const [columnTarget, setColumnTarget] = useState('');

  const columnTypeOptions: Array<ColumnType['type']> = ['date', 'rowNumber', 'target'];

  const addColumn = async () => {
    validateColumn();
    const column: ColumnType = {
      id: nanoid(),
      name: columnName,
      value: columnVal,
      type: columnType as ColumnType['type'],
      target: columnTarget,
    };

    if (columnType === 'date') {
      column.name = 'Date';
    } else if (columnType === 'rowNumber') {
      column.name = 'Row';
    }

    console.log(column)

    await addColumnToSheet(column);
  };

  const validateColumn = () => {
    if (columnVal.length === 0 || columnType.length == 0) {
      throw Error('Must submit value');
    }
    if (columnType === 'target' && columnName.length === 0) {
      throw Error('Must submit name');
    }

    const regex = /^(?:'[^']+'|[A-Za-z0-9_]+)?!?[A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?$/;
    if (!regex.test(columnVal)) {
      throw Error('Must submit value column value');
    }
  };

  const update = () => {
    if (column === undefined) return;
    validateColumn();

    const updatedColumn: ColumnType = {
      ...column,
      name: columnName,
      value: columnVal,
      type: columnType as ColumnType['type'],
      target: columnTarget,
    };
    updateColumn(updatedColumn);
  };

  const remove = () => {
    if (column === undefined) return;
    removeColumnFromSheet(column);
    navigate(pages.home);
  };

  const injectedFunction = async () => {
    const selectTargetPromise = new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.id = 'hover-overlay';
      overlay.style.pointerEvents = 'none';
      overlay.style.border = '2px dashed blue';
      overlay.style.zIndex = '9999';
      overlay.style.transition = 'all 0.05s ease';
      document.body.appendChild(overlay);

      function mouseMoveHandler(event: MouseEvent) {
        const el = document.elementFromPoint(event.clientX, event.clientY);
        if (
          el &&
          el !== overlay
          // el !== document.body &&
          // el !== document.documentElement &&
        ) {
          const rect = el.getBoundingClientRect();
          overlay.style.top = `${rect.top + window.scrollY}px`;
          overlay.style.left = `${rect.left + window.scrollX}px`;
          overlay.style.width = `${rect.width}px`;
          overlay.style.height = `${rect.height}px`;
        }
      }

      // consider max depth
      function createHTMLStructMap(elm: HTMLElement) {
        let reachedRootNode = false;
        let currentElm = elm;
        let queryMap = [];
        const maxDepth = 25;
        while (!reachedRootNode) {
          if (queryMap.length > maxDepth) {
            console.log('Reached max depth. Unable to select node');
            break;
          }
          if (!currentElm.parentElement) {
            reachedRootNode = true;
          } else {
            const oldElm = currentElm;
            currentElm = currentElm.parentElement;
            for (let i = 0; i < currentElm.children.length; i++) {
              const child = currentElm.children[i];
              if (child === oldElm) {
                // lets build using classNames instead?
                // const queryStr = `${child.tagName}:nth-child(${i + 1})`; // query selectors are 1-indexed
                let queryStr = `${child.tagName}`;
                if (child.classList.length > 0) {
                  // add the classlist here
                  child.classList.forEach((className) => {
                    queryStr = queryStr.concat(`.${className}`);
                  });
                }
                queryMap.push(queryStr);
                break;
              }
            }
          }
        }

        // maybe we don't need to build it here? perhaps just save the array?
        let fullQueryStr = '';
        for (let i = queryMap.length - 1; i >= 0; i--) {
          const item = queryMap[i];
          if (i === 0) {
            fullQueryStr = fullQueryStr.concat(item);
          } else {
            fullQueryStr = fullQueryStr.concat(item, ' > ');
          }
        }

        return fullQueryStr;
      }

      async function mouseClickHandler(event: MouseEvent) {
        event.stopImmediatePropagation();
        event.preventDefault();
        const elm = event.target as HTMLElement;
        document.removeEventListener('mousemove', mouseMoveHandler);
        if (overlay.parentElement) {
          overlay.remove();
        }
        const htmlMap = createHTMLStructMap(elm);
        console.log(htmlMap);
        resolve(htmlMap);
      }
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('click', mouseClickHandler, true);
    });
    const data = await selectTargetPromise;
    return data;
  };

  const selectTarget = async () => {
    console.log('selecting target');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectedFunction,
    });
    const [frameResult] = injectionResults;
    console.log(frameResult.result);
    setColumnTarget(frameResult.result as string);
  };

  const handleTypeChange = (event: TargetedEvent<HTMLSelectElement>) => {
    setColumnType(event.currentTarget.value as ColumnType['type']);
  };

  if (column === undefined) {
    return (
      <div className="flex flex-col gap-3 p-2">
        <h2 className="text-xl">Add Column</h2>
        <Select
          value={columnType}
          onChange={handleTypeChange}
          options={columnTypeOptions}
        />
        <Input
          placeholder={'Column Value'}
          value={columnVal}
          handleChange={setColumnVal}
        />
        {columnType === 'target' && (
          <Input placeholder={'Name'} value={columnName} handleChange={setColumnName} />
        )}
        {columnType === 'target' && <Button onClick={selectTarget}>Select Target</Button>}
        <Button onClick={addColumn}>Submit</Button>
        <Link to="/">Back home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-2">
      <h2 className="text-xl">Update Column</h2>
      <Input placeholder={'Name'} value={columnName} handleChange={setColumnName} />
      <Input placeholder={'Value'} value={columnVal} handleChange={setColumnVal} />
      <Select
        value={columnType}
        onChange={handleTypeChange}
        options={columnTypeOptions}
      />
      {columnType === 'target' && <Button onClick={selectTarget}>Select Target</Button>}
      <Button onClick={update}>Update</Button>
      <Button onClick={remove}>Delete</Button>
      <Link to="/">Back home</Link>
    </div>
  );
}
