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
}

export interface Barcode {
    itemName: string
    value: string
    rate: number
    mrp: number
}