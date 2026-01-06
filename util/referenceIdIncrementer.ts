import * as path from "path";
import * as XLSX from "xlsx";

/**
 * Test cases that should have their ReferenceID incremented after completion
 */
const TARGET_TEST_CASES = [
  'TC_API_SUPPLIER_01',
  // 'Invoice creation UI', 
  // 'BulkAPISupplierCreation',
  // 'Invoice creation API',
];

/**
 * Extracts the numeric part from a ReferenceID and increments it
 * @param referenceID - The current ReferenceID (e.g., "Supplier__015", "Invoice__001")
 * @returns The incremented ReferenceID (e.g., "Supplier__016", "Invoice__002")
 */
function incrementReferenceId(referenceID: string | number): string {
  // Convert to string if it's a number
  const referenceIDStr = String(referenceID);
  
  // Handle multiple IDs separated by commas (for BulkAPISupplierCreation)
  if (referenceIDStr.includes(',')) {
    const ids = referenceIDStr.split(',').map(id => id.trim());
    const incrementValue = ids.length; // Increment each ID by the total count
    const incrementedIds = ids.map(id => incrementSingleIdByAmount(id, incrementValue));
    return incrementedIds.join(',');
  } else {
    return incrementSingleId(referenceIDStr);
  }
}

/**
 * Increments a single ReferenceID
 * @param referenceID - Single ReferenceID (e.g., "Supplier__015")
 * @returns Incremented ReferenceID (e.g., "Supplier__016")
 */
function incrementSingleId(referenceID: string): string {
  return incrementSingleIdByAmount(referenceID, 1);
}

/**
 * Increments a single ReferenceID by a specific amount
 * @param referenceID - Single ReferenceID (e.g., "Supplier__015")
 * @param incrementAmount - Amount to increment by
 * @returns Incremented ReferenceID (e.g., "Supplier__019" if incrementAmount is 4)
 */
function incrementSingleIdByAmount(referenceID: string, incrementAmount: number): string {
  // Extract the prefix and numeric part using regex
  const match = referenceID.match(/^(.+?)(\d+)$/);
  
  if (!match) {
    throw new Error(`❌ Invalid ReferenceID format: ${referenceID}. Expected format like 'Supplier__015' or 'Invoice__001'`);
  }
  
  const prefix = match[1]; // e.g., "Supplier__", "Invoice__"
  const currentNumber = parseInt(match[2], 10); // e.g., 15, 1
  const paddingLength = match[2].length; // e.g., 3, 3
  
  const newNumber = currentNumber + incrementAmount;
  const paddedNumber = newNumber.toString().padStart(paddingLength, '0');
  
  return prefix + paddedNumber;
}

/**
 * Updates the ReferenceID in testmanager.xlsx for a specific test case
 * @param testCaseID - The test case ID to update
 * @returns Promise<void>
 */
export async function incrementReferenceIdInTestManager(testCaseID: string): Promise<void> {
  // Check if this test case should have its ReferenceID incremented
  if (!TARGET_TEST_CASES.includes(testCaseID)) {
    console.log(`📝 [${testCaseID}] ReferenceID increment not required for this test case.`);
    return;
  }

  const testManagerPath = path.join(process.cwd(), "testmanager.xlsx");
  
  try {
    // Read the current workbook
    const workbook = XLSX.readFile(testManagerPath);
    const execSheet = workbook.Sheets["ExecutionPlan"];
    
    if (!execSheet) {
      throw new Error("❌ ExecutionPlan sheet not found in testmanager.xlsx");
    }
    
    // Convert to JSON for manipulation
    const executionRows: any[] = XLSX.utils.sheet_to_json(execSheet, { defval: "" });
    
    // Find the row for this test case
    const rowIndex = executionRows.findIndex(r => r.TestCaseID === testCaseID);
    
    if (rowIndex === -1) {
      throw new Error(`❌ Test case ${testCaseID} not found in ExecutionPlan`);
    }
    
    const currentRow = executionRows[rowIndex];
    const currentReferenceID = currentRow["ReferenceID"];
    
    if (!currentReferenceID) {
      throw new Error(`❌ ReferenceID not found for test case ${testCaseID}`);
    }
    
    // Increment the ReferenceID
    const newReferenceID = incrementReferenceId(currentReferenceID);
    
    console.log(`🔄 [${testCaseID}] Incrementing ReferenceID: ${currentReferenceID} → ${newReferenceID}`);
    
    // Update the row
    executionRows[rowIndex]["ReferenceID"] = newReferenceID;
    
    // Convert back to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(executionRows);
    
    // Replace the ExecutionPlan sheet
    workbook.Sheets["ExecutionPlan"] = newWorksheet;
    
    // Write back to file
    XLSX.writeFile(workbook, testManagerPath);
    
    console.log(`✅ [${testCaseID}] ReferenceID successfully updated to: ${newReferenceID}`);
    
  } catch (error) {
    console.error(`❌ [${testCaseID}] Failed to increment ReferenceID:`, error.message);
    throw error;
  }
}

/**
 * Checks if a test case should have its ReferenceID incremented
 * @param testCaseID - The test case ID to check
 * @returns boolean indicating if increment is required
 */
export function shouldIncrementReferenceId(testCaseID: string): boolean {
  return TARGET_TEST_CASES.includes(testCaseID);
}

/**
 * Preview what the incremented ReferenceID would be without actually updating the file
 * @param testCaseID - The test case ID to preview
 * @returns Promise<{current: string, incremented: string}> or null if test case not found
 */
export async function previewReferenceIdIncrement(testCaseID: string): Promise<{current: string, incremented: string} | null> {
  if (!TARGET_TEST_CASES.includes(testCaseID)) {
    return null;
  }

  const testManagerPath = path.join(process.cwd(), "testmanager.xlsx");
  const workbook = XLSX.readFile(testManagerPath);
  const execSheet = workbook.Sheets["ExecutionPlan"];
  const executionRows: any[] = XLSX.utils.sheet_to_json(execSheet, { defval: "" });
  
  const row = executionRows.find(r => r.TestCaseID === testCaseID);
  if (!row) return null;
  
  const currentReferenceID = row["ReferenceID"];
  const incrementedReferenceID = incrementReferenceId(currentReferenceID);
  
  return {
    current: currentReferenceID,
    incremented: incrementedReferenceID
  };
}
