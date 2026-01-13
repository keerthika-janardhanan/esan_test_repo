import zipfile
import xml.etree.ElementTree as ET
import tempfile
import os
import shutil

def fix_excel_datasheet_name(excel_path):
    """Fix DatasheetName in Excel file by removing 'data/' prefix"""
    
    # Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        # Extract the Excel file (which is a ZIP)
        with zipfile.ZipFile(excel_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        
        # Find and modify worksheet files
        worksheets_dir = os.path.join(temp_dir, 'xl', 'worksheets')
        if os.path.exists(worksheets_dir):
            for filename in os.listdir(worksheets_dir):
                if filename.endswith('.xml'):
                    filepath = os.path.join(worksheets_dir, filename)
                    
                    # Read the XML content
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Replace data/FNOL_claim.xlsx with FNOL_claim.xlsx
                    if 'data/FNOL_claim.xlsx' in content:
                        content = content.replace('data/FNOL_claim.xlsx', 'FNOL_claim.xlsx')
                        print(f"Fixed DatasheetName in {filename}")
                        
                        # Write back the modified content
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
        
        # Also check shared strings
        shared_strings_path = os.path.join(temp_dir, 'xl', 'sharedStrings.xml')
        if os.path.exists(shared_strings_path):
            with open(shared_strings_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'data/FNOL_claim.xlsx' in content:
                content = content.replace('data/FNOL_claim.xlsx', 'FNOL_claim.xlsx')
                print("Fixed DatasheetName in sharedStrings.xml")
                
                with open(shared_strings_path, 'w', encoding='utf-8') as f:
                    f.write(content)
        
        # Create new Excel file
        backup_path = excel_path + '.backup'
        shutil.copy2(excel_path, backup_path)
        print(f"Created backup: {backup_path}")
        
        with zipfile.ZipFile(excel_path, 'w', zipfile.ZIP_DEFLATED) as zip_ref:
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arc_name = os.path.relpath(file_path, temp_dir)
                    zip_ref.write(file_path, arc_name)
        
        print(f"Updated {excel_path}")

if __name__ == "__main__":
    fix_excel_datasheet_name('testmanager.xlsx')