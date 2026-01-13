import openpyxl

# Load the workbook
wb = openpyxl.load_workbook('testmanager.xlsx')
ws = wb.active

# Find and fix DatasheetName column
for row in ws.iter_rows():
    for cell in row:
        if cell.value == 'data/FNOL_claim.xlsx':
            print(f"Found 'data/FNOL_claim.xlsx' in cell {cell.coordinate}")
            cell.value = 'FNOL_claim.xlsx'
            print(f"Changed to 'FNOL_claim.xlsx'")

# Save the workbook
wb.save('testmanager.xlsx')
print("Testmanager.xlsx updated successfully")