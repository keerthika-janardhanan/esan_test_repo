import path from 'path';

// Define file paths
const jsonFilePath = path.resolve(__dirname, '../apirequest/invoicerequest.json');
const csvFilePath = path.join(__dirname, '../data/data.csv');

// Mapping of CSV headers to JSON keys
const csvToApiKeyMap: Record<string, string> = {
    "Invoice Number": "InvoiceNumber",
    "Invoice Amount": "InvoiceAmount",
    "Invoice Date": "InvoiceDate",
    "Business Unit": "BusinessUnit",
    "Supplier Name": "Supplier",
    "*Supplier Site": "SupplierSite",
    "Description": "Description",
    "Invoice Source": "InvoiceSource", //need to check the actual column name
};

// Function to read CSV and extract mapped test data
export async function doMapping(csvRow: Record<string, string>): Promise<Record<string, any>> {
    const apiPayload: Record<string, any> = {};
    for (const [csvKey, value] of Object.entries(csvRow)) {
        const apiKey = csvToApiKeyMap[csvKey];
        if (apiKey) {
            apiPayload[apiKey] = isNaN(Number(value)) ? value : Number(value);
        }
    }
    return apiPayload;
}