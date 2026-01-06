import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as XLSX from 'xlsx';

const workbook = XLSX.readFile(path.join(__dirname, 'testmanager.xlsx'));
const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets[workbook.SheetNames[0]]);
console.log("row--------------------"+rows.length)
const enabled = rows.filter(r => r.Execute?.toLowerCase() === 'yes').map(r => r.TestCaseID);
console.log("Enable ------------"+ enabled)
const testDir = path.resolve(__dirname, 'tests');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.spec.ts'));

const toRun = files.filter(f => {
  const content = fs.readFileSync(path.join(testDir, f), 'utf-8');
  return enabled.some(name => content.includes(name));
});

if (toRun.length === 0) {
  console.log('No test files to run.');
  process.exit(0);
}

console.log('Running:', toRun.join(', '));
execSync(`npx playwright test ${toRun.map(f => `tests/${f}`).join(' ')}`, { stdio: 'inherit' });
