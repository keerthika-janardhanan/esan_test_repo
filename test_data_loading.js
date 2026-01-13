// Simple test to check data loading
const { readExcelData } = require('./util/csvFileManipulation.ts');
const path = require('path');

// Test data loading
const dataPath = path.join(__dirname, 'data', 'FNOL_claim_1.xlsx');
console.log('Testing data loading from:', dataPath);

try {
  // Test with different reference IDs
  const testIds = ['1001', '1,001', 'Id'];
  const testColumns = ['Id', 'ID', 'id'];
  
  for (const testId of testIds) {
    for (const testColumn of testColumns) {
      console.log(`\nTrying: testId="${testId}", column="${testColumn}"`);
      try {
        const result = readExcelData(dataPath, '', testId, testColumn);
        console.log('Result:', JSON.stringify(result));
        if (result && Object.keys(result).length > 0) {
          console.log('SUCCESS: Found data!');
          console.log('Keys in result:', Object.keys(result));
        }
      } catch (error) {
        console.log('Error:', error.message);
      }
    }
  }
} catch (error) {
  console.error('Failed to load data:', error.message);
}