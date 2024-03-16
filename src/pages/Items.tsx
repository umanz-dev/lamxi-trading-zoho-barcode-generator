import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import ItemsDataGrid from '../components/ItemsDataGrid'
import BulkActionsButton from '../components/BulkActionsButton'
import PrintBarcodeDialog from '../components/PrintBarcodeDialog'
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { BarcodeMetadata } from '../common/constants'

const data: any = [
    { id: 1, SKU: '17167', lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, SKU: '17167',  lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, SKU: '17167',  lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, SKU: '17167',  lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, SKU: '17167',  lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, SKU: '17167',  lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, SKU: '17167',  lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, SKU: '17167',  lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, SKU: '17167',  lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const Items = () => {
    const [selection, setSelection] = React.useState<GridRowSelectionModel>([]);
    const [openPrintBarcodeDialog, setOpenPrintBarcodeDialog] = React.useState<boolean>(false)
    const [barcodeMetadata, setBarcodeMetadata] = React.useState<BarcodeMetadata[]>([])

    useEffect(() => {
        const newBarcodeMetadata = selection.map((selectedId: any) => data.find((item: any) => item.id === selectedId))
            .map(({ id, firstName, SKU, lastName }: any) => {
                return {
                    id: id,
                    associatedField: "SKU",
                    value: SKU,
                    itemName: lastName,
                    quantity: 1
                }
            })
        setBarcodeMetadata(newBarcodeMetadata)
    }, [selection])

    return (
        <Box sx={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
            <BulkActionsButton selection={selection} setOpenPrintBarcodeDialog={setOpenPrintBarcodeDialog} />
            <ItemsDataGrid selection={selection} setSelection={setSelection} data={data} />
            <PrintBarcodeDialog openPrintBarcodeDialog={openPrintBarcodeDialog} setOpenPrintBarcodeDialog={setOpenPrintBarcodeDialog} barcodeMetadata={barcodeMetadata} setBarcodeMetadata={setBarcodeMetadata} />
        </Box>
    )
}

export default Items