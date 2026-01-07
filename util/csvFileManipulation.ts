
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import path from 'path';

// Lazy-load XLSX only when needed to make it optional
let XLSX: typeof import('xlsx') | null = null;

function loadXLSX() {
  if (!XLSX) {
    try {
      XLSX = require('xlsx');
    } catch (error) {
      throw new Error('xlsx package is required for Excel file operations. Install it with: npm install xlsx');
    }
  }
  return XLSX;
}

let testData: Record<string, any> = {};

export function readCSV(filePath: string) {
  const csvFile = fs.readFileSync(filePath);
  const records = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });
  return records;
}

export function retrievingTestDataForTests(testData: any, testcaseId: string,) {
  return testData.filter(testData => testData['InvoiceID'] === testcaseId)
}

export function retrievingTestDataForInvoice(testData: any, testcaseId: string) {
  return testData.filter(testData => testData['InvoiceID'] === testcaseId)
}

export function retrievingTestDataForHire(testData: any, testcaseId: string) {
  return testData.filter(testData => testData['TestId'] === testcaseId)
}

function storeTestData(data: any[]) {
  testData = Object.fromEntries(data.map(row => [row.TestId, row]));
}

export function readXlsmDataDynamic(filePath: string, sheetName: string, testcaseId: string, columnName: string) {
  const xlsx = loadXLSX();
  const workBook = xlsx.readFile(filePath, { bookVBA: true }); // Enable reading .xlsm files
  const sheet = sheetName || workBook.SheetNames[0];
  const workSheet = workBook.Sheets[sheet];

  // Convert the entire sheet to JSON without assuming headers
  const rawData = xlsx.utils.sheet_to_json(workSheet, { header: 1, defval: '' }); // `header: 1` returns a 2D array

  // Locate the header row dynamically
  let headerRowIndex = -1;
  let headers: string[] = [];
  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    if (Array.isArray(row) && row.includes(columnName)) {
      headerRowIndex = i;
      headers = row as string[];
      break;
    }
  }

  if (headerRowIndex === -1) {
    throw new Error(`Column "${columnName}" not found in the sheet.`);
  }

  // Extract data starting from the header row
  const data = xlsx.utils.sheet_to_json(workSheet, {
    defval: '',
    range: headerRowIndex, // Start reading from the header row
    header: headers, // Use the dynamically located headers
  });

  console.log(Array.isArray(data));
  return data.find((row: any) => row[columnName] == testcaseId);
}


//Reading data from excel sheet
export function readExcelData(filePath: string, sheetName: string, testcaseId: string, columnName: string) {
  const xlsx = loadXLSX();
  const workBook = xlsx.readFile(filePath);
  const sheet = sheetName || workBook.SheetNames[0];
  const workSheet = workBook.Sheets[sheet];
  const data = xlsx.utils.sheet_to_json(workSheet, { defval: '' });
  console.log(Array.isArray(data));
  return data.find((row: any) => row[columnName] == testcaseId);
}

// this returns all data that matches the testcaseId
export function readExcelDataLines(filePath: string, sheetName: string, testcaseId: string, columnName: string) {
  const xlsx = loadXLSX();
  const workBook = xlsx.readFile(filePath);
  const sheet = sheetName || workBook.SheetNames[0];
  const workSheet = workBook.Sheets[sheet];
  const data = xlsx.utils.sheet_to_json(workSheet, { defval: '' });
  console.log(Array.isArray(data));
  return data.filter((row: any) => row[columnName] == testcaseId);
}


export function getTestToRun(filePath: string) {
  const xlsx = loadXLSX();
  const workBook = xlsx.readFile(filePath);
  const sheet = workBook.SheetNames[0];
  const workSheet = workBook.Sheets[sheet];
  const testList = xlsx.utils.sheet_to_json(workSheet, { defval: '' });
  const enabledTests = testList.filter(r => r["Execute"] === 'Yes');
  return enabledTests;
}

export function getTestToRunNew(): string[] {
  try {
    const testManagerPath = path.join(__dirname, '../testmanager.xlsx');
    if (!fs.existsSync(testManagerPath)) {
      return [];
    }
    const xlsx = loadXLSX();
    const workBook = xlsx.readFile(testManagerPath);
    const sheet = workBook.SheetNames[0];
    const workSheet = workBook.Sheets[sheet];
    const testList = xlsx.utils.sheet_to_json(workSheet, { defval: '' });
    const enabledTestsNew = testList.filter(r => r["Execute"] === 'Yes').map(r => r["TestCaseID"]?.trim()).filter(Boolean);
    return enabledTestsNew;
  } catch (error) {
    console.warn('[shouldRun] Unable to load testmanager.xlsx:', error.message);
    return [];
  }
}



export function shouldRun(testCaseNAme: string): boolean {
  const enabledTests = getTestToRunNew();
  // If no tests are enabled (e.g., file doesn't exist or xlsx not installed), run all tests
  return enabledTests.length === 0 || enabledTests.includes(testCaseNAme);
}
