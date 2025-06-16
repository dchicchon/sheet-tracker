import type { ValueRange } from './interfaces';

const endpoints = {
  discoveryEndpoint: 'https://sheets.googleapis.com/$discovery/rest?version"v4',
  driveFiles: `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)&spaces=drive`,
  testDrive: `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)&spaces=drive`,
  updateSheet:
    'https://sheets.googleapis.com/v4/spreadsheets/:spreadsheetId/values/:range',
};

export const getToken = async (interactive: boolean) => {
  const tokenResponse = await chrome.identity.getAuthToken({ interactive });
  return tokenResponse.token;
};

export interface paramsType {
  [key: string]: string;
}

function replacePathParams(url: string, params: paramsType) {
  return url.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    if (params[key] === undefined) {
      throw new Error(`Missing param: ${key}`);
    }
    return encodeURIComponent(params[key]);
  });
}
const generateFetchOptions = async (props?: RequestInit) => {
  const token = await getToken(false);
  const fetchOptions: RequestInit = {
    ...props,
    headers: {
      ...props?.headers,
      Authorization: `Bearer ${token}`,
    },
  };
  return fetchOptions;
};

export const getSheets = async () => {
  const fetchOptions = await generateFetchOptions();
  const response = await fetch(endpoints.testDrive, fetchOptions);
  const data = await response.json();
  return data.files;
};

export const updateSheet = async (id: string, updates: ValueRange) => {
  const params = {
    spreadsheetId: id,
    range: updates.range,
  };
  const url = new URL(replacePathParams(endpoints.updateSheet, params));
  url.searchParams.set('valueInputOption', 'USER_ENTERED');
  const fetchOptions = await generateFetchOptions({
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  const response = await fetch(url, fetchOptions);
  const data = await response.json();
  return data;
};
