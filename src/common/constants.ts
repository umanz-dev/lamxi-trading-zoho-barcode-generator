import { AlertColor } from "@mui/material";

export interface SnackbarAlert {
    severity: AlertColor
    message: string
}

export interface BarcodeMetadata {
    id: string
    associatedField: string
    value: string
    itemName: string
    quantity: number
    rate: number
    mrp?: number
    sku?: string
}

export interface Barcode {
    itemName: string
    value: string
    rate: number
    mrp?: number
    sizeLabel?: string
    sizeCode?: string
    age?: string
    uniqueCode?: string,
    sku?: string
}

export const APIConstants = {
    TOKEN: 'https://accounts.zoho.in/oauth/v2/token',
    BOOKS: 'https://www.zohoapis.in/books/v3',
    REDIRECT_URI: 'http://localhost:3000/zoho-barcode-generator/',
    // REDIRECT_URI: 'http://localhost:3000',
    AUTH: 'https://accounts.zoho.in/oauth/v2/auth',
    REFRESH: 'https://accounts.zoho.in/oauth/v2/auth/refresh'
}

export const envConstants = {
    CLIENT_ID: "1000.UQSZXUJKK4QOV266OYPAMSZFV9RCAG",
    ORGANIZATION_ID: "60017205211"
}

export const LogConstants = {
    LOGIN_PROMPT: "Please login to access the Items!",
    LOGIN_SUCCESS: "Successfully logged in!",
    FETCH_ITEMS_ERROR: "Something went wrong while fetching Items!",
    PRINT_BATCODES_ERROR: "Something went wrong while printing the Barcodes!"
}